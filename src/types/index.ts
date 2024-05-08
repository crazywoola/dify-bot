import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection
} from 'discord.js';

export type TextInput = {
  label: string;
  variable: string;
  required: boolean;
  max_length: number;
  default: string;
};

export type Select = {
  label: string;
  variable: string;
  required: boolean;
  options: string[];
  default: string;
};

export type FormItem = {
  type: string;
  label: string;
  variable: string;
  required: boolean;
  max_length?: number;
  default: string;
  options?: string[];
};
export type DifyStreamResponse = {
  data: NodeJS.ReadableStream;
};

export interface Command {
  data: {
    name: string;
    description: string;
    options: FormItem[];
  };
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}
export class DiscordCustomClient extends Client {
  commands: Collection<string, any>;
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
