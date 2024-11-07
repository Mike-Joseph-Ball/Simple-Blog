import { Button } from '@/components/ui/button'
import Query_Blogs_Associated_With_User from "@/lib/mySQL/GET/Query_Blogs_Associated_With_User";
import Link from 'next/link'

const Sidebar_Left = () => {
    return ( 
        <div className=" flex flex-col p-6 w-40 h-full justify-center items-center bg-slate-400">
            
            <Link href='/create_blog'>
                <Button variant="ghost" size="lg">
                    Make New Blog
                </Button>
            </Link>

            <Link href='/create_post'>
                <Button variant="ghost" size="sm">
                    Make New Post
                </Button>
                </Link>
            <Button variant="ghost" size="sm">
                Comment Dashboard
            </Button>
            <Button variant="ghost" size="sm">
                Blog Dashboard
            </Button>
            <Button variant="ghost" size="sm">
                Explore
            </Button>
        </div>
     );
}
 
export default Sidebar_Left;