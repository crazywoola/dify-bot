import chalk from "chalk";
import { App, LogLevel } from "@slack/bolt";
import Bot from './bot';

// Initialize the Bolt app with the token and signing secret

// Listens to incoming messages that contain "hello"
// app.message("hello", async ({ message, say }) => {
//   console.log(message);
//   await say(`Hey there!`);
// });

class SlackBot extends Bot {
  app: App;
  constructor(){
    super();
    this.app = new App({
      socketMode: true, // Enable the socket mode
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      logLevel: LogLevel.DEBUG,
    });
  }

  async sendMessage(channel: any, text: string) {
    console.log(channel, text);
  }
  async onMessage(callback: (message: any) => void) {
    this.app.message("hello", async ({ message }) => {
      callback(message);
    });
  }
  async start() {
    await this.app.start();
    console.log(chalk.blue("⚡️ Slack app started"));
  }
}

export default SlackBot;
