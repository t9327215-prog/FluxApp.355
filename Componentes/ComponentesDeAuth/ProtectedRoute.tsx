
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// CORREÇÃO: A importação foi atualizada para usar o serviço de autenticação real.
// A lógica de simulação agora é tratada globalmente via interceptação de fetch,
// então os componentes não precisam mais saber sobre mocks ou factories.
import SistemaAutenticacaoSupremo from '../../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { LoadingScreen } from '../ComponenteDeInterfaceDeUsuario/LoadingScreen.tsx';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState(SistemaAutenticacaoSupremo.getState());

  useEffect(() => {
    const unsubscribe = SistemaAutenticacaoSupremo.subscribe(setAuthState);
    return () => unsubscribe();
  }, []);

  if (authState.loading) {
    return <LoadingScreen />;
  }

  const isUserAuthenticated = !!authState.user;

  if (!isUserAuthenticated) {
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
    }
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
