
// backend/controles/Controles.Criacao.Grupo.Pago.js
import ServicoCriacaoGrupoPago from '../ServicosBackend/Servicos.Criacao.Grupo.Pago.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

const httpRes = {
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
};

const criarGrupoPago = async (req, res, next) => {
    const donoId = req.user.id;

    try {
        const dadosParaValidar = {
            ...req.body,
            donoId,
            tipo: 'pago'
        };
        const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

        console.log('Iniciando criação de grupo pago', { event: 'GROUP_PAID_CREATE_START', donoId, nome: dadosValidados.nome });

        const grupoSalvo = await ServicoCriacaoGrupoPago.criar(dadosValidados);

        console.log('Criação de grupo pago bem-sucedida', { event: 'GROUP_PAID_CREATE_SUCCESS', groupId: grupoSalvo.id, donoId });

        const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
        return httpRes.criado(res, resposta);

    } catch (error) {
        console.error('Erro na criação de grupo pago', {
            event: 'GROUP_PAID_CREATE_ERROR',
            errorMessage: error.message,
            donoId,
            requestBody: req.body
        });
        next(error);
    }
};

export default { criarGrupoPago };
