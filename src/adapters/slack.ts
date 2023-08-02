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
  constructor() {
    super();

    this.app = new App({
      socketMode: true, // Enable the socket mode
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      // logLevel: LogLevel.DEBUG,
    });
  }

  async say() { }

  async hear() {
    // subscribe to 'app_mention' event in your App config
    // need app_mentions:read and chat:write scopes
    this.app.event("app_mention", async ({ event, client, say }) => {
      const inputs = {};
      const query = event.text;
      const user = event.user || '';
      // Send an initial message
      const response = await say(`Hello, <@${event.user}>! Processing your request...`);

      if (response.channel && response.ts) {
        const channel: string = response.channel;
        const ts: string = response.ts;

        // ... do some async operation ...
        this.send(
          inputs,
          query,
          user,
          async (msg) => {
            await client.chat.update({
              channel: channel,
              ts: ts,
              text: msg,
            });
          }
        )
        // Update the message
        
      } else {
        console.error('Failed to send message');
      }
    });
  }
  async up() {
    await this.app.start();
    console.log(chalk.blue("⚡️ Slack app started"));
  }
}

export default SlackBot;
