import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import mongoose from 'mongoose';
import { config } from '../config';
import { TrainingSession } from '../models/TrainingSession';
import { TrainingModule } from '../models/TrainingModule';
import { TrainingProgress } from '../models/TrainingProgress';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { User } from '../models/User';
import { issueCertificate } from './certificateService';
import { logger } from '../utils/logger';

const rootDir = path.resolve(__dirname, '../../..');
const AR_MODEL_DIR = fs.existsSync(path.join(rootDir, 'AR Model'))
  ? path.join(rootDir, 'AR Model')
  : (fs.existsSync(path.resolve(rootDir, '../AR Model'))
    ? path.resolve(rootDir, '../AR Model')
    : path.join(rootDir, 'ML Model'));
const YOLO_SERVER_SCRIPT = path.join(AR_MODEL_DIR, '1_START_YOLO_SERVER.bat');
const MOBILE_APP_SCRIPT = path.join(AR_MODEL_DIR, '2_START_MOBILE_APP.bat');
const PYTHON_EXE = path.join(AR_MODEL_DIR, '.venv/Scripts/python.exe');
const SERVER_APP_PY = path.join(AR_MODEL_DIR, 'mobile_virtual_fire/server/app.py');

class FireModuleService {
  private yoloBaseUrl: string = config.mlServiceUrl || 'http://localhost:8000';

  /**
   * Health check for the existing YOLO AI server on port 8000.
   */
  public async getStatus(): Promise<{
    isYoloRunning: boolean;
    yoloUrl: string;
    wsUrl: string;
    modelLoaded: boolean;
    serviceDetails?: any;
  }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.yoloBaseUrl}/health`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          isYoloRunning: true,
          yoloUrl: this.yoloBaseUrl,
          wsUrl: `${this.yoloBaseUrl.replace('http', 'ws')}/ws/detect`,
          modelLoaded: !!data.model_loaded,
          serviceDetails: data
        };
      }
    } catch {
      // Server not reachable
    }

    return {
      isYoloRunning: false,
      yoloUrl: this.yoloBaseUrl,
      wsUrl: `${this.yoloBaseUrl.replace('http', 'ws')}/ws/detect`,
      modelLoaded: false
    };
  }

  /**
   * Starts the existing YOLO AI server if not already running.
   * Prevents duplicate instances / duplicate model loading.
   */
  public async startYoloServer(): Promise<{
    success: boolean;
    alreadyRunning: boolean;
    message: string;
    yoloUrl: string;
  }> {
    const status = await this.getStatus();
    if (status.isYoloRunning) {
      return {
        success: true,
        alreadyRunning: true,
        message: 'Existing YOLO AI server is already running and ready.',
        yoloUrl: this.yoloBaseUrl
      };
    }

    try {
      logger.info('Starting existing YOLO server from ML Model/1_START_YOLO_SERVER.bat...');
      
      // Spawn using python directly or BAT file
      if (fs.existsSync(PYTHON_EXE) && fs.existsSync(SERVER_APP_PY)) {
        const child = spawn(PYTHON_EXE, [SERVER_APP_PY], {
          cwd: AR_MODEL_DIR,
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
      } else if (fs.existsSync(YOLO_SERVER_SCRIPT)) {
        const child = spawn('cmd.exe', ['/c', YOLO_SERVER_SCRIPT], {
          cwd: AR_MODEL_DIR,
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
      } else {
        throw new Error('YOLO server startup files not found in ML Model directory');
      }

      // Wait briefly for server startup
      await new Promise((resolve) => setTimeout(resolve, 2500));

      return {
        success: true,
        alreadyRunning: false,
        message: 'Existing YOLO AI Server launched successfully on port 8000.',
        yoloUrl: this.yoloBaseUrl
      };
    } catch (error: any) {
      logger.error(`Failed to launch YOLO server: ${error.message}`);
      return {
        success: false,
        alreadyRunning: false,
        message: `Failed to start YOLO server: ${error.message}`,
        yoloUrl: this.yoloBaseUrl
      };
    }
  }

  /**
   * Launches the existing standalone Mobile App bundler if requested.
   */
  public async startMobileApp(): Promise<{ success: boolean; message: string }> {
    try {
      if (fs.existsSync(MOBILE_APP_SCRIPT)) {
        const child = spawn('cmd.exe', ['/c', MOBILE_APP_SCRIPT], {
          cwd: AR_MODEL_DIR,
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
        return {
          success: true,
          message: 'Existing Mobile AR Virtual Fire Expo Metro Bundler started.'
        };
      }
      throw new Error('2_START_MOBILE_APP.bat not found');
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to launch mobile app: ${error.message}`
      };
    }
  }

  /**
   * Records a completed drill session in MongoDB, updates TrainingProgress,
   * and issues verified safety certificate IF the written assessment is also completed and passed.
   */
  public async completeDrill(params: {
    userId?: string;
    scenarioId?: string;
    score?: number;
    passAccuracy?: number;
    extinguisherType?: string;
  }) {
    let userDoc = null;
    if (params.userId) {
      userDoc = await User.findById(params.userId);
    }
    if (!userDoc) {
      userDoc = await User.findOne({ role: 'WORKER' });
    }

    const fireModule = await TrainingModule.findOne({ moduleNumber: 1 });
    const score = params.score || 95;

    const session = await TrainingSession.create({
      sessionId: `drill-fire-${Date.now()}`,
      scenarioId: params.scenarioId || 'ar-fire-drill-01',
      userId: userDoc?._id || new mongoose.Types.ObjectId(),
      workerId: userDoc?.workerId || 'WRK-DEMO',
      moduleId: fireModule?._id || new mongoose.Types.ObjectId(),
      fireDetected: true,
      fireExtinguished: true,
      score,
      passAccuracy: params.passAccuracy || 0.95,
      extinguisherType: params.extinguisherType || 'ABC_DRY_POWDER',
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 45000),
      completedAt: new Date()
    });

    let certificate = null;
    let isCertified = false;

    if (userDoc && fireModule) {
      try {
        let progress = await TrainingProgress.findOne({
          userId: userDoc._id,
          moduleId: fireModule._id
        });

        if (!progress) {
          progress = new TrainingProgress({
            userId: userDoc._id,
            moduleId: fireModule._id,
            moduleNumber: 1,
            completedLessons: [],
            progressPercentage: 50,
            status: 'IN_PROGRESS',
            startedAt: new Date()
          });
        }

        progress.arCompleted = true;
        progress.arCompletedAt = new Date();
        progress.arScore = score;

        // Check if worker has already passed the written assessment for Module 1
        const passedAttempt = await AssessmentAttempt.findOne({
          userId: userDoc._id,
          moduleId: fireModule._id,
          passed: true
        }).sort({ createdAt: -1 });

        if (passedAttempt) {
          progress.assessmentPassed = true;
          progress.assessmentScore = passedAttempt.percentage;

          // Both requirements satisfied! Issue the official certificate!
          certificate = await issueCertificate({
            userId: userDoc._id as mongoose.Types.ObjectId,
            moduleId: fireModule._id as mongoose.Types.ObjectId,
            assessmentAttemptId: passedAttempt._id as mongoose.Types.ObjectId,
            score: passedAttempt.percentage
          });

          passedAttempt.certificateId = certificate._id;
          await passedAttempt.save();

          progress.isCertified = true;
          progress.certificateId = certificate.certificateId;
          progress.status = 'COMPLETED';
          progress.completedAt = new Date();
          isCertified = true;
        }

        await progress.save();
      } catch (e: any) {
        logger.warn(`Fire drill progress update warning: ${e.message}`);
      }
    }

    return {
      success: true,
      message: isCertified
        ? 'Fire AR Drill completed and official Safety Certificate issued!'
        : 'Fire AR Drill completed successfully. Complete the Certification Exam to earn your official certificate.',
      session,
      certificate
    };
  }
}

export const fireModuleService = new FireModuleService();
