
import ClienteBackend from '../../Cliente.Backend.js';
import { DadosChat } from '../../../types/Saida/Types.Estrutura.Chat';
import { ENDPOINTS_CONVERSAS } from '../../EndPoints/EndPoints.Conversas';

export const api = {
  async listarConversas(): Promise<DadosChat[]> {
    try {
      const response = await ClienteBackend.get(ENDPOINTS_CONVERSAS.LISTAR);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      return [];
    }
  },
};
