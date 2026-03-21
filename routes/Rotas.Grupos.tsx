
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const PG_Lista_Grupo = lazy(() => import('../pages/PG.Lista.Grupo').then(m => ({ default: m.PG_Lista_Grupo })));
const GroupChat = lazy(() => import('../pages/GroupChat').then(m => ({ default: m.GroupChat })));
const CreateGroup = lazy(() => import('../pages/CreateGroup').then(m => ({ default: m.CreateGroup })));
const CreateVipGroup = lazy(() => import('../pages/CreateVipGroup').then(m => ({ default: m.CreateVipGroup })));
const CreatePublicGroup = lazy(() => import('../pages/CreatePublicGroup').then(m => ({ default: m.CreatePublicGroup })));
const CreatePrivateGroup = lazy(() => import('../pages/CreatePrivateGroup').then(m => ({ default: m.CreatePrivateGroup })));
const EditGroup = lazy(() => import('../pages/EditGroup').then(m => ({ default: m.EditGroup })));
const VipGroupSales = lazy(() => import('../pages/VipGroupSales').then(m => ({ default: m.VipGroupSales })));
const SuccessBridge = lazy(() => import('../pages/SuccessBridge').then(m => ({ default: m.SuccessBridge })));
const PG_Grupo_Plataforma_Hub = lazy(() => import('../pages/groups/PG.Grupo.Plataforma.Hub').then(m => ({ default: m.PG_Grupo_Plataforma_Hub })));
const ManageGroupLinks = lazy(() => import('../pages/ManageGroupLinks').then(m => ({ default: m.ManageGroupLinks })));
const PGGrupoReceita = lazy(() => import('../pages/groups/PG.Grupo.Receita').then(m => ({ default: m.PGGrupoReceita })));
const VipSalesHistory = lazy(() => import('../pages/VipSalesHistory').then(m => ({ default: m.VipSalesHistory })));
const PG_Chat_Grupo = lazy(() => import('../pages/PG.Chat.Grupo').then(m => ({ default: m.PG_Chat_Grupo })));

// Importando a nova página de entrada do grupo
const PG_Grupo_Entrada = lazy(() => import('../pages/PG.Grupo.Entrada').then(m => ({ default: m.PG_Grupo_Entrada })));

export const groupRoutes = [
    { path: '/groups', element: <ProtectedRoute><PG_Lista_Grupo /></ProtectedRoute> },
    // Adicionando a nova rota para a página de entrada
    { path: '/group/:id', element: <ProtectedRoute><PG_Grupo_Entrada /></ProtectedRoute> }, 
    { path: '/group-chat/:id', element: <ProtectedRoute><GroupChat /></ProtectedRoute> },
    { path: '/pg-chat-grupo', element: <PG_Chat_Grupo /> },
    { path: '/vip-group-sales/:id', element: <VipGroupSales /> },
    { path: '/create-group', element: <ProtectedRoute><CreateGroup /></ProtectedRoute> },
    { path: '/create-group/vip', element: <ProtectedRoute><CreateVipGroup /></ProtectedRoute> },
    { path: '/create-group/public', element: <ProtectedRoute><CreatePublicGroup /></ProtectedRoute> },
    { path: '/create-group/private', element: <ProtectedRoute><CreatePrivateGroup /></ProtectedRoute> },
    { path: '/edit-group/:id', element: <ProtectedRoute><EditGroup /></ProtectedRoute> },
    { path: '/payment-success-bridge/:id', element: <ProtectedRoute><SuccessBridge /></ProtectedRoute> },
    { path: '/group/:id/files', element: <ProtectedRoute><PG_Grupo_Plataforma_Hub /></ProtectedRoute> },
    { path: '/group-links/:id', element: <ProtectedRoute><ManageGroupLinks /></ProtectedRoute> },
    { path: '/group/:id/revenue', element: <ProtectedRoute><PGGrupoReceita /></ProtectedRoute> },
    { path: '/vip-sales-history/:id', element: <ProtectedRoute><VipSalesHistory /></ProtectedRoute> }
  ];
