import React from "react";
import { usePagination } from "./PaginationContext";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'
import { useEffect } from "react";

interface PaginationProps {
    numComments: number;
}

const Pagination_Component: React.FC<PaginationProps> = ({numComments}) => {

    const { currentPage, setCurrentPage } = usePagination(); // Access the shared state and setter
    const searchParams = useSearchParams()

    useEffect(() => {
        if(searchParams){
            const page = parseInt(searchParams.get('commentPage') || '1', 10);
            setCurrentPage(page);
            console.log('comment section currentPage:',currentPage)
        }
    }, [searchParams]);

    function setNewUrl(newCurrentPage: number): string | undefined {

        if (searchParams && numComments) {
          console.log('searchParams:',searchParams)
          const params = new URLSearchParams(searchParams);
      
          // Determine if the current page is the last one
          const isLastPage = currentPage >= Math.ceil(numComments / 10);
      
          // Add or update the `commentPage` parameter
            params.set('commentPage', newCurrentPage.toString());
            console.log('newParams:',params)
            console.log('newParamsString:',params.toString())
            //setCurrentPage(newCurrentPage)
            return params.toString();
        }
        console.log('make it here')
        return ''
      }

    if(searchParams) {
        return (
            <Pagination>
                <PaginationContent>
                  <PaginationItem>
                      <Link
                      href={
                        currentPage > 1
                          ? "/post_editor?" + setNewUrl((currentPage - 1))
                          : "/post_editor?" + searchParams.toString()
                        }
                        scroll={false}
                      >
                      {<PaginationPrevious/>}
                    </Link>
        
                  </PaginationItem>
                  {Array.from({ length: Math.max(1, Math.ceil(numComments / 10)) }, (_, i) => (
                          <PaginationItem key={i}>
                            {/* Use Link for client-side navigation */}
                            <Link
                              href={"/post_editor?" + setNewUrl((i + 1))}
                              passHref
                              scroll={false}
                            >{
                              <PaginationLink href={'/post_editor?'+setNewUrl((i+1))} isActive={currentPage === (i+1)}>
                                {(i+1)*10}
                              </PaginationLink>
                        }</Link>
        
                          </PaginationItem>
              )   )}
                   {/*
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  */}
                  <PaginationItem>
                  <Link
                      href={
                        currentPage <= Math.ceil(numComments / 10)
                          ? "/post_editor?" + setNewUrl((currentPage + 1))
                          : "/post_editor?" + searchParams.toString()
                        }
                        scroll={false}
                      >
                      {<PaginationNext/>}
                    </Link>
                  </PaginationItem>
                </PaginationContent>
            </Pagination> );
    }

}
 
export default Pagination_Component;