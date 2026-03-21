// backend/ServicosBackend/Servicos.Metricas.Comentario.Reels.js
import * as reelsCommentMetricsRepository from '../Repositorios/Repositorio.Metricas.Comentario.Reels.js';

export async function trackComment(commentData) {
    return reelsCommentMetricsRepository.trackComment(commentData);
}

export async function trackCommentLike(commentId) {
   return reelsCommentMetricsRepository.trackCommentLike(commentId);
}

export async function trackCommentReply(commentId, replyData) {
    return reelsCommentMetricsRepository.trackCommentReply(commentId, replyData);
}
