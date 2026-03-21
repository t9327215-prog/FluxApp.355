
// Arquivo: ServiçosFrontend/APIs/API.Sistema.Grupo.Moderacao.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Grupo_Moderacao = {
    /**
     * Busca as configurações de moderação de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterConfiguracoes(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/moderation`);
    },

    /**
     * Atualiza as configurações de moderação de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} configuracoes - As configurações a serem atualizadas.
     * @returns {Promise<any>}
     */
    atualizarConfiguracoes(idGrupo: string, configuracoes: object): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/moderation`, configuracoes);
    },
};

export default API_Sistema_Grupo_Moderacao;
