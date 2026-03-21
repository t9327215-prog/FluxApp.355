
// Arquivo: ServiçosFrontend/APIs/API.Sistema.Mensagens.Agendadas.ts

import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Mensagens_Agendadas = {
    /**
     * Busca as mensagens agendadas de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<any>}
     */
    obterMensagensAgendadas(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/scheduled-messages`);
    },

    /**
     * Cria uma nova mensagem agendada.
     * @param {string} idGrupo - O ID do grupo.
     * @param {Object} dadosMensagem - Os dados da mensagem a ser agendada.
     * @returns {Promise<any>}
     */
    criarMensagemAgendada(idGrupo: string, dadosMensagem: any): Promise<any> {
        return ClienteBackend.post(`/groups/${idGrupo}/scheduled-messages`, dadosMensagem);
    },

    /**
     * Atualiza uma mensagem agendada.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idMensagem - O ID da mensagem agendada.
     * @param {Object} dadosMensagem - Os dados atualizados da mensagem.
     * @returns {Promise<any>}
     */
    atualizarMensagemAgendada(idGrupo: string, idMensagem: string, dadosMensagem: any): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/scheduled-messages/${idMensagem}`, dadosMensagem);
    },

    /**
     * Deleta uma mensagem agendada.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} idMensagem - O ID da mensagem agendada.
     * @returns {Promise<any>}
     */
    deletarMensagemAgendada(idGrupo: string, idMensagem: string): Promise<any> {
        return ClienteBackend.delete(`/groups/${idGrupo}/scheduled-messages/${idMensagem}`);
    },
};

export default API_Sistema_Mensagens_Agendadas;
