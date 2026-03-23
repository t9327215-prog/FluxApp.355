
import VariaveisFrontend from '../../Config/Variaveis.Frontend';
import ClienteBackend from '../../Cliente.Backend';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { LogSupremo } from '../../SistemaObservabilidade/Log.Supremo';

/**
 * @file Implementação real da API para autenticação com Google, instrumentada com o sistema de observabilidade.
 */

/**
 * Gera e armazena um ID de rastreamento para a sessão de autenticação.
 * @returns O ID de rastreamento gerado.
 */
const criarTraceIdAuth = (): string => {
    const traceId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('authTraceId', traceId);
    return traceId;
};

/**
 * Recupera e remove o ID de rastreamento da sessão.
 * @returns O ID de rastreamento ou undefined se não for encontrado.
 */
const obterTraceIdAuth = (): string | undefined => {
    const traceId = sessionStorage.getItem('authTraceId');
    sessionStorage.removeItem('authTraceId');
    return traceId || undefined;
}

/**
 * Redireciona o navegador do usuário para a página de autenticação do Google.
 */
export const redirectToGoogleAuth = (): void => {
    const traceId = criarTraceIdAuth();
    LogSupremo.Negocio.registrar('INICIO_FLUXO_LOGIN_GOOGLE', {}, traceId);

    const googleClientId = VariaveisFrontend.googleClientId;

    if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
        const error = new Error("O login com Google não está configurado: Client ID não definido.");
        LogSupremo.Erros.capturar(error, { motivo: "Configuração ausente" }, traceId);
        // Opcional: Notificar o usuário com uma mensagem mais amigável.
        throw error;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    const params = new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: redirectUri,
        scope: 'openid email profile',
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    
    LogSupremo.Log.info('Auth.Google', 'Redirecionando para a URL de autenticação do Google.', {}, traceId);
    window.location.href = authUrl;
};

/**
 * Lida com o callback do Google, enviando o código de autorização para o backend.
 */
export const handleAuthCallback = async (code: string, referredBy?: string): Promise<{ token: string; user: Usuario | null, isNewUser?: boolean }> => {
    const traceId = obterTraceIdAuth();

    if (!code) {
        const error = new Error('O código de autorização do Google não foi recebido no callback.');
        LogSupremo.Erros.capturar(error, { motivo: "Callback sem código" }, traceId);
        LogSupremo.Negocio.registrar('FALHA_LOGIN_GOOGLE', { motivo: "Callback sem código" }, traceId);
        throw error;
    }

    LogSupremo.Log.info('Auth.Google', 'Callback do Google recebido. Enviando código para o backend.', { hasReferredBy: !!referredBy }, traceId);

    const performanceTimer = LogSupremo.Performance.iniciarTimer('backend.auth.google', traceId);

    try {
        const response = await ClienteBackend.post('/auth/google', { code, referredBy });
        
        // Medição de performance em caso de sucesso
        performanceTimer.fim({ success: true, isNewUser: response.data.isNewUser });

        LogSupremo.Negocio.registrar('SUCESSO_LOGIN_GOOGLE', { isNewUser: response.data.isNewUser }, traceId);
        LogSupremo.Log.info('Auth.Google', 'Autenticação via backend bem-sucedida.', { userId: response.data.user?.id }, traceId);

        return response.data;
    } catch (error) {
        // Medição de performance em caso de falha
        performanceTimer.fim({ success: false });

        LogSupremo.Erros.capturar(error as Error, { code, referredBy }, traceId);
        LogSupremo.Negocio.registrar('FALHA_LOGIN_GOOGLE', { motivo: (error as Error).message }, traceId);
        
        // Re-lança o erro para que a UI possa reagir
        throw error;
    }
};
