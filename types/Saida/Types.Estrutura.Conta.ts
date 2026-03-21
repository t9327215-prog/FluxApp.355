export type StatusConta =
  | 'PENDENTE_VERIFICACAO'
  | 'ATIVA'
  | 'INATIVA'
  | 'SUSPENSA'
  | 'DELETADA';

export type TipoConta = 'PESSOAL' | 'COMERCIAL';

export interface Conta {
  id: string;
  email: string;
  status: StatusConta;
  tipo: TipoConta;
  data_de_criacao: string;
  data_de_atualizacao: string;
  data_de_verificacao: string | null;
  usuarioId: string;
}
