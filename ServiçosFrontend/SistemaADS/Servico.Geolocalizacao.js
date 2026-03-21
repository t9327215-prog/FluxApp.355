
// Este serviço irá chamar o backend para obter o idioma preferencial do usuário com base em seu IP.

async function obterIdiomaPorLocalizacao() {
    try {
        // O endpoint /api/vendas/idioma-por-ip será ajustado no backend.
        const response = await fetch('/api/vendas/idioma-por-ip');
        if (!response.ok) {
            throw new Error('A resposta do servidor não foi bem-sucedida.');
        }
        const data = await response.json();
        // O backend retornará um objeto como: { language: 'pt-BR' }
        return data.language;
    } catch (error) {
        console.error('Não foi possível determinar o idioma baseado na localização:', error);
        // Em caso de erro, retorna um idioma padrão como fallback.
        return 'en-US'; // Inglês como fallback universal
    }
}

export const ServicoDeGeolocalizacao = {
    obterIdiomaPorLocalizacao,
};
