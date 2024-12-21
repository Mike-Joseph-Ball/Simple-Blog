import { createPool } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
//import { DevBundlerService } from 'next/dist/server/lib/dev-bundler-service';
//import { RowDataPacket } from 'mysql2';


const Fetch_Count_Explore_Items = async(req:NextApiRequest,res:NextApiResponse) => {
    const {tokenId,exploreItem} = req.body
    console.log('exploreItem:',exploreItem)

    const decodedToken = await verify_id_token_helper(tokenId)

    if(!decodedToken) {
        return res.status(403).json({success:false,message:"forbidden"})
    }

    if(exploreItem === 'Users') {
        //returns the total user count of users from firebase (Get_All_Users.tsx)
        //This implementation is a bit more complicated. We'll leave it for future mike
        return
    }

    const db = await createPool.getConnection();

    try {
        const sql = 'SELECT COUNT(*) AS itemCount FROM (?)'
        const [response] = await db.query(sql,[exploreItem])
        return res.status(200).json({success:true,res:response})
    } catch(error) {
        return res.status(500).json({success:false,message:error})
    } finally {
        await db.release()
    }
}
 
export default Fetch_Count_Explore_Items;
