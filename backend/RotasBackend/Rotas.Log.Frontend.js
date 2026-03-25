
import express from 'express';
import { frontendLogger } from '../config/Sistema.Escritor.Logs.js';

const router = express.Router();

/**
 * Rota para receber e registrar logs estruturados vindos do frontend.
 * 
 * Esta rota espera que o corpo da requisição (req.body) seja um objeto
 * que já contenha a estrutura de log padronizada, incluindo o nível do log.
 */
router.post('/', (req, res) => {
  const logData = req.body;

  // Extrai o nível do log dos dados recebidos, com 'info' como padrão.
  const level = logData.level && typeof logData.level === 'string' 
    ? logData.level.toLowerCase() 
    : 'info';

  // O objeto de log do frontend deve conter todas as informações necessárias,
  // como camada, componente, arquivo, mensagem e dados.
  // O backend apenas o encaminha para o logger correto.
  
  // Remove a propriedade 'level' para não duplicá-la no objeto de log final
  const { level: _, ...logPayload } = logData;

  // Verifica se o método de log correspondente ao nível existe.
  if (typeof frontendLogger[level] === 'function') {
    // Passa o objeto de log diretamente para a função do logger.
    // O trace de execução não é gerado aqui, pois o contexto é do frontend.
    // O ideal é que o frontend gere e inclua o trace, se necessário.
    frontendLogger[level](logPayload);
  } else {
    // Se o nível for inválido, registra como 'info' e inclui o nível original nos dados.
    frontendLogger.info({
      ...logPayload,
      dados: {
        ...(logPayload.dados || {}),
        originalLevel: level,
        warning: 'Nível de log inválido recebido do frontend.'
      }
    });
  }

  // Responde imediatamente para não bloquear o cliente.
  res.status(202).send({ status: 'Log recebido para processamento.' });
});

export default router;
