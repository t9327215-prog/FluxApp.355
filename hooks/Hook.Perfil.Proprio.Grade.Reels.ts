
import { useState, useEffect } from 'react';
import { ServiçoPublicacaoReels } from '../ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoReels.js';

export const usePerfilProprioGradeReels = (userId: string) => {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        // O serviço getAll busca os reels do usuário autenticado via token
        const reelsDoServico = await ServiçoPublicacaoReels.getAll();
        setReels(reelsDoServico);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReels();
    }
  }, [userId]);

  return { reels, loading, error };
};
