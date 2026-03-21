// --- SafeFetchPatcher.ts ---
// Este módulo fornece uma maneira segura de modificar ("monkey-patch") a função global `fetch`.
// Ele garante que o contexto (`window`) nunca seja perdido e permite que múltiplos
// serviços "embrulhem" a função fetch em uma cadeia previsível.

type FetchFunction = (url: URL | RequestInfo, config?: RequestInit) => Promise<Response>;

// 1. Mantém uma referência à função fetch nativa e original.
const nativeFetch = window.fetch;

// 2. Cria a nossa "cadeia" de fetch. A função no final da cadeia faz uma chamada segura
//    ao fetch nativo, garantindo o contexto com `.call(window, ...)`.
let fetchChain: FetchFunction = (url, config) => nativeFetch.call(window, url, config);

/**
 * Envolve a cadeia de fetch existente com um novo wrapper.
 * 
 * @param newWrapper A função que interceptará as chamadas fetch. Ela recebe
 *                   a função 'next' para continuar a cadeia.
 */
function patchFetch(newWrapper: (next: FetchFunction, url: URL | RequestInfo, config?: RequestInit) => Promise<Response>) {
    const previousChain = fetchChain;
    
    // O novo "elo" da cadeia é o newWrapper, que recebe o elo anterior como 'next'.
    fetchChain = (url, config) => newWrapper(previousChain, url, config);
    
    // 3. Substitui o fetch global por uma função que simplesmente invoca a nossa cadeia.
    //    Como `fetchChain` é construída com arrow functions, ela não depende de 'this',
    //    tornando a chamada segura.
    window.fetch = (url, config) => fetchChain(url, config);
}

/**
 * Um objeto que expõe a funcionalidade de patching de forma controlada.
 * Os serviços devem usar `SafeFetchPatcher.apply` para adicionar sua lógica.
 */
export const SafeFetchPatcher = {
    apply: patchFetch,
};
