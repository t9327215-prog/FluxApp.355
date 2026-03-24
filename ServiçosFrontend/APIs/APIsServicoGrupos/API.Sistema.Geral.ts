import ClienteBackend from '../../Cliente.Backend';
import {
    IGrupoGeralServico,
    Diretrizes, DiretrizesSchema,
    ConfiguracoesGerais, ConfiguracoesGeraisSchema,
    ConfiguracoesNotificacao, ConfiguracoesNotificacaoSchema,
    EstatisticasGrupo, EstatisticasGrupoSchema,
    DetalhesGrupo, DetalhesGrupoSchema
} from '../../Contratos/Contrato.Grupo.Geral';

/**
 * @file Implementação do serviço para operações gerais de grupo, aderindo ao contrato definido.
 * Valida todas as entradas e saídas para garantir a integridade dos dados.
 */
class GrupoGeralAPISupremo implements IGrupoGeralServico {

    async obterDetalhes(idGrupo: string): Promise<DetalhesGrupo> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}`);
        // Valida a resposta da API antes de retornar
        return DetalhesGrupoSchema.parse(resposta.data);
    }

    async atualizarConfiguracoes(idGrupo: string, configuracoes: ConfiguracoesGerais): Promise<DetalhesGrupo> {
        // Valida os dados de entrada antes de enviar
        const dadosValidados = ConfiguracoesGeraisSchema.parse(configuracoes);
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/settings`, dadosValidados);
        // Valida a resposta da API (geralmente retorna o objeto atualizado)
        return DetalhesGrupoSchema.parse(resposta.data);
    }

    async obterEstatisticas(idGrupo: string): Promise<EstatisticasGrupo> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/stats`);
        return EstatisticasGrupoSchema.parse(resposta.data);
    }

    async obterDiretrizes(idGrupo: string): Promise<Diretrizes> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/guidelines`);
        return DiretrizesSchema.parse(resposta.data);
    }

    async atualizarDiretrizes(idGrupo: string, diretrizes: Diretrizes): Promise<Diretrizes> {
        const dadosValidados = DiretrizesSchema.parse(diretrizes);
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/guidelines`, dadosValidados);
        return DiretrizesSchema.parse(resposta.data);
    }

    async obterConfiguracoesNotificacao(idGrupo: string): Promise<ConfiguracoesNotificacao> {
        const resposta = await ClienteBackend.get(`/groups/${idGrupo}/notification-settings`);
        return ConfiguracoesNotificacaoSchema.parse(resposta.data);
    }

    async atualizarConfiguracoesNotificacao(idGrupo: string, configuracoes: ConfiguracoesNotificacao): Promise<ConfiguracoesNotificacao> {
        const dadosValidados = ConfiguracoesNotificacaoSchema.parse(configuracoes);
        const resposta = await ClienteBackend.put(`/groups/${idGrupo}/notification-settings`, dadosValidados);
        return ConfiguracoesNotificacaoSchema.parse(resposta.data);
    }
}

export default new GrupoGeralAPISupremo();
