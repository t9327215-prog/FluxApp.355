
import express from 'express';
import comentariosReelsControle from '../controles/Controles.Publicacao.Comentarios.Reels.js';
import authMiddleware from '../config/Middleware.Autenticacao.JWT.js';

const router = express.Router({ mergeParams: true });

// @route   POST /
// @desc    Criar um comentário em um Reel
// @access  Private
router.post('/', authMiddleware, comentariosReelsControle.createComment);

// @route   GET /
// @desc    Obter todos os comentários de um Reel
// @access  Public
router.get('/', comentariosReelsControle.getCommentsForReel);

// @route   PUT /:commentId
// @desc    Atualizar um comentário em um Reel
// @access  Private
router.put('/:commentId', authMiddleware, comentariosReelsControle.updateComment);

// @route   DELETE /:commentId
// @desc    Deletar um comentário em um Reel
// @access  Private
router.delete('/:commentId', authMiddleware, comentariosReelsControle.deleteComment);

export default router;
