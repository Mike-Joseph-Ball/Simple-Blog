import { convertEditorjsDataToHumanReadable } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React from 'react';
import { User } from 'firebase/auth';
interface Blog {
    Blog_id: number;
    blog_title: string;
    blog_description: string;
    comment_settings_default: string;
    blog_template_style: string,
    user_email: string,
    created_at: string
}

interface BlogDetailsProp {
  blogDetails: Blog;
  user: User;
}

const Blog_Card: React.FC<BlogDetailsProp> = ({ blogDetails,user }) => {

  const router = useRouter();
  let displayName

  const handleClick = (blogId: number) => {
    router.push(`/dashboard?blogId=${blogId}`);
  };

  return (
    <div
      className="flex flex-col p-6 w-full max-w-4xl bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
      onClick={() => handleClick(blogDetails.Blog_id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col space-y-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900">{blogDetails.blog_title}</h3>

        {/* User Email */}
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">By:</span> {user.displayName}
        </p>

        {/* Blog Description */}
        {blogDetails.blog_description && (
          <p className="text-gray-700 text-sm line-clamp-3">
            {blogDetails.blog_description}
          </p>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{new Date(blogDetails.created_at).toLocaleDateString()}</span>
        <button
          className="text-blue-600 hover:underline"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent `onClick` from firing
            handleClick(blogDetails.Blog_id);
          }}
        >
          View Blog
        </button>
      </div>
    </div>
  );
};

export default Blog_Card;
