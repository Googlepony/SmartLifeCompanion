import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSystemTheme, getActiveTheme, saveThemePreference, getSavedTheme, applyTheme, Theme } from "@/lib/theme";
import { useUser } from "./UserContext";

interface ThemeContextType {
  theme: "light" | "dark";
  themePreference: Theme;
  setThemePreference: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  themePreference: "system",
  setThemePreference: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themePreference, setThemePreference] = useState<Theme>(getSavedTheme());
  const [theme, setTheme] = useState<"light" | "dark">(getActiveTheme(themePreference));
  const { userSettings } = useUser();

  // Update theme when preference changes
  const updateTheme = (preference: Theme) => {
    const activeTheme = getActiveTheme(preference);
    setTheme(activeTheme);
    applyTheme(activeTheme);
    saveThemePreference(preference);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    saveThemePreference(newTheme);
  };

  // Handle theme preference change
  const handleThemeChange = (newTheme: Theme) => {
    setThemePreference(newTheme);
    updateTheme(newTheme);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (themePreference === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        setTheme(mediaQuery.matches ? "dark" : "light");
        applyTheme(mediaQuery.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themePreference]);
  
  // Apply initial theme
  useEffect(() => {
    updateTheme(themePreference);
  }, [themePreference]);
  
  // Sync with user settings
  useEffect(() => {
    if (userSettings && userSettings.darkMode !== undefined) {
      const newTheme = userSettings.darkMode ? "dark" : "light";
      setTheme(newTheme);
      applyTheme(newTheme);
    }
  }, [userSettings]);

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference: handleThemeChange, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
