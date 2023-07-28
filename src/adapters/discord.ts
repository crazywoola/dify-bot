import { Client, Events, GatewayIntentBits } from 'discord.js';
import Bot from './bot';


// discord.login(process.env.DISCORD_TOKEN);

// discord.once(Events.ClientReady, async (c) => {
//   console.log(`Ready! Logged in as ${c.user.tag}`);
// });

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
    console.log("⚡️ Discord app is running!");
    this.app.once(Events.ClientReady, async (c) => {
      console.log(`Logged in as ${c.user.tag}`);
    });
  }
}

export default DiscordBot;
