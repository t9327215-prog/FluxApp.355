
// backend/validators/Reels.validator.js

/**
 * Valida os dados para a criação de um novo Reel.
 * Garante que a publicação tenha uma URL de mídia.
 */
export function validarPublicacaoReels(data) {
  const erros = [];

  if (!data.autorId) {
    erros.push("Autor do Reel é obrigatório");
  }

  if (!data.urlMidia || data.urlMidia.trim().length === 0) {
    erros.push("A URL da mídia do Reel não pode estar vazia");
  }

  // Validação simples de URL (pode ser melhorada com regex mais complexos se necessário)
  try {
    if (data.urlMidia) new URL(data.urlMidia);
  } catch (_) {
    erros.push("A URL da mídia fornecida é inválida");
  }
  
  // A descrição é opcional, mas se existir, pode ter um limite de tamanho
  if (data.descricao && data.descricao.length > 2000) {
      erros.push("A descrição excede o limite de 2000 caracteres.");
  }

  if (erros.length > 0) {
    throw new Error(erros.join(", "));
  }

  // Retorna um objeto limpo com os dados permitidos
  return {
    autorId: data.autorId,
    urlMidia: data.urlMidia,
    descricao: data.descricao || null, // Garante que seja null se não for fornecida
  };
}
