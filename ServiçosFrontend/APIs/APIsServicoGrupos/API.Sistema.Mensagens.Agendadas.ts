import ClienteBackend from '../../Cliente.Backend';
import {
    IMensagensAgendadasServico,
    MensagemAgendada, MensagemAgendadaSchema,
    CriarMensagemAgendada, CriarMensagemAgendadaSchema,
    AtualizarMensagemAgendada, AtualizarMensagemAgendadaSchema,
    RespostaSucesso, RespostaSucessoSchema,
    RespostaCriacao, RespostaCriacaoSchema
} from '../../Contratos/Contrato.Grupo.Mensagens.Agendadas';
import { z } from 'zod';

/**
 * @file Implementação do serviço de mensagens agendadas, com validação de contrato.
 */
class MensagensAgendadasAPISupremo implements IMensagensAgendadasServico {

    async obterMensagensAgendadas(idGrupo: string): Promise<MensagemAgendada[]> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/scheduled-messages`);
        return z.array(MensagemAgendadaSchema).parse(resposta.data);
    }

    async criarMensagemAgendada(idGrupo: string, dadosMensagem: CriarMensagemAgendada): Promise<RespostaCriacao> {
        const dadosValidados = CriarMensagemAgendadaSchema.parse(dadosMensagem);
        const resposta = await ClienteBackend.post(`/groups/${idGrupo}/scheduled-messages`, dadosValidados);
        return RespostaCriacaoSchema.parse(resposta.data);
    }

    async atualizarMensagemAgendada(idGrupo: string, idMensagem: string, dadosMensagem: AtualizarMensagemAgendada): Promise<RespostaSucesso> {
        const dadosValidados = AtualizarMensagemAgendadaSchema.parse(dadosMensagem);
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/scheduled-messages/${idMensagem}`, dadosValidados);
        return RespostaSucessoSchema.parse(resposta.data);
    }

    async deletarMensagemAgendada(idGrupo: string, idMensagem: string): Promise<RespostaSucesso> {
        const resposta = await ClienteBackend.delete(`/groups/${idGrupo}/scheduled-messages/${idMensagem}`);
        return RespostaSucessoSchema.parse(resposta.data);
    }
}

export default new MensagensAgendadasAPISupremo();
