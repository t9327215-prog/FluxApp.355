
import { createLogger } from '../ServicosBackend/Logger.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoCriacaoGrupoPublico from '../ServicosBackend/Servicos.Criacao.Grupo.Publico.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

const logger = createLogger('PublicGroup');

class ControleCriacaoGrupoPublico {
    async handle(req, res) {
        const donoId = req.user.id;

        try {
            // 1. Validar a entrada usando o validador centralizado
            const dadosParaValidar = {
                ...req.body,
                donoId,
                tipo: 'publico' // Define o tipo para a validação
            };
            const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

            logger.info('GROUP_PUBLIC_CREATE_START', { donoId, nome: dadosValidados.nome });

            // 2. Chamar o serviço com os dados já limpos e validados
            const grupoSalvo = await ServicoCriacaoGrupoPublico.criar(dadosValidados);

            logger.info('GROUP_PUBLIC_CREATE_SUCCESS', { groupId: grupoSalvo.id, donoId });

            // 3. Enviar a resposta de sucesso
            // Assumindo que o serviço retorna um objeto com um método para formatar a resposta
            const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
            return ServicoHTTPResposta.sucesso(res, resposta, 201);

        } catch (error) {
            // Captura tanto erros de validação (do nosso validador) quanto erros de serviço
            logger.error('GROUP_PUBLIC_CREATE_ERROR', { 
                errorMessage: error.message,
                donoId,
                requestBody: req.body
            });

            // Retorna o erro com a mensagem fornecida pelo nosso validador (ou pelo serviço)
            return ServicoHTTPResposta.erro(res, error.message, 400);
        }
    }
}

export default new ControleCriacaoGrupoPublico();
