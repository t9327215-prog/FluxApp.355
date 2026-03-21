
// backend/config/Middleware.Logs.js

import { v4 as uuidv4 } from 'uuid';
import { session } from '../ServicosBackend/Logger.js';

/**
 * Middleware para criar um contexto de requisição com um traceId único.
 * Isso permite que o Logger injete o traceId automaticamente em todos os logs
 * gerados durante o processamento desta requisição.
 */
const requestContextMiddleware = (req, res, next) => {
  // session.run() cria um novo contexto que fica ativo durante a callback.
  session.run(() => {
    const traceId = uuidv4();
    
    // Armazena o traceId no contexto ativo.
    // Qualquer chamada a session.get('traceId') dentro desta callback
    // irá retornar este valor.
    session.set('traceId', traceId);

    // Adiciona o traceId ao cabeçalho da resposta para que ele possa ser
    // visto no cliente (útil para depuração ponta a ponta).
    res.setHeader('X-Trace-Id', traceId);
    
    next();
  });
};

export default requestContextMiddleware;
