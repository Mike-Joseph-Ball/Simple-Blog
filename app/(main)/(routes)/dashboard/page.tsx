'use client'

import Sidebar_Left from '@/app/(main)/(routes)/dashboard/_components/sidebar_left'
import PostContent from '@/app/(main)/(routes)/dashboard/_components/post_content'
import { useSearchParams } from 'next/navigation'

const Dashboard = () => {

    const searchParams = useSearchParams()
    const user_email = searchParams?.get('user_email')
    const blog_title = searchParams?.get('blog_title')

    if(blog_title && user_email) {
        //call the API to get the blog description, and post IDs, and blog style
        //call the API to get the post Titles and first text box of the post to display for the 10 most recent posts
    }

    return ( 
        <div className=" h-full flex flex-row">
            <div>
                <Sidebar_Left />
            </div>
            <div className='w-full'>
                <PostContent />
            </div>
        </div>
     );
}
 
export default Dashboard;