
import ClienteBackend from '../../Cliente.Backend';
import {
    IModeracaoServico,
    ModeracaoConfig, ModeracaoSchema,
    Resposta, RespostaSchema
} from '../../Contratos/Contrato.Grupo.Moderacao';

/**
 * @file Implementação do serviço de moderação de grupo, com validação de contrato.
 */
class ModeracaoAPISupremo implements IModeracaoServico {

    /**
     * Busca e valida as configurações de moderação de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<ModeracaoConfig>}
     */
    async obterConfiguracoes(idGrupo: string): Promise<ModeracaoConfig> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/moderation`);
        // Valida se a resposta do backend corresponde ao schema de moderação.
        return ModeracaoSchema.parse(resposta.data);
    }

    /**
     * Valida e atualiza as configurações de moderação de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {ModeracaoConfig} configuracoes - As configurações a serem atualizadas.
     * @returns {Promise<Resposta>}
     */
    async atualizarConfiguracoes(idGrupo: string, configuracoes: ModeracaoConfig): Promise<Resposta> {
        // 1. Valida as configurações antes de enviá-las.
        const dadosValidados = ModeracaoSchema.parse(configuracoes);
        
        // 2. Envia os dados validados para o backend.
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/moderation`, dadosValidados);

        // 3. Valida a resposta de sucesso do backend.
        return RespostaSchema.parse(resposta.data);
    }
}

export default new ModeracaoAPISupremo();
