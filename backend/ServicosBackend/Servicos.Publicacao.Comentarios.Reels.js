
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Reels.js
import { criarRepositorioDeComentarios } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comentario from '../models/Models.Estrutura.Comentarios.js';

const RepositorioComentariosReels = criarRepositorioDeComentarios('reel_comments', 'reel_id');

const checkPermissions = (userId, comentarioModel) => {
    if (!comentarioModel || !comentarioModel.autorId) {
        throw new Error('Dados do comentário incompletos para verificação de permissão.');
    }
    return comentarioModel.autorId === userId;
};

const createComment = async (commentData, reelId, userId) => {
    const { content } = commentData;
    if (!content) {
        throw new Error('O conteúdo do comentário não pode estar vazio.');
    }

    const novoComentario = new Comentario({
        postId: reelId, // No contexto de Reels, postId é o reelId
        autorId: userId,
        conteudo: content
    });

    const comentarioCriado = await RepositorioComentariosReels.criarComentario(novoComentario.paraBancoDeDados());
    const comentarioModel = Comentario.deBancoDeDados(comentarioCriado);
    return comentarioModel.paraRespostaHttp();
};

const getCommentsForReel = async (reelId, options) => {
    const comentariosDoBanco = await RepositorioComentariosReels.buscarComentariosPorParentId(reelId, options);

    return comentariosDoBanco.map(dados => {
        const comentarioModel = Comentario.deBancoDeDados(dados);
        return comentarioModel.paraRespostaHttp();
    });
};

const updateComment = async (commentId, updates, userId) => {
    const { content } = updates;
    if (!content) {
        throw new Error('O conteúdo para atualização não pode ser vazio.');
    }

    const dadosComentario = await RepositorioComentariosReels.buscarComentarioPorId(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Você não tem permissão para editar este comentário.');
    }

    const comentarioAtualizado = await RepositorioComentariosReels.atualizarComentario(commentId, { content });
    const modeloAtualizado = Comentario.deBancoDeDados(comentarioAtualizado);
    return modeloAtualizado.paraRespostaHttp();
};

const deleteComment = async (commentId, userId) => {
    const dadosComentario = await RepositorioComentariosReels.buscarComentarioPorId(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Você não tem permissão para deletar este comentário.');
    }

    await RepositorioComentariosReels.deletarComentario(commentId);
};

export default {
    createComment,
    getCommentsForReel,
    updateComment,
    deleteComment
};
