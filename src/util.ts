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
// Function to parse json in streaming mode
// "data: {}"
export function parseJsonInStreamingMode(data: string): any {
  const json = JSON.parse(data);
  return json;
}
