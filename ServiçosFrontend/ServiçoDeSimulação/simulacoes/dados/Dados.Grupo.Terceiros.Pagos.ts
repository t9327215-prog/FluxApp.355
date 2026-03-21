
import { Grupo } from '../../../types/Saida/Types.Estrutura.Grupos';

/**
 * @file Dados simulados para grupos de terceiros do tipo 'pago'.
 *
 * Estes são os grupos que aparecem na aba "Descobrir" e requerem um pagamento
 * para acesso.
 */

export const mockGruposDeTerceirosPagos: Grupo[] = [
  {
    id: 'descobrir-grupo-pago-1',
    nome: 'Curso de Marketing Digital Avançado',
    descricao: 'Aprenda as estratégias mais recentes de SEO, SEM e marketing de conteúdo com especialistas do setor.',
    tipo: 'pago',
    preco: 199.99,
    moeda: 'BRL',
    donoId: 'user-expert-marketing-1',
    dataCriacao: '2024-03-10T10:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
    provedorPagamentoId: 'stripe-conn-456',
    limiteMembros: 200,
  },
  {
    id: 'descobrir-grupo-pago-2',
    nome: 'Análises e Sinais de Ações',
    descricao: 'Receba análises diárias do mercado de ações, recomendações de compra/venda e relatórios mensais.',
    tipo: 'pago',
    preco: 79.90,
    moeda: 'BRL',
    donoId: 'user-investor-pro-2',
    dataCriacao: '2023-12-05T15:20:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
    provedorPagamentoId: 'paypal-conn-789',
  },
  {
    id: 'descobrir-grupo-pago-3',
    nome: 'Comunidade Premium de UI/UX Design',
    descricao: 'Networking, vagas exclusivas, portfólio review e mentorias para designers.',
    tipo: 'pago',
    preco: 49.99,
    moeda: 'USD',
    donoId: 'user-designer-lead-3',
    dataCriacao: '2024-01-20T09:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
    provedorPagamentoId: 'stripe-conn-101',
    vipDoor: {
      text: 'Junte-se a uma comunidade de elite de designers. Desbloqueie seu potencial criativo!',
      buttonText: 'Assinar Agora',
      media: [],
    },
  },
];
