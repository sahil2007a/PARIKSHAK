import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getUserNotifications);
router.patch('/:id/read', notificationController.markAsRead);

export default router;
