import { z } from 'zod';

/**
 * @file Contratos para a gestão das configurações de moderação de um grupo.
 */

// --- Schemas de Dados e Respostas ---

// Schema para as configurações de moderação.
export const ModeracaoSchema = z.object({
    filtroPalavrasAtivo: z.boolean().default(false),
    listaPalavrasProibidas: z.array(z.string()).default([]),
    aprovacaoAutomaticaMembros: z.boolean().default(true),
    // Exemplo de uma regra mais complexa:
    regrasConteudo: z.object({
        permitirLinks: z.boolean().default(true),
        permitirImagens: z.boolean().default(true),
    }).default({}),
});

// Schema para uma resposta de sucesso genérica.
export const RespostaSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});


// --- Tipos Derivados ---
export type ModeracaoConfig = z.infer<typeof ModeracaoSchema>;
export type Resposta = z.infer<typeof RespostaSchema>;


// --- Interface do Serviço ---
export interface IModeracaoServico {
    /**
     * Obtém as configurações de moderação atuais de um grupo.
     * @param idGrupo O ID do grupo.
     */
    obterConfiguracoes(idGrupo: string): Promise<ModeracaoConfig>;

    /**
     * Atualiza as configurações de moderação de um grupo.
     * @param idGrupo O ID do grupo.
     * @param configuracoes As novas configurações a serem aplicadas.
     */
    atualizarConfiguracoes(idGrupo: string, configuracoes: ModeracaoConfig): Promise<Resposta>;
}
