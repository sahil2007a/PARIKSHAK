import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';
import { seedDatabase } from './services/seedService';
import { TrainingModule } from './models/TrainingModule';

export const createApp = (): Express => {
  const app = express();

  // Security HTTP headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow mobile apps, local dev servers, and tools
        if (
          !origin ||
          config.corsOrigins.includes(origin) ||
          origin.startsWith('http://localhost') ||
          origin.startsWith('http://127.0.0.1') ||
          origin.startsWith('exp://')
        ) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev
        }
      },
      credentials: true
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // General API rate limiter
  app.use(config.apiPrefix, apiLimiter);

  // Mount main routes under /api/v1
  app.use(config.apiPrefix, routes);

  // Root redirect/status
  app.get('/', (_req, res) => {
    res.json({
      name: config.appName,
      tagline: 'Practice. Prove. Protect.',
      status: 'ONLINE',
      version: '1.0.0',
      apiPrefix: config.apiPrefix,
      docs: `${config.apiPrefix}/health`
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
};

export const startServer = async () => {
  try {
    await connectDatabase();

    // Auto-seed if database is fresh
    const modulesCount = await TrainingModule.countDocuments();
    if (modulesCount === 0) {
      logger.info('Fresh database detected. Seeding foundational modules...');
      await seedDatabase();
    }

    const app = createApp();

    const server = app.listen(config.port, () => {
      logger.info(`====================================================`);
      logger.info(`  ${config.appName} Production Backend Started`);
      logger.info(`  Environment : ${config.env}`);
      logger.info(`  Port        : ${config.port}`);
      logger.info(`  API Base    : http://localhost:${config.port}${config.apiPrefix}`);
      logger.info(`====================================================`);
    });

    const shutdown = async () => {
      logger.info('Gracefully terminating server...');
      server.close(async () => {
        await disconnectDatabase();
        logger.info('Server and Database disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    return server;
  } catch (error) {
    logger.error('Fatal error during server startup', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}
