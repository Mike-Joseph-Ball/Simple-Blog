import { useState} from 'react';
import {auth} from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from "firebase/auth";
const EmailSignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const router = useRouter();
    function handleSignIn() {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        else{
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                return router.push('/')
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        }
    }
    

    
    return ( <div> 
        <h1>Sign into Your Account</h1>
        <p>Username</p>
    
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />

        <p>Password</p>
        <div>
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <button
            onClick={handleSignIn}
        >
            Sign in
        </button>
    
        </div> );
}
 
export default EmailSignIn;
