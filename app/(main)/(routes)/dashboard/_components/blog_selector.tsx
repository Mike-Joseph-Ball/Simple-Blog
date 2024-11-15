import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { BlogDetails } from '@/app/(main)/(routes)/dashboard/page'


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
                    defaultBlog.defaultBlog.blog_title !== blog.blog_title && <DropdownMenuItem>{blog.blog_title}</DropdownMenuItem>
                ))}
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div> );
}
 
export default Blog_Selector;