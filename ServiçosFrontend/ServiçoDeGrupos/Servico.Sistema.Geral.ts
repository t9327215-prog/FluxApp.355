
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Geral.ts

/**
 * @file Serviço para funcionalidades gerais de um grupo.
 *
 * Este módulo importa as implementações da API real e da API de simulação
 * como módulos separados e, em seguida, seleciona qual conjunto de funções usar com base
 * na variável de ambiente.
 */

import { config } from '../ValidaçãoDeAmbiente/config';

// 1. Importa todas as funções da API REAL sob o namespace `API_Real`
import * as API_Real from '../APIs/APIsServicoGrupos/API.Sistema.Geral';

// 2. Importa todas as funções da API SIMULADA sob o namespace `API_Simulada`
import * as API_Simulada from '../ServiçoDeSimulação/simulacoes/Simulacao.Grupo.Config.Geral';

// --- Ponto de Decisão da API ---

// Escolhe o conjunto de funções da API a ser usado
const API = config.VITE_APP_ENV === 'simulation' ? API_Simulada : API_Real;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("[SIMULAÇÃO] Serviço 'Servico.Sistema.Geral' está usando o módulo de simulação.");
} else {
    console.log("[REAL] Serviço 'Servico.Sistema.Geral' está usando o módulo da API real.");
}

// --- Funções de Serviço (Re-exportam e consomem a API selecionada) ---

const contextoBase = "Servico.Sistema.Geral";

export const getGroupDetails = async (groupId: string): Promise<any> => {
    const contexto = `${contextoBase}.getGroupDetails`;
    if (!groupId) {
        console.error(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API.obterDetalhes(groupId);
        return data;
    } catch (error) {
        console.error(contexto, 'Erro ao buscar detalhes do grupo:', error);
        throw error;
    }
};

export const updateGroupSettings = async (groupId: string, settings: object): Promise<any> => {
    const contexto = `${contextoBase}.updateGroupSettings`;
    if (!groupId) {
        console.error(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API.atualizarConfiguracoes(groupId, settings);
        return data;
    } catch (error) {
        console.error(contexto, 'Erro ao atualizar configurações do grupo:', error);
        throw error;
    }
};

export const getGroupStats = async (groupId: string): Promise<any> => {
    const contexto = `${contextoBase}.getGroupStats`;
    if (!groupId) {
        console.error(contexto, 'ID do grupo não fornecido.');
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        const { data } = await API.obterEstatisticas(groupId);
        return data;
    } catch (error) {
        console.error(contexto, 'Erro ao buscar estatísticas do grupo:', error);
        throw error;
    }
};

export const getGuidelines = async (groupId: string): Promise<any> => {
    try {
        const { data } = await API.obterDiretrizes(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateGuidelines = async (groupId: string, guidelines: object): Promise<any> => {
    try {
        const { data } = await API.atualizarDiretrizes(groupId, guidelines);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getNotificationSettings = async (groupId: string): Promise<any> => {
    try {
        const { data } = await API.obterConfiguracoesNotificacao(groupId);
        return data;
    } catch (error) {
        throw error;
    }
};

export const updateNotificationSettings = async (groupId: string, settings: object): Promise<any> => {
    try {
        const { data } = await API.atualizarConfiguracoesNotificacao(groupId, settings);
        return data;
    } catch (error) {
        throw error;
    }
};
