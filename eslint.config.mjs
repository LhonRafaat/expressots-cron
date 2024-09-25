import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/lib",
        "**/node_modules",
        "**/.eslintrc.cjs",
        "**/vitest.config.ts",
        "**/.eslintrc.js",
        "**/test",
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "commonjs",

        parserOptions: {
            project: ["./tsconfig.json"],
        },
    },

    rules: {
        "@typescript-eslint/adjacent-overload-signatures": "error",

        "@typescript-eslint/array-type": ["error", {
            default: "generic",
        }],

        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/class-literal-property-style": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
    },
}];