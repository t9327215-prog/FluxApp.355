
import { infraProviderAutenticacao } from './Infra.Provider.Autenticacao';
import { infraProvider as infraProviderUsuario } from './Infra.Provider.Usuario';

// A interface ILoginSocialData é interna e não causa dependência externa.
interface ILoginSocialData {
  nome: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  tokenProvider: string;
}

class C_DadosProvider {
  // --- DEFINIÇÕES DA ESTRUTURA DE DADOS ---
  camposPerfilObrigatorio = () => [
    { campo: 'id', tipo: 'string', obrigatorio: true },
    { campo: 'nome', tipo: 'string', obrigatorio: true },
    { campo: 'nickname', tipo: 'string', obrigatorio: true },
    { campo: 'email', tipo: 'string', obrigatorio: true },
    { campo: 'dataNascimento', tipo: 'date', obrigatorio: true },
  ];

  camposLoginSocial = () => [
    { campo: 'nome', tipo: 'string', obrigatorio: true },
    { campo: 'email', tipo: 'string', obrigatorio: true },
    { campo: 'googleId', tipo: 'string', obrigatorio: true },
    { campo: 'avatarUrl', tipo: 'string', obrigatorio: false },
  ];

  // --- MÉTODOS ORQUESTRADORES ---

  async login(email: string, senha: string): Promise<any> {
    try {
      // Aqui usamos o infraProviderAutenticacao que já lida com a lógica de login.
      const response = await infraProviderAutenticacao.login(email, senha);
      // A resposta do login já vem no formato esperado pelo serviço de autenticação
      return response;
    } catch (error: any) {
      // Em caso de erro, retornamos um objeto padronizado para falha.
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha na comunicação com o servidor durante o login." };
    }
  }

  async completarPerfil(perfilData: any): Promise<any> {
    for (const campo of this.camposPerfilObrigatorio()) {
      if (campo.campo === 'id') continue;
      if (!(campo.campo in perfilData) || !perfilData[campo.campo as keyof any]) {
        return { sucesso: false, mensagem: `O campo '${campo.campo}' é obrigatório.` };
      }
    }
    try {
      const response = await infraProviderAutenticacao.completarPerfil(perfilData);
      if (response.status === 200) {
        return { sucesso: true, mensagem: "Perfil completado com sucesso!", usuarioAtualizado: response.data };
      } else {
        return { sucesso: false, mensagem: response.data.message || "Ocorreu um erro desconhecido." };
      }
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha na comunicação com o servidor." };
    }
  }

  async lidarComLoginSocial(dadosLogin: ILoginSocialData): Promise<any> {
    for (const campo of this.camposLoginSocial()) {
      if (campo.obrigatorio && (!dadosLogin.hasOwnProperty(campo.campo) || !dadosLogin[campo.campo as keyof ILoginSocialData])) {
        throw new Error(`Dado obrigatório '${campo.campo}' não recebido do provedor social.`);
      }
    }
    try {
      const resultado = await infraProviderAutenticacao.lidarComLoginSocial(dadosLogin);
      return { sucesso: true, dados: resultado };
    } catch (error: any) {
      throw error;
    }
  }

  async buscarUsuarioPorId(id: string): Promise<any> {
    try {
      const response = await infraProviderUsuario.get(`/api/v1/users/${id}`);
      return { sucesso: true, dados: response.data };
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao buscar usuário." };
    }
  }

  async buscarUsuarioPorEmail(email: string): Promise<any> {
    try {
      // Assumindo um endpoint que busca por query param. Ex: /api/v1/users?email=test@test.com
      const response = await infraProviderUsuario.get(`/api/v1/users?email=${email}`);
      // A API pode retornar um array, pegamos o primeiro resultado se existir.
      const usuario = response.data && response.data.length > 0 ? response.data[0] : null;
      return { sucesso: true, dados: usuario };
    } catch (error: any) {
      // Se a API retornar 404, tratamos como sucesso na operação, mas sem dados.
      if (error.response && error.response.status === 404) {
          return { sucesso: true, dados: null };
      }
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao buscar usuário por e-mail." };
    }
  }

  async criarUsuario(dadosUsuario: any): Promise<any> {
    try {
      const response = await infraProviderUsuario.post('/api/v1/users', dadosUsuario);
      // O `criarUsuario` do infra.provider.usuario já retorna o formato { sucesso, usuarioId, mensagem }
      return response;
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao criar usuário." };
    }
  }
}

export const DadosProvider = new C_DadosProvider();
