import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'

const Fetch_Comments_Associated_With_Post = async(req:NextApiRequest,res:NextApiResponse) => {
    const {tokenId,postId} = req.body

    const decodedToken = await verify_id_token_helper(tokenId)
    //even if use does not own the post we still return comment details
    if(!decodedToken) {
        return res.status(403).json({success:false,message:'forbidden'})
    }

    try {
        const db = await createConnection()
        const sql = 'SELECT COUNT(*) AS commentCount FROM Comments WHERE Post_id=(?)'
        const [response] = await db.query(sql, [postId])
        return res.status(200).json({success:true,res:response})
    } catch(error:any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(400).json({success:false, message:errorMessage,errno:error.errno})
    }
}
 
export default Fetch_Comments_Associated_With_Post;