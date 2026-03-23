
import LogProvider from './Log.Provider';

// Placeholder para o futuro módulo de Logs de Integrações
class LogIntegracoes {
    public registrar(servico: string, dados: any, traceId?: string) {
        LogProvider.info('Log.Integracoes', `Integração: ${servico}`, dados, traceId);
    }
}

export default new LogIntegracoes();
