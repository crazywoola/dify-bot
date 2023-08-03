import chalk from 'chalk';

// Function to check if the required environment variables are set
export function checkEnvVariable(variableName: string): string {
  const value = process.env[variableName];
  if (!value) {
    error(`Please set ${variableName} environment variable`);
    process.exit(1);
  }
  return value;
}
// Function to parse string in streaming mode
// 'data: {"event": "message", "task_id": "e22d1147-6fd9-4a01-8340-87c66a66aec2", "id": "8cf8f6f8-4ec2-42ca-bc1d-71c3ebc0a18e", "answer": " applications", "created_at": 1690977033, "conversation_id": "afa95cc9-d7b2-4f2b-aea8-fdd4ee299866"}'
// TODO Error while parsing data: event: ping
export function streamParser(data: string): any {
  try {
    const json = data.split('data: ')[1];
    return JSON.parse(json).answer;
  } catch (e) {
    error(`Error while parsing data: ${data}, error: ${e}`);
    return '😄';
  }
}

export function error(message: string) {
  console.log(chalk.red(message));
}

export function info(message: string) {
  console.log(chalk.blue(message));
}
export function success(message: string) {
  console.log(chalk.green(message));
}

export function warn(message: string) {
  console.log(chalk.yellow(message));
}
