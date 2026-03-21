import { countLikes, countViews, countShares, countComments } from '../database/GestaoDeDados/PostgreSQL/Consultas.Metricas.Publicacao.Feed.js';

export const getPostLikes = (postId) => countLikes(postId);
export const getPostViews = (postId) => countViews(postId);
export const getPostShares = (postId) => countShares(postId);
export const getPostComments = (postId) => countComments(postId);
