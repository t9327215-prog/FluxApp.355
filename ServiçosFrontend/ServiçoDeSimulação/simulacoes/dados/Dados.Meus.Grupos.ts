
import { Grupo } from '../../../../types/Saida/Types.Estrutura.Grupos';
import { Usuario } from '../../../../types/Saida/Types.Estrutura.Usuario';

// Objeto simulado do dono para ser reutilizado
const donoSimulado: Partial<Usuario> = {
    id: 'uuid-proprio-simulado-123',
    email: 'proprio@email.simulado.com',
    nome: 'Usuario Proprio Simulado',
    apelido: 'proprio_simulado',
    urlFoto: 'https://i.pravatar.cc/150?u=proprio',
};

export const mockMeusGrupos: Grupo[] = [
  {
    id: 'meu-grupo-publico-1',
    nome: 'Amantes da Fotografia',
    descricao: 'Um espaço para compartilhar suas melhores fotos, técnicas e equipamentos.',
    tipo: 'publico',
    donoId: donoSimulado.id!,
    dono: donoSimulado, // <- Dados completos do dono adicionados
    dataCriacao: '2023-11-01T12:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
  },
  {
    id: 'meu-grupo-privado-1',
    nome: 'Clube do Livro Secreto',
    descricao: 'Discussões literárias sem spoilers. Apenas para membros convidados.',
    tipo: 'privado',
    donoId: donoSimulado.id!,
    dono: donoSimulado, // <- Dados completos do dono adicionados
    dataCriacao: '2023-10-26T10:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'convite',
  },
  {
    id: 'meu-grupo-pago-1',
    nome: 'Consultoria de Investimentos VIP',
    descricao: 'Análises de mercado exclusivas, dicas de investimento e relatórios semanais.',
    tipo: 'pago',
    preco: 99.90,
    moeda: 'BRL',
    donoId: donoSimulado.id!,
    dono: donoSimulado, // <- Dados completos do dono adicionados
    dataCriacao: '2024-01-15T14:30:00Z',
    limiteMembros: 100,
    imagemCapa: 'https://images.unsplash.com/photo-1640622300473-977435c38c04?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
    provedorPagamentoId: 'stripe-conn-123',
    vipDoor: {
        text: 'Acesso exclusivo para membros VIP. Desbloqueie análises de mercado agora!',
        buttonText: 'Tornar-se VIP',
        media: [{ url: 'https://example.com/video-promo.mp4', type: 'video' }]
    },
    pixel: {
        id: 'meta-pixel-12345',
        token: 'ABC-DEF-123'
    }
  },
  // Este grupo é de outro usuário e foi mantido para fins de teste
  {
    id: 'grupo-terceiro-publico-1',
    nome: 'Desenvolvedores ReactBR',
    descricao: 'Comunidade para desenvolvedores React trocarem experiências, dicas e vagas.',
    tipo: 'publico',
    donoId: 'user-dev-lead-456', 
    dono: { // Adicionando dados parciais para o outro usuário também
        id: 'user-dev-lead-456',
        nome: 'Líder Dev',
        apelido: 'react_guru',
        urlFoto: 'https://i.pravatar.cc/150?u=devlead',
    },
    dataCriacao: '2022-05-20T20:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
  },
];
