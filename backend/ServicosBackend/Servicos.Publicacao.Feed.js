
// backend/ServicosBackend/Servicos.Publicacao.Feed.js

import repositorioPublicacaoFeed from '../Repositorios/Repositorio.Publicacao.Feed.js';
import PublicacaoFeed from '../models/Models.Estrutura.Publicacao.Feed.js';

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const criarPost = async (postData, user) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária para criar um post.', 401);
    }

    const novaPublicacao = new PublicacaoFeed({
        autorId: user.id,
        conteudo: postData.content,
        urlMidia: postData.mediaUrl,
        idPostPai: postData.parentPostId,
        tipo: postData.type,
        opcoesEnquete: postData.pollOptions,
        linkCta: postData.ctaLink,
        textoCta: postData.ctaText
    });

    if (!novaPublicacao.conteudo || novaPublicacao.conteudo.trim().length === 0) {
        throw new AppError('O conteúdo do post é obrigatório.', 400);
    }

    const dadosParaBanco = novaPublicacao.paraBancoDeDados();
    const postCriadoDb = await repositorioPublicacaoFeed.criar(dadosParaBanco);
    const post = PublicacaoFeed.deBancoDeDados(postCriadoDb);

    return post.paraRespostaHttp();
};

const obterTodosOsPosts = async (options) => {
    const { data: postsDb, nextCursor } = await repositorioPublicacaoFeed.obterTodos(options);
    const posts = postsDb.map(PublicacaoFeed.deBancoDeDados);
    const postsHttp = posts.map(p => p.paraRespostaHttp());

    return { data: postsHttp, nextCursor };
};

const obterPostPorId = async (postId) => {
    const postDb = await repositorioPublicacaoFeed.obterPorId(postId);
    if (!postDb) {
        throw new AppError('Post não encontrado.', 404);
    }
    const post = PublicacaoFeed.deBancoDeDados(postDb);
    return post.paraRespostaHttp();
};

const atualizarPost = async (postId, postData, user) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const postExistente = await obterPostPorId(postId); // Já retorna no formato Http

    if (postExistente.autorId !== user.id) {
        throw new AppError('Usuário não autorizado a editar este post.', 403);
    }

    // A lógica de quais campos podem ser atualizados fica aqui
    const dadosParaAtualizar = {
        content: postData.content || postExistente.conteudo
        // Outros campos poderiam ser adicionados aqui
    };

    const postAtualizadoDb = await repositorioPublicacaoFeed.atualizar(postId, dadosParaAtualizar);
    const postAtualizado = PublicacaoFeed.deBancoDeDados(postAtualizadoDb);
    
    return postAtualizado.paraRespostaHttp();
};

const deletarPost = async (postId, user) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const postExistente = await obterPostPorId(postId);

    if (postExistente.autorId !== user.id) {
        throw new AppError('Usuário não autorizado a deletar este post.', 403);
    }

    const sucesso = await repositorioPublicacaoFeed.remover(postId);
    if (!sucesso) {
        throw new AppError('Falha ao deletar o post.', 500);
    }

    return { message: 'Post deletado com sucesso.' };
};

export default {
    criarPost,
    obterTodosOsPosts,
    obterPostPorId,
    atualizarPost,
    deletarPost,
};
