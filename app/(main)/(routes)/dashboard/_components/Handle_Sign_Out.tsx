import { getAuth, signOut } from "firebase/auth";

export const handleSignOut = () => {
    const auth = getAuth();
      signOut(auth).then(() => {
          console.log("User Signed Out Correctly")
        }).catch((error) => {
          console.log("Error Signing Out:",error)
        });
  }