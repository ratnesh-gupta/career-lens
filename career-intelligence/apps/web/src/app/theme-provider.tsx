import { useEffect, type ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * R1a: light theme only. Dark tokens exist in CSS but are not activated.
 * Sets data-theme="light" on <html> for consistency with future dark mode.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.classList.remove("dark");
  }, []);

  return <>{children}</>;
}
