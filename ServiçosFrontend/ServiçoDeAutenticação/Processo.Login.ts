
import { loginGoogle, IUsuarioSocial } from './Login.Google';

// A interface para o objeto de usuário que será mantido no estado.
export interface IUsuario {
  id: string;
  nome: string;
  email: string;
}

// A interface para a forma completa do estado de autenticação.
export interface IEstadoAutenticacao {
  autenticado: boolean;
  usuario: IUsuario | null;
  token: string | null;
}

/**
 * Processo.Login.ts (Refatorado para Gerenciador de Estado)
 * 
 * Responsabilidade: Manter o estado de autenticação e fornecer métodos para 
 * atualizá-lo e lê-lo. Não possui mais lógica de negócio ou chamadas de API.
 */
class ProcessoLoginGerenciadorEstado {
  private estado: IEstadoAutenticacao;

  constructor() {
    this.estado = {
      autenticado: false,
      usuario: null,
      token: null,
    };
    console.log("Gerenciador de Estado de Login instanciado.");
  }

  /**
   * Retorna o estado de autenticação atual.
   */
  public obterEstadoAtual(): IEstadoAutenticacao {
    return this.estado;
  }

  /**
   * Atualiza o estado para um estado autenticado.
   * Este método é chamado pela camada de Aplicação após uma chamada de API bem-sucedida.
   */
  public definirEstadoAutenticado(usuario: IUsuario, token: string): void {
    console.log(`Gerenciador de Estado: Definindo estado para o usuário ${usuario.email}.`);
    this.estado = {
      autenticado: true,
      usuario: usuario,
      token: token,
    };
  }

  /**
   * Limpa o estado de autenticação, revertendo-o para o estado inicial.
   */
  public limparEstado(): void {
    console.log("Gerenciador de Estado: Limpando estado de autenticação.");
    this.estado = {
      autenticado: false,
      usuario: null,
      token: null,
    };
  }
  
  // A inicialização e o fluxo do Google podem ser refatorados da mesma forma posteriormente.
  public async inicializar(): Promise<void> {}
  public iniciarLoginComGoogle(): void {
    loginGoogle.iniciarLogin();
  }
  public async finalizarLoginComGoogle(codigo: string): Promise<void> {}
}

export const processoLogin = new ProcessoLoginGerenciadorEstado();
