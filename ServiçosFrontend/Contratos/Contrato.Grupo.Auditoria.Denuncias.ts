import { z } from 'zod';

/**
 * @file Contratos para a auditoria de denúncias em um grupo.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para uma única denúncia.
export const DenunciaSchema = z.object({
    id: z.string(),
    idConteudoDenunciado: z.string(),
    tipoConteudo: z.enum(["MENSAGEM", "USUARIO", "COMENTARIO"]), // Tipos de conteúdo que podem ser denunciados
    idAutorDenuncia: z.string(),
    nomeAutorDenuncia: z.string(),
    motivo: z.string().min(10, "O motivo da denúncia deve ter pelo menos 10 caracteres."),
    status: z.enum(["PENDENTE", "EM_ANALISE", "RESOLVIDA", "REJEITADA"]),
    timestamp: z.string().datetime(),
});

// Schema para a resposta de ações (como rejeitar ou resolver uma denúncia).
export const RespostaAcaoDenunciaSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});


// --- Tipos Derivados ---
export type Denuncia = z.infer<typeof DenunciaSchema>;
export type RespostaAcaoDenuncia = z.infer<typeof RespostaAcaoDenunciaSchema>;


// --- Interface do Serviço ---
export interface IAuditoriaDenunciasServico {
    obterDenuncias(idGrupo: string): Promise<Denuncia[]>;
    rejeitarDenuncia(idGrupo: string, idDenuncia: string): Promise<RespostaAcaoDenuncia>;
}
