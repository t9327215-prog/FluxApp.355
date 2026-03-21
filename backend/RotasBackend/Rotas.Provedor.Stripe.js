
import express from 'express';
import stripeController from '../controles/Controles.Provedor.Stripe.js';

const router = express.Router();

// --- Processamento de Pagamento Stripe ---

// @route   POST /api/stripe/create
// @desc    Cria uma intenção de pagamento
router.post('/create', stripeController.createPaymentIntent);

// @route   POST /api/stripe/status/:sessionId
// @desc    Verifica o status de uma sessão de pagamento
router.post('/status/:sessionId', stripeController.checkSessionStatus);


export default router;
