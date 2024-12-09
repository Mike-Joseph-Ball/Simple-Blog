'use client'

import { useRouter } from 'next/navigation'
import { convertEditorjsDataToHumanReadable } from '@/lib/utils'
import { OutputData } from '@editorjs/editorjs';

type ChildComponentProps = {
    postData: Array<any>;
    blogId: string|null;
    doesUserOwnBlog: boolean | null;
};

const PostContent: React.FC<ChildComponentProps> = ({postData = [],blogId=null}) => {    

    const router = useRouter()

    const handleClick = (postId:Number) => {
        router.push(`/post_editor?postId=${postId}&blogId=${blogId}`)
    }

    return ( <div className=" flex flex-col p-6 w-full h-full justify-start items-center bg-red-500 ml-auto">
        <div className='w-500rm h-full flex flex-col space-y-8'>
       {postData && postData.map((post,index) => (
        <a key={index} onClick={() => handleClick(post.Post_id)}>
            <div className="bg-slate-500">
                <h3>{post.Post_title}</h3>
                {post.Post_content && <p>{convertEditorjsDataToHumanReadable(post.Post_content)}</p>} 
            </div>
        </a>
       ))}
    </div> 
    </div>);
}
 
export default PostContent;