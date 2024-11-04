'use client'
import Heading from "@/app/(landing_page)/_components/heading";
import Heroes from '@/app/(landing_page)/_components/heroes';
import Footer from '@/app/(landing_page)/_components/footer';
import userAuth from '@/lib/_firebase/return_local_authentication';
import { useEffect, useState } from 'react';
import  useCurrentFirebaseUserVerify from '@/lib/_firebase/Is_Token_Legitimate_Middleware'
import { auth } from '@/lib/_firebase/config'


const MarketingPage = () => {

    if(process.env.NEXT_PUBLIC_DEBUG)
    console.log("Logged in User on Main Page: ", auth.currentUser)


    const isValid = useCurrentFirebaseUserVerify(); // Call the hook directly
    console.log("isValid: ",isValid)

    useEffect(() => {
        if (isValid) {
            console.log("LANDING PAGE: Token is valid!");
        } else {
            console.log("LANDING PAGE: Invalid Token.");
        }
    }, [isValid]); // Add isValid as a dependency to track changes


    if(isValid === null){
        return(<div>Validating Session...</div>);
    }
    if(!isValid){
        return(<div>Invalid token. Please log in again.</div>);
    }

    return ( 
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <Heading/>
                Blogs:
                <Heroes />
            </div>
            <Footer />
        </div>
     );
}
 
export default MarketingPage;