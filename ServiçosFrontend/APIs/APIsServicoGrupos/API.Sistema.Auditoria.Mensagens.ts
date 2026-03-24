import ClienteBackend from '../../Cliente.Backend';
import {
    IAuditoriaMensagensServico,
    FiltroAuditoria, FiltroAuditoriaSchema,
    LogAuditoriaMensagem, LogAuditoriaMensagemSchema,
    RespostaAcaoAuditoria, RespostaAcaoAuditoriaSchema
} from '../../Contratos/Contrato.Grupo.Auditoria.Mensagens';
import { z } from 'zod';

/**
 * @file Implementação do serviço de auditoria de mensagens, seguindo o contrato.
 */
class AuditoriaMensagensAPISupremo implements IAuditoriaMensagensServico {

    async obterLogs(idGrupo: string, filtro?: FiltroAuditoria): Promise<LogAuditoriaMensagem[]> {
        // Valida o filtro antes de usá-lo na requisição.
        const params = FiltroAuditoriaSchema.parse(filtro);
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/audit/messages`, { params });
        // Valida se a resposta é um array de logs de auditoria válidos.
        return z.array(LogAuditoriaMensagemSchema).parse(resposta.data);
    }

    async apagarMensagem(idGrupo: string, idMensagem: string): Promise<RespostaAcaoAuditoria> {
        const resposta = await ClienteBackend.delete(`/groups/${idGrupo}/messages/${idMensagem}`);
        // Valida a resposta genérica de sucesso.
        return RespostaAcaoAuditoriaSchema.parse(resposta.data);
    }
}

export default new AuditoriaMensagensAPISupremo();
