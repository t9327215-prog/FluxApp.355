// /ServiçosFrontend/ServiçoDeSimulação/simulacoes/Simulacao.Publicacao.Marketplace.ts

import { PublicacaoMarketplace } from "../../../types/Saida/Types.Estrutura.Publicacao.Marketplace";

let mockMarketplaceItems: PublicacaoMarketplace[] = [
    {
        id: "item1",
        title: "Smartphone XPTO 128GB",
        price: 2999.99,
        category: "Eletrônicos",
        description: "Smartphone novo, na caixa, com garantia de 1 ano.",
        images: ["https://picsum.photos/seed/item1/600/400"],
        location: "São Paulo, SP",
    },
    {
        id: "item2",
        title: "Notebook Pro-X",
        price: 7500.00,
        category: "Eletrônicos",
        description: "Notebook de alta performance para profissionais.",
        images: ["https://picsum.photos/seed/item2/600/400"],
        location: "Rio de Janeiro, RJ",
    },
];

class MockMarketplacePublicationService {
    async getProducts(): Promise<PublicacaoMarketplace[]> {
        return Promise.resolve(mockMarketplaceItems);
    }

    async getProductById(productId: string): Promise<PublicacaoMarketplace> {
        const product = mockMarketplaceItems.find((p) => p.id === productId);
        if (product) {
            return Promise.resolve(product);
        }
        return Promise.reject(new Error("Product not found"));
    }

    async searchProducts(query: string): Promise<PublicacaoMarketplace[]> {
        const lowerCaseQuery = query.toLowerCase();
        const results = mockMarketplaceItems.filter(
            (p) =>
                p.title.toLowerCase().includes(lowerCaseQuery) ||
                p.description.toLowerCase().includes(lowerCaseQuery)
        );
        return Promise.resolve(results);
    }

    async createProduct(productData: Omit<PublicacaoMarketplace, 'id'>): Promise<PublicacaoMarketplace> {
        const newProduct: PublicacaoMarketplace = {
            id: `item${Date.now()}`,
            ...productData,
        };
        mockMarketplaceItems.unshift(newProduct);
        return Promise.resolve(newProduct);
    }

    async updateProduct(
        productId: string,
        productData: Partial<PublicacaoMarketplace>
    ): Promise<PublicacaoMarketplace> {
        const productIndex = mockMarketplaceItems.findIndex((p) => p.id === productId);
        if (productIndex > -1) {
            const updatedProduct = { ...mockMarketplaceItems[productIndex], ...productData };
            mockMarketplaceItems[productIndex] = updatedProduct;
            return Promise.resolve(updatedProduct);
        }
        return Promise.reject(new Error("Product not found"));
    }

    async deleteProduct(productId: string): Promise<void> {
        const productIndex = mockMarketplaceItems.findIndex((p) => p.id === productId);
        if (productIndex > -1) {
            mockMarketplaceItems.splice(productIndex, 1);
            return Promise.resolve();
        }
        return Promise.reject(new Error("Product not found"));
    }
}

export const mockMarketplacePublicationService = new MockMarketplacePublicationService();
