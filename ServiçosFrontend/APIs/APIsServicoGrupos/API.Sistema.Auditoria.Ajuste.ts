import ClienteBackend from '../../Cliente.Backend';
import {
    IAuditoriaAjusteServico,
    LogAjuste, LogAjusteSchema
} from '../../Contratos/Contrato.Grupo.Auditoria.Ajuste';
import { z } from 'zod';

/**
 * @file Implementação do serviço de auditoria para ajustes de configurações do grupo.
 */
class AuditoriaAjusteAPISupremo implements IAuditoriaAjusteServico {

    async obterLogs(idGrupo: string): Promise<LogAjuste[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/audit/settings`);
        // Valida se a resposta do backend corresponde a um array de logs de ajuste.
        return z.array(LogAjusteSchema).parse(resposta.data);
    }
}

export default new AuditoriaAjusteAPISupremo();
