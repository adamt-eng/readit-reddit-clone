import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => { },
});

const THEME_KEY = "theme";
const THEMES = ["light", "dark"];

function getInitialTheme() {
  if (typeof window === "undefined") {
    return { theme: "light", isUserOverride: false };
  }

  const saved = localStorage.getItem(THEME_KEY);
  if (THEMES.includes(saved)) {
    return { theme: saved, isUserOverride: true };
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return { theme: prefersDark ? "dark" : "light", isUserOverride: false };
}

export function ThemeProvider({ children }) {
  const [{ theme, isUserOverride }, setState] = useState(getInitialTheme);

  // Listen to system theme changes (only if no user override)
  useEffect(() => {
    if (typeof window === "undefined" || isUserOverride) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      setState((s) => ({
        ...s,
        theme: e.matches ? "dark" : "light",
      }));
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [isUserOverride]);

  // Apply theme to DOM + persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setState((s) => ({
      theme: s.theme === "dark" ? "light" : "dark",
      isUserOverride: true,
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
