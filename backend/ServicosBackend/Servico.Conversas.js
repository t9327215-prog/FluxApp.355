
import repositorioConversas from '../Repositorios/Repositorio.Conversas.js';

const obterConversas = async (userId) => {
    // Validação básica do ID do usuário
    if (!userId) {
        throw new Error('ID do usuário é necessário para buscar conversas.');
    }

    // Chama o repositório para obter os dados das conversas
    const conversas = await repositorioConversas.obterConversasPorUsuario(userId);

    // Pode-se adicionar mais lógica de negócios aqui, se necessário
    // Por exemplo, formatar os dados antes de enviá-los de volta

    return conversas;
};

export default {
    obterConversas,
};
