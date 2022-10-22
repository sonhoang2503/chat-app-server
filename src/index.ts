import express, { Express } from 'express';
import { ChatServer } from '@setup/setupServer';
import dbConnection from '@setup/setupDatabase';
import { config } from '@root/config';

class Application {
  public bootstrap(): void {
    dbConnection();
    this.loadConfig();
    const app: Express = express();
    const server: ChatServer = new ChatServer(app);
    console.log(process.env.NODE_ENV);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.bootstrap();
