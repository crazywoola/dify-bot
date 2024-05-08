import {
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} from 'discord.js';
import Bot from './bot';
import { checkEnvVariable, error, info } from '../util';
import debounce from 'lodash/debounce';
import { Command, DiscordCustomClient } from '../types';
import { cmds } from '../cmds/discord';

class DiscordBot extends Bot {
  app: DiscordCustomClient;

  constructor() {
    super();
    this.app = new DiscordCustomClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    });

    this.addAppCommands(cmds);
    this.registerCommands();
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
      this.debugLog({ message });

      // Return if the author of the message is a bot
      if (message.author.bot) return;
      const user = this.app.user;
      if (user && message.mentions.has(user)) {
        this.handleAppMention(message);
      } else {
        console.log(`not mentioned`);
      }
    });

    this.app.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;

      this.debugLog({ interaction });

      const command = this.app.commands.get(interaction.commandName);

      if (!command) {
        error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (errorData: any) {
        error(`Error while executing command: ${errorData}`);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
          });
        }
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

  addAppCommands = (commands: Command[]) => {
    commands.forEach(command => {
      const discordCommand = {
        data: new SlashCommandBuilder()
          .setName(command.data.name)
          .setDescription(command.data.description),
        execute: command.execute
      };
      this.app.commands.set(command.data.name, discordCommand);
    });
  };

  registerCommands = async () => {
    const commands: any[] = [];
    this.app.commands.forEach(command => {
      commands.push(command.data.toJSON());
    });

    const token = checkEnvVariable('DISCORD_TOKEN');
    const clientId = checkEnvVariable('DISCORD_ID');
    const rest = new REST().setToken(token);
    try {
      info(`Started refreshing ${commands.length} application (/) commands.`);

      const data: any = await rest.put(Routes.applicationCommands(clientId), {
        body: commands
      });

      this.debugLog(data);

      info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (errorData: any) {
      error(`Error refreshing application (/) commands: ${errorData}`);
    }
  };
}

export default DiscordBot;
