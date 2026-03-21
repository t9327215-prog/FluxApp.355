
// Arquivo: ServiçosFrontend/APIs/API.Sistema.Notificacoes.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Notificacoes = {
    /**
     * Busca as configurações de notificação de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterConfiguracoes(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/notifications`);
    },

    /**
     * Atualiza as configurações de notificação de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} configuracoes - As configurações a serem atualizadas.
     * @returns {Promise<any>}
     */
    atualizarConfiguracoes(idGrupo: string, configuracoes: object): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/notifications`, configuracoes);
    },
};

export default API_Sistema_Notificacoes;
