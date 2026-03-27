
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';
import { LoginRequest } from '../ServiçosFrontend/Contratos/Contrato.Autenticacao';

export const useAutenticacao = () => {
  const [authState, setAuthState] = useState(servicoDeAplicacaoDeAutenticacao.getState());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthStateChange = (newState) => {
      setAuthState(newState);
      if (newState.isAuthenticated) {
        if (newState.isNewUser) {
          navigate('/completar-perfil');
        } else {
          navigate('/feed');
        }
      }
    };

    const unsubscribe = servicoDeAplicacaoDeAutenticacao.subscribe(handleAuthStateChange);
    return () => unsubscribe();
  }, [navigate]);

  const loginComEmail = useCallback(async (credentials: LoginRequest) => {
    try {
      await servicoDeAplicacaoDeAutenticacao.loginComEmail(credentials);
    } catch (error) {
      console.error("Falha no login com email:", error);
    }
  }, []);

  const iniciarLoginComGoogle = useCallback(() => {
    servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle();
  }, []);

  const logout = useCallback(async () => {
    await servicoDeAplicacaoDeAutenticacao.logout();
    navigate('/login');
  }, [navigate]);

  return {
    usuario: authState.user,
    autenticado: authState.isAuthenticated,
    processando: authState.loading,
    erro: authState.error,
    loginComEmail,
    iniciarLoginComGoogle,
    logout,
  };
};
