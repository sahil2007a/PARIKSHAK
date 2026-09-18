import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Certificate } from '../models/Certificate';
import { verifyCertificateByTokenOrId } from '../services/certificateService';
import { generateCertificatePdf } from '../services/pdfService';
import { AppError } from '../utils/appError';
import QRCode from 'qrcode';

export const getUserCertificates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401);

    const certificates = await Certificate.find({ userId: req.userId }).sort({
      createdAt: -1
    });

    const results = await Promise.all(
      certificates.map(async (c) => {
        let qrDataUrl = '';
        try {
          qrDataUrl = await QRCode.toDataURL(c.verificationUrl);
        } catch {
          // fallback
        }

        return {
          id: c.id,
          certificateId: c.certificateId,
          verificationToken: c.verificationToken,
          workerName: c.workerName,
          workerId: c.workerId,
          organizationName: c.organizationName,
          moduleId: c.moduleId,
          moduleTitle: c.moduleTitle,
          score: c.score,
          issueDate: c.issueDate.toISOString(),
          expiryDate: c.expiryDate ? c.expiryDate.toISOString() : undefined,
          status: c.status,
          adminVerified: c.adminVerified ?? true,
          verificationUrl: c.verificationUrl,
          qrCodeDataUrl: qrDataUrl,
          qrPayload: {
            certificateId: c.certificateId,
            verifyUrl: c.verificationUrl,
            token: c.verificationToken
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Certificates retrieved',
      data: { certificates: results }
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificateById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError('Certificate identifier is required', 400);

    const trimmedId = id.trim();
    const isObjectId = mongoose.isValidObjectId(trimmedId);

    const query: any = {
      $or: [
        { certificateId: { $regex: new RegExp(`^${trimmedId}$`, 'i') } },
        { verificationToken: trimmedId }
      ]
    };

    if (isObjectId) {
      query.$or.push({ _id: trimmedId });
      query.$or.push({ assessmentAttemptId: trimmedId });
    }

    const cert = await Certificate.findOne(query);
    if (!cert) throw new AppError('Certificate not found', 404, 'CERTIFICATE_NOT_FOUND');

    // Enforce worker ownership (workers can only view their own certificates, admins can view any)
    if (req.user?.role !== 'ADMIN' && req.userId && cert.userId.toString() !== req.userId) {
      throw new AppError('Forbidden: Access denied to this certificate', 403);
    }

    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(cert.verificationUrl);
    } catch {
      // fallback
    }

    res.status(200).json({
      success: true,
      message: 'Certificate details retrieved',
      data: {
        certificate: {
          id: cert.id,
          certificateId: cert.certificateId,
          verificationToken: cert.verificationToken,
          workerName: cert.workerName,
          workerId: cert.workerId,
          organizationName: cert.organizationName,
          moduleId: cert.moduleId,
          moduleTitle: cert.moduleTitle,
          score: cert.score,
          issueDate: cert.issueDate.toISOString(),
          expiryDate: cert.expiryDate ? cert.expiryDate.toISOString() : undefined,
          status: cert.status,
          adminVerified: cert.adminVerified ?? true,
          verificationUrl: cert.verificationUrl,
          qrCodeDataUrl: qrDataUrl,
          revocationReason: cert.revocationReason,
          qrPayload: {
            certificateId: cert.certificateId,
            verifyUrl: cert.verificationUrl,
            token: cert.verificationToken
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier } = req.params; // token or certificate ID e.g. PRS-CERT-2026-X
    const verification = await verifyCertificateByTokenOrId(identifier);

    res.status(200).json({
      success: true,
      message: verification.message,
      data: { verification }
    });
  } catch (error) {
    next(error);
  }
};

export const downloadCertificatePdf = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError('Certificate identifier is required', 400);

    const query = mongoose.isValidObjectId(id)
      ? { $or: [{ _id: id }, { certificateId: id.toUpperCase() }, { verificationToken: id }] }
      : { $or: [{ certificateId: id.toUpperCase() }, { verificationToken: id }] };

    const cert = await Certificate.findOne(query);
    if (!cert) throw new AppError('Certificate not found', 404);

    // If authenticated as worker, ensure ownership; admins can download any
    if (req.user && req.user.role !== 'ADMIN' && req.userId && cert.userId.toString() !== req.userId) {
      throw new AppError('Forbidden: Access denied to this certificate', 403);
    }

    const pdfBuffer = await generateCertificatePdf(cert);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${cert.certificateId}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
