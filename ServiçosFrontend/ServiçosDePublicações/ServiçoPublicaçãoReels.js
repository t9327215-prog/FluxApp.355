
// ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoReels.js

/**
 * Este serviço é focado na criação, publicação e busca de Reels.
 */

const API_BASE_URL = '/api/reels';

async function fetchWithAuth(url, options = {}) {
    const authToken = localStorage.getItem('authToken');
    const headers = {
        ...options.headers,
    };

    // Adiciona Content-Type se o corpo existir e não for FormData
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult.message || `Falha na requisição para ${url}`);
    }

    // Retorna o corpo da resposta apenas se ele existir
    if (response.status !== 204) { // 204 No Content
        return response.json();
    }
}


export const ServiçoPublicacaoReels = {
    /**
     * Cria um novo reel.
     * @param {object} reelData - Dados do reel (ex: { description, videoUrl, musicId }).
     * @returns {Promise<object>} - O objeto do reel criado.
     */
    async create(reelData) {
        return fetchWithAuth(API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify(reelData),
        });
    },

    /**
     * Busca todos os reels.
     * @returns {Promise<Array<object>>} - Uma lista de reels.
     */
    async getAll() {
        return fetchWithAuth(API_BASE_URL);
    },

    /**
     * Busca um reel específico pelo seu ID.
     * @param {string} reelId - O ID do reel.
     * @returns {Promise<object>} - O objeto do reel.
     */
    async getById(reelId) {
        return fetchWithAuth(`${API_BASE_URL}/${reelId}`);
    },

    /**
     * Atualiza um reel existente.
     * @param {string} reelId - O ID do reel a ser atualizado.
     * @param {object} updates - Os campos a serem atualizados.
     * @returns {Promise<object>} - O reel atualizado.
     */
    async update(reelId, updates) {
        return fetchWithAuth(`${API_BASE_URL}/${reelId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    /**
     * Deleta um reel.
     * @param {string} reelId - O ID do reel a ser deletado.
     * @returns {Promise<void>}
     */
    async delete(reelId) {
        return fetchWithAuth(`${API_BASE_URL}/${reelId}`, {
            method: 'DELETE',
        });
    }
};
