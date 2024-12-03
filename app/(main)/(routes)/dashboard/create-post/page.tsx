import { useState } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from 'next/navigation'
import { useEffect } from "react";
import  useCurrentFirebaseUserVerify from '@/lib/_firebase/local_authentication/Is_Token_Legitimate_Middleware'

const createPost = async() => {

    interface post {
        Post_id: number;
        Post_title: string;
        Is_post_public: number;
        Comment_settings: number;
        Post_content: string;
        User_email: string;
        Blog_id: number;
        Created_at: string;
    }

    const [postResponse,setPostResponse] = useState<null|post>(null)
    const {isValid,user} = useCurrentFirebaseUserVerify(); // Call the hook directly

    //This creates the desired post, and returns the post id.
    useEffect(() => {

    })
    

    //Check if a post id was passed if not, throw error.
    if(isValid === null) {
        return('Validating user session...')
    } else if (!isValid) {
        return('User session is invalid')
    } else if(postResponse === null) {
        return ('Creating Post...');
    } else if (postResponse && isValid) { 
        //We have the postResponse that was returned by the useEffect and also we verified the user session.
        //Now we have to route to the post editor, which is able to edit the newly created post
        const router = useRouter()
        router.push('/post_editor')
    }

}
export default createPost;