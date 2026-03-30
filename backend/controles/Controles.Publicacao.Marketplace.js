
// backend/controles/Controles.Publicacao.Marketplace.js
import ServicoMarketplace from '../ServicosBackend/Servicos.Publicacao.Marketplace.js';
import { validarItemMarketplace } from '../validators/Validator.Estrutura.Publicacao.Marketplace.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
    naoEncontrado: (r, m = "Recurso não encontrado") => r.status(404).json({ sucesso: false, mensagem: m }),
    semConteudo: (r) => r.status(204).send(),
};

const criarItem = async (req, res) => {
    const userId = req.user.id;
    console.log('Iniciando criação de item no marketplace', { event: 'ITEM_CREATE_START', userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarItemMarketplace(dadosParaValidar);

        const item = await ServicoMarketplace.criarItem(dadosValidados, req.user);

        console.log('Item do marketplace criado com sucesso', { event: 'ITEM_CREATE_SUCCESS', itemId: item.id, userId });
        
        httpRes.criado(res, item);

    } catch (error) {
        console.error('Erro ao criar item no marketplace', { 
            event: 'ITEM_CREATE_ERROR', 
            errorMessage: error.message, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const obterTodosItens = async (req, res) => {
    console.log('Iniciando obtenção de todos os itens do marketplace', { event: 'ITEMS_GET_ALL_START' });
    try {
        const items = await ServicoMarketplace.obterTodosItens(req.query);
        console.log('Itens do marketplace obtidos com sucesso', { event: 'ITEMS_GET_ALL_SUCCESS', count: items.length });
        httpRes.sucesso(res, items);
    } catch (error) {
        console.error('Erro ao obter itens do marketplace', { event: 'ITEMS_GET_ALL_ERROR', errorMessage: error.message });
        httpRes.erro(res, error.message, 500);
    }
};

const obterItemPorId = async (req, res) => {
    const { itemId } = req.params;
    console.log('Iniciando obtenção de item do marketplace por ID', { event: 'ITEM_GET_BY_ID_START', itemId });
    try {
        const item = await ServicoMarketplace.obterItemPorId(itemId);
        if (!item) {
            console.warn('Item do marketplace não encontrado', { event: 'ITEM_GET_BY_ID_NOT_FOUND', itemId });
            return httpRes.naoEncontrado(res, 'Item não encontrado.');
        }
        console.log('Item do marketplace obtido com sucesso por ID', { event: 'ITEM_GET_BY_ID_SUCCESS', itemId });
        httpRes.sucesso(res, item);
    } catch (error) {
        console.error('Erro ao obter item do marketplace por ID', { event: 'ITEM_GET_BY_ID_ERROR', errorMessage: error.message, itemId });
        httpRes.erro(res, error.message, 500);
    }
};

const atualizarItem = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando atualização de item no marketplace', { event: 'ITEM_UPDATE_START', itemId, userId });
    try {
        const updatedItem = await ServicoMarketplace.atualizarItem(itemId, req.body, userId);
        console.log('Item do marketplace atualizado com sucesso', { event: 'ITEM_UPDATE_SUCCESS', itemId, userId });
        httpRes.sucesso(res, updatedItem);
    } catch (error) {
        console.error('Erro ao atualizar item no marketplace', { event: 'ITEM_UPDATE_ERROR', errorMessage: error.message, itemId, userId, data: req.body });
        httpRes.erro(res, error.message, 400);
    }
};

const deletarItem = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando exclusão de item do marketplace', { event: 'ITEM_DELETE_START', itemId, userId });
    try {
        await ServicoMarketplace.deletarItem(itemId, userId);
        console.log('Item do marketplace excluído com sucesso', { event: 'ITEM_DELETE_SUCCESS', itemId, userId });
        httpRes.semConteudo(res);
    } catch (error) {
        console.error('Erro ao excluir item do marketplace', { event: 'ITEM_DELETE_ERROR', errorMessage: error.message, itemId, userId });
        httpRes.erro(res, error.message, 400);
    }
};

export default {
    criarItem,
    obterTodosItens,
    obterItemPorId,
    atualizarItem,
    deletarItem
};
