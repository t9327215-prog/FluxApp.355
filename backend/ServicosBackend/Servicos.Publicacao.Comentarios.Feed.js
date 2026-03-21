
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Feed.js
import { criarRepositorioDeComentarios } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comentario from '../models/Models.Estrutura.Comentarios.js';

const RepositorioComentariosFeed = criarRepositorioDeComentarios('feed_comments', 'post_id');

const checkPermissions = (userId, comentarioModel) => {
    if (!comentarioModel || !comentarioModel.autorId) {
        throw new Error('Dados do comentário incompletos para verificação de permissão.');
    }
    return comentarioModel.autorId === userId;
};

const criarComentario = async (commentBody, postId, userId) => {
    const { content } = commentBody;
    if (!content) {
        throw new Error('O conteúdo do comentário não pode estar vazio.');
    }

    const novoComentario = new Comentario({
        postId: postId,
        autorId: userId,
        conteudo: content
    });

    const comentarioCriado = await RepositorioComentariosFeed.criarComentario(novoComentario.paraBancoDeDados());
    const comentarioModel = Comentario.deBancoDeDados(comentarioCriado);
    return comentarioModel.paraRespostaHttp();
};

const obterComentariosPorPostId = async (postId, options) => {
    if (!postId) {
        throw new Error('O ID do post é necessário para buscar os comentários.');
    }
    const queryOptions = { limit: 10, offset: 0, ...options };
    const comentariosDoBanco = await RepositorioComentariosFeed.buscarComentariosPorParentId(postId, queryOptions);
    
    return comentariosDoBanco.map(dados => {
        const comentarioModel = Comentario.deBancoDeDados(dados);
        return comentarioModel.paraRespostaHttp();
    });
};

const atualizarComentario = async (commentId, updates, userId) => {
    const { content } = updates;
    if (!content) {
        throw new Error('O conteúdo para atualização não pode ser vazio.');
    }

    const dadosComentario = await RepositorioComentariosFeed.buscarComentarioPorId(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Você não tem permissão para editar este comentário.');
    }

    const comentarioAtualizado = await RepositorioComentariosFeed.atualizarComentario(commentId, { content });
    const modeloAtualizado = Comentario.deBancoDeDados(comentarioAtualizado);
    return modeloAtualizado.paraRespostaHttp();
};

const deletarComentario = async (commentId, userId) => {
    const dadosComentario = await RepositorioComentariosFeed.buscarComentarioPorId(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }
    
    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Você não tem permissão para deletar este comentário.');
    }

    await RepositorioComentariosFeed.deletarComentario(commentId);
};

export default {
    criarComentario,
    obterComentariosPorPostId,
    atualizarComentario,
    deletarComentario
};
