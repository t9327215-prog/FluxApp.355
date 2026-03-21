// /ServiçosFrontend/APIs/APIsServicoPublicacao/API.Servico.Publicacao.Marketplace.ts

import apiClient from '../../Cliente.Backend';
import { PublicacaoMarketplace } from '../../../types/Saida/Types.Estrutura.Publicacao.Marketplace';

const BASE_URL = '/api/marketplace/items';

/**
 * @file Serviço de API para publicações do marketplace.
 *
 * Este arquivo lida com a comunicação com a API de backend para operações relacionadas ao marketplace,
 * utilizando o cliente de API centralizado.
 */
class ApiMarketplacePublicationService {

  /**
   * Busca todos os produtos do marketplace na API.
   * @returns Uma promessa que resolve para um array de publicações do marketplace.
   */
  async getProducts(): Promise<PublicacaoMarketplace[]> {
    return apiClient.get<PublicacaoMarketplace[]>(BASE_URL);
  }

  /**
   * Busca um único produto do marketplace pelo seu ID na API.
   * @param id - O ID do produto.
   * @returns Uma promessa que resolve para a publicação do marketplace.
   */
  async getProductById(id: string): Promise<PublicacaoMarketplace> {
    return apiClient.get<PublicacaoMarketplace>(`${BASE_URL}/${id}`);
  }

  /**
   * Cria um novo produto no marketplace através da API.
   * @param productData - Os dados do novo produto.
   * @returns Uma promessa que resolve para a nova publicação do marketplace criada.
   */
  async createProduct(productData: object): Promise<PublicacaoMarketplace> {
    return apiClient.post<PublicacaoMarketplace>(BASE_URL, productData);
  }

  /**
   * Atualiza um produto existente no marketplace através da API.
   * @param id - O ID do produto a ser atualizado.
   * @param productData - Os novos dados do produto.
   * @returns Uma promessa que resolve para a publicação do marketplace atualizada.
   */
  async updateProduct(id: string, productData: object): Promise<PublicacaoMarketplace> {
    return apiClient.put<PublicacaoMarketplace>(`${BASE_URL}/${id}`, productData);
  }

  /**
   * Deleta um produto do marketplace através da API.
   * @param id - O ID do produto a ser deletado.
   * @returns Uma promessa que resolve quando a exclusão for concluída.
   */
  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete<void>(`${BASE_URL}/${id}`);
  }
}

export const apiMarketplacePublicationService = new ApiMarketplacePublicationService();
