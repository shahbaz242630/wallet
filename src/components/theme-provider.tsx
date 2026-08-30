'use client';

import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY, getTheme, isThemeId, type ThemeId } from '@/lib/themes';

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * The document element is the source of truth for the active theme.
 *
 * public/theme-init.js sets it before first paint, and React subscribes to it
 * rather than keeping a second copy in state. That avoids both the flash of a
 * default palette and a state update on mount.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => observer.disconnect();
}

function getSnapshot(): ThemeId {
  const current = document.documentElement.dataset.theme;
  return isThemeId(current) ? current : DEFAULT_THEME;
}

/** The server has no stored preference, so it always renders the default. */
function getServerSnapshot(): ThemeId {
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: ThemeId) => {
    const root = document.documentElement;
    root.dataset.theme = next;
    root.classList.toggle('dark', getTheme(next).mode === 'dark');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Not being able to remember the choice is not worth breaking the page.
    }
  }, []);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
