import { Autor } from './Types.Estrutura.Autor';

export interface Comentario {
  id: string;
  postId: string;
  autorId: string;
  conteudo: string;
  dataCriacao: string;
  dataAtualizacao: string;
  autor: Autor;
}
