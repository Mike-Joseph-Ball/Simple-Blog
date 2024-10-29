'use client'
import Heading from "@/app/(marketing)/_components/heading";
import Heroes from '@/app/(marketing)/_components/heroes';
import Footer from '@/app/(marketing)/_components/footer';
import FetchBlogs from '@/lib/fetchBlogs.tsx';
import userAuth from '@/app/(marketing)/_auth/return authentication';
import { useEffect } from 'react';
const MarketingPage = () => {
    const [user,isPending] = userAuth();

    useEffect(() => {
        console.log("User:", user);
    }, [user]);
    
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