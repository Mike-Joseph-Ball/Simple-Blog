//This is a server side module designed to find out whether a user's JWT token is valid.
//This module is currently being called by the API endpoint Is_Token_Legitimate,
//And is also called by the create_user server side component.

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

const verify_id_token_helper = async(idToken: string) => {

    if(admin.apps.length === 0){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("success! IdToken Verified");
        console.log("DecodedToken:", decodedToken); // This will now be the actual token data
        return decodedToken;
    } catch (error) {
        console.log("Error Verifying token:", error);
        return false;
    }
}
export default verify_id_token_helper