import { convertEditorjsDataToHumanReadable } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
import { User } from 'firebase/auth';

export interface Post {
  Post_id: number;
  Post_title: string;
  Comment_settings: number;
  Is_post_public: {
    type: string;
    data: number[]; // Buffer data is usually an array of numbers
  };
  Post_content: string; // JSON content, which you can parse if needed
  Blog_id: number;
  User_email: string;
  created_at: string; // ISO 8601 string for the timestamp
}

interface PostDetailsProp {
  postDetails: Post;
  user: User;
}

const Post_Card: React.FC<PostDetailsProp> = ({ postDetails,user }) => {
  const router = useRouter();

  const handleClick = (postId: number, blogId: number) => {
    router.push(`/post_editor?postId=${postId}&blogId=${blogId}`);
  };

  return (
    <div
      className="flex flex-col p-6 w-full max-w-4xl bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
      onClick={() => handleClick(postDetails.Post_id, postDetails.Blog_id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col space-y-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">{postDetails.Post_title}</h3>

        {/* User Email */}
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">By:</span> {user.displayName}
        </p>

        {/* Content */}
        {postDetails.Post_content && (
          <p className="text-gray-700 text-sm line-clamp-3">
            {convertEditorjsDataToHumanReadable(postDetails.Post_content)}
          </p>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{new Date(postDetails.created_at).toLocaleDateString()}</span>
        <button
          className="text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent `onClick` from firing
            handleClick(postDetails.Post_id, postDetails.Blog_id);
          }}
        >
          View Post
        </button>
      </div>
    </div>
  );
};

export default Post_Card;
