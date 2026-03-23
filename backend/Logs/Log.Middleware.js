// backend/Logs/Log.Middleware.js

import { createLogger, asyncLocalStorage } from './BK.Log.Core.js';
import { randomBytes } from 'crypto';

const httpLogger = createLogger('HTTP');

/**
 * Middleware do Express para registrar requisições e criar um contexto de log.
 */
export const requestLoggerMiddleware = (req, res, next) => {
  const traceId = req.headers['x-trace-id'] || randomBytes(8).toString('hex');

  asyncLocalStorage.run({ traceId }, () => {
    req.logger = createLogger('request'); // Logger com escopo de requisição
    req.traceId = traceId;

    const { method, url, ip } = req;
    const start = process.hrtime();

    httpLogger.info(`INBOUND -> ${method} ${url}`, { ip, traceId });

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
      const { statusCode } = res;
      
      let level = 'info';
      if (statusCode >= 500) level = 'error';
      else if (statusCode >= 400) level = 'warn';

      httpLogger[level](`OUTBOUND <- ${method} ${url}`, { statusCode, durationMs: duration, traceId });
    });

    next();
  });
};
