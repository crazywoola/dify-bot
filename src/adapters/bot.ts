import chalk from 'chalk';
import DifyClient from '../service';
import { FormItem, DifyStreamResponse } from '../types';
import { userInputFormParser, streamParser, error } from '../util';

abstract class Bot {
  difyClient?: DifyClient;
  application?: FormItem[];

  abstract say(message: string): Promise<void>;
  abstract hear(): void;
  abstract up(): Promise<void>;

  setDifyClient(client: DifyClient) {
    this.difyClient = client;
  }
  async setApplication() {
    try {
      const result = await this.difyClient?.getApplication();
      const parsed = userInputFormParser(result?.data.user_input_form || []);
      this.application = parsed;
    } catch (error) {
      this.application = [];
    }
  }

  async send(
    inputs: any,
    query: string,
    user: string,
    callback: (msg: string, error: boolean) => void
  ) {
    try {
      const res: DifyStreamResponse = (await this.difyClient?.createChatMessage(
        inputs,
        query,
        user
      )) as DifyStreamResponse;

      if (!res || !res.data) {
        throw new Error('Invalid stream response');
      }

      const stream = res.data;
      let result = '';

      stream.setEncoding('utf8');

      stream.on('data', (chunk: string) => {
        const word = streamParser(chunk);
        result += word;
        callback(result, false);
      });

      stream.on('end', () => {
        console.log(chalk.green(`RESULT: ${result}`));
        callback(result, false);
      });
    } catch (e) {
      error(`Error while sending message to dify.ai ${e}`);
      callback('', true);
    }
  }
}
export default Bot;
