import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useState,useEffect } from "react";
import { User } from "firebase/auth";
import Fetch_Explore_Items_Offset_Middleware from "@/lib/mySQL/client_side/GET/Fetch_Explore_Items_Offset_Middleware"
import {useExploreContext} from './ExploreContext'
import Post_Card from "./item_cards/Post_Card";
import { Post } from "./item_cards/Post_Card";
interface Post_Explore_Prop {
    user: User;
}

const Post_Explore: React.FC<Post_Explore_Prop> = ({user}) => {

    const [searchQuery,setSearchQuery] = useState('')
    const [searchResult,setSearchResult] = useState([])
    const { currentPage,setCurrentPage,setNumItems } = useExploreContext();
    const [isFirstRender, setIsFirstRender] = useState(true);
    

    //set the current page to 1 on first component render
    useEffect(() => {
        setCurrentPage(1); // Set the default value only on the first page load
        setNumItems(0)
      }, []); // Empty dependency list ensures it runs only once after the initial render

    const handleSearchClick = async() => {
        const userToken = await user.getIdToken()
        console.log('Search Query:', searchQuery); // Log or handle the search query when the button is clicked
        const items = await Fetch_Explore_Items_Offset_Middleware(userToken,'Posts',currentPage,searchQuery)
        console.log("fetched posts:",items)
        setSearchResult(items.res)
        setNumItems(items.totalCount)
        console.log('total count:',items.totalCount)
      };

    //This will perform a new search when the pagination changes the currentPage
    useEffect(() => {
      if (isFirstRender) {
        setIsFirstRender(false); // Set the flag to false after the first render
        return;
      }
      handleSearchClick();
    }, [currentPage]);

      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value); // Update state with input value
      };

    return ( 
        <div>
            <div className="flex flex-row">
                <Input type="post" value={searchQuery} onChange={handleInputChange} placeholder="search post here" />
                <Button  onClick={handleSearchClick}>Search</Button>
            </div>

            {searchResult.map((post:Post) => (
                <Post_Card key={post.Post_id} postDetails={post} user={user}/>
            ))}
        </div>
     );
}
 
export default Post_Explore;