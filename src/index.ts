import dotenv from "dotenv";
import SlackBot from "./adapters/slack";
import DiscordBot from "./adapters/discord";
import chalk from "chalk";
dotenv.config();

const adapter = process.env.ADAPTER || "slack";

let bot;
switch(adapter) {
  case "slack":
    bot = new SlackBot();
    break;
  case "discord":
    bot = new DiscordBot();
    break;
  default:
    console.log(chalk.red("Invalid adapter"));
    break;
}

if (bot){
  bot.start();
  bot.onMessage((message) => {
    console.log(message);
  });
}

