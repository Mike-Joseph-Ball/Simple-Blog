'use client'

import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/_firebase/config';
//import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const router = useRouter();


    function handleSignUp() {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User account successfully created: ",user.displayName)
            //useEffect(() => {
            //    router.push('/')
            //})
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error Occurred in user creation with email and password.")
            console.log("Error Code:",errorCode)
            console.log("Error Message:",errorMessage)
        });

        /* Add the user to the SQL DB also */

        async function Add_User_To_MySQL_DB(){
            try {
                const res = await fetch('@/app/_private_api/DB/Create_User', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({email})
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
        const result = Add_User_To_MySQL_DB()
        if(!result) {
            throw new Error('User was not added to mySQL DB!')
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

    </div> );
}
 
export default RegisterPage;