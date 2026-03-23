
import express from 'express';
const router = express.Router();

// Rota para receber logs do frontend
router.post('/', (req, res) => {
  const logEntry = req.body;
  
  // Usar o sistema de log do backend para registrar o log vindo do frontend
  // Adaptado para o formato de log que você compartilhou
  console.log(JSON.stringify({
    level: logEntry.level ? logEntry.level.toLowerCase() : 'info',
    time: logEntry.timestamp || new Date().toISOString(),
    pid: process.pid,
    hostname: 'frontend', // Identificar a origem do log
    camada: "FRONTEND",
    event: "LOG",
    http: {
        traceId: logEntry.traceId,
    },
    ...logEntry, // Inclui o resto dos dados do log
    msg: `[Frontend] ${logEntry.message}`
  }));

  res.status(200).send('Log received');
});

export default router;
