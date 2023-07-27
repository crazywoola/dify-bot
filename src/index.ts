import { App, LogLevel } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Bolt app with the token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true, // Enable the socket mode
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

app.message(async ({ message }) => {
  console.log(message);
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  console.log(message);
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there!`);
});

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});

// Starts the app
(async () => {
  await app.start();
  console.log("⚡️ Bolt app is running!");
})();
