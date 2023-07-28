import dotenv from "dotenv";
import SlackBot from "./adapters/slack";
import DiscordBot from "./adapters/discord";
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
    console.log("No adapter found");
    break;
}

if (bot){
  bot.start();
}

