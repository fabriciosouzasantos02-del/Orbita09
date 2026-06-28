import React, { useState } from 'react';
import { Sparkles, Lock, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslation, Language } from '../lib/translations';

interface PremiumConversionScreenProps {
  currentLang: Language;
  onUpgradeComplete: (isPremium: boolean) => void;
  userEmail: string;
  updateUserProfileOnDb: (email: string, payload: any) => Promise<any>;
}

export const PremiumConversionScreen: React.FC<PremiumConversionScreenProps> = ({
  currentLang,
  onUpgradeComplete,
  userEmail,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const t = (key: string, fallback?: string) => getTranslation(currentLang, key, fallback);

  const plansList = [
    { 
      id: 'monthly' as const, 
      name: t('plan_monthly_name', 'Mensal'), 
      price: '9,99 EUR / mês', 
      stripePrice: '9,99 EUR', 
      desc: t('plan_monthly_desc', 'Acesso completo e ilimitado a todas as ferramentas astrológicas.') 
    },
    { 
      id: 'annual' as const, 
      name: t('plan_annual_name', 'Anual (Economize 33%)'), 
      price: '79,99 EUR / ano', 
      stripePrice: '79,99 EUR', 
      desc: t('plan_annual_desc', 'Melhor valor. Acesso ilimitado o ano todo (apenas 6,66 EUR/mês).') 
    }
  ];

  const handleStripeCheckout = async () => {
    if (!userEmail) {
      alert(t('user_not_found', 'ID do usuário/Email não encontrado.'));
      return;
    }
    setIsProcessing(true);
    try {
      const activePlan = plansList.find(p => p.id === selectedPlan) || plansList[0];
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          planId: selectedPlan,
          planName: activePlan.name,
          lang: currentLang
        })
      });

      if (!response.ok) {
        throw new Error('Network response not ok');
      }

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.error || 'Invalid session response');
      }
    } catch (err: any) {
      console.error("Stripe Checkout error:", err);
      alert(t('checkout_error', 'Erro ao gerar sessão de pagamento com a Stripe.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="premium-conversion-screen" className="relative z-10 space-y-10 pb-4 max-w-5xl mx-auto px-1">
      <AnimatePresence mode="wait">
        {step === 'checkout' ? (
          <motion.div
            key="checkout-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Col: High-converting psychological text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  {t('conversion_headline', 'ALINHAMENTO CÓSMICO PREMIUM')}
                </span>
                <h1 className="text-2xl md:text-4xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-slate-200 to-slate-400 leading-tight">
                  {t('conversion_card_title', 'Sua Mandala Ancestral está Pronta')}
                </h1>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-semibold">
                  {t('conversion_p1', 'Durante os últimos dias você teve acesso à nossa tecnologia avançada de interpretação astrológica personalizada em tempo real.')}
                </p>
              </div>

              {/* Core Benefits / Story telling paragraphs */}
              <div className="space-y-4 text-xs text-slate-400 leading-relaxed border-l-2 border-slate-850 pl-4 font-sans">
                <p>
                  {t('conversion_p2', 'Por trás de cada análise existe uma avançada tecnologia astrológica e de inteligência artificial que processa continuamente milhares de cálculos personalizados com base no seu mapa astral, trânsitos planetários, posições celestes, casas astrológicas, aspectos ativos, Lua, Sol, ascendente e ciclos cósmicos que influenciam sua jornada neste exato momento.')}
                </p>
                <p>
                  {t('conversion_p3', 'Diferente de aplicativos genéricos, o Orbita não entrega interpretações padronizadas. Nossa tecnologia monitora constantemente as movimentações celestes e cruza essas informações com a sua configuração astral exclusiva, gerando orientações altamente personalizadas, alinhadas à sua frequência energética atual.')}
                </p>
                <p>
                  {t('conversion_p4', 'Sua assinatura contribui para manter toda essa estrutura funcionando: servidores de processamento em tempo real, sistemas avançados de inteligência artificial, atualização contínua dos dados astrológicos globais e o desenvolvimento constante de novos recursos exclusivos.')}
                </p>
                <p>
                  {t('conversion_p5', 'Ao continuar sua jornada, você mantém acesso ilimitado a uma plataforma criada para oferecer autoconhecimento, clareza, direcionamento e uma leitura cósmica profundamente personalizada, algo que nenhum mapa genérico consegue entregar.')}
                </p>
                <p className="text-amber-400/90 font-medium">
                  {t('conversion_p6', 'Milhares de cálculos astrológicos são processados continuamente para gerar suas previsões, análises e recomendações diárias.')}
                </p>
              </div>

              {/* Interactive Plan Selector */}
              <div id="stripe-plan-selector" className="space-y-3 pt-2">
                <span className="inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-widest text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-sm">
                  {t('choose_celestial_connection', 'Escolha sua Conexão Celeste')}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plansList.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-4 rounded-2xl text-left border cursor-pointer transition flex flex-col justify-between ${
                        selectedPlan === plan.id
                          ? 'bg-amber-500/10 border-amber-500 text-slate-100 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                          : 'bg-slate-900/30 border-slate-850 hover:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center gap-1">
                          <span className="text-xs font-black tracking-tight leading-none block text-slate-250">{plan.name}</span>
                          {selectedPlan === plan.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-snug font-sans">{plan.desc}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-slate-850/50 flex justify-between items-baseline">
                        <span className="text-[8px] font-mono opacity-50 uppercase">{plan.price}</span>
                        <span className="text-xs font-mono font-bold text-amber-400">{plan.stripePrice}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Minimalist Ultra-Premium Checkout Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden text-left">
                {/* Subtle backgrounds glowing */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.03] rounded-full blur-2xl pointer-events-none" />

                <div className="pb-4 border-b border-slate-850 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-slate-200 font-sans">{t('sub_billing_info', 'Dados de Pagamento')}</h3>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">{t('stripe_secure_billing', 'Assinatura Via Stripe Segura')}</p>
                  </div>
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>

                <div className="space-y-4 pt-1">
                  <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono uppercase text-slate-400">{t('selected_plan', 'Plano Ativo')}</span>
                      <span className="text-xs font-bold text-amber-400">
                        {plansList.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-mono uppercase text-slate-400">{t('billing_price', 'Custo de Assinatura')}</span>
                      <span className="font-mono text-[11px] font-bold text-slate-200">
                        {plansList.find(p => p.id === selectedPlan)?.stripePrice}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-normal border-t border-slate-900 pt-2 font-mono">
                      {t('stripe_disclaimer', 'Ao clicar no botão abaixo, você será redirecionado temporariamente para o ambiente seguro do Stripe para concluir sua assinatura com total segurança.')}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleStripeCheckout}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:via-indigo-500 hover:to-amber-400 text-slate-100 text-xs font-black uppercase tracking-wider rounded-xl transition duration-300 disabled:opacity-75 shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t('stripe_tuning', 'Sintonizando Stripe...')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('btn_upgrade', 'Continuar Minha Jornada')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secure Badge */}
                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {t('ssl_direct_connection', 'CONEXÃO SSL DIRECT')}
                  </span>
                  <span>{t('pci_secure_certified', 'PCI SECURE CERTIFIED')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/60 p-8 md:p-12 rounded-3xl border border-amber-500/25 text-center space-y-6 max-w-xl mx-auto shadow-[0_0_50px_rgba(245,158,11,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center mx-auto shadow-lg border border-amber-400/20">
              <CheckCircle2 className="w-8 h-8 text-slate-950 animate-bounce" />
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-extrabold block">{t('alignment_completed', 'Alinhamento Concluído')}</span>
              <h2 className="text-2xl font-sans font-black text-slate-50 tracking-tight">
                {t('welcome_celestial_elite', 'Bem-vindo ao Elite Celestial!')}
              </h2>
              <p className="text-xs text-slate-350 leading-relaxed font-sans max-w-sm mx-auto">
                {t('success_view_unlocked', 'Sua assinatura premium foi sintonizada com sucesso. Todos os recursos cósmicos e ferramentas astrológicas avançadas foram desbloqueados para você!')}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onUpgradeComplete(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-450 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md hover:shadow-lg focus:outline-hidden cursor-pointer"
              >
                {t('start_my_readings', 'Iniciar Minhas Leituras')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
