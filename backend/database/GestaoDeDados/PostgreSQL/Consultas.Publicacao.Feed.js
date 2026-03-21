
// backend/database/GestaoDeDados/PostgreSQL/Consultas.Publicacao.Feed.js

import repositorioPublicacaoFeed from '../../../Repositorios/Repositorio.Publicacao.Feed.js';

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const validarDadosDoPost = (data) => {
    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
        throw new AppError('O conteúdo do post é obrigatório.', 400);
    }
    if (!data.author_id) {
        throw new AppError('A identidade do usuário é inválida.', 401);
    }
    return true;
};

const criarPost = async (postData) => {
    validarDadosDoPost(postData);
    return await repositorioPublicacaoFeed.criar(postData);
};

const obterTodosOsPosts = async (options) => {
    return await repositorioPublicacaoFeed.obterTodos(options);
};

const obterPostPorId = async (postId) => {
    if (!postId || isNaN(parseInt(postId))) {
        throw new AppError('ID de post inválido.', 400);
    }
    return await repositorioPublicacaoFeed.obterPorId(postId);
};

const atualizarPost = async (postId, postData) => {
    if (!postId || isNaN(parseInt(postId))) {
        throw new AppError('ID de post inválido.', 400);
    }
    return await repositorioPublicacaoFeed.atualizar(postId, postData);
};

const deletarPost = async (postId) => {
    if (!postId || isNaN(parseInt(postId))) {
        throw new AppError('ID de post inválido.', 400);
    }
    return await repositorioPublicacaoFeed.remover(postId);
};

export default {
    criarPost,
    obterTodosOsPosts,
    obterPostPorId,
    atualizarPost,
    deletarPost,
};
