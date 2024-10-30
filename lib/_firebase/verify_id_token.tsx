//written following this documentation:
//https://firebase.google.com/docs/auth/admin/verify-id-tokens#web


//Need to initialize the Admin SDK with a service account to verify JWT
//https://firebase.google.com/docs/admin/setup#linux-or-macos

//We follow the 2nd article to set up admin SDK, and follow the 1st article to verify the
//JWT token is valid

// idToken comes from the client app
import { getAuth } from 'firebase/auth'


//make this an asynchronous function because verifying the token is an API call
const verify_Id_Token = async (idToken : any) => {
  var admin = require("firebase-admin");
  var serviceAccount = require("/home/mike/Documents/notion-clone/_firebase_SDK/simple-blog-admin-sdk-key.json");


  admin.initializeApp({

    credential: admin.credential.cert(serviceAccount)

  });

  const decoded_token = await admin.getAuth().verifyIdToken(idToken)
  .then((decodedToken : any) => {
    const uid = decodedToken.uid;
    
    
    return true;
  })
  .catch((error : Error) => {
    console.log("Error: ",error)
    return false;
  });
  return (false);
}

export default verify_Id_Token;
