
import { Grupo } from '../../../types/Saida/Types.Estrutura.Grupos';

// Importando os dados modulares
import { mockMeusGrupos } from './dados/Dados.Meus.Grupos';
import { mockGruposDeTerceirosPagos } from './dados/Dados.Grupo.Terceiros.Pagos';
import { mockGruposDeTerceirosPublicos } from './dados/Dados.Grupo.Terceiros.Publicos';
import { mockGruposDeTerceirosPrivados } from './dados/Dados.Grupo.Terceiros.Privados';

/**
 * @file Orquestrador de dados simulados para a lista de grupos.
 *
 * Este arquivo importa diferentes conjuntos de dados, os combina e os exporta
 * com os nomes esperados pela camada de serviço (`mockMyGroups` e `mockPublicGroups`),
 * garantindo que a simulação funcione corretamente.
 */

/**
 * ===================================================================
 * EXPORTAÇÃO PARA A CAMADA DE SERVIÇO
 * ===================================================================
 */

// Exporta diretamente os grupos do usuário com o nome que o serviço espera.
export const mockMyGroups: Grupo[] = [...mockMeusGrupos];

// Combina todos os grupos de terceiros em uma única lista para a aba "Descobrir".
export const mockPublicGroups: Grupo[] = [
  ...mockGruposDeTerceirosPublicos,
  ...mockGruposDeTerceirosPagos,
  ...mockGruposDeTerceirosPrivados,
];
