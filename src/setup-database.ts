import mongoose from 'mongoose';

export const databaseConnection = async () => {
  const connect = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/instafriend_local_db');
      console.log('successfully connected to database');
    } catch (error) {
      console.log('error connecting to database', error);
      return process.exit(1);
    }
  };

  await connect();

  mongoose.connection.on('disconnected', connect);
};
