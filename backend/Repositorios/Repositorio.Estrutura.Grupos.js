import pool from '../database/pool.js';
import { inserirGrupo } from '../database/GestaoDeDados/PostgreSQL/Consultas.Grupo.js';

class RepositorioEstruturaGrupos {
    
    /**
     * Cria um novo grupo no banco de dados.
     * @param {object} dadosDoGrupo - Objeto contendo os dados do grupo, 
     *                                geralmente vindo de `modelo.paraBancoDeDados()`.
     * @returns {Promise<object>} - O registro do grupo como foi salvo no banco.
     */
    async criar(dadosDoGrupo) { 
        // A ordem das propriedades aqui é crucial e deve corresponder à ordem na consulta SQL.
        const values = [
            dadosDoGrupo.id,
            dadosDoGrupo.name,
            dadosDoGrupo.description,
            dadosDoGrupo.group_type,
            dadosDoGrupo.price,
            dadosDoGrupo.currency,
            dadosDoGrupo.creator_id,
            dadosDoGrupo.created_at,
            dadosDoGrupo.member_limit,
            dadosDoGrupo.cover_image,
            dadosDoGrupo.access_type,
            dadosDoGrupo.selected_provider_id,
            dadosDoGrupo.expiration_date,
            dadosDoGrupo.vip_door,
            dadosDoGrupo.pixel_id,
            dadosDoGrupo.pixel_token,
            dadosDoGrupo.is_vip,
            dadosDoGrupo.status
        ];

        try {
            const { rows } = await pool.query(inserirGrupo, values);
            return rows[0]; // Retorna a linha inserida, com os aliases definidos na consulta
        } catch (error) {
            console.error("Erro no Repositorio.Estrutura.Grupos ao criar grupo:", error);
            throw new Error("Falha ao salvar o grupo no banco de dados.");
        }
    }

    // Futuramente, outros métodos como buscarPorId, atualizar, etc., podem ser adicionados.
}

export default new RepositorioEstruturaGrupos();
