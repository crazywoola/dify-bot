import DifyClient from "../service";
import { TextInput, Select } from "../types";
abstract class Bot {
  difyClient: DifyClient | undefined; 
  application?: [TextInput | Select];
  
  setDifyClient(client: DifyClient) {
    this.difyClient = client;
  }

  async getApplication() {
    const result = await this.difyClient?.getApplication();
    this.application = result?.data.user_input_form;
  }
  
  abstract say(message: string): Promise<void>;
  abstract hear(callback: (message: any) => void): void;
  abstract up(): Promise<void>;
}
export default Bot;
