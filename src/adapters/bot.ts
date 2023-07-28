abstract class Bot {
  abstract sendMessage(channel: any, text: string): Promise<void>;
  abstract onMessage(callback: (message: any) => void): void;
  abstract start(): Promise<void>;
}
export default Bot;
