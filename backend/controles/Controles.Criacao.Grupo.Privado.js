
import { createLogger } from '../ServicosBackend/Logger.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoCriacaoGrupoPrivado from '../ServicosBackend/Servicos.Criacao.Grupo.Privado.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

const logger = createLogger('PrivateGroup');

class ControleCriacaoGrupoPrivado {
    async handle(req, res) {
        const donoId = req.user.id;

        try {
            // 1. Validar a entrada
            const dadosParaValidar = {
                ...req.body,
                donoId,
                tipo: 'privado' // Define o tipo para a validação
            };
            const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

            logger.info('GROUP_PRIVATE_CREATE_START', { donoId, nome: dadosValidados.nome });

            // 2. Chamar o serviço com os dados validados
            const grupoSalvo = await ServicoCriacaoGrupoPrivado.criar(dadosValidados);

            logger.info('GROUP_PRIVATE_CREATE_SUCCESS', { groupId: grupoSalvo.id, donoId });

            // 3. Enviar a resposta de sucesso
            const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
            return ServicoHTTPResposta.sucesso(res, resposta, 201);

        } catch (error) {
            logger.error('GROUP_PRIVATE_CREATE_ERROR', {
                errorMessage: error.message,
                donoId,
                requestBody: req.body
            });

            return ServicoHTTPResposta.erro(res, error.message, 400);
        }
    }
}

export default new ControleCriacaoGrupoPrivado();
