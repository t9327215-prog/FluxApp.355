// backend/ServicosBackend/Sistema.Taxas.Stripe.js

/**
 * Módulo central para calcular as taxas de aplicação (application fee) da plataforma Flux.
 * Isola a lógica de negócio de taxas para fácil manutenção e futuras alterações.
 */

/**
 * Calcula a taxa de aplicação (application fee) para a plataforma com base no valor da transação.
 * A taxa é um valor fixo de 10% sobre o total.
 * 
 * @param {number} totalAmount - O valor total da transação na menor unidade monetária (ex: centavos).
 * @returns {number} O valor da taxa a ser retido pela plataforma, arredondado para o inteiro mais próximo.
 */
const calcularTaxaPlataforma = (totalAmount) => {
    // Garante que o valor de entrada é válido para o cálculo.
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
        console.warn("Valor inválido fornecido para cálculo de taxa. A taxa será zero.");
        return 0;
    }

    // A taxa da plataforma é de 10%.
    const TAXA_PERCENTUAL = 0.10;
    
    // Calcula a taxa e arredonda para o centavo mais próximo para evitar frações.
    const fee = Math.floor(totalAmount * TAXA_PERCENTUAL);
    
    console.log(`Taxa da plataforma calculada: ${fee} para um total de ${totalAmount}`);

    return fee;
};

export default {
    calcularTaxaPlataforma,
};
