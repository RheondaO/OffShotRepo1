import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ThemeVariant = "cosmic" | "cyberpunk" | "midnight" | "retro" | "monochrome";

interface ThemeContextType {
  currentTheme: ThemeVariant;
  changeTheme: (theme: ThemeVariant) => void;
}

const defaultTheme: ThemeVariant = "monochrome";

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: defaultTheme,
  changeTheme: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as ThemeVariant;
    if (savedTheme && (savedTheme === "cosmic" || savedTheme === "cyberpunk" || savedTheme === "midnight" || savedTheme === "retro" || savedTheme === "monochrome")) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Save theme preference to localStorage
      localStorage.setItem("theme", currentTheme);
      
      // Apply theme class to document body
      document.body.classList.remove("theme-cosmic", "theme-cyberpunk", "theme-midnight", "theme-retro", "theme-monochrome");
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme, isMounted]);

  const changeTheme = (theme: ThemeVariant) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}