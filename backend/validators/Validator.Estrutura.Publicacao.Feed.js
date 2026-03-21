
/**
 * Valida os dados para a criação de uma publicação no Feed.
 * Garante que a publicação tenha o conteúdo mínimo necessário.
 */
export function validarPublicacaoFeed(data) {
  const erros = [];

  if (!data.autorId) {
    erros.push("Autor da publicação é obrigatório");
  }

  if (!data.texto || data.texto.trim().length === 0) {
    erros.push("O texto da publicação não pode estar vazio");
  }

  if (erros.length > 0) {
    throw new Error(erros.join(", "));
  }

  // Retorna um objeto limpo, garantindo que apenas os dados esperados passem
  return {
    autorId: data.autorId,
    texto: data.texto,
    // Você pode adicionar aqui outros campos permitidos mas não obrigatórios
    // ex: urlMidia: data.urlMidia || null
  };
}
