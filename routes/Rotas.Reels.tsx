
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const PG_Reels = lazy(() => import('../pages/PG.Reels').then(module => ({ default: module.PG_Reels })));
const CreateReel = lazy(() => import('../pages/CreateReel').then(module => ({ default: module.CreateReel })));
const ReelsSearch = lazy(() => import('../pages/ReelsSearch').then(module => ({ default: module.ReelsSearch })));

export const reelRoutes = [
  { path: '/reels', element: <ProtectedRoute><PG_Reels /></ProtectedRoute> },
  { path: '/reels/:id', element: <ProtectedRoute><PG_Reels /></ProtectedRoute> },
  { path: '/reels-search', element: <ProtectedRoute><ReelsSearch /></ProtectedRoute> },
  { path: '/create-reel', element: <ProtectedRoute><CreateReel /></ProtectedRoute> },
];
