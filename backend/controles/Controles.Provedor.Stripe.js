
// backend/controles/Controles.Provedor.Stripe.js
import Stripe from 'stripe';
import config from '../config/Variaveis.Backend.js';
import SistemaTaxasStripe from '../ServicosBackend/Sistema.Taxas.Stripe.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    requisicaoInvalida: (r, m = "Requisição inválida") => r.status(400).json({ sucesso: false, mensagem: m }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
    naoAutorizado: (r, m = "Não autorizado") => r.status(401).json({ sucesso: false, mensagem: m }),
    naoEncontrado: (r, m = "Recurso não encontrado") => r.status(404).json({ sucesso: false, mensagem: m }),
    servicoIndisponivel: (r, m = "Serviço indisponível") => r.status(503).json({ sucesso: false, mensagem: m }),
    requisicaoMalSucedida: (r, m = "Requisição mal sucedida") => r.status(400).json({ sucesso: false, mensagem: m }),
};

let stripe = null;

if (config.stripeSecretKey) {
    stripe = new Stripe(config.stripeSecretKey);
    console.log('Stripe inicializado', { event: 'STRIPE_INITIALIZED' });
} else {
    console.warn('Stripe não inicializado', { event: 'STRIPE_NOT_INITIALIZED', message: 'Stripe secret key not found' });
}

const getSellerStripeAccountId = async (sellerEmail) => {
    console.log('Obtendo ID da conta Stripe do vendedor', { event: 'STRIPE_GET_SELLER_ACCOUNT_ID', sellerEmail });
    // TODO: Implementar lógica real para buscar o ID da conta Stripe do vendedor
    return 'acct_1PGGceR5gdo2V8nF';
};

const createPaymentIntent = async (req, res) => {
    if (!stripe) {
        console.error('Erro ao criar intenção de pagamento Stripe: Stripe não configurado', { event: 'STRIPE_PAYMENT_INTENT_ERROR', errorMessage: 'Stripe not configured' });
        return httpRes.servicoIndisponivel(res, "O sistema de pagamentos não está configurado. Contate o suporte.");
    }

    const { amount, currency, creatorEmail } = req.body;
    console.log('Iniciando criação de intenção de pagamento Stripe', { event: 'STRIPE_CREATE_PAYMENT_INTENT_START', amount, currency, creatorEmail });

    if (!creatorEmail) {
        console.warn('O e-mail do criador é obrigatório', { event: 'STRIPE_CREATE_PAYMENT_INTENT_WARN', message: 'Creator email is required' });
        return httpRes.requisicaoMalSucedida(res, "O e-mail do criador é obrigatório para processar o pagamento.");
    }

    try {
        const destinationAccountId = await getSellerStripeAccountId(creatorEmail);

        if (!destinationAccountId) {
            console.warn('Conta de destino não encontrada', { event: 'STRIPE_CREATE_PAYMENT_INTENT_WARN', message: 'Destination account not found' });
            return httpRes.naoEncontrado(res, "A conta de pagamento do vendedor não foi encontrada ou não está conectada.");
        }

        const applicationFee = SistemaTaxasStripe.calcularTaxaPlataforma(amount);
        console.log('Taxa da plataforma calculada', { event: 'STRIPE_APPLICATION_FEE_CALCULATED', applicationFee });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            application_fee_amount: applicationFee,
            transfer_data: {
                destination: destinationAccountId,
            },
        });

        console.log('Intenção de pagamento Stripe criada com sucesso', { event: 'STRIPE_CREATE_PAYMENT_INTENT_SUCCESS', paymentIntentId: paymentIntent.id });
        httpRes.criado(res, { clientSecret: paymentIntent.client_secret });

    } catch (error) {
        console.error('Erro ao criar intenção de pagamento Stripe', { event: 'STRIPE_CREATE_PAYMENT_INTENT_ERROR', errorMessage: error.message, amount, currency, creatorEmail });
        httpRes.erro(res, error.message, 400);
    }
};

const checkSessionStatus = async (req, res) => {
    if (!stripe) {
        console.error('Erro ao verificar status da sessão Stripe: Stripe não configurado', { event: 'STRIPE_CHECK_SESSION_STATUS_ERROR', errorMessage: 'Stripe not configured' });
        return httpRes.servicoIndisponivel(res, "O sistema de pagamentos não está configurado. Contate o suporte.");
    }

    const { sessionId } = req.params;
    console.log('Iniciando verificação de status da sessão Stripe', { event: 'STRIPE_CHECK_SESSION_STATUS_START', sessionId });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Status da sessão Stripe verificado com sucesso', { event: 'STRIPE_CHECK_SESSION_STATUS_SUCCESS', sessionId, status: session.status });
        httpRes.sucesso(res, { status: session.status, payment_status: session.payment_status });
    } catch (error) {
        console.error('Erro ao verificar status da sessão Stripe', { event: 'STRIPE_CHECK_SESSION_STATUS_ERROR', errorMessage: error.message, sessionId });
        httpRes.erro(res, error.message, 400);
    }
};

export default {
    createPaymentIntent,
    checkSessionStatus
};
