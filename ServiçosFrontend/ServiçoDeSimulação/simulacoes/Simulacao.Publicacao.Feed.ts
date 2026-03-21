// /ServiçosFrontend/ServiçoDeSimulação/simulacoes/Simulacao.Publicacao.Feed.ts

import { PublicacaoFeed } from "../../../types/Saida/Types.Estrutura.Publicacao.Feed";

let mockFeedPosts: PublicacaoFeed[] = [
  {
    id: "post1",
    autor: {
      id: "user1",
      nome: "João da Silva",
      avatarUrl: "https://i.pravatar.cc/150?u=user1",
    },
    content: "Este é o meu primeiro post na plataforma! Muito animado para começar.",
    media: [{ type: "image", url: "https://picsum.photos/seed/post1/600/400" }],
    likes: 15,
    comments: [],
    createdAt: new Date("2023-10-27T10:00:00Z"),
    shares: 2,
  },
  {
    id: "post2",
    autor: {
      id: "user2",
      nome: "Maria Oliveira",
      avatarUrl: "https://i.pravatar.cc/150?u=user2",
    },
    content: "Olha essa paisagem incrível que encontrei hoje!",
    media: [{ type: "image", url: "https://picsum.photos/seed/post2/600/400" }],
    likes: 42,
    comments: [],
    createdAt: new Date("2023-10-27T12:30:00Z"),
    shares: 8,
  },
];

class MockFeedPublicationService {
  async getPosts(): Promise<PublicacaoFeed[]> {
    return Promise.resolve(mockFeedPosts);
  }

  async getPostById(postId: string): Promise<PublicacaoFeed> {
    const post = mockFeedPosts.find((p) => p.id === postId);
    if (post) {
      return Promise.resolve(post);
    }
    return Promise.reject(new Error("Post not found"));
  }

  async searchPosts(query: string): Promise<PublicacaoFeed[]> {
    const lowerCaseQuery = query.toLowerCase();
    const results = mockFeedPosts.filter(
      (p) =>
        p.content.toLowerCase().includes(lowerCaseQuery) ||
        p.autor.nome.toLowerCase().includes(lowerCaseQuery)
    );
    return Promise.resolve(results);
  }

  async createPost(postData: FormData): Promise<PublicacaoFeed> {
    const newPost: PublicacaoFeed = {
      id: `post${Date.now()}`,
      autor: {
        id: "user-simulated",
        nome: "Usuário Simulado",
        avatarUrl: "https://i.pravatar.cc/150?u=user-simulated",
      },
      content: postData.get("content") as string,
      media: [], // Simulação não lida com uploads de arquivo
      likes: 0,
      comments: [],
      createdAt: new Date(),
      shares: 0,
    };
    mockFeedPosts.unshift(newPost);
    return Promise.resolve(newPost);
  }

  async updatePost(
    postId: string,
    postData: Partial<PublicacaoFeed>
  ): Promise<PublicacaoFeed> {
    const postIndex = mockFeedPosts.findIndex((p) => p.id === postId);
    if (postIndex > -1) {
      const updatedPost = { ...mockFeedPosts[postIndex], ...postData };
      mockFeedPosts[postIndex] = updatedPost;
      return Promise.resolve(updatedPost);
    }
    return Promise.reject(new Error("Post not found"));
  }

  async deletePost(postId: string): Promise<void> {
    const postIndex = mockFeedPosts.findIndex((p) => p.id === postId);
    if (postIndex > -1) {
      mockFeedPosts.splice(postIndex, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Post not found"));
  }
}

export const mockFeedPublicationService = new MockFeedPublicationService();
