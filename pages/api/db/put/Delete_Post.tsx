import { NextApiRequest, NextApiResponse } from "next";
import { createPool } from '@/lib/db'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
import doesUserOwnPost from "@/lib/mySQL/server_side/doesUserOwnPost";
const Delete_Post = async(req: NextApiRequest,res:NextApiResponse) => {
    const {tokenId,postId} = req.body
    const db = await createPool.getConnection();
    try {
        const decodedToken = await verify_id_token_helper(tokenId)
        if(!decodedToken) {
            return res.status(403).json({success:false,message:'forbidden'})
        }

        const user_email = decodedToken.email

        const ownPost = await doesUserOwnPost(user_email,postId)

        if(!ownPost) {
            return res.status(403).json({success:false,message:'forbidden'})
        }

        //now that we know the user is legitimate, and that they own the post they are trying to delete, we can delete the post
        const sql = 'DELETE FROM Posts WHERE Post_id=(?)'
        const [response] = await db.query(sql,[postId])
        return res.status(200).json({success:true,res:response})
    } catch(error) {
        console.log('Delete Post Error:',error)
        return res.status(500).json({success:false,error:error})
    } finally {
        db.release()
    }

    
    



    //check if user owns post
}
 
export default Delete_Post