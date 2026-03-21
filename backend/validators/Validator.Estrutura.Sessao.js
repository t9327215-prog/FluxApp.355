
// backend/validators/Validator.Estrutura.Sessao.js

import validator from 'validator';

const validarNovaSessao = (data) => {
    const erros = [];

    if (!data.idUsuario || !validator.isUUID(data.idUsuario)) {
        erros.push("ID de usuário é obrigatório e deve ser um UUID válido.");
    }

    if (!data.token || validator.isEmpty(data.token.trim())) {
        erros.push("Token é obrigatório.");
    }

    if (!data.enderecoIp || !validator.isIP(data.enderecoIp)) {
        erros.push("Endereço de IP é obrigatório e deve ser um IP válido.");
    }

    if (data.userAgent && typeof data.userAgent !== 'string') {
        erros.push("User-Agent, se fornecido, deve ser uma string.");
    }

    if (erros.length > 0) {
        throw new Error(erros.join(", "));
    }

    // Retorna um objeto limpo e validado
    return {
        idUsuario: data.idUsuario,
        token: data.token.trim(),
        enderecoIp: data.enderecoIp,
        userAgent: data.userAgent ? data.userAgent.trim() : null,
    };
};

export default {
    validarNovaSessao
};
