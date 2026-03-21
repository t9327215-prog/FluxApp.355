import * as RepositorioMetricasPublicacaoReels from '../Repositorios/Repositorio.Metricas.Publicacao.Reels.js';

class ServicoMetricasPublicacaoReels {
    async getReelMetrics(reelId) {
        const likes = await RepositorioMetricasPublicacaoReels.getReelLikes(reelId);
        const views = await RepositorioMetricasPublicacaoReels.getReelViews(reelId);
        const shares = await RepositorioMetricasPublicacaoReels.getReelShares(reelId);
        const comments = await RepositorioMetricasPublicacaoReels.getReelComments(reelId);

        return {
            likes,
            views,
            shares,
            comments,
        };
    }
}

export default new ServicoMetricasPublicacaoReels();
