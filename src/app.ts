import { AppServer } from './setup-server';
import express, { type Express } from 'express';

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
