
// Arquivo: ServiçosFrontend/ServiçoDeSimulação/simulacoes/Simulacao.Grupo.Config.Geral.ts

/**
 * @file Simulação para o serviço de configurações gerais de um grupo.
 * 
 * Este arquivo exporta funções individuais que simulam as chamadas da API,
 * seguindo o padrão de outros arquivos de simulação como o de Convites.
 */

// Os dados de simulação estão definidos diretamente neste arquivo para simplicidade.
const mockGroupDetails = {
    id: "group-123-simulated",
    name: "Grupo de Design Simulado",
    description: "Este é um grupo de design simulado para fins de desenvolvimento e teste da interface.",
    memberCount: 128,
    privacy: "private",
    createdAt: "2024-01-01T10:00:00Z",
    rules: "1. Seja respeitoso.\n2. Compartilhe trabalhos relevantes.\n3. Proibido spam.",
    theme: {
        primaryColor: "#4A90E2",
        secondaryColor: "#FFFFFF"
    },
    bannerUrl: "https://exemplo.com/banners/grupo-design.jpg",
    owner: {
        id: "user-001",
        name: "Admin do Grupo"
    }
};

const SIMULATION_DELAY = 500; // ms

/**
 * Simula a busca pelos detalhes de um grupo.
 */
export const obterDetalhes = (groupId: string): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Buscando detalhes para o grupo: ${groupId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: mockGroupDetails });
        }, SIMULATION_DELAY);
    });
};

/**
 * Simula a atualização das configurações de um grupo.
 */
export const atualizarConfiguracoes = (groupId: string, settings: object): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Atualizando configurações para o grupo: ${groupId} com:`, settings);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { success: true, ...settings } });
        }, SIMULATION_DELAY);
    });
};

/**
 * Simula a busca pelas estatísticas de um grupo.
 */
export const obterEstatisticas = (groupId: string): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Buscando estatísticas para o grupo: ${groupId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            // Retorna um objeto de estatísticas de exemplo
            resolve({ data: { members: 123, online: 45, messagesToday: 678 } });
        }, SIMULATION_DELAY);
    });
};

/**
 * Simula a busca pelas diretrizes de um grupo.
 */
export const obterDiretrizes = (groupId: string): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Buscando diretrizes para o grupo: ${groupId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { content: "1. Seja legal.\n2. Não envie spam.\n3. Divirta-se!" } });
        }, SIMULATION_DELAY);
    });
};

/**
 * Simula a atualização das diretrizes de um grupo.
 */
export const atualizarDiretrizes = (groupId: string, guidelines: object): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Atualizando diretrizes para o grupo: ${groupId} com:`, guidelines);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { success: true, ...guidelines } });
        }, SIMULATION_DELAY);
    });
};

/**
 * Simula a busca pelas configurações de notificação.
 */
export const obterConfiguracoesNotificacao = (groupId: string): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Buscando configurações de notificação para o grupo: ${groupId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { push: 'all', email: 'mentions' } });
        }, SIMULATION_DELAY);
    });
};

/**
 * Simula a busca pelas configurações de notificação.
 */
export const atualizarConfiguracoesNotificacao = (groupId: string, settings: object): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Atualizando configurações de notificação para o grupo: ${groupId} com:`, settings);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ data: { success: true, ...settings } });
        }, SIMULATION_DELAY);
    });
};
