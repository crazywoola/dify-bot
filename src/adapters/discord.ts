import { Client, Events, GatewayIntentBits } from 'discord.js';
import Bot from './bot';
import { info, error } from '../util';

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

  handleAppMention = async (message: any) => {
    const inputs = {};
    const query = message.content;
    const user = message.author.username;
    console.log(query, user);
    // Send an initial message and open a thread
    const ref = await message.reply(':) ...');
    try {
      this.send(inputs, query, user, async msg => {
        await ref.edit(msg);
      });
    } catch {
      error('Error while sending message');
    }
  };
  async say() {}

  async hear() {
    this.app.on(Events.MessageCreate, async message => {
      // return if this is a bot user
      if (message.author.bot) return;
      const user = this.app.user;
      if (user && message.mentions.has(user)) {
        this.handleAppMention(message);
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
