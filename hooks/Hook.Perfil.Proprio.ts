
import { useState, useEffect, useCallback } from 'react';

// Importa o hook de autenticação
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { marketplacePublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace';

// Mantendo os imports de tipo como estavam, assumindo que a resolução de caminho lida com eles.
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { PublicacaoFeed } from '../../types/Saida/Types.Estrutura.Publicacao.Feed';
import { PublicacaoMarketplace } from '../../types/Saida/Types.Estrutura.Publicacao.Marketplace';

// Estendendo o tipo de Usuário para incluir posts e produtos.
type PerfilCompleto = Usuario & {
    posts: PublicacaoFeed[];
    products: PublicacaoMarketplace[];
    // Adicionando campos que a página usa para evitar erros
    photos?: any[]; 
    reels?: any[];
};

export const HookPerfilProprio = () => {
    // Usa o hook de autenticação para obter o usuário e o status
    const { usuario, autenticado } = useAuth();
    
    const [profile, setProfile] = useState<PerfilCompleto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfileData = useCallback(async () => {
        // Não faz nada se não estiver autenticado ou se não houver usuário
        if (!autenticado || !usuario) {
            setIsLoading(false);
            setProfile(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const userId = usuario.id;
            
            // Busca posts e produtos em paralelo
            const [allPosts, allProducts] = await Promise.all([
                feedPublicationService.getPosts(),
                marketplacePublicationService.getProducts()
            ]);

            // Filtra as publicações para o usuário atual
            const userPosts = allPosts.filter(post => post.autorId === userId);
            const userProducts = allProducts.filter(product => product.usuarioId === userId);

            // Combina os dados do usuário do contexto de autenticação com suas publicações
            const perfilCompleto: PerfilCompleto = {
                ...(usuario as Usuario), // Cast para o tipo Usuario importado
                posts: userPosts,
                products: userProducts,
            };

            setProfile(perfilCompleto);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido';
            setError(errorMessage);
            console.error("Erro ao buscar dados do perfil:", errorMessage);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [autenticado, usuario]); // A dependência agora é o usuário do contexto

    // Efeito para buscar os dados do perfil quando o componente é montado ou o usuário muda
    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    // Retorna o estado do perfil e uma função para recarregar
    return { profile, isLoading, error, refetch: fetchProfileData };
};
