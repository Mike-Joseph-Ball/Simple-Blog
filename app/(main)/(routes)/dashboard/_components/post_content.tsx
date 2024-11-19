'use client'

import { useRouter } from 'next/navigation'
type ChildComponentProps = {
    postData: Array<any>;
};

const PostContent: React.FC<ChildComponentProps> = ({postData}) => {    

    const router = useRouter()

    const handleClick = (postId:Number) => {
        router.push(`/post_editor?postId=${postId}`)
    }

    return ( <div className=" flex flex-col p-6 w-full h-full justify-start items-center bg-red-500 ml-auto">
        Blog Title
        <div className='w-500rm h-full flex flex-col space-y-8'>
       {postData.map((post,index) => (
        <a key={index} onClick={() => handleClick(post.Post_id)}>
            <div className="bg-slate-500">
                <h1>{post.Post_title}</h1>
                <p>{post.Post_content}</p>
            </div>
        </a>
       ))}
    </div> 
    </div>);
}
 
export default PostContent;