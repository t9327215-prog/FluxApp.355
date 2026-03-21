
// --- SERVIÇO DE GOVERNANÇA E CONFIGURAÇÃO (FLUX) ---

class ConfigControlService {
    constructor() {
        this.cache = null;
        this.cacheTimestamp = 0;
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
    }

    async boot() {
        const now = Date.now();
        if (this.cache && (now - this.cacheTimestamp < this.CACHE_DURATION)) {
            console.log('[GovFlux] Usando configuração em cache.');
            return this.cache;
        }

        try {
            console.log('[GovFlux] Buscando configuração remota...');
            
            // Simulação de falha para forçar o uso do fallback
            if (true) { // Forçar o erro para usar o fallback
                throw new Error("Simulação de falha na rede para usar o fallback.");
            }

            if (import.meta.env.DEV) {
                console.log('🔵 [DIAGNÓSTICO 3/3] window.fetch em ConfigControl.boot():', window.fetch.toString());
            }
            
            const response = await fetch('/api/v1/config/boot');

            if (!response.ok) {
                throw new Error(`Falha ao buscar o plano de controle: ${response.statusText}`);
            }

            const config = await response.json();

            this.cache = config;
            this.cacheTimestamp = now;

            return config;
        } catch (error) {
            console.error('Falha crítica ao carregar a configuração remota. Usando fallback.', error);
            return this.getFallbackConfig();
        }
    }

    getFallbackConfig() {
        console.warn("[GovFlux] ATENÇÃO: Usando configuração de fallback. A aplicação pode não funcionar como esperado.");
        // Retorna uma configuração padrão completa para evitar que a aplicação quebre.
        return {
            maintenanceMode: false,
            featureFlags: {
                enableReels: true,
                enableMarketplace: true,
                enableAds: true,
                enableVipGroups: true,
            },
            apiEndpoints: {
                users: '/api/v1/users',
                groups: '/api/v1/groups',
                posts: '/api/v1/posts',
                notifications: '/api/v1/notifications',
                // ... outros endpoints
            },
            stripePublicKey: 'pk_test_default_key', // Chave de teste padrão
            version: 'fallback-0.1.0'
        };
    }

    static async logAction(groupId, action, details) {
        console.log(`[GovFlux] Ação registrada no grupo ${groupId}: ${action}`, details);
    }
}

export const ConfigControl = new ConfigControlService();
