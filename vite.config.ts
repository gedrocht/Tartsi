import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * The Vite configuration intentionally uses a relative base path so both the application
 * build and GitHub Pages deployment remain portable. This is especially useful when the
 * repository name, Pages path, or preview hosting path changes over time.
 */
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/test/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["playwright/**", "tests/**"],
    setupFiles: "./src/test/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      thresholds: {
        branches: 80,
        functions: 95,
        lines: 95,
        statements: 95
      }
    }
  }
});
