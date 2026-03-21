
// Arquivo: ServiçosFrontend/APIs/API.Sistema.Grupo.Diretrizes.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Grupo_Diretrizes = {
    /**
     * Atualiza as diretrizes de texto de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {{ guidelines: string }} diretrizes - O objeto contendo as diretrizes.
     * @returns {Promise<any>}
     */
    atualizarDiretrizes(idGrupo: string, diretrizes: { guidelines: string }): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/guidelines`, diretrizes);
    },

    /**
     * Atualiza as configurações de moderação (slow mode) de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} configuracoes - O objeto contendo as configs de slow mode.
     * @returns {Promise<any>}
     */
    atualizarConfiguracoes(idGrupo: string, configuracoes: object): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/settings`, configuracoes);
    },
    
    /**
     * Obtém as diretrizes de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterDiretrizes(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/guidelines`);
    },
};

export default API_Sistema_Grupo_Diretrizes;
