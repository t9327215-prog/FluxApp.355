
import { Grupo } from '../../../types/Saida/Types.Estrutura.Grupos';

/**
 * @file Dados simulados para grupos de terceiros do tipo 'privado'.
 *
 * Estes são os grupos que aparecem na aba "Descobrir" e requerem convite
 * para acesso.
 */

export const mockGruposDeTerceirosPrivados: Grupo[] = [
  {
    id: 'descobrir-grupo-privado-1',
    nome: 'Clube de Leitura de Ficção Científica',
    descricao: 'Discussões aprofundadas sobre clássicos e lançamentos do gênero. Acesso via convite.',
    tipo: 'privado',
    donoId: 'user-sci-fi-fanatic',
    dataCriacao: '2023-05-22T19:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1588648169283-7424b547432f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'convite',
  },
  {
    id: 'descobrir-grupo-privado-2',
    nome: 'Beta Testers de App de Produtividade',
    descricao: 'Grupo fechado para testar novas funcionalidades e fornecer feedback sobre nosso app.',
    tipo: 'privado',
    donoId: 'user-product-manager-xyz',
    dataCriacao: '2024-03-15T16:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'convite',
  },
];
