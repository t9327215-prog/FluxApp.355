import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { IUsuarioDto, mapearBackendParaFrontend } from '../Contratos/Contrato.Comunicacao.Usuario';
import { dadosProviderSessao } from '../Infra/Dados.Provider.Sessao';
import { dadosProviderUsuario } from '../Infra/Dados.Provider.Usuario';
import { loginGoogle, IUsuarioSocial } from './Login.Google';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

export interface IEstadoAutenticacao {
  autenticado: boolean;
  usuario: IUsuarioDto | null;
  token: string | null;
}

type Listener = (estado: IEstadoAutenticacao) => void;

const logger = createServiceLogger('ServicoAutenticacao');

class ServicoAutenticacao {
  private listeners: Listener[] = [];
  private estado: IEstadoAutenticacao;

  constructor() {
    this.estado = {
      autenticado: false,
      usuario: null,
      token: null,
    };
    logger.logInfo("Serviço de Autenticação inicializado.");
  }

  private notificarListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  public async login(params: { email: string, senha: string }): Promise<void> {
    const operation = 'login';
    logger.logOperationStart(operation, { email: params.email });
    try {
        const result = await dadosProviderSessao.login(params.email, params.senha);
        if (result.sucesso && result.usuario && result.token) {
            this.estado = {
                autenticado: true,
                usuario: mapearBackendParaFrontend(result.usuario),
                token: result.token
            };
            this.notificarListeners();
            logger.logOperationSuccess(operation, { userId: result.usuario.id || result.usuario.id });
        } else {
            throw new Error(result.mensagem || 'Falha no login');
        }
    } catch (error) {
        logger.logOperationError(operation, error as Error, { email: params.email });
        this.estado = { autenticado: false, usuario: null, token: null };
        this.notificarListeners();
        throw error;
    }
}

  public async logout() {
    const operation = 'logout';
    logger.logOperationStart(operation);
    this.estado = { autenticado: false, usuario: null, token: null };
    this.notificarListeners();
    logger.logOperationSuccess(operation);
  }

  public async criarConta(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    const operation = 'criarConta';
    logger.logOperationStart(operation, { email: dadosRegistro.email });
    try {
        const resultado = await dadosProviderSessao.criarUsuario(dadosRegistro);
        if(resultado.sucesso) {
            logger.logOperationSuccess(operation, { userId: resultado.usuarioId });
            // Se o registro retornar o usuário e token, já autenticamos
            if (resultado.usuario && resultado.token) {
                this.estado = {
                    autenticado: true,
                    usuario: mapearBackendParaFrontend(resultado.usuario),
                    token: resultado.token
                };
                this.notificarListeners();
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

  public async completarPerfil(dadosPerfil: Partial<IUsuarioDto>): Promise<void> {
    const operation = 'completarPerfil';
    logger.logOperationStart(operation);

    if (!this.estado.autenticado || !this.estado.usuario) {
      logger.logOperationError(operation, new Error("Usuário não autenticado para completar o perfil."));
      throw new Error("Usuário não autenticado.");
    }

    try {
      const dadosCompletos = { ...dadosPerfil, id: this.estado.usuario!.id };

      const resultado = await dadosProviderUsuario.completarPerfil(dadosCompletos);

      if (resultado.sucesso && resultado.usuarioAtualizado) {
        this.estado = {
          ...this.estado,
          usuario: mapearBackendParaFrontend(resultado.usuarioAtualizado),
        };
        this.notificarListeners();
        logger.logOperationSuccess(operation, { userId: this.estado.usuario!.id });
      } else {
        throw new Error(resultado.mensagem || 'Falha ao completar o perfil no provedor de dados.');
      }
    } catch (error) {
      logger.logOperationError(operation, error as Error);
      throw error;
    }
  }

  public async deletarMinhaConta(): Promise<any> {
    // ... implementation
  }

  public iniciarLoginComGoogle(): void {
    loginGoogle.iniciarLogin();
  }

  public async finalizarLoginComGoogle(idToken: string): Promise<string> {
    const operation = 'finalizarLoginComGoogle';
    logger.logOperationStart(operation);
    try {
      const dadosUsuarioSocial: IUsuarioSocial = await loginGoogle.processarCallback(idToken);
      
      const resultado = await dadosProviderSessao.lidarComLoginSocial({
        ...dadosUsuarioSocial,
        tokenProvider: idToken,
      });

      if (resultado && resultado.sucesso && resultado.dados && resultado.dados.user && resultado.dados.token) {
        this.estado = {
          autenticado: true,
          usuario: mapearBackendParaFrontend(resultado.dados.user),
          token: resultado.dados.token,
        };
        this.notificarListeners();
        logger.logOperationSuccess(operation, { userId: resultado.dados.user.id });
        
        return resultado.dados.redirect || "Feed";
      } else {
        throw new Error('A resposta do backend para o login social foi inválida.');
      }

    } catch (error) {
      logger.logOperationError(operation, error as Error);
      this.estado = { autenticado: false, usuario: null, token: null };
      this.notificarListeners();
      throw error;
    }
  }

  public async buscarUsuarioPorId(id: string): Promise<IUsuarioDto | null> {
    try {
        const response = await dadosProviderUsuario.buscarUsuarioPorId(id);
        return response.sucesso ? mapearBackendParaFrontend(response.dados) : null;
    } catch (error) {
        logger.logOperationError('buscarUsuarioPorId', error as Error, { userId: id });
        return null;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): IEstadoAutenticacao {
    return this.estado;
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
