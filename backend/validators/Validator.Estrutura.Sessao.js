
import validator from 'validator';
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Sessao.js');

const validarNovaSessao = (data) => {
    logger.info('Iniciando validação para nova sessão.', { userId: data.user_id });
    const erros = [];

    // Validação do ID do usuário (deve ser UUID)
    if (!data.user_id || !validator.isUUID(data.user_id, 4)) {
        erros.push('O campo user_id é obrigatório e deve ser um UUID v4.');
    }

    // Validação do token (não pode ser vazio)
    if (!data.token || validator.isEmpty(data.token, { ignore_whitespace: true })) {
        erros.push('O campo token é obrigatório.');
    }

    // Validação da data de expiração (deve ser uma data válida)
    if (!data.expires_at || !validator.isISO8601(new Date(data.expires_at).toISOString())) {
        erros.push('O campo expires_at é obrigatório e deve estar em formato de data válido.');
    }

    // Validação do endereço IP (deve ser um IP válido)
    if (!data.ipAddress || !validator.isIP(data.ipAddress)) {
        erros.push('O campo ipAddress é obrigatório e deve ser um endereço de IP válido.');
    }

    // Validação do user-agent (deve ser uma string, se existir)
    if (data.userAgent && typeof data.userAgent !== 'string') {
        erros.push('O campo userAgent, se fornecido, deve ser uma string.');
    }

    if (erros.length > 0) {
        const errorMsg = `Dados de sessão inválidos: ${erros.join(' ')}`.trim();
        logger.error(errorMsg, { data, erros });
        throw new Error(errorMsg);
    }
    
    logger.info('Validação de nova sessão bem-sucedida.', { userId: data.user_id });
    // Retorna os dados limpos e padronizados, prontos para a próxima camada
    return {
        user_id: data.user_id,
        token: data.token.trim(),
        expires_at: new Date(data.expires_at),
        ip_address: data.ipAddress, // Padronizado para snake_case
        user_agent: data.userAgent ? data.userAgent.trim() : null, // Padronizado para snake_case
    };
};

export default {
    validarNovaSessao
};
