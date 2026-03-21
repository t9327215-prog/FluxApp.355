
/**
 * @file Processo de Criação de Sessão de Usuário (Login)
 *
 * Orquestra os diferentes métodos de login (Email/Senha, Google) e gerencia
 * o token de sessão e os dados do usuário no armazenamento local.
 */

import { Usuario } from "../../../types/Saida/Types.Estrutura.Usuario";
import { CriacaoSessaoDTO } from "../../../types/Entrada/Types.DTO.Criacao.Sessao";
import { metodoEmailSenha } from './Servico.Metodo.Email.Senha';
import { metodoGoogle } from './Servico.Metodo.Google';

interface ResultadoCriacaoSessao {
  success: boolean;
  message: string;
  token?: string;
  user?: Usuario;
}

/**
 * Gerencia o armazenamento local do token de autenticação.
 */
const tokenManager = {
  save: (token: string) => localStorage.setItem('userToken', token),
  clear: () => localStorage.removeItem('userToken'),
};

/**
 * Gerencia o armazenamento local dos dados do perfil do usuário.
 */
const userManager = {
  save: (user: Usuario) => localStorage.setItem('user', JSON.stringify(user)),
  clear: () => localStorage.removeItem('user'),
};

/**
 * Lida com o resultado bem-sucedido de uma autenticação.
 */
function handleLoginSuccess(token: string, user: Usuario): ResultadoCriacaoSessao {
  if (!token || !user) {
    throw new Error("Dados de autenticação incompletos recebidos do serviço.");
  }
  tokenManager.save(token);
  userManager.save(user);
  return {
    success: true,
    message: "Login bem-sucedido!",
    token,
    user,
  };
}

/**
 * Lida com falhas de autenticação.
 */
function handleLoginFailure(error: any): ResultadoCriacaoSessao {
  tokenManager.clear();
  userManager.clear();
  return {
    success: false,
    message: error.message || "Ocorreu um erro inesperado durante o login.",
  };
}

/**
 * Realiza o login utilizando email e senha.
 */
async function loginComEmail(
  credenciais: CriacaoSessaoDTO
): Promise<ResultadoCriacaoSessao> {
  try {
    const { token, user } = await metodoEmailSenha.login(credenciais);
    return handleLoginSuccess(token, user);
  } catch (error: any) {
    return handleLoginFailure(error);
  }
}

/**
 * Realiza o login utilizando uma credencial do Google.
 */
async function loginComGoogle(
  googleCredential: string,
  referredBy?: string,
): Promise<ResultadoCriacaoSessao> {
  try {
    const { token, user } = await metodoGoogle.login(googleCredential, referredBy);
    return handleLoginSuccess(token, user);
  } catch (error: any) {
    return handleLoginFailure(error);
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
  loginComEmail,
  loginComGoogle,
  encerrarSessao,
};
