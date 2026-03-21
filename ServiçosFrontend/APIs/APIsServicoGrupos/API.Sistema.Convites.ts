
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Convites = {
    /**
     * Busca todos os links de convite de um grupo específico.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obter(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/invites`);
    },

    /**
     * Cria um novo link de convite para um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} dadosLink - Os dados do novo link (nome, tipo, expiração, etc.).
     * @returns {Promise<any>}
     */
    criar(idGrupo: string, dadosLink: any): Promise<any> {
        return ClienteBackend.post(`/groups/${idGrupo}/invites`, dadosLink);
    },

    /**
     * Revoga (desativa) um link de convite existente.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idLink - O ID do link a ser revogado.
     * @returns {Promise<any>}
     */
    revogar(idGrupo: string, idLink: string): Promise<any> {
        return ClienteBackend.delete(`/groups/${idGrupo}/invites/${idLink}`);
    },
};

export default API_Sistema_Convites;
