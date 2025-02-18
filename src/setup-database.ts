import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './shared/globals/helpers/logger';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL!);
    mongoose.connection.on('disconnected', connectDatabase);
    logger.info('successfully connected to database');
  } catch (error) {
    logger.error('error connecting to database', error);
    return process.exit(1);
  }
};
