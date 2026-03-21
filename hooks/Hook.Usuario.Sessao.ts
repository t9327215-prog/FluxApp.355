
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao.tsx';

/**
 * Hook customizado para acessar os dados da sessão do usuário.
 * 
 * Este hook abstrai o `useAuth` e fornece uma interface mais direta 
 * para acessar as informações de `user` e `loading`.
 * 
 * @returns Um objeto contendo `user` (os dados do usuário autenticado ou `null`) 
 * e `loading` (um booleano que indica se a sessão ainda está sendo carregada).
 */
export const useUsuarioSessao = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};
