
import { config } from './ValidaçãoDeAmbiente/config';

/**
 * Um wrapper de logger simples que só exibe logs se o ambiente
 * não for 'production'. Isso evita poluir o console do usuário final
 * e expor detalhes internos da aplicação.
 */
const logger = {
  log: (...args: any[]) => {
    if (config.VITE_APP_ENV !== 'production') {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.VITE_APP_ENV !== 'production') {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Erros geralmente devem ser logados em todos os ambientes,
    // mas para este exemplo, vamos manter consistência.
    // Em um app real, isso enviaria para um serviço de telemetria.
    if (config.VITE_APP_ENV !== 'production') {
      console.error(...args);
    }
  },
};

export default logger;
