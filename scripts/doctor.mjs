import {
  captureCommandOutput,
  isCommandAvailable,
  printSectionTitle
} from "./script-helpers.mjs";

/**
 * The doctor script answers the first beginner question:
 * "Do I have everything I need before I start typing commands?"
 */

function printToolStatus(toolDisplayName, commandName, versionArguments = ["--version"]) {
  const commandIsAvailable = isCommandAvailable(commandName, versionArguments);

  if (!commandIsAvailable) {
    console.log(`${toolDisplayName}: missing`);
    return false;
  }

  const completedCommandResult = captureCommandOutput(commandName, versionArguments);
  const trimmedOutput = completedCommandResult.stdout.trim() || completedCommandResult.stderr.trim();
  console.log(`${toolDisplayName}: ${trimmedOutput}`);
  return true;
}

printSectionTitle("Checking prerequisites");

const nodeIsAvailable = printToolStatus("Node.js", "node");
const npmIsAvailable = printToolStatus("npm", "npm");
const pythonIsAvailable = printToolStatus("Python", "python");
const dockerIsAvailable = printToolStatus("Docker (optional for wiki)", "docker");

if (nodeIsAvailable && npmIsAvailable && pythonIsAvailable) {
  console.log("\nYou have the required tools to install, build, run, and test the project.");
} else {
  console.log(
    "\nAt least one required tool is missing. Install the missing items above before running setup."
  );
}

if (!dockerIsAvailable) {
  console.log(
    "The DokuWiki layer is optional, so you only need Docker if you want to run the wiki locally."
  );
}

