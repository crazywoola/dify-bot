import dotenv from "dotenv";
import SlackBot from "./adapters/slack";
import DiscordBot from "./adapters/discord";
import DifyClient from "./service";
import chalk from "chalk";
dotenv.config();

if (!process.env.DIFY_API_KEY) {
  console.log(chalk.red("DIFY_API_KEY is required"));
  process.exit(1);
}

const difyClient = new DifyClient(process.env.DIFY_API_KEY);
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
  bot.setDifyClient(difyClient);
  bot.up();
  bot.hear((message) => {
    console.log(message);
  });
}

