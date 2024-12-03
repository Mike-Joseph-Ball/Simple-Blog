'use client'
import Heading from "@/app/(landing_page)/_components/heading";
import Blog_Examples from '@/app/(landing_page)/_components/blog_examples';
import Footer from '@/app/(landing_page)/_components/footer';
import { useEffect } from 'react';
import  useCurrentFirebaseUserVerify from '@/lib/_firebase/local_authentication/Is_Token_Legitimate_Middleware'
import { auth } from '@/lib/_firebase/config'


const MarketingPage = () => {

    if(process.env.NEXT_PUBLIC_DEBUG)
    console.log("Logged in User on Main Page: ", auth.currentUser)


    const {isValid,user} = useCurrentFirebaseUserVerify(); // Call the hook directly
    console.log("isValid: ",isValid)

    useEffect(() => {
        if (isValid) {
            console.log("LANDING PAGE: Token is valid!");
        } else {
            console.log("LANDING PAGE: Invalid Token.");
        }
    }, [isValid]); // Add isValid as a dependency to track changes


    if(isValid === null){
        return(<div>Retrieving Session Information...</div>);
    }
    return ( 
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <Heading message={isValid}/>
                Blogs:
                <Blog_Examples />
            </div>
            <Footer />
        </div>
     );
}
 
export default MarketingPage;