import { App, LogLevel } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Bolt app with the token and signing secret
const app = new App({
  socketMode: true, // Enable the socket mode
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  console.log(message);
  await say(`Hey there!`);
});
// Starts the app
(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();
