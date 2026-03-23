
import LogProvider from './Log.Provider';

/**
 * @file Log.Requisicoes.API.ts
 * @description Módulo especializado para registrar todas as interações com o backend,
 * utilizando o novo Log.Provider para gerar logs estruturados.
 */
const LogRequisicoesAPI = {
  /**
   * Registra a saída de uma requisição da API.
   * @param {object} config - O objeto de configuração da requisição (do Axios).
   */
  logRequest: (config) => {
    const { method, url, metadata, params, data } = config;
    const traceId = metadata?.traceId;

    LogProvider.info(
      'Cliente.Backend.Request',
      `Requisição: ${method.toUpperCase()} ${url}`,
      {
        request: {
          method: method.toUpperCase(),
          url: url,
          params: params,
          data: data,
        },
      },
      traceId
    );
  },

  /**
   * Registra a chegada de uma resposta bem-sucedida da API.
   * @param {object} response - O objeto de resposta (do Axios).
   */
  logResponse: (response) => {
    const { config, status, data } = response;
    const { method, url, metadata } = config;
    const traceId = metadata?.traceId;

    LogProvider.info(
      'Cliente.Backend.Response',
      `Resposta: ${status} para ${method.toUpperCase()} ${url}`,
      {
        request: {
            method: method.toUpperCase(),
            url: url,
        },
        response: {
          status: status,
          data: data,
        },
      },
      traceId
    );
  },

  /**
   * Registra um erro ocorrido durante uma chamada da API.
   * @param {object} error - O objeto de erro (do Axios).
   */
  logError: (error) => {
    if (error.isAxiosError) {
      const { config, response, message } = error;
      const traceId = config?.metadata?.traceId;
      const status = response?.status;

      LogProvider.erro(
        'Cliente.Backend.Error',
        `Erro: ${status || 'Network Error'} em ${config?.method?.toUpperCase()} ${config?.url}`,
        {
          isAxiosError: true,
          message: message,
          request: {
            url: config?.url,
            method: config?.method?.toUpperCase(),
            headers: config?.headers,
          },
          response: response ? {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
          } : 'Sem resposta do servidor',
        },
        traceId
      );
    } else {
        // Log para erros não-axios
        LogProvider.erro('Cliente.Backend.Error', 'Ocorreu um erro inesperado', error);
    }
  }
};

export default LogRequisicoesAPI;
