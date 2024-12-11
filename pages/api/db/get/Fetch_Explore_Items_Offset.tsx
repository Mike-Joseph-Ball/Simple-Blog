import { createPool } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const Fetch_Explore_Items_Offset = async(req:NextApiRequest,res:NextApiResponse) => {
    //exploreItem should be either "Blogs,Posts"
    const {tokenId,exploreItem,currentPage,searchQuery} = req.body

    const decodedToken = await verify_id_token_helper(tokenId)

    if(!decodedToken) {
        return res.status(403).json({success:false,message:"forbidden"})
    }

    if(exploreItem === 'Users') {
        //grab the list of users from firebase (Get_All_Users.tsx) given a certain search and at a certain offset
        //This implementation is a bit more complicated
        return
    }

    const sqlSearchString = `%${searchQuery}%`; // Wildcards on both sides of the string

    const db = await createPool.getConnection()

    try {
        if(exploreItem==='Blogs') {
            const itemsPerPage = 10
            const offset = (currentPage-1) * itemsPerPage
            const sql = 'SELECT * FROM Blogs LIMIT ? OFFSET ?'
            const [response] = await db.query(sql,[itemsPerPage,offset])
            return res.status(200).json({success:true,res:response})
        } else if(exploreItem==='Posts') {
            const itemsPerPage = 10
            const offset = (currentPage-1) * itemsPerPage
            const sql = 'SELECT * FROM Posts WHERE Is_post_public=1 AND Post_title LIKE ? LIMIT ? OFFSET ?'
            const [response] = await db.query(sql,[sqlSearchString,itemsPerPage,offset])
            return res.status(200).json({success:true,res:response})
        } else {
            throw new Error('exploreItem is unexpected value')
        }

    } catch(error) {
        return res.status(500).json({success:false,res:error})
    } finally {
        db.release()
    }
}
 
export default Fetch_Explore_Items_Offset;