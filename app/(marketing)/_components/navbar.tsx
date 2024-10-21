"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils"
import Logo from '@/app/(marketing)/_components/logo'

export const Navbar = () => {

    const scrolled = useScrollTop();
    
    return (
        //The cn function is a utility who's primary purpose is to conditionally construct tailwind components.
        //Below, we see two arguments passed to cn. The first argument contains all of the tailwind classes
        //That should always be applied to the div. The second argument includes a boolean value, and a second
        //string of tailwind arguments that should be applied to the div, only if the boolean returns true.
        //In this case, the navbar should only have a bottom border if the user has scrolled past the 
        //limit set in useScrollTop();
        <div  className={cn(
           "z-20 bg-background fixed top-0 flex items-center w-full p-6",
           scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                Log in
            </div>
        </div>
     );

}