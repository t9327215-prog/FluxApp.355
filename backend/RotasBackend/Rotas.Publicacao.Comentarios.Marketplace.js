
import express from 'express';
import comentariosMarketplaceControle from '../controles/Controles.Publicacao.Comentarios.Marketplace.js';
import authMiddleware from '../config/Middleware.Autenticacao.JWT.js'; // Caminho corrigido

const router = express.Router();

// @route   PUT /:commentId
// @desc    Atualizar um comentário no marketplace
// @access  Private
router.put('/:commentId', authMiddleware, comentariosMarketplaceControle.atualizarComentario);

// @route   DELETE /:commentId
// @desc    Deletar um comentário no marketplace
// @access  Private
router.delete('/:commentId', authMiddleware, comentariosMarketplaceControle.deletarComentario);

export default router;
