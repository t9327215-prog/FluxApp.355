import express from 'express';
import ControlesMetricasPublicacaoReels from '../controles/Controles.Metricas.Publicacao.Reels.js';

const router = express.Router();

router.get('/:reelId/metrics', ControlesMetricasPublicacaoReels.getReelMetrics);

export default router;
