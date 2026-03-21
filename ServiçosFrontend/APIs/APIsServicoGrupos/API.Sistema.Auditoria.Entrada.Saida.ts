
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Auditoria_Entrada_Saida = {
    /**
     * Busca os logs de auditoria de entrada e saída de membros no grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterLogs(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/audit/entry-exit`);
    },
};

export default API_Sistema_Auditoria_Entrada_Saida;
