import { DadosChat } from '../../../types/Saida/Types.Estrutura.Chat';

export const simulacao = {
  async listarConversas(): Promise<DadosChat[]> {
    console.log("[SIMULAÇÃO] ServicoGestaoListaConversas: Buscando conversas simuladas.");
    // Simula uma chamada de rede com um pequeno atraso
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retorna uma lista de conversas mocadas
    return [
      {
        id: 'conversa_1',
        nome: 'Alice',
        foto: 'https://i.pravatar.cc/150?u=alice',
        ultimaMensagem: 'Olá! Tudo bem?',
        horarioUltimaMensagem: '10:30',
        naoLido: 2,
        online: true,
      },
      {
        id: 'conversa_2',
        nome: 'Grupo do Trabalho',
        foto: 'https://i.pravatar.cc/150?u=workgroup',
        ultimaMensagem: 'Carlos: Não se esqueçam da reunião amanhã.',
        horarioUltimaMensagem: '09:15',
        naoLido: 5,
        online: false,
      },
      {
        id: 'conversa_3',
        nome: 'Beatriz',
        foto: 'https://i.pravatar.cc/150?u=beatriz',
        ultimaMensagem: 'Vamos sair hoje à noite?',
        horarioUltimaMensagem: 'Ontem',
        naoLido: 0,
        online: false,
      }
    ];
  }
};
