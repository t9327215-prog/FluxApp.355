
import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderPublicacao } from './Infra.Provider.Publicacao';

const PostSchema = z.object({
    titulo: z.string().min(1, "O título é obrigatório."),
    conteudo: z.string().optional(),
    imagem: z.any().optional(),
});

class DadosProviderPublicacao extends DadosBase {
    constructor() {
        super('DadosProvider.Publicacao');
    }

    // --- Feed ---
    async buscarPosts() { // Renomeado de getPosts para buscarPosts
        return infraProviderPublicacao.buscarPosts();
    }

    async buscarPostPorId(id: string) { // Renomeado de getPostById para buscarPostPorId
        return infraProviderPublicacao.buscarPostPorId(id);
    }

    async criarPost(postData: FormData) { // Renomeado de createPost para criarPost
        try {
            const result = await infraProviderPublicacao.criarPost(postData);
            return result;
        } catch (error) {
            this.logError('criarPost', error);
            throw error;
        }
    }

    async atualizarPost(id: string, postData: any) { // Renomeado de updatePost para atualizarPost
        return infraProviderPublicacao.atualizarPost(id, postData);
    }

    async deletarPost(id: string) { // Renomeado de deletePost para deletarPost
        return infraProviderPublicacao.deletarPost(id);
    }

    // --- Marketplace ---
    async buscarItensMarketplace() { // Renomeado de getMarketplaceItems para buscarItensMarketplace
        return infraProviderPublicacao.buscarItensMarketplace();
    }
}

export const dadosProviderPublicacao = new DadosProviderPublicacao();
