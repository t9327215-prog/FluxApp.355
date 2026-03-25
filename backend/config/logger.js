
import winston from 'winston';
import logFormat from './log-format.js';
import transports from './log-transports.js';

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: transports
});

export default logger;
