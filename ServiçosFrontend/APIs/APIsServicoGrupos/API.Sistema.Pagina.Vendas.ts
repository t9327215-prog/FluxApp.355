// Arquivo: ServiçosFrontend/APIs/API.Sistema.Pagina.Vendas.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Pagina_Vendas = {
    /**
     * Busca o conteúdo da página de vendas de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterPaginaVendas(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/sales-page`);
    },

    /**
     * Atualiza o conteúdo da página de vendas de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {Object} dadosPagina - Os dados da página de vendas a serem atualizados.
     * @returns {Promise<any>}
     */
    atualizarPaginaVendas(idGrupo: string, dadosPagina: object): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/sales-page`, dadosPagina);
    },
};

export default API_Sistema_Pagina_Vendas;
