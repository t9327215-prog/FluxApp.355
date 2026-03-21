
import { Group } from '../../../types/Saida/Types.Estrutura.Grupos';
import { apiServicoGestaoListaGrupo } from '../APIs/APIsServicoGrupos/API.Servico.Gestao.Lista.Grupo';
import { mockMyGroups, mockPublicGroups } from '../ServiçoDeSimulação/simulacoes/Simulacao.Gestao.Lista.Grupo';
import { config } from '../ValidaçãoDeAmbiente/config';

class ServicoGestaoListaGrupo {

  async obterGrupos(): Promise<Group[]> {
    let publicGroups: Group[] = [];
    let myGroups: Group[] = [];

    try {
      if (config.VITE_APP_ENV === 'simulation') {
        console.log("[SIMULAÇÃO] Usando dados mocados para a lista de grupos, conforme configuração de ambiente.");
        publicGroups = mockPublicGroups;
        myGroups = mockMyGroups;
      } else {
        const [pub, mine] = await Promise.all([
          apiServicoGestaoListaGrupo.obterGruposPublicos(),
          apiServicoGestaoListaGrupo.obterMeusGrupos(),
        ]);
        publicGroups = pub;
        myGroups = mine;
      }

      const allGroups = [...(myGroups || []), ...(publicGroups || [])];
      const uniqueGroups = Array.from(new Map(allGroups.map(group => [group.id, group])).values());

      return uniqueGroups;

    } catch (error) {
      console.error("ServicoGestaoListaGrupo: Falha ao obter e processar grupos:", error);
      return [];
    }
  }

  async excluirGrupo(groupId: string): Promise<void> {
    if (config.VITE_APP_ENV === 'simulation') {
      console.log(`[SIMULAÇÃO] Grupo ${groupId} teria sido excluído.`);
      return Promise.resolve();
    }

    try {
      await apiServicoGestaoListaGrupo.excluirGrupo(groupId);
    } catch (error) {
      console.error(`ServicoGestaoListaGrupo: Erro ao solicitar a exclusão do grupo ${groupId}:`, error);
      throw error;
    }
  }
}

export const servicoGestaoListaGrupo = new ServicoGestaoListaGrupo();
