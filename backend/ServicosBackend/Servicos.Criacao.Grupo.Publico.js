import { v4 as uuidv4 } from 'uuid';
// Importa o repositório unificado
import RepositorioGrupo from '../Repositorios/Repositorio.Estrutura.Grupos.js'; 
import Grupo from '../models/Models.Estrutura.Grupos.js';

class ServicoCriacaoGrupoPublico {
    async criar(dados) {
        try {
            const novoGrupo = new Grupo({
                id: uuidv4(),
                nome: dados.nome,
                descricao: dados.descricao,
                limiteMembros: dados.limiteMembros,
                donoId: dados.donoId,
                tipo: 'publico',
                preco: 0
            });

            const dadosParaBanco = novoGrupo.paraBancoDeDados();

            // Usa o repositório unificado
            const grupoSalvoNoBanco = await RepositorioGrupo.criar(dadosParaBanco); 

            const modeloGrupoSalvo = Grupo.deBancoDeDados(grupoSalvoNoBanco);

            return modeloGrupoSalvo.paraRespostaHttp();

        } catch (error) {
            console.error("Erro no serviço ao criar grupo público:", error.message);
            throw error;
        }
    }
}

export default new ServicoCriacaoGrupoPublico();
