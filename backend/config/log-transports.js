
import winston from 'winston';
import path from 'path';

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.resolve('./logs/error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.resolve('./logs/combined.log') })
];

export default transports;
