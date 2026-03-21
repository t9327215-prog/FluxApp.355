
import ClienteBackend from '../../Cliente.Backend.js';
import { Group } from '../../../types/Saida/Types.Estrutura.Grupos';

/**
 * @file API para gerenciar a obtenção de listas de grupos, utilizando o cliente backend centralizado.
 */
class ApiServicoGestaoListaGrupo {

  /**
   * Busca a lista de grupos públicos.
   * @returns Uma promessa que resolve para a lista de grupos públicos.
   */
  async obterGruposPublicos(): Promise<Group[]> {
    try {
      // Utiliza o cliente backend para a requisição GET.
      const response = await ClienteBackend.get('/groups');
      // Axios coloca a resposta de dados em `data`
      return response.data;
    } catch (error) {
      // O interceptor do ClienteBackend já faz o log do erro.
      // Apenas retornamos um array vazio para a UI não quebrar.
      console.error("ApiServicoGestaoListaGrupo: Erro ao buscar grupos públicos:", error);
      return [];
    }
  }

  /**
   * Busca a lista de grupos pertencentes ao usuário logado.
   * @returns Uma promessa que resolve para uma lista de grupos do usuário.
   */
  async obterMeusGrupos(): Promise<Group[]> {
    try {
      const response = await ClienteBackend.get('/groups/mine');
      return response.data;
    } catch (error) {
      console.error("ApiServicoGestaoListaGrupo: Erro ao buscar meus grupos:", error);
      return [];
    }
  }

  /**
   * Exclui um grupo específico pelo ID.
   * @param groupId O ID do grupo a ser excluído.
   */
  async excluirGrupo(groupId: string): Promise<void> {
    try {
      await ClienteBackend.delete(`/groups/${groupId}`);
      console.log(`Grupo ${groupId} excluído com sucesso.`);
    } catch (error) {
        // O interceptor já fez o log. Apenas propagamos o erro para a camada de serviço.
      console.error(`ApiServicoGestaoListaGrupo: Erro ao excluir grupo ${groupId}:`, error);
      throw error;
    }
  }
}

export const apiServicoGestaoListaGrupo = new ApiServicoGestaoListaGrupo();
