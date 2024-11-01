import { getAuth, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { useState } from 'react';

const GoogleSignInButton = () => {
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        auth.useDeviceLanguage(); // Set language to the browser's default

        signInWithPopup(auth, provider)
            .then((result) => {
                //const credential = GoogleAuthProvider.credentialFromResult(result);
                //const token = credential ? credential.accessToken : null;

                setError(null); // Clear any previous errors
                setUser(result.user);
            })
            .catch((error) => {
                // Check if error has a message, else use a default error string
                const errorMessage = error instanceof Error ? error.message || JSON.stringify(error) : "An unexpected error occured";
                setError(errorMessage);
                console.log("Error:", errorMessage);
            });
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
