import React, { useEffect, useState, createContext, useContext } from 'react';
type Theme = 'light' | 'dark';
type Accent = 'primary' | 'cyan' | 'green' | 'amber' | 'rose';
interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
}
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
export function ThemeProvider({ children }: {children: React.ReactNode;}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('theme') as Theme || 'dark';
  });
  const [accent, setAccent] = useState<Accent>(() => {
    if (typeof window === 'undefined') return 'primary';
    return localStorage.getItem('accent') as Accent || 'primary';
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');else
    root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    [
    'accent-primary',
    'accent-cyan',
    'accent-green',
    'accent-amber',
    'accent-rose'].
    forEach((c) => root.classList.remove(c));
    root.classList.add(`accent-${accent}`);
    localStorage.setItem('accent', accent);
  }, [accent]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent
      }}>
      
      {children}
    </ThemeContext.Provider>);

}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}