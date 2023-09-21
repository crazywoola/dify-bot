import * as lark from '@larksuiteoapi/node-sdk';
import http from 'http';
import Bot from './bot';
import { info } from '../util';

interface RequestData {
  type: string;
  challenge?: string;
}

interface MessageData {
  message: {
    chat_id: string;
    content: string;
  };
}

class LarkBot extends Bot {
  app: lark.Client;
  server: http.Server;

  constructor() {
    super();

    const appId = process.env.LARK_APP_ID!;
    const appSecret = process.env.LARK_APP_SECRET!;

    this.app = new lark.Client({
      appId,
      appSecret,
      appType: lark.AppType.SelfBuild
    });
    this.server = http.createServer();
  }

  handleAppMention = new lark.EventDispatcher({
    encryptKey: process.env.LARK_ENCRYPT_KEY
  }).register({
    'im.message.receive_v1': async (data: any) => {
      console.log(data);
      if (data.sender.sender_type !== 'user') return;
      try {
        const chatId = data.message.chat_id;
        const initialMessage = await this.app.im.message.create({
          params: {
            receive_id_type: 'chat_id'
          },
          data: {
            receive_id: chatId,
            content: JSON.stringify({ text: 'Thinking...' }),
            msg_type: 'text'
          }
        });
        info(`${initialMessage.data?.message_id}`);
        await this.app.im.message.update({
          path: {
            message_id: initialMessage.data?.message_id || ''
          },
          data: {
            msg_type: 'text',
            content: JSON.stringify({ text: 'Yes 💡' })
          }
        });
        return;
      } catch (e) {
        console.log(e);
        return;
      }
    }
  });

  async say(): Promise<void> {
    // Implement the logic if needed
  }

  async hear(): Promise<void> {
    this.server.on(
      'request',
      lark.adaptDefault('/webhook/event', this.handleAppMention, {
        autoChallenge: true
      })
    );
  }

  async up(): Promise<void> {
    info('⚡️ Lark app started');
    this.server.listen(3000);
  }
}

export default LarkBot;
