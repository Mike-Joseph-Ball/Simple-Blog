import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import { createPool } from '@/lib/db'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const Create_Comment = async (req:NextApiRequest,res:NextApiResponse) => {
    const {tokenId,postId,commentContents} = req.body
    const decodedToken = await verify_id_token_helper(tokenId)
    const user_email = decodedToken.email

    if(!decodedToken) {
        return res.status(403).json({success:false,message:'forbidden'})
    }

    const db = await createPool.getConnection();
    try {
        const sql = 'INSERT INTO Comments (Comment_content,User_email,Post_id) VALUES (?,?,?)'
        const [response] = await db.query(sql,[commentContents,user_email,postId])
        return res.status(200).json({success:true,res:response})
    } catch(error) {
        console.log('error creating comment:',error)
        return res.status(500).json({success:false,error:error})
    } finally {
        await db.release()
    }
}
 
export default Create_Comment;