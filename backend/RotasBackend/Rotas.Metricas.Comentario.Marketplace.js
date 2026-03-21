// backend/RotasBackend/Rotas.Métricas.Comentário.Marketplace.js

import express from 'express';
import * as marketplaceCommentMetricsController from '../controles/Controles.Metricas.Comentario.Marketplace.js';

const router = express.Router();

// Rota para rastrear um novo comentário
router.post('/comment', marketplaceCommentMetricsController.trackComment);

// Rota para rastrear um like em um comentário
router.post('/comment/like', marketplaceCommentMetricsController.trackCommentLike);

// Rota para rastrear uma resposta a um comentário
router.post('/comment/reply', marketplaceCommentMetricsController.trackCommentReply);

export default router;
