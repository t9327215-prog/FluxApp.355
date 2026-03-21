
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Auditoria_Ajuste = {
    /**
     * Busca os logs de auditoria relacionados a ajustes e configurações do grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterLogs(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/audit/settings`);
    },
};

export default API_Sistema_Auditoria_Ajuste;
