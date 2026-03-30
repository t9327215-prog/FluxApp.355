
import { useState, useEffect } from 'react';
import { servicoDeAplicacaoDeAutenticacao, LoginEmailParams } from '../ServiçosFrontend/ServicosDeAplicacao/Application.Layer.Autenticacao';
import { authStateManager, IAuthState } from '../ServiçosFrontend/Estados/Manager.Estado.Autenticacao';

export const useAuth = () => {
    const [authState, setAuthState] = useState<IAuthState>(authStateManager.getState());

    useEffect(() => {
        const unsubscribe = authStateManager.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    return {
        ...authState,
        loginComEmail: (params: LoginEmailParams) => servicoDeAplicacaoDeAutenticacao.loginComEmail(params),
        logout: () => servicoDeAplicacaoDeAutenticacao.logout(),
        iniciarLoginComGoogle: () => servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle(),
        finalizarLoginComGoogle: (idToken: string) => servicoDeAplicacaoDeAutenticacao.finalizarLoginComGoogle(idToken),
    };
};
