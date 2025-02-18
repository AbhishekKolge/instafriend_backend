import { createAdapter } from '@socket.io/redis-adapter';
import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import {
  json,
  urlencoded,
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { Server } from 'http';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { Server as SocketIoServer } from 'socket.io';
import { config } from './config';
import { routes } from './routes';
import {
  CustomError,
  NotFoundError,
} from './shared/globals/helpers/error-handler';
import morgan from 'morgan';
import { logger } from './shared/globals/helpers/logger';

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
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.IS_PRODUCTION,
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
    app.use(
      morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) },
      })
    );
  }

  private routesMiddleware(app: Application): void {
    routes(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, _res: Response) => {
      throw new NotFoundError(`${req.originalUrl} not available.`);
    });

    app.use(
      (
        error:
          | Error
          | CustomError
          | mongoose.Error
          | mongoose.mongo.MongoServerError,
        _req: Request,
        res: Response,
        _next: NextFunction
      ) => {
        let customError = {
          message: error.message || 'Something went wrong, please try again',
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          status: ReasonPhrases.INTERNAL_SERVER_ERROR,
        };

        if (error instanceof CustomError) {
          customError.statusCode = error.statusCode;
          customError.status = error.status;
        }

        if (error instanceof mongoose.Error) {
        }

        if (error instanceof mongoose.mongo.MongoServerError) {
        }

        res.status(customError.statusCode).json({
          message: customError.message,
          status: customError.status,
        });

        logger.error(error);
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: Server = new Server(app);
      const socketIo: SocketIoServer = await this.createSocketIo(httpServer);
      this.startHttpServer(httpServer);
      this.socketIoConnections(socketIo);
    } catch (error) {
      logger.error(error);
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
      logger.info(
        `Server is running on port ${SERVER_PORT} in ${config.NODE_ENV} mode with process ${process.pid}`
      );
    });
  }

  private socketIoConnections(io: SocketIoServer): void {}
}
