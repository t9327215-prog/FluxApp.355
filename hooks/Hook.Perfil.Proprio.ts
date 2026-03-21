
import { useState, useEffect, useCallback } from 'react';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { servicoPerfilUsuario } from '../ServiçosFrontend/ServiçosDePerfil/Servico.Perfil.Usuario';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { marketplacePublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { PublicacaoFeed } from '../../types/Saida/Types.Estrutura.Publicacao.Feed';
import { PublicacaoMarketplace } from '../../types/Saida/Types.Estrutura.Publicacao.Marketplace';

// Estendendo o tipo de Usuário para incluir posts e produtos que podem ser undefined inicialmente.
type PerfilCompleto = Usuario & {
    posts?: PublicacaoFeed[];
    products?: PublicacaoMarketplace[];
};

export const HookPerfilProprio = () => {
    const [profile, setProfile] = useState<PerfilCompleto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [authState, setAuthState] = useState(SistemaAutenticacaoSupremo.getState());
    const isAuthenticated = !!authState.user;

    useEffect(() => {
        const unsubscribe = SistemaAutenticacaoSupremo.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    const fetchProfile = useCallback(async () => {
        if (!isAuthenticated || !authState.user?.id) {
            setIsLoading(false);
            setError("Usuário não autenticado ou ID do usuário não encontrado.");
            setProfile(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const userId = authState.user.id;
            
            // Buscas em paralelo para otimização
            const [userData, allPosts, allProducts] = await Promise.all([
                servicoPerfilUsuario.getOwnProfile(),
                feedPublicationService.getPosts(),
                marketplacePublicationService.getProducts()
            ]);

            if (userData) {
                // Filtrando posts e produtos para o usuário logado
                const userPosts = allPosts.filter(post => post.autorId === userId);
                const userProducts = allProducts.filter(product => product.usuarioId === userId);

                // Combinando todos os dados em um único objeto de perfil
                const perfilCompleto: PerfilCompleto = {
                    ...userData,
                    posts: userPosts,
                    products: userProducts,
                };

                setProfile(perfilCompleto);
            } else {
                throw new Error('Não foi possível carregar o perfil a partir do serviço.');
            }
        } catch (err) {
            if (err instanceof Error) {
              setError(err.message || 'Erro ao carregar o perfil');
            }
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, authState.user?.id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, isLoading, error, refetch: fetchProfile };
};
