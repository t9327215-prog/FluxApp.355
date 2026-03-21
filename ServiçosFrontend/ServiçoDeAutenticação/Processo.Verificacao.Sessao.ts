/**
 * @file Processo de Verificação de Sessão de Usuário
 *
 * Verifica a validade de uma sessão de usuário existente, consultando a API
 * com o token de autenticação armazenado localmente.
 */

import { Usuario } from "../../../types/Saida/Types.Estrutura.Usuario";

/**
 * Resultado da operação de verificação de sessão.
 */
interface ResultadoVerificacaoSessao {
  success: boolean;
  message: string;
  data?: { user: Usuario; token: string };
}

/**
 * Gerencia o acesso ao token de autenticação no localStorage.
 */
const tokenManager = {
  get: () => localStorage.getItem('authToken'),
  clear: () => localStorage.removeItem('authToken'),
};

/**
 * Verifica a validade do token de sessão atual com o backend.
 * @returns O resultado da verificação, incluindo dados do usuário se a sessão for válida.
 */
async function verificarSessao(): Promise<ResultadoVerificacaoSessao> {
  const token = tokenManager.get();

  // Se não houver token, não há sessão para verificar.
  if (!token) {
    return { success: false, message: "Nenhuma sessão encontrada." };
  }

  try {
    const response = await fetch("/api/auth/verify-session", {
      method: "POST", // Usando POST para enviar o token no corpo ou GET com header
      headers: {
        "Content-Type": "application/json",
        // O padrão é enviar o token no cabeçalho Authorization
        Authorization: `Bearer ${token}`,
      },
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Sessão inválida ou expirada.");
    }

    // A API deve retornar os dados do usuário associados ao token válido
    return {
      success: true,
      message: "Sessão validada com sucesso.",
      data: { user: resultadoAPI.data, token },
    };
  } catch (error: any) {
    // Se a verificação falhar, o token é inválido e deve ser removido.
    tokenManager.clear();
    return {
      success: false,
      message: error.message || "Falha ao verificar a sessão.",
    };
  }
}

/**
 * Objeto que encapsula e exporta as funções do processo.
 */
export const processoVerificacaoSessao = {
  verificarSessao,
};
