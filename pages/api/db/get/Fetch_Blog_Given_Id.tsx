import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'

const Fetch_Blog_Given_Id = async (req:NextApiRequest,res:NextApiResponse) => {
    try {
        const {tokenId,blogId} = req.body

        const decodedToken = await verify_id_token_helper(tokenId)
    
        if(!decodedToken) {
            return res.status(403).json({success:false,message:"forbidden"})
        }

        const db = await createConnection()
        const sql = 'SELECT * FROM Blogs WHERE Blog_id = (?)'
        const [response] = await db.query(sql,[blogId])
        return res.status(200).json({success:true,res:response})

    } catch(error) {
        return res.status(500).json({success:false,message:"internal server error",error:error})
    }

    
}
 
export default Fetch_Blog_Given_Id;