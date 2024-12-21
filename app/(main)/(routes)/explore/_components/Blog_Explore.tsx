import { Input } from "@/components/ui/input"
import {useExploreContext} from './ExploreContext'
import { Button } from "@/components/ui/button";
import React, { useEffect,useState } from 'react'
import { User } from "firebase/auth";
import Fetch_Explore_Items_Offset_Middleware from "@/lib/mySQL/client_side/GET/Fetch_Explore_Items_Offset_Middleware"
import Blog_Card from "./item_cards/Blog_Card";

interface Blog {
    Blog_id: number;
    blog_title: string;
    blog_description: string;
    comment_settings_default: string;
    blog_template_style: string,
    user_email: string,
    created_at: string
}

interface Blog_Explore_Prop {
    user: User;
}

const Blog_Explore: React.FC<Blog_Explore_Prop> = ({user}) => {


    const [searchQuery,setSearchQuery] = useState('')
    const [searchResult,setSearchResult] = useState([])
    const { currentPage,setCurrentPage,setNumItems } = useExploreContext();
    //const [stateCurrentPage,setStateCurrentPage] = useState(currentPage)
    const [isFirstRender, setIsFirstRender] = useState(true);


    //we need to run a useEffect that sets a state variable every time a button 
    //set the current page to 1 on first component render
    useEffect(() => {
        setCurrentPage(1); // Set the default value only on the first page load
        setNumItems(0)
      }, []); // Empty dependency list ensures it runs only once after the initial render

    //whenever currentPage changes, searchResult should also change. We can set the state variable to change 
    // when searchResult changes so that the component actually refreshes
    useEffect(() => {
        console.log('setting blog state var:')
        //setStateCurrentPage(currentPage)
    },[searchResult])

      const handleSearchClick = async() => {
        const userToken = await user.getIdToken()
        console.log('search query:',searchQuery)
        const items = await Fetch_Explore_Items_Offset_Middleware(userToken,'Blogs',currentPage,searchQuery)
        console.log('fetched blogs:',items)
        const numPosts = items.totalCount
        setSearchResult(items.res)
        setNumItems(numPosts)
      }

    //This will perform a new search when the pagination changes the currentPage
    useEffect(() => {
        if (isFirstRender) {
          setIsFirstRender(false); // Set the flag to false after the first render
          return;
        }
        handleSearchClick();
    }, [currentPage]);

      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
      }

    return ( 
        <div>
            <div className="flex flex-row">
                <Input type="blog" value={searchQuery} onChange={handleInputChange} placeholder="search blog here" />
                <Button onClick={handleSearchClick} >Search</Button>
            </div>

            {searchResult.map((blog:Blog) => (
                <Blog_Card key={blog.Blog_id} blogDetails={blog} user={user} />
            ))}

        </div>
    );
}
 
export default Blog_Explore;