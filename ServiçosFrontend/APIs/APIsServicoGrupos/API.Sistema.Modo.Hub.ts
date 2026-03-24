import ClienteBackend from '../../Cliente.Backend';
import {
    IModoHubServico,
    ModoHubStatus, ModoHubStatusSchema,
    Resposta, RespostaSchema
} from '../../Contratos/Contrato.Grupo.Modo.Hub';

/**
 * @file Implementação do serviço de Modo Hub, com validação de contrato.
 */
class ModoHubAPISupremo implements IModoHubServico {

    /**
     * Busca e valida o estado do Modo Hub de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<ModoHubStatus>}
     */
    async obterStatus(idGrupo: string): Promise<ModoHubStatus> {
        const resposta = await ClienteBackend.get(`/api/groups/${idGrupo}/settings/hub-mode`);
        // Valida se a resposta do backend corresponde ao schema.
        return ModoHubStatusSchema.parse(resposta.data);
    }

    /**
     * Valida e define o estado do Modo Hub de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {ModoHubStatus} status - O novo estado a ser definido.
     * @returns {Promise<Resposta>}
     */
    async definirStatus(idGrupo: string, status: ModoHubStatus): Promise<Resposta> {
        // 1. Valida o payload antes de enviá-lo.
        const dadosValidados = ModoHubStatusSchema.parse(status);
        
        // 2. Envia os dados validados para o backend.
        const resposta = await ClienteBackend.put(`/api/groups/${idGrupo}/settings/hub-mode`, dadosValidados);

        // 3. Valida a resposta de sucesso do backend.
        return RespostaSchema.parse(resposta.data);
    }
}

export default new ModoHubAPISupremo();
