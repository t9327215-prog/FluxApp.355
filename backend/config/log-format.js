
import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const getEmoji = (level) => {
    // Transforma o nível para minúsculas para garantir a correspondência
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('error')) return '🔴';
    if (lowerLevel.includes('warn')) return '🟡';
    if (lowerLevel.includes('info')) return '🟢';
    if (lowerLevel.includes('http')) return '🔵';
    if (lowerLevel.includes('debug')) return '🟣';
    return '⚪️';
};

const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    colorize({ all: true }),
    printf((info) => {
        const emoji = getEmoji(info.level);
        // Garante que 'level' esteja em maiúsculas e com espaçamento consistente
        const level = info.level.toUpperCase().padEnd(7); 
        const modulo = (info.modulo || 'SYSTEM').padEnd(10);
        const arquivo = info.arquivo || '-';

        // Monta a primeira linha do log
        const header = `${emoji} ${level} | ${modulo} | ${arquivo}`;
        
        // Monta a segunda linha
        let body = `[${info.timestamp}] ${info.message}`;

        // Adiciona metadados extras, se existirem
        const extra = Object.keys(info).reduce((acc, key) => {
            if (!['level', 'message', 'timestamp', 'modulo', 'arquivo', 'splat', 'stack'].includes(key)) {
                acc[key] = info[key];
            }
            return acc;
        }, {});

        if (Object.keys(extra).length > 0) {
            body += ` | ${JSON.stringify(extra)}`;
        }
        
        // Se houver stack trace (para erros), adicione-o
        if (info.stack) {
            body += `\nStack: ${info.stack}`;
        }

        return `${header}\n${body}\n`;
    })
);

export default logFormat;
