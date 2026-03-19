import {
  assertCommandAvailable,
  printSectionTitle,
  runCommandOrThrow
} from "./script-helpers.mjs";

/**
 * This script is the beginner-friendly "test everything" command. It runs:
 * 1. The frontend unit and component tests.
 * 2. The Python repository-policy tests.
 * 3. The end-to-end browser tests after building the app and installing Chromium.
 */

printSectionTitle("Running frontend unit and component tests");
runCommandOrThrow("npm", ["run", "test"]);

printSectionTitle("Running repository policy tests");
assertCommandAvailable("python", "Install Python 3.10 or newer first.");
runCommandOrThrow("python", ["-m", "pytest", "tests/test_repository.py"]);

printSectionTitle("Building the application for browser tests");
runCommandOrThrow("npm", ["run", "build"]);

printSectionTitle("Installing the Playwright browser");
runCommandOrThrow("npx", ["playwright", "install", "chromium"]);

printSectionTitle("Running end-to-end tests");
runCommandOrThrow("npm", ["run", "test:e2e"]);

console.log("\nAll major test layers completed.");

