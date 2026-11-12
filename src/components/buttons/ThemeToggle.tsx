import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSunBright } from "@fortawesome/pro-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/theme";

export const ThemeToggle = () => {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            aria-label={t(isDark ? "theme.switchToLight" : "theme.switchToDark")}
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleTheme}
            type="button"
        >
            <FontAwesomeIcon aria-hidden="true" icon={isDark ? faSunBright : faMoon} />
        </button>
    );
};
