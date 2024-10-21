import Image from 'next/image'
import ReturnDifferentTextSizes from './text_size';

const Home = () => {
    return ( 
    <div>
        <h1 className="bg-green-800 text-white text-sm lg:text-lg sm:text-base  lg:bg-slate-400">
            EPIC
        </h1> 
        <h1 className="text-vuejs-200 border-4 border-t-8 border-gray-950">
            EPIC
        </h1>

    <ReturnDifferentTextSizes />

    </div> 
    );
}
 
export default Home;