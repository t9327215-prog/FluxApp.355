
import { apiNotificationService } from '../APIs/APIsServicoNotificacao/API.Servico.Notificacao';
import { Notificacao } from '../../../types/Saida/Types.Estrutura.Notificacao';

/**
 * @file Serviço para gerenciar notificações, utilizando sempre a API real.
 */
class ServicoNotificacao {

  /**
   * Busca a lista de notificações do usuário.
   * @param token O token de autenticação do usuário.
   */
  async getNotifications(token: string): Promise<Notificacao[]> {
    try {
      return await apiNotificationService.getNotifications(token);
    } catch (error) {
      console.error("ServicoNotificacao: Erro ao buscar notificações da API real:", error);
      return []; // Retorna um array vazio em caso de erro para não quebrar a UI.
    }
  }

  /**
   * Marca uma notificação específica como lida.
   * @param token O token de autenticação do usuário.
   * @param notificationId O ID da notificação a ser marcada.
   */
  async markAsRead(token: string, notificationId: string): Promise<boolean> {
    try {
      return await apiNotificationService.markAsRead(token, notificationId);
    } catch (error) {
      console.error("ServicoNotificacao: Erro ao marcar notificação como lida:", error);
      return false;
    }
  }

  /**
   * Marca todas as notificações do usuário como lidas.
   * @param token O token de autenticação do usuário.
   */
  async markAllAsRead(token: string): Promise<boolean> {
    try {
      return await apiNotificationService.markAllAsRead(token);
    } catch (error) {
      console.error("ServicoNotificacao: Erro ao marcar todas as notificações como lidas:", error);
      return false;
    }
  }
}

// Exporta uma instância única do serviço para ser usada em toda a aplicação.
const servicoNotificacao = new ServicoNotificacao();
export default servicoNotificacao;
