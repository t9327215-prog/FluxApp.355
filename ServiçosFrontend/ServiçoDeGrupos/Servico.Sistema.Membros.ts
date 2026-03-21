
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Membros.ts

import API_Sistema_Membros from '../APIs/APIsServicoGrupos/API.Sistema.Membros';

const contextoBase = "Servico.Sistema.Membros";

/**
 * Busca a lista de membros de um grupo específico.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any[]>} Uma promessa que resolve para a lista de membros.
 */
export const getGroupMembers = async (groupId: string): Promise<any[]> => {
    const contexto = `${contextoBase}.getGroupMembers`;
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Membros.obter(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Adverte um usuário em um grupo, incluindo um motivo.
 * @param {string} groupId - O ID do grupo.
 * @param {string} userId - O ID do usuário a ser advertido.
 * @param {object} payload - O corpo da requisição, contendo o motivo da advertência. Ex: { reason: '...' }
 * @returns {Promise<object>} Confirmação da ação.
 */
export const warnUser = async (groupId: string, userId: string, payload: { reason: string }): Promise<object> => {
    const contexto = `${contextoBase}.warnUser`;
    if (!groupId || !userId) {
        return Promise.reject('IDs de grupo e/ou usuário não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Membros.advertir(groupId, userId, payload);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Bane um membro de um grupo, incluindo um motivo.
 * @param {string} groupId - O ID do grupo.
 * @param {string} userId - O ID do usuário a ser banido.
 * @param {object} payload - O corpo da requisição, contendo o motivo do banimento. Ex: { reason: '...' }
 * @returns {Promise<object>} Confirmação da ação.
 */
export const banUser = async (groupId: string, userId: string, payload: { reason: string }): Promise<object> => {
    const contexto = `${contextoBase}.banUser`;
    if (!groupId || !userId) {
        return Promise.reject('IDs de grupo e/ou usuário não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Membros.banir(groupId, userId, payload);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Remove (expulsa) um membro de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {string} memberId - O ID do membro a ser expulso.
 * @returns {Promise<object>} Confirmação da ação.
 */
export const kickMember = async (groupId: string, memberId: string): Promise<object> => {
    const contexto = `${contextoBase}.kickMember`;
    if (!groupId || !memberId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        console.warn(`[Refatoração] A implementação para \'kickMember\' ainda precisa ser criada no backend.`);
        const { data } = await API_Sistema_Membros.expulsar(groupId, memberId);
        return data;
    } catch (error) {
        throw error;
    }
};
