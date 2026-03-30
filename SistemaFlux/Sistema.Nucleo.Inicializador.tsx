
import React from 'react';
import { createRoot } from 'react-dom/client';
import SistemaNucleoApp from './Sistema.Nucleo.App';
import { loadEnvironment } from '../ServiçosFrontend/ValidaçãoDeAmbiente/config.ts';
import AppFlux from './App.Flux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { servicoAutenticacao } from '../ServiçosFrontend/Estados/Manager.Estado.Autenticacao';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

async function inicializarAplicacao() {
  // A inicialização do serviço de autenticação foi removida daqui
  // pois será gerenciada pelo AuthProvider.
  montarNucleoReact();
}

document.addEventListener('DOMContentLoaded', () => {
  AppFlux.iniciar();
  inicializarAplicacao();
});

export function montarNucleoReact() {
  loadEnvironment();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Elemento 'root' não foi encontrado.");
  }

  if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID não está definido. O login com Google não funcionará.");
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID!}>
        <SistemaNucleoApp />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}
