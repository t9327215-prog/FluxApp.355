import ClienteBackend from '../../Cliente.Backend';
import {
    ICriacaoGrupoPrivadoServico,
    CriacaoGrupoPrivado, CriacaoGrupoPrivadoSchema,
    RespostaCriacaoGrupo, RespostaCriacaoGrupoSchema
} from '../../Contratos/Contrato.Grupo.Criacao.Privado';

/**
 * @file Implementação do serviço para criação de um grupo privado, com validação de contrato.
 */
class CriacaoGrupoPrivadoAPISupremo implements ICriacaoGrupoPrivadoServico {

    /**
     * Envia os dados validados para o backend para criar um novo grupo privado.
     * @param {CriacaoGrupoPrivado} dadosGrupo - O objeto contendo os dados do grupo.
     * @returns {Promise<RespostaCriacaoGrupo>} A promessa da resposta do backend.
     */
    async criar(dadosGrupo: CriacaoGrupoPrivado): Promise<RespostaCriacaoGrupo> {
        // 1. Valida os dados de entrada.
        const dadosValidados = CriacaoGrupoPrivadoSchema.parse(dadosGrupo);

        // 2. Envia os dados para o backend.
        const resposta = await ClienteBackend.post('/groups/private', dadosValidados);

        // 3. Valida a resposta do backend.
        return RespostaCriacaoGrupoSchema.parse(resposta.data);
    }
}

export default new CriacaoGrupoPrivadoAPISupremo();
