import dotenv from 'dotenv';
import SlackBot from './adapters/slack';
import DiscordBot from './adapters/discord';
import DifyClient from './service';
import { checkEnvVariable, error } from './util';
dotenv.config();

// TODO Check MODE
// If MODE is chat, then run the bot
// If MODE is completion, then run the bot & register the commands
// const MODE = checkEnvVariable("MODE");
const ADAPTER = checkEnvVariable('ADAPTER');
const DIFY_API_KEY = checkEnvVariable('DIFY_API_KEY');
const difyClient = new DifyClient(DIFY_API_KEY);

const adapters: Record<string, any> = {
  slack: {
    requiredEnvVariables: ['SLACK_BOT_TOKEN', 'SLACK_APP_TOKEN'],
    createInstance: () => new SlackBot()
  },
  discord: {
    requiredEnvVariables: ['DISCORD_TOKEN', 'DISCORD_ID'],
    createInstance: () => new DiscordBot()
  }
};

const adapterConfig = adapters[ADAPTER];

if (!adapterConfig) {
  error('Invalid adapter. Please use "slack" or "discord"');
  process.exit(1);
}

adapterConfig.requiredEnvVariables.forEach((variable: string) =>
  checkEnvVariable(variable)
);

const bot = adapterConfig.createInstance();
bot.setDifyClient(difyClient);
bot.setApplication();
// bot.hear();

//// 🚀 Bot is good to go
// bot.up();
