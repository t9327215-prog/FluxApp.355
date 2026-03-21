
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ServicoGestaoCredencialStripe } from '../../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialStripe';
import VariaveisFrontend from '../../../ServiçosFrontend/Config/Variaveis.Frontend.js';
import { StripeSepaForm } from './StripeSepaForm';
import { Group } from '../../../types';
import { GeoData } from '../../../ServiçosFrontend/geoService';

// Carrega a instância da Stripe. Isso deve ser feito fora da renderização para evitar recriações.
const stripePromise = loadStripe(VariaveisFrontend.stripePublicKey);

interface GestorCheckoutStripeSepaProps {
    group: Group;
    geo: GeoData | null;
    onBack: () => void;
    // A função onSuccess pode receber o ID da intenção de pagamento para referência futura.
    onSuccess: (paymentIntentId: string) => void;
}

/**
 * Componente "Wrapper" (Gestor) para o formulário de Débito SEPA.
 * Sua responsabilidade é criar uma Intenção de Pagamento no backend e
 * preparar o ambiente seguro da Stripe para o formulário de coleta de dados.
 */
export const GestorCheckoutStripeSepa: React.FC<GestorCheckoutStripeSepaProps> = ({ group, geo, onBack, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const createIntent = async () => {
            setLoading(true);
            try {
                // Solicita ao backend a criação de uma intenção de pagamento específica para 'sepa_debit'.
                const intent = await ServicoGestaoCredencialStripe.createPaymentIntent(group, group.creatorEmail!, 'sepa_debit');
                if (intent.clientSecret) {
                    setClientSecret(intent.clientSecret);
                } else {
                    setError('Não foi possível iniciar o pagamento. Tente novamente.');
                }
            } catch (err: any) {
                setError(err.message || 'Erro ao conectar com o provedor de pagamento.');
            }
            setLoading(false);
        };

        createIntent();
    }, [group]); // Recria a intenção se o 'group' (produto) mudar.

    // Feedback visual durante o carregamento inicial.
    if (loading) {
        return (
            <div className="py-20 text-center animate-pulse">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-4"></i>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Preparando checkout seguro...</p>
            </div>
        );
    }

    // Feedback visual em caso de erro na criação da intenção.
    if (error) {
        return (
            <div className="py-10 text-center text-red-400">
                <i className="fa-solid fa-circle-exclamation text-3xl mb-4"></i>
                <p className="font-bold">{error}</p>
                <button onClick={onBack} className="mt-6 text-sm text-gray-400 hover:text-white">Voltar</button>
            </div>
        );
    }

    // Não renderiza nada se o clientSecret não estiver pronto.
    if (!clientSecret) return null;

    // Passa o clientSecret para o provider <Elements>.
    const options = { clientSecret };

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripeSepaForm 
                geo={geo} 
                onBack={onBack} 
                onSuccess={onSuccess}
                // Passa o 'group' e o email do criador para o formulário,
                // que precisará deles para preencher os dados de pagamento.
                group={group}
                creatorEmail={group.creatorEmail!}
            />
        </Elements>
    );
};
