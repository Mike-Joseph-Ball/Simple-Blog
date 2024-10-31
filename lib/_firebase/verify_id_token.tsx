//written following this documentation:
//https://firebase.google.com/docs/auth/admin/verify-id-tokens#web


//Need to initialize the Admin SDK with a service account to verify JWT
//https://firebase.google.com/docs/admin/setup#linux-or-macos

//We follow the 2nd article to set up admin SDK, and follow the 1st article to verify the
//JWT token is valid

// idToken comes from the client app


//make this an asynchronous function because verifying the token is an API call
const verify_Id_Token = async (idToken : string) => {
  
  /* eslint-disable @typescript-eslint/no-require-imports */
  const admin = require("firebase-admin");
  const serviceAccount = require("/home/mike/Documents/notion-clone/_firebase_SDK/simple-blog-admin-sdk-key.json");
  /* eslint-enable @typescript-eslint/no-require-imports */


  admin.initializeApp({

    credential: admin.credential.cert(serviceAccount)

  });

  await admin.getAuth().verifyIdToken(idToken)
  .then(() => {
    //const uid = decodedToken.uid;
    
    
    return true;
  })
  .catch((error : Error) => {
    console.log("Error: ",error)
    return false;
  });
  return (false);
}

export default verify_Id_Token;
