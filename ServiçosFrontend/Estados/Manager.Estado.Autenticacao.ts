
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';

const logger = createApplicationServiceLogger('AuthStateManager');

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  apelido?: string;
  urlFoto?: string;
  perfilCompleto: boolean;
  bio?: string;
  site?: string;
  privado?: boolean;
}

export interface IAuthState {
  autenticado: boolean;
  processando: boolean;
  erro: string | null;
  usuario: Usuario | null;
  user: Usuario | null;
}

class AuthStateManager {
  private state: IAuthState = {
    autenticado: false,
    processando: false,
    erro: null,
    usuario: null,
    user: null,
  };

  private listeners: ((state: IAuthState) => void)[] = [];

  constructor() {
    this.carregarEstadoDoStorage();
  }

  private carregarEstadoDoStorage() {
    try {
      const token = localStorage.getItem('userToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        const usuario = JSON.parse(userData) as Usuario;
        this.state = {
          ...this.state,
          autenticado: true,
          usuario,
          user: usuario,
        };
        logger.logInfo('Estado de autenticação carregado do storage', { userId: usuario.id });
      }
    } catch (error) {
      logger.logWarn('Erro ao carregar estado do storage', { error });
      this.limparEstado();
    }
  }

  private atualizarState(novoState: Partial<IAuthState>) {
    this.state = { ...this.state, ...novoState, user: novoState.usuario ?? this.state.usuario };
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): IAuthState {
    return { ...this.state, user: this.state.usuario };
  }

  subscribe(listener: (state: IAuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setProcessando(processando: boolean) {
    this.atualizarState({ processando });
  }

  setErro(erro: string | null) {
    this.atualizarState({ erro });
  }

  setUsuario(usuario: Usuario | null) {
    this.atualizarState({ usuario });
    if (usuario) {
      localStorage.setItem('userData', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('userData');
    }
  }

  setAutenticado(autenticado: boolean) {
    this.atualizarState({ autenticado });
  }

  setToken(token: string) {
    if (token) {
      localStorage.setItem('userToken', token);
    } else {
      localStorage.removeItem('userToken');
    }
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  getCurrentUser(): Usuario | null {
    return this.state.usuario;
  }

  getCurrentUserId(): string | null {
    return this.state.usuario?.id || null;
  }

  getCurrentUserEmail(): string | null {
    return this.state.usuario?.email || null;
  }

  loginSucesso(usuario: Usuario, token: string) {
    this.setToken(token);
    this.setUsuario(usuario);
    this.atualizarState({
      autenticado: true,
      processando: false,
      erro: null,
      usuario,
      user: usuario,
    });
    logger.logInfo('Login realizado com sucesso', { userId: usuario.id });
  }

  atualizarPerfil(usuarioAtualizado: Partial<Usuario>) {
    if (this.state.usuario) {
      const novoUsuario = { ...this.state.usuario, ...usuarioAtualizado };
      this.setUsuario(novoUsuario);
      logger.logInfo('Perfil atualizado', { userId: novoUsuario.id });
    }
  }

  logout() {
    this.limparEstado();
    logger.logInfo('Logout realizado');
  }

  private limparEstado() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    this.atualizarState({
      autenticado: false,
      processando: false,
      erro: null,
      usuario: null,
      user: null,
    });
  }
}

export const authStateManager = new AuthStateManager();

export const servicoAutenticacao = {
  getState: () => authStateManager.getState(),
  subscribe: (listener: (state: IAuthState) => void) => authStateManager.subscribe(listener),
  getToken: () => authStateManager.getToken(),
  getCurrentUser: () => authStateManager.getCurrentUser(),
  getCurrentUserId: () => authStateManager.getCurrentUserId(),
  getCurrentUserEmail: () => authStateManager.getCurrentUserEmail(),
  completeProfile: async (data: any) => {
    logger.logInfo('completeProfile chamado', data);
    authStateManager.atualizarPerfil(data);
  },
  logout: () => authStateManager.logout(),
};

export const getInstanciaSuprema = () => {
  return {
    getState: () => authStateManager.getState(),
    subscribe: (listener: (state: IAuthState) => void) => authStateManager.subscribe(listener),
  };
};
