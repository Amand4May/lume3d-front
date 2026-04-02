import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      if (stored) return stored;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);

    // update favicon and shortcut icon to match current theme
    let favicon = document.getElementById("theme-favicon") as HTMLLinkElement | null;
    let shortcut = document.getElementById("theme-shortcut") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.id = "theme-favicon";
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    if (!shortcut) {
      shortcut = document.createElement("link");
      shortcut.id = "theme-shortcut";
      shortcut.rel = "shortcut icon";
      document.head.appendChild(shortcut);
    }
    const lightHref = "/src/assets/favicon.ico";
    const darkHref = "/src/assets/faviconwhite.ico";
    const baseHref = theme === "dark" ? darkHref : lightHref;
    // cache-bust so browsers (Chrome) refetch
    const newHref = baseHref + `?v=${Date.now()}`;
    favicon.href = newHref;
    if (shortcut) shortcut.href = newHref;
    // eslint-disable-next-line no-console
    console.debug("ThemeContext: theme=", theme, "-> favicon=", newHref);
  }, [theme]);

  // If user hasn't chosen a theme explicitly, react to system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    if (stored) return;
    const m = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    if (m.addEventListener) m.addEventListener("change", handler);
    else m.addListener(handler);
    return () => {
      if (m.removeEventListener) m.removeEventListener("change", handler);
      else m.removeListener(handler as any);
    };
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
