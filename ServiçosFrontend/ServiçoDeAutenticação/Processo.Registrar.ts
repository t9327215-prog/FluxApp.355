
// Interface para os dados necessários para o registro de um usuário.
export interface IRegistroParams {
  email: string;
  senha: string;
  confirmacaoSenha: string;
}

// Interface para o resultado da operação de registro.
export interface IResultadoRegistro {
  sucesso: boolean;
  mensagem: string;
  usuario?: { id: string; email: string; };
}

/**
 * Processo.Registrar.ts (Refatorado)
 * 
 * Na nova arquitetura, a chamada de API e a lógica de negócio são orquestradas
 * pela camada de Aplicação. Este arquivo é mantido por consistência estrutural,
 * mas sua lógica principal foi movida.
 */
class ProcessoRegistrar {

  constructor() {
    // console.log("Processo de Registrar instanciado (sem lógica interna).");
  }

  // A função executar foi movida para a camada de Aplicação.
  // Poderíamos remover este arquivo, mas o mantemos para que a estrutura 
  // "Application -> Processo" seja visualmente consistente em todos os fluxos.
}

export const processoRegistrar = new ProcessoRegistrar();
