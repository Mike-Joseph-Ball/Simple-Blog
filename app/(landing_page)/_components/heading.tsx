"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
//import { useEffect } from 'react';
//import { useState } from 'react'
//import { User as FirebaseUser } from "firebase/auth";

const Heading = () => {

    //const [user, setUser] = useState<null | FirebaseUser>(null);
    //const [isPending, setIsPending] = useState<null | Boolean>(true);
    return ( 
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold ">
                A place where the internet stuggle ends. Welcome to <span className="underline"></span>Simple Blog
            </h1>

            <h3>
                Simple Blog is a platform where users can share their thoughts <br/> Quickly and easily.
            </h3>

            <Button>
                Set up Your Blog
                <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>


        </div>
     );
}
 
export default Heading;