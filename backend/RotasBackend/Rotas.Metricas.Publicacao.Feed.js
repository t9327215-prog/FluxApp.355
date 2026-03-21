import express from 'express';
import { getPostMetrics } from '../controles/Controles.Metricas.Publicacao.Feed.js';

const router = express.Router();

// Rota para buscar métricas de uma publicação específica
router.get('/:postId/metrics', getPostMetrics);

export default router;
