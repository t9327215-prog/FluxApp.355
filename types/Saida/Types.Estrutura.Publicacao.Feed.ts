import { Autor } from './Types.Estrutura.Autor';

export interface PublicacaoFeed {
  id: string;
  autorId: string;
  conteudo: string;
  urlMidia?: string;
  idPostPai?: string;
  tipo: string;
  opcoesEnquete?: any;
  linkCta?: string;
  textoCta?: string;
  conteudoAdulto: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  autor: Autor;
}
