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
    callback: (msg: string) => void
  ) {
    let res: DifyStreamResponse;
    try {
      res = (await this.difyClient?.createChatMessage(
        inputs,
        query,
        user
      )) as DifyStreamResponse;
      const stream = res.data;
      let result = '';
      stream.on('data', (chunk: Buffer) => {
        const word = streamParser(chunk.toString());
        console.log(chalk.blue(`RESULT: ${word}`));
        result += word;
        callback(result);
      });
      stream.on('end', () => {
        console.log(chalk.green(`RESULT: ${result}`));
        callback(result);
      });
    } catch {
      error('Error while sending message');
    }
  }
}
export default Bot;
