import chalk from 'chalk';
import { FormItem } from './types';
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
let buffer = ''; // assuming buffer is defined somewhere outside the function

export function streamParser(data: string): any {
  buffer += data;

  const messages = buffer.split('\n\n');
  buffer = messages.pop() || '';
  const results: string[] = [];

  for (const message of messages) {
    if (message.startsWith('data: ')) {
      try {
        const json = JSON.parse(message.slice(6).trim());
        if (json.event === 'ping') continue;
        if (json.event === 'message') {
          const parsedMessage = unicodeToChar(json['answer']);
          if (parsedMessage.trim() !== ',') {
            results.push(parsedMessage);
          }
        }
      } catch (e) {
        error(`Error parsing: ${message}`);
      }
    }
  }

  return results;
}

function unicodeToChar(text: string) {
  return text.replace(/\\u[\dA-Fa-f]{4}/g, function (match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
  });
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

export function userInputFormParser(items: any[]): FormItem[] {
  // Initialize an empty array to store the converted data
  let convertedData = [];

  // Iterate over each object in the array
  for (let item of items) {
    for (let key in item) {
      // Create a new object with 'type' key and existing data
      let newObj = { type: key, ...item[key] };

      // Append the new object to the array
      convertedData.push(newObj);
    }
  }
  return convertedData;
}

export const pickRequestData = (req: any) =>
  new Promise(resolve => {
    let chunks = '';
    req.on('data', (chunk: any) => {
      chunks += chunk;
    });

    req.on('end', () => {
      const data = JSON.parse(chunks);
      resolve(data);
    });
  });
