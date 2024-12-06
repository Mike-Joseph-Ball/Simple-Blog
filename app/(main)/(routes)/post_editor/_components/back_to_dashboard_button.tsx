import { Button } from '@/components/ui/button';
import  Link  from 'next/link';

interface dashboardButtonProps {
    blogId: string;
}


const BackToDashboardButton: React.FC<dashboardButtonProps> = ({blogId}) => {


    return ( 
        <Link href={{
            pathname: '/dashboard', // Destination page
            query: { blogId: blogId }, // Query parameters
        }}>
                <Button variant="secondary">Return to Blog</Button>
            </Link>
     );
}
 
export default BackToDashboardButton;