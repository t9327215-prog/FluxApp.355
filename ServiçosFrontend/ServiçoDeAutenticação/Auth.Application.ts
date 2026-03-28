
import { processoLogin, IEstadoAutenticacao, IUsuario } from './Processo.Login';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { infraProvider } from '../Infra/Infra.Provider.Usuario';
import { loginGoogle } from './Login.Google';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { buscarUsuario } from './Possibilidade.Buscar.Usuario';
import { criarUsuario } from './Possibilidade.Criar.Usuario';
import { atualizarUsuario, IAtualizacaoUsuarioParams, IResultadoAtualizacao } from './Possibilidade.Atualizar.Usuario';
import { deletarUsuario, IResultadoDelecao } from './Possibilidade.Deletar.Usuario'; // Importando a nova possibilidade

type Listener = (estado: IEstadoAutenticacao) => void;

const logger = createServiceLogger('ServicoAutenticacao');

class ServicoAutenticacao {
  private listeners: Listener[] = [];

  private notificarListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  public async login(params: { email: string, senha: string }): Promise<void> {
    // ... (código existente)
  }

  public async logout() {
    const operation = 'logout';
    logger.logOperationStart(operation);
    processoLogin.limparEstado();
    this.notificarListeners();
    logger.logOperationSuccess(operation);
  }

  public async registrar(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    // ... (código existente)
  }

  public async completarPerfil(dadosPerfil: Partial<IUsuario>): Promise<IResultadoAtualizacao> {
    // ... (código existente)
  }

  // --- NOVO MÉTODO PARA DELETAR A PRÓPRIA CONTA ---
  public async deletarMinhaConta(): Promise<IResultadoDelecao> {
    const operation = 'deletarMinhaConta';
    logger.logOperationStart(operation);
    const estadoAtual = this.getState();

    if (!estadoAtual.autenticado || !estadoAtual.usuario) {
      const errorMsg = "Usuário não autenticado.";
      logger.logOperationError(operation, new Error(errorMsg));
      return { sucesso: false, mensagem: errorMsg };
    }

    const idParaDeletar = estadoAtual.usuario.id;

    // 1. Delega a lógica de deleção para a "possibilidade" correspondente.
    const resultado = await deletarUsuario(idParaDeletar, infraProvider);

    // 2. Orquestra a próxima ação: se a deleção foi bem-sucedida, faz o logout.
    if (resultado.sucesso) {
      logger.logInfo('Usuário deletado com sucesso. Realizando logout.', { userId: idParaDeletar });
      await this.logout();
    } else {
      logger.logOperationError(operation, new Error(resultado.mensagem), { userId: idParaDeletar });
    }

    return resultado;
  }


  public iniciarLoginComGoogle(): void {
    // ... (código existente)
  }

  public async finalizarLoginComGoogle(code: string): Promise<void> {
    // ... (código existente)
  }

  public async buscarUsuarioPorId(id: string): Promise<IUsuario> {
    return buscarUsuario(id, infraProvider);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): IEstadoAutenticacao {
    return processoLogin.obterEstadoAtual();
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();

export type { IEstadoAutenticacao as AuthState };
export type { IRegistroParams, IResultadoRegistro };
export type { IAtualizacaoUsuarioParams as CompletarPerfilParams, IResultadoAtualizacao as ResultadoCompletarPerfil };
export type { IResultadoDelecao };
