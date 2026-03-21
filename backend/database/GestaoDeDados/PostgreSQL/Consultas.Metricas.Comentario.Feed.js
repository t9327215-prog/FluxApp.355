// backend/database/GestãoDeDados/PostgreSQL/Consultas.Métricas.Comentário.Feed.js

import pool from '../../pool.js';

async function insertCommentMetric(commentData) {
    // Exemplo: INSERT INTO feed_comment_metrics (comment_id, author_id, post_id, created_at) VALUES ($1, $2, $3, NOW());
    console.log('Consulta SQL: Inserindo métrica de comentário do feed:', commentData);
    // Substitua pela consulta real quando a tabela for criada
    return Promise.resolve(); 
}

async function insertCommentLikeMetric(commentId) {
    // Exemplo: INSERT INTO feed_comment_like_metrics (comment_id, created_at) VALUES ($1, NOW());
    console.log('Consulta SQL: Inserindo métrica de like em comentário do feed:', commentId);
    return Promise.resolve();
}

async function insertCommentReplyMetric(commentId, replyData) {
    // Exemplo: INSERT INTO feed_comment_reply_metrics (comment_id, replier_id, created_at) VALUES ($1, $2, NOW());
    console.log('Consulta SQL: Inserindo métrica de resposta em comentário do feed:', commentId, replyData);
    return Promise.resolve();
}

export {
    insertCommentMetric,
    insertCommentLikeMetric,
    insertCommentReplyMetric,
};