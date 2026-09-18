import { Router } from 'express';
import {
  register,
  initiateRegister,
  verifyRegistrationController,
  resendVerification,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  verifyRegistrationSchema,
  resendVerificationSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/auth.validators';

const router = Router();

// Registration & Verification
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/initiate-register', authLimiter, validate(registerSchema), initiateRegister);
router.post('/verify-registration', authLimiter, validate(verifyRegistrationSchema), verifyRegistrationController);
router.post('/resend-verification', authLimiter, validate(resendVerificationSchema), resendVerification);

// Authentication & Session
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);

// Password Management
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// Profile
router.get('/me', authenticate, getMe);

export default router;
