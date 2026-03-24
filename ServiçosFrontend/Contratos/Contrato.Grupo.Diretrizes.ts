import { z } from 'zod';

/**
 * @file Contratos para a gestão das diretrizes (regras) de um grupo.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para o objeto que contém o texto das diretrizes.
export const DiretrizesSchema = z.object({
    guidelines: z.string().trim().min(10, "As diretrizes devem ter pelo menos 10 caracteres."),
});

// Schema para a resposta de sucesso de uma atualização.
export const RespostaAcaoDiretrizesSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});


// --- Tipos Derivados ---
export type Diretrizes = z.infer<typeof DiretrizesSchema>;
export type RespostaAcaoDiretrizes = z.infer<typeof RespostaAcaoDiretrizesSchema>;


// --- Interface do Serviço ---
export interface IGrupoDiretrizesServico {
    obterDiretrizes(idGrupo: string): Promise<Diretrizes>;
    atualizarDiretrizes(idGrupo: string, diretrizes: Diretrizes): Promise<RespostaAcaoDiretrizes>;
}
