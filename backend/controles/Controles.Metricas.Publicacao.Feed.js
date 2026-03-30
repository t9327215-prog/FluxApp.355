
// backend/controles/Controles.Metricas.Publicacao.Feed.js
import { getPostMetrics as getPostMetricsService } from '../ServicosBackend/Servicos.Metricas.Publicacao.Feed.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

export const getPostMetrics = async (req, res, next) => {
    const { postId } = req.params;
    console.log('Iniciando obtenção de métricas de postagem do feed', { event: 'METRIC_POST_GET_START', postId });

    try {
        const metrics = await getPostMetricsService(postId);
        console.log('Métricas de postagem do feed obtidas com sucesso', { event: 'METRIC_POST_GET_SUCCESS', postId });
        return httpRes.sucesso(res, metrics);
    } catch (error) {
        console.error('Erro ao obter métricas de postagem do feed', { event: 'METRIC_POST_GET_ERROR', errorMessage: error.message, postId });
        return httpRes.erro(res, 'Failed to fetch post metrics', 500);
    }
};
