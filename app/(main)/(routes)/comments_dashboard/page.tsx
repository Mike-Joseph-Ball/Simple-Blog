'use client';
import Navbar from './_components/Navbar';
import { useEffect, useState } from 'react';
import Query_Blogs_Associated_With_User from '@/lib/mySQL/client_side/GET/Query_Blogs_Associated_With_User';
import useCurrentFirebaseUserVerify from '@/lib/_firebase/local_authentication/Is_Token_Legitimate_Middleware';
import { useCommentDashboardContext } from './_context/CommentDashboardContext';
import Fetch_Blog_Details_And_Posts_Middleware from '@/lib/mySQL/client_side/GET/Fetch_Blog_Posts_Middleware';

const CommentsDashboard = () => {
  const { isValid, user } = useCurrentFirebaseUserVerify();
  const {
    setPostsToDisplay,
    setBlogsToDisplay,
  } = useCommentDashboardContext();

  // Loading state to track when both hooks are finished
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const TokenId = await user.getIdToken();

        // Fetch blogs and posts in parallel
        const [userBlogs, userPosts] = await Promise.all([
          Query_Blogs_Associated_With_User(TokenId),
          Fetch_Blog_Details_And_Posts_Middleware(TokenId, undefined),
        ]);

        // Update the context state
        setBlogsToDisplay(userBlogs.res || []);
        setPostsToDisplay(userPosts.associatedPosts || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Mark as finished
      }
    }

    fetchData();
  }, [user, setBlogsToDisplay]);

  if (isValid === false) {
    return <div>User session is not valid</div>;
  }

  if (isLoading) {
    return <div>Retrieving Comment Details...</div>;
  }

  return (
    <div>
      <Navbar />
      <div>Comment Dashboard Content</div>
    </div>
  );
};

export default CommentsDashboard;
