import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { authService } from '../Auth/AuthService';
import { authStateManager } from '../Estados/Manager.Estado.Autenticacao';
import { ILoginParams } from '../Auth/types';

const appServiceLogger = createApplicationServiceLogger('AuthApplicationService');

class AuthApplicationService {
  constructor() {
    authService.subscribe((serviceState) => {
      authStateManager.setState({
        autenticado: serviceState.autenticado,
        usuario: serviceState.usuario,
        token: serviceState.token,
      });
    });
  }

  async loginComEmail(params: ILoginParams): Promise<void> {
    appServiceLogger.logOperationStart('loginComEmail', { email: params.email });
    authStateManager.setState({ processando: true, erro: null });

    try {
      await authService.loginWithEmail(params.email, params.senha);
      authStateManager.setState({ processando: false });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login';
      appServiceLogger.logOperationError('loginComEmail', err as Error, { email: params.email });
      authStateManager.setState({ erro: errorMessage, processando: false });
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    appServiceLogger.logOperationStart('logout');
    await authService.logout();
  }

  iniciarLoginComGoogle(): void {
    appServiceLogger.logOperationStart('iniciarLoginComGoogle');
    authStateManager.setState({ processando: true, erro: null });
    authService.iniciarLoginGoogle();
  }

  async finalizarLoginComGoogle(idToken: string): Promise<string> {
    appServiceLogger.logOperationStart('finalizarLoginComGoogle');
    authStateManager.setState({ processando: true, erro: null });

    try {
      const redirect = await authService.finalizarLoginGoogle(idToken);
      authStateManager.setState({ processando: false });
      return redirect;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar login';
      appServiceLogger.logOperationError('finalizarLoginComGoogle', err as Error);
      authStateManager.setState({ erro: errorMessage, processando: false });
      throw new Error(errorMessage);
    }
  }
}

export const servicoDeAplicacaoDeAutenticacao = new AuthApplicationService();
