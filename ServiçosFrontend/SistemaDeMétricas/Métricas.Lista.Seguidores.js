
// ServiçosFrontend/SistemaDeMétricas/Métricas.Lista.Seguidores.js

const USERS_API_URL = '/api/users';

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

export const MetricasListaSeguidores = {
    /**
     * Alterna o estado de "seguir" um usuário.
     * @param {string} userId - O ID do usuário a ser seguido ou deixado de seguir.
     */
    async toggleFollow(userId) {
        return fetchWithAuth(`${USERS_API_URL}/${userId}/follow`, { method: 'POST' });
    }
};
