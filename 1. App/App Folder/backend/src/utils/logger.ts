export const logger = {
  info: (msg: string, meta?: unknown) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta !== undefined ? meta : '');
  },
  warn: (msg: string, meta?: unknown) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta !== undefined ? meta : '');
  },
  error: (msg: string, meta?: unknown) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, meta !== undefined ? meta : '');
  },
  debug: (msg: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${msg}`, meta !== undefined ? meta : '');
    }
  }
};
