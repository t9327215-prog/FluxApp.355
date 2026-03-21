
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Auditoria.Ajuste.ts

import API_Sistema_Auditoria_Ajuste from '../APIs/APIsServicoGrupos/API.Sistema.Auditoria.Ajuste';

/**
 * Busca os logs de auditoria relacionados a ajustes e configurações do grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<Array<any>>} Uma promessa que resolve para a lista de logs de auditoria de ajustes.
 */
export const getSettingsAuditLogs = async (groupId: string): Promise<Array<any>> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Auditoria_Ajuste.obterLogs(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};
