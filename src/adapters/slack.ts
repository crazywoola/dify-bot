import chalk from 'chalk';
import debounce from 'lodash/debounce';
import { App, LogLevel } from '@slack/bolt';
import Bot from './bot';
import { error } from '../util';

class SlackBot extends Bot {
  app: App;

  constructor() {
    super();

    this.app = new App({
      socketMode: true, // Enable the socket mode
      token: process.env.SLACK_BOT_TOKEN,
      appToken: process.env.SLACK_APP_TOKEN,
      logLevel: process.env.DEBUG === 'debug' ? LogLevel.DEBUG : LogLevel.INFO
    });
  }

  async say() {}

  handleHello = async ({ message, say }: { message: any; say: any }) => {
    console.log(message);
    await say(`Hey there!`);
  };

  debouncedChatUpdate = debounce(async (client, channel, ts, text) => {
    const params = { channel, ts };
    const isSlackFormatMrkdwn = process.env.SLACK_FORMAT === 'mrkdwn'

    if (isSlackFormatMrkdwn) {
      Object.assign(params, {
        mrkdwn: true,
        markdown_text: text
      });
    } else {
      Object.assign(params, {
        text: text
      });
    }
    await client.chat.update(params);
  }, 100);

  handleAppMention = async ({ event, client }: { event: any; client: any }) => {
    const inputs = {};
    const query = event.text;
    const user = event.user || '';

    const response = await client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: `<@${user}>! Thinking...`
    });

    try {
      if (response.channel && response.ts) {
        this.send(inputs, query, user, async (msg, err) => {
          if (err) {
            await client.chat.update({
              channel: response.channel,
              ts: response.ts,
              text: 'Error while sending message to dify.ai'
            });
          } else {
            this.debouncedChatUpdate(
              client,
              response.channel,
              response.ts,
              msg || 'Unknown response'
            );
          }
        });
      }
    } catch (e) {
      error('Error while sending message to slack');
      error(`${e}`);
    }
  };

  async hear() {
    this.app.message('hello', this.handleHello);
    this.app.event('app_mention', this.handleAppMention);
  }

  async up() {
    await this.app.start();
    console.log(chalk.blue('⚡️ Slack app started'));
  }
}

export default SlackBot;
