import 'express-async-errors';
import { Server } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import compression from 'compression';
import express, { json, urlencoded, type Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { createClient } from 'redis';
import { Server as SocketIoServer } from 'socket.io';
import { env, isProduction } from '@infrastructure/config';
import { logger } from '@infrastructure/logging';
import { corsSetup, errorHandler, notFound } from '@infrastructure/middleware';
import { routes } from '@infrastructure/routes';
import { ALLOWED_METHODS, SERVER_PORT } from '@shared/utils';

export class AppServer {
  private app: Application;
  private httpServer: Server | null = null;
  private socketIo: SocketIoServer | null = null;
  private pubClient: ReturnType<typeof createClient> | null = null;
  private subClient: ReturnType<typeof createClient> | null = null;

  constructor() {
    this.app = express();
  }

  public async start(): Promise<void> {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    await this.startServer(this.app);
  }

  public async stop(): Promise<void> {
    try {
      if (this.socketIo) {
        this.socketIo.close();
        logger.info('✅ Socket.IO server closed');
      }

      if (this.pubClient) {
        await this.pubClient.disconnect();
        logger.info('✅ Redis pubClient disconnected');
      }

      if (this.subClient) {
        await this.subClient.disconnect();
        logger.info('✅ Redis subClient disconnected');
      }

      if (this.httpServer) {
        this.httpServer.close(() => {
          logger.info('✅ HTTP server closed');
        });
      }

      logger.info('✅ Server stopped gracefully');
    } catch (error) {
      logger.error('❌ Error stopping server:', error);
      throw error;
    }
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    if (isProduction) {
      app.use(hpp());
      app.use(helmet());
    }
    app.use(corsSetup);
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.use(
      morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) },
      }),
    );
  }

  private routesMiddleware(app: Application): void {
    routes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', notFound);
    app.use(errorHandler);
  }

  private async startServer(app: Application): Promise<void> {
    try {
      this.httpServer = new Server(app);
      this.socketIo = await this.createSocketIo(this.httpServer);
      this.startHttpServer(this.httpServer);
      this.socketIoConnections(this.socketIo);
    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      throw error;
    }
  }

  private async createSocketIo(httpServer: Server): Promise<SocketIoServer> {
    const io: SocketIoServer = new SocketIoServer(httpServer, {
      cors: {
        origin: env.CLIENT_URL,
        methods: ALLOWED_METHODS,
      },
    });
    this.pubClient = createClient({ url: env.REDIS_HOST });
    this.subClient = this.pubClient.duplicate();
    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
    io.adapter(createAdapter(this.pubClient, this.subClient));
    return io;
  }

  private startHttpServer(httpServer: Server): void {
    httpServer.listen(SERVER_PORT, () => {
      logger.info(
        `✅ Server is running on port ${SERVER_PORT} in ${env.NODE_ENV} mode with process ${process.pid}`,
      );
    });
  }

  private socketIoConnections(_io: SocketIoServer): void {}
}
