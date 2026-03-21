
// ServiçosFrontend/ServiçoDeRelacionamento/Sistema.Relação.Usuários.js

/**
 * Sistema para gerenciar relacionamentos de usuários e leaderboards.
 * ATENÇÃO: Esta é uma implementação de frontend temporária para desbloquear o build.
 * A lógica real deve ser movida para o backend quando os endpoints estiverem disponíveis.
 */

const getRelationships = () => {
    try {
        const stored = localStorage.getItem('relationships');
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
};

const setRelationships = (relationships) => {
    try {
        localStorage.setItem('relationships', JSON.stringify(relationships));
        window.dispatchEvent(new CustomEvent('relationshipsChanged'));
    } catch (e) {
        console.error("Falha ao salvar relacionamentos no localStorage", e);
    }
};

// Dados de simulação para o leaderboard
const DUMMY_LEADERBOARD_USERS = [
    { id: '1', profile: { name: 'johndoe', nickname: 'John Doe', photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg' }, isVerified: true, followerCount: 1500 },
    { id: '2', profile: { name: 'janesmith', nickname: 'Jane Smith', photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg' }, isVerified: false, followerCount: 1200 },
    { id: '3', profile: { name: 'peterpan', nickname: 'Peter Pan', photoUrl: 'https://randomuser.me/api/portraits/men/3.jpg' }, isVerified: true, followerCount: 950 },
    { id: '4', profile: { name: 'aliceinwonder', nickname: 'Alice', photoUrl: 'https://randomuser.me/api/portraits/women/4.jpg' }, isVerified: false, followerCount: 800 },
    { id: '5', profile: { name: 'charliechaplin', nickname: 'Charlie', photoUrl: 'https://randomuser.me/api/portraits/men/5.jpg' }, isVerified: true, followerCount: 750 },
];

export const systemaRelacaoUsuarios = {

    /**
     * Retorna os principais criadores de conteúdo (leaderboard).
     * @returns {Promise<Array<object>>} - Uma lista de usuários ranqueados.
     */
    async getTopCreators() {
        // Simula uma chamada de API
        await new Promise(res => setTimeout(res, 500));
        return DUMMY_LEADERBOARD_USERS;
    },

    isFollowing(username) {
        const relationships = getRelationships();
        return relationships[username] || 'none';
    },

    async followUser(username) {
        await new Promise(res => setTimeout(res, 300)); 
        const relationships = getRelationships();
        relationships[username] = 'following';
        setRelationships(relationships);
    },

    async unfollowUser(username) {
        await new Promise(res => setTimeout(res, 300));
        const relationships = getRelationships();
        delete relationships[username];
        setRelationships(relationships);
    },

    subscribe(callback) {
        window.addEventListener('relationshipsChanged', callback);
        return () => window.removeEventListener('relationshipsChanged', callback);
    }
};
