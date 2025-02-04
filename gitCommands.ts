import { runCommand } from 'functions';

/**
 * Runs various git commands using the system's CLI.
 *
 * Each function returns the output of the command as a string.
 */

/**
 * Gets the current status of the repository using 'git status'.
 */
export async function gitStatus(): Promise<string> {
  const result = await runCommand({ command: 'git status' });
  return result;
}

/**
 * Commits changes with the provided commit message using 'git commit -am "message"'.
 * @param message The commit message
 */
export async function gitCommit(message: string): Promise<string> {
  // Using -a to commit all changes. Make sure the message is properly quoted.
  const result = await runCommand({ command: `git commit -am "${message}"` });
  return result;
}

/**
 * Pushes committed changes to the remote repository using 'git push'.
 */
export async function gitPush(): Promise<string> {
  const result = await runCommand({ command: 'git push' });
  return result;
}

/**
 * Pulls changes from the remote repository using 'git pull'.
 */
export async function gitPull(): Promise<string> {
  const result = await runCommand({ command: 'git pull' });
  return result;
}

/**
 * Lists the local branches using 'git branch'.
 */
export async function gitBranch(): Promise<string> {
  const result = await runCommand({ command: 'git branch' });
  return result;
}

/**
 * Creates a new branch and switches to it using 'git checkout -b <branchName>'.
 * @param branchName The name of the new branch
 */
export async function gitNewBranch(branchName: string): Promise<string> {
  const result = await runCommand({ command: `git checkout -b ${branchName}` });
  return result;
}
