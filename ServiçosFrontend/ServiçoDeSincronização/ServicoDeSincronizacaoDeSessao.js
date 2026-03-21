import { servicoSincronizacaoFeed } from './Servico.Sincronizacao.Feed.js';
import { servicoSincronizacaoChat } from './Servico.Sincronizacao.Chat.js';
import { servicoSincronizacaoNotificacoes } from './Servico.Sincronizacao.Notificacoes.js';
import { servicoSincronizacaoGrupos } from './Servico.Sincronizacao.Grupos.js';
import { servicoSincronizacaoPagamentos } from './Servico.Sincronizacao.Pagamentos.js';
import { servicoSincronizacaoPerfil } from './Servico.Sincronizacao.Perfil.js';
import { servicoSincronizacaoConta } from './Servico.Sincronizacao.Conta.Flux.js';
import { SyncState } from './EstadoDeSincronizacao.js';

/**
 * Orquestra a sincronização de dados da sessão do usuário,
 * delegando tarefas para módulos de sincronização específicos.
 */
class ServicoDeSincronizacaoDeSessao {

    constructor() {
        // Lista de todos os módulos de sincronização
        this.syncModules = [
            servicoSincronizacaoFeed,
            servicoSincronizacaoChat,
            servicoSincronizacaoNotificacoes,
            servicoSincronizacaoGrupos,
            servicoSincronizacaoPagamentos,
            servicoSincronizacaoPerfil,
            servicoSincronizacaoConta
        ];
    }

    /**
     * Executa uma sincronização completa de todos os módulos.
     * Ideal para o primeiro login ou uma atualização manual completa.
     */
    async performFullSync() {
        console.log('Iniciando sincronização completa da sessão...');
        SyncState.setSyncing(true);

        const syncPromises = this.syncModules.map(module => module.sync());

        try {
            await Promise.all(syncPromises);
            console.log('✅ Sincronização completa da sessão concluída com sucesso.');
            SyncState.recordFullSync(); // Marca que a sincronização completa foi feita
        } catch (error) {
            console.error('❌ Erro durante a sincronização completa da sessão:', error);
        } finally {
            SyncState.setSyncing(false);
        }
    }

    /**
     * Executa uma sincronização em background, buscando apenas por atualizações (deltas).
     * Mais leve, ideal para ser executado periodicamente.
     */
    async performBackgroundSync() {
        console.log('Iniciando sincronização em background...');
        
        const backgroundSyncPromises = this.syncModules.map(module => module.syncDelta());

        try {
            await Promise.all(backgroundSyncPromises);
            console.log('✅ Sincronização em background concluída.');
        } catch (error) {
            console.error('❌ Erro durante a sincronização em background:', error);
        }
    }
}

export const servicoDeSincronizacaoDeSessao = new ServicoDeSincronizacaoDeSessao();
