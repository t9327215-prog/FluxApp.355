
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Grupo.Diretrizes.ts

import API_Sistema_Grupo_Diretrizes from '../APIs/APIsServicoGrupos/API.Sistema.Grupo.Diretrizes';
// import ServicoLog from '../ServicoLogs/ServicoDeLog';

const contextoBase = "Servico.Sistema.Grupo.Diretrizes";

interface SlowModeSettings {
    enabled: boolean;
    interval: number; // Em segundos
}

interface GroupGuidelinesData {
    guidelines?: string;
    slowMode?: SlowModeSettings;
    slowModeEntry?: SlowModeSettings;
}

/**
 * Atualiza as diretrizes e controles de moderação de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @param {GroupGuidelinesData} data - As configurações a serem salvas.
 * @returns {Promise<GroupGuidelinesData>}
 */
export const updateGroupGuidelines = async (groupId: string, data: GroupGuidelinesData): Promise<GroupGuidelinesData> => {
    const contexto = `${contextoBase}.updateGroupGuidelines`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        // ServicoLog.aviso(contexto, erro);
        return Promise.reject(erro);
    }

    try {
        const { guidelines, slowMode, slowModeEntry } = data;
        const promises: Promise<any>[] = [];

        // Atualiza as diretrizes de texto, se fornecidas
        if (guidelines !== undefined) {
            promises.push(API_Sistema_Grupo_Diretrizes.atualizarDiretrizes(groupId, { guidelines }));
        }

        // Prepara as configurações de moderação (slow mode)
        const settings: { slowMode?: SlowModeSettings; slowModeEntry?: SlowModeSettings } = {};
        if (slowMode !== undefined) {
            settings.slowMode = slowMode;
        }
        if (slowModeEntry !== undefined) {
            settings.slowModeEntry = slowModeEntry;
        }

        // Atualiza as configurações de moderação, se houver alguma
        if (Object.keys(settings).length > 0) {
            promises.push(API_Sistema_Grupo_Diretrizes.atualizarConfiguracoes(groupId, settings));
        }

        // Executa todas as atualizações em paralelo
        await Promise.all(promises);

        // ServicoLog.info(contexto, `Diretrizes e configurações atualizadas para o grupo ${groupId}.`);
        return data; // Retorna os dados como confirmação

    } catch (error) {
        // ServicoLog.erro(contexto, `Erro ao atualizar diretrizes para o grupo ${groupId}:`, { error, data });
        throw error; // Propaga o erro
    }
};

/**
 * Obtém as diretrizes de um grupo.
 * @param {string} groupId - O ID do grupo.
 * @returns {Promise<any>}
 */
export const getGroupGuidelines = async (groupId: string): Promise<any> => {
    const contexto = `${contextoBase}.getGroupGuidelines`;
    if (!groupId) {
        const erro = "O ID do grupo é obrigatório.";
        // ServicoLog.aviso(contexto, erro);
        return Promise.reject(erro);
    }
    try {
        const { data } = await API_Sistema_Grupo_Diretrizes.obterDiretrizes(groupId);
        return data;
    } catch (error) {
        // ServicoLog.erro(contexto, `Erro ao obter diretrizes do grupo ${groupId}:`, { error });
        throw error;
    }
};
