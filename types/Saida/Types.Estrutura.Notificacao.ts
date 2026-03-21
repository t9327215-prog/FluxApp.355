
import { Usuario } from "./Types.Estrutura.Usuario";
import { Post } from "./Types.Estrutura.Post";

// ==================================================================================
// TIPOS DE NOTIFICAÇÃO (O "QUÊ" DA NOTIFICAÇÃO)
// ==================================================================================

/**
 * Representa todos os tipos de eventos que podem gerar uma notificação no sistema.
 * Esta lista é derivada dos componentes de card de notificação existentes.
 */
export type TipoNotificacao = 
    | 'SEGUIDOR'             // Um novo usuário começou a seguir o usuário logado.
    | 'PEDIDO_AMIZADE'       // Um usuário enviou um pedido de amizade.
    | 'CURTIDAS'             // Uma ou mais publicações foram curtidas.
    | 'COMENTARIO'           // Um novo comentário foi feito em uma publicação.
    | 'COMENTARIO_RESPOSTA'  // Uma resposta foi feita a um comentário.
    | 'MENCAO'               // O usuário foi mencionado em um post, comentário ou reel.
    | 'COMPARTILHAMENTO'     // Uma publicação do usuário foi compartilhada.
    | 'CONVITE_GRUPO'        // O usuário foi convidado para participar de um grupo.
    | 'COMPRA_SUCESSO'       // A compra de um produto foi concluída com sucesso.
    | 'VENDA_REALIZADA'      // Um produto do usuário foi vendido.
    | 'VENDA_PENDENTE'       // Uma venda está pendente de ação (ex: aguardando pagamento).
    | 'COBRANCA'             // Uma cobrança foi gerada (ex: assinatura de grupo).
    | 'LOGIN';               // Alerta de um novo login em um dispositivo desconhecido.


// ==================================================================================
// ESTRUTURA PRINCIPAL DA NOTIFICAÇÃO
// ==================================================================================

/**
 * Define a estrutura de um item de notificação individual, como recebido pela aplicação.
 * É um tipo base que pode ser estendido com dados específicos de cada `TipoNotificacao`.
 */
export interface Notificacao {
    id: string;                      // Identificador único da notificação.
    tipo: TipoNotificacao;           // O tipo de evento que gerou a notificação. **Fortemente tipado**.
    timestamp: string;               // Timestamp ISO da notificação para exibição e ordenação.
    lida: boolean;                   // Indica se a notificação foi visualizada pelo usuário.

    // -- Entidades Principais --

    /** O usuário (ou usuários) que iniciou a ação que gerou a notificação. */
    autor: Partial<Usuario> | Partial<Usuario>[]; 

    // -- Contexto Adicional (condicional, dependendo do `tipo`) --

    /** O post, reel ou foto ao qual a notificação se refere. */
    post?: Partial<Post>;

    /** O grupo relacionado à notificação (ex: convite). */
    grupo?: {
        id: string;
        nome: string;
        urlAvatar?: string;
    };

    /** O texto de um comentário ou menção. */
    conteudoRelacionado?: string;  

    /** Informações de preço para modais de pagamento. */
    infoPreco?: {
        preco: number;
        moeda: string;
        precoFormatado: string;
    };

    // Permite flexibilidade para tipos de notificação com dados muito específicos.
    [key: string]: any; 
}

/**
 * Representa um agrupamento de notificações, geralmente por data (ex: 'Hoje', 'Esta Semana').
 */
export interface NotificacaoAgrupada {
    [chave: string]: Notificacao[];
}
