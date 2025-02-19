import { connectMongoDB, disconnectMongoDB } from '@infrastructure/database';
import { AppServer } from '@infrastructure/server';

export class Server {
  private static appServer: AppServer | null = null;

  private constructor() {}

  public static async start(): Promise<void> {
    try {
      await connectMongoDB();
      this.appServer = new AppServer();
      await this.appServer.start();

      process.on('SIGTERM', () => this.stop());
      process.on('SIGINT', () => this.stop());
    } catch {
      await this.stop();
    }
  }

  public static async stop(): Promise<void> {
    try {
      await disconnectMongoDB();
      if (this.appServer) {
        await this.appServer.stop();
      }
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }
}
