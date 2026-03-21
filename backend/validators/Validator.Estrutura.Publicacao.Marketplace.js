
// backend/validators/Marketplace.validator.js

/**
 * Valida os dados para a criação de um item de Marketplace.
 * Garante que o item tenha título, preço e moeda válidos.
 */
export function validarItemMarketplace(data) {
  const erros = [];

  if (!data.autorId) {
    erros.push("Autor do item é obrigatório");
  }

  if (!data.titulo || data.titulo.trim().length === 0) {
    erros.push("O título do item não pode estar vazio");
  }

  if (data.titulo && data.titulo.length > 150) {
    erros.push("O título excede o limite de 150 caracteres.");
  }
  
  if (data.descricao && data.descricao.length > 3000) {
      erros.push("A descrição excede o limite de 3000 caracteres.");
  }

  // Validação de Preço
  if (data.preco === undefined || data.preco === null) {
    erros.push("Preço é obrigatório");
  } else if (typeof data.preco !== 'number' || data.preco <= 0) {
    erros.push("Preço deve ser um número maior que zero");
  }

  // Validação de Moeda
  if (!data.moeda || typeof data.moeda !== 'string' || !/^[A-Z]{3}$/.test(data.moeda)) {
    erros.push("Moeda é obrigatória e deve ser um código ISO de 3 letras (ex: BRL, USD)");
  }
  
  if (erros.length > 0) {
    throw new Error(erros.join(", "));
  }

  // Retorna um objeto limpo com os dados permitidos
  return {
    autorId: data.autorId,
    titulo: data.titulo.trim(),
    descricao: data.descricao ? data.descricao.trim() : null,
    preco: data.preco,
    moeda: data.moeda,
  };
}
