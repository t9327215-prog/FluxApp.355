
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Mensagens.Agendadas.ts

import API_Sistema_Mensagens_Agendadas from '../APIs/APIsServicoGrupos/API.Sistema.Mensagens.Agendadas';

const contextoBase = "Servico.Sistema.Mensagens.Agendadas";

/**
 * Busca as mensagens agendadas de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any[]>} Uma promessa que resolve com a lista de mensagens agendadas.
 */
export const getScheduledMessages = async (groupId: string): Promise<any[]> => {
    const contexto = `${contextoBase}.getScheduledMessages`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Mensagens_Agendadas.obterMensagensAgendadas(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Cria uma nova mensagem agendada.
 * @param {string} groupId - O ID do grupo.
 * @param {any} messageData - Os dados da mensagem a ser agendada.
 * @returns {Promise<any>} Uma promessa que resolve com a mensagem agendada criada.
 */
export const createScheduledMessage = async (groupId: string, messageData: any): Promise<any> => {
    const contexto = `${contextoBase}.createScheduledMessage`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Mensagens_Agendadas.criarMensagemAgendada(groupId, messageData);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza uma mensagem agendada.
 * @param {string} groupId - O ID do grupo.
 * @param {string} messageId - O ID da mensagem agendada.
 * @param {any} messageData - Os dados atualizados da mensagem.
 * @returns {Promise<any>} Uma promessa que resolve com a mensagem agendada atualizada.
 */
export const updateScheduledMessage = async (groupId: string, messageId: string, messageData: any): Promise<any> => {
    const contexto = `${contextoBase}.updateScheduledMessage`;
    if (!groupId || !messageId) {
        const erro = "Os IDs do grupo e da mensagem são obrigatórios.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Mensagens_Agendadas.atualizarMensagemAgendada(groupId, messageId, messageData);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Deleta uma mensagem agendada.
 * @param {string} groupId - O ID do grupo.
 * @param {string} messageId - O ID da mensagem agendada.
 * @returns {Promise<any>} Uma promessa que resolve com o resultado da operação.
 */
export const deleteScheduledMessage = async (groupId: string, messageId: string): Promise<any> => {
    const contexto = `${contextoBase}.deleteScheduledMessage`;
    if (!groupId || !messageId) {
        const erro = "Os IDs do grupo e da mensagem são obrigatórios.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Mensagens_Agendadas.deletarMensagemAgendada(groupId, messageId);
        return data;
    } catch (error) {
        throw error;
    }
};
