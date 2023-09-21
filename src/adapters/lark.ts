import * as lark from '@larksuiteoapi/node-sdk';
import http, { IncomingMessage, ServerResponse } from 'http';
import Bot from './bot';
import { pickRequestData, error } from '../util';

interface RequestData {
  type: string;
  challenge?: string;
  // ... other potential properties ...
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

    this.server = http.createServer(
      async (req: IncomingMessage, res: ServerResponse) => {
        const data: RequestData = (await pickRequestData(req)) as RequestData;
        if (data.type === 'url_verification' && data.challenge) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ challenge: data.challenge }));
        }
      }
    );
  }

  eventDispatcher = new lark.EventDispatcher({}).register({
    'im.message.receive_v1': async (data: MessageData) => {
      const open_chat_id = data.message.chat_id;
      const msgContent = JSON.parse(data.message.content);
      const msg = msgContent.text;

      const res = await this.app.im.message.create({
        params: {
          receive_id_type: 'chat_id'
        },
        data: {
          receive_id: open_chat_id,
          content: JSON.stringify({ text: `hello ${msg}` }),
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
    // Implement the logic if needed
  }

  async up(): Promise<void> {
    this.server
      .on('request', lark.adaptDefault('/webhook/event', this.eventDispatcher))
      .listen(3000);
  }
}

export default LarkBot;
