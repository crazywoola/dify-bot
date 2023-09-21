import * as lark from '@larksuiteoapi/node-sdk';
import http, { Server } from 'http';
import Bot from './bot';
import { info } from '../util';
import debounce from 'lodash/debounce';

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
  server: Server;

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

  debouncedEditUpdate = debounce(async (message, text) => {
    await this.app.im.message.update({
      path: {
        message_id: message.data?.message_id || ''
      },
      data: {
        msg_type: 'text',
        content: JSON.stringify({ text })
      }
    });
  }, 200);

  handleAppMention = new lark.EventDispatcher({
    encryptKey: process.env.LARK_ENCRYPT_KEY
  }).register({
    'im.message.receive_v1': async (data: any) => {
      console.log(data);
      if (data.sender.sender_type !== 'user') return;
      try {
        const inputs = {};
        const query = JSON.parse(data.message.content).text;
        const user = data.sender.sender_id.user_id;

        const initialMessage = await this.app.im.message.create({
          params: {
            receive_id_type: 'chat_id'
          },
          data: {
            receive_id: data.message.chat_id,
            content: JSON.stringify({ text: 'Thinking...' }),
            msg_type: 'text'
          }
        });

        this.send(inputs, query, user, async (msg, err) => {
          if (err) {
            await this.app.im.message.update({
              path: {
                message_id: initialMessage.data?.message_id || ''
              },
              data: {
                msg_type: 'text',
                content: JSON.stringify({
                  text: 'Error while sending message to dify.ai'
                })
              }
            });
          } else {
            this.debouncedEditUpdate(initialMessage, msg || 'Unknown response');
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
