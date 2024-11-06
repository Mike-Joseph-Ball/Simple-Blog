import Sidebar_Left from '@/app/(main)/(routes)/dashboard/_components/sidebar_left'
import PostContent from '@/app/(main)/(routes)/dashboard/_components/post_content'

const Dashboard = () => {
    return ( 
        <div className=" h-full flex flex-row">
            <div>
                <Sidebar_Left />
            </div>
            <div className='w-full'>
                <PostContent />
            </div>
        </div>
     );
}
 
export default Dashboard;