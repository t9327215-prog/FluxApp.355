
// backend/Repositorios/Repositorio.Sessao.js

import consultasSessao from '../database/GestaoDeDados/PostgreSQL/Consultas.Sessao.js';
import ServicoLog from '../ServicosBackend/Servico.Logs.Backend.js';

const criar = async (dadosSessao) => {
    const contexto = "Repositorio.Sessao.criar";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para criar sessão.');
    try {
        const novaSessao = await consultasSessao.criar(dadosSessao);
        ServicoLog.info(contexto, 'Sessão criada com sucesso na gestão de dados.');
        return novaSessao;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao criar sessão na gestão de dados', error);
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    const contexto = "Repositorio.Sessao.encontrarPorToken";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para buscar sessão por token.');
    try {
        const sessao = await consultasSessao.encontrarPorToken(token);
        ServicoLog.info(contexto, sessao ? 'Sessão encontrada.' : 'Sessão não encontrada.');
        return sessao;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar sessão por token na gestão de dados', error);
        throw error;
    }
};

const deletarPorToken = async (token) => {
    const contexto = "Repositorio.Sessao.deletarPorToken";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para deletar sessão por token.');
    try {
        const sessaoDeletada = await consultasSessao.deletarPorToken(token);
        ServicoLog.info(contexto, sessaoDeletada ? 'Sessão deletada com sucesso.' : 'Sessão não encontrada para deleção.');
        return sessaoDeletada;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao deletar sessão por token na gestão de dados', error);
        throw error;
    }
};


const repositorioSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default repositorioSessao;
