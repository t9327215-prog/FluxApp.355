import { z } from 'zod';

/**
 * @file Contratos para as operações gerais de um grupo (detalhes, configurações, estatísticas, etc.).
 * Define os schemas de validação com Zod e as interfaces de serviço correspondentes.
 */

// --- Schemas de Requisição e Resposta ---

// Usado para obter e atualizar as diretrizes do grupo.
export const DiretrizesSchema = z.object({
    regras: z.string().trim().min(1, "O campo de regras não pode estar vazio."),
    descricao: z.string().optional(),
});

// Usado para obter e atualizar as configurações de notificação.
export const ConfiguracoesNotificacaoSchema = z.object({
    silenciarTodas: z.boolean().default(false),
    notificarNovosPosts: z.boolean().default(true),
    notificarMencoes: z.boolean().default(true),
});

// Schema para a requisição de atualização das configurações gerais.
export const ConfiguracoesGeraisSchema = z.object({
    nome: z.string().min(3, "O nome do grupo deve ter pelo menos 3 caracteres.").optional(),
    privacidade: z.enum(["PUBLICO", "PRIVADO", "PAGO"]).optional(),
    visibilidade: z.enum(["VISIVEL", "OCULTO"]).optional(),
});

// Schema para a resposta das estatísticas do grupo.
export const EstatisticasGrupoSchema = z.object({
    membrosAtivos: z.number().int().nonnegative(),
    totalMensagens: z.number().int().nonnegative(),
    dataAtualizacao: z.string().datetime(),
});

// Schema para a resposta dos detalhes completos do grupo.
export const DetalhesGrupoSchema = z.object({
    id: z.string(),
    nome: z.string(),
    descricao: z.string(),
    imagemCapaUrl: z.string().url().optional(),
    tipo: z.enum(["PUBLICO", "PRIVADO", "PAGO"]),
    membros: z.number().int().nonnegative(),
    dataCriacao: z.string().datetime(),
});

// --- Tipos Derivados ---
export type Diretrizes = z.infer<typeof DiretrizesSchema>;
export type ConfiguracoesNotificacao = z.infer<typeof ConfiguracoesNotificacaoSchema>;
export type ConfiguracoesGerais = z.infer<typeof ConfiguracoesGeraisSchema>;
export type EstatisticasGrupo = z.infer<typeof EstatisticasGrupoSchema>;
export type DetalhesGrupo = z.infer<typeof DetalhesGrupoSchema>;

// --- Interface do Serviço ---
// Define o contrato que a implementação da API deve seguir.
export interface IGrupoGeralServico {
    obterDetalhes(idGrupo: string): Promise<DetalhesGrupo>;
    atualizarConfiguracoes(idGrupo: string, configuracoes: ConfiguracoesGerais): Promise<DetalhesGrupo>;
    obterEstatisticas(idGrupo: string): Promise<EstatisticasGrupo>;
    obterDiretrizes(idGrupo: string): Promise<Diretrizes>;
    atualizarDiretrizes(idGrupo: string, diretrizes: Diretrizes): Promise<Diretrizes>;
    obterConfiguracoesNotificacao(idGrupo: string): Promise<ConfiguracoesNotificacao>;
    atualizarConfiguracoesNotificacao(idGrupo: string, configuracoes: ConfiguracoesNotificacao): Promise<ConfiguracoesNotificacao>;
}
