
import pool from '../../pool.js';
import ServicoLog from '../../../ServicosBackend/Servico.Logs.Backend.js';

const criar = async (dadosSessao) => {
    const contexto = "Consultas.Sessao.criar";
    const { id, user_id, token, expires_at, user_agent, ip_address, created_at } = dadosSessao;
    const query = `
        INSERT INTO sessions (id, user_id, token, expires_at, user_agent, ip_address, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
    const params = [id, user_id, token, expires_at, user_agent, ip_address, created_at];

    try {
        const resultado = await pool.query(query, params);
        ServicoLog.info(contexto, `Sessão criada para o usuário ${user_id}`);
        return resultado.rows[0];
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao criar sessão no banco de dados', error);
        throw new Error('Erro ao criar sessão no banco de dados');
    }
};

const encontrarPorToken = async (token) => {
    const contexto = "Consultas.Sessao.encontrarPorToken";
    const query = 'SELECT * FROM sessions WHERE token = $1';
    
    try {
        const resultado = await pool.query(query, [token]);
        return resultado.rows[0];
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar sessão por token', error);
        throw new Error('Erro ao buscar sessão por token');
    }
};

const deletarPorToken = async (token) => {
    const contexto = "Consultas.Sessao.deletarPorToken";
    const query = 'DELETE FROM sessions WHERE token = $1 RETURNING *';

    try {
        const resultado = await pool.query(query, [token]);
        ServicoLog.info(contexto, `Sessão com token ${token} deletada.`);
        return resultado.rows[0];
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao deletar sessão por token', error);
        throw new Error('Erro ao deletar sessão por token');
    }
};

const consultasSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default consultasSessao;
