// backend/RotasBackend/Rotas.Métricas.Comentário.Reels.js

import express from 'express';
import * as reelsCommentMetricsController from '../controles/Controles.Metricas.Comentario.Reels.js';

const router = express.Router();

// Rota para rastrear um novo comentário
router.post('/comment', reelsCommentMetricsController.trackComment);

// Rota para rastrear um like em um comentário
router.post('/comment/like', reelsCommentMetricsController.trackCommentLike);

// Rota para rastrear uma resposta a um comentário
router.post('/comment/reply', reelsCommentMetricsController.trackCommentReply);

export default router;
