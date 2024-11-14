import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const setDefaultBlogInLocalStorage = (userEmail:string, defaultBlogId:Number) => {
  localStorage.setItem(`defaultBlog_${userEmail}`, defaultBlogId.toString());
};

const getDefaultBlogFromLocalStorage = (userEmail:string) => {
  return localStorage.getItem(`defaultBlog_${userEmail}`);
};

export { getDefaultBlogFromLocalStorage, setDefaultBlogInLocalStorage}