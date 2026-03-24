import ClienteBackend from '../../Cliente.Backend';
import {
    ICriacaoGrupoPagoServico,
    CriacaoGrupoPago, CriacaoGrupoPagoSchema,
    RespostaCriacaoGrupo, RespostaCriacaoGrupoSchema
} from '../../Contratos/Contrato.Grupo.Criacao.Pago';

/**
 * @file Implementação do serviço para criação de um grupo pago, com validação de contrato.
 */
class CriacaoGrupoPagoAPISupremo implements ICriacaoGrupoPagoServico {

    /**
     * Envia os dados validados para o backend para criar um novo grupo pago.
     * @param {CriacaoGrupoPago} dadosGrupo - O objeto contendo os dados do grupo.
     * @returns {Promise<RespostaCriacaoGrupo>} A promessa da resposta do backend.
     */
    async criar(dadosGrupo: CriacaoGrupoPago): Promise<RespostaCriacaoGrupo> {
        // 1. Valida os dados de entrada, incluindo os campos financeiros.
        const dadosValidados = CriacaoGrupoPagoSchema.parse(dadosGrupo);

        // 2. Envia os dados para o backend.
        const resposta = await ClienteBackend.post('/groups/paid', dadosValidados);

        // 3. Valida a resposta do backend.
        return RespostaCriacaoGrupoSchema.parse(resposta.data);
    }
}

export default new CriacaoGrupoPagoAPISupremo();
