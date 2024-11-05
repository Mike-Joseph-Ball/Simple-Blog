//This module returns the current browser's authentication header, which contains the JWT token unique to each user session

'use client'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/_firebase/config'
import { User as FirebaseUser } from "firebase/auth";

const useLocalUserAuth = () : [FirebaseUser | null, boolean] => {

    const [user, isPending] = useAuthState(auth);

    return ([user || null,isPending]);
}
 
export default useLocalUserAuth;