import { z } from 'zod';

/**
 * @file Contratos para a auditoria de ajustes nas configurações de um grupo.
 */

// --- Schemas de Resposta ---

// Schema para uma única entrada no log de auditoria de ajustes.
export const LogAjusteSchema = z.object({
    id: z.string(),
    idModerador: z.string(),
    nomeModerador: z.string(),
    campoAlterado: z.string(), // Ex: "NOME_DO_GRUPO", "DESCRICAO", "SLOW_MODE_SEGUNDOS"
    valorAntigo: z.string().nullable(),
    valorNovo: z.string().nullable(),
    motivo: z.string().optional(), // Motivo opcional para a alteração
    timestamp: z.string().datetime(),
});


// --- Tipos Derivados ---
export type LogAjuste = z.infer<typeof LogAjusteSchema>;


// --- Interface do Serviço ---
export interface IAuditoriaAjusteServico {
    obterLogs(idGrupo: string): Promise<LogAjuste[]>;
}
