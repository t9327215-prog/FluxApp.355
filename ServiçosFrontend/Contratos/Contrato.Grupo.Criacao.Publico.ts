import { z } from 'zod';

/**
 * @file Contratos para a criação de um grupo público.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para os dados necessários para criar um grupo público.
export const CriacaoGrupoPublicoSchema = z.object({
    nome: z.string().trim().min(3, "O nome do grupo deve ter pelo menos 3 caracteres."),
    descricao: z.string().trim().max(500, "A descrição não pode exceder 500 caracteres.").optional(),
    imagemUrl: z.string().url("URL da imagem inválida").optional(),
    // Adicione aqui outros campos específicos para grupos públicos, se houver.
});

// Schema para a resposta do backend após a criação bem-sucedida de um grupo.
export const RespostaCriacaoGrupoSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
    idGrupo: z.string(), // O ID do novo grupo criado.
});


// --- Tipos Derivados ---
export type CriacaoGrupoPublico = z.infer<typeof CriacaoGrupoPublicoSchema>;
export type RespostaCriacaoGrupo = z.infer<typeof RespostaCriacaoGrupoSchema>;


// --- Interface do Serviço ---
export interface ICriacaoGrupoPublicoServico {
    criar(dadosGrupo: CriacaoGrupoPublico): Promise<RespostaCriacaoGrupo>;
}
