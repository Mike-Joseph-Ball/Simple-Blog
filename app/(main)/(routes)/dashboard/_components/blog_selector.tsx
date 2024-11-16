import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { BlogDetails } from '@/app/(main)/(routes)/dashboard/page'
import Link from 'next/link'

  type ChildComponentProps = {
    blogInfoArray: Array<any>;
    defaultBlog: BlogDetails;
}
const Blog_Selector: React.FC<ChildComponentProps>  = ({blogInfoArray,defaultBlog}) => {
    return ( <div>
        <DropdownMenu>
        <DropdownMenuTrigger>
            {defaultBlog.defaultBlog.blog_title ?? 'Blog Selector'}
        </DropdownMenuTrigger>
        
            <DropdownMenuContent>
                <DropdownMenuLabel>Create New Blog</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {blogInfoArray.map((blog) => (
                    defaultBlog.defaultBlog.blog_title !== blog.blog_title && <DropdownMenuItem key={blog.blog_id}><Link href={{pathname: '/dashboard',query: {blog_id:blog.Blog_id},}}>{blog.blog_title}</Link></DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    </div> );
}
 
export default Blog_Selector;