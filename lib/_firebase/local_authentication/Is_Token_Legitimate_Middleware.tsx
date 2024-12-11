'use client'

import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useEffect, useState } from 'react';

const useCurrentFirebaseUserVerify = () => {
    const [isValid, setIsValid] = useState<boolean | null>(null); // State to store the validity of the user token
    const [user, isPending] = useLocalUserAuth();
    useEffect(() => {
        if (!isPending) {
            if (!user) {
                console.log("MIDDLEWARE: No current user is signed in.");
                setIsValid(false);
                return;
            }

            const verifyUser = async () => {
                try {
                    // Force refresh the token to get the latest one
                    const idToken = await user.getIdToken(true);
                    console.log("Token being sent for verification:", idToken);

                    const res = await fetch('/api/Is_Token_Legitimate', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ idToken })
                    });

                    const data = await res.json();
                    console.log("Server response:", data);
                    
                    if (res.ok && data.success) {
                        console.log("MIDDLEWARE: Server said token is valid.");
                        setIsValid(true); // Token is valid
                    } else {
                        console.log("MIDDLEWARE: Token is invalid.", data);
                        setIsValid(false); // Token is invalid
                    }
                } catch (error) {
                    console.error("Error verifying token:", error);
                    setIsValid(false);
                }
            };

            verifyUser(); // Call the verification function
        }
    }, [user, isPending]); // Add dependencies to the effect

    return { isValid, user };
};

export default useCurrentFirebaseUserVerify;
