
import React from 'react';
import { useNotificationCardManager } from '@/hooks/Hook.Notificacao.Card.Manager.tsx';
import { Notificacao } from '@/types/Saida/Types.Estrutura.Notificacao';

interface CardDesignSessaoProps {
  title: string;
  notifications: Notificacao[];
  onFollowToggle: (id: number, username: string) => void;
  onPendingAction: (action: 'accept' | 'reject', notification: any) => void;
  onIgnoreExpiring: (id: number) => void;
  onPay: (groupId: string) => void;
  navigate: (path: string) => void;
}

export const CardDesignSessaoNotificacao: React.FC<CardDesignSessaoProps> = ({
  title,
  notifications,
  ...props
}) => {
  const cardManager = useNotificationCardManager(props);

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <>
      <style>{`
        .notification-section { margin-bottom: 20px; }
        .notification-section h2 {
          font-size: 13px; color: #00c2ff; padding: 10px 0; 
          margin-bottom: 8px; text-transform: uppercase; 
          font-weight: 800; letter-spacing: 1px;
        }
        .notification-section .notification-item,
        .notification-section .notification-item-vip {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 16px !important;
          background-color: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          transition: background-color 0.2s, border-color 0.2s !important;
          border-radius: 14px !important;
          margin-bottom: 8px !important;
          border-bottom: none !important;
          border-left: none !important;
        }
        .notification-section > .notification-cards-wrapper > div:last-child > .notification-item,
        .notification-section > .notification-cards-wrapper > div:last-child > .notification-item-vip {
            margin-bottom: 0 !important;
        }
        .notification-section .notification-item:hover,
        .notification-section .notification-item-vip:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(0, 194, 255, 0.2) !important;
        }
        .notification-section .notification-sale { background-color: rgba(0, 255, 130, 0.06) !important; }
        .notification-section .notification-pending { background-color: rgba(255, 170, 0, 0.06) !important; }
        .notification-section .notification-item-vip { background: rgba(255, 215, 0, 0.06) !important; }
      `}</style>

      <section className="notification-section">
        <h2>{title}</h2>
        <div className="notification-cards-wrapper">
          {notifications.map(notif => (
            <div key={notif.id}>
              {cardManager.getCardComponent(notif)}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
