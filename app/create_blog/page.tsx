'use client'

import { useEffect, useState } from 'react';
import  useCurrentFirebaseUserVerify from '@/lib/_firebase/Is_Token_Legitimate_Middleware'
import Main_Form from '@/app/create_blog/main_form'
import { auth } from '@/lib/_firebase/config'

const CreateBlog = () => {
    
    console.log("Logged in User: ", auth.currentUser)

    const isValid = useCurrentFirebaseUserVerify(); // Call the hook directly

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
    /* End AuUse troubleshooting techniques to resolve technical problems of a moderate to high scope and complexity to include the integration of hardware, software and operating systems.thentication */

    return (
        <div>
        <div className='flex justify-center items-center w-full text-3xl'>
            <h1>Blog Creation Form</h1>
        </div>
        <Main_Form/>
        </div>);
}

export default CreateBlog;