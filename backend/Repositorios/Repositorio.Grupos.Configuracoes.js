
import pool from '../database/pool.js';
import { ConsultasGruposConfiguracoes } from './Consultas/Consultas.Grupos.Configuracoes.js';

class RepositorioGruposConfiguracoes {

    /**
     * Atualiza as configurações de um grupo no banco de dados.
     * @param {object} configData - Os dados da configuração, validados pelo modelo.
     */
    async atualizarConfiguracoes(configData) {
        const { idGrupo, nome, descricao, privacidade } = configData;
        const query = ConsultasGruposConfiguracoes.ATUALIZAR_CONFIGURACOES;
        
        try {
            const [resultado] = await pool.query(query, [nome, descricao, privacidade, idGrupo]);
            return resultado;
        } catch (error) {
            console.error('DB_UPDATE_CONFIG_ERROR', error);
            throw error;
        }
    }

    /**
     * Busca as configurações de um grupo no banco de dados.
     * @param {string} idGrupo - O ID do grupo.
     */
    async obterConfiguracoes(idGrupo) {
        const query = ConsultasGruposConfiguracoes.OBTER_CONFIGURACOES_POR_ID;
        
        try {
            const [rows] = await pool.query(query, [idGrupo]);
            return rows[0];
        } catch (error) {
            console.error('DB_GET_CONFIG_ERROR', error);
            throw error;
        }
    }
    
    /**
     * Busca as diretrizes de um grupo no banco de dados.
     * @param {string} idGrupo - O ID do grupo.
     */
    async obterDiretrizes(idGrupo) {
        const query = ConsultasGruposConfiguracoes.OBTER_DIRETRIZES_POR_ID;
        
        try {
            const [rows] = await pool.query(query, [idGrupo]);
            return rows[0]; 
        } catch (error) {
            console.error('DB_GET_GUIDELINES_ERROR', error);
            throw error;
        }
    }

    /**
     * Atualiza as diretrizes de um grupo no banco de dados.
     * @param {string} idGrupo - O ID do grupo.
     * @param {string} diretrizes - As novas diretrizes do grupo.
     */
    async atualizarDiretrizes(idGrupo, diretrizes) {
        const query = ConsultasGruposConfiguracoes.ATUALIZAR_DIRETRIZES;
        
        try {
            const [resultado] = await pool.query(query, [diretrizes, idGrupo]);
            return resultado;
        } catch (error) {
            console.error('DB_UPDATE_GUIDELINES_ERROR', error);
            throw error;
        }
    }
}

export default new RepositorioGruposConfiguracoes();
