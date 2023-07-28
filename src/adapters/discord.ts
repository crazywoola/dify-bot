import { Client, Events, GatewayIntentBits, Routes } from 'discord.js';

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

discord.login(process.env.DISCORD_TOKEN);

discord.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});
