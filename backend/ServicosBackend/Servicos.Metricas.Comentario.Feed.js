// backend/ServicosBackend/Servicos.Metricas.Comentario.Feed.js
import * as feedCommentMetricsRepository from '../Repositorios/Repositorio.Metricas.Comentario.Feed.js';

export async function trackComment(commentData) {
    return feedCommentMetricsRepository.trackComment(commentData);
}

export async function trackCommentLike(commentId) {
   return feedCommentMetricsRepository.trackCommentLike(commentId);
}

export async function trackCommentReply(commentId, replyData) {
    return feedCommentMetricsRepository.trackCommentReply(commentId, replyData);
}
