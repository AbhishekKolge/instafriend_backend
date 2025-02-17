import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { json, urlencoded, type Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { Server } from 'http';

export class AppServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware();
    this.globalErrorHandler();
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [],
        maxAge: 24 * 7 * 3600000,
        secure: false,
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(): void {}

  private globalErrorHandler(): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: Server = new Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  // private createSocketIo(httpServer: Server): void {}

  private startHttpServer(httpServer: Server): void {
    httpServer.listen(8000, () => {
      console.log('Server is running on port 8000');
    });
  }
}
