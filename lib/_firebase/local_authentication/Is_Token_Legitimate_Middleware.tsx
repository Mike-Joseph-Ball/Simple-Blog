'use client'

import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useEffect, useState } from 'react';

const useCurrentFirebaseUserVerify = () => {
    const [isValid, setIsValid] = useState<boolean | null>(null); // State to store the validity of the user token
    const [user, isPending] = useLocalUserAuth();

    // Check if there is a user
    useEffect(() => {
        if (!isPending) {
            if (!user) {
                console.log("MIDDLEWARE: No current user is signed in.");
                setIsValid(false);
                return;
            }

            const verifyUser = async () => {
                try {
                    const idToken = await user.getIdToken(true); // Force refresh the token

                    const res = await fetch('/api/Is_Token_Legitimate', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ idToken })
                    });

                    const data = await res.json();
                    if (res.ok) {
                        console.log("MIDDLEWARE: server said token is valid. returning true.");
                        setIsValid(data.success); // Set validity based on server response
                    } else {
                        console.log("Response is invalid:", res);
                        setIsValid(false);
                    }
                } catch (error) {
                    console.error("Error verifying token:", error);
                    setIsValid(false);
                }
            };

            verifyUser(); // Call the verification function
        }
    }, [user, isPending]); // Add dependencies to the effect

    return isValid; // Return the validity of the user token
};

export default useCurrentFirebaseUserVerify;
