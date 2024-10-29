import { getAuth, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
const SignOutButton = () => {
    const auth = getAuth();

    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log("User Signed Out Correctly")
          }).catch((error) => {
            console.log("Error Signing Out:",error)
          });
    }

    return (
    
    <Button onClick={handleSignOut}>Sign Out of Account</Button>

    );
}

export default SignOutButton