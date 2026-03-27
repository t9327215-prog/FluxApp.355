
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { GlobalTracker } from '../../Componentes/layout/GlobalTracker';
import { DeepLinkHandler } from '../../Componentes/layout/DeepLinkHandler';
import { provedorLogger } from '../../ServiçosFrontend/SistemaObservabilidade/Log.Provedores';
import { ProvedorTelemetria } from './Provedor.Telemetria';

interface ProvedorNavegacaoProps {
  children: React.ReactNode;
}

/**
 * Componente que configura o sistema de navegação da aplicação, incluindo
 * o roteador, rastreadores globais, manipuladores de deep link e telemetria de navegação.
 */
export const ProvedorNavegacao: React.FC<ProvedorNavegacaoProps> = ({ children }) => {
  provedorLogger.info('Provedor de Navegação inicializado.');

  return (
    <HashRouter>
      <GlobalTracker />
      <DeepLinkHandler />
      <ProvedorTelemetria />
      {children}
    </HashRouter>
  );
};
