import { User } from "firebase/auth";
import { convert8061TimeToHumanReadable } from '@/lib/utils'
interface commentObject {
    Comment_id: number;
    Comment_content: string;
    Post_id: number;
    User_email: string;
    created_at: string;
}

interface CommentObjectProps {
    commentObject: commentObject
    user: User;
}

const Comments_Template: React.FC<CommentObjectProps> = ({commentObject,user}) => {
    console.log('created_at',commentObject.created_at)
    return(
        <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200 space-y-2">
            {/* Username */}
            <div className="text-sm font-semibold text-gray-800">
                {user.displayName}
            </div>

            {/* Comment Content */}
            <div className="text-gray-600">
                {commentObject.Comment_content}
            </div>

            {/* Date */}
            <div className="text-xs text-gray-500">
                {convert8061TimeToHumanReadable(commentObject.created_at)}
            </div>
        </div>
    )

}
 
export default Comments_Template;