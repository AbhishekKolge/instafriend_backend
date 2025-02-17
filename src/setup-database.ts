import mongoose from 'mongoose';
import { config } from './config';

export const databaseConnection = async () => {
  const connect = async () => {
    try {
      await mongoose.connect(config.DATABASE_URL!);
      console.log('successfully connected to database');
    } catch (error) {
      console.log('error connecting to database', error);
      return process.exit(1);
    }
  };

  await connect();

  mongoose.connection.on('disconnected', connect);
};
