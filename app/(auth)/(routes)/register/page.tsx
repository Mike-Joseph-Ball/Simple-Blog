'use client'
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/_firebase/config';
//import { useRouter } from 'next/navigation';
//import { Result } from 'postcss';
const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const router = useRouter();

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
                return data.success;
            } else {
                console.log("user not successfully added to mySQL DB")
            }
        } catch(error) {
            console.log("Error Adding User to mySQL DB:",error)
            return false
        }
    }


    function handleSignUp() {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            if (user) {
                console.log("User account successfully created: ",user.displayName)
                // Use .then() to handle the asynchronous call to getIdToken
                user.getIdToken(true)
                  .then((idToken) => {
                    console.log("REGISTER PAGE: idToken:",idToken)

                    //In order for the mySQL DB addition to work, we need the user's local JWT
                    //This is why we nest the function call in the getIdToken return.
                    const result = Add_User_To_MySQL_DB(email,idToken)
                    .then(() => {
                        console.log("User successfully added to mySQL DB")
                    })
                    .catch((error) => {
                        console.log("REGISTER PAGE: Error Adding user to mySQL DB: ")
                    })
                    if(!result) {
                        throw new Error('User was not added to mySQL DB!')
                    }
                    console.log("User ID Token:", idToken);
                  })
                  .catch((error) => {
                    console.error("Error getting ID Token:", error);
                  });
              }
            })
            //useEffect(() => {
            //    router.push('/')
            //})
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error Occurred in user creation with email and password.")
            console.log("Error Code:",errorCode)
            console.log("Error Message:",errorMessage)
        });

        /* Add the user to the SQL DB also */

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

    </div> );
}
 
export default RegisterPage;