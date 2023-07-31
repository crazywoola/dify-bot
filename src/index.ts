import dotenv from "dotenv";
import SlackBot from "./adapters/slack";
import DiscordBot from "./adapters/discord";
import { ChatClient } from 'dify-client';
import chalk from "chalk";
dotenv.config();

const chatClient = new ChatClient(process.env.DIFY_API_KEY);
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
  bot.setChatClient(chatClient);
  bot.up();
  bot.hear((message) => {
    console.log(message);
  });
}

