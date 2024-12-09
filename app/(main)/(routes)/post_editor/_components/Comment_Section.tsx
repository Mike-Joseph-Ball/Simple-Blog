import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"

import Fetch_Number_Of_Comments_Middleware from "@/lib/mySQL/client_side/GET/Fetch_Number_Of_Comments_Middleware";
import { useEffect,useState } from "react";
import { User } from 'firebase/auth';
import Link from 'next/link'
import CommentBox from "./Comment_Box";
import { useSearchParams } from 'next/navigation';

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
    const [currentPage,setCurrentPage] = useState<number>(1)


    useEffect(() => {
        if(searchParams){
            const page = parseInt(searchParams.get('commentPage') || '1', 10);
            setCurrentPage(page);
        }
    }, [searchParams]);

    //We will define pagination, and then pass the current page to the comment box




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
    function setNewUrl(newCurrentPage: string): string | undefined {
      if (searchParams && numComments) {
        console.log('searchParams:',searchParams)
        const params = new URLSearchParams(searchParams);
    
        // Determine if the current page is the last one
        const isLastPage = currentPage >= Math.ceil(numComments / 10);
    
        // Add or update the `commentPage` parameter
          params.set('commentPage', newCurrentPage);
          console.log('newParams:',params)
          console.log('newParamsString:',params.toString())
          return params.toString();
      }
      console.log('make it here')
      return ''
    }
    

      



    if(user && numComments !== null && searchParams) {
        //we need to have the pagination directly in the comment section so it can update state variables
        return (
            <div>

            <CommentBox user={user} currentPage={currentPage} postId={postId}/>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={currentPage > 1 ? '/post_editor?'+setNewUrl((currentPage-1).toString()) : '/post_editor?'+searchParams.toString()} />
                </PaginationItem>
                {Array.from({ length: Math.max(1, Math.ceil(numComments / 10)) }, (_, i) => (
                        <PaginationItem key={i}>
                        <PaginationLink href={'/post_editor?'+setNewUrl((i+1).toString())} isActive={currentPage === i + 1}>
                            {(i+1)*10}
                        </PaginationLink>
                        </PaginationItem>
            )   )}
                 {/*
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                */}
                <PaginationItem>
                  <PaginationNext  href={currentPage >= Math.ceil(numComments / 10) ? '/post_editor?'+searchParams.toString() : '/post_editor?'+setNewUrl((currentPage-1).toString())} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            </div>
        )

    }

}
 
export default Comment_Section;