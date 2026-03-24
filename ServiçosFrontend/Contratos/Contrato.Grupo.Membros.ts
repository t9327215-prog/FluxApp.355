import { z } from 'zod';

/**
 * @file Contratos para as operações de gerenciamento de membros de um grupo.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para o payload das ações de advertir e banir um membro.
export const MotivoSchema = z.object({
    motivo: z.string().trim().min(10, "O motivo deve ter pelo menos 10 caracteres."),
});

// Schema para a estrutura de um único membro do grupo.
export const MembroSchema = z.object({
    id: z.string(),
    idUsuario: z.string(),
    nome: z.string(),
    cargo: z.enum(["MEMBRO", "MODERADOR", "ADMINISTRADOR"]),
    dataIngresso: z.string().datetime(),
});

// Schema para a resposta da lista de membros.
export const ListaMembrosSchema = z.array(MembroSchema);

// Schema para a resposta padrão de ações bem-sucedidas (advertir, banir, expulsar).
export const RespostaAcaoMembroSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});

// --- Tipos Derivados ---
export type Motivo = z.infer<typeof MotivoSchema>;
export type Membro = z.infer<typeof MembroSchema>;
export type RespostaAcaoMembro = z.infer<typeof RespostaAcaoMembroSchema>;

// --- Interface do Serviço ---
export interface IGrupoMembrosServico {
    obter(idGrupo: string): Promise<Membro[]>;
    advertir(idGrupo: string, idUsuario: string, payload: Motivo): Promise<RespostaAcaoMembro>;
    banir(idGrupo: string, idUsuario: string, payload: Motivo): Promise<RespostaAcaoMembro>;
    expulsar(idGrupo: string, idMembro: string): Promise<RespostaAcaoMembro>;
}
