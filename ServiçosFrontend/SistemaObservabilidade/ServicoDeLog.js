import VariaveisFrontend from '../Config/Variaveis.Frontend.js';
import { rastreadorDeEventos } from './Rastreador.Eventos.js';

const NIVEIS_DE_LOG = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

const chavesSensiveis = ['token', 'password', 'senha', 'authorization', 'secret', 'apiKey', 'clientSecret'];

/**
 * Mascara recursivamente dados sensíveis em um objeto.
 * @param {*} data - Os dados a serem mascarados.
 * @returns {*} Os dados com valores sensíveis substituídos.
 */
const mascararDados = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(mascararDados);
  }

  return Object.keys(data).reduce((acc, key) => {
    if (chavesSensiveis.some(chaveSensivel => new RegExp(chaveSensivel, 'i').test(key))) {
      acc[key] = '[MASCARADO]';
    } else {
      acc[key] = mascararDados(data[key]);
    }
    return acc;
  }, {});
};

class ServicoLog {
  static ativo = true;
  static levelMinimo = VariaveisFrontend.mode === 'production' ? NIVEIS_DE_LOG.WARN : NIVEIS_DE_LOG.INFO;

  static log(level, contexto, mensagem, dados = null, requestId = null) {
    if (!ServicoLog.ativo || NIVEIS_DE_LOG[level.toUpperCase()] < ServicoLog.levelMinimo) {
      return;
    }

    // Envio para serviço de observabilidade
    if (level === 'error' || level === 'fatal') {
        rastreadorDeEventos.trackCriticalError(dados instanceof Error ? dados : new Error(mensagem), { contexto, requestId, extraData: dados });
    }

    const tempo = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    const ambiente = VariaveisFrontend.mode.toUpperCase();
    const idPart = requestId ? `[${requestId}] ` : '';
    const logString = `[${tempo}] [${ambiente}] [${levelUpper}] ${idPart}[${contexto}] ${mensagem}`;

    const logFunction = console[level] || console.log;
    const dadosMascarados = mascararDados(dados);

    if (dadosMascarados !== null && dadosMascarados !== undefined) {
        logFunction(logString, dadosMascarados);
    } else {
        logFunction(logString);
    }
  }

  static info(contexto, mensagem, dados = null, requestId = null) {
    this.log('info', contexto, mensagem, dados, requestId);
  }

  static warn(contexto, mensagem, dados = null, requestId = null) {
    this.log('warn', contexto, mensagem, dados, requestId);
  }

  static erro(contexto, mensagem, erro = null, requestId = null) {
    this.log('error', contexto, mensagem, erro, requestId);
  }

  static fatal(contexto, mensagem, erro = null, requestId = null) {
    this.log('fatal', contexto, mensagem, erro, requestId);
  }

  static debug(contexto, mensagem, dados = null, requestId = null) {
    this.log('debug', contexto, mensagem, dados, requestId);
  }
}

export default ServicoLog;
