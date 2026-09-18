import { Request, Response } from 'express';
import { fireModuleService } from '../services/fireModuleService';
import { AuthRequest } from '../middleware/auth';

/**
 * Checks live status of the existing Fire Module / YOLO Server.
 */
export const getFireModuleStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const status = await fireModuleService.getStatus();
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Starts the existing YOLO AI server from ML Model/1_START_YOLO_SERVER.bat.
 * Avoids duplicate server / model loading if already running.
 */
export const startYoloServer = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await fireModuleService.startYoloServer();
    res.status(200).json({
      success: result.success,
      alreadyRunning: result.alreadyRunning,
      message: result.message,
      yoloUrl: result.yoloUrl
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Launches the existing standalone Mobile App bundler from ML Model/2_START_MOBILE_APP.bat.
 */
export const launchMobileApp = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await fireModuleService.startMobileApp();
    res.status(200).json({
      success: result.success,
      message: result.message
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Completes a Fire AR drill, updates worker progress in MongoDB, and issues verified safety certificate.
 */
export const completeFireDrill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?.id;
    const { scenarioId, score, passAccuracy, extinguisherType } = req.body;

    const result = await fireModuleService.completeDrill({
      userId,
      scenarioId,
      score,
      passAccuracy,
      extinguisherType
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        session: result.session,
        certificate: result.certificate
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
