import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'
const Create_User = async (req : NextApiRequest, res : NextApiResponse) => {
    //For every single server-side interaction requested by the client, we need to verify their JWT token.
    //So their request body must contain all the data they want added to the DB
    //And also their token. 

    const { user_tokenId, user_email } = req.body
    console.log('CREATE_USER: idToken:',user_tokenId)
    console.log('CREATE_USER: email:',user_email)

    const isIdTokenLegit = await verify_id_token_helper(user_tokenId)

    if(isIdTokenLegit){
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
    } else {
        return res.status(403).json({error: "forbidden"})
    }
    
}
 
export default Create_User;