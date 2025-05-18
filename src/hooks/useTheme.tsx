
import React, { createContext, useContext } from "react";

interface ThemeContextProps {
  theme: "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always set dark theme
  const theme = "dark";
  
  // Apply dark theme
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    
    // Always ensure dark mode is applied
    document.documentElement.classList.add("dark");
    
    // Debug log
    console.log("Theme enforced as: dark");
  }, []);

  // Toggle function is a no-op now (for API compatibility)
  const toggleTheme = () => {
    console.log("Theme toggle attempted, but only dark theme is available");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
