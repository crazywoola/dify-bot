import { Client, Events, GatewayIntentBits } from 'discord.js';
import Bot from './bot';
import { info, error } from '../util';
import debounce from 'lodash/debounce';

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

  debouncedEditUpdate = debounce(async (message, newText) => {
    await message.edit(newText);
  }, 100);

  handleAppMention = async (message: any) => {
    const inputs = {};
    const query = message.content;
    const user = message.author.username;

    const initialMessage = await message.reply('Thinking...');

    this.send(inputs, query, user, async (msg, err) => {
      if (err) {
        await initialMessage.edit('Error while sending message to dify.ai');
      } else {
        this.debouncedEditUpdate(initialMessage, msg || 'Unknown response');
      }
    });
  };

  async say() {}

  async hear() {
    this.app.on(Events.MessageCreate, async message => {
      // Return if the author of the message is a bot
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
