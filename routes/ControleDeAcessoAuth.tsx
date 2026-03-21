
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ControleDeAcessoAuthProps {
  element: React.ReactElement;
}

// Este componente guarda as rotas de autenticação (Login, Registro)
// de usuários que já estão logados, redirecionando-os para a página apropriada.
export const ControleDeAcessoAuth: React.FC<ControleDeAcessoAuthProps> = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Verificando Credenciais...
        </span>
      </div>
    );
  }

  // Se o usuário está logado e o perfil está completo, redireciona para o feed
  if (user && user.perfilCompleto) {
    return <Navigate to="/feed" replace />;
  }

  // Se o usuário está logado, mas o perfil não está completo, redireciona para a página de completar perfil
  if (user && !user.perfilCompleto) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Se o usuário não estiver logado, permite o acesso à rota de autenticação (Login, Registro, etc.)
  return element;
};
