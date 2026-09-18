import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate } from '../middleware/auth';
import { requireRoles } from '../middleware/roleGuard';
import { validateBody } from '../middleware/validate';
import { certificateRevokeSchema, USER_ROLES } from '@parishak/shared';

const router = Router();

router.use(authenticate);
router.use(requireRoles(USER_ROLES.ADMIN, USER_ROLES.ORG_ADMIN));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/workers', adminController.getWorkers);
router.get('/workers/:id', adminController.getWorkerById);
router.patch('/workers/:id/status', adminController.updateWorkerStatus);
router.get('/certificates', adminController.getAdminCertificates);
router.get('/certificates/:id', adminController.getAdminCertificateById);
router.patch('/certificates/:id/verify', adminController.verifyCertificateAdmin);
router.patch('/certificates/:id/revoke', validateBody(certificateRevokeSchema), adminController.revokeCertificate);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
