'use client'

import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();


    function handleSignUp() {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("User account successfully created: ",user.displayName)
            useEffect(() => {
                router.push('/')
            })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error Message:",errorMessage)
        });
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