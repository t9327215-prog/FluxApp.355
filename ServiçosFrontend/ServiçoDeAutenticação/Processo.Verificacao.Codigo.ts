/**
 * @file Processo de Verificação de Código
 *
 * Responsável por verificar um código de 6 dígitos inserido pelo usuário,
 * normalmente enviado para o backend para validação.
 */

interface ResultadoVerificacaoCodigo {
  success: boolean;
  message: string;
  // Pode incluir um token de curta duração se a verificação for bem-sucedida,
  // permitindo a próxima etapa (ex: redefinir senha).
  resetToken?: string; 
}

interface VerificacaoCodigoDTO {
  email: string;
  code: string;
}

/**
 * Envia o código para a API para verificação.
 * @param dados - DTO com o e-mail e o código.
 * @returns O resultado da verificação.
 */
async function verificarCodigo(
  dados: VerificacaoCodigoDTO
): Promise<ResultadoVerificacaoCodigo> {
  try {
    const response = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Código inválido ou expirado.");
    }

    return {
      success: true,
      message: resultadoAPI.message || "Código verificado com sucesso.",
      resetToken: resultadoAPI.resetToken, // Opcional
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado na verificação.",
    };
  }
}

export const processoVerificacaoCodigo = {
  verificar: verificarCodigo,
};
