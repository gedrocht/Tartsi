import { printSectionTitle, runCommandOrThrow } from "./script-helpers.mjs";

/**
 * This script builds every static artifact in the repository:
 * the app bundle, the API docs, the documentation site, and the GitHub Pages package.
 */

printSectionTitle("Building the application");
runCommandOrThrow("npm", ["run", "build"]);

printSectionTitle("Building the documentation outputs");
runCommandOrThrow("npm", ["run", "build:docs"]);

printSectionTitle("Preparing the GitHub Pages bundle");
runCommandOrThrow("npm", ["run", "pages:build"]);

console.log("\nAll build outputs are ready.");

