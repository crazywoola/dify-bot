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

  eventDispatcher = new lark.EventDispatcher({
    encryptKey: process.env.LARK_ENCRYPT_KEY
  }).register({
    'im.message.receive_v1': async (data: any) => {
      console.log(data);
      const chatId = data.message.chat_id;

      const res = await this.app.im.message.create({
        params: {
          receive_id_type: 'chat_id'
        },
        data: {
          receive_id: chatId,
          content: JSON.stringify({ text: 'hello world' }),
          msg_type: 'text'
        }
      });
      return res;
    }
  });

  async say(): Promise<void> {
    // Implement the logic if needed
  }

  async hear(): Promise<void> {
    this.server.on(
      'request',
      lark.adaptDefault('/webhook/event', this.eventDispatcher, {
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
