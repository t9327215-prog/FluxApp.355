
import {
  servicoAutenticacao,
  AuthState,
  IPerfilParaCompletar,
  IResultadoCompletarPerfil,
  IRegistroParams,
  IResultadoRegistro
} from '../../ServiçoDeAutenticação/Auth.Application';
import { ILoginEmailParams } from '../../Contratos/Contrato.Autenticacao';

// Re-exportamos os tipos necessários para desacoplar as camadas.
export type { 
  AuthState, 
  ILoginEmailParams, 
  IPerfilParaCompletar, 
  IResultadoCompletarPerfil,
  IRegistroParams,
  IResultadoRegistro
};

/**
 * Auth.provider.ts
 * Ponto de acesso único e simplificado para a UI (Hooks, etc.).
 * Delega todas as chamadas para a camada de aplicação (Auth.Application.ts).
 */
export const AuthProvider = {
  
  /**
   * Delega o processo de registro para o serviço de aplicação.
   */
  registrar: (dadosRegistro: IRegistroParams): Promise<IResultadoRegistro> => {
    console.log("PROVIDER: Delegando chamada para registrar.");
    return servicoAutenticacao.registrar(dadosRegistro);
  },

  loginComEmail: (params: ILoginEmailParams) => {
    return servicoAutenticacao.login(params);
  },

  iniciarLoginComGoogle: () => {
    servicoAutenticacao.iniciarLoginComGoogle();
  },

  processarCallbackGoogle: (code: string) => {
    return servicoAutenticacao.finalizarLoginComGoogle(code);
  },

  completarPerfil: (dadosPerfil: IPerfilParaCompletar): Promise<IResultadoCompletarPerfil> => {
    return servicoAutenticacao.completarPerfil(dadosPerfil);
  },

  logout: () => {
    return servicoAutenticacao.logout();
  },

  subscribe: (listener: (state: AuthState) => void) => {
    return servicoAutenticacao.subscribe(listener);
  },

  getState: (): AuthState => {
    return servicoAutenticacao.getState();
  }
};
