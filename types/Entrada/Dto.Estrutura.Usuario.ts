export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginUsuarioDTO {
  email: string;
  senha: string;
}

export interface LoginGoogleDTO {
  token: string;
  referredBy?: string;
}

export interface AuthGoogleUsuarioDTO {
  nome: string;
  email: string;
  google_id: string;
}

export interface AtualizarPerfilUsuarioDTO {
  apelido?: string;
  bio?: string;
  site?: string;
  privado?: boolean;
}
