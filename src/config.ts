import bunyan from 'bunyan';
import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public PORT: string;
  public DATABASE_URI: string;
  public JWT_TOKEN: string;
  public NODE_ENV: string;
  public SECRET_KEY_ONE: string;
  public SECRET_KEY_TWO: string;
  public CLIENT_URL: string;
  public REDIS_HOST: string;
  public CLOUD_NAME: string;
  public CLOUD_API_KEY: string;
  public CLOUD_API_SECRET: string;

  constructor() {
    this.DATABASE_URI =
      process.env.DATABASE_URI || 'mongodb://localhost:27017/chat-app';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.PORT = process.env.PORT || '3000';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig = (): void => {
    for (const [key, value] of Object.entries(this)) {
      // console.log(key,value);
      if (value === undefined) {
        throw new Error(`Configuration key ${key} is undefined`);
      }
    }
  };
}

export const config: Config = new Config();
