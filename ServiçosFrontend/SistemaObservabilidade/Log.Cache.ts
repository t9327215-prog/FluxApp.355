
import LogProvider from './Log.Provider';

// Placeholder para o futuro módulo de Logs de Cache
class LogCache {
    public registrar(evento: string, dados: any, traceId?: string) {
        LogProvider.debug('Log.Cache', `Evento de Cache: ${evento}`, dados, traceId);
    }
}

export default new LogCache();
