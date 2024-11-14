'use client'

import Sidebar_Left from '@/app/(main)/(routes)/dashboard/_components/sidebar_left'
import PostContent from '@/app/(main)/(routes)/dashboard/_components/post_content'
import { useSearchParams } from 'next/navigation'
import { getDefaultBlogFromLocalStorage,setDefaultBlogInLocalStorage } from '@/lib/utils'
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { getIdToken } from 'firebase/auth'
import { useEffect } from 'react'
import { useState } from 'react'
import Query_Most_Used_Blog from '@/lib/mySQL/GET/Query_Most_Used_Blog'
import Fetch_Blog_Details_And_Posts_Middleware from '@/lib/mySQL/GET/Fetch_Blog_Details_And_Posts_Middleware'

const Dashboard = () => {

    const [defaultBlogId,setDefaultBlogId] = useState<number | null>(null)
    const [blogLoaded,setBlogLoaded] = useState(false)
    const [blogDetails, setBlogDetails] = useState([]);
    const [associatedPosts, setAssociatedPosts] = useState([]);
    const [fetchBlogError,setFetchBlogError] = useState<Error | string>('') 

    const searchParams = useSearchParams()
    let blog_id = searchParams?.get('blog_id')
    
    const [user,isPending] = useLocalUserAuth();
    //First, attempt to get the current blog that is stored in the browser
    //...
    //If this blog cache exists, update the blog_selector component, query for it's contents, and display it (includes blog info, post info, etc)
    //If this blog cache does not exist, query for the user for blogs and choose the blog with the most posts. Update the blog_selector component, query for it's contnets, and display it (uncludes blog info, post info, etc)


    //This effect is called on every page reload, and when the blog id changes.
    useEffect(() => {
        async function getMostUsedBlogDetails() {

            try  {
                if(!user)
                    {
                        return false
                    }
                    //USER TOKEN IS UNDEFINED WHEN PASSED TO SERVER
                    const userToken = await getIdToken(user)

                    let localBlogId: number | null = null;
                    if(user.email) {
                        localBlogId = Number(getDefaultBlogFromLocalStorage(user.email));
                    }
        
                    /* BEGIN GETTING MOST USED BLOG ID */
                    if(blog_id && user.email) {
                        //If you got the blog id from the URL, you can go right to getting blog details
                        console.log("blog id found in the URL")
                        setDefaultBlogId(+(blog_id))
                    } else if (user.email && localBlogId) {
                        console.log("blog_id found in local storage:",localBlogId)
                        //If you can get the Default blog from local storage, use that and go right to getting blog details
                        setDefaultBlogId(localBlogId)
                        console.log('Default Blog Id:',defaultBlogId)
                    } else if(user && user.email) {
                        console.log("Default blog id must be acquired from mySQL")
                        //If you can't locate a blog to display, find the most used one and display that one.
                            console.log('userToken client:',userToken)
                            const data = await Query_Most_Used_Blog(userToken,user.email)
                            console.log('data:',data)
                            if(data && data.blog_id && data.post_count && data.blog_id_array) {
                                setDefaultBlogId(data.blog_id)
                                console.log('defaultBlogId:',defaultBlogId)
                                setDefaultBlogInLocalStorage(user.email,data.blog_id)
                                console.log("successfully adds blog")
                            } else {
                                console.log()
                                throw new Error('Default Blog could not be found')
                            }
                    } else{
                        console.log("the user object is not found. Cannot get blog details.")
                        setFetchBlogError('Unable to obtain blog details')
                        return //{success:false}
                    }
                    /* END GETTING MOST USED BLOG ID */
                console.log("makes it here?")
                /* BEGIN GETTING BLOG DETAILS.  */
                if(!localBlogId) {
                    console.log('BlogId Could not be found')
                    throw new Error('Default Blog Could not be found')
                }
                const data = await Fetch_Blog_Details_And_Posts_Middleware(userToken,localBlogId)
                if(data && data.blogDetails && data.associatedPosts) {
                    //update state variablesassociatedPosts
                    console.log("Blog Details:",data.blogDetails)
                    console.log("Associated Posts:",data.associatedPosts)

                    setBlogDetails(data.blogDetails)
                    setAssociatedPosts(data.associatedPosts)
                    //The finally block will run even if there is a return in the try or catch block
                    return //{success:true,blogDetails:data.blogDetails,associatedPosts:data.associatedPosts}
                } else {
                    throw new Error(data.error)
                    //return {success:false,message:"Fetch_Blog_Details_And_Posts_Middleware failed.",error:data.error}
                }
                //INCLUDES DIRECT BLOG DETAILS, AND POSTS ON BLOG
                /* END GETTING BLOG DETAILS */

            } catch(error:any) {
                console.log("unkown error occured adding retrieving dashboard details:",error)
                setFetchBlogError(error)
                return // {success:false,message:"error occurred in getMostUsedBlogDetails",error:error}
            } finally {
                setBlogLoaded(true); // End loading state
            }
        }
        getMostUsedBlogDetails()
    },[user,blog_id])

    if(!user&&!isPending) {
        return(<div>No user object stored in browser. Log in or Sign up...</div>)
    }
    if(!blogLoaded) {
        return(<div>Validating session and retrieving blog details...</div>)
    }

    if(blogLoaded){
        return ( 
            <div className=" h-full flex flex-row">
                <div>
                    <Sidebar_Left />
                </div>
                <div className='w-full'>
                    <PostContent postData={associatedPosts}/>
                </div>
            </div>
         );
    }

}
 
export default Dashboard;