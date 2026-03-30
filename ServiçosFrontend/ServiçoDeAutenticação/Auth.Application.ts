import { authService } from '../Auth/AuthService';
import { IUsuarioDto } from '../Contratos/Contrato.Comunicacao.Usuario';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';

export interface IEstadoAutenticacao {
  autenticado: boolean;
  usuario: IUsuarioDto | null;
  token: string | null;
}

type Listener = (estado: IEstadoAutenticacao) => void;

class ServicoAutenticacao {
  subscribe(listener: Listener): () => void {
    return authService.subscribe((state) => {
      listener({
        autenticado: state.autenticado,
        usuario: state.usuario,
        token: state.token,
      });
    });
  }

  getState(): IEstadoAutenticacao {
    const state = authService.getState();
    return {
      autenticado: state.autenticado,
      usuario: state.usuario,
      token: state.token,
    };
  }

  async login(params: { email: string; senha: string }): Promise<void> {
    return authService.loginWithEmail(params.email, params.senha);
  }

  async logout(): Promise<void> {
    return authService.logout();
  }

  async criarConta(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    return authService.criarConta(dadosRegistro);
  }

  async completarPerfil(dadosPerfil: Partial<IUsuarioDto>): Promise<void> {
    return authService.completarPerfil(dadosPerfil);
  }

  iniciarLoginComGoogle(): void {
    authService.iniciarLoginGoogle();
  }

  async finalizarLoginComGoogle(idToken: string): Promise<string> {
    return authService.finalizarLoginGoogle(idToken);
  }

  async buscarUsuarioPorId(id: string): Promise<IUsuarioDto | null> {
    return authService.buscarUsuarioPorId(id);
  }

  async deletarMinhaConta(): Promise<void> {
    // TODO: implementar
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();

export type { IEstadoAutenticacao as AuthState };
export type { IRegistroParams, IResultadoRegistro };

export interface LoginEmailParams {
  email: string;
  senha: string;
}

export type IAuthService = typeof servicoAutenticacao;
