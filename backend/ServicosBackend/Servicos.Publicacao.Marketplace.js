
// backend/ServicosBackend/Servicos.Publicacao.Marketplace.js
import RepositorioMarketplace from '../Repositorios/Repositorio.Publicacao.Marketplace.js';
import PublicacaoMarketplace from '../models/Models.Estrutura.Publicacao.Marketplace.js';

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const criarItem = async (itemData, userId) => {
    if (!userId) {
        throw new AppError('Autenticação necessária para criar um item.', 401);
    }

    const novoItem = new PublicacaoMarketplace({
        usuarioId: userId,
        titulo: itemData.title,
        descricao: itemData.description,
        preco: itemData.price,
        categoria: itemData.category,
        localizacao: itemData.location,
        urlsImagens: itemData.image_urls
    });

    if (!novoItem.titulo || !novoItem.preco || !novoItem.categoria) {
        throw new AppError('Título, preço e categoria são obrigatórios.', 400);
    }

    const dadosParaBanco = novoItem.paraBancoDeDados();
    const itemCriadoDb = await RepositorioMarketplace.criarItem(dadosParaBanco);
    const item = PublicacaoMarketplace.deBancoDeDados(itemCriadoDb);

    return item.paraRespostaHttp();
};

const obterTodosItens = async (options) => {
    const itensDb = await RepositorioMarketplace.encontrarTodosItens(options);
    const itens = itensDb.map(PublicacaoMarketplace.deBancoDeDados);
    return itens.map(item => item.paraRespostaHttp());
};

const obterItemPorId = async (itemId) => {
    if (!itemId || isNaN(parseInt(itemId))) {
        throw new AppError('ID do item inválido.', 400);
    }
    const itemDb = await RepositorioMarketplace.encontrarItemPorId(itemId);
    if (!itemDb) {
        throw new AppError('Item não encontrado.', 404);
    }
    const item = PublicacaoMarketplace.deBancoDeDados(itemDb);
    return item.paraRespostaHttp();
};

const atualizarItem = async (itemId, updates, userId) => {
    if (!itemId || isNaN(parseInt(itemId))) {
        throw new AppError('ID do item inválido para atualização.', 400);
    }

    const itemDb = await RepositorioMarketplace.encontrarItemPorId(itemId);
    if (!itemDb) {
        throw new AppError('Item não encontrado para atualização.', 404);
    }

    if (itemDb.user_id !== userId) {
        throw new AppError('Você não tem permissão para editar este item.', 403);
    }

    const itemAtualizadoDb = await RepositorioMarketplace.atualizarItem(itemId, updates);
    const itemAtualizado = PublicacaoMarketplace.deBancoDeDados(itemAtualizadoDb);

    return itemAtualizado.paraRespostaHttp();
};

const deletarItem = async (itemId, userId) => {
    if (!itemId || isNaN(parseInt(itemId))) {
        throw new AppError('ID do item inválido para exclusão.', 400);
    }

    const itemDb = await RepositorioMarketplace.encontrarItemPorId(itemId);
    if (!itemDb) {
        throw new AppError('Item não encontrado para exclusão.', 404);
    }

    if (itemDb.user_id !== userId) {
        throw new AppError('Você não tem permissão para deletar este item.', 403);
    }

    const sucesso = await RepositorioMarketplace.deletarItem(itemId);
    if (!sucesso) {
        throw new AppError('Falha ao deletar o item.', 500);
    }

    return { message: 'Item deletado com sucesso.' };
};

export default {
    criarItem,
    obterTodosItens,
    obterItemPorId,
    atualizarItem,
    deletarItem
};
