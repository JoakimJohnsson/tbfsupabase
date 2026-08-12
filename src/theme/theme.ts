export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "tbf-theme";

const isTheme = (value: string | null): value is Theme => {
    return value === "light" || value === "dark";
};

export const getPreferredTheme = (): Theme => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (isTheme(storedTheme)) {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

export const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-bs-theme", theme);
};

export const setTheme = (theme: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
};

export const initializeTheme = () => {
    applyTheme(getPreferredTheme());
};
