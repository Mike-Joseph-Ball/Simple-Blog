import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'

const Create_Blog = async (req: NextApiRequest, res : NextApiResponse) => {

    const {user_tokenId,user_email,blog_title, comment_settings_default,blog_template_style} = req.body
    const isIdTokenLegit = await verify_id_token_helper(user_tokenId)

    if(isIdTokenLegit) {
        try {
            const db = await createConnection()
            const sql = 'INSERT INTO Blogs (user_email,blog_title,comment_settings_default,blog_template_style) VALUES (?, ?, ?, ?)'
            const [response] = await db.query(sql, [user_email,blog_title,comment_settings_default,blog_template_style])
            return(res.status(200).json({success:true, res:response}))
        } catch(error:any) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.log("SQL Error:",error)
            return res.status(400).json({success: false, message: errorMessage,errno:error.errno})
        }
    } else {
        return res.status(403).json({success:false, message: "forbidden"})
    }
}
 
export default Create_Blog;