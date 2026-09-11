import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";

void i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },

    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
        console.error(
            `[i18n MISSING KEY] Key "${key}" not found in language "${lng}" (namespace: "${ns}").`,
        );
    },
});

export { i18n };
