import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current working dir, backend dir, and parent monorepo dir
const possibleEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env.example'),
  path.resolve(__dirname, '../../.env.example')
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  appName: process.env.APP_NAME || 'PARISHAK',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/parishak',
  useInMemoryFallback: process.env.USE_IN_MEMORY_DB_FALLBACK !== 'false',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'parishak_jwt_access_super_secret_key_2026',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'parishak_jwt_refresh_super_secret_key_2026',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'no-reply@parishak.safety'
  },
  certificateBaseUrl: process.env.CERTIFICATE_BASE_URL || 'http://localhost:5173/verify',
  passwordResetBaseUrl: process.env.PASSWORD_RESET_BASE_URL || 'https://app.parishak.safety/reset-password',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8081']
};
