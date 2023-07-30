abstract class Bot {
  abstract say(message: string): Promise<void>;
  abstract hear(callback: (message: any) => void): void;
  abstract up(): Promise<void>;
}
export default Bot;
