
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Auditoria.Mensagens.ts

import API_Sistema_Auditoria_Mensagens from '../APIs/APIsServicoGrupos/API.Sistema.Auditoria.Mensagens';
// import ServicoLog from '../ServicoLogs/ServicoDeLog';

const contextoBase = "Servico.Sistema.Auditoria.Mensagens";

/**
 * Busca os logs de auditoria de mensagens, com um filtro opcional por usuário.
 * @param {string} groupId - O ID do grupo.
 * @param {object} [filter] - Filtros para a busca. Ex: { userId: '...' }
 * @returns {Promise<any[]>} Uma promessa que resolve para a lista de logs de mensagens.
 */
export const getMessageAuditLogs = async (groupId: string, filter?: object): Promise<any[]> => {
    const contexto = `${contextoBase}.getMessageAuditLogs`;
    if (!groupId) {
        // ServicoLog.aviso(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Auditoria_Mensagens.obterLogs(groupId, filter);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Apaga uma mensagem específica dentro de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {string} messageId - O ID da mensagem a ser apagada.
 * @returns {Promise<object>} Uma promessa com a confirmação da exclusão.
 */
export const deleteGroupMessage = async (groupId: string, messageId: string): Promise<object> => {
    const contexto = `${contextoBase}.deleteGroupMessage`;
    if (!groupId || !messageId) {
        // ServicoLog.aviso(contexto, 'IDs não fornecidos.');
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        const { data } = await API_Sistema_Auditoria_Mensagens.apagarMensagem(groupId, messageId);
        return data;
    } catch (error) {
        throw error;
    }
};
