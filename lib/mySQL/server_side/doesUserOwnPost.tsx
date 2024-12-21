import { createPool } from '@/lib/db'

const doesUserOwnPost = async(userEmail:string,postId:string) => {

    const db = await createPool.getConnection();
    try {
        const sql = 'SELECT Post_id FROM Posts WHERE User_email=(?) AND Post_id=(?)'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [rows]: any = await db.query(sql,[userEmail,postId])
        console.log('rows:',rows)
        if(rows.length === 0) {
            return false
        } else {
            return true
        }
    } catch(error) {
        return error
    } finally {
        await db.release()
    }

}
export default doesUserOwnPost