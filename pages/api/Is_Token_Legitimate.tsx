//This is a server side component that uses the firebase SDK file downloaded from firebase console
//To check whether the user's client side JWT tokens are valid.
//This async function is called every time a page is loaded, and every time
//a database interaction occurs. 

//written following this documentation:
//https://firebase.google.com/docs/auth/admin/verify-id-tokens#web


//Need to initialize the Admin SDK with a service account to verify JWT
//https://firebase.google.com/docs/admin/setup#linux-or-macos

//We follow the 2nd article to set up admin SDK, and follow the 1st article to verify the
//JWT token is valid

// idToken comes from the client app

import { NextApiRequest, NextApiResponse } from "next";
import verify_id_token_helper from '@/lib/_firebase/server/Verify_Firebase_Auth_Helper'

//require imports are disabled by default, but this is how the documentation does it so I'm not going to do it differently
/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin");

const serviceAccount = {

  type: process.env.firebase_sdk_type,
  
  project_id: process.env.firebase_sdk_project_id,
  
  private_key_id: process.env.firebase_sdk_private_key_id,
  
  private_key: process.env.firebase_sdk_private_key,
  
  client_email: process.env.firebase_sdk_client_email,
  
  client_id: process.env.firebase_sdk_client_id,
  
  auth_uri: process.env.firebase_sdk_auth_uri,
  
  token_uri: process.env.firebase_sdk_token_uri,
  
  auth_provider_x509_cert_url: process.env.firebase_sdk_auth_provider_x509_cert_url,
  
  client_x509_cert_url: process.env.firebase_sdk_client_x509_cert_url,
  
  universe_domain: process.env.firebase_sdk_universe_domain
  
  };
/* eslint-enable @typescript-eslint/no-require-imports */

//make this an asynchronous function because verifying the token iidToken : strings an API call
const verify_id_token = async (req : NextApiRequest, res : NextApiResponse ) => {
  //This ensures that the app is only initialized once.

  if(admin.apps.length === 0)
  {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

  if(req.method != 'POST'){
    return res.status(405).json({error: "Method not allowed. Must be POST"})
  }
  const { idToken } = req.body;

  if(!idToken) {
    return res.status(400).json({error: "ID token is required"})
  }

  try {
    const decodedToken = await verify_id_token_helper(idToken);
    if(decodedToken){
      return res.status(200).json({success:true,uid:decodedToken})
    } else {
      return res.status(403).json({ success: false, error: 'Invalid ID Token' });
    }
  } catch(error) {
    console.error("Error verifying token: ",error)
    return res.status(403).json({ success: false, error: 'Invalid ID Token' });
  }


}

export default verify_id_token;
