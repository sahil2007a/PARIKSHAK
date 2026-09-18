import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './index';
import { logger } from '../utils/logger';

let memoryServer: MongoMemoryServer | null = null;
let isConnecting = false;

/**
 * Mask sensitive credentials from MongoDB URI for safe logging
 */
export const maskMongoUri = (uri: string): string => {
  try {
    return uri.replace(/:([^:@]{2})[^:@]*@/, ':****@');
  } catch {
    return '[PROTECTED_URI]';
  }
};

/**
 * Connect to MongoDB database instance
 */
export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (isConnecting) {
    logger.warn('MongoDB connection already in progress, awaiting existing connection attempt...');
    return mongoose;
  }

  isConnecting = true;

  try {
    // 1. In-memory mode for unit/integration tests
    if (process.env.NODE_ENV === 'test') {
      if (!memoryServer) {
        memoryServer = await MongoMemoryServer.create();
      }
      const testUri = memoryServer.getUri();
      await mongoose.connect(testUri);
      logger.info('Connected to In-Memory MongoDB for Automated Testing');
      isConnecting = false;
      return mongoose;
    }

    // 2. Production / Development Standard & Non-SRV MongoDB Connection
    const uri = config.mongodbUri;
    logger.info(`Connecting to MongoDB at: ${maskMongoUri(uri)}`);

    const mongooseOptions: mongoose.ConnectOptions = {
      dbName: 'parishak',
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      minPoolSize: 2,
      retryWrites: true,
      autoIndex: config.env !== 'production'
    };

    setupConnectionEventListeners();

    try {
      await mongoose.connect(uri, mongooseOptions);
      logger.info('Successfully established connection to MongoDB Database');
    } catch (primaryErr) {
      if (config.useInMemoryFallback && config.env !== 'production') {
        logger.warn(
          'Remote MongoDB connection failed. Initializing local In-Memory MongoMemoryServer fallback for development...',
          primaryErr
        );
        memoryServer = await MongoMemoryServer.create();
        const fallbackUri = memoryServer.getUri();
        await mongoose.connect(fallbackUri, mongooseOptions);
        logger.info(`Connected to In-Memory MongoDB Fallback: ${fallbackUri}`);
      } else {
        logger.error('Fatal: Failed to connect to MongoDB cluster', primaryErr);
        throw primaryErr;
      }
    }

    isConnecting = false;
    return mongoose;
  } catch (error) {
    isConnecting = false;
    logger.error('Failed to initialize MongoDB connection', error);
    throw error;
  }
};

/**
 * Attach lifecycle event listeners to Mongoose connection
 */
const setupConnectionEventListeners = (): void => {
  const db = mongoose.connection;

  db.on('connected', () => {
    logger.info('MongoDB Mongoose event: connected');
  });

  db.on('error', (err) => {
    logger.error('MongoDB Mongoose event error:', err);
  });

  db.on('disconnected', () => {
    logger.warn('MongoDB Mongoose event: disconnected');
  });

  db.on('reconnected', () => {
    logger.info('MongoDB Mongoose event: reconnected');
  });
};

/**
 * Gracefully close database connection on application shutdown
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('MongoDB connection closed gracefully.');
    }
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
      logger.info('In-Memory MongoDB server stopped.');
    }
  } catch (error) {
    logger.error('Error during MongoDB disconnect', error);
  }
};
