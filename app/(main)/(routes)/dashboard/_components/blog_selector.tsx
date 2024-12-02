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
    defaultBlog: BlogDetails|null;
}
const Blog_Selector: React.FC<ChildComponentProps>  = ({blogInfoArray = [], defaultBlog=null}) => {
    return ( <div>
        <DropdownMenu>
        <DropdownMenuTrigger>
            {defaultBlog ? defaultBlog.defaultBlog.blog_title : 'Blog Selector'}
        </DropdownMenuTrigger>
        
            <DropdownMenuContent>
                <Link href='/create_blog'><DropdownMenuLabel>Create New Blog</DropdownMenuLabel></Link>
                
                <DropdownMenuSeparator />
                {blogInfoArray && blogInfoArray.map((blog) => (
                    defaultBlog && defaultBlog.defaultBlog.blog_title !== blog.blog_title && <DropdownMenuItem key={blog.blog_id}><a href={'/dashboard?blog_id=' + blog.Blog_id}>{blog.blog_title}</a></DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    </div> );
}
 
export default Blog_Selector;