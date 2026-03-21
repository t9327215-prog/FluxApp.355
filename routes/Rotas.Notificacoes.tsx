
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const Notifications = lazy(() => import('../pages/Notifications').then(m => ({ default: m.Notifications })));

export const notificationRoutes = [
  { path: '/notifications', element: <ProtectedRoute><Notifications /></ProtectedRoute> }
];
