
export function validarCriacaoGrupo(data) {
  const erros = []

  if (!data.nome || data.nome.trim().length === 0) {
    erros.push("Nome é obrigatório")
  }

  if (!data.donoId) {
    erros.push("Dono é obrigatório")
  }

  if (!["publico", "privado", "pago"].includes(data.tipo)) {
    erros.push("Tipo inválido")
  }

  if (data.tipo === "pago") {
    if (!data.preco || data.preco <= 0) {
      erros.push("Preço deve ser maior que zero")
    }

    if (!data.moeda) {
      erros.push("Moeda é obrigatória")
    }
  }

  if (erros.length > 0) {
    throw new Error(erros.join(", "))
  }

  return {
    nome: data.nome,
    descricao: data.descricao || "",
    tipo: data.tipo,
    preco: data.preco || 0,
    moeda: data.moeda || null,
    donoId: data.donoId,
    limiteMembros: data.limiteMembros || 0
  }
}
