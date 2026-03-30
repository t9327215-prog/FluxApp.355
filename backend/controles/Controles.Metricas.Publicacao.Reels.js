
import ServicoMetricasPublicacaoReels from '../ServicosBackend/Servicos.Metricas.Publicacao.Reels.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

class ControlesMetricasPublicacaoReels {
    async getReelMetrics(req, res, next) {
        const { reelId } = req.params;
        console.log('Buscando métricas para Reel', { event: 'METRIC_REEL_GET_START', reelId });

        try {
            const metrics = await ServicoMetricasPublicacaoReels.getReelMetrics(reelId);
            console.log('Métricas para Reel obtidas com sucesso', { event: 'METRIC_REEL_GET_SUCCESS', reelId });
            return httpRes.sucesso(res, metrics);
        } catch (error) {
            console.error('Erro ao buscar métricas para Reel', { event: 'METRIC_REEL_GET_ERROR', errorMessage: error.message, reelId });
            return httpRes.erro(res, 'Failed to fetch reel metrics', 500);
        }
    }
}

export default new ControlesMetricasPublicacaoReels();
