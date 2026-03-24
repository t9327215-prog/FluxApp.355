import ClienteBackend from '../../Cliente.Backend';
import {
    IGrupoMembrosServico,
    Motivo, MotivoSchema,
    Membro, ListaMembrosSchema,
    RespostaAcaoMembro, RespostaAcaoMembroSchema
} from '../../Contratos/Contrato.Grupo.Membros';

/**
 * @file Implementação do serviço para gerenciamento de membros do grupo, seguindo o contrato.
 */
class GrupoMembrosAPISupremo implements IGrupoMembrosServico {

    async obter(idGrupo: string): Promise<Membro[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/members`);
        // Valida se a resposta é um array de membros conforme o schema
        return ListaMembrosSchema.parse(resposta.data);
    }

    async advertir(idGrupo: string, idUsuario: string, payload: Motivo): Promise<RespostaAcaoMembro> {
        // Valida o payload (motivo) antes de enviar
        const dadosValidados = MotivoSchema.parse(payload);
        const resposta = await ClienteBackend.post(`/groups/${idGrupo}/members/${idUsuario}/warn`, dadosValidados);
        // Valida a resposta da ação
        return RespostaAcaoMembroSchema.parse(resposta.data);
    }

    async banir(idGrupo: string, idUsuario: string, payload: Motivo): Promise<RespostaAcaoMembro> {
        const dadosValidados = MotivoSchema.parse(payload);
        const resposta = await ClienteBackend.post(`/groups/${idGrupo}/members/${idUsuario}/ban`, dadosValidados);
        return RespostaAcaoMembroSchema.parse(resposta.data);
    }

    async expulsar(idGrupo: string, idMembro: string): Promise<RespostaAcaoMembro> {
        const resposta = await ClienteBackend.delete(`/groups/${idGrupo}/members/${idMembro}`);
        return RespostaAcaoMembroSchema.parse(resposta.data);
    }
}

export default new GrupoMembrosAPISupremo();
