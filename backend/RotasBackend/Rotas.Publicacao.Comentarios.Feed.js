
import express from 'express';
import comentariosController from '../controles/Controles.Publicacao.Comentarios.Feed.js';
import authMiddleware from '../config/Middleware.Autenticacao.JWT.js'; // Caminho corrigido

const router = express.Router();

// @route   PUT /:commentId
// @desc    Atualizar um comentário específico do feed
// @access  Private
router.put('/:commentId', authMiddleware, comentariosController.atualizarComentario);

// @route   DELETE /:commentId
// @desc    Deletar um comentário específico do feed
// @access  Private
router.delete('/:commentId', authMiddleware, comentariosController.deletarComentario);

export default router;
