import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "tbf-theme";
const THEME_CHANGE_EVENT = "themechange";

const isTheme = (value: string | null): value is Theme => {
    return value === "light" || value === "dark";
};

export const getPreferredTheme = (): Theme => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (isTheme(storedTheme)) {
        return storedTheme;
    }

    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

export const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-bs-theme", theme);
};

export const setTheme = (theme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
};

export const initializeTheme = () => {
    applyTheme(getPreferredTheme());
};

export const useTheme = () => {
    const [theme, setCurrentTheme] = useState<Theme>(getPreferredTheme);

    useEffect(() => {
        const syncTheme = () => {
            const appliedTheme = document.documentElement.getAttribute("data-bs-theme");
            setCurrentTheme(isTheme(appliedTheme) ? appliedTheme : getPreferredTheme());
        };

        window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
        return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
    }, []);

    const updateTheme = (nextTheme: Theme) => {
        setTheme(nextTheme);
    };

    const toggleTheme = () => {
        updateTheme(theme === "dark" ? "light" : "dark");
    };

    return { theme, toggleTheme, setTheme: updateTheme };
};
