/**
 * @file Processo de Envio de Código de Verificação
 *
 * Responsável por solicitar à API o envio de um código de verificação (seja para
 * confirmação de conta, reset de senha, etc.) para o e-mail do usuário.
 */

interface ResultadoEnvioCodigo {
  success: boolean;
  message: string;
}

interface EnvioCodigoDTO {
  email: string;
  context: 'verify' | 'reset'; // Contexto do envio do código
}

/**
 * Envia uma solicitação para a API para enviar um código de verificação.
 * @param dados - DTO com o e-mail e o contexto.
 * @returns O resultado da operação.
 */
async function solicitarCodigo(
  dados: EnvioCodigoDTO
): Promise<ResultadoEnvioCodigo> {
  try {
    const response = await fetch("/api/auth/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Não foi possível enviar o código.");
    }

    return {
      success: true,
      message: resultadoAPI.message || "Código de verificação enviado com sucesso.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado ao enviar o código.",
    };
  }
}

export const processoEnvioCodigo = {
  solicitar: solicitarCodigo,
};
