/* UNUSED MODULE. USERS JUST BEING IN FIREBASE IS PERFECTLY FINE, NO NEED TO ADD THEM TO MYSQL AS OF NOW */

//This module first checks if the user's JWT Token is valid, and then it adds the user to the mySQL DB.
//This was written so that user's who signed up and were added to firebase were also added to the mySQL DB at the same time

import { NextApiRequest, NextApiResponse } from "next";
import { createPool } from '@/lib/db'
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'
const Create_User = async (req : NextApiRequest, res : NextApiResponse) => {
    //For every single server-side interaction requested by the client, we need to verify their JWT token.
    //So their request body must contain all the data they want added to the DB
    //And also their token. 

    const { user_tokenId } = req.body
    //console.log('CREATE_USER: idToken:',user_tokenId)
    //console.log('CREATE_USER: email:',user_email)

    const decodedToken = await verify_id_token_helper(user_tokenId)
    const user_email = decodedToken.email;

    if(decodedToken){
        const db = await createPool.getConnection();
        try {
            const sql = 'INSERT INTO UserAccounts (User_email) VALUES (?)'
            const [response] = await db.query(sql, [user_email])
            return (res.status(200).json({success:true, res:response}));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(error: any) {
            console.error("SQL Error:", error);
        
            // Check if the error is an instance of a known SQL error class
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return res.status(400).json({ success: false, message: errorMessage,errno:error.errno });
        } finally {
            await db.release()
        }
    } else {
        return res.status(403).json({success: false, message: "forbidden"})
    }
    
}
 
export default Create_User;