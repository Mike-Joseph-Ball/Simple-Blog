import { Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"


type SuccessAlertProps = {
    successMessage:string;
  }

const SuccessAlert: React.FC<SuccessAlertProps> = ({successMessage}) => {
    return(
    <Alert>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>
            {successMessage}
        </AlertDescription>
    </Alert>
    )
}
 
export  { SuccessAlert };