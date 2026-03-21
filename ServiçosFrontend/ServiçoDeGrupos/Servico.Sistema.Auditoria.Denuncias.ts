
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Auditoria.Denuncias.ts

import API_Sistema_Auditoria_Denuncias from '../APIs/APIsServicoGrupos/API.Sistema.Auditoria.Denuncias';

/**
 * Busca todas as denúncias de um grupo específico.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any[]>} Uma promessa que resolve para a lista de denúncias.
 */
export const getReports = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Auditoria_Denuncias.obterDenuncias(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Rejeita (ignora) uma denúncia específica.
 * @param {string} groupId - O ID do grupo.
 * @param {string} reportId - O ID da denúncia a ser rejeitada.
 * @returns {Promise<object>} Uma promessa com a confirmação da rejeição.
 */
export const dismissReport = async (groupId: string, reportId: string): Promise<object> => {
    if (!groupId || !reportId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Auditoria_Denuncias.rejeitarDenuncia(groupId, reportId);
        return data;
    } catch (error) {
        throw error;
    }
};
