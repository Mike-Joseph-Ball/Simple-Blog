// Context.tsx
'use client'
import React, { createContext, useContext, useState } from "react";

// Define context type
interface AppContextType {
  alertMessage: string;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider component
export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <AppContext.Provider value={{ alertMessage, setAlertMessage }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
