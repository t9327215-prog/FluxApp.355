
import VariaveisBackend from './Variaveis.Backend.js'; // Importa a configuração já validada

// A classe de Log e a detecção de ambiente são mantidas como estavam.
class LogBuilder {
    constructor() {
        this.logs = [];
    }
    add(level, message) {
        this.logs.push({ level, message });
    }
    imprimir() {
        this.logs.forEach(log => console[log.level](log.message));
    }
}

const logBuilder = new LogBuilder();

logBuilder.add('log', '\n=======================================================');
logBuilder.add('log', '=== INICIANDO CONFIGURAÇÃO DE AMBIENTE (BACKEND) ===');
logBuilder.add('log', '=======================================================');

const detectarAmbiente = () => {
    if (process.env.RENDER === 'true') return { ambiente: 'producao', provedor: 'Render' };
    if (process.env.VERCEL === 'true') return { ambiente: 'producao', provedor: 'Vercel' };
    if (process.env.NODE_ENV === 'production') return { ambiente: 'producao', provedor: 'Outro' };
    return { ambiente: 'local', provedor: 'Nenhum' };
};

const { ambiente: ambienteAtual, provedor: provedorAtual } = detectarAmbiente();
const isProducao = ambienteAtual === 'producao';

logBuilder.add('info', `[INFO] Ambiente detectado: ${ambienteAtual.toUpperCase()}`);
if (isProducao) {
    logBuilder.add('info', `[INFO] Provedor de hospedagem: ${provedorAtual}`);
}

logBuilder.add('log', '\n--- Variáveis de ambiente carregadas e validadas por Variaveis.Backend.js ---');

// Combina as informações de ambiente com as variáveis já carregadas e validadas.
const backendConfig = {
    ...VariaveisBackend,
    ambiente: ambienteAtual,
    provedor: provedorAtual,
    isProducao,
};

logBuilder.add('log', '\n========================================================');
logBuilder.add('log', '=== CONFIGURAÇÃO DO BACKEND FINALIZADA COM SUCESSO ===');
logBuilder.add('log', '========================================================\n');

logBuilder.imprimir();

// Exporta a configuração final e unificada.
export { backendConfig };
