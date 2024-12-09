import { useState} from 'react';
import {auth} from '@/lib/_firebase/config'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence,updateProfile } from "firebase/auth";
const EmailSignIn = () => {

    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const router = useRouter();
    function handleSignIn() {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        else{

            /* sets the persistence of the browser session */
            setPersistence(auth, browserSessionPersistence)
            .then(() => {
                if(process.env.DEBUG === 'true')
                    console.log('LOGIN WITH EMAIL: persistence set successfully')
            })
            .catch((error) => {
                console.log("LOGIN WITH EMAIL: Setting browser persistence failed.")
                console.log("Error Code:", error.code)
                console.log("Error Message:",error.message)
            })
            /* end setting  browser persistence */


            signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                // Signed in 
                
                updateProfile(result.user, {
                    displayName: username,
                });

                return router.push('/')
                // ...
            })
            .catch((error) => {
                console.log("LOGIN WITH EMAIL: Sign In with Email and Password Unsuccessful.")
                console.log("Error Code:", error.code)
                console.log("Error Message: ",error.message)
            });
        }
    }
    

    
    return ( <div> 
        <h1>Sign into Your Account</h1>

        <p>Username</p>
        <input
        type="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

        <p>Email</p>
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
