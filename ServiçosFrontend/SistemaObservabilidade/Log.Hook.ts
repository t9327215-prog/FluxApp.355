// ServiçosFrontend/SistemaObservabilidade/Log.Hook.ts

import { createLogger } from './Sistema.Mensageiro.Cliente.Backend';

// Definindo uma interface para o contexto do usuário para consistência
interface UserContext {
    userId?: string;
    sessionId?: string;
    ip?: string;
}

// Definindo a interface para o logger do hook para clareza
export interface HookLogger {
    logStart: (functionName: string, data?: any, userContext?: UserContext) => void;
    logSuccess: (functionName: string, resultData?: any, userContext?: UserContext) => void;
    logWarn: (functionName: string, message: string, contextData?: any, userContext?: UserContext) => void;
    logError: (functionName: string, error: any, contextData?: any, userContext?: UserContext) => void;
    logDebug: (functionName: string, message: string, debugData?: any, userContext?: UserContext) => void;
}


/**
 * Cria uma instância de logger aprimorada para um arquivo de Hook específico.
 * Este logger enriquece os logs com contexto detalhado para facilitar a depuração.
 * 
 * @param hookName - O nome do arquivo ou Hook que está usando o logger.
 * @returns Um objeto logger com métodos para registrar início, sucesso, avisos e erros.
 */
export const createHookLogger = (hookName: string): HookLogger => {
    // Cria um logger base, passando o nome do Hook como o "módulo".
    const logger = createLogger(`Hook-${hookName}`);

    // Função auxiliar para construir a base do objeto de log
    const buildLogObject = (functionName: string, level: string, message: string, userContext?: UserContext) => {
        return {
            level,
            message,
            hookName,
            functionName,
            timestamp: new Date().toISOString(),
            env: process.env.NODE_ENV || 'development',
            userContext: userContext || { status: 'Não fornecido' },
        };
    };

    return {
        /**
         * Log para o início da execução de um hook ou função.
         * @param functionName - O nome da função ou lógica sendo executada.
         * @param data - Dados iniciais, como parâmetros da função.
         * @param userContext - Contexto do usuário (ID, sessão, etc.).
         */
        logStart: (functionName: string, data?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'info', `[Start] Executando: ${functionName}`, userContext),
                params: data || null,
            };
            logger.info(logObject.message, logObject);
        },

        /**
         * Log para a conclusão bem-sucedida de uma operação no hook.
         * @param functionName - O nome da função ou lógica que completou.
         * @param resultData - Os dados de resultado da operação.
         * @param userContext - Contexto do usuário.
         */
        logSuccess: (functionName: string, resultData?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'info', `[Success] '${functionName}' concluído com sucesso.`, userContext),
                result: resultData || null,
            };
            logger.info(logObject.message, logObject);
        },
        
        /**
         * Log para um aviso, situação não crítica mas que merece atenção.
         * @param functionName - O nome da função.
         * @param message - Mensagem descritiva do aviso.
         * @param contextData - Dados de contexto para ajudar na análise.
         * @param userContext - Contexto do usuário.
         */
        logWarn: (functionName: string, message: string, contextData?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'warn', `[Warn] Aviso em '${functionName}': ${message}`, userContext),
                contextData: contextData || null,
            };
            logger.warn(logObject.message, logObject);
        },

        /**
         * Log para um erro ocorrido dentro do hook, com o máximo de detalhes.
         * @param functionName - O nome da função ou lógica que falhou.
         * @param error - O objeto de erro capturado.
         * @param contextData - Dados de contexto que podem ter causado o erro (estado, props).
         * @param userContext - Contexto do usuário.
         */
        logError: (functionName: string, error: any, contextData?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'error', `[Error] Erro em '${functionName}': ${error?.message || 'Erro desconhecido'}`, userContext),
                error: {
                    message: error?.message || 'Erro sem mensagem.',
                    name: error?.name || 'UnknownError',
                    stack: error?.stack || 'Stack trace não disponível.',
                    ...(typeof error === 'object' && error !== null ? error : { details: error }),
                },
                contextData: contextData || null,
            };
            logger.error(logObject.message, logObject);
        },
        
        /**
         * Log para depuração, útil para rastrear valores em desenvolvimento.
         * @param functionName - O nome da função.
         * @param message - Uma mensagem descrevendo o que está sendo depurado.
         * @param debugData - Os dados a serem inspecionados.
         * @param userContext - Contexto do usuário.
         */
        logDebug: (functionName: string, message: string, debugData?: any, userContext?: UserContext) => {
            if (process.env.NODE_ENV === 'development') {
                const logObject = {
                    ...buildLogObject(functionName, 'debug', `[Debug] ${functionName}: ${message}`, userContext),
                    debugData: debugData || null,
                };
                logger.debug(logObject.message, logObject);
            }
        },
    };
};
