
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUsuarioSessao } from '../hooks/Hook.Usuario.Sessao.ts';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { user, loading } = useUsuarioSessao();
  const location = useLocation();

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

  if (!user) {
    // Usuário não logado, redireciona para a página de login
    return <Navigate to="/" replace />;
  }

  // Usuário está logado
  if (user.profile_completed) {
    // Perfil completo. Se tentar acessar login ou complete-profile, redireciona para o feed
    if (location.pathname === '/' || location.pathname === '/complete-profile') {
      return <Navigate to="/feed" replace />;
    }
  } else {
    // Perfil incompleto. Redireciona para complete-profile se ainda não estiver lá
    if (location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  // Se nenhuma das condições de redirecionamento for atendida, renderiza o elemento solicitado.
  // Isso acontece quando o usuário está logado com perfil completo e acessa uma rota protegida válida,
  // ou quando está com perfil incompleto e acessa a página /complete-profile.
  return element;
};
