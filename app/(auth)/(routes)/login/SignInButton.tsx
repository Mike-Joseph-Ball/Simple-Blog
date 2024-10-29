import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const SignInButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/login')
    }
    
    return ( 
        <Button onClick={handleClick}>
            Sign In
        </Button>
     );
}
 
export default SignInButton;
