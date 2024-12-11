import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
const User_Explore = () => {
    return ( 
        <div className="flex flex-row">
            <Input type="user" placeholder="search user here" />
            <Button>Search</Button>
        </div>
     );
}
 
export default User_Explore;