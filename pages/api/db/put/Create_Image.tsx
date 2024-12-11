import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
import Does_User_Own_Post_Middleware from '@/lib/mySQL/client_side/GET/Does_User_Own_Post_Middleware'
import formidable from 'formidable';
import Add_Image_To_S3_Bucket from '@/lib/AWS/Add_Image_To_S3_Bucket'
import fs from 'fs';
import { ResultSetHeader } from 'mysql2';
import  doesUserOwnPost  from '@/lib/mySQL/server_side/doesUserOwnPost'
import { createPool } from '@/lib/db'

//Turning off the nextjs bodyParser allowed for the formidable parser to work in this module.
//Before this config statement, the form parser was stuck in an infinity loop.
export const config = {
    api: {
      bodyParser: false,
    },
  };


const Create_Image = async (req: NextApiRequest, res : NextApiResponse) => {
    const db = await createPool.getConnection();
    try {
        //First thing's first, we are going to parse the form data to get all the fields, including the file data.
        if (req.method != 'POST') {
            return res.status(400).json({message: 'request method needs to be POST'})
          }
          //const form = new formidable.IncomingForm();


        const parseForm = (req:NextApiRequest) => {
            console.log("made it into parseForm")
            return new Promise((resolve,reject) => {
                // Instantiate form directly
                console.log("made it into promise")
                const form = formidable({})

                form.parse(req, async (err, fields, files) => {
                    console.log("Made it into parser.")
                    if (err){
                        console.log('Formidable error:',err)
                        reject(err);
                    } else {
                        console.log("Formidable parsed fields:", fields);
                        console.log("Formidable parsed files:", files);
                        resolve({ fields, files });
                    }
                })

            })
        }
        console.log('before parseForm')
        const { fields, files } = await parseForm(req) as { fields: formidable.Fields, files: formidable.Files };
        console.log('after parseform')
        //after parsing the form data, we are going to extract all of the fields and convert them
        //to their proper data types to be added to the S3 bucket
        const userToken = req.headers.authorization?.split(' ')[1];
        const postId = Array.isArray(fields.postId) ? +(fields.postId[0]) : undefined;
        const file = Array.isArray(files.file) ? files.file[0] : files.file;
        const filename = Array.isArray(fields.filename) ? fields.filename[0]:undefined
        if(!userToken){
            return res.status(403).json({success:false,message:'forbidden'})
        }
        const decodedToken = await verify_id_token_helper(userToken);
        //console.log("user token: ",userToken)
        //console.log("Decoded Token Post Authentication: ",decodedToken)
        // Check if the user owns the post
        if(!postId){
            return res.status(400).json({success:false,message:"malformed: missing or malformed postId"})
        }

        const userOwnPost = await doesUserOwnPost(decodedToken.email, postId.toString());
        
        if (!userOwnPost) {
            console.log("The user does not own the post");
            throw new Error('The user does not own the post');
        }

        /* add the user to the mySQL DB */
        const sql = 'INSERT INTO Images (Post_id, Image_filename) VALUES (?, ?)';
        const [response] = await db.query<ResultSetHeader>(sql, [postId, filename]);

        if(file && response.insertId)
            {
                //We need to get the unique image identifier before adding the image to the S3 bucket. We can do this
                //By adding the image to the mySQL DB and recieving it's incremeting primary key.
                //we have to add it to the images table, and also the users_images table.
                const fileBinaryData = fs.readFileSync(file.filepath); // returns a Buffer
                const public_url = await Add_Image_To_S3_Bucket(fileBinaryData,response.insertId.toString())
                console.log("Add_Image_To_S3_Bucket result:",public_url)
                return res.status(200).json({ success: true, 'file': {url:public_url} });
            } else {
                throw new Error('file missing when tried to upload to S3 bucket')
            }
    } catch (error: any) {
        // Check if the error has an SQL `errno` property
        if (error.errno) {
            console.log("SQL Error:", error);
            return res.status(400).json({ success: false, message: error.sqlMessage, errno: error.errno });
        } else if (error instanceof Error) {
            console.log("General Error:", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    } finally {
        db.release()
    }
    /* finsish adding user to mySQL DB */
};

export default Create_Image;