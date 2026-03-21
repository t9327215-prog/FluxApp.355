import { Autor } from './Types.Estrutura.Autor';

export interface PublicacaoReels {
  id: string;
  usuarioId: string;
  urlVideo: string;
  descricao: string;
  idMusica: string;
  hashtags: string[];
  localizacao: string;
  dataCriacao: string; 
  dataAtualizacao: string;
  contagemCurtidas: number;
  contagemComentarios: number;
  autor: Autor;
}
