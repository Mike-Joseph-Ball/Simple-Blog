'use client'
import Sidebar_Left from '@/app/(main)/(routes)/dashboard/_components/sidebar_left'
import PostContent from '@/app/(main)/(routes)/dashboard/_components/post_content'
import { useSearchParams } from 'next/navigation'
import { getDefaultBlogFromLocalStorage,setDefaultBlogInLocalStorage } from '@/lib/utils'
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { getIdToken } from 'firebase/auth'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import Query_Most_Used_Blog from '@/lib/mySQL/client_side/GET/Query_Most_Used_Blog'
import Fetch_Blog_Posts_Middleware from '@/lib/mySQL/client_side/GET/Fetch_Blog_Posts_Middleware'
import Query_Blogs_Associated_With_User from '@/lib/mySQL/client_side/GET/Query_Blogs_Associated_With_User'
import Query_Blog_Given_Id_Middlware from '@/lib/mySQL/client_side/GET/Query_Blog_Given_Id_Middleware'


interface Blog {
    Blog_id: number;
    blog_title: string;
    blog_description: string;
    comment_settings_default: string;
    blog_template_style: string,
    user_email: string,
    created_at: string
  }

export interface BlogDetails {
    defaultBlog: Blog,
    post_count: 2
}

const Dashboard = () => {

    const [defaultBlog,setDefaultBlog] = useState<BlogDetails | null>(null)
    const[usersBlogs,setUsersBlogs] = useState([])
    const [blogLoaded,setBlogLoaded] = useState<boolean|null>(null)
    const [associatedPosts, setAssociatedPosts] = useState<any[]>([]);
    const [errorArray,setError] = useState<any[]>([]) 
    //const [user, setUser] = useState<User | null>(null); // Type user state with Firebase User
    const [user,isPending] = useLocalUserAuth();
    const [defaultBlogId,setDefaultBlogId] = useState<Number | null>(null)

    const searchParams = useSearchParams()
    let blog_id = searchParams?.get('blog_id')
    
    //First, attempt to get the current blog that is stored in the browser
    //...
    //If this blog cache exists, update the blog_selector component, query for it's contents, and display it (includes blog info, post info, etc)
    //If this blog cache does not exist, query for the user for blogs and choose the blog with the most posts. Update the blog_selector component, query for it's contnets, and display it (uncludes blog info, post info, etc)


    //This effect is called on every page reload, and when the blog id changes.
    //Retrieves blog details
    useEffect(() => {
        async function getMostUsedBlogDetails() {

            try  {
                if(!user){
                    //console.log('user not found. abandoning Default Blog Retrieval')
                    return
                    }

                console.log('Now attempting to get Default Blog Details')
                    //USER TOKEN IS UNDEFINED WHEN PASSED TO SERVER
                    const userToken = await getIdToken(user)

                    let localBlogDetails: any;
                    if(user.email) {
                        localBlogDetails = getDefaultBlogFromLocalStorage(user.email);
                        if(localBlogDetails) {
                            localBlogDetails = JSON.parse(localBlogDetails)
                        }
                    }
        
                    /* BEGIN GETTING MOST USED BLOG & POST COUNT */
                    if(defaultBlog){
                        console.log("blog is already saved in state variable. We just have to query to get the posts.")
                    }else if(blog_id && user.email) {
                        //If you got the blog id from the URL, you need to first get the blog details. 
                        //Then you can go right to getting blog details
                        const data = await Query_Blog_Given_Id_Middlware(userToken,blog_id)
                        if(!data.success) {
                            console.log('Query to get Blog given ID found in URL.')
                        }
                        console.log("blog found in the URL. Successfully Queried for this blog's immediate details: ",data)
                        const mostUsedBlog = data.blogDetails[0]
                        setDefaultBlog({post_count:data.post_count,defaultBlog:mostUsedBlog})
                        setDefaultBlogId(data.blogDetails[0].Blog_id)
                    } else if (user.email && localBlogDetails) {
                        console.log("blog found in local storage:",localBlogDetails)
                        //If you can get the Default blog from local storage, use that and go right to getting blog details

                        setDefaultBlog(localBlogDetails)
                        console.log('Default Blog Id:',defaultBlog)
                    } else if(user && user.email) {
                        console.log("Default blog must be acquired from mySQL")
                        //If you can't locate a blog to display, find the most used one and display that one.
                            console.log('userToken client:',userToken)
                            const data = await Query_Most_Used_Blog(userToken,user.email)
                            console.log('data:',data)

                            if(data.message === 'user has no blogs') {
                                console.log('user has no blogs!')
                                setBlogLoaded(true)
                                return
                            } else if (data.message === 'blogs do not have any posts') {
                                console.log('default blog has no posts')
                            }
                            const mostUsedBlog = data.most_used_blog[0]
                            const blogDetails = {post_count:data.post_count,defaultBlog:mostUsedBlog}
                            setDefaultBlog(blogDetails)
                            const post_count = data.post_count
                            console.log('most used blog:',mostUsedBlog)
                            console.log('most used blog id:',mostUsedBlog.Blog_id)
                            if(data && mostUsedBlog && post_count) {
                                setDefaultBlog(blogDetails)
                                //setDefaultBlogInLocalStorage(user.email,data.most_used_blog)
                                console.log("successfully added blog to local storage")
                            } else {
                                console.log()
                                throw new Error('Default Blog could not be found')
                            }
                    } else{
                        console.log("the user object is not found. Cannot get blog details.")
                        setError((prevError) => [...prevError, 'Unable to obtain blog details']);
                        return //{success:false}
                    }
                    /* END GETTING MOST USED BLOG AND POST COUNT */

            } catch(error:any) {
                console.log("unknown error occured adding retrieving blog details:",error)
                setError((prevError) => [...prevError, error]);
                setBlogLoaded(false)
                return // {success:false,message:"error occurred in getMostUsedBlogDetails",error:error}
            } finally {
                //setBlogLoaded(true); // End loading state
            }
        }
        getMostUsedBlogDetails()
    },[user])

    //This useEffect gets the blog ids and blog titles associated with the currently logged in user
    useEffect(() => {
        async function getUsersAssociatedBlogs() {
            try {
                if(!user) {
                    return
                }
                else if(!user.email){
                    return
                }
                const userToken = await getIdToken(user)
                console.log('user token:',userToken)
                const Blog_info_array  = await Query_Blogs_Associated_With_User(userToken)
                setUsersBlogs(Blog_info_array.res)
                console.log("Blog Id Array",Blog_info_array.res)
                return
            } catch(error) {
                console.log('Error Retrieving User Blog details: ',error)
                return
            }
        }
        getUsersAssociatedBlogs()
    },[user])

    //Retrieve all blogs associated with user
    //useEffect()

    //retrieves posts associated with blog
    useEffect(() => {
        async function getPostsAssociatedWithBlog() {
            /* BEGIN GETTING BLOG DETAILS.  */
            if(!user){
                return
            } else if(!defaultBlog) {
                console.log('Default Blog Could not be found. could be that the first useEffect has not finished yet.')
                return
                //throw new Error('Default Blog Could not be found')
            }
            try {
    
                console.log(" Now retrieving associated posts of default blog.")
                console.log("default blog:",defaultBlog)
                const userToken = await getIdToken(user)
                const data = await Fetch_Blog_Posts_Middleware(userToken,defaultBlog.defaultBlog.Blog_id)
                if(data && data.associatedPosts) {
                    //update state variablesassociatedPosts
                    console.log("Associated Posts:",data.associatedPosts)
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
                console.log('could not retrieve posts associated with user:',error)
                setError((prevError) => [...prevError, error]);
                return
            } finally {
                setBlogLoaded(true)
            }

        }
        getPostsAssociatedWithBlog()
    },[defaultBlog])

    

    if(!user&&!isPending) {
        return(<div>No user object stored in browser. Log in or Sign up...</div>)
    }
    if(blogLoaded === null) {
        return(<div>Validating session and retrieving blog details...</div>)
    }

    if(!blogLoaded) {
        return(
            <div>
                <h1>Error occured when trying to retrieve dashboard details:</h1>
                {errorArray.map((error:any,index:any) => (
                    error.errno === -111 ? <p className="text-red-700" >Connection to database was unsuccessful</p> : <p className="text-red-700" key={index}>{error.toString()}</p>
                ))}
            </div>
        )
    }

    if(blogLoaded){
        //If this returns, it means all the blog info and posts have been loaded.
        //We can pass state variables to components
        return ( 
            <div className=" h-full flex flex-row">
                <div>
                    <Sidebar_Left blogInfoArray={usersBlogs} defaultBlog={defaultBlog}/>
                </div>
                <div className='w-full'>
                    <PostContent postData={associatedPosts}/>
                </div>
            </div>
         );
    }

}
 
export default Dashboard;