import { Router } from 'express';
import { getMe, updateMe, changePassword } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateProfileSchema } from '../validators/user.validators';

const router = Router();

router.use(authenticate);

router.get('/', getMe);
router.patch('/', validate(updateProfileSchema), updateMe);
router.put('/', validate(updateProfileSchema), updateMe);
router.get('/me', getMe);
router.patch('/me', validate(updateProfileSchema), updateMe);
router.get('/profile', getMe);
router.patch('/profile', validate(updateProfileSchema), updateMe);
router.put('/profile', validate(updateProfileSchema), updateMe);
router.post('/change-password', changePassword);

export default router;
