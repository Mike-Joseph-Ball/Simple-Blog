"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from '@/app/(marketing)/_components/logo';
import ModeToggle  from '@/components/mode_toggle';
import userAuth from '@/app/(marketing)/_auth/return authentication';
import SignOutButton from '@/app/(auth)/(routes)/logout/SignOutButton';
import SignInButton from '@/app/(auth)/(routes)/login/SignInButton';
export const Navbar = () => {

    const scrolled = useScrollTop();

    const [user, isPending] = userAuth();
    //console.log("User:",user)
    
    return (
        //The cn function is a utility who's primary purpose is to conditionally construct tailwind components.
        //Below, we see two arguments passed to cn. The first argument contains all of the tailwind classes
        //That should always be applied to the div. The second argument includes a boolean value, and a second
        //string of tailwind arguments that should be applied to the div, only if the boolean returns true.
        //In this case, the navbar should only have a bottom border if the user has scrolled past the 
        //limit set in useScrollTop();
        <div  className={cn(
           "z-20 bg-background  dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
           scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <ModeToggle />
            </div>

            {user && !isPending && <SignOutButton/> }
            {!user && !isPending && <SignInButton/> }

        </div>
     );

}