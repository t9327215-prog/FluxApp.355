import { Autor } from './Types.Estrutura.Autor';

export interface PublicacaoMarketplace {
  id: string;
  usuarioId: string;
  titulo: string;
  descricao: string;
  preco: number;
  categoria: string;
  localizacao: string;
  urlsImagens: string[];
  dataCriacao: string;
  dataAtualizacao: string;
  autor: Autor;
}
