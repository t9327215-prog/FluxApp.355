
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Receita.ts

import API_Sistema_Receita from '../APIs/APIsServicoGrupos/API.Sistema.Receita';

const contextoBase = "Servico.Sistema.Receita";

/**
 * Busca os dados de faturamento detalhado de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any>} Uma promessa que resolve com os dados de faturamento.
 */
export const getGroupRevenue = async (groupId: string): Promise<any> => {
    const contexto = `${contextoBase}.getGroupRevenue`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Receita.obterReceita(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};
