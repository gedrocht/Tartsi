import { spawnSync } from "node:child_process";

/**
 * This script gives the repository a visible, script-folder-based build entry point.
 * It intentionally performs the same two steps a developer would run manually:
 * 1. Type-check the TypeScript project.
 * 2. Build the production Vite bundle.
 *
 * Keeping these steps in a dedicated script makes the build process easier to discover
 * for contributors who look in the `scripts/` directory first.
 */

function runCommandOrThrow(commandName, commandArguments) {
  const completedCommandResult = spawnSync(commandName, commandArguments, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (completedCommandResult.status !== 0) {
    throw new Error(
      `The command ${commandName} ${commandArguments.join(" ")} failed with exit code ${completedCommandResult.status}.`
    );
  }
}

runCommandOrThrow("npm", ["run", "typecheck"]);
runCommandOrThrow("npm", ["run", "build:application"]);

