import { z } from 'zod';

/**
 * @file Contrato para a gestão do Modo Hub de um grupo.
 */

// --- Schemas de Dados e Respostas ---

// Schema para o estado do Modo Hub.
export const ModoHubStatusSchema = z.object({
    isEnabled: z.boolean(),
});

// Schema para uma resposta de sucesso genérica.
export const RespostaSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});


// --- Tipos Derivados ---
export type ModoHubStatus = z.infer<typeof ModoHubStatusSchema>;
export type Resposta = z.infer<typeof RespostaSchema>;


// --- Interface do Serviço ---
export interface IModoHubServico {
    /**
     * Obtém o estado atual do Modo Hub.
     * @param idGrupo O ID do grupo.
     */
    obterStatus(idGrupo: string): Promise<ModoHubStatus>;

    /**
     * Define o estado do Modo Hub.
     * @param idGrupo O ID do grupo.
     * @param status O novo estado a ser definido.
     */
    definirStatus(idGrupo: string, status: ModoHubStatus): Promise<Resposta>;
}
