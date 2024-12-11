'use client'
import Navbar from "./_components/Navbar";
import {ExploreProvider,useExploreContext} from './_components/ExploreContext'
import Blog_Explore from "./_components/Blog_Explore";
import Post_Explore from "./_components/Post_Explore";
import User_Explore from "./_components/User_Explore";
import useCurrentFirebaseUserVerify from '@/lib/_firebase/local_authentication/Is_Token_Legitimate_Middleware'
import Pagination_Component from "./_components/Pagination_Component";
const ExplorePage = () => {

    //explore page is seperated into posts and blogs. Each has a search bar. 
    const { activeTab, setActiveTab } = useExploreContext();


    const {user,isValid} = useCurrentFirebaseUserVerify();
    console.log('user:',user)
    console.log('isValid:',isValid)
    if(isValid === false) {
        return('User session is not valid')
    }
    if(user) {
        return (<div className="flex justify-center items-center flex-col">
            <Navbar/>
            {activeTab === 'Blogs' && <Blog_Explore />}
            {activeTab === 'Posts' && <Post_Explore user={user}/>}
            {activeTab === 'Users' && <User_Explore />}
            {activeTab && <Pagination_Component/>}
        </div>);
    }
}
 
export default ExplorePage;