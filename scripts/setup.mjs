import {
  assertCommandAvailable,
  printSectionTitle,
  runCommandOrThrow
} from "./script-helpers.mjs";

/**
 * The setup script gives beginners one command that prepares both the JavaScript and Python
 * sides of the repository.
 */

printSectionTitle("Validating required tools");
assertCommandAvailable("npm", "Install Node.js and npm first.");
assertCommandAvailable("python", "Install Python 3.10 or newer first.");

printSectionTitle("Installing JavaScript dependencies");
runCommandOrThrow("npm", ["install"]);

printSectionTitle("Installing Python repository-test dependencies");
runCommandOrThrow("python", ["-m", "pip", "install", "-r", "requirements-dev.txt"]);

console.log("\nSetup complete. You can now run `npm start`, `npm run build:all`, or `npm run test:all`.");

