import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../server';
import { seedDatabase } from '../services/seedService';
import { PendingRegistration } from '../models/PendingRegistration';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { hashOTP } from '../services/otp.service';
import { Express } from 'express';

let app: Express;
let mongoServer: MongoMemoryServer;
let workerToken: string;
let workerRefreshToken: string;
let adminToken: string;
let sampleModuleId: string;
let sampleAssessmentId: string;
let newWorkerId = 'WRK-2099';
let newUserId: string;
let issuedCertSerial: string;
let otherWorkerToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await seedDatabase();
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe('PARISHAK Comprehensive Backend & Database Test Suite', () => {
  // 1. Health Check
  it('1. GET /api/v1/health should return HEALTHY and database connected', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
    expect(res.body.database.status).toBe('CONNECTED');
  });

  // 2. Direct Worker Registration (Creates User with status PENDING for Admin Approval)
  it('2. POST /api/v1/auth/register should create User in MongoDB with status PENDING', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Vikram Singh Munda',
      workerId: newWorkerId,
      phone: '+919876500099',
      email: 'vikram.munda@steel.parishak.safety',
      password: 'Safety@2026Password',
      organizationName: 'Tata Steel Plant Jamshedpur',
      sector: 'STEEL',
      jobRole: 'Blast Furnace Technician',
      experienceYears: 4,
      preferredLanguage: 'hi'
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workerId).toBe(newWorkerId);
    expect(res.body.data.status).toBe('PENDING');
    newUserId = res.body.data.id;

    // Verify in MongoDB: User exists and status is PENDING
    const user = await User.findOne({ workerId: newWorkerId });
    expect(user).not.toBeNull();
    expect(user?.status).toBe('PENDING');
  });

  // 3. Duplicate checks
  it('3. POST /api/v1/auth/register should reject duplicate workerId', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      fullName: 'Duplicate Worker',
      workerId: newWorkerId,
      phone: '+919999999999',
      password: 'Safety@2026Password',
      organizationName: 'Bharat Minerals',
      jobRole: 'Technician'
    });

    expect(res.status).toBe(409);
    expect(res.body.code).toBe('WORKER_ID_ALREADY_EXISTS');
  });

  // 4. Attempt login before Admin Approval (Must be rejected with 403 ACCOUNT_PENDING_APPROVAL)
  it('4. POST /api/v1/auth/login should reject pending worker with ACCOUNT_PENDING_APPROVAL', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      identifier: newWorkerId,
      password: 'Safety@2026Password'
    });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('ACCOUNT_PENDING_APPROVAL');
  });

  // 5. Admin login
  it('5. POST /api/v1/auth/login should authenticate seeded admin', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      identifier: 'ADM-9001',
      password: 'Safety@2026'
    });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('ADMIN');
    adminToken = res.body.data.tokens.accessToken;
  });

  // 6. Admin sees pending worker in Workers registry & Dashboard
  it('6. GET /api/v1/admin/workers?status=PENDING should list the pending worker', async () => {
    const res = await request(app)
      .get('/api/v1/admin/workers?status=PENDING')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.workers).toBeDefined();
    const found = res.body.data.workers.find((w: any) => w.workerId === newWorkerId);
    expect(found).toBeDefined();
    expect(found.status).toBe('PENDING');
  });

  // 7. Admin approves worker (PATCH /api/v1/admin/workers/:id/status -> ACTIVE)
  it('7. Admin approves worker status to ACTIVE in MongoDB', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/workers/${newUserId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'ACTIVE' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify in MongoDB
    const user = await User.findById(newUserId);
    expect(user?.status).toBe('ACTIVE');
  });

  // 8. Newly approved worker can now log in successfully
  it('8. POST /api/v1/auth/login should authenticate approved worker and create session', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      identifier: newWorkerId,
      password: 'Safety@2026Password'
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();

    workerToken = res.body.data.tokens.accessToken;
    workerRefreshToken = res.body.data.tokens.refreshToken;

    // Verify session in MongoDB
    const session = await Session.findOne({ userId: newUserId, isRevoked: false });
    expect(session).not.toBeNull();
  });

  // 9. Fresh worker starts with 0% progress and 0 certified modules
  it('9. GET /api/v1/progress should return 0% progress for new worker', async () => {
    const res = await request(app)
      .get('/api/v1/progress')
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.progress.overallPercentage).toBe(0);
    expect(res.body.data.progress.completedModulesCount).toBe(0);
    expect(res.body.data.progress.certifiedModulesCount).toBe(0);
  });

  // 10. Refresh Token Rotation
  it('10. POST /api/v1/auth/refresh should rotate refresh token and issue new token pair', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({
      refreshToken: workerRefreshToken
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();

    workerToken = res.body.data.tokens.accessToken;
    workerRefreshToken = res.body.data.tokens.refreshToken;
  });

  // 11. User Profile API & Field Isolation
  it('11. GET /api/v1/users/me should return worker profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.workerId).toBe(newWorkerId);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  // 12. RBAC: Worker cannot access Admin endpoints
  it('12. Worker token on /api/v1/admin/dashboard should return 403 FORBIDDEN', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN_ROLE');
  });

  // 13. Training Modules Fetch
  it('13. GET /api/v1/modules should return published modules with 0% progress for new worker', async () => {
    const res = await request(app)
      .get('/api/v1/modules')
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.modules.length).toBeGreaterThanOrEqual(1);

    const firstModule = res.body.data.modules[0];
    expect(firstModule.progressPercentage).toBe(0);
    expect(firstModule.isCertified).toBe(false);

    sampleModuleId = firstModule.id;
  });

  // 14. Fetch Assessment Config
  it('14. GET /api/v1/assessments/module/:id should return assessment configuration', async () => {
    const res = await request(app)
      .get(`/api/v1/assessments/module/${sampleModuleId}`)
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.assessment).toBeDefined();
    expect(res.body.data.assessment.questions.length).toBeGreaterThanOrEqual(1);

    sampleAssessmentId = res.body.data.assessment.id;
  });

  // 15. Submit Assessment & Issue Verifiable Certificate in MongoDB
  it('15. POST /api/v1/assessments/:id/submit should evaluate and issue certificate', async () => {
    const res = await request(app)
      .post(`/api/v1/assessments/${sampleAssessmentId}/submit`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        assessmentId: sampleAssessmentId,
        moduleId: sampleModuleId,
        idempotencyKey: `sub-test-${Date.now()}`,
        timeSpentTotalSeconds: 120,
        answers: [
          {
            questionId: 'q1_pass_sequence',
            selectedOption: ['opt_p', 'opt_a', 'opt_s1', 'opt_s2'],
            timeSpentSeconds: 20
          },
          {
            questionId: 'q2_class_b',
            selectedOption: 'opt_water',
            timeSpentSeconds: 15
          },
          {
            questionId: 'q3_smoke_nav',
            selectedOption: 'opt_false',
            timeSpentSeconds: 10
          },
          {
            questionId: 'q4_muster_action',
            selectedOption: 'opt_refuse_stay',
            timeSpentSeconds: 15
          }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.result.passed).toBe(true);
    expect(res.body.data.result.certificateId).toBeDefined();
    expect(res.body.data.result.percentage).toBeGreaterThanOrEqual(75);

    issuedCertSerial = res.body.data.result.certificateId;
  });

  // 16. Get Certificate by serial ID (Tests safe query without CastError)
  it('16. GET /api/v1/certificates/:id should retrieve certificate using custom serial code', async () => {
    const res = await request(app)
      .get(`/api/v1/certificates/${issuedCertSerial}`)
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.certificate.certificateId).toBe(issuedCertSerial);
    expect(res.body.data.certificate.status).toBe('VALID');
    expect(res.body.data.certificate.workerId).toBe(newWorkerId);
  });

  // 17. Certificate Ownership Protection: Another worker cannot access this certificate
  it('17. Worker cannot access another worker certificate (returns 403 Forbidden)', async () => {
    // Authenticate seeded demo worker (WRK-1001)
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      identifier: 'WRK-1001',
      password: 'Safety@2026'
    });
    expect(loginRes.status).toBe(200);
    otherWorkerToken = loginRes.body.data.tokens.accessToken;

    // Try to access WRK-2099's certificate using WRK-1001's token
    const res = await request(app)
      .get(`/api/v1/certificates/${issuedCertSerial}`)
      .set('Authorization', `Bearer ${otherWorkerToken}`);

    expect(res.status).toBe(403);
  });

  // 18. Public QR Verification: Valid Certificate
  it('18. GET /api/v1/certificates/verify/:identifier should verify active certificate and mask worker ID', async () => {
    const res = await request(app).get(`/api/v1/certificates/verify/${issuedCertSerial}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verification.isValid).toBe(true);
    expect(res.body.data.verification.status).toBe('VALID');
    expect(res.body.data.verification.workerIdMasked).toContain('****');
  });

  // 19. Public QR Verification: Non-existent / Invalid Certificate
  it('19. GET /api/v1/certificates/verify/:identifier should return NOT_FOUND for invalid certificate', async () => {
    const res = await request(app).get('/api/v1/certificates/verify/PRS-INVALID-SERIAL-999');

    expect(res.status).toBe(200);
    expect(res.body.data.verification.status).toBe('NOT_FOUND');
    expect(res.body.data.verification.isValid).toBe(false);
  });

  // 20. Worker Profile Update & Persistence (GET /profile and PATCH /profile)
  it('20. PATCH /api/v1/profile should update profile and persist changes', async () => {
    const patchRes = await request(app)
      .patch('/api/v1/profile')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        jobRole: 'Lead Safety Specialist',
        experienceYears: 6
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.jobRole).toBe('Lead Safety Specialist');
    expect(patchRes.body.data.experienceYears).toBe(6);

    // Fetch again via GET /profile to confirm database persistence
    const getRes = await request(app)
      .get('/api/v1/profile')
      .set('Authorization', `Bearer ${workerToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.data.jobRole).toBe('Lead Safety Specialist');
    expect(getRes.body.data.experienceYears).toBe(6);
  });

  // 21. Tamper Protection: Security fields cannot be modified via profile update
  it('21. Profile update cannot modify protected fields (role, status, workerId)', async () => {
    await request(app)
      .patch('/api/v1/profile')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        role: 'ADMIN',
        status: 'SUSPENDED',
        workerId: 'WRK-HACKED'
      });

    const user = await User.findById(newUserId);
    expect(user?.role).toBe('WORKER');
    expect(user?.status).toBe('ACTIVE');
    expect(user?.workerId).toBe(newWorkerId);
  });

  // 22. Offline Sync Queue Processing: Handles PROFILE_UPDATE and AR_DRILL_TELEMETRY
  it('22. POST /api/v1/sync should process offline AR telemetry and profile queue', async () => {
    const res = await request(app)
      .post('/api/v1/sync')
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        items: [
          {
            id: 'sync-profile-101',
            type: 'PROFILE_UPDATE',
            payload: { phone: '+919876543999' },
            idempotencyKey: 'prof-sync-101',
            createdAt: new Date().toISOString(),
            retryCount: 0
          },
          {
            id: 'sync-ar-102',
            type: 'AR_DRILL_TELEMETRY',
            payload: {
              moduleId: sampleModuleId,
              totalDurationSeconds: 42,
              unsafeActionsTriggered: 0,
              isCompletedSuccessfully: true
            },
            idempotencyKey: 'ar-sync-102',
            createdAt: new Date().toISOString(),
            retryCount: 0
          }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.processedIds).toContain('sync-profile-101');
    expect(res.body.data.processedIds).toContain('sync-ar-102');

    // Confirm phone was updated in DB
    const user = await User.findById(newUserId);
    expect(user?.phone).toBe('+919876543999');
  });

  // 23. Readiness Health Check
  it('23. GET /api/v1/ready should return 200 READY when database is connected', async () => {
    const res = await request(app).get('/api/v1/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('READY');
    expect(res.body.database).toBe('CONNECTED');
  });

  // 24. Admin Dashboard Analytics with Real Aggregated Metrics
  it('24. GET /api/v1/admin/dashboard should return real database aggregated analytics', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.stats.totalWorkers).toBeGreaterThanOrEqual(2);
    expect(res.body.data.stats.totalCertificates).toBeGreaterThanOrEqual(1);
    expect(res.body.data.stats.arDrillStats).toBeDefined();
    expect(res.body.data.stats.arDrillStats.totalArAttempts).toBeGreaterThanOrEqual(1);
    expect(res.body.data.stats.monthlyActivity).toBeDefined();
    expect(Array.isArray(res.body.data.stats.monthlyActivity)).toBe(true);
  });

  // 25. Certificate PDF Generation Stream
  it('25. GET /api/v1/certificates/:id/pdf should stream a valid PDF certificate buffer', async () => {
    const res = await request(app)
      .get(`/api/v1/certificates/${issuedCertSerial}/pdf`)
      .set('Authorization', `Bearer ${workerToken}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body).toBeDefined();
    expect(Buffer.isBuffer(res.body)).toBe(true);
  });

  // 26. Duplicate Certificate Prevention (Idempotent Issuance)
  it('26. Repeated issuance for same attempt should return existing certificate without duplicates', async () => {
    const { Certificate } = await import('../models/Certificate');
    const existingCert = await Certificate.findOne({ certificateId: issuedCertSerial });
    expect(existingCert).toBeDefined();

    const { issueCertificate } = await import('../services/certificateService');
    const certReissue = await issueCertificate({
      userId: existingCert!.userId,
      moduleId: existingCert!.moduleId,
      assessmentAttemptId: existingCert!.assessmentAttemptId,
      score: existingCert!.score
    });

    expect(certReissue.certificateId).toBe(issuedCertSerial);

    // Count how many certificates exist for this attempt
    const count = await Certificate.countDocuments({ assessmentAttemptId: existingCert!.assessmentAttemptId });
    expect(count).toBe(1);
  });

  // 27. Admin Certificate Details & Statistics
  it('27. GET /api/v1/admin/certificates should return stats and GET /api/v1/admin/certificates/:id should retrieve details', async () => {
    const listRes = await request(app)
      .get('/api/v1/admin/certificates')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.stats).toBeDefined();
    expect(listRes.body.data.stats.total).toBeGreaterThanOrEqual(1);
    expect(listRes.body.data.stats.valid).toBeGreaterThanOrEqual(1);

    const firstCert = listRes.body.data.certificates[0];
    expect(firstCert).toBeDefined();

    const detailRes = await request(app)
      .get(`/api/v1/admin/certificates/${firstCert.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(detailRes.status).toBe(200);
    expect(detailRes.body.data.certificate.certificateId).toBe(firstCert.certificateId);
    expect(detailRes.body.data.certificate.workerName).toBe(firstCert.workerName);
  });
});
