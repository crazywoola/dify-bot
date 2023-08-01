import chalk from "chalk";
// Function to check if the required environment variables are set
export function checkEnvVariable(variableName: string): string {
  const value = process.env[variableName];
  if (!value) {
    console.log(chalk.red(`${variableName} is required`));
    process.exit(1);
  }
  return value;
}
