'use client'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/config'
import { User as FirebaseUser } from "firebase/auth";

const userAuth = () : [FirebaseUser | null, boolean] => {

    const [user, isPending] = useAuthState(auth);

    return ([user || null,isPending]);
}
 
export default userAuth;