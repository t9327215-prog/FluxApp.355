import { IUsuarioDto } from '../Contratos/Contrato.Comunicacao.Usuario';

export interface IAuthState {
  autenticado: boolean;
  usuario: IUsuarioDto | null;
  token: string | null;
  processando: boolean;
  erro: string | null;
}

export interface IUsuarioSocial {
  googleId: string;
  nome: string;
  email: string;
  avatarUrl?: string;
}

export interface ILoginParams {
  email: string;
  senha: string;
}

export interface ISocialLoginParams extends IUsuarioSocial {
  tokenProvider: string;
}

export interface IAuthResult {
  sucesso: boolean;
  usuario?: IUsuarioDto;
  token?: string;
  redirect?: string;
  mensagem?: string;
}

export type AuthListener = (state: IAuthState) => void;
