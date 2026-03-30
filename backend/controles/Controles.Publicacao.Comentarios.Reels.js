
import ServicoComentariosReels from '../ServicosBackend/Servicos.Publicacao.Comentarios.Reels.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
    semConteudo: (r) => r.status(204).send(),
};

const createComment = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando criação de comentário para Reel', { event: 'REEL_COMMENT_CREATE_START', reelId, userId, body: req.body });
    try {
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: reelId 
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        const comment = await ServicoComentariosReels.createComment(
            { texto: dadosValidados.texto }, 
            reelId, 
            userId
        );
        
        console.log('Comentário de Reel criado com sucesso', { event: 'REEL_COMMENT_CREATE_SUCCESS', commentId: comment.id, reelId, userId });
        
        httpRes.criado(res, comment);

    } catch (error) {
        console.error('Erro ao criar comentário de Reel', { 
            event: 'REEL_COMMENT_CREATE_ERROR',
            errorMessage: error.message,
            reelId, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const getCommentsForReel = async (req, res) => {
    const { reelId } = req.params;
    console.log('Buscando comentários para Reel', { event: 'REEL_COMMENTS_GET_START', reelId });
    try {
        const comments = await ServicoComentariosReels.getCommentsForReel(reelId, req.query);
        console.log('Busca de comentários para Reel bem-sucedida', { event: 'REEL_COMMENTS_GET_SUCCESS', reelId, count: comments.length });
        httpRes.sucesso(res, comments);
    } catch (error) {
        console.error('Erro ao buscar comentários de Reel', { event: 'REEL_COMMENTS_GET_ERROR', errorMessage: error.message, reelId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando atualização de comentário de Reel', { event: 'REEL_COMMENT_UPDATE_START', commentId, userId });
    try {
        const updatedComment = await ServicoComentariosReels.updateComment(commentId, req.body, userId);
        console.log('Comentário de Reel atualizado com sucesso', { event: 'REEL_COMMENT_UPDATE_SUCCESS', commentId, userId });
        httpRes.sucesso(res, updatedComment);
    } catch (error) {
        console.error('Erro ao atualizar comentário de Reel', { event: 'REEL_COMMENT_UPDATE_ERROR', errorMessage: error.message, commentId, userId, data: req.body });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando exclusão de comentário de Reel', { event: 'REEL_COMMENT_DELETE_START', commentId, userId });
    try {
        await ServicoComentariosReels.deleteComment(commentId, userId);
        console.log('Comentário de Reel excluído com sucesso', { event: 'REEL_COMMENT_DELETE_SUCCESS', commentId, userId });
        httpRes.semConteudo(res);
    } catch (error) {
        console.error('Erro ao excluir comentário de Reel', { event: 'REEL_COMMENT_DELETE_ERROR', errorMessage: error.message, commentId, userId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

export default {
    createComment,
    getCommentsForReel,
    updateComment,
    deleteComment
};
