import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

interface BlogDetails {
  defaultBlog: Blog,
  post_count: 2
}

const setDefaultBlogInLocalStorage = (userEmail:string, defaultBlogDetails:BlogDetails) => {
  localStorage.setItem(`defaultBlog_${userEmail}`, defaultBlogDetails.toString());
};

const getDefaultBlogFromLocalStorage = (userEmail:string) => {
  return localStorage.getItem(`defaultBlog_${userEmail}`);
};

export { getDefaultBlogFromLocalStorage, setDefaultBlogInLocalStorage}