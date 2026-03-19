import eslintJavaScriptRecommendedConfiguration from "@eslint/js";
import environmentGlobals from "globals";
import jsxAccessibilityPlugin from "eslint-plugin-jsx-a11y";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    ignores: [
      "dist",
      "dist-pages",
      "coverage",
      "typedoc-output",
      "documentation-site/.vitepress/dist",
      "playwright-report",
      "test-results"
    ]
  },
  eslintJavaScriptRecommendedConfiguration.configs.recommended,
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...environmentGlobals.browser,
        ...environmentGlobals.node
      }
    },
    plugins: {
      "jsx-a11y": jsxAccessibilityPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^unused",
          varsIgnorePattern: "^unused"
        }
      ],
      "jsx-a11y/anchor-is-valid": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-refresh/only-export-components": [
        "error",
        {
          allowConstantExport: true
        }
      ]
    }
  }
);
