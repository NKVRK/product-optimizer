import { createContext, useContext, useState, useEffect } from 'react';

// Create a React context to hold theme-related state.
const ThemeContext = createContext();

// Custom hook for easy access to the theme context.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// The provider component that wraps the app and provides theme state.
export const ThemeProvider = ({ children }) => {
  // State for dark mode, initialized from localStorage to persist the setting.
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false; // Default to light mode
  });

  // State to track if an AI optimization is in progress.
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Effect to save the theme preference to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  // Function to toggle the theme.
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // The value provided to all consuming components.
  const value = {
    isDark,
    toggleTheme,
    isOptimizing,
    setIsOptimizing,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};