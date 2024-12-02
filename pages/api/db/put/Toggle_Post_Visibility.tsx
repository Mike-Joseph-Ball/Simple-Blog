import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'
import { RowDataPacket } from 'mysql2';

const Toggle_Post_Visibility = async (req: NextApiRequest, res : NextApiResponse) => {

    try {

    const {tokenId,Post_id} = req.body
    const decodedToken = await verify_id_token_helper(tokenId)
    if(!decodedToken) {
        return res.status(403).json({success:false,message:'forbidden'})
    }
    const user_email = decodedToken.email
    const db = await createConnection()

    const sqlRetrieve = 'SELECT Is_post_public FROM Posts WHERE Post_id = (?)'
    const [Is_post_public] = await db.query(sqlRetrieve,[Post_id])
    console.log("Is Post Public:",Is_post_public)
    //if(Is_post_public === 1) {

    //}

    //given a post ID, change the BIT for post visibility
    const sqlUpdate = `UPDATE Posts
    SET Blog_id = (?)
    WHERE Post_id = (?)`
    const [Update_visibility] = await db.query(sqlUpdate,[Post_id])
    res.status(200).json({success:true,res:Update_visibility})

    } catch (error:any) {
        res.status(500).json({success:false,error:error,errno:error.errno})
    }
    
}
 
export default Toggle_Post_Visibility;