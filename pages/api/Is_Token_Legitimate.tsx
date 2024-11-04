//written following this documentation:
//https://firebase.google.com/docs/auth/admin/verify-id-tokens#web


//Need to initialize the Admin SDK with a service account to verify JWT
//https://firebase.google.com/docs/admin/setup#linux-or-macos

//We follow the 2nd article to set up admin SDK, and follow the 1st article to verify the
//JWT token is valid

// idToken comes from the client app

import { NextApiRequest, NextApiResponse } from "next";
/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin");
const serviceAccount = require('@/simple-blog-admin-sdk-key.json');
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

  const decodedToken = admin.auth().verifyIdToken(idToken)
  .then(() => {
    return res.status(200).json({success: true,uid: decodedToken.uid})
  })
  .catch((error : Error) => {
    console.log("Error verifying token: ",error)
    return res.status(403).json({success: false,error:'Ivalid ID Token'})
  });
}

export default verify_id_token;
