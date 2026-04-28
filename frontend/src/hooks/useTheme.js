import { useEffect, useState } from 'react';

const themeKey = 'voice-assistant-theme';
const DARK = 'dark';
const LIGHT = 'light';

const applyTheme = (theme) => {
  const nextTheme = theme === DARK ? DARK : LIGHT;

  document.documentElement.classList.remove(DARK, LIGHT);
  document.documentElement.classList.add(nextTheme);
  document.documentElement.setAttribute('data-theme', nextTheme);

  if (document.body) {
    document.body.classList.remove(DARK, LIGHT);
    document.body.classList.add(nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState(DARK);

  useEffect(() => {
    const stored = localStorage.getItem(themeKey);
    const nextTheme = stored === LIGHT || stored === DARK
      ? stored
      : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? DARK : LIGHT);

    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === DARK ? LIGHT : DARK;
      localStorage.setItem(themeKey, next);
      applyTheme(next);
      return next;
    });
  };

  return { theme, toggleTheme };
};
