import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OutputData } from '@editorjs/editorjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Blog {
  Blog_id: number;
  blog_title: string;
  blog_description: string;
  comment_settings_default: string;
  blog_template_style: string,
  user_email: string,
  created_at: string
}

export interface BlogDetails {
  defaultBlog: Blog;
  post_count: number;
}

const setDefaultBlogInLocalStorage = (userEmail:string, defaultBlogDetails:BlogDetails) => {
  localStorage.setItem(`defaultBlog_${userEmail}`, JSON.stringify(defaultBlogDetails));
};

const getDefaultBlogFromLocalStorage = (userEmail:string) => {
  return localStorage.getItem(`defaultBlog_${userEmail}`);
};

const convertEditorjsDataToHumanReadable = (editorJsData:string) => {

  /*
  we're expecting a string with the OutputData format. 
  interface OutputData {
  time: number,
  blocks: Array<{
    type: string;
    data: Record<string, unknown>;
  }>;
  version: string
  }
  */

/*
 const sample:OutputData = {
  time: 1733358914365,
  blocks:[{"id":"D7Tb265gSl","type":"paragraph","data":{"text":"Wow!!!"}},{"id":"jk2zo5i0Tm","type":"paragraph","data":{"text":"Epic"}},{"id":"Sc53Wlq2Zo","type":"header","data":{"text":"OMGGGG!!!","level":2}}],
  version: '123'
 }
  */


 let returnString = ''
 const editorJsDataObj:OutputData = JSON.parse(editorJsData)
  //console.log("editorJsDataObj Type:",typeof(editorJsDataObj))
  //console.log("editorJsDataObj:",editorJsDataObj)
  //console.log('editorJsDataObj Blocks:',editorJsDataObj.blocks)
 //console.log('sample Type:',typeof(sample))
 if(editorJsDataObj.blocks.length === 0) {
  console.log('there are no blocks. return!')
  return
 }
 for(let i = 0;i < editorJsDataObj.blocks.length;i++) {
  if(editorJsDataObj.blocks[i].data) {
    if(returnString.length > 100) {
      const trimmedReturnString = returnString.substring(0,100) + '...[click post to continue reading]'
      return trimmedReturnString
     }
    if(editorJsDataObj.blocks[i].data.text === undefined)
      continue
    
    returnString += ' ' + editorJsDataObj.blocks[i].data.text.replace('<br>','')
  }
 }

 return returnString


}

const convert8061TimeToHumanReadable = (dateString:string) => {
  const date = new Date(dateString);

  //Intl is a built in global JS object that provides internationalization utilities.
  //format numbers, dates, currencies, etc

  // Get user's timezone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: userTimeZone, // Use user's timezone here
  };

  // Format date
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Add ordinal suffix to the day
  const day:number = date.getDate(); // Use local day (based on the user's timezone)
  const ordinalSuffix = (n:number) =>
      ['th', 'st', 'nd', 'rd'][
          (n % 100 > 10 && n % 100 < 14) || n % 10 > 3 ? 0 : n % 10
      ];
  const dayWithSuffix = `${day}${ordinalSuffix(day)}`;

  // Replace the day in the formatted string
  const finalString = formattedDate.replace(day.toString(), dayWithSuffix);

  return finalString
  // Output (based on user timezone): "December 9th, 2024, 7:53 PM"

}

export { getDefaultBlogFromLocalStorage, setDefaultBlogInLocalStorage, convertEditorjsDataToHumanReadable,convert8061TimeToHumanReadable}