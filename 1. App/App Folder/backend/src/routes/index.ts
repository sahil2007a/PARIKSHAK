import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import moduleRoutes from './moduleRoutes';
import assessmentRoutes from './assessmentRoutes';
import progressRoutes from './progressRoutes';
import certificateRoutes from './certificateRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';
import fireRoutes from './fireRoutes';
import { config } from '../config';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: config.appName,
    environment: config.env,
    timestamp: new Date().toISOString(),
    database: {
      status: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
      readyState: mongoose.connection.readyState
    }
  });
});

// Readiness Check
router.get('/ready', (_req, res) => {
  const isReady = mongoose.connection.readyState === 1;
  if (isReady) {
    res.status(200).json({
      status: 'READY',
      service: config.appName,
      timestamp: new Date().toISOString(),
      database: 'CONNECTED'
    });
  } else {
    res.status(503).json({
      status: 'NOT_READY',
      service: config.appName,
      timestamp: new Date().toISOString(),
      database: 'DISCONNECTED'
    });
  }
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/profile', userRoutes);
router.use('/modules', moduleRoutes);
router.use('/training', moduleRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/progress', progressRoutes);
router.use('/sync', progressRoutes);
router.use('/certificates', certificateRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/fire', fireRoutes);

export default router;
