// Sincronização do Chat (Novas mensagens, status de leitura)
class ServicoSincronizacaoChat {
    async sync() {
        console.log('[Sincronização] Sincronizando Chat completo...');
        // TODO: Implementar a lógica para buscar todo o histórico de chat
    }

    async syncDelta() {
        console.log('[Sincronização] Sincronizando apenas as novas mensagens...');
        // TODO: Implementar a lógica para buscar apenas as atualizações incrementais
    }
}

export const servicoSincronizacaoChat = new ServicoSincronizacaoChat();
