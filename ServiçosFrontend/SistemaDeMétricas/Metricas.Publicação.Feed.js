
// ServiçosFrontend/ServiçosDePublicações/Metricas.Publicação.Feed.js

const POSTS_API_URL = '/api/posts';

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

    // Nem todas as respostas de sucesso têm um corpo (ex: DELETE, 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return Promise.resolve({}); // Resolve com objeto vazio para respostas não-json
    }
}

export const MetricasPublicacaoFeed = {
    /**
     * Deleta uma publicação.
     * @param {string} postId - O ID do post a ser deletado.
     * @returns {Promise<object>}
     */
    async deletePost(postId) {
        return fetchWithAuth(`${POSTS_API_URL}/${postId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Alterna o like em um post.
     * @param {string} postId - O ID do post.
     * @returns {Promise<object>}
     */
    async toggleLike(postId) {
        return fetchWithAuth(`${POSTS_API_URL}/${postId}/like`, {
            method: 'POST',
        });
    },

    /**
     * Vota em uma opção de enquete.
     * @param {string} postId - O ID do post da enquete.
     * @param {number} optionIndex - O índice da opção para votar.
     * @returns {Promise<object>}
     */
    async voteOnPoll(postId, optionIndex) {
        return fetchWithAuth(`${POSTS_API_URL}/${postId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ optionIndex }),
        });
    },

    /**
     * Incrementa a contagem de visualizações de um post.
     * @param {string} postId - O ID do post.
     * @returns {Promise<object>}
     */
    async incrementView(postId) {
        return fetchWithAuth(`${POSTS_API_URL}/${postId}/view`, {
            method: 'POST',
        });
    },

    /**
     * Incrementa a contagem de compartilhamentos de um post.
     * @param {string} postId - O ID do post.
     * @returns {Promise<object>}
     */
    async incrementShare(postId) {
         return fetchWithAuth(`${POSTS_API_URL}/${postId}/share`, {
            method: 'POST',
        });
    }
};
