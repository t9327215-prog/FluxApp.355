
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import SistemaNucleoApp from './Sistema.Nucleo.App';
import { loadEnvironment } from './ServiçosFrontend/ValidaçãoDeAmbiente/config.ts';
import MonitorDeErrosDeInterface from './Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface.jsx';

const queryClient = new QueryClient();

document.addEventListener('DOMContentLoaded', () => {
  loadEnvironment();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Elemento 'root' não foi encontrado.");
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.error("VITE_GOOGLE_CLIENT_ID não definida.");
  }
  
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId || ""}>
          <MonitorDeErrosDeInterface>
            <SistemaNucleoApp />
          </MonitorDeErrosDeInterface>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
