import { Button } from '@/components/ui/button'

const Sidebar_Left = () => {
    return ( 
        <div className=" flex flex-col p-6 w-40 h-full justify-center items-center bg-slate-400">
            
            <Button variant="ghost" size="lg">
                Make New Blog
            </Button>
            <Button variant="ghost" size="sm">
                Make New Post
            </Button>
            <Button variant="ghost" size="sm">
                Comment Dashboard
            </Button>
            <Button variant="ghost" size="sm">
                Blog Dashboard
            </Button>
            <Button variant="ghost" size="sm">
                Explore
            </Button>
        </div>
     );
}
 
export default Sidebar_Left;