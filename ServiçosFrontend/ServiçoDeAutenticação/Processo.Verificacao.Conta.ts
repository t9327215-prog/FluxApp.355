/**
 * @file Processo de Verificação de Conta de Usuário
 *
 * Responsável por validar a conta de um usuário a partir de um token
 * de verificação, comunicando-se com a API para confirmar o status.
 */

import { Usuario } from "../../../types/Saida/Types.Estrutura.Usuario";
import { VerificacaoContaDTO } from "../../../types/Entrada/Types.DTO.Verificacao.Conta";

/**
 * Resultado da operação de verificação de conta.
 */
interface ResultadoVerificacaoConta {
  success: boolean;
  message: string;
  data?: Usuario;
}

/**
 * Envia um token de verificação para a API para validar a conta do usuário.
 * @param dadosVerificacao - DTO contendo o token de verificação.
 * @returns O resultado da operação de verificação.
 */
async function verificarConta(
  dadosVerificacao: VerificacaoContaDTO
): Promise<ResultadoVerificacaoConta> {
  try {
    const response = await fetch("/api/auth/verify-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosVerificacao),
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Token de verificação inválido ou expirado.");
    }

    return {
      success: true,
      message: resultadoAPI.message || "Conta verificada com sucesso!",
      data: resultadoAPI.data, // A API pode retornar o usuário com o status verificado
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado durante a verificação.",
    };
  }
}

/**
 * Objeto que encapsula e exporta as funções do processo.
 */
export const processoVerificacaoConta = {
  verificarConta,
};
