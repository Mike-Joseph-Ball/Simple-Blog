import React, { createContext, useContext, useState } from "react";

// Define the structure of the context
interface PaginationContextProps {
  currentPage: number; // The current page
  setCurrentPage: (page: number) => void; // Function to update the current page
}

// Create the context with default values
const PaginationContext = createContext<PaginationContextProps | undefined>(undefined);

// Context Provider to wrap components
export const PaginationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1); // Shared state
  return (
    <PaginationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PaginationContext.Provider>
  );
};

// Hook for components to access the context
export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error("usePagination must be used within a PaginationProvider");
  }
  return context;
};
