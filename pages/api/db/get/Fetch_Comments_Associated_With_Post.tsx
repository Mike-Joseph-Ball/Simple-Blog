import { createPool } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const Fetch_Comments_Associated_With_Post = async(req:NextApiRequest,res:NextApiResponse) => {
    const {tokenId,postId,currentPage} = req.body

    const decodedToken = await verify_id_token_helper(tokenId)
    //even if use does not own the post we still return comment details
    if(!decodedToken) {
        return res.status(403).json({success:false,message:'forbidden'})
    }

    const db = await createPool.getConnection();

    try {
        const commentsPerPage = 10; // Number of comments per page
        const offset = (currentPage - 1) * commentsPerPage; // Calculate the offset
        const sql = 'SELECT * FROM Comments WHERE Post_id=(?) LIMIT ? OFFSET ?'
        const [response] = await db.query(sql, [postId,commentsPerPage,offset])
        return res.status(200).json({success:true,res:response})
    } catch(error:any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(400).json({success:false, message:errorMessage,errno:error.errno})
    } finally {
        await db.release()
    }
}
 
export default Fetch_Comments_Associated_With_Post;