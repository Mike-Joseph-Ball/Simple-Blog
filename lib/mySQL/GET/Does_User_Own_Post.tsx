import { createConnection } from '@/lib/db'

async function Does_User_Own_Post(userEmail:string,postId:number) {
    //we can assume the user token was already verified
    //Query the database to see if the user owns the post

    try {
        const db = await createConnection()
        const sql = 'SELECT * FROM Posts WHERE User_email = (?)'
        const [response] = await db.query(sql, [userEmail])
        if(response)
        {
            console.log("Does User Own Post Query:",response)
            return {success: true, message:'User owns the post they are trying to edit'}
        } else {
            return {success: false, message: 'User does not own the post they are trying to edit'}
        }
    } catch(error:any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.log("SQL Error when trying to figure out if user owns a post:",error)
        return {success: false, message: errorMessage,errno:error.errno}
    }

}

export default Does_User_Own_Post;