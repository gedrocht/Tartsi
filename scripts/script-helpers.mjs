import { spawnSync } from "node:child_process";

/**
 * This helper module centralizes the repetitive parts of our repository scripts so each
 * top-level script can stay focused on its teaching purpose.
 */

export function printSectionTitle(sectionTitle) {
  console.log(`\n=== ${sectionTitle} ===`);
}

export function runCommand(commandName, commandArguments) {
  return spawnSync(commandName, commandArguments, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32"
  });
}

export function runCommandOrThrow(commandName, commandArguments) {
  const completedCommandResult = runCommand(commandName, commandArguments);

  if (completedCommandResult.status !== 0) {
    throw new Error(
      `The command ${commandName} ${commandArguments.join(" ")} failed with exit code ${completedCommandResult.status}.`
    );
  }
}

export function captureCommandOutput(commandName, commandArguments) {
  return spawnSync(commandName, commandArguments, {
    cwd: process.cwd(),
    encoding: "utf-8",
    shell: process.platform === "win32"
  });
}

export function isCommandAvailable(commandName, versionArguments = ["--version"]) {
  const completedCommandResult = captureCommandOutput(commandName, versionArguments);

  return completedCommandResult.status === 0;
}

export function assertCommandAvailable(commandName, installationHint) {
  if (!isCommandAvailable(commandName)) {
    throw new Error(
      `${commandName} is required for this step. ${installationHint}`
    );
  }
}

