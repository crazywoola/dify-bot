import { Command } from '../../types';

export const cmds: Command[] = [
  {
    data: {
      name: 'ping',
      description: 'Replies with Pong!',
      options: []
    },
    execute: async interaction => {
      await interaction.reply('Pongg!');
    }
  },
  {
    data: {
      name: 'zing',
      description: 'Replies with ZONG!',
      options: []
    },
    execute: async interaction => {
      await interaction.reply('ZONG!');
    }
  }
];
