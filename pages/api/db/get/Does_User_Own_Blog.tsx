import { createPool } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
const Does_User_Own_Post = async(req: NextApiRequest, res: NextApiResponse) => {
    const db = await createPool.getConnection();
    try {

        const {tokenId,blogId} = req.body
        const decodedToken = await verify_id_token_helper(tokenId)
        if(!decodedToken) {
            res.status(403).json({success:false,message:"forbidden"})
        }
        const user_email = decodedToken.email

        const sql = 'SELECT Blog_id FROM Blogs WHERE user_email=(?) AND Blog_id=(?)'
        const [response] = await db.query(sql, [user_email,blogId])
        if(Array.isArray(response) && response.length === 0) {
            return(res.status(201).json({success:true,ownBlog:false}))
        } else {
            return(res.status(200).json({success:true,ownBlog:true}))
        }
        //return(res.status(200).json({success:true,res:response}))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error:any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return(res.status(400).json({success:false,message:errorMessage,errno:error.errno}))
    } finally {
        await db.release()
    }
}
 
export default Does_User_Own_Post;