export interface CriarSessaoDTO {
  idUsuario: string;
  token: string;
  enderecoIp: string;
  userAgent?: string;
}
