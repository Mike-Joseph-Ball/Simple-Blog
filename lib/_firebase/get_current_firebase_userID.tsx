'use client'

import firebase from 'firebase/compat/app'
import verify_Id_Token from '@/lib/_firebase/verify_id_token'

const CurrentFirebaseUserVerify = async () => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
        console.log("No current user is signed in.");
        return false;
    }

    try {
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
        const isValid = await verify_Id_Token(idToken);
        return isValid;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
}

export default CurrentFirebaseUserVerify;
