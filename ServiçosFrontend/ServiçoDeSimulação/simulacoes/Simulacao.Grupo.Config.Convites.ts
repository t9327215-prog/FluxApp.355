
// Arquivo: ServiçosFrontend/ServiçoDeSimulação/simulacoes/Simulacao.Grupo.Config.Convites.ts

// --- DADOS SIMULADOS ---
// Usamos `any` para manter a flexibilidade, mas a estrutura se baseia em um objeto de link de convite.
let mockLinks: any[] = [
    {
        id: 'link-1',
        name: 'Link Permanente Principal',
        url: 'https://flux.com/invite/a1b2c3d4e5',
        type: 'permanent',
        uses: 150,
        isActive: true
    },
    {
        id: 'link-2',
        name: 'Campanha de Marketing #1',
        url: 'https://flux.com/invite/f6g7h8i9j0',
        type: 'temporary',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Expira em 7 dias
        uses: 25,
        isActive: true
    },
    {
        id: 'link-3',
        name: 'Link Expirado',
        url: 'https://flux.com/invite/k1l2m3n4o5',
        type: 'temporary',
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Expirou ontem
        uses: 5,
        isActive: false
    },
];

// --- FUNÇÕES DA API SIMULADA ---

/**
 * Simula a busca de todos os links de convite de um grupo.
 * Retorna um objeto { data: [...] } para alinhar com a resposta do ClienteBackend.
 */
export const obter = (groupId: string): Promise<{ data: any[] }> => {
    console.log(`[SIMULAÇÃO] ✅ Buscando links de convite para o grupo: ${groupId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            // Retorna apenas os links que estão ativos para simular a visão do usuário
            resolve({ data: mockLinks.filter(link => link.isActive) });
        }, 500); // Simula um atraso de rede
    });
};

/**
 * Simula a criação de um novo link de convite.
 * Retorna um objeto { data: {...} } com o novo link.
 */
export const criar = (groupId: string, linkData: any): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Criando novo link para o grupo: ${groupId} com dados:`, linkData);
    return new Promise(resolve => {
        setTimeout(() => {
            const newLink = {
                id: `link_${Date.now()}`,
                url: `https://flux.com/invite/${Math.random().toString(36).substring(2, 10)}`,
                uses: 0,
                isActive: true,
                ...linkData,
            };
            mockLinks.push(newLink);
            resolve({ data: newLink });
        }, 500);
    });
};

/**
 * Simula a revogação (desativação) de um link de convite.
 * Retorna um objeto { data: {...} } com a confirmação.
 */
export const revogar = (groupId: string, linkId: string): Promise<{ data: any }> => {
    console.log(`[SIMULAÇÃO] ✅ Revogando link ${linkId} para o grupo: ${groupId}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const linkIndex = mockLinks.findIndex(link => link.id === linkId);
            if (linkIndex !== -1) {
                // Em vez de remover, marcamos como inativo para simular a revogação
                mockLinks[linkIndex].isActive = false;
                console.log(`[SIMULAÇÃO] Link ${linkId} marcado como inativo.`);
                resolve({ data: { success: true, message: `Link ${linkId} revogado com sucesso.` } });
            } else {
                 // Se o link não for encontrado, rejeitamos a promessa
                console.error(`[SIMULAÇÃO] ❌ Falha ao revogar: Link ${linkId} não encontrado.`);
                reject({ message: "Link não encontrado" });
            }
        }, 500);
    });
};
