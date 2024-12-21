import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Blog_Selector from '@/app/(main)/(routes)/dashboard/_components/blog_selector'
import { BlogDetails } from '@/app/(main)/(routes)/dashboard/page'
import { handleSignOut } from './Handle_Sign_Out'
import { useRouter } from 'next/navigation'
import { Blog } from '@/app/(main)/(routes)/dashboard/page'
type ChildComponentProps = {
    blogInfoArray: Array<Blog>;
    defaultBlog: BlogDetails | null;
    doesUserOwnBlog: boolean | null;
}

const Sidebar_Left: React.FC<ChildComponentProps> = ({blogInfoArray = [],defaultBlog = null, doesUserOwnBlog}) => {
    
    const router = useRouter()
    function handleSignOutRoute() {
        handleSignOut()
        router.push('/')
    }

    function routeToDashboard() {
      router.push('/dashboard')
      window.location.reload(); // Full page reload
    }

    return (
        <div className="flex flex-col p-4 w-60 min-h-screen bg-slate-800 text-white space-y-6">
          {/* Blog Selector */}
          <div className="w-full">
            <Blog_Selector blogInfoArray={blogInfoArray} defaultBlog={defaultBlog} />
          </div>
      
          {/* Action Buttons */}
          {doesUserOwnBlog && (
            <div className="flex flex-col w-full space-y-4">
              <Link href="/create_blog">
                <Button variant="ghost" size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded">
                  Make New Blog
                </Button>
              </Link>
      
              <Link href={{ pathname: '/post_editor', query: { blogId: defaultBlog?.defaultBlog.Blog_id } }}>
                <Button variant="ghost" size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white rounded">
                  Make New Post
                </Button>
              </Link>
      
              <Button variant="ghost" size="lg" className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded">
                Comment Dashboard
              </Button>
            </div>
          )}
      
          {!doesUserOwnBlog && (
            <Button onClick={routeToDashboard} variant="ghost" size="lg" className="w-full bg-red-500 hover:bg-red-600 text-white rounded">
              Return to My Blog Dashboard
            </Button>
          )}
      
          {/* Explore Button */}
          <Link href='/explore'>
            <Button variant="ghost" size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded">
                Explore
            </Button>
          </Link>

            {/* Sign Out Button */}
            <div className="mt-auto"> {/* Pushes the sign-out button to the bottom */}
            <Button
                onClick={handleSignOutRoute} // Function to handle sign-out logic
                variant="ghost"
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded"
            >
                Sign Out
            </Button>
            </div>
        </div>
      );
      
      
}
 
export default Sidebar_Left;