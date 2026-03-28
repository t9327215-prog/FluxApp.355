
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { Usuario } from '../../../types/Usuario';
import { servicoAutenticacao, AuthState, LoginEmailParams } from '../ServiçoDeAutenticação/Auth.Application';
import { LoginUseCase } from '../UseCases/Login.usecase';
import { LogoutUseCase } from '../UseCases/Logout.usecase';
import { IniciarLoginComGoogleUseCase } from '../UseCases/IniciarLoginComGoogle.usecase';
import { FinalizarLoginComGoogleUseCase } from '../UseCases/FinalizarLoginComGoogle.usecase';

const appServiceLogger = createApplicationServiceLogger('AuthApplicationService');

export interface AuthApplicationState extends AuthState {}

class AuthApplicationService {
  private state: AuthApplicationState;
  private listeners: ((state: AuthApplicationState) => void)[] = [];

  // Casos de Uso
  private loginUseCase: LoginUseCase;
  private logoutUseCase: LogoutUseCase;
  private iniciarLoginComGoogleUseCase: IniciarLoginComGoogleUseCase;
  private finalizarLoginComGoogleUseCase: FinalizarLoginComGoogleUseCase;

  constructor() {
    this.state = servicoAutenticacao.getState();
    servicoAutenticacao.subscribe(this.handleAuthStateChange);
    
    // Injeção de dependência dos Casos de Uso
    this.loginUseCase = new LoginUseCase(servicoAutenticacao);
    this.logoutUseCase = new LogoutUseCase(servicoAutenticacao);
    this.iniciarLoginComGoogleUseCase = new IniciarLoginComGoogleUseCase(servicoAutenticacao);
    this.finalizarLoginComGoogleUseCase = new FinalizarLoginComGoogleUseCase(servicoAutenticacao);

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
      await this.loginUseCase.execute(params);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer login';
      appServiceLogger.logOperationError('loginComEmail', err, { email: params.email });
      this.updateState({ erro: errorMessage, processando: false });
      throw new Error(errorMessage);
    }
  }

  async logout() {
    appServiceLogger.logOperationStart('logout');
    await this.logoutUseCase.execute();
  }

  async iniciarLoginComGoogle() {
    appServiceLogger.logOperationStart('iniciarLoginComGoogle');
    this.updateState({ processando: true, erro: null });
    try {
      await this.iniciarLoginComGoogleUseCase.execute();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao iniciar login com Google';
      appServiceLogger.logOperationError('iniciarLoginComGoogle', err);
      this.updateState({ erro: errorMessage, processando: false });
    }
  }

  async finalizarLoginComGoogle(idToken: string) {
    appServiceLogger.logOperationStart('finalizarLoginComGoogle');
    this.updateState({ processando: true, erro: null });
    try {
      await this.finalizarLoginComGoogleUseCase.execute(idToken);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao finalizar login com Google';
      appServiceLogger.logOperationError('finalizarLoginComGoogle', err);
      this.updateState({ erro: errorMessage, processando: false });
    }
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
