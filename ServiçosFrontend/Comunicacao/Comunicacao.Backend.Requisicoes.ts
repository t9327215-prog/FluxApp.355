// ServiçosFrontend/Comunicacao/Comunicacao.Backend.Requisicoes.ts

import { createLogger } from './Comunicacao.Backend.Observabilidade';

// Diagnóstico de carregamento de módulo (visível no console do navegador e logs do Render)
console.log('[SISTEMA] Módulo Comunicacao.Backend.Requisicoes carregando...');

// Criando o logger via fábrica direta para evitar dependências circulares com Log.Infra
const logger = createLogger('Infra.HttpClient');

const chavesSensiveis = ['password', 'token', 'authorization', 'cookie', 'senha', 'refreshToken', 'secret'];

/**
 * Mascaramento leve de objetos para log.
 * @param obj - O dado a ser mascarado.
 * @returns - O dado mascarado (cópia superficial ou parcial).
 */
const mascararLog = (obj: any): any => {
    try {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof FormData) return '[FormData]';
        if (Array.isArray(obj)) return `[Array(${obj.length})]`;
        
        const clone: any = {};
        for (const key in obj) {
            if (chavesSensiveis.some(k => key.toLowerCase().includes(k))) {
                clone[key] = '[MASCARADO]';
            } else {
                const val = obj[key];
                // Evita recursão profunda para evitar estouros de pilha no log
                clone[key] = (typeof val === 'object' && val !== null) ? '[Object]' : val;
            }
        }
        return clone;
    } catch (e) {
        return '[Erro ao mascarar log]';
    }
};

class HttpClient {
    private isRefreshing = false;
    private failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach(prom => {
            if (error) prom.reject(error);
            else prom.resolve(token);
        });
        this.failedQueue = [];
    }

    public async customFetch(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> {
        // Geração de Trace ID compatível com browsers antigos e Capacitor
        const traceId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
            ? crypto.randomUUID() 
            : Math.random().toString(36).substring(2, 15);
        
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('x-trace-id', traceId);

        if (options.headers) {
            const extraHeaders = new Headers(options.headers);
            extraHeaders.forEach((valor, chave) => headers.set(chave, valor));
        }

        const token = localStorage.getItem('userToken');
        if (token) headers.set('Authorization', `Bearer ${token}`);

        const config: RequestInit = { ...options, headers };
        const startTime = performance.now();
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        // Se for FormData, removemos o Content-Type manual para o navegador definir o boundary correto
        if (config.body instanceof FormData) {
            headers.delete('Content-Type');
        }

        // --- Log Simples de Requisição ---
        try {
            logger.info(`Request: ${config.method || 'GET'} ${url}`, {
                traceId,
                url,
                method: config.method || 'GET',
                // Mascaramos apenas os headers para segurança básica
                headers: mascararLog(Object.fromEntries(headers.entries()))
            });
        } catch (e) {}

        try {
            const response = await fetch(url, config);
            const duration = (performance.now() - startTime).toFixed(2);

            if (response.status === 401 && !isRetry) {
                if (this.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    }).then(newToken => {
                        headers.set('Authorization', `Bearer ${newToken}`);
                        return this.customFetch(endpoint, { ...options, headers }, true);
                    });
                }

                this.isRefreshing = true;
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('Refresh token não encontrado.');
                    
                    const refreshResponse = await fetch('/api/auth/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });

                    if (!refreshResponse.ok) throw new Error('Falha na renovação do token.');
                    
                    const { token: newToken } = await refreshResponse.json();
                    localStorage.setItem('userToken', newToken);
                    this.processQueue(null, newToken);
                    
                    headers.set('Authorization', `Bearer ${newToken}`);
                    return await this.customFetch(endpoint, { ...options, headers }, true);
                } catch (error) {
                    logger.error('Sessão expirada. Redirecionando para login.', error);
                    this.processQueue(error, null);
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new Event('authChange'));
                    return Promise.reject(error);
                } finally {
                    this.isRefreshing = false;
                }
            }

            // Tratamento de resposta vazia ou não JSON
            const text = await response.text();
            let data = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                data = { raw: text };
            }
            
            if (!response.ok) {
                logger.error(`Response Error: ${response.status} ${url}`, { 
                    duration: `${duration}ms`, 
                    data: mascararLog(data) 
                });
                const error = new Error(data?.mensagem || data?.message || `Erro ${response.status}`);
                (error as any).response = { data, status: response.status };
                throw error;
            }

            logger.info(`Response Success: ${response.status} ${url}`, { duration: `${duration}ms` });
            return data;

        } catch (error: any) {
            if (!(error instanceof Error && (error as any).response)) {
                logger.error(`Connection Failed: ${url}`, { error: error.message });
            }
            throw error;
        }
    }

    public get<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'GET' });
    }

    public post<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = (data instanceof FormData || typeof data === 'string') ? data : JSON.stringify(data);
        return this.customFetch(url, { ...config, method: 'POST', body });
    }

    public put<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = (data instanceof FormData || typeof data === 'string') ? data : JSON.stringify(data);
        return this.customFetch(url, { ...config, method: 'PUT', body });
    }

    public delete<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();
console.log('[SISTEMA] Módulo Comunicacao.Backend.Requisicoes inicializado com sucesso.');
