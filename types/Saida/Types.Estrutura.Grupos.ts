
export interface VipMediaItem {
    url: string;
    type: string;
}

export interface VipDoor {
    text: string;
    buttonText: string;
    media: VipMediaItem[];
}

export interface Pixel {
    id: string;
    token: string;
}

export interface Grupo {
  id: string;
  nome: string;
  descricao: string;
  tipo: "publico" | "privado" | "pago";
  preco?: number;
  moeda?: string;
  donoId: string;
  dataCriacao: string;
  limiteMembros?: number;
  imagemCapa?: string;
  tipoAcesso: "direto" | "convite";
  accessConfig?: any;
  provedorPagamentoId?: string;
  dataExpiracao?: string;
  vipDoor?: VipDoor;
  pixel?: Pixel;
}
