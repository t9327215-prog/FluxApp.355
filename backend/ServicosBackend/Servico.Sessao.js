
// backend/ServicosBackend/Servico.Sessao.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import Sessao from '../models/Models.Estrutura.Sessao.js'; // Re-adicionado

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';
const JWT_EXPIRES_IN = '24h';

const calcularDataExpiracao = () => {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
};

// Apenas prepara os dados, sem validar. A validação é responsabilidade do controlador.
const prepararNovaSessao = async ({ usuario, dadosRequisicao }) => {
    if (!usuario || !usuario.id) {
        throw new Error('Dados de usuário inválidos para criar a sessão.');
    }

    console.log('Preparando nova sessão', { event: 'SESSION_PREPARE_START', userId: usuario.id });

    const payload = { user: usuario.paraRespostaHttp() };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const dadosSessao = {
        user_id: usuario.id,
        token,
        expires_at: calcularDataExpiracao(),
        ipAddress: dadosRequisicao.ipAddress, // Mantido como camelCase para o validador
        userAgent: dadosRequisicao.userAgent, // Mantido como camelCase para o validador
    };
    
    return { token, dadosSessao };
};

// Usa o model para garantir a estrutura correta dos dados
const salvarSessao = async (dadosSessaoValidados) => {
    console.log('Iniciando salvamento da sessão.', { event: 'SESSION_SAVE_START', userId: dadosSessaoValidados.user_id });
    
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados,
    });

    await repositorioSessao.criar(novaSessao.paraBancoDeDados());
    console.log('Sessão salva com sucesso no banco de dados.', { event: 'SESSION_SAVE_SUCCESS', userId: dadosSessaoValidados.user_id });
};

const encerrarSessao = async (token) => {
    console.log('Iniciando processo de encerramento de sessão (logout).', { event: 'SESSION_END_START' });

    await repositorioSessao.deletarPorToken(token);

    console.log('Sessão encerrada e removida com sucesso.', { event: 'SESSION_END_SUCCESS' });
    return { message: 'Logout realizado com sucesso.' };
};

export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
};
