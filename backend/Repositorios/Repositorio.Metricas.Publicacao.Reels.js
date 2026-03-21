import { countLikes, countViews, countShares, countComments } from '../database/GestaoDeDados/PostgreSQL/Consultas.Metricas.Publicacao.Reels.js';

export const getReelLikes = (reelId) => countLikes(reelId);
export const getReelViews = (reelId) => countViews(reelId);
export const getReelShares = (reelId) => countShares(reelId);
export const getReelComments = (reelId) => countComments(reelId);
