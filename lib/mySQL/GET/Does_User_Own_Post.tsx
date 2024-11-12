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
        }
    } catch(error:any) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.log("SQL Error when trying to figure out if user owns a post:",error)
        return {success: false, message: errorMessage,errno:error.errno}
    }

}

export default Does_User_Own_Post;