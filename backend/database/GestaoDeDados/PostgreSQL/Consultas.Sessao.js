
import pool from '../../Processo.Conexao.Banco.Dados.js';

const criar = async (dadosSessao) => {
    const query = `
        INSERT INTO sessions (id, user_id, token, expires_at, user_agent, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    
    // Parâmetros são mapeados diretamente do objeto para garantir a ordem e integridade
    const params = [
        dadosSessao.id,
        dadosSessao.user_id,
        dadosSessao.token,
        dadosSessao.expires_at,
        dadosSessao.user_agent,
        dadosSessao.ip_address
    ];

    try {
        const resultado = await pool.query(query, params);
        console.log(`Sessão criada com sucesso para o usuário ${dadosSessao.user_id}`, { event: 'DB_CREATE_SESSION_SUCCESS' });
        return resultado.rows[0];
    } catch (error) {
        console.error('Erro detalhado ao criar sessão no banco de dados', {
            event: 'DB_CREATE_SESSION_ERROR',
            errorMessage: error.message,
            code: error.code, // Código de erro do PostgreSQL, ex: 23502
            stack: error.stack,
            query: query, // Loga a query para depuração
            userId: dadosSessao.user_id, // Loga o ID do usuário
        });
        
        // Relança o erro original para que as camadas superiores possam tratá-lo
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    const query = 'SELECT * FROM sessions WHERE token = $1';
    
    try {
        const resultado = await pool.query(query, [token]);
        return resultado.rows[0];
    } catch (error) {
        console.error('Erro ao buscar sessão por token', {
            event: 'DB_FIND_SESSION_BY_TOKEN_ERROR',
            errorMessage: error.message
        });
        throw new Error('Não foi possível buscar a sessão.');
    }
};

const deletarPorToken = async (token) => {
    const query = 'DELETE FROM sessions WHERE token = $1 RETURNING *';

    try {
        const resultado = await pool.query(query, [token]);
        if (resultado.rowCount > 0) {
            console.log(`Sessão com token foi deletada com sucesso.`, { event: 'DB_DELETE_SESSION_SUCCESS' });
            return resultado.rows[0];
        }
        console.warn(`Nenhuma sessão encontrada com o token para deletar.`, { event: 'DB_DELETE_SESSION_NOT_FOUND' });
        return null;
    } catch (error) {
        console.error('Erro ao deletar sessão por token', {
            event: 'DB_DELETE_SESSION_ERROR',
            errorMessage: error.message
        });
        throw new Error('Não foi possível deletar a sessão.');
    }
};

const consultasSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default consultasSessao;
