
// backend/controles/Controles.Metricas.Comentario.Marketplace.js
import * as marketplaceCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Marketplace.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

async function trackComment(req, res) {
    const { commentData } = req.body;
    console.log('Iniciando rastreamento de métrica de comentário do marketplace', { event: 'METRIC_COMMENT_TRACK_START', productId: commentData?.productId });

    try {
        await marketplaceCommentMetricsService.trackComment(commentData);
        console.log('Métrica de comentário do marketplace rastreada com sucesso', { event: 'METRIC_COMMENT_TRACK_SUCCESS', productId: commentData?.productId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear métrica de comentário do marketplace', { event: 'METRIC_COMMENT_TRACK_ERROR', errorMessage: error.message, data: commentData });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    console.log('Iniciando rastreamento de métrica de curtida de comentário do marketplace', { event: 'METRIC_COMMENT_LIKE_TRACK_START', commentId });

    try {
        await marketplaceCommentMetricsService.trackCommentLike(commentId);
        console.log('Métrica de curtida de comentário do marketplace rastreada com sucesso', { event: 'METRIC_COMMENT_LIKE_TRACK_SUCCESS', commentId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear métrica de curtida de comentário do marketplace', { event: 'METRIC_COMMENT_LIKE_TRACK_ERROR', errorMessage: error.message, commentId });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    console.log('Iniciando rastreamento de métrica de resposta de comentário do marketplace', { event: 'METRIC_COMMENT_REPLY_TRACK_START', commentId });

    try {
        await marketplaceCommentMetricsService.trackCommentReply(commentId, replyData);
        console.log('Métrica de resposta de comentário do marketplace rastreada com sucesso', { event: 'METRIC_COMMENT_REPLY_TRACK_SUCCESS', commentId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear métrica de resposta de comentário do marketplace', { event: 'METRIC_COMMENT_REPLY_TRACK_ERROR', errorMessage: error.message, commentId, data: replyData });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
