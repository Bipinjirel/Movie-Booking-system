import { createContext, useContext, useState, useEffect, createElement } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Instead of JSX, use React.createElement
  return createElement(
    ThemeContext.Provider,
    { value: { theme, toggleTheme } },
    children
  );
};

export const useTheme = () => useContext(ThemeContext);
