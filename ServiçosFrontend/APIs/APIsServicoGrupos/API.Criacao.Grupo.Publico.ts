import ClienteBackend from '../../Cliente.Backend';
import {
    ICriacaoGrupoPublicoServico,
    CriacaoGrupoPublico, CriacaoGrupoPublicoSchema,
    RespostaCriacaoGrupo, RespostaCriacaoGrupoSchema
} from '../../Contratos/Contrato.Grupo.Criacao.Publico';

/**
 * @file Implementação do serviço para criação de um grupo público, seguindo o contrato.
 */
class CriacaoGrupoPublicoAPISupremo implements ICriacaoGrupoPublicoServico {

    /**
     * Envia os dados para o backend para criar um novo grupo público.
     * @param {CriacaoGrupoPublico} dadosGrupo - O objeto contendo os dados do grupo.
     * @returns {Promise<RespostaCriacaoGrupo>} A promessa da resposta do backend.
     */
    async criar(dadosGrupo: CriacaoGrupoPublico): Promise<RespostaCriacaoGrupo> {
        // 1. Valida os dados de entrada antes de fazer a requisição.
        const dadosValidados = CriacaoGrupoPublicoSchema.parse(dadosGrupo);

        // 2. Envia os dados validados para o backend.
        const resposta = await ClienteBackend.post('/groups/public', dadosValidados);

        // 3. Valida a resposta do backend.
        return RespostaCriacaoGrupoSchema.parse(resposta.data);
    }
}

export default new CriacaoGrupoPublicoAPISupremo();
