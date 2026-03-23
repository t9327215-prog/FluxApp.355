
import LogProvider from './Log.Provider';

// Placeholder para o futuro módulo de Auditoria de Banco de Dados
class AuditoriaDB {
    public registrar(acao: string, dados: any, traceId?: string) {
        LogProvider.info('Auditoria.DB', `Ação: ${acao}`, dados, traceId);
    }
}

export default new AuditoriaDB();
