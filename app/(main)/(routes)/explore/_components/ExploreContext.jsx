'use client'
import React, { createContext, useContext, useState } from "react";

// Create the context
const ExploreContext = createContext();

// Custom hook to use the context
export const useExploreContext = () => useContext(ExploreContext);

// Context provider
export const ExploreProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Blogs');
  const [currentPage,setCurrentPage] = useState(1)
  const [numItems,setNumItems] = useState(0)
  const [searchBox,setSearchBox] = useState()

  return (
    <ExploreContext.Provider value={{ activeTab, setActiveTab, currentPage, setCurrentPage, numItems, setNumItems, searchBox, setSearchBox }}>
      {children}
    </ExploreContext.Provider>
  );
};
