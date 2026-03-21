/**
 * @file Processo de Criação de Sessão de Usuário (Login)
 *
 * Orquestra o fluxo de autenticação de um usuário, enviando as credenciais
 * para a API e gerenciando o token de sessão e os dados do usuário.
 */

import { Usuario } from "../../../types/Saida/Types.Estrutura.Usuario";
import { CriacaoSessaoDTO } from "../../../types/Entrada/Types.DTO.Criacao.Sessao";

// ... (interfaces continuam as mesmas)

/**
 * Gerencia o armazenamento local do token de autenticação.
 */
const tokenManager = {
  save: (token: string) => localStorage.setItem('authToken', token),
  clear: () => localStorage.removeItem('authToken'),
};

/**
 * Gerencia o armazenamento local dos dados do perfil do usuário.
 */
const userManager = {
  save: (user: Usuario) => localStorage.setItem('user', JSON.stringify(user)),
  clear: () => localStorage.removeItem('user'),
};

/**
 * Envia as credenciais de login para a API e gerencia a sessão.
 */
async function criarSessao(
  credenciais: CriacaoSessaoDTO
): Promise<ResultadoCriacaoSessao> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciais),
    });

    const resultadoAPI = await response.json();

    if (!response.ok) {
      throw new Error(resultadoAPI.message || "Credenciais inválidas.");
    }

    const { token, user } = resultadoAPI.data;

    if (!token || !user) {
      throw new Error("Dados de autenticação incompletos recebidos da API.");
    }

    // Armazena o token e os dados do usuário
    tokenManager.save(token);
    userManager.save(user);

    return {
      success: true,
      message: resultadoAPI.message || "Login bem-sucedido!",
      token,
      user,
    };
  } catch (error: any) {
    // Garante que ambos, token e dados do usuário, sejam limpos em caso de falha.
    tokenManager.clear();
    userManager.clear();
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado durante o login.",
    };
  }
}

/**
 * Limpa o token e os dados do usuário do armazenamento local.
 */
function encerrarSessao() {
  tokenManager.clear();
  userManager.clear();
}

/**
 * Objeto que encapsula e exporta as funções do processo.
 */
export const processoCriacaoSessao = {
  criarSessao,
  encerrarSessao,
};

// Adicione a definição da interface ResultadoCriacaoSessao que estava faltando
interface ResultadoCriacaoSessao {
  success: boolean;
  message: string;
  token?: string;
  user?: Usuario;
}
