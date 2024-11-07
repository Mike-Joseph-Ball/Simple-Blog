'use client'

import EditorJS, { ToolConstructable } from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import ImageTool from '@editorjs/image'
//import LinkTool from '@editorjs/link';
//import TextAlign from "@canburaks/text-align-editorjs"

const Rich_Text_Editor = () => {

    const editor = new EditorJS({
    /** 
     * Id of Element that should contain the Editor 
     */ 
    holder: 'editorjs', 
    logLevel: 'ERROR' as any,

     /** 
     * Available Tools list. 
     * Pass Tool's class or Settings object for each Tool you want to use 
     */ 
        tools: { 
            header: {
                class: Header as unknown as ToolConstructable, 
                inlineToolbar: ['link'] 
            }, 
            list: { 
                class: List as unknown as ToolConstructable, 
                inlineToolbar: true 
            },
            image: {
                class: ImageTool,
                config: {
                  endpoints: {
                    byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                    byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                  }
                }
            }, /*
            linkTool: {
                class: LinkTool,
                config: {
                  endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
                }
            }
            */
            
        },

        /**
        * onReady callback
        */
        onReady: () => { console.log('Editor.js is ready to work!') },

        /**
        * onChange callback
        */
        onChange: (api,event) => {console.log("Editor's content changed!")},
            
    /**
     * Previously saved data that should be rendered
     */
    });

    async function savePostToJSON() {
        const output = document.getElementById('output');
        try {
            const savedData = await editor.save()
            console.log("Editor Data:",savedData)
            if(output) {
                output.innerHTML = JSON.stringify(savedData, null, 4);
            }
        } catch(error) {
            console.log("there was an issue with saving the editor")
        }

    }

    return (
        <div className="p-4">
            <div className='flex flex-col justify-start'>
                <div id="editorjs" className="min-h-[300px] text-left border p-4 mb-4 break-words overflow-hidden">
                </div>
            <pre id="output"></pre>
            <button onClick={savePostToJSON}>Save Form</button>
            </div>
        </div>
    );
}
 
export default Rich_Text_Editor;

/*
editor.save().then((outputData) => {
    console.log('Article data: ', outputData)
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });

*/
