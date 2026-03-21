
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const LanguageSettings = lazy(() => import('../pages/LanguageSettings').then(m => ({ default: m.LanguageSettings })));
const TermsAndPrivacy = lazy(() => import('../pages/TermsAndPrivacy').then(m => ({ default: m.TermsAndPrivacy })));
const HelpSupport = lazy(() => import('../pages/HelpSupport').then(m => ({ default: m.HelpSupport })));
const PG_Configuracao_Notificacao = lazy(() => import('../pages/PG.Configuracao.Notificacao').then(m => ({ default: m.PG_Configuracao_Notificacao })));
const PG_Configuracao_GestaoDeBloqueios = lazy(() => import('../pages/PG.Configuracao.GestaoDeBloqueios').then(m => ({ default: m.PG_Configuracao_GestaoDeBloqueios })));
const PG_Configuracao_SegurancaELogin = lazy(() => import('../pages/PG.Configuracao.SegurancaELogin').then(m => ({ default: m.PG_Configuracao_SegurancaELogin })));

export const settingsRoutes = [
  { path: '/settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
  { path: '/settings/language', element: <ProtectedRoute><LanguageSettings /></ProtectedRoute> },
  { path: '/terms', element: <ProtectedRoute><TermsAndPrivacy /></ProtectedRoute> },
  { path: '/help', element: <ProtectedRoute><HelpSupport /></ProtectedRoute> },
  { path: '/pg-configuracao-notificacao', element: <ProtectedRoute><PG_Configuracao_Notificacao /></ProtectedRoute> },
  { path: '/pg-configuracao-gestao-de-bloqueios', element: <ProtectedRoute><PG_Configuracao_GestaoDeBloqueios /></ProtectedRoute> },
  { path: '/pg-configuracao-seguranca-e-login', element: <ProtectedRoute><PG_Configuracao_SegurancaELogin /></ProtectedRoute> }
];
