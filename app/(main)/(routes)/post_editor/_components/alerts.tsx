import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppContext } from "@/app/context";
import { useState, useEffect } from "react";


const SimpleBlogAlert = () => {
  const { alertMessage, setAlertMessage } = useAppContext();
  const [stateAlertMessage, setStateAlertMessage] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (alertMessage) {
      setStateAlertMessage(alertMessage);
      setIsVisible(true); // Fade in when the alert message is set

      // Fade out after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false); // This triggers fade-out
        setAlertMessage(""); // Clear the context alert message
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alertMessage, setAlertMessage]);


  const handleTransitionEnd = () => {
    if (!isVisible) {
      setAlertMessage(""); // Clear the context alert message after fade-out
    }
  };

  return (
    stateAlertMessage && (
      <Alert
        className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}
        fixed top-0 right-0 z-50 m-4`}
        onTransitionEnd={handleTransitionEnd}
      >
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>{alertMessage}</AlertDescription>
      </Alert>
    )
  );
};

export { SimpleBlogAlert };
