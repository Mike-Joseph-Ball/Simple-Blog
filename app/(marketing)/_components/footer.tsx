import  Logo  from '@/app/(marketing)/_components/logo'
import { Button } from '@/components/ui/button';

const Footer = () => {
    return ( <div className="flex items-center w-full p-6 bg-background dark:bg-[#1f1f1f]">
        <Logo />
        <div className="md:ml-auto w-full justify-between 
                        md:justify-end flex item-center 
                        gap-x-2 text-muted-foreground">
            <Button variant="ghost" size="sm">
                Privacy Policy
            </Button>
            <Button variant="ghost" size="sm">
                Terms and Conditions
            </Button>
        </div>

    </div> );
}
 
export default Footer;