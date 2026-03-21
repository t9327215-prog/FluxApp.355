
// backend/RotasBackend/Rotas.Sessao.js

import express from 'express';
import controleSessao from '../controles/Controle.Sessao.js';
import authMiddleware from '../config/Middleware.Autenticacao.JWT.js';

const router = express.Router();

// Rotas públicas
router.post('/registrar', controleSessao.registrar);
router.post('/login', controleSessao.login);
router.post('/google', controleSessao.googleAuth);

// Rota protegida
router.post('/logout', authMiddleware, controleSessao.logout);

export default router;
