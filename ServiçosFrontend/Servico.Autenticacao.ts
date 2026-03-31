import { dadosProviderSessao } from './Infra/Dados.Provider.Sessao';
import { mapearBackendParaFrontend } from './Contratos/Contrato.Comunicacao.Usuario';

// Esta interface de usuário é uma duplicata do que está no Provedor. Futuramente, seria bom movê-la para um arquivo de tipos compartilhado.
interface Usuario {
  id: string;
  nome: string;
  email: string;
  apelido?: string;
  avatarUrl?: string;
  perfilCompleto: boolean;
}

class ServicoAutenticacao {
  async loginComEmail(credenciais: { email: string; senha: string }): Promise<{ usuario: Usuario, token: string }> {
    const resposta = await dadosProviderSessao.login(credenciais.email, credenciais.senha);
    if (resposta.sucesso && resposta.dados?.user) {
      const usuario = mapearBackendParaFrontend(resposta.dados.user);
      const token = resposta.dados.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login');
    }
  }

  async lidarComLoginGoogle(tokenResponse: any): Promise<{ usuario: Usuario, token: string }> {
    const accessToken = tokenResponse.access_token;
    
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const userInfo = await response.json();
    
    const dadosLogin = {
      nome: userInfo.name || '',
      email: userInfo.email,
      googleId: userInfo.sub,
      avatarUrl: userInfo.picture || '',
      tokenProvider: accessToken,
    };

    const resposta = await dadosProviderSessao.lidarComLoginSocial(dadosLogin);
    
    if (resposta.sucesso && resposta.dados?.user) {
      const dadosUsuario = mapearBackendParaFrontend(resposta.dados.user);
      const token = resposta.dados.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return { usuario: dadosUsuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login com Google');
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  async verificarSessao(): Promise<Usuario | null> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // TODO: Validar o token com o backend e buscar os dados do usuário.
      // Por enquanto, esta função não faz a validação para evitar o loop de login.
      console.warn("A sessão está sendo verificada apenas localmente, sem validação do backend.");
    }
    return null; // Retornando null para evitar o loop de login.
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();
