
import backend from "../../Cliente.Backend.js";
import { Notificacao } from "../../../types/Saida/Types.Estrutura.Notificacao";

class ApiNotificationService {
  async getNotifications(token: string): Promise<Notificacao[]> {
    try {
      const response = await backend.get<Notificacao[]>('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações da API:', error);
      throw new Error('Falha ao buscar notificações.');
    }
  }

  async markAsRead(token: string, notificationId: string): Promise<boolean> {
    try {
      const response = await backend.post(`/notifications/mark-read/${notificationId}`, {},
        {
          headers: { Authorization: `Bearer ${token}` }
        });
      return response.status === 200;
    } catch (error) {
      console.error(`Erro ao marcar notificação ${notificationId} como lida:`, error);
      throw new Error('Falha ao marcar notificação como lida.');
    }
  }

  async markAllAsRead(token: string): Promise<boolean> {
    try {
      const response = await backend.post('/notifications/mark-all-read', {},
        {
          headers: { Authorization: `Bearer ${token}` }
        });
      return response.status === 200;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw new Error('Falha ao marcar todas as notificações como lidas.');
    }
  }
}

export const apiNotificationService = new ApiNotificationService();
