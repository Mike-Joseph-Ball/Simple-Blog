import { NextApiRequest, NextApiResponse } from "next";
import { createPool } from '@/lib/db'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const createPost = async(req: NextApiRequest,res:NextApiResponse) => {
    const {tokenId,blogId} = req.body
    const decodedToken = await verify_id_token_helper(tokenId)
    const user_email = decodedToken.email

    if(decodedToken) {
        const db = await createPool.getConnection();
        try {
            const sql = 'INSERT INTO Posts (Post_title,Post_content,User_email,Blog_id) VALUES (?, ?, ?, ?)'
            const [response] = await db.query(sql, ['untitled','',user_email,blogId])
            return res.status(200).json({success:true,res:response})
        } catch(error) {
            console.log('error inserting into posts:',error)
            return res.status(500).json({success:false,error:error})
        } finally {
            await db.release()
        }
    } else {
        return res.status(403).json({success:false,message:'forbidden'})
    }
}
 
export default createPost;