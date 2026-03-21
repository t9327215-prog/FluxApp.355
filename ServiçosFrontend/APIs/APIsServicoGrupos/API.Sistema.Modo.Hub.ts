
// Arquivo: ServiçosFrontend/APIs/API.Sistema.Modo.Hub.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Modo_Hub = {
    /**
     * Busca o estado atual do Modo Hub para um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterStatusModoHub(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/api/groups/${idGrupo}/settings/hub-mode`);
    },

    /**
     * Define o estado do Modo Hub para um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} payload - O novo estado. Ex: { isEnabled: true }
     * @returns {Promise<any>}
     */
    definirStatusModoHub(idGrupo: string, payload: { isEnabled: boolean }): Promise<any> {
        return ClienteBackend.put(`/api/groups/${idGrupo}/settings/hub-mode`, payload);
    },
};

export default API_Sistema_Modo_Hub;
