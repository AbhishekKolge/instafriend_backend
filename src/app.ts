import { config } from './config';
import { databaseConnection } from './setup-database';
import { AppServer } from './setup-server';
import express, { type Express } from 'express';

class Application {
  public async initialize(): Promise<void> {
    this.loanConfig();
    await databaseConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }

  private loanConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
