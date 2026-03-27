
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { provedorLogger } from '../../ServiçosFrontend/SistemaObservabilidade/Log.Provedores';

/**
 * Componente que centraliza a lógica de telemetria (logging) da aplicação.
 * Ele não renderiza nada visualmente, mas ativa listeners e hooks para capturar
 * e enviar eventos importantes, utilizando o logger de provedores.
 */
export const ProvedorTelemetria = () => {
  provedorLogger.info('Provedor de Telemetria inicializado.');

  // Hook para logs globais do app (online/offline, início do app)
  useEffect(() => {
    provedorLogger.info('Telemetria.Global: App iniciado');
    const onOnline = () => provedorLogger.info('Telemetria.Global: Conexão com a internet restaurada');
    const onOffline = () => provedorLogger.warn('Telemetria.Global: Conexão com a internet perdida');

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Hook para log de navegação de rotas
  const location = useLocation();
  useEffect(() => {
    provedorLogger.info(`Telemetria.Navegacao: Navegou para a rota: ${location.pathname}`);
  }, [location]);

  return null; // Este componente não renderiza nada
};
