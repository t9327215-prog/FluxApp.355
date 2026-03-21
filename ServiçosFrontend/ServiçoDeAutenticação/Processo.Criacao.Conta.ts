/**
 * @file Processo de Criação de Conta
 *
 * Este arquivo coordena o fluxo de criação de uma nova conta de usuário,
 * interagindo com a camada de API para registrar o usuário no sistema.
 */

import { Conta } from '../../../types/Saida/Types.Estrutura.Conta';
import { CriacaoContaUsuarioDTO } from '../../../types/Entrada/Types.DTO.Criacao.Conta';

/**
 * Define o resultado da operação de criação de conta.
 * - `success`: Indica se a operação foi bem-sucedida.
 * - `message`: Mensagem descritiva sobre o resultado.
 * - `data`: A conta do usuário criada (em caso de sucesso).
 */
interface ResultadoCriacaoConta {
  success: boolean;
  message: string;
  data?: Conta;
}

/**
 * Intermedia a chamada de criação de conta para a camada de API.
 * @param dadosCriacao - Objeto contendo os dados para a criação da conta (e-mail, senha, etc.).
 * @returns Uma promessa que resolve para o resultado da operação.
 */
async function criarConta(
  dadosCriacao: CriacaoContaUsuarioDTO
): Promise<ResultadoCriacaoConta> {
  try {
    // Realiza a chamada de API para o endpoint de registro no backend.
    const response = await fetch('/api/auth/criar-conta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosCriacao),
    });

    // Extrai a resposta JSON da API.
    const resultadoAPI = await response.json();

    // Verifica se a resposta da API foi bem-sucedida (status 2xx).
    if (!response.ok) {
      // Se não for bem-sucedida, lança um erro com a mensagem da API.
      throw new Error(resultadoAPI.message || 'Falha na comunicação com a API.');
    }

    // Retorna um objeto de sucesso com a conta do usuário criada.
    return {
      success: true,
      message: resultadoAPI.message || 'Conta criada com sucesso!',
      data: resultadoAPI.data, // Assumindo que a API retorna { message: string, data: Conta }
    };
  } catch (error: any) {
    // Captura erros (de rede ou lançados acima) e os retorna no formato padrão.
    return {
      success: false,
      message: error.message || 'Ocorreu um erro inesperado ao criar a conta.',
    };
  }
}

/**
 * Objeto que encapsula e exporta as funções do processo de criação de conta.
 */
export const processoCriacaoConta = {
  criarConta,
};
