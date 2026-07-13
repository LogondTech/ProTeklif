import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "proteklif-theme";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [setTheme, theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
