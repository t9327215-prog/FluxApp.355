const METRICS_ENDPOINT = '/api/metrics/feed';

/**
 * Envia um evento de novo comentário para o backend.
 * @param {object} commentData - Dados do comentário (ex: { id, text, authorId, postId }).
 */
export const trackFeedComment = async (commentData) => {
  console.log('Enviando evento de novo comentário no feed:', commentData);
  try {
    const response = await fetch(`${METRICS_ENDPOINT}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData }),
    });
    if (!response.ok) {
      throw new Error('Falha ao rastrear o comentário do feed');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear o comentário do feed:', error);
    throw error;
  }
};

/**
 * Envia um evento de like em um comentário para o backend.
 * @param {string} commentId - O ID do comentário.
 */
export const trackFeedCommentLike = async (commentId) => {
  console.log(`Enviando evento de like no comentário do feed: ${commentId}`);
  try {
    const response = await fetch(`${METRICS_ENDPOINT}/comment/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId }),
    });
    if (!response.ok) {
      throw new Error('Falha ao rastrear o like no comentário do feed');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear o like no comentário do feed:', error);
    throw error;
  }
};

/**
 * Envia um evento de resposta a um comentário para o backend.
 * @param {string} commentId - O ID do comentário principal.
 * @param {object} replyData - Dados da resposta.
 */
export const trackFeedCommentReply = async (commentId, replyData) => {
  console.log(`Enviando evento de resposta no comentário do feed: ${commentId}`, replyData);
  try {
    const response = await fetch(`${METRICS_ENDPOINT}/comment/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId, replyData }),
    });
    if (!response.ok) {
      throw new Error('Falha ao rastrear a resposta ao comentário do feed');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear a resposta ao comentário do feed:', error);
    throw error;
  }
};
