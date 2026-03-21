
// ServiçosFrontend/ServiçosDePublicações/Métricas.Publicação.Reels.js

const REELS_API_URL = '/api/reels';

// Helper para fazer chamadas autenticadas
async function fetchWithAuth(url, options = {}) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        return Promise.reject(new Error('Usuário não autenticado.'));
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Falha na requisição sem corpo JSON.' }));
        throw new Error(result.error || `Erro ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return Promise.resolve({}); // Retorna promise vazia para status 204 No Content
    }
}

export const MetricasPublicacaoReels = {
    async deleteReel(reelId) {
        return fetchWithAuth(`${REELS_API_URL}/${reelId}`, { method: 'DELETE' });
    },

    async toggleLike(reelId) {
        return fetchWithAuth(`${REELS_API_URL}/${reelId}/like`, { method: 'POST' });
    },

    async incrementView(reelId) {
        return fetchWithAuth(`${REELS_API_URL}/${reelId}/view`, { method: 'POST' });
    },

    async incrementShare(reelId) {
         return fetchWithAuth(`${REELS_API_URL}/${reelId}/share`, { method: 'POST' });
    },

    async deleteComment(reelId, commentId) {
        return fetchWithAuth(`${REELS_API_URL}/${reelId}/comments/${commentId}`, {
            method: 'DELETE',
        });
    },

    async toggleCommentLike(reelId, commentId) {
        return fetchWithAuth(`${REELS_API_URL}/${reelId}/comments/${commentId}/like`, {
            method: 'POST',
        });
    }
};
