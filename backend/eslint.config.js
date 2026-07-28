import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,
  {
        ignores: [
            "dist/**",
            "node_modules/**",
            "swagger-output.json",
            "swagger.cjs",
        ]
    },

  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];