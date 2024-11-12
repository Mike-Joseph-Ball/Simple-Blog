'use client'

import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import ImageTool from '@editorjs/image';
import useLocalUserAuth from '@/lib/_firebase/local_authentication/return_local_authentication';
import { useSearchParams } from 'next/navigation'

const Rich_Text_Editor = () => {
  const editorRef = useRef<EditorJS | null>(null); 
  const initEditorCalled = useRef(false); // To prevent double initialization
  const [user] = useLocalUserAuth();
  const userEmail =  user?.email

  //Get paramas
  const searchParams = useSearchParams()
  const postId = searchParams?.get('postId')

  // Initialize EditorJS
  const initEditor = () => {
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
                        //FormData is a native JS class that provides a way to construct key:value pairs
                        //representing form fields and their values. Used for sending form data like files
                        //formData can contain a mix of text and binary data. This is why I use formData here
                        //Not having to include extra encoding for the binary image files makes it preferred
                        const formData = new FormData();
                        formData.append('file',file)
                        formData.append('filename',file.name)
                        //postId might not be in the url
                        if(postId) {
                            formData.append('postId',postId)
                        }
                        //userEmail might not be found. Client side JWT may be corrupted or missing
                        const userToken = await user?.getIdToken()
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
                                        url: data.url, // Your backend should return the image URL
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
    });
  };

  // Use `useEffect` to initialize once
  useEffect(() => {
    if (!initEditorCalled.current) {
      initEditor();
      initEditorCalled.current = true;
    }

    // Clean up on unmount
    //return () => {
    //  if (editorRef.current) {
    //    editorRef.current.destroy();
    //  }
    //};
  }, []);

  // Save editor content
  const savePostToJSON = async () => {
    try {
      if (editorRef.current) {
        const savedData = await editorRef.current.save();
        console.log('Editor data:', JSON.stringify(savedData, null, 4));
      }
    } catch (error) {
      console.log("Saving error", error);
    }
  };

  return (
    <div className="p-4">
      <div id="editorjs" className="min-h-[300px] text-left border p-4 mb-4"></div>
      <button onClick={savePostToJSON}>Save Content</button>
    </div>
  );
};

export default Rich_Text_Editor;
