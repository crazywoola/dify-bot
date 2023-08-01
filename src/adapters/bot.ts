import DifyClient from "../service";
abstract class Bot {
  difyClient: DifyClient | undefined; 

  setDifyClient(client: DifyClient) { // Replace 'any' with the actual type of your chat client
    this.difyClient = client;
  }

  async getApplication() {
    const result = await this.difyClient?.getApplication();
    console.log(result);
  }
  
  abstract say(message: string): Promise<void>;
  abstract hear(callback: (message: any) => void): void;
  abstract up(): Promise<void>;
}
export default Bot;
