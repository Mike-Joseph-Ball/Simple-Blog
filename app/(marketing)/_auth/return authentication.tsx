'use client'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/_firebase/config'
import { User as FirebaseUser } from "firebase/auth";

const UserAuth = () : [FirebaseUser | null, boolean] => {

    const [user, isPending] = useAuthState(auth);

    return ([user || null,isPending]);
}
 
export default UserAuth;