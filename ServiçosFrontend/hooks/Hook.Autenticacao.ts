
import { useState, useEffect } from 'react';
// Importa o serviço de aplicação com o nome correto
import { servicoDeAplicacaoDeAutenticacao } from '../ServicosDeAplicacao/Application.Layer.Autenticacao';
// Importa o tipo LoginEmailParams diretamente do serviço de autenticação
import { LoginEmailParams } from '../ServiçoDeAutenticação/Auth.Application';

/**
 * Hook customizado para gerenciar o estado de autenticação em toda a aplicação.
 *
 * Este hook se inscreve no serviço de aplicação de autenticação (`servicoDeAplicacaoDeAutenticacao`)
 * para obter o estado mais recente e fornece uma interface simplificada para os
 * componentes React.
 *
 * @returns Um objeto contendo o estado de autenticação e as funções para interagir com ele.
 */
export const useAuth = () => {
    // Inicializa o estado com os valores atuais do serviço
    const [authState, setAuthState] = useState(servicoDeAplicacaoDeAutenticacao.getState());

    useEffect(() => {
        // Se inscreve para receber atualizações do estado de autenticação
        const unsubscribe = servicoDeAplicacaoDeAutenticacao.subscribe(setAuthState);

        // Limpa a inscrição quando o componente que usa o hook for desmontado
        return () => unsubscribe();
    }, []); // O array vazio garante que o efeito só rode na montagem e desmontagem

    // Retorna o estado e as ações para serem usadas pelos componentes
    return {
        ...authState,
        loginComEmail: (params: LoginEmailParams) => servicoDeAplicacaoDeAutenticacao.loginComEmail(params),
        logout: () => servicoDeAplicacaoDeAutenticacao.logout(),
        iniciarLoginComGoogle: () => servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle(),
    };
};
