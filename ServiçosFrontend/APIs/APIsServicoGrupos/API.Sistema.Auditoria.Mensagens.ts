
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Auditoria_Mensagens = {
    /**
     * Busca os logs de auditoria de mensagens, com um filtro opcional por usuário.
     * @param {string} idGrupo - O ID do grupo.
     * @param {object} [filtro] - Filtros para a busca. Ex: { userId: '...' }
     * @returns {Promise<any>}
     */
    obterLogs(idGrupo: string, filtro?: { userId: string }): Promise<any> {
        const params = filtro && filtro.userId ? { userId: filtro.userId } : {};
        return ClienteBackend.get(`/groups/${idGrupo}/audit/messages`, { params });
    },

    /**
     * Apaga uma mensagem específica dentro de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idMensagem - O ID da mensagem a ser apagada.
     * @returns {Promise<any>}
     */
    apagarMensagem(idGrupo: string, idMensagem: string): Promise<any> {
        return ClienteBackend.delete(`/groups/${idGrupo}/messages/${idMensagem}`);
    },
};

export default API_Sistema_Auditoria_Mensagens;
