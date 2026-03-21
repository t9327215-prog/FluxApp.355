
import gestorDeRequisicoes from '../ServiçoDeProvedoresDePagamentos/GestorDeRequisicoesDosProvedores.js';

/**
 * Serviço de Transações
 *
 * Este módulo é responsável por buscar dados de transações e faturamento
 * de todos os provedores de pagamento conectados.
 */
export const ServicoDeTransacoes = {

    /**
     * Busca todas as transações para o usuário logado.
     * Opcionalmente, pode filtrar por um ID de grupo específico.
     *
     * @param {string} [groupId] - O ID opcional do grupo para filtrar as transações.
     * @returns {Promise<any[]>} Uma lista de objetos de transação.
     */
    async obterTransacoes(groupId) {
        try {
            // O endpoint do backend deve ser inteligente o suficiente para consolidar
            // as transações de todos os provedores conectados para o usuário autenticado.
            let endpoint = '/transactions';
            if (groupId) {
                endpoint += `?groupId=${groupId}`;
            }
            
            // Nota: O gestor já lida com a autenticação (envio de token)
            const response = await gestorDeRequisicoes.get(endpoint);

            // A resposta esperada é um array de transações
            if (Array.isArray(response)) {
                return response;
            } else if (response && Array.isArray(response.data)) {
                 return response.data; // Se a resposta for um objeto com uma propriedade 'data'
            } else {
                console.warn('A resposta da API de transações não continha um array.', response);
                return [];
            }

        } catch (error) {
            console.error("Erro ao buscar transações:", error);
            // Lançar o erro permite que a UI que chamou a função trate-o
            throw error;
        }
    }
};
