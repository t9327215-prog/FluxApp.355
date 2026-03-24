import { z } from 'zod';

/**
 * @file Contrato para a gestão da Página de Vendas de um grupo.
 */

// --- Schema de Dados ---

// Schema principal para o conteúdo da página de vendas.
export const PaginaVendasSchema = z.object({
    titulo: z.string().min(1, "O título é obrigatório."),
    descricao: z.string().min(1, "A descrição é obrigatória."),
    imagemUrl: z.string().url("URL da imagem inválida.").optional(),
    videoUrl: z.string().url("URL do vídeo inválida.").optional(),
});

// Schema para atualização, onde todos os campos são opcionais.
export const AtualizarPaginaVendasSchema = PaginaVendasSchema.partial();


// --- Tipos Derivados ---
export type PaginaVendas = z.infer<typeof PaginaVendasSchema>;
export type AtualizarPaginaVendas = z.infer<typeof AtualizarPaginaVendasSchema>;


// --- Interface do Serviço ---
export interface IPaginaVendasServico {
    /**
     * Obtém o conteúdo da página de vendas.
     * @param idGrupo O ID do grupo.
     */
    obterPaginaVendas(idGrupo: string): Promise<PaginaVendas>;

    /**
     * Atualiza o conteúdo da página de vendas.
     * @param idGrupo O ID do grupo.
     * @param dadosPagina Os novos dados da página.
     */
    atualizarPaginaVendas(idGrupo: string, dadosPagina: AtualizarPaginaVendas): Promise<PaginaVendas>;
}
