import React from "react";
import { useExploreContext } from "./ExploreContext";
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
import { useEffect,useState } from "react";

/*
interface PaginationProps {
    numItems: number;
}
*/

const Pagination_Component = () => {

    const { currentPage, setCurrentPage, numItems, setNumItems} = useExploreContext(); // Access the shared state and setter
    const searchParams = useSearchParams()
    const [stateCurrentPage,setStateCurrentPage] = useState(1)

    //when the global variable currentPage is changed, we need to change the state variable to cause a reload
    useEffect(() => {
        console.log('stateCurrentPage:',currentPage)
        setStateCurrentPage(currentPage);
    }, [currentPage]);

    function setNewUrl(newCurrentPage: number): string | undefined {

        if (searchParams && numItems) {
          console.log('searchParams:',searchParams)
          const params = new URLSearchParams(searchParams);
      
          // Determine if the current page is the last one
          const isLastPage = currentPage >= Math.ceil(numItems / 10);
      
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
                    <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} />
                  </PaginationItem>
                  {Array.from({ length: Math.max(1, Math.ceil(numItems / 10)) }, (_, i) => (
                          <PaginationItem key={i}>
                            {/* Use Link for client-side navigation */}
                              <PaginationLink onClick={() => setCurrentPage(i+1)} isActive={currentPage === (i+1)}>
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
                      <PaginationNext onClick={() => currentPage <= Math.ceil(numItems / 10) && setCurrentPage(currentPage+1)}/>
                  </PaginationItem>
                </PaginationContent>
            </Pagination> );
    }

}
 
export default Pagination_Component;