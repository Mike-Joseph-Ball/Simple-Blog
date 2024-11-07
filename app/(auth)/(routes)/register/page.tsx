'use client'
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/_firebase/config';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

//import { Result } from 'postcss';
const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState('')
    const router = useRouter();
    //const router = useRouter();

    
    /* NO LONGER ADDING USER TO MYSQL DB
    async function Add_User_To_MySQL_DB(user_email : string,user_tokenId : string){
        //console.log('tokenId passed to Server: ',tokenId)
        //console.log('email passed to Server: ', email)
        try {
            const res = await fetch('/api/db/put/Create_User', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_tokenId,user_email},)
            })
            const data = await res.json()
            if(res.ok) {
                console.log('user successfully added to mySQL DB')
                return data;
            } else {
                console.log("user not successfully added to mySQL DB",data.message)
                return data;
            }
        } catch(error) {
            console.log("Error Adding User to mySQL DB:",error)
            return error
        }
    }
    */

    //This function has 3 nested functions.
    //The first function creates a user profile in Firebase
    //If the first function succeeds, the user IDtoken from the
    //user that was just created is grabbed. If this function succeeds,
    //The user is added to the mySQL DB.

    async function handleSignUp() {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            //Got rid of adding user to mySQL DB. No need for user to be in mySQL DB since we can add
            //custom fields to firebase profiles
            const user = userCredential.user;
            if(user) {
                console.log("User successfully added to Firebase: ");
                router.push('/');
            }
            /*
            if (user) {
                console.log("REGISTER PAGE: Firebase User account successfully created:", user.email);
    
                // Get ID token
                const idToken = await user.getIdToken(true);
                console.log("REGISTER PAGE: Firebase idToken:", idToken);
    
                // Add user to MySQL DB with the obtained token
                const result = await Add_User_To_MySQL_DB(email, idToken);
                if (result.success === true) {
                    console.log("result: ",result)
                    console.log("User successfully added to MySQL DB");
                    router.push('/');
                } else if(result.errno === 1062){
                    throw new Error('Email is already registed. Please choose a different email.');
                } else {
                    throw new Error(result.message)
                }
    
                console.log("User ID Token:", idToken);
            }
            */
        } catch (error : unknown) {
            console.error("Error occurred during firebase sign-up:", error);

            if (error instanceof Error) {
                if(error.message)
                setError(error.message);
            }
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setError("This email is already in use. Please try another one.");
                        break;
                    case 'auth/invalid-email':
                        setError("The email address is not valid.");
                        break;
                    case 'auth/weak-password':
                        setError("The password is too weak. Please use a stronger password.");
                        break;
                    case 'auth/operation-not-allowed':
                        setError("This operation is not allowed. Please contact support.");
                        break;
                    // Add more error codes as needed
                    default:
                        setError("An unknown error occurred during sign-up.");
                        break;
                }
            }
        }
    }
    return ( <div>
        <p>Email</p>
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <p>Password</p>
        <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />

        <button
        onClick={handleSignUp}
        >
        Sign up
        </button>

        {error && <p className="text-red-600">{error}</p>}

    </div> );
}
 
export default RegisterPage;