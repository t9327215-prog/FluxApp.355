import { z } from 'zod';

/**
 * @file Contratos para a criação de um grupo pago.
 */

// --- Schemas de Requisição e Resposta ---

// Schema para os dados necessários para criar um grupo pago.
export const CriacaoGrupoPagoSchema = z.object({
    nome: z.string().trim().min(3, "O nome do grupo deve ter pelo menos 3 caracteres."),
    descricao: z.string().trim().max(500, "A descrição não pode exceder 500 caracteres.").optional(),
    imagemUrl: z.string().url("URL da imagem inválida").optional(),

    // Campos financeiros
    valor: z.number().positive("O valor deve ser um número positivo."),
    moeda: z.enum(["BRL", "USD", "EUR"], { errorMap: () => ({ message: "Moeda inválida." }) }),
    
    // Link para um plano de pagamento recorrente (ex: de uma plataforma como Stripe ou Hotmart)
    idPlanoPagamentoRecorrente: z.string().optional(),
});

// Schema para a resposta do backend após a criação bem-sucedida de um grupo.
export const RespostaCriacaoGrupoSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
    idGrupo: z.string(), // O ID do novo grupo criado.
});


// --- Tipos Derivados ---
export type CriacaoGrupoPago = z.infer<typeof CriacaoGrupoPagoSchema>;
export type RespostaCriacaoGrupo = z.infer<typeof RespostaCriacaoGrupoSchema>;


// --- Interface do Serviço ---
export interface ICriacaoGrupoPagoServico {
    criar(dadosGrupo: CriacaoGrupoPago): Promise<RespostaCriacaoGrupo>;
}
