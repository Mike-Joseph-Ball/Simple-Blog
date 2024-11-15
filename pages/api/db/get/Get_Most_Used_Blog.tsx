import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from 'mysql2';
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'

const Get_Most_Used_Blog = async (req:NextApiRequest,res:NextApiResponse) => {
    const { tokenId, user_email } = req.body

    const isIdTokenLegit = await verify_id_token_helper(tokenId)

    if(!isIdTokenLegit){
        return res.status(403).json({success:false,message:'forbidden'})
    }

    try {
        
        const db = await createConnection()
        const sqlBlogIds = 'SELECT Blog_id FROM Blogs WHERE user_email = (?)'
        let [blogResponse] = await db.query<RowDataPacket[]>(sqlBlogIds, [user_email])
        const blogIds = blogResponse.map(row => row.Blog_id);
        console.log("1st SQL query succeeded")
        
        //now that we have all the blog ids associated with the user, we can query
        //the posts table to find the blog with the most posts
        if(blogIds.length == 0) {
            return res.status(201).json({success:true,message:'user has no blogs'})
        }
        console.log('blog ids:',blogIds)
        const sqlBlogWithMostPosts = `
            SELECT Blog_id, COUNT(*) AS post_count
            FROM Posts
            WHERE Blog_id IN (?)
            GROUP BY Blog_id
            ORDER BY post_count DESC
            LIMIT 1;
        `
        let [postResponse] = await db.query<RowDataPacket[]>(sqlBlogWithMostPosts, [blogIds])
        console.log("2nd SQL query succeeded")
        console.log('post response:',postResponse)

        const mostUsedBlogDetailsSql = 'SELECT * FROM Blogs WHERE blog_id = (?)'
        let [mostUsedBlog] = await db.query(mostUsedBlogDetailsSql,postResponse[0].Blog_id)
        console.log('3rd SQL query succeeded')
        console.log('most used blog:',mostUsedBlog)
        
        return res.status(200).json({success:true,most_used_blog:mostUsedBlog,post_count:postResponse[0].post_count})

        
    } catch(error:any) {
        console.log('Get_Most_Used_Blog SQL request failed: ',error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(400).json({success: false,message:errorMessage,errno:error.errno})
    }
}
 
export default Get_Most_Used_Blog;