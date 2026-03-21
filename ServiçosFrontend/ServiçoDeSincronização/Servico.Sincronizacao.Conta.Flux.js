// Arquivo: ServiçosFrontend/ServiçoDeSincronização/Servico.Sincronizacao.Conta.js

import ClienteBackend from '../Cliente.Backend.js';

/**
 * Serviço para sincronização de dados da conta do usuário (configurações, perfil, etc.).
 * Adaptado para a nova arquitetura de sincronização modular.
 */
class ServicoSincronizacaoConta {
    constructor() {
        this.dadosDaConta = null;
        this.estado = 'ocioso'; // ocioso, sincronizando, sucesso, erro
    }

    /**
     * Executa uma sincronização completa, buscando todos os dados da conta no backend.
     * Corresponde a uma atualização forçada.
     */
    async sync() {
        console.log('[Sincronização Conta] Executando sincronização completa...');
        await this._performSync(true); 
    }

    /**
     * Executa uma sincronização incremental (delta).
     * Se os dados já estiverem em cache, não faz nada. Caso contrário, busca no backend.
     */
    async syncDelta() {
        console.log('[Sincronização Conta] Executando sincronização delta...');
        await this._performSync(false);
    }

    /**
     * Lógica principal de sincronização, compartilhada entre sync e syncDelta.
     * @param {boolean} forcar - Se verdadeiro, ignora o cache e força a busca no backend.
     * @private
     */
    async _performSync(forcar = false) {
        if (this.estado === 'sincronizando') {
            console.log('[Sincronização Conta] Sincronização já em andamento.');
            return;
        }

        if (this.estado === 'sucesso' && !forcar) {
            console.log('[Sincronização Conta] Dados já sincronizados. Usando cache.');
            return this.dadosDaConta;
        }

        this.estado = 'sincronizando';

        try {
            const responseData = await ClienteBackend.get('/api/v1/perfil/meu');

            if (!responseData || !responseData.perfil) {
                throw new Error("A resposta da API não contém os dados do perfil esperados.");
            }
            
            this.dadosDaConta = responseData.perfil;
            this.estado = 'sucesso';

            console.log('✅ [Sincronização Conta] Sincronização concluída com sucesso.');
            window.dispatchEvent(new CustomEvent('flux-conta-sincronizada', { detail: this.dadosDaConta }));

        } catch (error) {
            console.error('❌ [Sincronização Conta] Falha ao sincronizar dados da conta:', error);
            this.estado = 'erro';
            // Não lançamos o erro para não parar outras sincronizações no `Promise.all`
        }
    }

    /**
     * Retorna os últimos dados da conta que foram sincronizados.
     */
    getDadosDaConta() {
        return this.dadosDaConta;
    }
}

export const servicoSincronizacaoConta = new ServicoSincronizacaoConta();
