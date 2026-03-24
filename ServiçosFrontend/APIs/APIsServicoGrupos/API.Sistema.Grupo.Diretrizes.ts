import ClienteBackend from '../../Cliente.Backend';
import {
    IGrupoDiretrizesServico,
    Diretrizes, DiretrizesSchema,
    RespostaAcaoDiretrizes, RespostaAcaoDiretrizesSchema
} from '../../Contratos/Contrato.Grupo.Diretrizes';

/**
 * @file Implementação do serviço para gerenciamento das diretrizes de um grupo.
 */
class GrupoDiretrizesAPISupremo implements IGrupoDiretrizesServico {

    /**
     * Obtém as diretrizes de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @returns {Promise<Diretrizes>}
     */
    async obterDiretrizes(idGrupo: string): Promise<Diretrizes> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/guidelines`);
        // Valida se a resposta do backend corresponde ao schema de Diretrizes.
        return DiretrizesSchema.parse(resposta.data);
    }

    /**
     * Atualiza as diretrizes de texto de um grupo.
     * @param {string} idGrupo - O ID do grupo.
     * @param {Diretrizes} diretrizes - O objeto contendo as novas diretrizes.
     * @returns {Promise<RespostaAcaoDiretrizes>}
     */
    async atualizarDiretrizes(idGrupo: string, diretrizes: Diretrizes): Promise<RespostaAcaoDiretrizes> {
        // Valida os dados de entrada antes de enviar ao backend.
        const dadosValidados = DiretrizesSchema.parse(diretrizes);
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/guidelines`, dadosValidados);
        // Valida a resposta de sucesso da ação.
        return RespostaAcaoDiretrizesSchema.parse(resposta.data);
    }
}

export default new GrupoDiretrizesAPISupremo();
