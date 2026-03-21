
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Cargos = {
    /**
     * Busca os cargos de um grupo específico.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obter(idGrupo: string): Promise<any> {
        // O endpoint correto não deve ter /api, o ClienteBackend já resolve isso.
        return ClienteBackend.get(`/groups/${idGrupo}/roles`);
    },

    /**
     * Adiciona um novo cargo a um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} dadosCargo - Os dados do novo cargo (nome, permissões, etc.).
     * @returns {Promise<any>}
     */
    adicionar(idGrupo: string, dadosCargo: any): Promise<any> {
        return ClienteBackend.post(`/groups/${idGrupo}/roles`, dadosCargo);
    },

    /**
     * Atualiza um cargo existente em um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idCargo - O ID do cargo a ser atualizado.
     * @param {object} atualizacoesCargo - As atualizações a serem aplicadas.
     * @returns {Promise<any>}
     */
    atualizar(idGrupo: string, idCargo: string, atualizacoesCargo: any): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/roles/${idCargo}`, atualizacoesCargo);
    },

    /**
     * Remove um cargo de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idCargo - O ID do cargo a ser removido.
     * @returns {Promise<any>}
     */
    remover(idGrupo: string, idCargo: string): Promise<any> {
        return ClienteBackend.delete(`/groups/${idGrupo}/roles/${idCargo}`);
    },

    /**
     * Atribui um cargo a um membro do grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idMembro - O ID do membro.
     * @param {string | null} idCargo - O ID do cargo a ser atribuído (ou null para remover).
     * @returns {Promise<any>}
     */
    atribuir(idGrupo: string, idMembro: string, idCargo: string | null): Promise<any> {
        return ClienteBackend.post(`/groups/${idGrupo}/members/${idMembro}/assign-role`, { roleId: idCargo });
    },
};

export default API_Sistema_Cargos;
