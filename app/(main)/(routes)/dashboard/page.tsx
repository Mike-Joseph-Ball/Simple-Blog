'use client'
import Sidebar_Left from '@/app/(main)/(routes)/dashboard/_components/sidebar_left'
import PostContent from '@/app/(main)/(routes)/dashboard/_components/post_content'
import { useSearchParams } from 'next/navigation'
import { getDefaultBlogFromLocalStorage,setDefaultBlogInLocalStorage } from '@/lib/utils'
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { getIdToken } from 'firebase/auth'
import { useEffect,useState } from 'react'
import Query_Most_Used_Blog from '@/lib/mySQL/client_side/GET/Query_Most_Used_Blog'
import Fetch_Blog_Posts_Middleware from '@/lib/mySQL/client_side/GET/Fetch_Blog_Posts_Middleware'
import Query_Blogs_Associated_With_User from '@/lib/mySQL/client_side/GET/Query_Blogs_Associated_With_User'
import Query_Blog_Given_Id_Middlware from '@/lib/mySQL/client_side/GET/Query_Blog_Given_Id_Middleware'
import BlogTitleAndDescription from './_components/blog_details'
import Does_User_Own_Blog_Middleware from '@/lib/mySQL/client_side/GET/Does_User_Own_Blog_Middleware'
import { useRouter } from 'next/navigation';
import { Post } from '../explore/_components/item_cards/Post_Card'
import { Suspense } from 'react'

export interface MySQLError extends Error {
    code?: string, // MySQL error code (e.g., 'ER_NO_SUCH_TABLE')
    errno?: number, // MySQL numeric error code
    sqlMessage?: string, // Detailed error message
    sqlState?: string, // SQL state
    sql?: string, // The SQL query that caused the error
  };

export interface Blog {
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
    post_count: number
}

const Dashboard = () => {

    const [defaultBlog,setDefaultBlog] = useState<BlogDetails | null>(null)
    const[usersBlogs,setUsersBlogs] = useState([])
    const [blogLoaded,setBlogLoaded] = useState<boolean|null>(null)
    const [associatedPosts, setAssociatedPosts] = useState<Post[]>([]);
    const [errorArray,setError] = useState<(MySQLError|string|Error)[]>([]) 
    //const [user, setUser] = useState<User | null>(null); // Type user state with Firebase User
    const [user,isPending] = useLocalUserAuth();
    const [defaultBlogId,setDefaultBlogId] = useState<string | null>(null)
    const [ownBlog,setOwnBlog] = useState<boolean|null>(null)
    
    const router = useRouter();

    const searchParams = useSearchParams()
    const blog_id = searchParams?.get('blogId')

    interface Blog {
        Blog_id: number;
        blog_title: string;
        blog_description: string;
        comment_settings_default: string;
        blog_template_style: string,
        user_email: string,
        created_at: string
    }
    

    //The first thing we will do is check if the user trying to view the dashboard is legitimate.

    //Then we will check if the current user owns the blog post.
    
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

                    let localBlogDetails: BlogDetails|null = null;
                    if(user.email) {
                        const localBlogDetailsString = getDefaultBlogFromLocalStorage(user.email);
                        if (localBlogDetailsString) {
                            localBlogDetails = JSON.parse(localBlogDetailsString);
                        }
                        if(localBlogDetails) {
                            console.log('local blog details:',localBlogDetails)
                        }
                    }
        
                    /* BEGIN GETTING MOST USED BLOG & POST COUNT */
                    if(defaultBlog){
                        console.log("blog is already saved in state variable.")
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
                        setDefaultBlogId(data.blogDetails[0].Blog_id.toString())
                    } else if (user.email && localBlogDetails) {
                        console.log("blog found in local storage:",localBlogDetails)
                        //If you can get the Default blog from local storage, use that and go right to getting blog details

                        setDefaultBlog(localBlogDetails)
                        setDefaultBlogId(localBlogDetails.defaultBlog.Blog_id.toString())
                        console.log('Default Blog Id:',defaultBlog)
                    } else if(user && user.email) {
                        console.log("Default blog must be acquired from mySQL")
                        //If you can't locate a blog to display, find the most used one and display that one.
                            console.log('userToken client:',userToken)
                            const data = await Query_Most_Used_Blog(userToken,user.email)
                            console.log('data:',data)

                            if(data.message === 'user has no blogs') {
                                console.log('user has no blogs!')
                                //route to create_blog page
                                router.push('/create_blog');
                                //setBlogLoaded(true)
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
                                setDefaultBlogId(mostUsedBlog.Blog_id)
                                const BlogDetails = {defaultBlog:mostUsedBlog as Blog,post_count:post_count}
                                setDefaultBlogInLocalStorage(user.email,BlogDetails)
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                //console.log('user token:',userToken)
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
            } else if(blogLoaded) {
                console.log('blog has already been loaded before associated posts could be grabbed. Probably because user has no blogs')
                return
            }
            try {
    
                console.log(" Now retrieving associated posts of default blog.")
                console.log("default blog:",defaultBlog)
                console.log('defaultBlog.defaultBlog:',defaultBlog.defaultBlog)
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    //we need to check if the user owns the blog. We can pass this boolean to the sidebar.
    useEffect(() => {
        async function DoesUserOwnBlogId () {
            if(!user || !user.email){
                return
            } else if(!defaultBlog) {
                //console.log('Default Blog Could not be found. could be that the first useEffect has not finished yet.')
                return
                //throw new Error('Default Blog Could not be found')
            } 
            try {
                const userToken = await user.getIdToken()
                const doesUserOwnBlog = await Does_User_Own_Blog_Middleware(userToken,defaultBlog.defaultBlog.Blog_id.toString())
                console.log('Does the user own the blog? ',doesUserOwnBlog)
                if(doesUserOwnBlog.ownBlog) {
                    setDefaultBlogInLocalStorage(user.email,defaultBlog)
                }
                setOwnBlog(doesUserOwnBlog.ownBlog)
            } catch(error) {
                setError((prevError) => [...prevError, 'unable to figure out if user owns the current blog:'+error]);
            }

        }
        DoesUserOwnBlogId()
    },[defaultBlog])

    
    console.log('defaultBlogId:',defaultBlogId)
    if(!user&&!isPending) {
        return(<div>No user object stored in browser. Log in or Sign up...</div>)
    }
    if(blogLoaded === null) {
        return(<div>Validating session and retrieving blog details...</div>)
    }

    if(blogLoaded === false) {
        return(
            <div>
                <h1>Error occured when trying to retrieve dashboard details:</h1>
                {errorArray.map((error:MySQLError|string|Error,index:number) => (
                    typeof error === 'object' && 'errno' in error && error.errno === -111 ? <p className="text-red-700" key={`db-error-${index}`} >Connection to database was unsuccessful</p> : <p className="text-red-700" key={index}>{error.toString()}</p>
                ))}
            </div>
        )
    }

    if(blogLoaded && ownBlog !== null){
        //If this returns, it means all the blog info and posts have been loaded.
        //We can pass state variables to components
        return ( 
            <div className=" h-full flex flex-row">
                <div>
                    <Sidebar_Left blogInfoArray={usersBlogs} defaultBlog={defaultBlog} doesUserOwnBlog={ownBlog}/>
                </div>
                <div className='w-full flex flex-col'>
                    <BlogTitleAndDescription blogTitle={defaultBlog?.defaultBlog.blog_title} blogDescription={defaultBlog?.defaultBlog.blog_description}/>
                    <PostContent postData={associatedPosts} blogId={defaultBlogId} doesUserOwnBlog={ownBlog}/>
                </div>
            </div>
         );
    }

}
 


export default function DashboardWrapper() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    );
  }