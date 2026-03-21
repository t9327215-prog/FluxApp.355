
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importa os arrays de rotas dos módulos
import { authRoutes } from './Rotas.Autenticacao';
import { feedRoutes } from './Rotas.Feed';
import { reelRoutes } from './Rotas.Reels';
import { groupRoutes } from './Rotas.Grupos';
import { groupSettingsRoutes } from './Rotas.Grupos.Configuracoes';
import { marketplaceRoutes } from './Rotas.Marketplace';
import { profileRoutes } from './Rotas.Perfil';
import { settingsRoutes } from './Rotas.Configuracoes';
import { financialRoutes } from './Rotas.Financeiro';
import { notificationRoutes } from './Rotas.Notificacoes';
import { messageRoutes } from './Rotas.Mensagens'; // Importa as rotas de mensagens
import { miscRoutes } from './Rotas.Diversos';

// Combina todos os módulos em um único array
const allRoutes = [
  ...authRoutes,
  ...feedRoutes,
  ...reelRoutes,
  ...groupRoutes,
  ...groupSettingsRoutes,
  ...marketplaceRoutes,
  ...profileRoutes,
  ...settingsRoutes,
  ...financialRoutes,
  ...notificationRoutes,
  ...messageRoutes, // Adiciona as rotas de mensagens
  ...miscRoutes,
];

// Componente de Loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff]"></i>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Mapeia o array de rotas para os componentes <Route> */}
        {allRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        
        {/* Rota Fallback: Redireciona para o feed se nenhuma outra rota corresponder */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
