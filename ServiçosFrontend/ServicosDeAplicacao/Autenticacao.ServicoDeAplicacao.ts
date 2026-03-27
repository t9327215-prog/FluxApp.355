
import { AuthProvider, AuthState, ILoginEmailParams } from '../Infra/Providers/Auth.provider';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';

const appServiceLogger = createApplicationServiceLogger('AuthApplicationService');

// O estado da aplicação agora estende o AuthState, que é importado do provider.
export interface AuthApplicationState extends AuthState {
  postLoginAction?: 'navigateToFeed' | 'navigateToCompleteProfile';
}

class AuthApplicationService {
  private state: AuthApplicationState;
  private listeners: ((state: AuthApplicationState) => void)[] = [];

  constructor() {
    // Inicializa o estado usando o provider e se inscreve para futuras atualizações
    this.state = AuthProvider.getState();
    AuthProvider.subscribe(this.handleAuthChange.bind(this));

    appServiceLogger.logOperationStart('constructor', { initialState: this.state });
  }

  private handleAuthChange(newAuthState: AuthState) {
    const wasJustAuthenticated = !this.state.isAuthenticated && newAuthState.isAuthenticated;
    let postLoginAction: AuthApplicationState['postLoginAction'] | undefined = undefined;

    appServiceLogger.logOperationSuccess('handleAuthChange', {
      wasJustAuthenticated,
      previous: this.state.isAuthenticated,
      current: newAuthState.isAuthenticated,
      newUserId: newAuthState.user?.id
    });

    // LÓGICA DE NEGÓCIO: A principal responsabilidade da camada de aplicação.
    if (wasJustAuthenticated) {
      // Decide a rota de pós-login com base no perfil do usuário.
      postLoginAction = newAuthState.isNewUser ? 'navigateToCompleteProfile' : 'navigateToFeed';
      appServiceLogger.logOperationSuccess('postLoginDecision', { userId: newAuthState.user?.id, action: postLoginAction });
    }
    
    this.updateState({ ...newAuthState, postLoginAction });
  }

  private updateState(newState: AuthApplicationState) {
    this.state = newState;
    this.listeners.forEach(listener => listener(this.state));
    
    // Ação pós-notificação: Limpa a ação para evitar execuções repetidas.
    if (this.state.postLoginAction) {
      this.state.postLoginAction = undefined;
    }
  }

  // --- MÉTODOS PÚBLICOS (A API da camada de aplicação) ---

  async loginComEmail(params: ILoginEmailParams) {
    const { email } = params;
    appServiceLogger.logOperationStart('loginComEmail', { email });
    try {
      // Delega a chamada para o provider, abstraindo a implementação.
      await AuthProvider.loginComEmail(params);
      // A lógica de sucesso e roteamento é tratada de forma reativa no `handleAuthChange`.
    } catch (err: any) {
      appServiceLogger.logOperationError('loginComEmail', err, { email });
      throw err; // Re-lança para que a UI possa reagir ao erro (ex: mostrar uma mensagem).
    }
  }

  iniciarLoginComGoogle() {
    appServiceLogger.logOperationStart('iniciarLoginComGoogle');
    try {
        // Delega para o provider.
        AuthProvider.iniciarLoginComGoogle();
        appServiceLogger.logOperationSuccess('iniciarLoginComGoogle', { message: 'Redirecionamento iniciado via provider.' });
    } catch (err: any) {
        appServiceLogger.logOperationError('iniciarLoginComGoogle', err);
        throw err;
    }
  }

  async logout() {
    appServiceLogger.logOperationStart('logout');
    try {
      // Delega para o provider.
      await AuthProvider.logout();
      appServiceLogger.logOperationSuccess('logout', { message: 'Logout bem-sucedido via provider.' });
    } catch (err: any) {
      appServiceLogger.logOperationError('logout', err);
      throw err;
    }
  }

  // --- MÉTODOS DE OBSERVAÇÃO (Para Hooks da UI) ---

  subscribe(listener: (state: AuthApplicationState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state); // Notifica imediatamente com o estado atual.
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthApplicationState {
    return this.state;
  }
}

// Exporta uma instância única do serviço de aplicação.
export const servicoDeAplicacaoDeAutenticacao = new AuthApplicationService();
