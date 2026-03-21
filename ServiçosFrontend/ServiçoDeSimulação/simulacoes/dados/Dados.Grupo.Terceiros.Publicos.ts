
import { Grupo } from '../../../types/Saida/Types.Estrutura.Grupos';

/**
 * @file Dados simulados para grupos de terceiros do tipo 'público'.
 *
 * Estes são os grupos que aparecem na aba "Descobrir" e têm acesso livre.
 */

export const mockGruposDeTerceirosPublicos: Grupo[] = [
  {
    id: 'descobrir-grupo-publico-1',
    nome: 'Amantes de Culinária BR 🍳',
    descricao: 'Compartilhe suas receitas, dicas de cozinha e fotos de pratos. De amadores a chefs!',
    tipo: 'publico',
    donoId: 'user-chef-master-br',
    dataCriacao: '2023-02-18T14:00:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
    limiteMembros: 10000,
  },
  {
    id: 'descobrir-grupo-publico-2',
    nome: 'Dicas de Jardinagem para Apartamento',
    descricao: 'Cultive seu próprio jardim em pequenos espaços. Dicas sobre plantas, vasos e cuidados.',
    tipo: 'publico',
    donoId: 'user-green-thumb-apt',
    dataCriacao: '2023-09-05T11:30:00Z',
    imagemCapa: 'https://images.unsplash.com/photo-1592234954231-581b2bf24f8c?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
    tipoAcesso: 'direto',
  },
];
