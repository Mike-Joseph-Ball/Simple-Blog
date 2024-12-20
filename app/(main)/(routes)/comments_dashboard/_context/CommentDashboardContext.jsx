'use client'
import React, { createContext, useContext, useState } from "react";

const CommentDashboardContext = createContext();

// Custom hook to use the context
export const useCommentDashboardContext = () => useContext(CommentDashboardContext);

export const CommentDashboardProvider = ({ children }) => {
  const [postsToDisplay,setPostsToDisplay] = useState([])
  const [blogsToDisplay, setBlogsToDisplay] = useState([])
  const [currentPage,setCurrentPage] = useState(1)
  const [numItems,setNumItems] = useState(0)
  const [showApprovedComments,setShowApprovedComments] = useState(false)
  const [showCommentsPendingApproval,setShowCommentsPendingApproval] = useState(false)
  const [showDeniedComments,setShowDeniedComments] = useState(false)

  return (
    <CommentDashboardContext.Provider value={{ postsToDisplay, setPostsToDisplay, blogsToDisplay, setBlogsToDisplay, currentPage, setCurrentPage, numItems, setNumItems,showApprovedComments,setShowApprovedComments,showCommentsPendingApproval,setShowCommentsPendingApproval,showDeniedComments,setShowDeniedComments}}>
      {children}
    </CommentDashboardContext.Provider>
  );
};
