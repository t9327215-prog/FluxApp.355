
import { createLogger } from '../ServicosBackend/Logger.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import * as marketplaceCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Marketplace.js';

const logger = createLogger('MarketplaceCommentMetrics');

async function trackComment(req, res) {
    const { commentData } = req.body;
    logger.info('METRIC_COMMENT_TRACK_START', { productId: commentData?.productId });

    try {
        await marketplaceCommentMetricsService.trackComment(commentData);
        logger.info('METRIC_COMMENT_TRACK_SUCCESS', { productId: commentData?.productId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        logger.error('METRIC_COMMENT_TRACK_ERROR', error, { data: commentData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    logger.info('METRIC_COMMENT_LIKE_TRACK_START', { commentId });

    try {
        await marketplaceCommentMetricsService.trackCommentLike(commentId);
        logger.info('METRIC_COMMENT_LIKE_TRACK_SUCCESS', { commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        logger.error('METRIC_COMMENT_LIKE_TRACK_ERROR', error, { commentId });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    logger.info('METRIC_COMMENT_REPLY_TRACK_START', { commentId });

    try {
        await marketplaceCommentMetricsService.trackCommentReply(commentId, replyData);
        logger.info('METRIC_COMMENT_REPLY_TRACK_SUCCESS', { commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        logger.error('METRIC_COMMENT_REPLY_TRACK_ERROR', error, { commentId, data: replyData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
