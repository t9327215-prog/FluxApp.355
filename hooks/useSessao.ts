
import { useEffect, useState } from 'react';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { Usuario } from '../ServiçosFrontend/ServiçoDeAutenticação/Processo.Gestao.Conta';

const hookLogger = createHookLogger('useSessao');

export const useSessao = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [erroSessao, setErroSessao] = useState<Error | null>(null);

  useEffect(() => {
    const verificarSessao = async () => {
      hookLogger.logStart('verificacaoSessao');
      try {
        const usuario = await servicoAutenticacao.obterSessao();
        setUser(usuario);
        if (usuario) {
            hookLogger.logSuccess('verificacaoSessao', { 
              status: 'estabelecida', 
              user: { id: usuario.id, nome_usuario: usuario.nome_usuario, email: usuario.email }
            });
        } else {
            hookLogger.logSuccess('verificacaoSessao', { status: 'anonima' });
        }
      } catch (error) {
        const erroApanhado = error instanceof Error ? error : new Error(`Erro inesperado durante a verificação da sessão: ${JSON.stringify(error)}`);
        setErroSessao(erroApanhado);
        hookLogger.logError('verificacaoSessao', erroApanhado);
      } finally {
        setCarregandoSessao(false);
      }
    };

    verificarSessao();
  }, []);

  return {
    usuario: user,
    carregandoSessao,
    erroSessao,
  };
};
