import { getPostLikes, getPostViews, getPostShares, getPostComments } from '../Repositorios/Repositorio.Metricas.Publicacao.Feed.js';

export const getPostMetrics = async (postId) => {
    const likes = await getPostLikes(postId);
    const views = await getPostViews(postId);
    const shares = await getPostShares(postId);
    const comments = await getPostComments(postId);

    return {
        likes,
        views,
        shares,
        comments,
    };
};
