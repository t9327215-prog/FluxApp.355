import { z } from 'zod';

/**
 * @file Contratos para a gestão de mensagens agendadas de um grupo.
 */

// --- Schemas de Dados e Respostas ---

// Schema base para uma mensagem agendada.
export const MensagemAgendadaSchema = z.object({
    id: z.string().uuid("ID da mensagem inválido."),
    conteudo: z.string().min(1, "O conteúdo da mensagem não pode estar vazio."),
    dataAgendamento: z.string().datetime({ message: "Formato de data inválido." }),
    status: z.enum(['agendada', 'enviada', 'falhou']),
});

// Schema para criar uma nova mensagem agendada (sem id e status).
export const CriarMensagemAgendadaSchema = MensagemAgendadaSchema.omit({ id: true, status: true });

// Schema para atualizar uma mensagem agendada (todos os campos são opcionais).
export const AtualizarMensagemAgendadaSchema = CriarMensagemAgendadaSchema.partial();

// Schema para uma resposta de sucesso genérica.
export const RespostaSucessoSchema = z.object({
    sucesso: z.literal(true),
    mensagem: z.string(),
});

// Schema para a resposta de sucesso ao criar uma mensagem.
export const RespostaCriacaoSchema = RespostaSucessoSchema.extend({
    idMensagem: z.string().uuid(),
});


// --- Tipos Derivados ---
export type MensagemAgendada = z.infer<typeof MensagemAgendadaSchema>;
export type CriarMensagemAgendada = z.infer<typeof CriarMensagemAgendadaSchema>;
export type AtualizarMensagemAgendada = z.infer<typeof AtualizarMensagemAgendadaSchema>;
export type RespostaSucesso = z.infer<typeof RespostaSucessoSchema>;
export type RespostaCriacao = z.infer<typeof RespostaCriacaoSchema>;


// --- Interface do Serviço ---
export interface IMensagensAgendadasServico {
    obterMensagensAgendadas(idGrupo: string): Promise<MensagemAgendada[]>;
    criarMensagemAgendada(idGrupo: string, dadosMensagem: CriarMensagemAgendada): Promise<RespostaCriacao>;
    atualizarMensagemAgendada(idGrupo: string, idMensagem: string, dadosMensagem: AtualizarMensagemAgendada): Promise<RespostaSucesso>;
    deletarMensagemAgendada(idGrupo: string, idMensagem: string): Promise<RespostaSucesso>;
}
