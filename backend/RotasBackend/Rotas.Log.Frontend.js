
import express from 'express';

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
  switch (level) {
    case 'error':
      console.error(logPayload);
      break;
    case 'warn':
      console.warn(logPayload);
      break;
    case 'info':
      console.info(logPayload);
      break;
    case 'debug':
        console.debug(logPayload);
        break;
    default:
        console.log({
            ...logPayload,
            dados: {
            ...(logPayload.dados || {}),
            originalLevel: level,
            warning: 'Nível de log inválido recebido do frontend.'
            }
        });
      break;
  }

  // Responde imediatamente para não bloquear o cliente.
  res.status(202).send({ status: 'Log recebido para processamento.' });
});

export default router;
