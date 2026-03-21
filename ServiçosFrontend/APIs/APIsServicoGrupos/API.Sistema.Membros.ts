
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Membros = {
    /**
     * Busca a lista de membros de um grupo específico.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obter(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/members`);
    },

    /**
     * Adverte um usuário em um grupo, incluindo um motivo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idUsuario - O ID do usuário a ser advertido.
     * @param {object} payload - O corpo da requisição, contendo o motivo da advertência.
     * @returns {Promise<any>}
     */
    advertir(idGrupo: string, idUsuario: string, payload: any): Promise<any> {
        return ClienteBackend.post(`/groups/${idGrupo}/members/${idUsuario}/warn`, payload);
    },

    /**
     * Bane um membro de um grupo, incluindo um motivo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idUsuario - O ID do usuário a ser banido.
     * @param {object} payload - O corpo da requisição, contendo o motivo do banimento.
     * @returns {Promise<any>}
     */
    banir(idGrupo: string, idUsuario: string, payload: any): Promise<any> {
        return ClienteBackend.post(`/groups/${idGrupo}/members/${idUsuario}/ban`, payload);
    },

    /**
     * Remove (expulsa) um membro de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idMembro - O ID do membro a ser expulso.
     * @returns {Promise<any>}
     */
    expulsar(idGrupo: string, idMembro: string): Promise<any> {
        return ClienteBackend.delete(`/groups/${idGrupo}/members/${idMembro}`);
    },
};

export default API_Sistema_Membros;
