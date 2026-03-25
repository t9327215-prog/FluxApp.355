
export function setupErrorHandlers() {
    process.on('uncaughtException', (err, origin) => {
        console.error({
            camada: 'Backend',
            componente: 'Core',
            arquivo: 'errorHandler.js',
            mensagem: `Exceção Não Capturada: ${err.message}`,
            dados: { origin },
            error: err
        });
        setTimeout(() => process.exit(1), 1000); 
    });

    process.on('unhandledRejection', (reason, promise) => {
        const error = reason instanceof Error ? reason : undefined;
        console.error({
            camada: 'Backend',
            componente: 'Core',
            arquivo: 'errorHandler.js',
            mensagem: 'Rejeição de Promise Não Tratada',
            dados: { reason: reason instanceof Error ? reason.message : String(reason) },
            error
        });
    });
}
