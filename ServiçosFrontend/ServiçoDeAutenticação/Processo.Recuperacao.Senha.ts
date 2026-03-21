/**
 * @file Processo de Recuperação de Senha
 *
 * Inicia o fluxo de recuperação de senha para um usuário, enviando uma solicitação
 * para a API para que um e-mail de redefinição seja enviado.
 */

/**
 * Resultado da operação de solicitação de recuperação de senha.
 */
interface ResultadoRecuperacao {
  success: boolean;
  message: string;
}

/**
 * Dados necessários para iniciar a recuperação de senha.
 */
interface RecuperacaoSenhaDTO {
  email: string;
}

/**
 * Envia uma solicitação para a API para iniciar o processo de recuperação de senha.
 * @param dados - DTO contendo o e-mail do usuário.
 * @returns O resultado da operação.
 */
async function solicitarRecuperacao(
  dados: RecuperacaoSenhaDTO
): Promise<ResultadoRecuperacao> {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Não foi possível processar a solicitação.");
    }

    return {
      success: true,
      message: resultadoAPI.message || "Se o e-mail estiver correto, um link de recuperação foi enviado.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado.",
    };
  }
}

/**
 * Objeto que encapsula e exporta as funções do processo.
 */
export const processoRecuperacaoSenha = {
  solicitarRecuperacao,
};
