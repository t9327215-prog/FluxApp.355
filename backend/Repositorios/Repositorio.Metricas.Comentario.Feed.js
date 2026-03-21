// backend/Repositorios/Repositorio.Metricas.Comentario.Feed.js
import pool from '../database/pool.js';

export async function trackComment(commentData) {
    const { userId, postId, content } = commentData;
    // Lógica para registrar o comentário no banco de dados
    const query = 'INSERT INTO feed_comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, postId, content];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function trackCommentLike(commentId) {
    // Lógica para registrar um like em um comentário
    const query = 'UPDATE feed_comments SET likes = likes + 1 WHERE id = $1 RETURNING *';
    const values = [commentId];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function trackCommentReply(commentId, replyData) {
    const { userId, content } = replyData;
    // Lógica para registrar uma resposta a um comentário
    const query = 'INSERT INTO feed_comment_replies (comment_id, user_id, content) VALUES ($1, $2, $3) RETURNING *';
    const values = [commentId, userId, content];
    const result = await pool.query(query, values);
    return result.rows[0];
}
