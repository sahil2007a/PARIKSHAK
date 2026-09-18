import { Router } from 'express';
import * as assessmentController from '../controllers/assessmentController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { assessmentSubmissionSchema } from '@parishak/shared';

const router = Router();

router.use(authenticate);

router.get('/module/:moduleId', assessmentController.getAssessmentByModuleId);
router.get('/:moduleId', assessmentController.getAssessmentByModuleId);
router.post('/:id/submit', validateBody(assessmentSubmissionSchema), assessmentController.submitAssessment);
router.get('/results/:id', assessmentController.getAssessmentResult);

export default router;
