
import { useEffect, useState } from 'react';
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';
import { Usuario } from '../ServiçosFrontend/ServiçoDeAutenticação/Processo.Gestao.Conta';

/**
 * Hook para obter e monitorar o estado da sessão do usuário em toda a aplicação.
 */
export const useSessao = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [erroSessao, setErroSessao] = useState<Error | null>(null);

  useEffect(() => {
    const verificarSessao = async () => {
      setCarregandoSessao(true);
      try {
        // 1. Delega a lógica para o serviço de aplicação
        const usuarioRetornado = await servicoDeAplicacaoDeAutenticacao.obterSessao();
        // 2. Atualiza o estado da UI com o resultado
        setUsuario(usuarioRetornado);
      } catch (error) {
        // 3. Gerencia o estado de erro da UI
        const erroApanhado = error instanceof Error ? error : new Error(`Erro inesperado na sessão: ${JSON.stringify(error)}`);
        setErroSessao(erroApanhado);
      } finally {
        // 4. Garante que o estado de carregamento seja limpo
        setCarregandoSessao(false);
      }
    };

    verificarSessao();
  }, []); // Executa apenas uma vez na montagem do componente

  return {
    usuario,
    carregandoSessao,
    erroSessao,
  };
};
