import { z } from 'zod';

/**
 * @file Contratos para a auditoria de entrada e saída de membros em um grupo.
 */

// --- Schemas de Resposta ---

// Schema para uma única entrada no log de auditoria de entrada/saída.
export const LogEntradaSaidaSchema = z.object({
    id: z.string(),
    idUsuario: z.string(),
    nomeUsuario: z.string(),
    evento: z.enum(["ENTROU_NO_GRUPO", "SAIU_DO_GRUPO", "FOI_BANIDO", "FOI_KICKADO"]),
    timestamp: z.string().datetime(),
});


// --- Tipos Derivados ---
export type LogEntradaSaida = z.infer<typeof LogEntradaSaidaSchema>;


// --- Interface do Serviço ---
export interface IAuditoriaEntradaSaidaServico {
    obterLogs(idGrupo: string): Promise<LogEntradaSaida[]>;
}
