
// backend/controles/Controle.Sessao.js

import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import servicoSessao from '../ServicosBackend/Servico.Sessao.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoLog from '../ServicosBackend/Servico.Logs.Backend.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import validadorSessao from '../validators/Validator.Estrutura.Sessao.js'; // Corrigido: Importando o validador de sessão

const registrar = async (req, res) => {
    const contexto = "Controle.Sessao.registrar";
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        // 1. Validar dados do usuário
        const dadosUsuarioValidados = validadorUsuario.validarRegistro(req.body);
        ServicoLog.info(contexto, 'Iniciando registro de usuário', { email: dadosUsuarioValidados.email });

        // 2. Criar o usuário
        const usuario = await servicoUsuario.registrarNovoUsuario(dadosUsuarioValidados);

        // 3. Preparar a nova sessão
        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        // 4. Validar os dados da sessão
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        // 5. Salvar a sessão validada
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        ServicoLog.info(contexto, 'Registro e sessão criados com sucesso', { userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() }, 201);

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { email: req.body.email });
        if (error.message.includes('está em uso')) {
            return ServicoResposta.conflito(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const login = async (req, res) => {
    const contexto = "Controle.Sessao.login";
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        // 1. Validar credenciais de login
        const dadosLoginValidados = validadorUsuario.validarLogin(req.body);
        ServicoLog.info(contexto, 'Iniciando login de usuário', { email: dadosLoginValidados.email });

        // 2. Autenticar o usuário
        const usuario = await servicoUsuario.autenticarUsuarioPorCredenciais(dadosLoginValidados);

        // 3. Preparar a nova sessão
        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        // 4. Validar os dados da sessão
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        // 5. Salvar a sessão validada
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        ServicoLog.info(contexto, 'Login e sessão criados com sucesso', { userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { email: req.body.email });
        if (error.message.includes('Credenciais inválidas')) {
            return ServicoResposta.nãoAutorizado(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const googleAuth = async (req, res) => {
    const contexto = "Controle.Sessao.googleAuth";
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        // 1. Validar dados do Google
        const dadosGoogleValidados = validadorUsuario.validarGoogleAuth(req.body);
        ServicoLog.info(contexto, 'Iniciando autenticação Google', { email: dadosGoogleValidados.email });

        // 2. Autenticar ou criar usuário
        const { usuario, isNewUser } = await servicoUsuario.autenticarOuCriarPorGoogle(dadosGoogleValidados);

        // 3. Preparar a nova sessão
        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        // 4. Validar os dados da sessão
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        // 5. Salvar a sessão validada
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        ServicoLog.info(contexto, 'Autenticação Google e sessão processados com sucesso', { userId: usuario.id });
        return ServicoResposta.sucesso(res, { 
            token, 
            user: usuario.paraRespostaHttp(),
            isNewUser
        });

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { email: req.body.email });
        if (error.message.includes('Faça login com sua senha')) {
            return ServicoResposta.conflito(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const logout = async (req, res) => {
    const contexto = "Controle.Sessao.logout";
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ServicoResposta.nãoAutorizado(res, 'Token não fornecido');
        }
        await servicoSessao.encerrarSessao(token);
        return ServicoResposta.sucesso(res, { message: 'Logout bem-sucedido' });

    } catch (error) {
        ServicoLog.erro(contexto, error.message);
        return ServicoResposta.erro(res, 'Falha ao fazer logout');
    }
};

export default {
    registrar,
    login,
    googleAuth,
    logout
};