import { z } from 'zod';

/**
 * @file Contratos para o gerenciamento de cargos (roles) e permissões dentro de um grupo.
 */

// --- Schemas de Requisição e Resposta ---

// Schema granular para as permissões de um cargo.
export const PermissoesSchema = z.object({
    podeBanirMembros: z.boolean().default(false),
    podeExpulsarMembros: z.boolean().default(false),
    podeAlterarConfiguracoes: z.boolean().default(false),
    podeModerarConteudo: z.boolean().default(false),
    podeAtribuirCargos: z.boolean().default(false),
});

// Schema principal para um cargo.
export const CargoSchema = z.object({
    id: z.string(),
    nome: z.string().trim().min(3, "O nome do cargo deve ter pelo menos 3 caracteres."),
    permissoes: PermissoesSchema,
});

// Schema para criar um novo cargo (não inclui o ID).
export const CriarCargoSchema = CargoSchema.omit({ id: true });

// Schema para atualizar um cargo (todos os campos são opcionais).
export const AtualizarCargoSchema = CriarCargoSchema.partial();

// Schema para o payload de atribuir um cargo a um membro.
export const AtribuirCargoSchema = z.object({
    roleId: z.string().nullable(), // Permitir `null` para remover o cargo do membro
});

// Schema para a resposta de ações que não retornam um corpo específico (remover, atribuir).
export const RespostaAcaoCargoSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string().optional(),
});


// --- Tipos Derivados ---
export type Permissoes = z.infer<typeof PermissoesSchema>;
export type Cargo = z.infer<typeof CargoSchema>;
export type CriarCargo = z.infer<typeof CriarCargoSchema>;
export type AtualizarCargo = z.infer<typeof AtualizarCargoSchema>;
export type RespostaAcaoCargo = z.infer<typeof RespostaAcaoCargoSchema>;


// --- Interface do Serviço ---
export interface IGrupoCargosServico {
    obter(idGrupo: string): Promise<Cargo[]>;
    adicionar(idGrupo: string, dadosCargo: CriarCargo): Promise<Cargo>;
    atualizar(idGrupo: string, idCargo: string, atualizacoesCargo: AtualizarCargo): Promise<Cargo>;
    remover(idGrupo: string, idCargo: string): Promise<RespostaAcaoCargo>;
    atribuir(idGrupo: string, idMembro: string, idCargo: string | null): Promise<RespostaAcaoCargo>;
}
