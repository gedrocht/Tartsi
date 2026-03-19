import { assertCommandAvailable, printSectionTitle, runCommandOrThrow } from "./script-helpers.mjs";

/**
 * This script provides an obvious "start the app" entry point for beginners who expect
 * a repository to have a single command for launching development mode.
 */

printSectionTitle("Starting the development server");
assertCommandAvailable("npm", "Install Node.js and npm first.");
runCommandOrThrow("npm", ["run", "dev"]);

