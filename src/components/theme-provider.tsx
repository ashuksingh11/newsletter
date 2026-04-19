"use client";

// This component manages dark/light mode for the entire app.
// It uses three key React concepts:
//   1. Context — shares theme state with all components
//   2. State — tracks the current theme
//   3. Effect — syncs with localStorage and the <html> element

import { createContext, useContext, useState, useEffect } from "react";

// Define the shape of our context value.
// Any component that uses this context will have access to
// the current theme AND a function to toggle it.
type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

// Create the context with a default value.
// This default is only used if a component reads the context
// without a Provider above it (shouldn't happen in our app).
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// The Provider component wraps the app and broadcasts theme state.
// "children" is everything inside <ThemeProvider>...</ThemeProvider>.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // useEffect runs AFTER the component renders in the browser.
  // We use it here to read the saved theme from localStorage.
  //
  // The empty array [] means "run this only once, when the component
  // first appears." Without it, this would run on every re-render.
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
    }
  }, []);

  // This effect runs whenever "theme" changes.
  // It does two things:
  //   1. Adds/removes the "dark" class on <html> (Tailwind uses this)
  //   2. Saves the choice to localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    // This pattern — passing a function to setState — is used when
    // the new value depends on the previous value.
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    // The Provider makes { theme, toggleTheme } available to
    // any child component that calls useContext(ThemeContext).
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — a shortcut so components don't need to import
// both useContext and ThemeContext. They just call useTheme().
export function useTheme() {
  return useContext(ThemeContext);
}
