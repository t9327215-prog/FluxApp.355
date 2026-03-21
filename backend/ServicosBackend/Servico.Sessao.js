
// backend/ServicosBackend/Servico.Sessao.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import ServicoLog from './Servico.Logs.Backend.js';
import Sessao from '../models/Models.Estrutura.Sessao.js'; // Corrigido: Importando o modelo de Sessão

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';
const contextoBase = "Servico.Sessao";

/**
 * Prepara os dados de uma nova sessão e gera um token JWT, sem persistir no banco.
 */
const prepararNovaSessao = async (data) => {
    const contexto = `${contextoBase}.prepararNovaSessao`;
    const { usuario, dadosRequisicao } = data;

    if (!usuario || !usuario.id) {
        throw new Error('Dados de usuário inválidos para criar sessão.');
    }

    ServicoLog.info(contexto, `Preparando sessão para o usuário ${usuario.id}`);

    const payload = { user: usuario.paraRespostaHttp() };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    const dadosSessao = {
        idUsuario: usuario.id,
        token,
        userAgent: dadosRequisicao.userAgent,
        enderecoIp: dadosRequisicao.ipAddress,
    };
    
    return { token, dadosSessao };
};

/**
 * Salva os dados de uma sessão validada no repositório.
 */
const salvarSessao = async (dadosSessaoValidados) => {
    const contexto = `${contextoBase}.salvarSessao`;
    ServicoLog.info(contexto, `Salvando sessão para o usuário ${dadosSessaoValidados.idUsuario}`);
    
    // Corrigido: Cria uma instância do modelo Sessao
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados, // Usa os dados já validados pelo controlador
        dataExpiracao: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    });

    // Corrigido: Passa o objeto formatado para o banco de dados
    await repositorioSessao.criar(novaSessao.paraBancoDeDados());
    ServicoLog.info(contexto, `Sessão para ${dadosSessaoValidados.idUsuario} salva com sucesso.`);
};


/**
 * Invalida um token de sessão (logout).
 */
const encerrarSessao = async (token) => {
    const contexto = `${contextoBase}.encerrarSessao`;
    ServicoLog.info(contexto, "Iniciando processo de logout.");

    await repositorioSessao.invalidar(token);

    ServicoLog.info(contexto, "Sessão invalidada com sucesso.");
    return { message: "Logout bem-sucedido" };
};

export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
};