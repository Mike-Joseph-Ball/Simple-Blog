import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
import { RowDataPacket } from 'mysql2';
import { createPool } from '@/lib/db'

const Update_Post = async (req : NextApiRequest, res : NextApiResponse) => {
    const db = await createPool.getConnection();
    try {
        const { tokenId,Post_id,Post_title,Post_content } = req.body
        //console.log('tokenId:',tokenId)
        //1. Verify the user's token is valid
        const decodedToken = await verify_id_token_helper(tokenId)
        if(!decodedToken) {
            return res.status(403).json({success:false,message:'forbidden'})
        }
        const user_email = decodedToken.email;

        //2.Verify the user owns the post
        const sqlVerify = 'SELECT post_id FROM Posts WHERE User_email = (?)'
        const [responseVerify] = await db.query<RowDataPacket[]>(sqlVerify,[user_email])
        
        if(responseVerify.length === 0) {
            return res.status(400).json({success:false,message:"This post does not belong to the requesting user"})
        }
    
    
        //3.Update the post
        const sqlUpdate = `
        UPDATE Posts 
        SET Post_title = (?), Post_content = (?)
        WHERE Post_id = (?)
        `
        const [responseUpdate] = await db.query(sqlUpdate,[Post_title,Post_content,Post_id])
    
        return res.status(200).json({success:true,message:'successfully updated post to reflect post details',res:responseUpdate})

    } catch(error) {
        return res.status(500).json({success:false,message:'Unknown internal server error',error:error})
    } finally {
        await db.release()
    }
    


}
 
export default Update_Post;