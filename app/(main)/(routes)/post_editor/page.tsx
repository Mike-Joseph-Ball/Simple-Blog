'use client'
//import Rich_Text_Editor from "./Rich_Text_Editor";
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation'
import Fetch_Post_Given_Post_Id_Middleware from '@/lib/mySQL/client_side/GET/Fetch_Post_Given_Post_Id_Middleware';
import { auth } from '@/lib/_firebase/config'
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import useCurrentFirebaseUserVerify from '@/lib/_firebase/local_authentication/Is_Token_Legitimate_Middleware';
import { useEffect } from 'react';
import { useState } from 'react';
import Create_Post_Middleware from '@/lib/mySQL/client_side/PUT/Create_Post_Middleware';
import { OutputData } from '@editorjs/editorjs';
//import { ZodNullable } from 'zod';
// Import dynamically with `ssr: false`
const Rich_Text_Editor = dynamic(() => import('./Rich_Text_Editor'), { ssr: false });

interface post {
    Post_id: number;
    Post_title: string;
    Is_post_public: number;
    Comment_settings: number;
    Post_content: string;
    User_email: string;
    Blog_id: number;
    Created_at: number;
}
const Post_Editor = () => {

    const [loadedProperly,setLoadedProperly] = useState<null|boolean>(null)
    const [postContents,setPostContents] = useState<null|OutputData>(null)
    const [postId, setPostId] = useState<null|string>(null)
    const {isValid,user} = useCurrentFirebaseUserVerify();

    //check if there is a postId in the URL. If there is, set the post id. 
    const searchParams = useSearchParams()
    const postIdParam = searchParams?.get('post_id');
    const blogId = searchParams?.get('blog_id');

    //perform async functions to get user session and create post if not passed
    useEffect(() => {
        const setupPostEditor = async () => {
            //Check to make sure the current user has a valid user session.
            if(!isValid) {
                console.log('user session found to not be valid')
                setLoadedProperly(false)
                return
            } else if(!blogId) {
                console.log('blog id not passed as url param')
                setLoadedProperly(false)
                return
            }
            
            if(!user) {
                console.log('user is not valid')
                setLoadedProperly(false)
                return
            }
            console.log("makes it past session checks")
            const tokenId = await user.getIdToken()

            if(isValid && user && blogId) {

                if(postIdParam === null ||postIdParam ===undefined) {
                    console.log("post id not found in url")
                    //create the post, and respond back with the post id
                    const createdPost = await Create_Post_Middleware(tokenId,blogId)
                    console.log('created post response:',createdPost)
                    setPostId(createdPost.res.insertId)
                    setLoadedProperly(true)
                    const postData = await Fetch_Post_Given_Post_Id_Middleware(tokenId,createdPost.res.insertId)
                    console.log(postData)
                    setPostContents(postData.res[0])
                    setLoadedProperly(true)
                    const url = new URL(window.location.href)
                    url.searchParams.set('post_id',createdPost.res.insertId.toString())
                    window.history.pushState({},'',url)
                } else if(postIdParam) {
                    //obtain post details given post id
                    console.log("post id found in url")
                    const postData = await Fetch_Post_Given_Post_Id_Middleware(tokenId,postIdParam)
                    console.log(postData)
                    setPostId(postIdParam)
                    setPostContents(postData.res[0])
                    setLoadedProperly(true)
                    const url = new URL(window.location.href)
                    url.searchParams.set('post_id',postIdParam)
                    window.history.pushState({},'',url)
                }



                return
            }
        }
        setupPostEditor()
    },[isValid])


    //If there is a postId, attempt to capture the post details. store them in a state variable
    //Check to see if the currently logged in user is the owner of the post_id. Editor=true
    //If the user is not the owner of the post, continue on, but set Editor=false


    //If there is no postId, continue to the Rich Text Editor with a null child passed. Editor=true

    //console.log('loadedProperly:',loadedProperly)
    //console.log('postId:',postId)
    //console.log('postContents:',postContents)
    if(!blogId) {
        return('blog not specified in URL param')
    } else if(loadedProperly && postId && postContents) {
        return (<div>
            <Rich_Text_Editor Post_content={postContents} postId={postId}/>
        </div>);
    }

}
 
export default Post_Editor;