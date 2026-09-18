import { Router } from 'express';
import * as moduleController from '../controllers/moduleController';

const router = Router();

router.get('/', moduleController.getModules);
router.get('/:id', moduleController.getModuleById);
router.get('/:id/lessons', moduleController.getModuleLessons);

export default router;
