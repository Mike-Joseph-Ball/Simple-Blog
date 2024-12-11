import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
import { createPool } from '@/lib/db'
import { RowDataPacket } from 'mysql2';

interface PostRow extends RowDataPacket {
    Is_post_public: number; // Define the column 'Is_post_public' as a number (1 or 0)
}

const Toggle_Post_Visibility = async (req: NextApiRequest, res : NextApiResponse) => {
    
    const db = await createPool.getConnection();
    try {

    const {tokenId,Post_id} = req.body
    const decodedToken = await verify_id_token_helper(tokenId)
    if(!decodedToken) {
        return res.status(403).json({success:false,message:'forbidden'})
    }
    const sqlRetrieve = 'SELECT Is_post_public FROM Posts WHERE Post_id = (?)'
    const [rows] = await db.query<PostRow[]>(sqlRetrieve,[Post_id])
    let isPostPublicBuffer = rows[0].Is_post_public;
    console.log("Is Post Public:", isPostPublicBuffer);
    
    const isPostPublicBoolean = isPostPublicBuffer === 1;
    console.log('is post public boolean:',isPostPublicBoolean)

    //given a post ID, change the BIT for post visibility
    const sqlUpdate = `UPDATE Posts
    SET Is_post_public = (?)
    WHERE Post_id = (?)`
    const [Update_visibility] = await db.query(sqlUpdate,[!isPostPublicBoolean,Post_id])
    res.status(200).json({success:true,res:Update_visibility})

    } catch (error:any) {
        res.status(500).json({success:false,error:error,errno:error.errno})
    } finally {
        await db.release()
    }
    
}
 
export default Toggle_Post_Visibility;