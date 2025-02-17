import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { json, urlencoded, type Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { Server } from 'http';
import { config } from './config';
import { Server as SocketIoServer } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { routes } from './routes';

const SERVER_PORT = 8000;

export class AppServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler();
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV === 'production',
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
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

  private routesMiddleware(app: Application): void {
    routes(app);
  }

  private globalErrorHandler(): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: Server = new Server(app);
      const socketIo: SocketIoServer = await this.createSocketIo(httpServer);
      this.startHttpServer(httpServer);
      this.socketIoConnections(socketIo);
    } catch (error) {
      console.log(error);
    }
  }

  private async createSocketIo(httpServer: Server): Promise<SocketIoServer> {
    const io: SocketIoServer = new SocketIoServer(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      },
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(
        `Server is running on port ${SERVER_PORT} in ${config.NODE_ENV} mode with process ${process.pid}`
      );
    });
  }

  private socketIoConnections(io: SocketIoServer): void {}
}
