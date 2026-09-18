import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../models/User';
import { Session, ISession } from '../models/Session';
import { config } from '../config';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export interface TokenPayload {
  sub: string;
  workerId: string;
  role: string;
  sessionId: string;
  type: 'access' | 'refresh';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Hash refresh token with SHA-256 before database storage
 */
export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Create a new user session and issue JWT access + refresh tokens
 */
export const createSessionAndTokens = async (
  user: IUser,
  ipAddress?: string,
  userAgent?: string
): Promise<{ session: ISession; tokens: AuthTokens }> => {
  const sessionId = crypto.randomUUID();

  // Create Refresh Token JWT
  const refreshToken = jwt.sign(
    {
      sub: user.id,
      workerId: user.workerId,
      role: user.role,
      sessionId,
      type: 'refresh'
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
  );

  // Hash refresh token for storage
  const refreshTokenHash = hashRefreshToken(refreshToken);

  // 7 days expiration date
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    sessionId,
    userId: user._id,
    refreshTokenHash,
    ipAddress,
    userAgent,
    expiresAt,
    isRevoked: false,
    lastUsedAt: new Date()
  });

  // Create Access Token JWT
  const accessToken = jwt.sign(
    {
      sub: user.id,
      workerId: user.workerId,
      role: user.role,
      sessionId,
      type: 'access'
    },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn } as jwt.SignOptions
  );

  return {
    session,
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessExpiresIn
    }
  };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
};

/**
 * Verify Refresh Token & Rotate with Token Reuse Protection
 */
export const rotateRefreshToken = async (
  rawRefreshToken: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ tokens: AuthTokens; user: IUser }> => {
  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(rawRefreshToken, config.jwt.refreshSecret) as TokenPayload;
  } catch (err) {
    throw new AppError('Invalid or expired refresh token. Please login again.', 401, 'TOKEN_EXPIRED');
  }

  if (decoded.type !== 'refresh') {
    throw new AppError('Invalid token type for refresh.', 401, 'TOKEN_INVALID');
  }

  const session = await Session.findOne({ sessionId: decoded.sessionId });
  if (!session) {
    throw new AppError('Session not found. Please log in again.', 401, 'UNAUTHORIZED');
  }

  // Token Reuse Detection
  if (session.isRevoked || new Date() > session.expiresAt) {
    // Revoke all sessions for this user due to detected reuse of stale/compromised token
    await Session.updateMany({ userId: session.userId }, { isRevoked: true, revokedAt: new Date() });
    logger.warn(`Potential refresh token reuse detected for user ${session.userId}. All sessions invalidated.`);
    throw new AppError('Security alert: Revoked token presented. All active sessions invalidated.', 401, 'TOKEN_REVOKED');
  }

  const candidateHash = hashRefreshToken(rawRefreshToken);
  if (candidateHash !== session.refreshTokenHash) {
    // Stale or tampered token: revoke this session
    session.isRevoked = true;
    session.revokedAt = new Date();
    await session.save();
    throw new AppError('Refresh token mismatch. Session invalidated.', 401, 'TOKEN_INVALID');
  }

  // Load User
  const { User } = await import('../models/User');
  const user = await User.findById(session.userId);
  if (!user || user.status !== 'ACTIVE') {
    throw new AppError('User account is inactive or suspended.', 403, 'ACCOUNT_INACTIVE');
  }

  // Rotate Refresh Token
  const newRefreshToken = jwt.sign(
    {
      sub: user.id,
      workerId: user.workerId,
      role: user.role,
      sessionId: session.sessionId,
      type: 'refresh'
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
  );

  session.refreshTokenHash = hashRefreshToken(newRefreshToken);
  session.lastUsedAt = new Date();
  if (ipAddress) session.ipAddress = ipAddress;
  if (userAgent) session.userAgent = userAgent;
  await session.save();

  // Create new Access Token
  const newAccessToken = jwt.sign(
    {
      sub: user.id,
      workerId: user.workerId,
      role: user.role,
      sessionId: session.sessionId,
      type: 'access'
    },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn } as jwt.SignOptions
  );

  return {
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: config.jwt.accessExpiresIn
    },
    user
  };
};

/**
 * Revoke specific session (Single Logout)
 */
export const revokeSession = async (sessionId: string): Promise<void> => {
  await Session.findOneAndUpdate(
    { sessionId },
    { isRevoked: true, revokedAt: new Date() }
  );
};

/**
 * Revoke all active sessions for a user (Logout All / Password Reset)
 */
export const revokeAllUserSessions = async (userId: string): Promise<void> => {
  await Session.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true, revokedAt: new Date() }
  );
};
