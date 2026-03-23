// backend/Logs/BK.Log.Supremo.js

import { createLogger, asyncLocalStorage } from './BK.Log.Core.js';
import { requestLoggerMiddleware } from './Log.Middleware.js';

/**
 * Módulo unificado de Logging - A Fachada Suprema.
 * 
 * Este módulo exporta todas as funcionalidades de logging necessárias para a aplicação,
 * atuando como um ponto central de acesso ao sistema de logs.
 */
const Log = {
  /**
   * Cria uma instância de logger com um escopo específico.
   * Ideal para ser usado em diferentes módulos e serviços.
   * 
   * @param {string} scope - O nome do escopo (ex: 'AuthService', 'Database').
   * @returns {object} Uma instância do logger com métodos info, error, warn.
   * 
   * @example
   * const logger = Log.createLogger('MeuServico');
   * logger.info('Operação iniciada');
   */
  createLogger: createLogger,

  /**
   * O middleware do Express para log de requisições.
   * Deve ser adicionado à pilha de middlewares do Express para
   * registrar automaticamente todas as requisições INBOUND e OUTBOUND.
   */
  requestLoggerMiddleware: requestLoggerMiddleware,

  /**
   * Middleware de contexto que ativa o AsyncLocalStorage.
   * Embora o requestLoggerMiddleware já faça isso, este middleware pode ser
   * usado separadamente em cenários onde apenas o contexto é necessário
   * sem o log automático de requisições.
   */
  contextMiddleware: (req, res, next) => {
    const store = {
      traceId: req.traceId || 'untraced'
    };
    asyncLocalStorage.run(store, next);
  }
};

export default Log;
