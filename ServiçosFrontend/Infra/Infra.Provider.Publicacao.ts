import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import { API_ENDPOINTS } from '../../src/constants/api';

class InfraProviderPublicacao {
    // --- Feed ---
    public async getPosts(): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.FEED.BASE);
    }

    public async getPostById(postId: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.FEED.POST(postId));
    }

    public async searchPosts(query: string): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.FEED.BASE + '/search', { params: { query } });
    }

    public async createPost(postData: FormData): Promise<any> {
        return httpClient.post(API_ENDPOINTS.FEED.BASE, postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    public async updatePost(postId: string, postData: any): Promise<any> {
        return httpClient.put(API_ENDPOINTS.FEED.POST(postId), postData);
    }

    public async deletePost(postId: string): Promise<void> {
        return httpClient.delete(API_ENDPOINTS.FEED.POST(postId));
    }

    // --- Marketplace ---
    public async getMarketplaceItems(): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.MARKETPLACE.BASE);
    }

    public async getMarketplaceItemById(itemId: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.MARKETPLACE.ITEM(itemId));
    }

    public async createMarketplaceItem(itemData: FormData): Promise<any> {
        return httpClient.post(API_ENDPOINTS.MARKETPLACE.BASE, itemData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const infraProviderPublicacao = new InfraProviderPublicacao();
