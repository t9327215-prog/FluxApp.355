
// backend/controles/Controle.Usuario.js

import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoLog from '../ServicosBackend/Servico.Logs.Backend.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';

const atualizarPerfil = async (req, res) => {
    const contexto = "Controle.Usuario.atualizarPerfil";
    const idUsuario = req.user.id; // Assumindo que o middleware de auth injeta o usuário no req

    try {
        // 1. Validar a entrada
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        ServicoLog.info(contexto, `Iniciando atualização de perfil para o usuário ${idUsuario}`)

        // 2. Chamar o serviço com os dados validados
        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        ServicoLog.info(contexto, `Perfil do usuário ${idUsuario} atualizado com sucesso`);

        return ServicoResposta.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { userId: idUsuario });
        // Captura erros de validação e outros erros de serviço
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const obterPerfil = async (req, res) => {
    const contexto = "Controle.Usuario.obterPerfil";
    const idUsuario = req.params.id; // Ou de outra fonte, como o token

    try {
        ServicoLog.info(contexto, `Buscando perfil para o usuário ${idUsuario}`);

        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            return ServicoResposta.nãoEncontrado(res, "Usuário não encontrado");
        }

        return ServicoResposta.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { userId: idUsuario });
        return ServicoResposta.erro(res, "Falha ao buscar perfil do usuário");
    }
}

export default {
    atualizarPerfil,
    obterPerfil
};