const METRICS_ENDPOINT = '/api/metrics/marketplace';

/**
 * Formata um timestamp em uma string de tempo relativo (ex: "há 5 minutos").
 * @param {string | number | Date} timestamp - O timestamp a ser formatado.
 * @returns {string} - A string de tempo relativo.
 */
export function formatRelativeTime(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = {
    ano: 31536000,
    mês: 2592000,
    semana: 604800,
    dia: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1
  };

  for (const unit in units) {
    const interval = Math.floor(diffInSeconds / units[unit]);
    if (interval >= 1) {
      if (unit === 'mês' && interval >= 12) {
          const years = Math.floor(interval / 12);
          return `há ${years} ${years > 1 ? 'anos' : 'ano'}`;
      }
      if (unit === 'semana' && interval >= 4) {
          const months = Math.floor(interval / 4);
          return `há ${months} ${months > 1 ? 'meses' : 'mês'}`;
      }
      return `há ${interval} ${unit}${interval > 1 ? 's' : ''}`;
    }
  }
  return "agora mesmo";
}


/**
 * Envia um evento de novo comentário para o backend.
 * @param {object} commentData - Dados do comentário (ex: { id, text, authorId, itemId }).
 */
export const trackMarketplaceComment = async (commentData) => {
  console.log('Enviando evento de novo comentário no marketplace:', commentData);
  try {
    const response = await fetch(`${METRICS_ENDPOINT}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentData }),
    });
    if (!response.ok) {
      throw new Error('Falha ao rastrear o comentário do marketplace');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear o comentário do marketplace:', error);
    throw error;
  }
};

/**
 * Envia um evento de like em um comentário para o backend.
 * @param {string} commentId - O ID do comentário.
 */
export const trackMarketplaceCommentLike = async (commentId) => {
  console.log(`Enviando evento de like no comentário do marketplace: ${commentId}`);
  try {
    const response = await fetch(`${METRICS_ENDPOINT}/comment/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId }),
    });
    if (!response.ok) {
      throw new Error('Falha ao rastrear o like no comentário do marketplace');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear o like no comentário do marketplace:', error);
    throw error;
  }
};

/**
 * Envia um evento de resposta a um comentário para o backend.
 * @param {string} commentId - O ID do comentário principal.
 * @param {object} replyData - Dados da resposta.
 */
export const trackMarketplaceCommentReply = async (commentId, replyData) => {
  console.log(`Enviando evento de resposta no comentário do marketplace: ${commentId}`, replyData);
  try {
    const response = await fetch(`${METRICS_ENDPOINT}/comment/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId, replyData }),
    });
    if (!response.ok) {
      throw new Error('Falha ao rastrear a resposta ao comentário do marketplace');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao rastrear a resposta ao comentário do marketplace:', error);
    throw error;
  }
};
