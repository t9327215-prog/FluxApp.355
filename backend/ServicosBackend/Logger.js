
// backend/ServicosBackend/Logger.js

import { createNamespace, getNamespace } from 'cls-hooked';
import ServicoLog from './Servico.Logs.Backend.js';

// 1. Cria um namespace único para o contexto da requisição.
const session = createNamespace('request-session');

/**
 * Logger instanciável e com escopo, que injeta automaticamente o traceId.
 */
class Logger {
  constructor(scope) {
    if (!scope) {
      throw new Error('O escopo do logger é obrigatório.');
    }
    this.scope = scope;
  }

  _getTraceId() {
    const requestSession = getNamespace('request-session');
    return requestSession && requestSession.active ? requestSession.get('traceId') : null;
  }

  info(evento, dados = null) {
    ServicoLog.info(this.scope, evento, dados, this._getTraceId());
  }

  warn(evento, dados = null) {
    ServicoLog.warn(this.scope, evento, dados, this._getTraceId());
  }

  error(evento, erro, dados = {}) {
    const errorDetails = {
      ...dados,
    };
    if (erro instanceof Error) {
      errorDetails.errorMessage = erro.message;
      errorDetails.stack = erro.stack;
    } else {
      errorDetails.error = erro;
    }
    ServicoLog.erro(this.scope, evento, errorDetails, this._getTraceId());
  }

  debug(evento, dados = null) {
    ServicoLog.debug(this.scope, evento, dados, this._getTraceId());
  }
}

export const createLogger = (scope) => new Logger(scope);

export { session };
