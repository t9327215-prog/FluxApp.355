
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HookVendasGrupoVip } from '../hooks/Hook.Vendas.Grupo.Vip';
import { useAutoLanguage } from '../hooks/Hook.Idioma.Automatico';

// Dados e componentes de UI
import { mockVipGroupSalesData } from '../ServiçosFrontend/ServiçoDeSimulação/simulacoes/Simulacao.Pagina.Vendas';
import { CabecalhoPaginasVendas } from '../Componentes/ComponentesDePaginasDeVendas/Cabecalho.Paginas.Vendas';
import { CardPreco } from '../Componentes/ComponentesDePaginasDeVendas/Card.Preco';
import { CardPrevias } from '../Componentes/ComponentesDePaginasDeVendas/Card.Previas';
import { CardDescricao } from '../Componentes/ComponentesDePaginasDeVendas/Card.Descricao';
import { CardCTAPrincipal } from '../Componentes/ComponentesDePaginasDeVendas/Card.CTA.principal';
import { ModalPreviasPaises } from '../Componentes/ComponentesDePaginasDeVendas/Modal.Previas.Paises';
import { CardMediaZoom } from '../Componentes/ComponentesDePaginasDeVendas/Card.MediaZoom';

// Modo de simulação ativado
const IS_SIMULATED_MODE = true; 

export const VipGroupSales: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (IS_SIMULATED_MODE) {
    const [modals, setModals] = useState({ 
        zoomIndex: null as number | null, 
        pix: false, 
        email: false, 
        simulator: false 
    });
    
    // ESTADOS DA SIMULAÇÃO
    const [simulatedGeo, setSimulatedGeo] = useState<{ countryCode: string, currency: string, countryName: string } | null>(null);
    const [simulationProvider, setSimulationProvider] = useState<'stripe' | 'paypal' | 'syncpay' | null>(null);

    const { group, media, copy, pricing } = mockVipGroupSalesData;

    const [simulatedPrice, setSimulatedPrice] = useState(`R$${pricing.monthly.price.toFixed(2)}`);
    const [simulatedCtaText, setSimulatedCtaText] = useState("Entrar no Clube");

    useEffect(() => {
        if (simulatedGeo) {
            const basePriceBRL = pricing.monthly.price;
            const rates: { [key: string]: { rate: number, symbol: string } } = {
                'BR': { rate: 1, symbol: 'R$' }, 'US': { rate: 0.19, symbol: '$' }, 'PT': { rate: 0.18, symbol: '€' },
                'SG': { rate: 0.26, symbol: 'S$' }, 'JP': { rate: 28.5, symbol: '¥' }, 'DE': { rate: 0.18, symbol: '€' },
                'GB': { rate: 0.15, symbol: '£' }, 'AU': { rate: 0.28, symbol: 'A$' }, 'MX': { rate: 3.5, symbol: 'Mex$' },
            };
            const targetCountry = simulatedGeo.countryCode.toUpperCase();
            const conversion = rates[targetCountry] || rates['BR'];
            const convertedPrice = basePriceBRL * conversion.rate;
            setSimulatedPrice(`${conversion.symbol}${convertedPrice.toFixed(2)}`);

            const countryToLang: { [key: string]: string } = {
                'BR': 'PT', 'PT': 'PT', 'US': 'EN', 'GB': 'EN', 'AU': 'EN', 'SG': 'EN',
                'JP': 'JA', 'DE': 'DE', 'MX': 'ES',
            };
            const translations: { [key: string]: string } = {
                'PT': 'Entrar no Clube', 'EN': 'Join the Club', 'JA': 'クラブに参加する',
                'DE': 'Klub beitreten', 'ES': 'Unirse al Club',
            };
            const lang = countryToLang[targetCountry] || 'PT';
            setSimulatedCtaText(translations[lang] || translations['PT']);
        }
    }, [simulatedGeo, pricing.monthly.price]);

    const openSimulator = () => setModals(prev => ({ ...prev, simulator: true }));
    const closeModals = () => setModals({ zoomIndex: null, pix: false, email: false, simulator: false });

    const handleSimulateConfirm = (provider: 'stripe' | 'paypal' | 'syncpay', country: any) => {
      setSimulationProvider(provider);
      setSimulatedGeo({ countryCode: country.code, currency: country.currency, countryName: country.name });
      setModals(prev => ({ ...prev, simulator: false }));
    };

    const handlePurchase = () => {
        if (!simulationProvider) {
            openSimulator();
            return;
        }
        setModals(prev => ({ ...prev, pix: true })); 
    };

    return (
      <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col pb-[100px]">
        <CabecalhoPaginasVendas isOwner={true} isSimulated={true} onSimulateClick={openSimulator} />
        <main className="flex-grow pt-[85px] px-5 text-center max-w-[600px] mx-auto w-full">
          <CardPreco geoData={simulatedGeo || { countryCode: 'BR', currency: 'BRL', countryName: 'Brasil' }} />
          <div className="mt-2 mb-6">
            <h1 className="text-2xl font-black text-white px-4 tracking-tight">{group.name}</h1>
          </div>
          <CardPrevias mediaItems={media} currentSlide={0} playingIndex={-1} containerRef={{ current: null }} onScroll={() => {}} onMediaClick={(index) => setModals(prev => ({...prev, zoomIndex: index }))} onToggleVideo={() => {}} />
          <CardDescricao text={copy.longDescription} />
          <CardCTAPrincipal
            isEnabled={true}
            isRenewal={false}
            ctaText={simulatedCtaText}
            formattedPrice={simulatedPrice}
            onClick={handlePurchase}
            hasSelectedProvider={!!simulationProvider}
          />
          <div className="mt-4 flex flex-col gap-1 items-center opacity-30">
            <span className="text-[9px] font-black uppercase tracking-widest">Pagamento Seguro</span>
            <div className="flex gap-4 text-sm mt-1">
              <i className="fa-brands fa-cc-visa"></i>
              <i className="fa-brands fa-cc-mastercard"></i>
              <i className="fa-solid fa-pix"></i>
            </div>
          </div>
        </main>
        <CardMediaZoom items={media.map(m => ({ url: m.url, type: m.type || 'image' }))} initialIndex={modals.zoomIndex} onClose={closeModals} />
        
        {/* CHAMADA CORRIGIDA: Passando todos os dados da simulação para o gerenciador de modais */}
        <ModalPreviasPaises 
          isOpen={modals} 
          onClose={closeModals} 
          group={group} 
          onEmailSuccess={() => {}} 
          onSimulateConfirm={handleSimulateConfirm}
          
          // Props essenciais para o modo de simulação
          isSimulated={true}
          simulationProvider={simulationProvider}
          simulatedGeo={simulatedGeo}
          priceInfo={null} // Não usado em simulação
          geoData={null}   // Não usado em simulação
        />
      </div>
    );
  }

  // ... (código de produção inalterado)
  const [isSimulated, setIsSimulated] = useState(false);
  const [forcedProvider, setForcedProvider] = useState<'syncpay' | 'stripe' | 'paypal' | null>(null);
  const { group, loading, error, isCreator, isPurchaseEnabled, modals, currentSlide, playingIndex, carouselRef, displayPriceInfo, geoData, setGeoData, handleScroll, handleToggleVideo, handlePurchaseClick, openSimulator, closeModals, setZoom, onEmailSuccess } = HookVendasGrupoVip(id);
  const { lang, isTranslating, translatedData, t } = useAutoLanguage(group);
  const normalizedMedia = useMemo(() => {
    if (!group?.vipDoor) return [];
    const items = group.vipDoor.mediaItems || [];
    if (items.length === 0 && group.vipDoor.media) {
      return [{ url: group.vipDoor.media, type: group.vipDoor.mediaType || 'image' }];
    }
    return items;
  }, [group?.vipDoor]);
  const handlePurchase = () => { handlePurchaseClick(); };
  if (loading) return <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center"><i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i></div>;
  if (error || !group) return <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center p-10 text-center"><i className="fa-solid fa-circle-exclamation text-4xl text-red-500 mb-4"></i><h2 className="text-xl font-bold">Grupo não encontrado</h2><button onClick={() => navigate('/groups')} className="mt-6 px-6 py-3 bg-[#00c2ff] text-black font-bold rounded-xl">Voltar</button></div>;
  const handleApplySimulation = (provider: 'syncpay' | 'stripe' | 'paypal', country: any) => {
      setIsSimulated(true);
      setForcedProvider(provider);
      setGeoData({ countryCode: country.code, countryName: country.name, currency: country.currency, ip: '127.0.0.1' });
      closeModals();
      setTimeout(() => { handlePurchaseClick(); }, 300);
  };

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col pb-[100px]">
      <CabecalhoPaginasVendas isOwner={isCreator} isSimulated={isSimulated} onSimulateClick={openSimulator} />
      <main className="flex-grow pt-[85px] px-5 text-center max-w-[600px] mx-auto w-full">
        <CardPreco geoData={geoData} />
        <div className="mt-2 mb-6"><h1 className="text-2xl font-black text-white px-4 tracking-tight">{translatedData?.name || group.name}</h1></div>
        <CardPrevias mediaItems={normalizedMedia} currentSlide={currentSlide} playingIndex={playingIndex} containerRef={carouselRef} onScroll={handleScroll} onMediaClick={setZoom} onToggleVideo={handleToggleVideo} />
        <CardDescricao text={translatedData?.vipDoorText || group.vipDoor?.text || ''} />
        <CardCTAPrincipal isEnabled={isPurchaseEnabled} isRenewal={false} ctaText={translatedData?.vipButtonText || group.vipDoor?.buttonText || t('buy_now')} formattedPrice={displayPriceInfo?.formatted} onClick={handlePurchase} hasSelectedProvider={true} />
        <div className="mt-4 flex flex-col gap-1 items-center opacity-30"><span className="text-[9px] font-black uppercase tracking-widest">{t('secure_payment')}</span><div className="flex gap-4 text-sm mt-1"><i className="fa-brands fa-cc-visa"></i><i className="fa-brands fa-cc-mastercard"></i><i className="fa-solid fa-pix"></i></div></div>
      </main>
      <ModalPreviasPaises isOpen={modals} onClose={closeModals} group={group} geoData={geoData} priceInfo={displayPriceInfo} onEmailSuccess={onEmailSuccess} onSimulateConfirm={handleApplySimulation} forcedProvider={forcedProvider} />
      <CardMediaZoom items={normalizedMedia} initialIndex={modals.zoomIndex} onClose={closeModals} />
    </div>
  );
};
