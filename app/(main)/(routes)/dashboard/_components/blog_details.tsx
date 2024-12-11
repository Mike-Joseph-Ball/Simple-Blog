
interface BlogDetailsProp {
    blogTitle: string | undefined;
    blogDescription: string | undefined;
}

const BlogDetails: React.FC<BlogDetailsProp> = ({blogTitle,blogDescription}) => {
    return ( <div className="flex flex-col items-center">
        <div className="text-5xl padding-y-2">
            {blogTitle}
            </div>
        <div>
            {blogDescription}
        </div>
    </div> );
}
 
export default BlogDetails;