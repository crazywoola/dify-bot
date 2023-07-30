import { Client, Events, GatewayIntentBits } from 'discord.js';
import Bot from './bot';
import chalk from 'chalk';

class DiscordBot extends Bot {
  app: Client;

  constructor() {
    super();
    this.app =new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    });
  }

  async sendMessage(channel: any, text: string) {
    console.log(channel, text);
  }
  async onMessage(_callback: (message: any) => void) {
    
  }
  async start() {
    await this.app.login(process.env.DISCORD_TOKEN);
    console.log(chalk.blue("⚡️ Discord app started"));
    this.app.once(Events.ClientReady, async (c) => {
      console.log(chalk.blue(`Ready! Logged in as ${c.user.tag}`));
    });
  }
}

export default DiscordBot;
