import { Router } from 'express';
import {
  getUserProgress,
  syncOfflineProgress,
  updateModuleLessonProgress,
  getVocationalProgress,
  updateVocationalProgress,
  claimVocationalCertificate
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getUserProgress);
router.post('/lesson', updateModuleLessonProgress);
router.post('/sync', syncOfflineProgress);
router.post('/', syncOfflineProgress);

// Vocational learning platform progress & certification
router.get('/vocational/:moduleId', getVocationalProgress);
router.post('/vocational/:moduleId', updateVocationalProgress);
router.post('/vocational/:moduleId/claim-certificate', claimVocationalCertificate);

export default router;
