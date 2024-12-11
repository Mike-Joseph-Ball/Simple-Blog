import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
//This allowed us to get the proper data type exported from mysql
import { RowDataPacket } from 'mysql2';
import { createPool } from '@/lib/db'
import  getBlogDetailsGivenBlogId  from '@/lib/mySQL/server_side/get/blog_details_given_blog_id'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

const Get_Most_Used_Blog = async (req:NextApiRequest,res:NextApiResponse) => {
    const { tokenId, user_email } = req.body

    const isIdTokenLegit = await verify_id_token_helper(tokenId)

    if(!isIdTokenLegit){
        return res.status(403).json({success:false,message:'forbidden'})
    }

    const db = await createPool.getConnection();

    try {
        
        const sqlBlogIds = 'SELECT Blog_id FROM Blogs WHERE user_email = (?)'
        let [blogResponse] = await db.query<RowDataPacket[]>(sqlBlogIds, [user_email])
        const blogIds = blogResponse.map(row => row.Blog_id);
        console.log("1st SQL query succeeded")
        
        //now that we have all the blog ids associated with the user, we can query
        //the posts table to find the blog with the most posts
        if(blogIds.length === 0) {
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

        //This is to check whether or not the user's blogs have any posts associated with them.
        //If the user has no posts associated with any of their blogs, postResponse will return an empty array
        if(!postResponse[0]) {
            //If this returns true, we need to use the most recently created blog_id to retrieve all those blog details
            //and return that blog, with a post_count of zero.

            //CALL SERVER SIDE UTILITY FUNCTION THAT GETS BLOG DETAILS GIVEN BLOG ID
            console.log('most recent blog id:',blogIds[blogIds.length -1])
            const blogDetails = await getBlogDetailsGivenBlogId(blogIds.length -1)

            //if the returned object is an error, throw it!
            if(blogDetails instanceof Error) {
                throw blogDetails
            }

            //Display the blogDetails
            console.log('blog details:',blogDetails)

            //CREATE BLOG RETURN STRUCTURE BY ADDING '0' POST COUNT AND RETURNING
            return res.status(200).json({success:true,most_used_blog:blogDetails,post_count:0})
        }

        const mostUsedBlogDetailsSql = 'SELECT * FROM Blogs WHERE blog_id = (?)'
        let [mostUsedBlog] = await db.query(mostUsedBlogDetailsSql,postResponse[0].Blog_id)


        console.log('3rd SQL query succeeded')
        console.log('most used blog:',mostUsedBlog)
        
        return res.status(200).json({success:true,most_used_blog:mostUsedBlog,post_count:postResponse[0].post_count})

        
    } catch(error:any) {
        console.log('Get_Most_Used_Blog SQL request failed: ',error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(400).json({success: false,message:errorMessage,errno:error.errno})
    } finally {
        db.release()
    }
}
 
export default Get_Most_Used_Blog;