import ClienteBackend from '../../Cliente.Backend';
import {
    IAuditoriaEntradaSaidaServico,
    LogEntradaSaida, LogEntradaSaidaSchema
} from '../../Contratos/Contrato.Grupo.Auditoria.Entrada.Saida';
import { z } from 'zod';

/**
 * @file Implementação do serviço de auditoria para entrada e saída de membros.
 */
class AuditoriaEntradaSaidaAPISupremo implements IAuditoriaEntradaSaidaServico {

    async obterLogs(idGrupo: string): Promise<LogEntradaSaida[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/audit/entry-exit`);
        // Valida se a resposta do backend corresponde a um array de logs de entrada/saída.
        return z.array(LogEntradaSaidaSchema).parse(resposta.data);
    }
}

export default new AuditoriaEntradaSaidaAPISupremo();
