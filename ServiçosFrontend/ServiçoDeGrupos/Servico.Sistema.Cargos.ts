
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Cargos.ts

import API_Sistema_Cargos from '../APIs/APIsServicoGrupos/API.Sistema.Cargos';

/**
 * Busca todos os cargos de um grupo específico.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any[]>} Uma promessa que resolve para a lista de cargos.
 */
export const getRoles = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Cargos.obter(groupId);
        return data;
    } catch (error) {
        // O erro já é logado pelo interceptor do ClienteBackend
        throw error;
    }
};

/**
 * Cria um novo cargo para um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {object} roleData - Os dados do novo cargo (nome, cor, etc.).
 * @returns {Promise<object>} Uma promessa que resolve para o cargo recém-criado.
 */
export const createRole = async (groupId: string, roleData: object): Promise<object> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Cargos.adicionar(groupId, roleData);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza um cargo existente.
 * @param {string} groupId - O ID do grupo.
 * @param {string} roleId - O ID do cargo a ser atualizado.
 * @param {object} updates - Os campos a serem atualizados.
 * @returns {Promise<object>} Uma promessa que resolve para o cargo atualizado.
 */
export const updateRole = async (groupId: string, roleId: string, updates: object): Promise<object> => {
    if (!groupId || !roleId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Cargos.atualizar(groupId, roleId, updates);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Deleta um cargo.
 * @param {string} groupId - O ID do grupo.
 * @param {string} roleId - O ID do cargo a ser deletado.
 * @returns {Promise<void>} Uma promessa que é resolvida quando o cargo é deletado.
 */
export const deleteRole = async (groupId: string, roleId: string): Promise<void> => {
    if (!groupId || !roleId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Cargos.remover(groupId, roleId);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Atribui um cargo a um membro do grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {string} memberId - O ID do membro.
 * @param {string | null} roleId - O ID do cargo a ser atribuído (ou null para remover).
 * @returns {Promise<object>} Uma promessa com a confirmação.
 */
export const assignRole = async (groupId: string, memberId: string, roleId: string | null): Promise<object> => {
    if (!groupId || !memberId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Cargos.atribuir(groupId, memberId, roleId);
        return data;
    } catch (error) {
        throw error;
    }
};
