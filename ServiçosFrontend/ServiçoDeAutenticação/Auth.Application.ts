
import { processoLogin, IEstadoAutenticacao, IUsuario } from './Processo.Login';
import { IPerfilParaCompletar, IResultadoCompletarPerfil } from './Processo.Completar.Perfil';
import { IRegistroParams, IResultadoRegistro } from './Processo.Registrar';
import { AutenticacaoAPI } from '../APIs/Autenticacao.API';

type Listener = (estado: IEstadoAutenticacao) => void;

class ServicoAutenticacao {
  private listeners: Listener[] = [];

  private notificarListeners() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  // ... Métodos de login e logout (já refatorados) ...
  public async login(params: { email: string, senha: string }): Promise<void> {
    try {
      const respostaAPI = await AutenticacaoAPI.loginComEmail(params);
      const usuario: IUsuario = {
        id: respostaAPI.usuario.id,
        nome: respostaAPI.usuario.apelido, 
        email: respostaAPI.usuario.email
      };
      processoLogin.definirEstadoAutenticado(usuario, respostaAPI.token);
    } catch (error) {
      console.error("APPLICATION: Falha no login.", error);
      processoLogin.limparEstado();
    }
    this.notificarListeners();
  }

  public async logout() {
    processoLogin.limparEstado();
    this.notificarListeners();
  }

  /**
   * Orquestra o registro de um novo usuário.
   * 1. Valida os dados.
   * 2. Chama a API de registro.
   * 3. Se sucesso, chama o método de login para criar a sessão.
   */
  public async registrar(dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> {
    console.log("APPLICATION: Iniciando fluxo de registro.");

    // 1. Etapa de Validação
    if (dadosRegistro.senha !== dadosRegistro.confirmacaoSenha) {
      return { sucesso: false, mensagem: "As senhas não conferem." };
    }
    if (dadosRegistro.senha.length < 8) {
      return { sucesso: false, mensagem: "A senha deve ter pelo menos 8 caracteres." };
    }

    try {
      // 2. Etapa de Comunicação com a API
      const respostaAPI = await AutenticacaoAPI.registrar(dadosRegistro);

      // 3. Etapa de Pós-Registro (Login Automático)
      console.log("APPLICATION: Registro bem-sucedido. Realizando login automático.");
      await this.login({ email: dadosRegistro.email, senha: dadosRegistro.senha });

      return { sucesso: true, mensagem: "Registro bem-sucedido!", usuario: respostaAPI.usuario };

    } catch (error: any) {
      console.error("APPLICATION: Falha no registro.", error);
      return { sucesso: false, mensagem: error.message || "Ocorreu um erro no registro." };
    }
  }

  /**
   * Orquestra a lógica de completar o perfil.
   * 1. Chama a API para salvar os dados do perfil.
   * 2. Se sucesso, atualiza o estado local do usuário.
   */
  public async completarPerfil(dadosPerfil: IPerfilParaCompletar): Promise<IResultadoCompletarPerfil> {
    console.log("APPLICATION: Iniciando fluxo de completar perfil.");
    const estadoAtual = this.getState();
    if (!estadoAtual.autenticado || !estadoAtual.usuario) {
      return { sucesso: false, mensagem: "Usuário não autenticado." };
    }

    try {
      const usuarioId = estadoAtual.usuario.id;
      const usuarioAtualizado = await AutenticacaoAPI.completarPerfil(usuarioId, dadosPerfil);

      // Atualiza o estado local com os novos dados do usuário
      const novoEstadoUsuario: IUsuario = {
        ...estadoAtual.usuario,
        nome: usuarioAtualizado.apelido, // Atualiza o nome local para o novo apelido
      };

      processoLogin.definirEstadoAutenticado(novoEstadoUsuario, estadoAtual.token || '');
      this.notificarListeners();

      return { sucesso: true, mensagem: "Perfil atualizado com sucesso!", usuarioAtualizado };

    } catch (error: any) {
      console.error("APPLICATION: Falha ao completar o perfil.", error);
      return { sucesso: false, mensagem: error.message || "Ocorreu um erro ao atualizar o perfil." };
    }
  }

  // ... Métodos de subscribe, getState ...
  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    listener(this.getState()); // Envia estado inicial ao novo listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getState(): IEstadoAutenticacao {
    return processoLogin.obterEstadoAtual();
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();

// Re-exporta os tipos para uso fácil na UI.
export type { IEstadoAutenticacao as AuthState };
export type { IPerfilParaCompletar, IResultadoCompletarPerfil };
export type { IRegistroParams, IResultadoRegistro };
