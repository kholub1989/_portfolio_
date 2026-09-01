import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "darkMode";
const listeners = new Set();

function readPersisted() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function getSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getInitialValue() {
  const persisted = readPersisted();
  return persisted === null ? getSystemPreference() : persisted;
}

function applyBodyClass(next) {
  document.body.classList.toggle("dark-mode", next);
}

let currentValue = getInitialValue();
applyBodyClass(currentValue);

function notify(next) {
  currentValue = next;
  applyBodyClass(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, quota) - state still
    // works for this session, just won't persist across reloads.
  }
  listeners.forEach((listener) => listener(next));
}

/**
 * Minimal, self-contained replacement for the `use-dark-mode` package:
 * persists to localStorage under the same "darkMode" key (so an existing
 * visitor's saved preference carries over), stays in sync across every
 * component that calls this hook in the same tab, syncs across tabs via
 * the native `storage` event, and follows the OS `prefers-color-scheme`
 * live - matching the original library's behavior exactly, including
 * that an OS-level change always wins over a previous manual toggle.
 * Also toggles a "dark-mode" class on `document.body`, same as the
 * original library did - `body`'s own background relies on this since
 * CSS custom properties set on a descendant (the app root div) can't
 * cascade back up to an ancestor like `body`.
 */
export function useDarkMode() {
  const [value, setValue] = useState(currentValue);

  useEffect(() => {
    listeners.add(setValue);
    return () => listeners.delete(setValue);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        notify(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => notify(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const toggle = useCallback(() => notify(!currentValue), []);

  return { value, toggle };
}
