
import ClienteBackend from '../../Cliente.Backend';

const API_Sistema_Geral = {

    // --- Detalhes, Configurações e Estatísticas ---

    obterDetalhes(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}`);
    },

    atualizarConfiguracoes(idGrupo: string, configuracoes: any): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/settings`, configuracoes);
    },

    obterEstatisticas(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/stats`);
    },

    // --- Diretrizes do Grupo ---

    obterDiretrizes(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/guidelines`);
    },

    atualizarDiretrizes(idGrupo: string, diretrizes: any): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/guidelines`, diretrizes);
    },

    // --- Configurações de Notificação ---

    obterConfiguracoesNotificacao(idGrupo: string): Promise<any> {
        return ClienteBackend.get(`/groups/${idGrupo}/notification-settings`);
    },

    atualizarConfiguracoesNotificacao(idGrupo: string, configuracoes: any): Promise<any> {
        return ClienteBackend.put(`/groups/${idGrupo}/notification-settings`, configuracoes);
    },
};

export default API_Sistema_Geral;
