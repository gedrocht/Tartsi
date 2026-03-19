import { printSectionTitle, runCommandOrThrow } from "./script-helpers.mjs";

/**
 * This script gives the repository a visible, script-folder-based build entry point.
 * It intentionally performs the same two steps a developer would run manually:
 * 1. Type-check the TypeScript project.
 * 2. Build the production Vite bundle.
 *
 * Keeping these steps in a dedicated script makes the build process easier to discover
 * for contributors who look in the `scripts/` directory first.
 */

printSectionTitle("Type-checking the application");
runCommandOrThrow("npm", ["run", "typecheck"]);

printSectionTitle("Building the production bundle");
runCommandOrThrow("npm", ["run", "build:application"]);

console.log("\nApplication build complete.");
