
import LogProvider from './Sistema.Mensageiro.Cliente.Backend';

class RastreadorDeEventos {
    constructor() {
        LogProvider.info('RastreadorDeEventos', 'Inicializado');
    }

    trackPageView(path: string) {
        LogProvider.info('RastreadorDeEventos', `Visualização de Página: ${path}`, { path });
    }

    trackEvent(category: string, action: string, data: object = {}) {
        LogProvider.info('RastreadorDeEventos', `Evento: ${category} - ${action}`, { ...data });
    }

    trackCriticalError(error: Error | string, context: string) {
        const errorData = {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            context,
        };
        LogProvider.error('RastreadorDeEventos', 'Erro Crítico', errorData);
    }

    trackNetworkRequest(requestData: object) {
        LogProvider.info('RastreadorDeEventos', 'Requisição de Rede', requestData);
    }

    trackNetworkRequestError(requestErrorData: object) {
        LogProvider.error('RastreadorDeEventos', 'Erro de Rede', requestErrorData);
    }
}

export const rastreadorDeEventos = new RastreadorDeEventos();
