// Arquivo: ServiçosFrontend/APIs/APIsServicoPublicacao/API.Servico.Publicacao.Feed.ts

import backend from "../../Cliente.Backend.js";
import { PublicacaoFeed } from "../../../types/Saida/Types.Estrutura.Publicacao.Feed";

/**
 * @file API para o serviço de publicações de feed.
 * 
 * Este arquivo define a camada de comunicação direta com o backend para
 * todas as operações relacionadas às publicações do feed (posts).
 */
class ApiFeedPublicationService {
  /**
   * Busca todas as publicações do feed no backend.
   * @returns Uma promessa que resolve para um array de publicações do feed.
   */
  async getPosts(): Promise<PublicacaoFeed[]> {
    try {
      const response = await backend.get<PublicacaoFeed[]>('/feed');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar publicações do feed na API:', error);
      throw new Error('Falha ao buscar as publicações do feed.');
    }
  }

  /**
   * Busca uma única publicação do feed pelo seu ID.
   * @param postId - O ID da publicação a ser buscada.
   * @returns Uma promessa que resolve para a publicação encontrada.
   */
  async getPostById(postId: string): Promise<PublicacaoFeed> {
    try {
      const response = await backend.get<PublicacaoFeed>(`/feed/${postId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar a publicação ${postId} na API:`, error);
      throw new Error('Falha ao buscar a publicação do feed.');
    }
  }
  
  /**
   * Busca publicações do feed com base em um termo de pesquisa.
   * @param query - O termo a ser pesquisado.
   * @returns Uma promessa que resolve para um array de publicações encontradas.
   */
  async searchPosts(query: string): Promise<PublicacaoFeed[]> {
    try {
      const response = await backend.get<PublicacaoFeed[]>('/feed/search', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Erro ao pesquisar publicações na API:', error);
      throw new Error('Falha ao pesquisar publicações.');
    }
  }

  /**
   * Cria uma nova publicação no feed.
   * @param postData - Os dados para a nova publicação.
   * @returns Uma promessa que resolve para a nova publicação criada.
   */
  async createPost(postData: FormData): Promise<PublicacaoFeed> {
    try {
      const response = await backend.post<PublicacaoFeed>('/feed', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar publicação do feed na API:', error);
      throw new Error('Falha ao criar a publicação no feed.');
    }
  }

  /**
   * Atualiza uma publicação de feed existente.
   * @param postId - O ID da publicação a ser atualizada.
   * @param postData - Os dados atualizados da publicação.
   * @returns Uma promessa que resolve para a publicação atualizada.
   */
  async updatePost(postId: string, postData: Partial<PublicacaoFeed>): Promise<PublicacaoFeed> {
    try {
      const response = await backend.put<PublicacaoFeed>(`/feed/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar a publicação ${postId} na API:`, error);
      throw new Error('Falha ao atualizar a publicação do feed.');
    }
  }

  /**
   * Deleta uma publicação do feed.
   * @param postId - O ID da publicação a ser deletada.
   */
  async deletePost(postId: string): Promise<void> {
    try {
      await backend.delete(`/feed/${postId}`);
    } catch (error) {
      console.error(`Erro ao deletar a publicação ${postId} na API:`, error);
      throw new Error('Falha ao deletar a publicação do feed.');
    }
  }
}

export const apiFeedPublicationService = new ApiFeedPublicationService();
