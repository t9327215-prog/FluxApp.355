// backend/RotasBackend/Rotas.Métricas.Comentário.Feed.js

import express from 'express';
import * as feedCommentMetricsController from '../controles/Controles.Metricas.Comentario.Feed.js';

const router = express.Router();

// Rota para rastrear um novo comentário
router.post('/comment', feedCommentMetricsController.trackComment);

// Rota para rastrear um like em um comentário
router.post('/comment/like', feedCommentMetricsController.trackCommentLike);

// Rota para rastrear uma resposta a um comentário
router.post('/comment/reply', feedCommentMetricsController.trackCommentReply);

export default router;
