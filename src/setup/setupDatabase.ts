import mongoose from 'mongoose';
import Logger from 'bunyan';

import { config } from '@root/config';

const log: Logger = config.createLogger('setupDatabse');

export default async () => {
  const connect = async () => {
    mongoose
      .connect(config.DATABASE_URI)
      .then(() => {
        log.info('Successfully connected to DB');
      })
      .catch((error) => {
        log.error(`Error connecting to DB ${error}`);
        return process.exit(1);
      });
  };

  await connect();
  mongoose.connection.on('disconnected', connect);
};
