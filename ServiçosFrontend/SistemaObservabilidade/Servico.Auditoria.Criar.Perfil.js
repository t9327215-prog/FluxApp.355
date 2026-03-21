// ServiçosFrontend/ServicoLogs/Servico.Auditoria.Criar.Perfil.js

import ServicoDeLog from './ServicoDeLog.js';
import Sistema.Autenticacao.Supremo from '../ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';

const CONTEXTO = "CriarPerfil";

class ServicoAuditoriaCriarPerfil {
    constructor() {
        if (!ServicoAuditoriaCriarPerfil.instance) {
            ServicoAuditoriaCriarPerfil.instance = this;
        }
        return ServicoAuditoriaCriarPerfil.instance;
    }

    getUser() {
        return Sistema.Autenticacao.Supremo.getCurrentUser();
    }

    iniciarProcesso() {
        const user = this.getUser();

        ServicoDeLog.info(
            "Início do fluxo de completar perfil",
            { userId: user?.uid },
            CONTEXTO
        );
    }

    alteracaoFormulario(field, value) {
        const user = this.getUser();

        ServicoDeLog.debug(
            "Alteração de campo",
            { userId: user?.uid, field, value },
            CONTEXTO
        );
    }

    selecaoDeImagem(fileName) {
        const user = this.getUser();

        ServicoDeLog.info(
            "Imagem selecionada",
            { userId: user?.uid, fileName },
            CONTEXTO
        );
    }

    imagemCortada() {
        const user = this.getUser();

        ServicoDeLog.info(
            "Imagem cortada",
            { userId: user?.uid },
            CONTEXTO
        );
    }

    tentativaDeSubmissao(profileData) {
        const user = this.getUser();

        ServicoDeLog.info(
            "Tentativa de salvar perfil",
            { userId: user?.uid, profileData },
            CONTEXTO
        );
    }

    sucessoNaConclusao(response) {
        const user = this.getUser();

        ServicoDeLog.info(
            "Perfil salvo com sucesso",
            {
                userId: user?.uid,
                response
            },
            CONTEXTO
        );
    }

    falhaNaConclusao(error, profileData) {
        const user = this.getUser();

        ServicoDeLog.error(
            "Erro ao salvar perfil",
            {
                userId: user?.uid,
                profileData,
                error: error?.message
            },
            CONTEXTO
        );
    }

    // 🔴 ESSENCIAL: estado após salvar
    estadoAposSalvar(userAtualizado) {
        ServicoDeLog.info(
            "Estado do usuário após salvar perfil",
            userAtualizado,
            CONTEXTO
        );
    }

    // 🔴 ESSENCIAL: decisão do sistema
    decisaoRedirecionamento(user) {
        ServicoDeLog.warn(
            "Decisão de redirecionamento",
            {
                userId: user?.uid,
                perfilCompleto: user?.perfilCompleto
            },
            CONTEXTO
        );
    }

    logout() {
        const user = this.getUser();

        ServicoDeLog.warn(
            "Logout durante criação de perfil",
            { userId: user?.uid },
            CONTEXTO
        );
    }
}

const instance = new ServicoAuditoriaCriarPerfil();
Object.freeze(instance);

export default instance;