
import { createLogger, format, transports } from 'winston';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, printf, errors, colorize } = format;

/**
 * Formatter customizado para o Winston que segue o padrão:
 * ✅ <Camada> | <Contexto> | <Arquivo>
 * [sktlx] <Mensagem> | IP: <IP> | Duração: <ms>
 */
const visualLogFormat = printf(({ level, message, timestamp, camada, componente, arquivo, dados }) => {
    const statusEmoji = level === 'error' ? '❌' : '✅';

    // Linha 1: Cabeçalho com Camada, Contexto e Arquivo
    const header = `${statusEmoji} ${camada || 'Backend'} | ${componente || '-'} | ${arquivo || '-'}`;

    // Linha 2: Mensagem principal e Metadados
    let messageLine = `[sktlx] ${message}`;
    const metaParts = [];

    if (dados?.ip) {
        metaParts.push(`IP: ${dados.ip}`);
    }

    // A duração é opcional; mostrar '-ms' se não estiver presente.
    const duration = dados?.durationMs != null ? `${dados.durationMs.toFixed(2)}ms` : '-ms';
    metaParts.push(`Duração: ${duration}`);

    if (metaParts.length > 0) {
        messageLine += ` | ${metaParts.join(' | ')}`;
    }
    
    // Para erros, incluir a stack trace de forma organizada
    if (level === 'error' && dados?.stack) {
        return `${header}
${messageLine}
${dados.stack}`;
    }

    return `${header}
${messageLine}`;
});

const commonConfig = {
    format: combine(
        errors({ stack: true }), // Captura a stack trace dos erros
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    exitOnError: false
};

// Logger principal para o sistema
export const logger = createLogger({
    ...commonConfig,
    level: 'info',
    transports: [
        // Log colorido no console para desenvolvimento
        new transports.Console({
            format: combine(
                colorize(),
                visualLogFormat
            )
        }),
        // Log em arquivo para produção/auditoria
        new transports.File({
            filename: 'logs/system.log',
            format: combine(visualLogFormat) // Formato para arquivo, sem cores
        })
    ]
});

/**
 * Middleware de log para requisições HTTP.
 * Injeta um logger específico para a requisição com traceId e metadados.
 */
export const requestLoggerMiddleware = (req, res, next) => {
    const traceId = req.headers['x-flux-trace-id'] || uuidv4();
    req.traceId = traceId;

    // Cria um logger filho com metadados específicos para esta requisição
    req.logger = logger.child({
        traceId,
        camada: 'Backend',
        componente: 'API',
        arquivo: 'Middleware.Log.js'
    });

    const start = process.hrtime();
    
    // Log de início da requisição
    req.logger.info(`Request Start: ${req.method} ${req.originalUrl}`, {
        dados: { ip: req.ip }
    });

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        // Log de fim da requisição
        req.logger.info(`Request End: ${req.method} ${req.originalUrl} - ${res.statusCode}`, {
            dados: {
                ip: req.ip,
                durationMs: durationInMilliseconds
            }
        });
    });

    next();
};

// Função utilitária para calcular a duração em milissegundos
const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e-6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) * NS_TO_MS;
};
