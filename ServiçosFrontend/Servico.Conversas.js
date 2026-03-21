
import ClienteBackend from './Cliente.Backend.js';
import ServicoLog from './ServicoLogs/ServicoDeLog.js';

const ServicoConversas = {
    obterConversas: async () => {
        const contexto = "ServicoConversas.obterConversas";

        try {
            // Refatorado: Usa o ClienteBackend para a requisição GET.
            // O token e o traceId são adicionados automaticamente.
            // O log de requisição, resposta e erro também são automáticos.
            const response = await ClienteBackend.get('/conversas');

            // O traceId pode ser acessado para logs de serviço específicos, se necessário.
            const traceId = response.config.metadata.traceId;
            ServicoLog.info(contexto, 'Conversas obtidas com sucesso.', { traceId });

            return response.data; // Retorna apenas os dados, como o axios faz.

        } catch (error) {
            // O erro já foi logado pelo interceptor do ClienteBackend.
            // Podemos adicionar um log contextual aqui se quisermos, mas o essencial já foi feito.
            const errorMessage = error.response?.data?.message || 'Falha ao buscar conversas.';
            ServicoLog.erro(contexto, errorMessage, { 
                // Opcional: obter o traceId do erro para consistência
                traceId: error.config?.metadata?.traceId 
            });
            throw new Error(errorMessage);
        }
    },
};

export default ServicoConversas;
