export interface CriarGrupoDTO {
  nome: string;
  donoId: number;
  tipo: 'publico' | 'privado' | 'pago';
  descricao?: string;
  preco?: number;
  moeda?: string;
  limiteMembros?: number;
}
