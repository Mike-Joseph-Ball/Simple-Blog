'use client'

import React, { useEffect, useRef, useState} from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import ImageTool from '@editorjs/image';
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useSearchParams } from 'next/navigation'
import Update_Post_Middleware from '@/lib/mySQL/client_side/PUT/Update_Post_Middleware';
import Fetch_Post_Given_Post_Id_Middleware from '@/lib/mySQL/client_side/GET/Fetch_Post_Given_Post_Id_Middleware';
import Toggle_Post_Visibility_Middleware from '@/lib/mySQL/client_side/PUT/Toggle_Post_Visibility_Middleware';
import { OutputData } from '@editorjs/editorjs';

//I tried to define editorJS's OutputData type myself but it looks like I can just import it. 

/*
interface OutputData {
  time: number,
  blocks: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
  version: string
}
*/


interface post {
  Post_id: number;
  Post_title: string;
  Is_post_public: number;
  Comment_settings: number;
  Post_content: string;
  User_email: string;
  Blog_id: number;
  Created_at: number;
}

type RichTextEditorProps = {
  postTitle: string;
  postContents: OutputData;
  postId: string;
}

const Rich_Text_Editor: React.FC<RichTextEditorProps> = ({postContents,postId,postTitle}) => {
  const editorRef = useRef<EditorJS | null>(null); 
  const initEditorCalled = useRef(false); // To prevent double initialization
  const [userToken,setUserToken] = useState<string|null>(null)
  const [pageLoaded,setPageLoaded] = useState<boolean|null>(null)


  //const [savedPostContent, setSavedPostContent] = useState<OutputData | undefined>(undefined);
  const [user] = useLocalUserAuth();
  
  // Initialize EditorJS
  //userToken is needed for uploading images. 
  const initEditor = (userToken:string) => {
    if(initEditorCalled.current){
      console.log("initEditor was attempted to be called but it was already initialized")
      return
    }
    console.log('initEditor Being Initialized for the 1st time...')
    console.log('Saved Post Contents Right Before Editor Initialization:',postContents)
    editorRef.current = new EditorJS({
      holder: 'editorjs',
      tools: { 
        header: Header,
        list: List,
        image: {
            class: ImageTool,
            config: {
                endpoints: {
                //This endpoint is meant to handle uploading images from the computer. 
                //editorjs expects the endpoint here to save the file, and then return JSON in their specified
                //format. There has to be a server answer. Only argument that will be passed to this endpoint
                //is a File. This likely means this uploadFile URL will have to be client middleware because the request
                //needs more information like user state info
                byFile: `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/db/put/Create_Image`, // Your backend file uploader endpoint
                byUrl: `${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/api/db/put/Fetch_URL`, // Your endpoint that provides uploading by Url
                },
                uploader: {
                    //Editorjs internally calls uploadByFile
                    async uploadByFile(file:any) {
                      console.log("entered uploadByFile function")
                        //FormData is a native JS class that provides a way to construct key:value pairs
                        //representing form fields and their values. Used for sending form data like files
                        //formData can contain a mix of text and binary data. This is why I use formData here
                        //Not having to include extra encoding for the binary image files makes it preferred
                        const formData = new FormData();
                        formData.append('file',file)
                        formData.append('filename',file.name)
                        //postId might not be in the url
                        console.log("postId: ",postId)
                        if(postId) {
                            formData.append('postId', postId.toString())
                        }
                        //userEmail might not be found. Client side JWT may be corrupted or missing
                        if(!user) {
                          return(<div>No active user session. Please log in</div>)
                        }
                        const userToken = await user.getIdToken()
                        console.log("userToken: ",userToken)
                          if (userToken) {
                              formData.append('userToken', userToken);
                          }

                        return fetch(`/api/db/put/Create_Image`, {
                            method: 'POST',
                            headers: {
                                Authorization: `bearer: ${userToken}`
                            },
                            // when using form data, the browser auotmatically sets the conent type to
                            // multipart/form-data. the server doesn’t receive it as an easily accessible FormData object.
                            // Instead, it arrives as a multipart/form-data encoded payload, which is just a raw binary stream containing boundaries and encoded parts (each part corresponding to a field in the FormData object).
                            body: formData,
                        })
                        .then(response => response.json()) // Parse the JSON response
                            .then(data => {
                                // Return the response in the format Editor.js expects - verified
                                return {
                                    success: 1,
                                    file: {
                                        url: data.file.url, // Your backend should return the image URL
                                    },
                                };
                            })
                            .catch(error => {
                                console.error("Image upload failed:", error);
                                return {
                                    success: 0,
                                    message: "Image upload failed",
                                };
                            });

                    },
                    uploadByUrl(Url:string) {
                        console.log('hi')
                    }
                },
            },
        },
      },
      onReady: () => console.log("Editor is ready"),
      onChange: () => console.log("Content changed"),
      data: postContents
    });
  };



  // Use `useEffect` to initialize the editor once
  useEffect(() => {
    try{
      //check if the post is in the mySQL db with data already. If it is, set the state variable
        const initializeEditor = async () => {
          if(!user || initEditorCalled.current){
            console.warn("Editor is already initialized. Skipping reinitialization.");
            return
          }
          console.log('initializing editor...')
          const idToken = await user.getIdToken();
          setUserToken(idToken)
          initEditor(idToken);
          initEditorCalled.current = true;
          setPageLoaded(true)
        };
        initializeEditor();
    } catch (error) {
      console.log('error initializing editor: ',error)
      setPageLoaded(false)
    }
    // Cleanup function when the component unmounts
    //return () => {
    //  if (editorRef.current) {
    //    console.log("Destroying EditorJS instance");
    //    editorRef.current.destroy();
    //    editorRef.current = null; // Reset the reference
    //  }
    //  initEditorCalled.current = false; // Reset flag to allow reinitialization
    //};

  });



  // Save editor content
  const savePostToJSON = async () => {
    try {
      if(!userToken) {
        throw new Error('userToken somehow not defined by the time I save the post!')
      } else if (!postId) {
        throw new Error('postId is missing. cannot save post')
      }
      if (editorRef.current) {
        const savedData = await editorRef.current.save();
        const savedDataString = JSON.stringify(savedData)
        console.log("Saved Data String:",savedDataString)
        const title = document.getElementById('title') as HTMLInputElement;
        console.log('title:',title)
        const updatePostResponse = await Update_Post_Middleware(userToken,postId,title.value,savedDataString)
        if(updatePostResponse.success === false) {
          throw new Error('Update Post Failed',updatePostResponse)
        }
        //console.log('savedData',savedData)
        console.log('Editor data:', JSON.stringify(savedData, null, 4));
        console.log('Updating Post in DB response:',updatePostResponse)
        return(updatePostResponse)
      }
    } catch (error) {
      console.log("Saving error", error);
      return(error)
    }
  };

  const publishPost = async () => {
    try {
      const resultSave = await savePostToJSON()
      if(resultSave.success !== true) {
        throw new Error('saving post failed:',resultSave)
      }
      if(userToken && postId){
      const resultToggle = await Toggle_Post_Visibility_Middleware(userToken,postId.toString())
      if(resultToggle.success !== true) {
        throw new Error('toggle post visibility failed:',resultToggle)
      }
      } else {
        throw new Error('post publishing failed, userToken and/or postId is undefined')
      }
    } catch (error) {
      return {success:false,error:error}
    }
    //switches the published BIT on the post
  }

  if(!user) {
    return(<div>user session is missing</div>)
  } else {
    return (
      <div className="p-4">
        {pageLoaded && <input type="text" id='title' className="bg-transparent text-center block mx-auto p-2" defaultValue={postTitle}/> }
        <div id="editorjs" className="min-h-[300px] text-left border p-4 mb-4"></div>
        { pageLoaded &&
        <div className='flex flex-row justify-between'>
          <button onClick={savePostToJSON}>Save Post</button>
          <button onClick={publishPost}>Publish Post</button>
        </div>
        }
      </div>
    );
  }


};

export default Rich_Text_Editor;