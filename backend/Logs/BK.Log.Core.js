// backend/Logs/BK.Log.Core.js

import { AsyncLocalStorage } from 'async_hooks';

// AsyncLocalStorage para manter o contexto do traceId através de chamadas assíncronas.
export const asyncLocalStorage = new AsyncLocalStorage();

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const getTimestamp = () => new Date().toISOString();

// Função de log principal e privada deste módulo
const log = (level, scope, message, context = {}) => {
  const store = asyncLocalStorage.getStore();
  const traceId = store?.traceId || 'system';
  const timestamp = getTimestamp();
  
  let levelColor = colors.reset;
  switch(level.toUpperCase()) {
    case 'INFO': levelColor = colors.green; break;
    case 'ERROR': levelColor = colors.red; break;
    case 'WARN': levelColor = colors.yellow; break;
  }

  const formattedScope = `${colors.cyan}[${scope}]${colors.reset}`;
  const formattedTraceId = `${colors.magenta}[${traceId}]${colors.reset}`;
  const formattedLevel = `${levelColor}${level.toUpperCase().padEnd(5)}${colors.reset}`;

  let logMessage = `${timestamp} ${formattedLevel} ${formattedTraceId} ${formattedScope} - ${message}`;

  if (context.error instanceof Error) {
    logMessage += `\n${colors.red}${context.error.stack}${colors.reset}`;
    delete context.error;
  }
  
  if (Object.keys(context).length > 0) {
    logMessage += ` \n${JSON.stringify(context, null, 2)}`;
  }
  
  // Escreve para a saída padrão. server.js já cuida de salvar em arquivo.
  console.log(logMessage);
};

/**
 * Cria uma instância de logger com escopo.
 * @param {string} scope - O nome do módulo/serviço (ex: 'Database').
 */
export const createLogger = (scope = 'general') => ({
  info: (message, context) => log('INFO', scope, message, context),
  error: (message, context) => log('ERROR', scope, message, context),
  warn: (message, context) => log('WARN', scope, message, context),
});
