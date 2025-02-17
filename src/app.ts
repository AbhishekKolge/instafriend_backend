import { databaseConnection } from './setup-database';
import { AppServer } from './setup-server';
import express, { type Express } from 'express';

class Application {
  public async initialize(): Promise<void> {
    await databaseConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
