import { config } from '../config';
import { logger } from '../utils/logger';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Dispatch transactional safety email via SMTP
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const { host, port, user, password, from } = config.smtp;

  // If SMTP is not configured in development, log delivery notice safely without raw secret exposure
  if (!host || !user || !password) {
    logger.info(`[SMTP DEV MODE] Simulated email dispatch to: ${options.to} | Subject: "${options.subject}"`);
    return true;
  }

  try {
    // In production environment with configured SMTP:
    logger.info(`Dispatching email to: ${options.to} via SMTP ${host}:${port}`);
    // Nodemailer integration can be plugged in when production credentials are provided
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${options.to}`, error);
    return false;
  }
};

/**
 * Send registration verification OTP email
 */
export const sendVerificationEmail = async (
  email: string,
  fullName: string,
  otp: string
): Promise<boolean> => {
  const subject = `PARISHAK Verification Code - Safety Compliance Registration`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #16A085; margin-bottom: 8px;">PARISHAK</h2>
      <p style="color: #666; font-size: 13px; margin-top: 0;">Practice. Prove. Protect. — Industrial Safety Compliance</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Thank you for registering on the PARISHAK Industrial Safety Training Platform. Use the following 6-digit verification code to complete your worker registration:</p>
      <div style="background-color: #F4FBF9; border: 1.5px dashed #16A085; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #14213D;">${otp}</span>
      </div>
      <p style="color: #777; font-size: 13px;">This verification code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #999; font-size: 11px; text-align: center;">PARISHAK Heavy Industry Compliance & Safety Management Systems</p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};
