import { createPool } from '@/lib/db'

const getBlogDetailsGivenBlogId = async (blogId:number) => {
    const db = await createPool.getConnection();
    try {
        const sql = 'SELECT * FROM Blogs WHERE Blog_id = (?)'
        const [blogDetails] = await db.query(sql,[blogId])
        return blogDetails
    } catch(error) {
        if (error instanceof Error) {
            return error
        } else {
            throw new Error(String(error))
        }
        
    } finally {
        await db.release()
    }

}
 
export default getBlogDetailsGivenBlogId;