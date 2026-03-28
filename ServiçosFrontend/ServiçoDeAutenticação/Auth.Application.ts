
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { DadosProvider } from '../Infra/DadosProvider';
import { loginGoogle, IUsuarioSocial } from './Login.Google';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

export interface IUsuario {
    id: string;
    nome: string;
    nickname: string;
    email: string;
    avatarUrl?: string;
    website?: string;
    bio?: string;
    perfilCompleto: boolean;
    googleId?: string;
  }
  
  export interface IEstadoAutenticacao {
    autenticado: boolean;
    usuario: IUsuario | null;
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
    logger.logOperationStart(operation, params.email);
    try {
        const result = await DadosProvider.login(params.email, params.senha);
        if (result.sucesso && result.usuario && result.token) {
            this.estado = {
                autenticado: true,
                usuario: result.usuario,
                token: result.token
            };
            this.notificarListeners();
            logger.logOperationSuccess(operation, { userId: result.usuario.id });
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

  public async registrar(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    const operation = 'registrar';
    logger.logOperationStart(operation, { email: dadosRegistro.email });
    try {
        const resultado = await DadosProvider.criarUsuario(dadosRegistro);
        if(resultado.sucesso) {
            logger.logOperationSuccess(operation, { userId: resultado.usuarioId });
        } else {
            logger.logOperationError(operation, new Error(resultado.mensagem));
        }
        return resultado;
    } catch (error) {
        logger.logOperationError(operation, error as Error);
        throw error;
    }
  }

  public async completarPerfil(dadosPerfil: Partial<IUsuario>): Promise<any> {
    // ... implementation
  }

  public async deletarMinhaConta(): Promise<any> {
    // ... implementation
  }

  public iniciarLoginComGoogle(): void {
    loginGoogle.iniciarLogin();
  }

  public async finalizarLoginComGoogle(idToken: string): Promise<void> {
    const operation = 'finalizarLoginComGoogle';
    logger.logOperationStart(operation);
    try {
      const dadosUsuarioSocial: IUsuarioSocial = await loginGoogle.processarCallback(idToken);
      
      let response = await DadosProvider.buscarUsuarioPorEmail(dadosUsuarioSocial.email);
      let usuario = response.dados;

      if (!usuario) {
        const novoUsuario = {
            nome: dadosUsuarioSocial.nome,
            email: dadosUsuarioSocial.email,
            senha: Math.random().toString(36).slice(-8),
            aceitouTermos: true,
        };
        const resultadoRegistro = await DadosProvider.criarUsuario(novoUsuario);
        if(!resultadoRegistro.sucesso) {
            throw new Error(resultadoRegistro.mensagem);
        }
        response = await DadosProvider.buscarUsuarioPorEmail(dadosUsuarioSocial.email);
        usuario = response.dados;
        if(!usuario) {
            throw new Error('Falha ao buscar usuário recém-criado.');
        }
      }

      this.estado = {
        autenticado: true,
        usuario: { ...usuario, perfilCompleto: !!usuario.perfilCompleto },
        token: idToken,
      };

      this.notificarListeners();
      logger.logOperationSuccess(operation, { userId: usuario.id });

    } catch (error) {
      logger.logOperationError(operation, error as Error);
      this.estado = { autenticado: false, usuario: null, token: null };
      this.notificarListeners();
      throw error
    }
  }

  public async buscarUsuarioPorId(id: string): Promise<IUsuario | null> {
    try {
        const response = await DadosProvider.buscarUsuarioPorId(id);
        return response.sucesso ? response.dados : null;
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
