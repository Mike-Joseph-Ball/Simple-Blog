import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";

const Create_User = async (req : NextApiRequest, res : NextApiResponse) => {
    const { user_email } = req.body

    try {
        const db = await createConnection();
        const sql = 'INSERT INTO UserAccounts (User_email) VALUES (?)'
        const [response] = await db.query(sql, [user_email])
        return (res.status(200).json({success:true, res:response}));
    } catch(error) {
        console.log(error)
        // The type declaration syntax used here is different because we aren't
        //declaring the variable. This is a variable returned by the try catch 
        //block
        return res.status(400).json({error: (error as Error).message})
    }
}
 
export default Create_User;