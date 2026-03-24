import ClienteBackend from '../../Cliente.Backend';
import {
    IGrupoCargosServico,
    Cargo, CargoSchema,
    CriarCargo, CriarCargoSchema,
    AtualizarCargo, AtualizarCargoSchema,
    RespostaAcaoCargo, RespostaAcaoCargoSchema,
    AtribuirCargoSchema
} from '../../Contratos/Contrato.Grupo.Cargos';
import { z } from 'zod';

/**
 * @file Implementação do serviço para gerenciamento de cargos e permissões, seguindo o contrato.
 */
class GrupoCargosAPISupremo implements IGrupoCargosServico {

    async obter(idGrupo: string): Promise<Cargo[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/roles`);
        // Valida se a resposta é um array de cargos válidos.
        return z.array(CargoSchema).parse(resposta.data);
    }

    async adicionar(idGrupo: string, dadosCargo: CriarCargo): Promise<Cargo> {
        // Valida os dados de entrada para o novo cargo.
        const dadosValidados = CriarCargoSchema.parse(dadosCargo);
        const resposta = await ClienteBackend.post(`/groups/${idGrupo}/roles`, dadosValidados);
        // Valida o cargo retornado pela API após a criação.
        return CargoSchema.parse(resposta.data);
    }

    async atualizar(idGrupo: string, idCargo: string, atualizacoesCargo: AtualizarCargo): Promise<Cargo> {
        // Valida as atualizações (parciais) para o cargo.
        const dadosValidados = AtualizarCargoSchema.parse(atualizacoesCargo);
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/roles/${idCargo}`, dadosValidados);
        // Valida o cargo retornado pela API após a atualização.
        return CargoSchema.parse(resposta.data);
    }

    async remover(idGrupo: string, idCargo: string): Promise<RespostaAcaoCargo> {
        const resposta = await ClienteBackend.delete(`/groups/${idGrupo}/roles/${idCargo}`);
        // Valida a resposta genérica de sucesso.
        return RespostaAcaoCargoSchema.parse(resposta.data);
    }

    async atribuir(idGrupo: string, idMembro: string, idCargo: string | null): Promise<RespostaAcaoCargo> {
        // Valida o payload da atribuição.
        const dadosValidados = AtribuirCargoSchema.parse({ roleId: idCargo });
        const resposta = await ClienteBackend.post(`/groups/${idGrupo}/members/${idMembro}/assign-role`, dadosValidados);
        // Valida a resposta genérica de sucesso.
        return RespostaAcaoCargoSchema.parse(resposta.data);
    }
}

export default new GrupoCargosAPISupremo();
