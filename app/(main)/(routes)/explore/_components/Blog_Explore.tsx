import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
const Blog_Explore = () => {
    return ( 
        <div className="flex flex-row">
            <Input type="blog" placeholder="search blog here" />
            <Button>Search</Button>
        </div>
     );
}
 
export default Blog_Explore;