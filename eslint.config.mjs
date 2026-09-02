import eslintPluginReact from "eslint-plugin-react";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "coverage/**",
            "supabase/.temp/**",
            "src/lib/supabase/database.types.ts",
        ],
    },
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
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "no-undef": "warn",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];