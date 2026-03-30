
import servicoConversas from '../ServicosBackend/Servico.Conversas.js';
import createControllerLogger from '../config/Log.Controles.js';

const logger = createControllerLogger('Controle.Conversas.js');

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
};

const obterConversas = async (req, res, next) => {
    const userId = req.user.id;
    logger.info(`Buscando conversas para o usuário ${userId}.`, { userId });

    try {
        const conversas = await servicoConversas.obterConversas(userId);
        
        logger.info(`Conversas do usuário ${userId} obtidas com sucesso. Foram encontradas ${conversas.length} conversas.`, { userId, count: conversas.length });
        return httpRes.sucesso(res, conversas, "Conversas obtidas com sucesso");

    } catch (error) {
        logger.error(`Erro ao buscar as conversas do usuário ${userId}:`, { userId, error });
        next(error);
    }
};

export default {
    obterConversas,
};
