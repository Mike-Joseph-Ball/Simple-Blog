import { createConnection } from '@/lib/db'

const getBlogDetailsGivenBlogId = async (blogId:number) => {
    try {
        const db:any = await createConnection()
        const sql = 'SELECT * FROM Blogs WHERE Blog_id = (?)'
        const [blogDetails] = await db.query(sql,[blogId])
        return blogDetails
    } catch(error) {
        if (error instanceof Error) {
            return error
        } else {
            throw new Error(String(error))
        }
        
    }

}
 
export default getBlogDetailsGivenBlogId;