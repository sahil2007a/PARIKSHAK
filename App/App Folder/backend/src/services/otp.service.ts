import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export const generateSecureOTP = (): string => {
  const otpNumber = crypto.randomInt(100000, 1000000);
  return otpNumber.toString();
};

/**
 * Compute SHA-256 hash of raw OTP
 */
export const hashOTP = (rawOtp: string): string => {
  return crypto.createHash('sha256').update(rawOtp.trim()).digest('hex');
};

/**
 * Compare candidate OTP against stored SHA-256 hash in constant time
 */
export const verifyOTPHash = (candidateOtp: string, storedHash: string): boolean => {
  const candidateHash = hashOTP(candidateOtp);
  if (candidateHash.length !== storedHash.length) {
    return false;
  }
  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, 'utf8'),
    Buffer.from(storedHash, 'utf8')
  );
};
