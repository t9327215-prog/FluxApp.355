
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Modo.Hub.ts

import API_Sistema_Modo_Hub from '../APIs/APIsServicoGrupos/API.Sistema.Modo.Hub';

const contextoBase = "Servico.Sistema.Modo.Hub";

/**
 * Busca o estado atual do Modo Hub para um grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<{ isEnabled: boolean }>}
 */
export const getHubModeStatus = async (groupId: string): Promise<{ isEnabled: boolean }> => {
    const contexto = `${contextoBase}.getHubModeStatus`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Modo_Hub.obterStatusModoHub(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Define o estado do Modo Hub para um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {{ isEnabled: boolean }} payload - O novo estado.
 * @returns {Promise<any>}
 */
export const setHubModeStatus = async (groupId: string, payload: { isEnabled: boolean }): Promise<any> => {
    const contexto = `${contextoBase}.setHubModeStatus`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Modo_Hub.definirStatusModoHub(groupId, payload);
        return data;
    } catch (error) {
        throw error;
    }
};
