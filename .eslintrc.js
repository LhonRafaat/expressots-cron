// .eslintrc.js
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ["lib", "node_modules", ".eslintrc.cjs", "vitest.config.ts"],
  rules: {
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/class-literal-property-style": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
  },
};
