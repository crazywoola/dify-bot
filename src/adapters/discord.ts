import { Client, Events, GatewayIntentBits } from 'discord.js';
import Bot from './bot';
import { info } from '../util';

class DiscordBot extends Bot {
  app: Client;

  constructor() {
    super();
    this.app = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    });
  }

  async say() {}

  async hear() {
    this.app.on(Events.MessageCreate, async message => {
      const user = this.app.user;
      if (user && message.mentions.has(user)) {
        console.log(message.content);
      } else {
        console.log(`not mentioned`);
      }
    });
  }

  async up() {
    await this.app.login(process.env.DISCORD_TOKEN);
    info('⚡️ Discord app started');
    this.app.once(Events.ClientReady, async c => {
      info(` Ready! Logged in as ${c.user.tag}`);
    });
  }
}

export default DiscordBot;
