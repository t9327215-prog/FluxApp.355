
// backend/ServicosBackend/Servico.Logs.Backend.js

class ServicoLog {

  /**
   * Método de log principal e centralizado.
   * @param {string} level - Nível do log (info, warn, error, debug).
   * @param {string} contexto - O escopo do log (ex: Auth, Pagamento).
   * @param {string} evento - O nome do evento ou etapa do fluxo (ex: AUTH_USER_LOOKUP).
   * @param {object} [dados=null] - Objeto com dados estruturados para contexto.
   * @param {string} [traceId=null] - ID de rastreamento da requisição.
   */
  static log(level, contexto, evento, dados = null, traceId = null) {
    const tempo = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    
    const tracePart = traceId ? ` [traceId=${traceId}]` : '';
    const logString = `[${tempo}] [${levelUpper}] [${contexto}]${tracePart} ${evento}`;

    const writer = levelUpper === 'ERROR' ? console.error : (levelUpper === 'WARN' ? console.warn : console.log);

    const hasData = dados !== null && typeof dados === 'object' && Object.keys(dados).length > 0;

    if (hasData) {
      let safeData = dados;
      try {
        // Apenas para verificar referências circulares antes de logar.
        JSON.stringify(dados);
      } catch (e) {
        safeData = { logError: "Objeto de dados continha referência circular ou não pôde ser serializado." };
      }
      writer(logString, safeData);
    } else {
      writer(logString);
    }
  }

  static info(contexto, evento, dados = null, traceId = null) {
    this.log('info', contexto, evento, dados, traceId);
  }

  /**
   * Log para erros, delegando para o método de log principal.
   * @param {string} contexto - O escopo onde o erro ocorreu.
   * @param {string} evento - Descrição do evento de erro (ex: AUTH_SESSION_CREATION_FAILED).
   * @param {Error|object|any} erro - O objeto de erro.
   * @param {string} [traceId=null] - ID de rastreamento da requisição.
   */
  static erro(contexto, evento, erro, traceId = null) {
    const errorDetails = {};

    if (erro instanceof Error) {
      errorDetails.errorMessage = erro.message;
      errorDetails.stack = erro.stack;
      errorDetails.name = erro.name;
    } else if (typeof erro === 'object' && erro !== null) {
      Object.assign(errorDetails, erro);
    } else {
      errorDetails.details = erro;
    }
    
    this.log('error', contexto, evento, errorDetails, traceId);
  }

  static warn(contexto, evento, dados = null, traceId = null) {
    this.log('warn', contexto, evento, dados, traceId);
  }

  static debug(contexto, evento, dados = null, traceId = null) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', contexto, evento, dados, traceId);
    }
  }
}

export default ServicoLog;
