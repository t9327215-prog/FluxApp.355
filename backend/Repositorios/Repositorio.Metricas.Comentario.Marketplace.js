// backend/Repositorios/Repositorio.Metricas.Comentario.Marketplace.js
import * as queries from '../database/GestaoDeDados/PostgreSQL/Consultas.Metricas.Comentario.Marketplace.js';

export async function trackComment(commentData) {
    return queries.insertCommentMetric(commentData);
}

export async function trackCommentLike(commentId) {
    return queries.insertCommentLikeMetric(commentId);
}

export async function trackCommentReply(commentId, replyData) {
    return queries.insertCommentReplyMetric(commentId, replyData);
}
