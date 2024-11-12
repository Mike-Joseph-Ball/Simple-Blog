'use client'
//import Rich_Text_Editor from "./Rich_Text_Editor";
import dynamic from 'next/dynamic';

// Import dynamically with `ssr: false`
const Rich_Text_Editor = dynamic(() => import('./Rich_Text_Editor'), { ssr: false });

const Post_Editor = () => {
    return (<div>
        <Rich_Text_Editor />
    </div>);
}
 
export default Post_Editor;