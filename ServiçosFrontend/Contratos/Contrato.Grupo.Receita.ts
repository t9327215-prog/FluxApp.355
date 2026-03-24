import { z } from 'zod';

/**
 * @file Contrato para o serviço de Receita de um grupo.
 */

// --- Schemas de Dados ---

// Schema para uma transação individual.
export const TransacaoSchema = z.object({
    id: z.string(),
    valor: z.number(),
    data: z.string().datetime("Data da transação em formato ISO inválida."),
    descricao: z.string(),
    status: z.enum(['pendente', 'aprovado', 'rejeitado']),
});

// Schema para o objeto principal de receita.
export const ReceitaSchema = z.object({
    resumo: z.object({
        valorTotal: z.number(),
        moeda: z.string(),
        totalTransacoes: z.number().int(),
    }),
    transacoes: z.array(TransacaoSchema),
});


// --- Tipos Derivados ---
export type Transacao = z.infer<typeof TransacaoSchema>;
export type Receita = z.infer<typeof ReceitaSchema>;


// --- Interface do Serviço ---
export interface IReceitaServico {
    /**
     * Obtém os dados de receita e transações de um grupo.
     * @param idGrupo O ID do grupo.
     */
    obterReceita(idGrupo: string): Promise<Receita>;
}
