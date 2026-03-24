import ClienteBackend from '../../Cliente.Backend';
import {
    IGrupoConvitesServico,
    Convite, ConviteSchema,
    CriarConvite, CriarConviteSchema,
    RespostaAcaoConvite, RespostaAcaoConviteSchema
} from '../../Contratos/Contrato.Grupo.Convites';
import { z } from 'zod';

/**
 * @file Implementação do serviço para gerenciamento de convites, aderindo ao contrato.
 */
class GrupoConvitesAPISupremo implements IGrupoConvitesServico {

    async obter(idGrupo: string): Promise<Convite[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/invites`);
        // Valida se a resposta é um array de convites válidos.
        return z.array(ConviteSchema).parse(resposta.data);
    }

    async criar(idGrupo: string, dadosLink: CriarConvite): Promise<Convite> {
        // Valida os dados de entrada para o novo convite.
        const dadosValidados = CriarConviteSchema.parse(dadosLink);
        const resposta = await ClienteBackend.post(`/groups/${idGrupo}/invites`, dadosValidados);
        // Valida o convite retornado pela API após a criação.
        return ConviteSchema.parse(resposta.data);
    }

    async revogar(idGrupo: string, idLink: string): Promise<RespostaAcaoConvite> {
        const resposta = await ClienteBackend.delete(`/groups/${idGrupo}/invites/${idLink}`);
        // Valida a resposta genérica de sucesso.
        return RespostaAcaoConviteSchema.parse(resposta.data);
    }
}

export default new GrupoConvitesAPISupremo();
