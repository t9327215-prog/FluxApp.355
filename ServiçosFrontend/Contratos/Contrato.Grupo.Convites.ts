import { z } from 'zod';

/**
 * @file Contratos para o gerenciamento de links de convite para grupos.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para a criação de um novo link de convite.
export const CriarConviteSchema = z.object({
    nome: z.string().optional(), // Um nome amigável para o link
    maxUsos: z.number().int().positive().optional(), // Número máximo de vezes que o link pode ser usado
    diasExpiracao: z.number().int().positive().optional(), // O link expira após este número de dias
});

// Schema principal para um link de convite existente.
export const ConviteSchema = z.object({
    id: z.string(),
    codigo: z.string(),
    url: z.string().url(),
    usos: z.number().int().nonnegative(),
    maxUsos: z.number().int().positive().nullable(),
    dataExpiracao: z.string().datetime().nullable(),
    status: z.enum(["ATIVO", "REVOGADO", "EXPIRADO"]),
    criadoEm: z.string().datetime(),
});

// Schema para a resposta de ações que retornam uma mensagem de sucesso.
export const RespostaAcaoConviteSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});


// --- Tipos Derivados ---
export type CriarConvite = z.infer<typeof CriarConviteSchema>;
export type Convite = z.infer<typeof ConviteSchema>;
export type RespostaAcaoConvite = z.infer<typeof RespostaAcaoConviteSchema>;


// --- Interface do Serviço ---
export interface IGrupoConvitesServico {
    obter(idGrupo: string): Promise<Convite[]>;
    criar(idGrupo: string, dadosLink: CriarConvite): Promise<Convite>;
    revogar(idGrupo: string, idLink: string): Promise<RespostaAcaoConvite>;
}
