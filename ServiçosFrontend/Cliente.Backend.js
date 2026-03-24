
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import VariaveisFrontend from './Config/Variaveis.Frontend.js';
import { registrar } from './config/EndpointRegistry.js';
import SistemaLog from '../SistemaFlux/Sistema.Log.ts'; // <-- IMPORTADO O SISTEMA DE LOG

/**
 * Calcula a duração em milissegundos.
 * @param {number} start - O tempo de início registrado.
 * @returns {number} A duração em milissegundos.
 */
function getDurationInMilliseconds(start) {
  if (!start) return 0;
  return performance.now() - start;
}

const ClienteBackend = axios.create({
    baseURL: VariaveisFrontend.apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

// --- INTERCEPTOR DE REQUISIÇÃO ---
ClienteBackend.interceptors.request.use(
    (config) => {
        config.headers['x-trace-id'] = config.headers['x-trace-id'] || uuidv4();
        config.startTime = performance.now();

        registrar('Frontend', [`${config.method.toUpperCase()} ${config.url}`]);

        // LOG DE REQUISIÇÃO USANDO O SISTEMA CENTRALIZADO
        SistemaLog.info(
            'Cliente.Backend.Request',
            `Requisição: ${config.method.toUpperCase()} ${config.url}`,
            {
                request: {
                    method: config.method.toUpperCase(),
                    url: config.url,
                    params: config.params,
                    data: config.data, // JSON da requisição
                },
            }
        );

        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        const traceId = error.config?.headers['x-trace-id'] || 'unknown-trace';
        
        // LOG DE ERRO NA CONFIGURAÇÃO USANDO O SISTEMA CENTRALIZADO
        SistemaLog.erro(
            'Cliente.Backend.Error',
            `Erro na Configuração da Requisição: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.message}`,
            {
                traceId,
                message: error.message,
                request: {
                    url: error.config?.url,
                    method: error.config?.method?.toUpperCase(),
                },
            }
        );
        return Promise.reject(error);
    }
);

// --- INTERCEPTOR DE RESPOSTA ---
ClienteBackend.interceptors.response.use(
    (response) => {
        const duration = getDurationInMilliseconds(response.config.startTime);
        const traceId = response.config.headers['x-trace-id'];

        // LOG DE RESPOSTA BEM-SUCEDIDA USANDO O SISTEMA CENTRALIZADO
        SistemaLog.info(
            'Cliente.Backend.Response',
            `Resposta: ${response.status} para ${response.config.method.toUpperCase()} ${response.config.url} [${duration.toFixed(2)}ms]`,
            {
                traceId,
                request: {
                    method: response.config.method.toUpperCase(),
                    url: response.config.url,
                },
                response: {
                    status: response.status,
                    data: response.data, // JSON da resposta
                },
            }
        );
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const duration = getDurationInMilliseconds(originalRequest?.startTime);
        const traceId = originalRequest?.headers['x-trace-id'] || 'unknown-trace';

        // LOG DE ERRO NA RESPOSTA USANDO O SISTEMA CENTRALIZADO
        SistemaLog.erro(
            'Cliente.Backend.Error',
            `Erro na Requisição: ${originalRequest?.method.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || 'NO RESP'} [${duration.toFixed(2)}ms]`,
            {
                traceId,
                isAxiosError: true,
                message: error.message,
                request: {
                    url: originalRequest?.url,
                    method: originalRequest?.method?.toUpperCase(),
                },
                response: error.response ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data, // JSON do erro
                } : 'Sem resposta do servidor',
            }
        );
        
        // Lógica de renovação de token (preservada)
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return ClienteBackend(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            SistemaLog.info('Auth.Refresh', 'Token expirado. Tentando renovar...', { traceId });

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await ClienteBackend.post('/auth/refresh', { refreshToken });
                
                localStorage.setItem('userToken', data.token);
                ClienteBackend.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
                
                SistemaLog.info('Auth.Refresh', 'Token renovado com sucesso.', { traceId });
                processQueue(null, data.token);

                return ClienteBackend(originalRequest);
            } catch (refreshError) {
                SistemaLog.erro('Auth.Refresh', 'Falha ao renovar o token. Deslogando usuário.', { traceId, error: refreshError });
                processQueue(refreshError, null);

                localStorage.removeItem('userToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('authChange'));
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default ClienteBackend;
