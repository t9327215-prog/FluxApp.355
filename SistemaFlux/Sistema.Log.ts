
/**
 * @file Sistema.Log.ts
 * @description Módulo centralizado de logging para toda a aplicação. Garante que dados estruturados (JSON) sejam convertidos em string para exibição em todos os painéis de log.
 */
class SistemaLog {

    /**
     * Gera um timestamp formatado para os logs.
     * @returns {string} Timestamp no formato YYYY-MM-DD HH:mm:ss
     */
    private static getTimestamp(): string {
        return new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    /**
     * Tenta converter um objeto para uma string JSON formatada. Retorna string vazia se falhar.
     * @param data O objeto a ser convertido.
     * @returns {string} A string JSON ou uma string vazia.
     */
    private static stringifyData(data?: any): string {
        if (!data) return '';
        try {
            // O 'null, 2' formata o JSON para ser mais legível (indentação de 2 espaços)
            return JSON.stringify(data, null, 2);
        } catch (error) {
            return '[[Falha ao serializar dados para o log]]';
        }
    }

    /**
     * Registra uma mensagem informativa.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem a ser registrada.
     * @param dadosExtras Dados adicionais para incluir no log.
     */
    public static info(modulo: string, mensagem: string, dadosExtras?: object): void {
        const timestamp = this.getTimestamp();
        const extraDataString = this.stringifyData(dadosExtras);
        console.info(`${timestamp} [INFO] [${modulo}] ${mensagem}${extraDataString ? '\n' + extraDataString : ''}`);
    }

    /**
     * Registra um aviso.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem de aviso.
     * @param dadosExtras Dados adicionais para incluir no log.
     */
    public static aviso(modulo: string, mensagem: string, dadosExtras?: object): void {
        const timestamp = this.getTimestamp();
        const extraDataString = this.stringifyData(dadosExtras);
        console.warn(`${timestamp} [WARN] [${modulo}] ${mensagem}${extraDataString ? '\n' + extraDataString : ''}`);
    }

    /**
     * Registra um erro.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem de erro principal.
     * @param erro O objeto de erro ou dados extras associados.
     */
    public static erro(modulo: string, mensagem: string, erro?: any): void {
        const timestamp = this.getTimestamp();
        const errorDataString = this.stringifyData(erro);
        console.error(`${timestamp} [ERRO] [${modulo}] ${mensagem}${errorDataString ? '\n' + errorDataString : ''}`);
    }

    /**
     * Registra uma mensagem de depuração.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem de depuração.
     * @param dadosExtras Dados adicionais para incluir no log.
     */
    public static debug(modulo: string, mensagem: string, dadosExtras?: object): void {
        const timestamp = this.getTimestamp();
        const extraDataString = this.stringifyData(dadosExtras);
        console.debug(`${timestamp} [DEBUG] [${modulo}] ${mensagem}${extraDataString ? '\n' + extraDataString : ''}`);
    }
}

export default SistemaLog;
