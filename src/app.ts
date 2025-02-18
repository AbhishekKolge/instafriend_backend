import 'express-async-errors';
import { config } from './config';
import { connectDatabase } from './setup-database';
import { AppServer } from './setup-server';

class Application {
  public async initialize(): Promise<void> {
    this.loanConfig();
    await connectDatabase();
    const server: AppServer = new AppServer();
    server.start();
  }

  private loanConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
