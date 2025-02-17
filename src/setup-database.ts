import mongoose from 'mongoose';
import { config } from './config';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.DATABASE_URL!);
    mongoose.connection.on('disconnected', connectDatabase);
    console.log('successfully connected to database');
  } catch (error) {
    console.log('error connecting to database', error);
    return process.exit(1);
  }
};
