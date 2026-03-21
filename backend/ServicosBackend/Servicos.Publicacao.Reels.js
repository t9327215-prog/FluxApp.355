
// backend/ServicosBackend/Servicos.Publicacao.Reels.js
import RepositorioReels from '../Repositorios/Repositorio.Publicacao.Reels.js';
import PublicacaoReels from '../models/Models.Estrutura.Publicacao.Reels.js';

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const createReel = async (reelData, userId) => {
    if (!userId) {
        throw new AppError('Autenticação necessária para criar um reel.', 401);
    }

    const novoReel = new PublicacaoReels({
        usuarioId: userId,
        urlVideo: reelData.video_url,
        descricao: reelData.description,
        idMusica: reelData.music_id,
        hashtags: reelData.hashtags,
        localizacao: reelData.location
    });

    if (!novoReel.urlVideo) {
        throw new AppError('A URL do vídeo é obrigatória para criar um reel.', 400);
    }

    const dadosParaBanco = novoReel.paraBancoDeDados();
    const reelCriadoDb = await RepositorioReels.createReel(dadosParaBanco);
    const reel = PublicacaoReels.deBancoDeDados(reelCriadoDb);

    return reel.paraRespostaHttp();
};

const getAllReels = async (options) => {
    const reelsDb = await RepositorioReels.findAllReels(options);
    const reels = reelsDb.map(PublicacaoReels.deBancoDeDados);
    return reels.map(r => r.paraRespostaHttp());
};

const getReelById = async (reelId) => {
    if (!reelId || isNaN(parseInt(reelId))) {
        throw new AppError('ID de reel inválido fornecido.', 400);
    }
    const reelDb = await RepositorioReels.findReelById(reelId);
    if (!reelDb) {
        throw new AppError('Reel não encontrado.', 404);
    }
    const reel = PublicacaoReels.deBancoDeDados(reelDb);
    return reel.paraRespostaHttp();
};

const updateReel = async (reelId, updates, userId) => {
    if (!reelId || isNaN(parseInt(reelId))) {
        throw new AppError('ID de reel inválido para atualização.', 400);
    }

    const reelDb = await RepositorioReels.findReelById(reelId);
    if (!reelDb) {
        throw new AppError('Reel não encontrado para atualização.', 404);
    }

    if (reelDb.user_id !== userId) {
        throw new AppError('Usuário não autorizado a editar este reel.', 403);
    }

    // O repositório já lida com campos parciais, então passamos `updates` diretamente
    const reelAtualizadoDb = await RepositorioReels.updateReel(reelId, updates);
    const reelAtualizado = PublicacaoReels.deBancoDeDados(reelAtualizadoDb);

    return reelAtualizado.paraRespostaHttp();
};

const deleteReel = async (reelId, userId) => {
    if (!reelId || isNaN(parseInt(reelId))) {
        throw new AppError('ID de reel inválido para exclusão.', 400);
    }

    const reelDb = await RepositorioReels.findReelById(reelId);
    if (!reelDb) {
        throw new AppError('Reel não encontrado para exclusão.', 404);
    }

    if (reelDb.user_id !== userId) {
        throw new AppError('Usuário não autorizado a deletar este reel.', 403);
    }

    const sucesso = await RepositorioReels.deleteReel(reelId);
    if (!sucesso) {
        throw new AppError('Falha ao deletar o reel.', 500);
    }

    return { message: 'Reel deletado com sucesso.' };
};

export default {
    createReel,
    getAllReels,
    getReelById,
    updateReel,
    deleteReel
};
