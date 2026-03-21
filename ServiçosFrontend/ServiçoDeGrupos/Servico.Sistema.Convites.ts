
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Convites.ts

import { config } from '../ValidaçãoDeAmbiente/config';
import * as mockApi from '../ServiçoDeSimulação/simulacoes/Simulacao.Grupo.Config.Convites';
import realApi from '../APIs/APIsServicoGrupos/API.Sistema.Convites';
// import ServicoLog from '../ServicoLogs/ServicoDeLog';

// Use a simulação se VITE_APP_ENV for 'simulation', caso contrário, use a API real.
const API_Sistema_Convites = config.VITE_APP_ENV === 'simulation' ? mockApi : realApi;

const contextoBase = "Servico.Sistema.Convites";

/**
 * Busca todos os links de convite de um grupo específico.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any[]>} Uma promessa que resolve para a lista de links.
 */
export const getInviteLinks = async (groupId: string): Promise<any[]> => {
    const contexto = `${contextoBase}.getInviteLinks`;
    if (!groupId) {
        // ServicoLog.aviso(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Convites.obter(groupId);
        return data;
    } catch (error) {
        // O erro já é logado pelo interceptor do ClienteBackend
        throw error;
    }
};

/**
 * Cria um novo link de convite para um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {object} linkData - Os dados do novo link (nome, tipo, expiração, etc.).
 * @returns {Promise<object>} Uma promessa que resolve para o link recém-criado.
 */
export const createInviteLink = async (groupId: string, linkData: object): Promise<object> => {
    const contexto = `${contextoBase}.createInviteLink`;
    if (!groupId) {
        // ServicoLog.aviso(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Convites.criar(groupId, linkData);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Revoga (desativa) um link de convite existente.
 * @param {string} groupId - O ID do grupo.
 * @param {string} linkId - O ID do link a ser revogado.
 * @returns {Promise<object>} Uma promessa com a confirmação da revogação.
 */
export const revokeInviteLink = async (groupId: string, linkId: string): Promise<object> => {
    const contexto = `${contextoBase}.revokeInviteLink`;
    if (!groupId || !linkId) {
        // ServicoLog.aviso(contexto, 'IDs não fornecidos.');
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        // A resposta de um DELETE bem-sucedido pode não ter corpo (data), 
        // então retornamos um objeto de sucesso genérico ou a própria resposta.
        const resposta = await API_Sistema_Convites.revogar(groupId, linkId);
        return resposta.data || { success: true };
    } catch (error) {
        throw error;
    }
};
