"use strict";

/** @type {import("eslint").Linter.Config} */
const base = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: { alwaysTryTypes: true },
      node: true,
    },
  },
  rules: {
    // TypeScript
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],

    // React
    "react/prop-types": "off",

    // Imports
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/no-duplicates": "error",
    "import/no-cycle": "error",

    // General
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    eqeqeq: ["error", "always", { null: "ignore" }],
  },
};

/** @type {import("eslint").Linter.Config} */
const reactApp = {
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    {
      files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
      extends: ["plugin:testing-library/react"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
    {
      files: ["**/mocks/**/*.{ts,tsx}", "**/msw/**/*.{ts,tsx}"],
      rules: {
        "no-console": "off",
      },
    },
  ],
};

module.exports = { base, reactApp };
