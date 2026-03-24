import ClienteBackend from '../../Cliente.Backend';
import {
    IAuditoriaDenunciasServico,
    Denuncia, DenunciaSchema,
    RespostaAcaoDenuncia, RespostaAcaoDenunciaSchema
} from '../../Contratos/Contrato.Grupo.Auditoria.Denuncias';
import { z } from 'zod';

/**
 * @file Implementação do serviço de auditoria de denúncias, seguindo o contrato.
 */
class AuditoriaDenunciasAPISupremo implements IAuditoriaDenunciasServico {

    async obterDenuncias(idGrupo: string): Promise<Denuncia[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/reports`);
        // Valida se a resposta do backend corresponde a um array de denúncias.
        return z.array(DenunciaSchema).parse(resposta.data);
    }

    async rejeitarDenuncia(idGrupo: string, idDenuncia: string): Promise<RespostaAcaoDenuncia> {
        const resposta = await ClienteBackend.delete(`/groups/${idGrupo}/reports/${idDenuncia}`);
        // Valida a resposta de sucesso da ação.
        return RespostaAcaoDenunciaSchema.parse(resposta.data);
    }
}

export default new AuditoriaDenunciasAPISupremo();
