'use client'

import { auth } from '@/lib/_firebase/config'

const CurrentFirebaseUserVerify = async () : Promise<boolean> => {

    const currentUser = auth.currentUser;

    if (!currentUser) {
        console.log("No current user is signed in.");
        return false;
    }

    try {
        const idToken = await currentUser.getIdToken(/* forceRefresh */ true);
        
        const res = await fetch('/api/verify_id_token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({idToken})
        })

        const data = await res.json()
        if(res.ok) {
            return data.success;
        } else {
            console.log("Response is invalid:",res)
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
    return false;
}

export default CurrentFirebaseUserVerify;
