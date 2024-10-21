'use client'

import  Header  from '@/app/tests/react_practice/header'
import NameList from '@/app/tests/react_practice/list_of_names' 
import { handleClick } from  '@/app/tests/react_practice/list_of_names'
import DisplayLikes from '@/app/tests/react_practice/state_example'

const Home = () => {
    return ( 
    <div>
        <Header title="poggers"/>
        <NameList />
        <DisplayLikes />
        <button onClick={handleClick}>Like</button>
    </div> );
}
 
export default Home;