import { createPool } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from 'next'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const Fetch_Blog_Details_And_Posts = async (req: NextApiRequest, res:NextApiResponse) => {


    const {user_tokenId,blog_id} = req.body
    //console.log('Fetch Blog Details and Posts API called')
    //console.log('tokenId:',user_tokenId)
    //console.log('blog_id',blog_id)

    const decodedToken = await verify_id_token_helper(user_tokenId)

    if(!decodedToken) {
        return res.status(403).json({success:false,message:"forbidden"})
    }
    const db = await createPool.getConnection();

    try {
        if(blog_id) {
            //sql to grab all of the posts associated with a blog
            const sqlPosts = 'SELECT * FROM Posts WHERE Blog_id = (?)'
            const [associatedPosts] = await db.query(sqlPosts,[blog_id])
            return (res.status(200).json({success:true,associatedPosts:associatedPosts}))
        } else {
            const sqlPosts = 'SELECT * FROM Posts'
            const [associatedPosts] = await db.query(sqlPosts)
            return (res.status(200).json({success:true,associatedPosts:associatedPosts}))
        }

    } catch(error) {
        return (res.status(500).json({success:false,message:"internal server error",error:error}))
    } finally {
        await db.release()
    }
}
 
export default Fetch_Blog_Details_And_Posts;