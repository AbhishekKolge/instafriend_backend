import mongoose from 'mongoose';
import { env } from '@infrastructure/config';
import { logger } from '@infrastructure/logging';
import { delay } from '@shared/utils';

export class Database {
  private static instance: Database;
  private retryAttempts = 0;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('⚠️ MongoDB is already connected.');
      return;
    }

    try {
      await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        socketTimeoutMS: 45000,
        family: 4,
      });

      this.retryAttempts = 0;
      this.isConnected = true;
      logger.info('✅ Successfully connected to MongoDB');
    } catch (error) {
      this.retryAttempts++;

      if (this.retryAttempts < env.MONGO_RETRY_LIMIT) {
        logger.warn(
          `⚠️ Failed to connect to MongoDB (attempt ${this.retryAttempts}/${env.MONGO_RETRY_LIMIT}). Retrying in ${env.MONGO_RETRY_DELAY / 1000} seconds...`,
        );
        await delay(env.MONGO_RETRY_DELAY);
        await this.connect();
      } else {
        logger.error('❌ Failed to connect to MongoDB after retries:', error);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.warn('⚠️ MongoDB is not connected.');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('✅ Successfully disconnected from MongoDB');
    } catch (error) {
      logger.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

const database = Database.getInstance();

export const connectMongoDB = database.connect.bind(database);
export const disconnectMongoDB = database.disconnect.bind(database);
