
// Interface para os dados que o usuário precisa fornecer para completar o perfil.
export interface IPerfilParaCompletar {
  apelido: string;
  dataNascimento?: string;
  biografia?: string;
  telefone?: string;
}

// Interface para o resultado da operação de completar o perfil.
export interface IResultadoCompletarPerfil {
  sucesso: boolean;
  mensagem: string;
  usuarioAtualizado?: any;
}

/**
 * Processo.Completar.Perfil.ts (Refatorado)
 * 
 * Na nova arquitetura, a chamada de API e a lógica são orquestradas
 * pela camada de Aplicação. Este arquivo é mantido para consistência estrutural.
 */
class ProcessoCompletarPerfil {

  constructor() {
    // console.log("Processo de Completar Perfil instanciado (sem lógica interna).");
  }

  // A função executar foi movida para a camada de Aplicação.
}

export const processoCompletarPerfil = new ProcessoCompletarPerfil();
