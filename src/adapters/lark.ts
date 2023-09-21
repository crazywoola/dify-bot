import Bot from './bot';

class LarkBot extends Bot {
  constructor() {
    super();
  }
  say(message: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  hear(): void {
    throw new Error('Method not implemented.');
  }
  up(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
export default LarkBot;
