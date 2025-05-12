import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type ThemeVariant = "cosmic" | "cyberpunk" | "midnight" | "retro" | "monochrome";

interface ThemeContextType {
  currentTheme: ThemeVariant;
  changeTheme: (theme: ThemeVariant) => void;
}

const defaultTheme: ThemeVariant = "cosmic";

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
    // Temporarily hide monochrome theme while it's being perfected
    if (savedTheme && (savedTheme === "cosmic" || savedTheme === "cyberpunk" || savedTheme === "midnight" || savedTheme === "retro")) {
      setCurrentTheme(savedTheme);
    } else if (savedTheme === "monochrome") {
      // If the user previously had monochrome theme, switch them to cosmic
      setCurrentTheme("cosmic");
      localStorage.setItem("theme", "cosmic");
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