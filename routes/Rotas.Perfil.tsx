
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const PG_Perfil_Proprio = lazy(() => import('../pages/PG.Perfil.Proprio').then(m => ({ default: m.PG_Perfil_Proprio })));
const PG_Perfil_Terceiro = lazy(() => import('../pages/PG.Perfil.Terceiro').then(m => ({ default: m.PG_Perfil_Terceiro })));
const CompleteProfile = lazy(() => import('../pages/CompleteProfile').then(m => ({ default: m.CompleteProfile })));
const Leaderboard = lazy(() => import('../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const PG_Edicao_Perfil = lazy(() => import('../pages/PG.Edicao.Perfil').then(m => ({ default: m.PG_Edicao_Perfil })));

export const profileRoutes = [
  { path: '/profile', element: <ProtectedRoute><PG_Perfil_Proprio /></ProtectedRoute> },
  { path: '/user/:id', element: <ProtectedRoute><PG_Perfil_Terceiro /></ProtectedRoute> },
  { path: '/complete-profile', element: <ProtectedRoute><CompleteProfile /></ProtectedRoute> },
  { path: '/ranking-followers', element: <ProtectedRoute><Leaderboard /></ProtectedRoute> },
  { path: '/profile/edit', element: <ProtectedRoute><PG_Edicao_Perfil /></ProtectedRoute> }
];
