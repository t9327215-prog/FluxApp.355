import { v4 as uuidv4 } from 'uuid';
// Importa o repositório unificado
import RepositorioGrupo from '../Repositorios/Repositorio.Estrutura.Grupos.js';
import Grupo from '../models/Models.Estrutura.Grupos.js';

class ServicoCriacaoGrupoPago {
    async criar(dadosDoRequest) {
        try {
            const novoGrupo = new Grupo({
                id: uuidv4(),
                nome: dadosDoRequest.groupName,
                descricao: dadosDoRequest.description,
                tipo: 'pago',
                preco: dadosDoRequest.numericPrice,
                moeda: dadosDoRequest.currency,
                donoId: dadosDoRequest.donoId,
                imagemCapa: dadosDoRequest.finalCoverUrl || null,
                tipoAcesso: dadosDoRequest.accessType,
                accessConfig: dadosDoRequest.accessConfig, // Adicionado para salvar a configuração de acesso
                provedorPagamentoId: dadosDoRequest.selectedProviderId,
                dataExpiracao: this.calcularDataExpiracao(dadosDoRequest),
                vipDoor: {
                    media: dadosDoRequest.finalMediaGallery, // Corrigido de mediaItems para media
                    text: dadosDoRequest.vipDoorText || "Bem-vindo ao VIP!",
                    buttonText: dadosDoRequest.vipButtonText
                },
                pixel: {
                    id: dadosDoRequest.pixelId || null,
                    token: dadosDoRequest.pixelToken || null,
                }
            });

            const dadosParaBanco = novoGrupo.paraBancoDeDados();

            // Usa o repositório unificado
            const grupoSalvoNoBanco = await RepositorioGrupo.criar(dadosParaBanco);

            const instanciaGrupoSalvo = Grupo.deBancoDeDados(grupoSalvoNoBanco);

            return instanciaGrupoSalvo.paraRespostaHttp();

        } catch (error) {
            console.error("Erro no serviço ao criar grupo pago:", error.message);
            throw error;
        }
    }

    calcularDataExpiracao(dados) {
        if (dados.accessType === 'temporary') {
            return dados.accessConfig?.interval;
        }
        if (dados.accessType === 'one_time') {
            return `${dados.accessConfig?.days}d${dados.accessConfig?.hours}h`;
        }
        return null;
    }
}

export default new ServicoCriacaoGrupoPago();
