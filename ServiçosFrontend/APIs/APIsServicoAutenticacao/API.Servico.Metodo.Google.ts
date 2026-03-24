import VariaveisFrontend from '../../Config/Variaveis.Frontend';
import ClienteBackend from '../../Cliente.Backend';
import {
    HandleAuthCallbackRequest, HandleAuthCallbackRequestSchema,
    HandleAuthCallbackResponse, HandleAuthCallbackResponseSchema,
    IServicoMetodoGoogle
} from '../../Contratos/Contrato.Servico.Metodo.Google';
import { LogSupremo } from '../../SistemaObservabilidade/Log.Supremo';

/**
 * @file Implementação da API para autenticação com Google, utilizando contratos e observabilidade.
 */

const criarTraceIdAuth = (): string => {
    const traceId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('authTraceId', traceId);
    return traceId;
};

const obterTraceIdAuth = (): string | undefined => {
    const traceId = sessionStorage.getItem('authTraceId');
    sessionStorage.removeItem('authTraceId');
    return traceId || undefined;
}

class ServicoMetodoGoogle implements IServicoMetodoGoogle {

    redirectToGoogleAuth(): void {
        const traceId = criarTraceIdAuth();
        LogSupremo.Negocio.registrar('INICIO_FLUXO_LOGIN_GOOGLE', {}, traceId);

        const googleClientId = VariaveisFrontend.googleClientId;

        if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
            const error = new Error("O login com Google não está configurado: Client ID não definido.");
            LogSupremo.Erros.capturar(error, { motivo: "Configuração ausente" }, traceId);
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
    }

    async handleAuthCallback(code: string, referredBy?: string): Promise<HandleAuthCallbackResponse> {
        const traceId = obterTraceIdAuth();

        LogSupremo.Log.info('Auth.Google', 'Callback do Google recebido. Validando e enviando código para o backend.', { hasReferredBy: !!referredBy }, traceId);

        // 1. Validar os dados de entrada com o schema
        const dadosParaBackend: HandleAuthCallbackRequest = HandleAuthCallbackRequestSchema.parse({ code, referredBy });

        const performanceTimer = LogSupremo.Performance.iniciarTimer('backend.auth.google', traceId);

        try {
            const respostaBackend = await ClienteBackend.post('/auth/google', dadosParaBackend);
            
            performanceTimer.fim({ success: true, isNewUser: respostaBackend.data.isNewUser });

            // 2. Validar a resposta do backend com o schema
            const dadosValidados = HandleAuthCallbackResponseSchema.parse(respostaBackend.data);

            LogSupremo.Negocio.registrar('SUCESSO_LOGIN_GOOGLE', { isNewUser: dadosValidados.isNewUser }, traceId);
            LogSupremo.Log.info('Auth.Google', 'Autenticação via backend bem-sucedida e validada.', { userId: dadosValidados.user?.id }, traceId);

            return dadosValidados;
        } catch (error) {
            performanceTimer.fim({ success: false });

            LogSupremo.Erros.capturar(error as Error, { code, referredBy }, traceId);
            LogSupremo.Negocio.registrar('FALHA_LOGIN_GOOGLE', { motivo: (error as Error).message }, traceId);
            
            throw error;
        }
    }
}

export default new ServicoMetodoGoogle();
