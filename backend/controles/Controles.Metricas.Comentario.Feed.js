
import * as feedCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Feed.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

async function trackComment(req, res) {
    const { commentData } = req.body;
    console.log('Iniciando rastreamento de métrica de comentário', { event: 'METRIC_COMMENT_TRACK_START', postId: commentData?.postId });

    try {
        await feedCommentMetricsService.trackComment(commentData);
        console.log('Métrica de comentário rastreada com sucesso', { event: 'METRIC_COMMENT_TRACK_SUCCESS', postId: commentData?.postId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear métrica de comentário', { event: 'METRIC_COMMENT_TRACK_ERROR', errorMessage: error.message, data: commentData });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    console.log('Iniciando rastreamento de curtida em comentário', { event: 'METRIC_COMMENT_LIKE_TRACK_START', commentId });

    try {
        await feedCommentMetricsService.trackCommentLike(commentId);
        console.log('Curtida em comentário rastreada com sucesso', { event: 'METRIC_COMMENT_LIKE_TRACK_SUCCESS', commentId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear curtida em comentário', { event: 'METRIC_COMMENT_LIKE_TRACK_ERROR', errorMessage: error.message, commentId });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    console.log('Iniciando rastreamento de resposta a comentário', { event: 'METRIC_COMMENT_REPLY_TRACK_START', commentId });

    try {
        await feedCommentMetricsService.trackCommentReply(commentId, replyData);
        console.log('Resposta a comentário rastreada com sucesso', { event: 'METRIC_COMMENT_REPLY_TRACK_SUCCESS', commentId });
        return httpRes.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear resposta a comentário', { event: 'METRIC_COMMENT_REPLY_TRACK_ERROR', errorMessage: error.message, commentId, data: replyData });
        return httpRes.erro(res, 'Error tracking metric', 500);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
