
// @/ServiçosFrontend/ServiçoDeSimulação/simulacoes/Simulacao.Pagina.Vendas.ts

/**
 * Simula os dados completos para a página de vendas de um grupo VIP.
 * Este objeto contém todas as informações necessárias para renderizar
 * a página de preview de um grupo pago, incluindo detalhes do grupo,
 * mídia, textos de marketing (copy), e opções de preço.
 */
export const mockVipGroupSalesData = {
  // Informações centrais do grupo
  group: {
    id: 'vip-group-123',
    name: 'Clube dos Programadores de Elite',
    avatarUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop',
    description: 'A comunidade definitiva para desenvolvedores que querem levar suas habilidades para o próximo nível. Acesso a conteúdo exclusivo, mentoria e networking com os melhores do mercado.',
    owner: {
      name: 'Isabella Costa',
      avatarUrl: 'https://i.pravatar.cc/150?u=isabella-costa',
      bio: 'Desenvolvedora Sênior @ Flux | Criadora de Conteúdo'
    },
    memberCount: 1254,
    rating: 4.9,
    testimonials: [
      { id: 1, name: 'Maria Dev', text: 'Este grupo mudou minha carreira!', avatarUrl: 'https://i.pravatar.cc/100?u=maria' },
      { id: 2, name: 'Carlos Coder', text: 'O conteúdo é de altíssima qualidade.', avatarUrl: 'https://i.pravatar.cc/100?u=carlos' },
      { id: 3, name: 'Ana Scripter', text: 'Networking incrível, recomendo!', avatarUrl: 'https://i.pravatar.cc/100?u=ana' }
    ],
  },

  // Mídia para a galeria da página de vendas
  media: [
    { type: 'image', url: 'https://images.unsplash.com/photo-1517694712202-1428bc3b2038?q=80&w=2070', thumbnail: 'https://images.unsplash.com/photo-1517694712202-1428bc3b2038?q=80&w=400' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070', thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400' },
    { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400' }
  ],

  // Textos de marketing (copywriting)
  copy: {
    title: 'Acesso Imediato à Elite da Programação',
    longDescription: `<p>Junte-se ao <strong>Clube dos Programadores de Elite</strong> e tenha acesso a um ecossistema completo de aprendizado e crescimento. Nossa missão é acelerar sua carreira com desafios práticos, conteúdo aprofundado e conexões valiosas.</p><br><p>Esqueça os cursos tradicionais. Aqui, você aprende na prática, construindo projetos relevantes e interagindo com uma comunidade que te impulsiona para frente.</p>`,
    benefits: [
      { icon: 'fa-solid fa-code', title: 'Conteúdo Exclusivo', description: 'Aulas, workshops e artigos que você não encontra em nenhum outro lugar.' },
      { icon: 'fa-solid fa-users', title: 'Comunidade Ativa', description: 'Tire dúvidas e colabore com outros desenvolvedores apaixonados por tecnologia.' },
      { icon: 'fa-solid fa-briefcase', title: 'Oportunidades de Carreira', description: 'Acesso a vagas exclusivas e indicações para as melhores empresas.' },
      { icon: 'fa-solid fa-trophy', title: 'Desafios e Projetos', description: 'Participe de desafios de código semanais e construa um portfólio de peso.' }
    ]
  },

  // Estrutura de preços do grupo VIP
  pricing: {
    monthly: { price: 99.90, currency: 'BRL', planId: 'plan_monthly_123' },
    yearly: { price: 999.90, currency: 'BRL', planId: 'plan_yearly_123' },
    lifetime: { price: 2999.90, currency: 'BRL', planId: 'plan_lifetime_123' }
  }
};

export type VipGroupSalesData = typeof mockVipGroupSalesData;
