'use client'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'
import Blog_Explore from "./Blog_Explore"
import Post_Explore from "./Post_Explore"
import User_Explore from "./User_Explore"
import { useExploreContext } from "./ExploreContext"

const Navbar = () => {

    const { activeTab, setActiveTab } = useExploreContext();
    
    return (  
        <div>
            <Tabs defaultValue="Blogs" className="w-[400px]">
                <div className='flex justify-center items-center'>
                    <TabsList>
                        <TabsTrigger value="Blogs" onClick={() => setActiveTab('Blogs')}>Blogs</TabsTrigger>
                        <TabsTrigger value="Posts" onClick={() => setActiveTab('Posts')}>Posts</TabsTrigger>
                        <TabsTrigger value="Users" onClick={() => setActiveTab('Users')}>Users</TabsTrigger>
                    </TabsList>
                </div>
            </Tabs>
        </div>
    );
}
 
export default Navbar;