
import { useState } from 'react';

export const useSidebarToggle = (initialState: boolean = false) => {
  const [showSidebar, setShowSidebar] = useState(initialState);
  
  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };
  
  return {
    showSidebar,
    setShowSidebar,
    toggleSidebar
  };
};
