
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Auditoria.Entrada.Saida.ts

import API_Sistema_Auditoria_Entrada_Saida from '../APIs/APIsServicoGrupos/API.Sistema.Auditoria.Entrada.Saida';
// import ServicoLog from '../ServicoLogs/ServicoDeLog';

const contextoBase = "Servico.Sistema.Auditoria.Entrada.Saida";

/**
 * Busca os logs de auditoria de entrada e saída de membros no grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any[]>} Uma promessa que resolve para a lista de logs de entrada e saída.
 */
export const getEntryExitLogs = async (groupId: string): Promise<any[]> => {
    const contexto = `${contextoBase}.getEntryExitLogs`;
    if (!groupId) {
        // ServicoLog.aviso(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API_Sistema_Auditoria_Entrada_Saida.obterLogs(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};
