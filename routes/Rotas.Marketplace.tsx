
import React, { lazy } from 'react';
import { ProtectedRoute } from '../Componentes/ComponentesDeAuth/ProtectedRoute';

const Marketplace = lazy(() => import('../pages/Marketplace').then(m => ({ default: m.Marketplace })));
// Corrected the import to the new page
const PGDetalhesProdutos = lazy(() => import('../pages/PG.Detalhes.Produtos').then(m => ({ default: m.PGDetalhesProdutos })));
const CreateMarketplaceItem = lazy(() => import('../pages/CreateMarketplaceItem').then(m => ({ default: m.CreateMarketplaceItem })));
const MyStore = lazy(() => import('../pages/MyStore').then(m => ({ default: m.MyStore })));
const AdPlacementSelector = lazy(() => import('../pages/AdPlacementSelector').then(m => ({ default: m.AdPlacementSelector })));
const CampaignPerformance = lazy(() => import('../pages/CampaignPerformance').then(m => ({ default: m.CampaignPerformance })));
const AdCampaignTypeSelector = lazy(() => import('../pages/AdCampaignTypeSelector').then(m => ({ default: m.AdCampaignTypeSelector })));
const AdContentSelector = lazy(() => import('../pages/AdContentSelector').then(m => ({ default: m.AdContentSelector })));

export const marketplaceRoutes = [
  { path: '/marketplace', element: <ProtectedRoute><Marketplace /></ProtectedRoute> },
  // Updated the component for the product details route
  { path: '/marketplace/product/:id', element: <ProtectedRoute><PGDetalhesProdutos /></ProtectedRoute> },
  { path: '/create-marketplace-item', element: <ProtectedRoute><CreateMarketplaceItem /></ProtectedRoute> },
  { path: '/my-store', element: <ProtectedRoute><MyStore /></ProtectedRoute> },
  { path: '/ad-placement-selector', element: <ProtectedRoute><AdPlacementSelector /></ProtectedRoute> },
  { path: '/campaign-performance/:id', element: <ProtectedRoute><CampaignPerformance /></ProtectedRoute> },
  { path: '/ad-type-selector', element: <ProtectedRoute><AdCampaignTypeSelector /></ProtectedRoute> },
  { path: '/ad-content-selector', element: <ProtectedRoute><AdContentSelector /></ProtectedRoute> }
];
