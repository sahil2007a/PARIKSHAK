import { Router } from 'express';
import * as certificateController from '../controllers/certificateController';
import { authenticate, authenticateOptional } from '../middleware/auth';

const router = Router();

// Public verification route
router.get('/verify/:identifier', certificateController.verifyCertificate);

// PDF download (accessible by authenticated worker/admin, or with optional token)
router.get('/:id/pdf', authenticateOptional, certificateController.downloadCertificatePdf);

// Protected routes
router.get('/', authenticate, certificateController.getUserCertificates);
router.get('/:id', authenticate, certificateController.getCertificateById);

export default router;
