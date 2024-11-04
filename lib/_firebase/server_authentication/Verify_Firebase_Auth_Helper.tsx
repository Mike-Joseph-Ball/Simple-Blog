/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin");
const serviceAccount = require('@/simple-blog-admin-sdk-key.json');
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