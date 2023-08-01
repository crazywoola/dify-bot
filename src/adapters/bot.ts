abstract class Bot {
  chatClient: any; // Replace 'any' with the actual type of your chat client

  setDifyClient(client: any) { // Replace 'any' with the actual type of your chat client
    this.chatClient = client;
  }
  
  abstract say(message: string): Promise<void>;
  abstract hear(callback: (message: any) => void): void;
  abstract up(): Promise<void>;
}
export default Bot;
