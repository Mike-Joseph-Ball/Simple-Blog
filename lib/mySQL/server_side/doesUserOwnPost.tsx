import { createConnection } from '@/lib/db'

const doesUserOwnPost = async(userEmail:string,postId:string) => {

    const db = await createConnection()
    const sql = 'SELECT Post_id FROM Posts WHERE User_email=(?) AND Post_id=(?)'
    const [rows]: any = await db.query(sql,[userEmail,postId])
    console.log('rows:',rows)
    if(rows.length === 0) {
        return false
    } else {
        return true
    }
}
export default doesUserOwnPost