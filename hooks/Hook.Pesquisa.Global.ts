
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { systemaRelacaoUsuarios } from '../ServiçosFrontend/ServiçoDeRelacionamento/Sistema.Relação.Usuários.js';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { User } from '../types';

export const HookPesquisaGlobal = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const currentUserEmail = SistemaAutenticacaoSupremo.getCurrentUserEmail();

  // Efeito para buscar usuários com base no termo de pesquisa
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setLoading(true);
        try {
          // SistemaAutenticacaoSupremo agora é a única fonte para buscar usuários
          const results = await SistemaAutenticacaoSupremo.searchUsers(searchTerm);
          setUsers(results);
        } catch (error) {
          console.error("Search error", error);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Efeito para se inscrever a mudanças nos relacionamentos
  useEffect(() => {
    const unsubscribe = systemaRelacaoUsuarios.subscribe(() => {
      // Força a re-renderização para atualizar o status de seguir/seguindo
      setUsers(prevUsers => [...prevUsers]); 
    });
    return () => unsubscribe();
  }, []);

  // Memoiza os usuários enriquecidos para evitar recálculos desnecessários
  const enrichedUsers = useMemo(() => {
    return users.map(user => {
        const username = user.profile?.name || 'unknown';
        const status = systemaRelacaoUsuarios.isFollowing(username);
        const isPrivate = user.profile?.isPrivate || false;
        const isMe = user.email === currentUserEmail;
        const canMessage = (!isPrivate || status === 'following') && !isMe;

        let btnText = 'Seguir';
        let btnClass = 'action-btn btn-follow';

        if (status === 'requested') {
            btnText = 'Solicitado';
            btnClass = 'action-btn btn-requested';
        } else if (status === 'following') {
            btnText = 'Seguindo';
            btnClass = 'action-btn btn-following';
        }

        return {
            ...user,
            isMe,
            canMessage,
            followStatus: status,
            btnText,
            btnClass
        };
    });
  }, [users, currentUserEmail]); // A dependência do 'tick' foi removida

  // Ação de seguir/deixar de seguir
  const handleAction = async (user: User) => {
    const username = user.profile?.name;
    if (!username || processingId) return;

    setProcessingId(user.id);
    try {
      const status = systemaRelacaoUsuarios.isFollowing(username);
      if (status === 'none') {
        await systemaRelacaoUsuarios.followUser(username);
      } else {
        await systemaRelacaoUsuarios.unfollowUser(username);
      }
      // O subscribe já vai cuidar de atualizar a UI
    } catch (error: any) {
      console.error("[Search] Follow error:", error);
      // A UI pode mostrar um erro aqui
    } finally {
      setProcessingId(null);
    }
  };

  const handleProfileClick = (username: string) => {
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    navigate(`/user/${cleanUsername}`);
  };

  const handleMessageClick = (user: User) => {
    if (currentUserEmail && user.email) {
      const chatId = chatService.getPrivateChatId(currentUserEmail, user.email);
      navigate(`/chat/${chatId}`);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/messages');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredUsers: enrichedUsers,
    loading,
    processingId,
    handleAction,
    handleProfileClick,
    handleMessageClick,
    handleBack
  };
};
