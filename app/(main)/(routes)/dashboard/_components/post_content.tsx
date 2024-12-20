'use client'

import { useRouter } from 'next/navigation'
import { convertEditorjsDataToHumanReadable } from '@/lib/utils'
import Delete_Post_Middleware from '@/lib/mySQL/client_side/PUT/Delete_Post_Middleware';
import { Button } from '@/components/ui/button';
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useState } from 'react'
import { Post } from '../../explore/_components/item_cards/Post_Card';
type ChildComponentProps = {
    postData: Array<Post>;
    blogId: string|null;
    doesUserOwnBlog: boolean | null;
};

const PostContent: React.FC<ChildComponentProps> = ({postData = [],blogId=null,doesUserOwnBlog}) => {    

    const router = useRouter()
    const [user] = useLocalUserAuth()
    const [statePostData,setStatePostData] = useState(postData)

    const handleClick = (postId:Number) => {
        router.push(`/post_editor?postId=${postId}&blogId=${blogId}`)
    }

    const handlePostDelete = async(postId:string) => {
        const tokenId = await user?.getIdToken()
        if(tokenId) {
            const resp = await Delete_Post_Middleware(tokenId,postId)
            if(resp.success === false) {
                console.log('post was not successfully posted:  ',resp)
            } else {
                console.log('post was successfully deleted')
                // Remove the deleted post from the state
                setStatePostData((prevData) =>
                    prevData.filter((post) => post.Post_id !== parseInt(postId))
                );
            }
        } else{
            console.log('post was unable to be deleted. tokenId could not be retrieved.')
        }
    }

    if(statePostData) {
        return (
            //Disclaimer - styling assisted with chatGPT
            <div className="flex flex-col p-6 w-full h-full justify-start items-center bg-red-500">
              <div className="w-full max-w-4xl flex flex-col space-y-4">
                {statePostData &&
                  statePostData.map((post, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-100 rounded-lg shadow-md p-4 hover:bg-slate-200 cursor-pointer"
                      onClick={() => handleClick(post.Post_id)}
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{post.Post_title}</h3>
                        {post.Post_content && (
                          <p className="text-sm text-gray-600 mt-2">
                            {convertEditorjsDataToHumanReadable(post.Post_content)}
                          </p>
                        )}
                      </div>
                      {
                        doesUserOwnBlog && 
                        <div className="ml-4">
                          {/* Placeholder for trash icon */}
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                          <Button variant='ghost' onClick={(e) => { e.stopPropagation(); handlePostDelete(post.Post_id);}}>
                              🗑️
                            </Button>
                          </div>
                        </div>
                      }
                    </div>
                  ))}
              </div>
            </div>
          );
    }

      
}
 
export default PostContent;