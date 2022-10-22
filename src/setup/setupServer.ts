import {
  Application,
  urlencoded,
  json,
  Request,
  Response,
  NextFunction,
} from 'express';

import http from 'http';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import cookieSesion from 'cookie-session';
import Logger from 'bunyan';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import { config } from '../config';
import appilcationRoutes from '../routes';
import { IErrorResponses, CustomError } from '@global/helpers/error-handler';

const log: Logger = config.createLogger('setupServer');

export class ChatServer {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globaErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSesion({
        name: 'session',
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development',
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddleware(app: Application): void {
    appilcationRoutes(app);
  }

  private globaErrorHandler(app: Application): void {
    app.use(
      (
        err: IErrorResponses,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json(err.serializeError());
        }
        next();
      }
    );

    app.all('*', (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found ` });
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);

      const socketIO: Server = await this.createSocketio(httpServer);
      this.socketIOConnections(socketIO);
    } catch (err) {
      log.error(err);
    }
  }

  private async createSocketio(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
      },
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(parseInt(config.PORT), () => {
      log.info(`Server is listening on port ${parseInt(config.PORT)}`);
    });
  }

  private socketIOConnections(io: Server): void {}
}
