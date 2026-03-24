import { z } from 'zod';

/**
 * @file Contratos para a auditoria de mensagens em um grupo.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para os filtros aplicáveis na busca de logs.
export const FiltroAuditoriaSchema = z.object({
    userId: z.string().optional(),
}).optional();

// Schema para uma única entrada no log de auditoria de mensagens.
export const LogAuditoriaMensagemSchema = z.object({
    id: z.string(),
    idMensagem: z.string(),
    conteudo: z.string(), // Pode ser um trecho da mensagem
    idAutor: z.string(),
    nomeAutor: z.string(),
    idModerador: z.string().nullable(), // ID do moderador que realizou a ação, se aplicável
    nomeModerador: z.string().nullable(),
    acao: z.enum(["MENSAGEM_ENVIADA", "MENSAGEM_EDITADA", "MENSAGEM_APAGADA_PELO_AUTOR", "MENSAGEM_APAGADA_POR_MODERADOR"]),
    timestamp: z.string().datetime(),
});

// Schema para a resposta de ações que não retornam um corpo específico.
export const RespostaAcaoAuditoriaSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string().optional(),
});


// --- Tipos Derivados ---
export type FiltroAuditoria = z.infer<typeof FiltroAuditoriaSchema>;
export type LogAuditoriaMensagem = z.infer<typeof LogAuditoriaMensagemSchema>;
export type RespostaAcaoAuditoria = z.infer<typeof RespostaAcaoAuditoriaSchema>;


// --- Interface do Serviço ---
export interface IAuditoriaMensagensServico {
    obterLogs(idGrupo: string, filtro?: FiltroAuditoria): Promise<LogAuditoriaMensagem[]>;
    apagarMensagem(idGrupo: string, idMensagem: string): Promise<RespostaAcaoAuditoria>;
}
