import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useState,useEffect } from "react";
import { User } from "firebase/auth";
import Fetch_Explore_Items_Offset_Middleware from "@/lib/mySQL/client_side/GET/Fetch_Explore_Items_Offset_Middleware"
import {useExploreContext} from './ExploreContext'

interface Post_Explore_Prop {
    user: User;
}

const Post_Explore: React.FC<Post_Explore_Prop> = ({user}) => {

    const [searchQuery,setSearchQuery] = useState('')

    const { currentPage,setCurrentPage } = useExploreContext();


    //set the current page to 1 on first component render
    useEffect(() => {
        setCurrentPage(1); // Set the default value only on the first page load
      }, []); // Empty dependency list ensures it runs only once after the initial render

    const handleSearchClick = async() => {
        const userToken = await user.getIdToken()
        console.log('Search Query:', searchQuery); // Log or handle the search query when the button is clicked
        const items = await Fetch_Explore_Items_Offset_Middleware(userToken,'Posts',currentPage,searchQuery)
        console.log("fetched items:",items)
      };

      const handleInputChange = (event:any) => {
        setSearchQuery(event.target.value); // Update state with input value
      };

    return ( 
        <div className="flex flex-row">
            <Input type="post" value={searchQuery} onChange={handleInputChange} placeholder="search post here" />
            <Button  onClick={handleSearchClick}>Search</Button>
        </div>
     );
}
 
export default Post_Explore;