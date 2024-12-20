'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { useState, useEffect } from "react";
import { useCommentDashboardContext } from "../_context/CommentDashboardContext";
import { Post } from "../../explore/_components/item_cards/Post_Card";
import { Blog } from "../../dashboard/page";
import { Input } from "@/components/ui/input";

const DropdownMenus = () => {
  const { postsToDisplay, blogsToDisplay } = useCommentDashboardContext();

  const [selectedBlog, setSelectedBlog] = useState<Blog | undefined>(undefined);
  //const [stateBlogsToDisplay,setStateBlogsToDisplay] = useState(blogsToDisplay)
  const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined);
  const [subsetOfPosts, setSubsetOfPosts] = useState(postsToDisplay);
  const [blogSearch,setBlogSearch] = useState('')
  const [postSearch,setPostSearch] = useState('')
  const [openPostMenu, setOpenPostMenu] = useState(false); // Track whether the menu is open or closed
  const [openBlogMenu, setOpenBlogMenu] = useState(false)
  useEffect(() => {
    setSubsetOfPosts(postsToDisplay);
  }, [postsToDisplay,blogsToDisplay]);

  function setBlogContents(blog: Blog) {
    const postsSubset = postsToDisplay.filter((post: Post) => {
        const isBlogMatch = post.Blog_id === blog.Blog_id;
        const isTitleMatch = post.Post_title.toLowerCase().includes(postSearch.toLowerCase());
        
        return isBlogMatch && isTitleMatch;
      });
    setSubsetOfPosts(postsSubset);
    setSelectedBlog(blog);
    setSelectedPost(undefined)
  }

  function setPostContents(post: Post) {
    setSelectedPost(post);
  }

    // Toggle the dropdown open/close
    const handleLabelBlogClick = () => {
        setSelectedBlog(undefined)
        setOpenBlogMenu(false); // Close the dropdown when the label is clicked
      };

    const handleLabelPostClick = () => {
        setSelectedPost(undefined)
        setOpenPostMenu(false);
    }

  return (
    <div className="flex items-center space-x-6 p-2">
      {/* Blog Search Box */}
      <div className="flex items-center space-x-2">
        <Input
          className="w-36 text-sm text-black border border-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          type="text"
          placeholder="Blog titles"
          value={blogSearch}
          onChange={(e) => setBlogSearch(e.target.value)}
        />
      </div>

      {/* Dropdown Blog Selector */}
      <DropdownMenu open={openBlogMenu} onOpenChange={setOpenBlogMenu}>
        <DropdownMenuTrigger className="px-4 py-2 text-sm border border-gray-600 rounded-md">
          {selectedBlog ? selectedBlog.blog_title : "Select Blog"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-48 overflow-y-auto border border-gray-600 rounded-md">
            <DropdownMenuLabel className="cursor-pointer" onClick={handleLabelBlogClick}>Clear Blog Selector</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 border-t border-gray-600" />
        {blogsToDisplay
            .filter((blog: Blog) => 
                blog.blog_title.toLowerCase().includes(blogSearch.toLowerCase())
            )
            .map((blog: Blog) => (
                <DropdownMenuItem
                key={blog.Blog_id}
                className="px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setBlogContents(blog)}
                >
                {blog.blog_title}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Post Search Box */}
      <div className="flex items-center space-x-2">
        <Input
          className="w-36 text-sm text-black border border-gray-600 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          type="text"
          placeholder="Post titles"
          value={postSearch}
          onChange={(e) => setPostSearch(e.target.value)}
        />
      </div>

      {/* Dropdown Post Selector */}
      <DropdownMenu open={openPostMenu} onOpenChange={setOpenPostMenu}>
        <DropdownMenuTrigger className="px-4 py-2 text-sm border border-gray-600 rounded-md">
          {selectedPost ? selectedPost.Post_title : "Select Post"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-48 overflow-y-auto border border-gray-600 rounded-md">
          <DropdownMenuLabel className="cursor-pointer" onClick={handleLabelPostClick}>Clear Post Selector</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 border-t border-gray-600" />
          {subsetOfPosts
            .filter((post: Post) => 
                post.Post_title.toLowerCase().includes(postSearch.toLowerCase())
            )
            .map((post: Post) => (
                <DropdownMenuItem
                key={post.Post_id}
                className="px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setPostContents(post)}
                >
                {post.Post_title}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/*Search Button*/}
      

    </div>
  );
};

export default DropdownMenus;
