
// backend/controles/Controles.Metricas.Comentario.Reels.js
import * as reelsCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Reels.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

async function trackComment(req, res) {
    const { commentData } = req.body;
    console.log('Iniciando rastreamento de comentário de reel', { event: 'METRIC_COMMENT_TRACK_START', reelId: commentData?.reelId });

    try {
        await reelsCommentMetricsService.trackComment(commentData);
        console.log('Rastreamento de comentário de reel bem-sucedido', { event: 'METRIC_COMMENT_TRACK_SUCCESS', reelId: commentData?.reelId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear comentário de reel', { event: 'METRIC_COMMENT_TRACK_ERROR', errorMessage: error.message, data: commentData });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    console.log('Iniciando rastreamento de curtida em comentário de reel', { event: 'METRIC_COMMENT_LIKE_TRACK_START', commentId });

    try {
        await reelsCommentMetricsService.trackCommentLike(commentId);
        console.log('Rastreamento de curtida em comentário de reel bem-sucedido', { event: 'METRIC_COMMENT_LIKE_TRACK_SUCCESS', commentId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear curtida em comentário de reel', { event: 'METRIC_COMMENT_LIKE_TRACK_ERROR', errorMessage: error.message, commentId });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    console.log('Iniciando rastreamento de resposta a comentário de reel', { event: 'METRIC_COMMENT_REPLY_TRACK_START', commentId });

    try {
        await reelsCommentMetricsService.trackCommentReply(commentId, replyData);
        console.log('Rastreamento de resposta a comentário de reel bem-sucedido', { event: 'METRIC_COMMENT_REPLY_TRACK_SUCCESS', commentId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear resposta a comentário de reel', { event: 'METRIC_COMMENT_REPLY_TRACK_ERROR', errorMessage: error.message, commentId, data: replyData });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
