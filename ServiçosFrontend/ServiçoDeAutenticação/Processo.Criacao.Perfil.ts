/**
 * @file Processo de Criação de Perfil de Usuário (Cadastro)
 *
 * Orquestra o fluxo de criação de uma nova conta de usuário, enviando os dados
 * para a API e tratando a resposta.
 */

import { CriacaoContaDTO } from "../../../types/Entrada/Types.DTO.Criacao.Conta";
import { Usuario } from "../../../types/Saida/Types.Estrutura.Usuario";

/**
 * Resultado da operação de criação de conta.
 */
interface ResultadoCriacaoConta {
  success: boolean;
  message: string;
  user?: Usuario;
}

/**
 * Envia os dados de cadastro para a API.
 * @param dados - DTO com nome, email e senha do novo usuário.
 * @returns O resultado da tentativa de cadastro.
 */
async function criarPerfil(
  dados: CriacaoContaDTO
): Promise<ResultadoCriacaoConta> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Falha ao criar a conta.");
    }

    return {
      success: true,
      message: resultadoAPI.message || "Conta criada com sucesso! Verifique seu e-mail.",
      user: resultadoAPI.data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado durante o cadastro.",
    };
  }
}

/**
 * Objeto que encapsula e exporta a função do processo.
 */
export const processoCriacaoPerfil = {
  criar: criarPerfil,
};
