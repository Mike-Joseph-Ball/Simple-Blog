'use client'
import { useRouter } from 'next/navigation'
import GoogleSignInButton from '@/app/(auth)/(routes)/login/login_with_google'
import  EmailSignIn  from '@/app/(auth)/(routes)/login/login_with_email'
import userAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useEffect } from 'react'

const LogInPage = () => {

    const router = useRouter()
    const [user,isPending] = userAuth();

    //console.log('user: ',user)
    //console.log('isPending:',isPending)


    useEffect(() => {
        if(!isPending && user) {
            console.log("user is authenticated. Push to home page.")
            router.push('/')
        }
    },[isPending, user, router])

    if(isPending) {
        return(<div>Loading...</div>)
    }
    else if(!user) {
        console.log("User is not authenticated. Allow them to log in.")
        return ( <div>
            <EmailSignIn/>
            <GoogleSignInButton/>
            </div> );
    }


}
 
export default LogInPage;