import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { dadosProviderSessao } from '../Infra/Dados.Provider.Sessao';
import { dadosProviderUsuario } from '../Infra/Dados.Provider.Usuario';
import { mapearBackendParaFrontend, IUsuarioDto } from '../Contratos/Contrato.Comunicacao.Usuario';
import { IRegistroParams, IResultadoRegistro } from '../ServiçoDeAutenticação/Processo.Registrar';
import { IAuthState, ISocialLoginParams, AuthListener } from './types';
import { GoogleOAuth } from './GoogleOAuth';

const logger = createServiceLogger('AuthService');

class AuthService {
  private listeners: AuthListener[] = [];
  private state: IAuthState = {
    autenticado: false,
    usuario: null,
    token: null,
    processando: false,
    erro: null,
  };

  constructor() {
    logger.logInfo('AuthService inicializado');
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState(): IAuthState {
    return this.state;
  }

  private setState(partial: Partial<IAuthState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  async loginWithEmail(email: string, senha: string): Promise<void> {
    const operation = 'loginWithEmail';
    logger.logOperationStart(operation, { email });

    try {
      const result = await dadosProviderSessao.login(email, senha);
      if (result.sucesso && result.usuario && result.token) {
        this.setState({
          autenticado: true,
          usuario: mapearBackendParaFrontend(result.usuario),
          token: result.token,
          processando: false,
          erro: null,
        });
        logger.logOperationSuccess(operation, { userId: result.usuario.id });
      } else {
        throw new Error(result.mensagem || 'Falha no login');
      }
    } catch (error) {
      logger.logOperationError(operation, error as Error, { email });
      this.setState({ processando: false, erro: (error as Error).message });
      throw error;
    }
  }

  async logout(): Promise<void> {
    logger.logOperationStart('logout');
    this.setState({
      autenticado: false,
      usuario: null,
      token: null,
      processando: false,
      erro: null,
    });
    logger.logOperationSuccess('logout');
  }

  async criarConta(dados: IRegistroParams): Promise<IResultadoRegistro> {
    const operation = 'criarConta';
    logger.logOperationStart(operation, { email: dados.email });

    try {
      const resultado = await dadosProviderSessao.criarUsuario(dados);
      if (resultado.sucesso) {
        logger.logOperationSuccess(operation, { userId: resultado.usuarioId });
        if (resultado.usuario && resultado.token) {
          this.setState({
            autenticado: true,
            usuario: mapearBackendParaFrontend(resultado.usuario),
            token: resultado.token,
          });
        }
      } else {
        logger.logOperationError(operation, new Error(resultado.mensagem));
      }
      return resultado;
    } catch (error) {
      logger.logOperationError(operation, error as Error);
      throw error;
    }
  }

  async completarPerfil(dadosPerfil: Partial<IUsuarioDto>): Promise<void> {
    const operation = 'completarPerfil';
    logger.logOperationStart(operation);

    if (!this.state.autenticado || !this.state.usuario) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const resultado = await dadosProviderUsuario.completarPerfil({
        ...dadosPerfil,
        id: this.state.usuario.id,
      });

      if (resultado.sucesso && resultado.usuarioAtualizado) {
        this.setState({
          usuario: mapearBackendParaFrontend(resultado.usuarioAtualizado),
        });
        logger.logOperationSuccess(operation, { userId: this.state.usuario.id });
      } else {
        throw new Error(resultado.mensagem);
      }
    } catch (error) {
      logger.logOperationError(operation, error as Error);
      throw error;
    }
  }

  iniciarLoginGoogle(): void {
    GoogleOAuth.iniciar();
  }

  async finalizarLoginGoogle(idToken: string): Promise<string> {
    const operation = 'finalizarLoginGoogle';
    logger.logOperationStart(operation);

    try {
      const usuarioSocial = GoogleOAuth.processarCallback(idToken);

      const dadosBackend: ISocialLoginParams = {
        ...usuarioSocial,
        tokenProvider: idToken,
      };

      const resultado = await dadosProviderSessao.lidarComLoginSocial(dadosBackend);

      if (resultado.sucesso && resultado.dados?.user && resultado.dados?.token) {
        this.setState({
          autenticado: true,
          usuario: mapearBackendParaFrontend(resultado.dados.user),
          token: resultado.dados.token,
          processando: false,
          erro: null,
        });
        logger.logOperationSuccess(operation, { userId: resultado.dados.user.id });
        return resultado.dados.redirect || 'Feed';
      }

      throw new Error('Resposta inválida do backend');
    } catch (error) {
      logger.logOperationError(operation, error as Error);
      this.setState({ processando: false, erro: (error as Error).message });
      throw error;
    }
  }

  async buscarUsuarioPorId(id: string): Promise<IUsuarioDto | null> {
    try {
      const response = await dadosProviderUsuario.buscarUsuarioPorId(id);
      return response.sucesso ? mapearBackendParaFrontend(response.dados) : null;
    } catch (error) {
      logger.logOperationError('buscarUsuarioPorId', error as Error, { userId: id });
      return null;
    }
  }
}

export const authService = new AuthService();
