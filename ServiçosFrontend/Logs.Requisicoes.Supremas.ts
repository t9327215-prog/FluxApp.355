
import { config } from './ValidaçãoDeAmbiente/config';

/**
 * Define o contrato para um logger.
 * Qualquer logger usado no sistema deve implementar esta interface.
 */
export interface ILogger {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

/**
 * Um logger especializado para o sistema de validação de requisições.
 * Adiciona um prefixo `[Validador]` para fácil identificação e só exibe logs
 * se o ambiente não for 'production'.
 */
const validationLogger: ILogger = {
  log: (...args: any[]) => {
    if (config.VITE_APP_ENV !== 'production') {
      console.log('[Validetor]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.VITE_APP_ENV !== 'production') {
      console.warn('[Validetor]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (config.VITE_APP_ENV !== 'production') {
      console.error('[Validetor]', ...args);
    }
  },
};

export default validationLogger;
