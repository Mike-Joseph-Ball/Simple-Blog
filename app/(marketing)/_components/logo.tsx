import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { cn } from '@/lib/utils';
import LightModeLogo from '@/app/images/Light-Mode-Logo.svg'

const font = Poppins({
    subsets: ['latin'],
    weight: ["400", "600"]
})

const Logo = () => {
    return ( 
    <div className=" hidden md:flex items-center gap-x-2">
        <Image src={LightModeLogo} height={40} width={40} alt="logo" />
        {/* Here cn is used in order to resolve on issues that may occur when merging these two classes.
            If cn were not used, there would be conflicts between these two classes that went unresolved*/}
        <p className={cn("font-semibold text-nowrap", font.className)}>Simple Blog</p>
    </div> );
}
 
export default Logo;