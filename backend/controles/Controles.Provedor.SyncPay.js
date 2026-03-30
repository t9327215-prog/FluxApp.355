
// backend/controles/Controles.Provedor.SyncPay.js

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
};

const saveCredentials = (req, res) => {
    console.log('Requisição para salvar credenciais do SyncPay', { event: 'SYNCPAY_SAVE_CREDENTIALS_REQUESTED' });
    httpRes.criado(res, null, "Rota para salvar credenciais do SyncPay funcionando!");
};

const disconnectAccount = (req, res) => {
    console.log('Requisição para desconectar conta do SyncPay', { event: 'SYNCPAY_DISCONNECT_ACCOUNT_REQUESTED' });
    httpRes.sucesso(res, null, "Rota para desconectar conta do SyncPay funcionando!");
};

const createPayment = (req, res) => {
    console.log('Requisição para criar pagamento com SyncPay', { event: 'SYNCPAY_CREATE_PAYMENT_REQUESTED' });
    httpRes.criado(res, null, "Rota para criar pagamento com SyncPay funcionando!");
};

const checkTransactionStatus = (req, res) => {
    console.log('Requisição para verificar status de transação do SyncPay', { event: 'SYNCPAY_CHECK_TRANSACTION_STATUS_REQUESTED' });
    httpRes.sucesso(res, null, "Rota para verificar status de transação do SyncPay funcionando!");
};

export default {
    saveCredentials,
    disconnectAccount,
    createPayment,
    checkTransactionStatus
};
