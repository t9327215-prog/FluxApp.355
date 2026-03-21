
// backend/validators/Validator.Estrutura.Usuario.js

import validator from 'validator';

/**
 * Valida os dados para o registro de um novo usuário.
 * @param {object} data - Contém { nome, email, senha }.
 * @returns {object} Objeto com os dados validados e limpos.
 */
const validarRegistro = (data = {}) => {
    const erros = [];

    if (!data.nome || validator.isEmpty(data.nome, { ignore_whitespace: true })) {
        erros.push("O nome é obrigatório.");
    }

    if (!data.email || !validator.isEmail(data.email)) {
        erros.push("E-mail é obrigatório e deve ser válido.");
    }

    if (!data.senha || !validator.isLength(data.senha, { min: 8 })) {
        erros.push("A senha é obrigatória e deve ter no mínimo 8 caracteres.");
    }

    if (erros.length > 0) {
        throw new Error(erros.join(", "));
    }

    return {
        nome: data.nome.trim(),
        email: data.email.toLowerCase().trim(),
        senha: data.senha,
    };
};

/**
 * Valida os dados para o login de um usuário.
 * @param {object} data - Contém { email, senha }.
 * @returns {object} Objeto com os dados validados e limpos.
 */
const validarLogin = (data = {}) => {
    const erros = [];

    if (!data.email || !validator.isEmail(data.email)) {
        erros.push("E-mail é obrigatório e deve ser válido.");
    }

    if (!data.senha || validator.isEmpty(data.senha)) {
        erros.push("A senha é obrigatória.");
    }

    if (erros.length > 0) {
        throw new Error(erros.join(", "));
    }

    return {
        email: data.email.toLowerCase().trim(),
        senha: data.senha,
    };
};

/**
 * Valida os dados para autenticação via Google.
 * @param {object} data - Contém { nome, email, google_id }.
 * @returns {object} Objeto com os dados validados e limpos.
 */
const validarGoogleAuth = (data = {}) => {
    const erros = [];

    if (!data.nome || validator.isEmpty(data.nome, { ignore_whitespace: true })) {
        erros.push("O nome do Google é obrigatório.");
    }

    if (!data.email || !validator.isEmail(data.email)) {
        erros.push("E-mail do Google é obrigatório e deve ser válido.");
    }

    if (!data.google_id || validator.isEmpty(data.google_id, { ignore_whitespace: true })) {
        erros.push("Google ID é obrigatório.");
    }

    if (erros.length > 0) {
        throw new Error(erros.join(", "));
    }

    return {
        nome: data.nome.trim(),
        email: data.email.toLowerCase().trim(),
        google_id: data.google_id.trim(),
    };
};

/**
 * Valida os dados para a atualização de um perfil de usuário.
 * @param {object} data - Contém os campos opcionais a serem atualizados.
 * @returns {object} Objeto limpo contendo apenas os campos validados.
 */
const validarAtualizacaoPerfil = (data = {}) => {
    const erros = [];
    const dadosValidados = {};

    if (data.apelido !== undefined) {
        if (!validator.isLength(data.apelido.trim(), { min: 3 })) {
            erros.push("Apelido, se fornecido, deve ter no mínimo 3 caracteres.");
        } else {
            dadosValidados.apelido = data.apelido.trim();
        }
    }

    if (data.site !== undefined) {
        const siteTrimmed = data.site.trim();
        if (siteTrimmed !== '' && !validator.isURL(siteTrimmed)) {
            erros.push("O site, se fornecido, deve ser uma URL válida.");
        } else {
            // Permite que o site seja definido como uma string vazia para removê-lo
            dadosValidados.site = siteTrimmed;
        }
    }
    
    if (data.bio !== undefined) {
        // A bio pode ser uma string vazia, mas não pode exceder o limite.
        if (!validator.isLength(data.bio, { max: 150 })) {
            erros.push("A bio não pode exceder 150 caracteres.");
        } else {
            dadosValidados.bio = data.bio.trim();
        }
    }

    if (data.privado !== undefined) {
        if (typeof data.privado !== 'boolean') {
            erros.push("O campo 'privado', se fornecido, deve ser um valor booleano.");
        } else {
            dadosValidados.privado = data.privado;
        }
    }

    if (erros.length > 0) {
        throw new Error(erros.join(", "));
    }
    
    return dadosValidados;
};

export default {
    validarRegistro,
    validarLogin,
    validarGoogleAuth,
    validarAtualizacaoPerfil
};