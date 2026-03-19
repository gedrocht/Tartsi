import eslintJavaScriptRecommendedConfiguration from "@eslint/js";
import environmentGlobals from "globals";
import jsxAccessibilityPlugin from "eslint-plugin-jsx-a11y";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import typescriptEslint from "typescript-eslint";

const sharedLanguageGlobals = {
  ...environmentGlobals.browser,
  ...environmentGlobals.node
};

const typeCheckedTypeScriptConfigurations = [
  ...typescriptEslint.configs.strictTypeChecked,
  ...typescriptEslint.configs.stylisticTypeChecked
].map((eslintConfiguration) => ({
  ...eslintConfiguration,
  files: ["**/*.{ts,tsx}"]
}));

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
  {
    languageOptions: {
      globals: sharedLanguageGlobals
    }
  },
  ...typeCheckedTypeScriptConfigurations,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      },
      globals: sharedLanguageGlobals
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
