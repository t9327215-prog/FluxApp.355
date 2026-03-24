import { z } from 'zod';

/**
 * @file Contratos para a criação de um grupo privado.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para os dados necessários para criar um grupo privado.
export const CriacaoGrupoPrivadoSchema = z.object({
    nome: z.string().trim().min(3, "O nome do grupo deve ter pelo menos 3 caracteres."),
    descricao: z.string().trim().max(500, "A descrição não pode exceder 500 caracteres.").optional(),
    imagemUrl: z.string().url("URL da imagem inválida").optional(),
    requerAprovacaoParaEntrar: z.boolean().default(true), // Por padrão, grupos privados exigem aprovação.
});

// Schema para a resposta do backend após a criação bem-sucedida de um grupo.
export const RespostaCriacaoGrupoSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
    idGrupo: z.string(), // O ID do novo grupo criado.
});


// --- Tipos Derivados ---
export type CriacaoGrupoPrivado = z.infer<typeof CriacaoGrupoPrivadoSchema>;
export type RespostaCriacaoGrupo = z.infer<typeof RespostaCriacaoGrupoSchema>;


// --- Interface do Serviço ---
export interface ICriacaoGrupoPrivadoServico {
    criar(dadosGrupo: CriacaoGrupoPrivado): Promise<RespostaCriacaoGrupo>;
}
