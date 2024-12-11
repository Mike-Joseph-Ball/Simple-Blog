/*import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
*/
import Fetch_Number_Of_Comments_Middleware from "@/lib/mySQL/client_side/GET/Fetch_Number_Of_Comments_Middleware";
import { useEffect,useState,createContext } from "react";
import { User } from 'firebase/auth';
import CommentBox from "./Comment_Box";
import { useSearchParams } from 'next/navigation';
import Pagination_Component from "./Pagination_Component";
import { PaginationProvider } from "./PaginationContext";

interface CommentSectionProp {
    user: User | null;
    postId: string;
}

const Comment_Section: React.FC<CommentSectionProp> = ({user,postId}) => {

    const searchParams = useSearchParams()
    if(!searchParams) {
      return('URL is completely empty.')
    }
    const [numComments,setNumComments] = useState(null)

    //retrieve the number of comments the post has to inform the pagination
    useEffect(() => {
        const retrieveNumComments = async () => {
            if(!user) {
                return
            }
            const userToken = await user.getIdToken()
            const resp = await Fetch_Number_Of_Comments_Middleware(userToken,postId)
            console.log('response:',resp)
            const numberOfComments = resp.res[0].commentCount
            console.log('num comments:',numberOfComments)   
            setNumComments(numberOfComments)
        }
        retrieveNumComments()
    },[])

    //used to set the URL to the correct commentPage
    
    

      



    if(user && numComments !== null && searchParams) {
        //we need to have the pagination directly in the comment section so it can update state variables
        return (
            <div>
            <PaginationProvider>
              <CommentBox user={user} postId={postId}/>
              <Pagination_Component numComments={numComments}/>
            </PaginationProvider>
            </div>
        )

    }

}
 
export default Comment_Section;