import { getAuth, signInWithPopup, GoogleAuthProvider, User, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useState } from 'react';
import isUserInMySQLDB from '@/app/(auth)/(routes)/login/isUserInMySQLDB';

const GoogleSignInButton = () => {
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const  handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        auth.useDeviceLanguage(); // Set language to the browser's default

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
        /* end setting browser persistence */
        try {
            const result = await signInWithPopup(auth, provider)
            setError(null)
            setUser(result.user);
        } catch(error) {
            const errorMessage = error instanceof Error ? error.message || JSON.stringify(error) : "An unexpected error occured";
            setError(errorMessage);
            console.log("Error:", errorMessage);
        }
    };

    return (
        <div>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>

            {/* Display user info if signed in */}
            {user && (
                <div className="text-cyan-200">
                    <h3>Welcome, {user.displayName}!</h3>
                    <p>Email: {user.email}</p>
                </div>
            )}

            {/* Display error message if any */}
            {error && (
                <div className="text-red-600">Error: {error}</div>
            )}
        </div>
    );
}

export default GoogleSignInButton;
