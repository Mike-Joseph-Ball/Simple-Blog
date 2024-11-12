import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'
import Does_User_Own_Post from '@/lib/mySQL/GET/Does_User_Own_Post'
import formidable from 'formidable';
import Add_Image_To_S3_Bucket from '@/lib/AWS/Add_Image_To_S3_Bucket'
import fs from 'fs';
import { ResultSetHeader } from 'mysql2';


const Create_Image = async (req: NextApiRequest, res : NextApiResponse) => {
    try {
        //First thing's first, we are going to parse the form data to get all the fields, including the file data.
        if (req.method != 'POST') {
            return res.status(400).json({message: 'request method needs to be POST'})
          }
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).json({ error: 'Error parsing form data' });
            }
            

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
            // Check if the user owns the post
            if(!postId){
                return res.status(400).json({success:false,message:"malformed: missing or malformed postId"})
            }

            const doesUserOwnPost = await Does_User_Own_Post(decodedToken.email, postId);
            
            if (!doesUserOwnPost) {
                console.log("The user does not own the post");
                throw new Error('The user does not own the post');
            }

            if(file)
                {
                  //We need to get the unique image identifier before adding the image to the S3 bucket. We can do this
                  //By adding the image to the mySQL DB and recieving it's incremeting primary key.
                  //we have to add it to the images table, and also the users_images table.
                  const fileBinaryData = fs.readFileSync(file.filepath); // returns a Buffer
                  const result = await Add_Image_To_S3_Bucket(fileBinaryData)
                  console.log("Add_Image_To_S3_Bucket result:",result)
                } else {
                    throw new Error('file missing when tried to upload to S3 bucket')
                }
            /* add the user to the mySQL DB */
            const db = await createConnection();
            const sql = 'INSERT INTO Images (Post_id, Image_filename) VALUES (?, ?)';
            const [response] = await db.query<ResultSetHeader>(sql, [postId, filename]);
            return res.status(200).json({ success: true, res: response, url:`${process.env.ABSOLUTE_URL}/api/image_url_endpoint/${response.insertId}`});
            })
    } catch (error: any) {
        // Check if the error has an SQL `errno` property
        if (error.errno) {
            console.log("SQL Error:", error);
            return res.status(400).json({ success: false, message: error.sqlMessage, errno: error.errno });
        } else if (error instanceof Error) {
            console.log("General Error:", error.message);
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    /* finsish adding user to mySQL DB */
};

export default Create_Image;