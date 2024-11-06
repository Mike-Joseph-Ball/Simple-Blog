//This module first checks if the user's JWT Token is valid, and then it adds the user to the mySQL DB.
//This was written so that user's who signed up and were added to firebase were also added to the mySQL DB at the same time
import { createConnection } from '@/lib/db'
import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server_authentication/Verify_Firebase_Auth_Helper'
const Create_User = async (req : NextApiRequest, res : NextApiResponse) => {
    //For every single server-side interaction requested by the client, we need to verify their JWT token.
    //So their request body must contain all the data they want added to the DB
    //And also their token. 

    const { user_tokenId, user_email } = req.body
    //console.log('CREATE_USER: idToken:',user_tokenId)
    //console.log('CREATE_USER: email:',user_email)

    const isIdTokenLegit = await verify_id_token_helper(user_tokenId)

    if(isIdTokenLegit){
        try {
            const db = await createConnection();
            const sql = 'SELECT FROM UserAccounts WHERE email = (?)'
            const [response] = await db.query(sql, [user_email])
            return (res.status(200).json({success:true, res:response}));
        } catch(error: any) {
            console.error("SQL Error:", error);
        
            // Check if the error is an instance of a known SQL error class
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(400).json({ success: false, message: errorMessage,errno:error.errno });
        }
    } else {
        return res.status(403).json({success: false, message: "forbidden"})
    }
    
}
 
export default Create_User;