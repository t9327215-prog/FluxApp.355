
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { Usuario } from '../../../types/Usuario';
import { servicoAutenticacao } from '../ServiçoDeAutenticação/Auth.Application';
import { AuthState } from '../ServiçoDeAutenticação/Auth.Application';

const appServiceLogger = createApplicationServiceLogger('AuthApplicationService');

// --- Interfaces ---
export interface AuthApplicationState extends AuthState {}

export interface LoginEmailParams {
  email: string;
  senha?: string;
}

class AuthApplicationService {
  private state: AuthApplicationState;
  private listeners: ((state: AuthApplicationState) => void)[] = [];

  constructor() {
    this.state = servicoAutenticacao.getState();
    servicoAutenticacao.subscribe(this.handleAuthStateChange);
    appServiceLogger.logOperationStart('constructor', { initialState: this.state });
  }

  private handleAuthStateChange = (newState: AuthState) => {
    this.updateState(newState);
  };

  // --- MÉTODOS PÚBLICOS ---

  async loginComEmail(params: LoginEmailParams) {
    appServiceLogger.logOperationStart('loginComEmail', { email: params.email });
    this.updateState({ processando: true, erro: null });
    try {
      await servicoAutenticacao.login(params);
      // O estado será atualizado através do subscribe
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer login';
      appServiceLogger.logOperationError('loginComEmail', err, { email: params.email });
      this.updateState({ erro: errorMessage, processando: false });
      throw new Error(errorMessage);
    }
  }

  async logout() {
    appServiceLogger.logOperationStart('logout');
    await servicoAutenticacao.logout();
    // O estado será atualizado através do subscribe
  }

  private updateState(partialState: Partial<AuthApplicationState>) {
    this.state = { ...this.state, ...partialState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthApplicationState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthApplicationState {
    return this.state;
  }
}

export const servicoDeAplicacaoDeAutenticacao = new AuthApplicationService();
