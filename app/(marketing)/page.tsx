'use client'
import Heading from "@/app/(marketing)/_components/heading";
import Heroes from '@/app/(marketing)/_components/heroes';
import Footer from '@/app/(marketing)/_components/footer';
import userAuth from '@/app/(marketing)/_auth/return authentication';
import { useEffect, useState } from 'react';
import  CurrentFirebaseUserVerify from '@/lib/_firebase/get_current_firebase_userID'


const MarketingPage = () => {

    const[isValid, setIsValid] = useState<boolean | null>(null)
    useEffect(() => {
        console.log("Token Checking useEffect Called")
        const validateToken = async() => {
            const API_Response = await CurrentFirebaseUserVerify();
            setIsValid(API_Response)
            if(API_Response === true) {
                console.log("Token is valid!")
            } else {
                console.log("Invalid Token.")
            }
        }
        validateToken();
    })


    const [user] = userAuth();
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