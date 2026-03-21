
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Grupo.Moderacao.ts

import API_Sistema_Grupo_Moderacao from '../APIs/APIsServicoGrupos/API.Sistema.Grupo.Moderacao';
// import ServicoLog from '../ServicoLogs/ServicoDeLog';

const contextoBase = "Servico.Sistema.Grupo.Moderacao";

interface KeywordFilter {
    enabled: boolean;
    keywords: string[];
}

interface MediaControl {
    allowImages: boolean;
    allowVideos: boolean;
}

interface AntiFlood {
    enabled: boolean;
    messageLimit: number;
    timeFrame: number; // in seconds
}

interface PostApproval {
    enabled: boolean;
    scope: 'new_members' | 'all_members';
}

export interface GroupModerationSettings {
    keywordFilter: KeywordFilter;
    mediaControl: MediaControl;
    antiFlood: AntiFlood;
    postApproval: PostApproval;
}

/**
 * Busca as configurações de moderação de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<GroupModerationSettings>}
 */
export const getModerationSettings = async (groupId: string): Promise<GroupModerationSettings> => {
    const contexto = `${contextoBase}.getModerationSettings`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        // ServicoLog.aviso(contexto, erro);
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Grupo_Moderacao.obterConfiguracoes(groupId);
        return data;
    } catch (error) {
        // ServicoLog.erro(contexto, `Erro ao buscar configurações de moderação para o grupo ${groupId}:`, { error });
        throw error;
    }
};

/**
 * Atualiza as configurações de moderação de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {Partial<GroupModerationSettings>} settings - As configurações a serem atualizadas.
 * @returns {Promise<GroupModerationSettings>}
 */
export const updateModerationSettings = async (groupId: string, settings: Partial<GroupModerationSettings>): Promise<GroupModerationSettings> => {
    const contexto = `${contextoBase}.updateModerationSettings`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        // ServicoLog.aviso(contexto, erro);
        return Promise.reject(erro);
    }

    try {
        const { data } = await API_Sistema_Grupo_Moderacao.atualizarConfiguracoes(groupId, settings);
        // ServicoLog.info(contexto, `Configurações de moderação atualizadas para o grupo ${groupId}.`);
        return data;
    } catch (error) {
        // ServicoLog.erro(contexto, `Erro ao atualizar configurações de moderação para o grupo ${groupId}:`, { error, settings });
        throw error;
    }
};
