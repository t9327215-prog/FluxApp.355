
import pool from '../../pool.js';
import ServicoLog from '../../../ServicosBackend/Servico.Logs.Backend.js';

const criar = async (dadosUsuario) => {
    const contexto = "Consultas.Usuario.criar";
    const cliente = await pool.connect();
    
    const { 
        id, name, email, password_hash, google_id, 
        nickname, bio, website, photo_url, is_private, profile_completed 
    } = dadosUsuario;

    const queryUser = `
        INSERT INTO users (id, name, email, password_hash, google_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    const valuesUser = [id, name, email, password_hash, google_id];

    const queryProfile = `
        INSERT INTO profiles (user_id, nickname, bio, website, photo_url, is_private, profile_completed)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    const valuesProfile = [id, nickname, bio, website, photo_url, is_private, profile_completed];

    try {
        await cliente.query('BEGIN');
        ServicoLog.info(contexto, "Iniciando transação para criar novo usuário.", { email });

        await cliente.query(queryUser, valuesUser);
        ServicoLog.debug(contexto, "Inserido na tabela users.", { userId: id });

        await cliente.query(queryProfile, valuesProfile);
        ServicoLog.debug(contexto, "Inserido na tabela profiles.", { userId: id });

        await cliente.query('COMMIT');
        ServicoLog.info(contexto, "Transação concluída. Usuário criado com sucesso.", { userId: id });

        // Após criar, busca o usuário completo para retornar
        return await encontrarPorId(id, cliente); 

    } catch (error) {
        await cliente.query('ROLLBACK');
        ServicoLog.erro(contexto, 'Erro na transação de criação de usuário. Rollback executado.', error);
        if (error.code === '23505') { // unique_violation
            throw new Error('Email ou ID do Google já está em uso.');
        }
        throw new Error('Erro ao registrar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const queryJoin = `
    SELECT
        u.id, u.name, u.email, u.google_id, u.password_hash,
        p.nickname, p.bio, p.website, p.photo_url, p.is_private, p.profile_completed,
        u.created_at, u.updated_at
    FROM
        users u
    LEFT JOIN
        profiles p ON u.id = p.user_id
`;

const encontrarPorId = async (id, cliente = pool) => {
    const contexto = "Consultas.Usuario.encontrarPorId";
    const query = `${queryJoin} WHERE u.id = $1`;
    ServicoLog.info(contexto, `Buscando usuário com o id: ${id}`);
    
    try {
        const { rows } = await cliente.query(query, [id]);
        return rows[0];
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar usuário por ID', error);
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
}

const encontrarPorEmail = async (email) => {
    const contexto = "Consultas.Usuario.encontrarPorEmail";
    const query = `${queryJoin} WHERE u.email = $1`;
    ServicoLog.info(contexto, `Buscando usuário com o email: ${email}`);
    
    try {
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar usuário por email', error);
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const encontrarPorGoogleId = async (googleId) => {
    const contexto = "Consultas.Usuario.encontrarPorGoogleId";
    const query = `${queryJoin} WHERE u.google_id = $1`;
    ServicoLog.info(contexto, `Buscando usuário com o Google ID: ${googleId}`);

    try {
        const { rows } = await pool.query(query, [googleId]);
        return rows[0];
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar usuário por Google ID', error);
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const consultasUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
};

export default consultasUsuario;
