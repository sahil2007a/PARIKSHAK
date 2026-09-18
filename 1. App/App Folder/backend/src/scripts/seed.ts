import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config';
import { seedDatabase } from '../services/seedService';
import { logger } from '../utils/logger';

const runSeed = async () => {
  let mongoServer: MongoMemoryServer | null = null;
  try {
    try {
      await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 4000 });
      logger.info('Connected to MongoDB');
    } catch {
      logger.warn('Remote MongoDB not reached, creating local memory server...');
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    }

    await seedDatabase();
    logger.info('Standalone seed script completed.');
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    process.exit(0);
  } catch (error) {
    logger.error('Seed script failed', error);
    process.exit(1);
  }
};

runSeed();
