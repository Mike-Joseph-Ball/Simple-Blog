import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Fetch_Comments_Associated_With_Post_Middleware from "@/lib/mySQL/client_side/GET/Fetch_Comments_Associated_With_Post_Middleware"
import { User } from 'firebase/auth';
import { useState,useEffect } from "react";
import Create_Comment_Middleware from "@/lib/mySQL/client_side/PUT/Create_Comment_Middleware";
import Comments_Template from "./Comment_Template";
import { usePagination } from "./PaginationContext";

export interface Comment {
    Comment_id: number; // Auto-increment primary key
    Comment_content: string; // LONGTEXT
    User_email: string; // VARCHAR(100)
    Approved: boolean; // BIT (1 or 0 mapped to true/false in TypeScript)
    Post_id: number; // Foreign key referencing Posts(Post_id)
    created_at: string; // TIMESTAMP in ISO 8601 format (e.g., "2024-12-20T14:23:00Z")
  }

interface CommentBoxProps {
    user: User;
    postId:string;
}

const CommentBox: React.FC<CommentBoxProps> = ({user,postId}) => {

    const {currentPage} = usePagination()

    const [comments,setComments] = useState<Comment[]>([])
    const [userComment,setUserComment] = useState("")

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [stateCurrentPage,setStateCurrentPage] = useState(currentPage)

    useEffect(()  => {
        setStateCurrentPage(currentPage)
    },[currentPage])

    //current page determines which 10 comments to grab.
    //eg. current page = 2, grab comments 10-20

    console.log('comment box current page:',currentPage)
    console.log('comments:',comments)

    useEffect(() => {
        const getComments = async() => {
            console.log('postId:',postId)
            console.log('currentPage:',currentPage)
            const userToken = await user.getIdToken()
            const resp = await Fetch_Comments_Associated_With_Post_Middleware(userToken,postId,currentPage)
            setComments(resp.res)   
            console.log('comments in current offset:',resp.res)
        }
        getComments()
    },[currentPage])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault(); // Stops the form's default behavior
        const userToken = await user.getIdToken()
        const resp = await Create_Comment_Middleware(userToken,userComment,postId)
        if(resp.success === true) {
            console.log(" Successfully Submitted comment:", userComment);
        } else {
            console.log("Unsuccessfully submitted content: ",resp.error)
        }
    };    

    if(comments !== undefined) {
        return (
            <div>
                {/*comment box form*/}
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="message">Your Comment</Label>
                        <Textarea
                        placeholder="Type your comment here."
                        id="message"
                        value={userComment} // Bind value to state
                        onChange={(e) => setUserComment(e.target.value)} // Update state on change
                    />                    
                    <Button  type="submit">Post Comment</Button>
                    </div>
                </form>
                {/*post comments - should only show 10 at a time*/}
                <h1>Comments</h1>
                <div>
                {comments.map((comment:Comment) => (
                <div key={comment.Comment_id} className="comment">
                    <Comments_Template commentObject={comment} user={user}/>
                </div>
                ))}

                </div>

            </div>
          )
    }
}
 
export default CommentBox;