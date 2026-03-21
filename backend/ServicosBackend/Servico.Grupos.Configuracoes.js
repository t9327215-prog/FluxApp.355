
import Repositorio from '../Repositorios/Repositorio.Grupos.Configuracoes.js';
import ModeloConfig from '../models/Models.Estrutura.Configuracoes.Grupo.js';

class ServicoGruposConfiguracoes {

    /**
     * Atualiza as configurações de um grupo.
     */
    async atualizarConfiguracoes(idGrupo, dadosConfig) {
        try {
            const dadosCompletos = { ...dadosConfig, idGrupo };
            const modelo = new ModeloConfig(dadosCompletos);
            const dadosValidados = modelo.toObject();

            const resultado = await Repositorio.atualizarConfiguracoes(dadosValidados);

            if (resultado.affectedRows === 0) {
                throw new Error('Nenhum grupo foi atualizado. Verifique o id do grupo.');
            }
            
            return { mensagem: "Configurações atualizadas com sucesso!" };

        } catch (error) {
            // Propaga o erro para ser tratado pelo controlador
            throw error;
        }
    }

    /**
     * Obtém as configurações de um grupo.
     */
    async obterConfiguracoes(idGrupo) {
        try {
            const dados = await Repositorio.obterConfiguracoes(idGrupo);
            if (!dados) {
                return null; // Ou lançar um erro de "não encontrado"
            }
            const modelo = ModeloConfig.fromObject(dados);
            return modelo.toObject();

        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtém as diretrizes de um grupo.
     */
    async obterDiretrizes(idGrupo) {
        try {
            const dados = await Repositorio.obterDiretrizes(idGrupo);
            if (!dados) {
                return null;
            }
            return dados;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Atualiza as diretrizes de um grupo.
     */
    async atualizarDiretrizes(idGrupo, diretrizes) {
        try {
            const resultado = await Repositorio.atualizarDiretrizes(idGrupo, diretrizes);

            if (resultado.affectedRows === 0) {
                throw new Error('Nenhum grupo foi atualizado. Verifique o id do grupo.');
            }
            
            return { mensagem: "Diretrizes atualizadas com sucesso!" };

        } catch (error) {
            throw error;
        }
    }
}

export default new ServicoGruposConfiguracoes();
