import eslintPluginReact from "eslint-plugin-react";
import js from "@eslint/js";
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser
            }
        },
        plugins: {
            react: eslintPluginReact,
        },
        rules: {
            "react/react-in-jsx-scope": "off", // React 17+ does not need React in scope
            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",
            "no-unused-vars": "warn",
            "no-undef": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];