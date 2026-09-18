import { Router, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import {
  getFireModuleStatus,
  startYoloServer,
  launchMobileApp,
  completeFireDrill
} from '../controllers/fireModuleController';

const router = Router();

// Optional authentication middleware: if token exists, populate req.user & req.userId
const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
      const userId = decoded.sub || decoded.userId;
      if (userId) {
        req.userId = userId;
        const user = await User.findById(userId);
        if (user) req.user = user;
      }
    }
  } catch {
    // Ignore invalid/expired token for optional routes
  }
  next();
};

// 1. Check live status of existing Fire Module & YOLO server
router.get('/status', getFireModuleStatus);
router.get('/health', getFireModuleStatus);

// 2. Start existing YOLO AI server (ML Model/1_START_YOLO_SERVER.bat)
router.post('/start-server', startYoloServer);

// 3. Launch existing standalone Mobile App bundler (ML Model/2_START_MOBILE_APP.bat)
router.post('/launch-mobile', launchMobileApp);

// 4. Complete drill session & issue verified DGMS certificate
router.post('/complete', optionalAuth, completeFireDrill);

export default router;
