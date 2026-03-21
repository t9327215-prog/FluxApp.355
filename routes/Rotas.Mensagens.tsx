
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const PG_Lista_Conversas = lazy(() => import('../pages/PG.Lista.Conversas').then(m => ({ default: m.PG_Lista_Conversas })));

export const messageRoutes = [
  { path: '/messages', element: <ProtectedRoute><PG_Lista_Conversas /></ProtectedRoute> }
];
