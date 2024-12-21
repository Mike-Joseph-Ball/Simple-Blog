import { createPool } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const Fetch_Blog_Given_Id = async (req:NextApiRequest,res:NextApiResponse) => {
    const db = await createPool.getConnection();

    try {
        const {tokenId,blogId} = req.body

        const decodedToken = await verify_id_token_helper(tokenId)
    
        if(!decodedToken) {
            return res.status(403).json({success:false,message:"forbidden"})
        }

        const sql = 'SELECT * FROM Blogs WHERE Blog_id = (?)'
        const [blogDetails] = await db.query(sql,[blogId])


        const sqlGetPostCount = `
        SELECT COUNT(*) AS post_count
        FROM Posts
        WHERE Blog_id=${blogId}
        ORDER BY post_count DESC
        LIMIT 1;
        `
        const [postCount] = await db.query(sqlGetPostCount,[blogId])

        return res.status(200).json({success:true,blogDetails:blogDetails,postCount:postCount})

    } catch(error) {
        return res.status(500).json({success:false,message:"internal server error",error:error})
    } finally {
        await db.release()
    }

    
}
 
export default Fetch_Blog_Given_Id;