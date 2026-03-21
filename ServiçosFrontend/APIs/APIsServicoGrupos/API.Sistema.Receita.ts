// Arquivo: ServiçosFrontend/APIs/API.Sistema.Receita.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Receita = {
    /**
     * Busca os dados de faturamento detalhado de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterReceita(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/revenue`);
    },
};

export default API_Sistema_Receita;
