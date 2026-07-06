import React, { useState } from 'react';
import { Sparkles, Lock, ShieldCheck, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../lib/translations';
import { useTranslation } from 'react-i18next';

const LOCAL_PREMIUM_TRANSLATIONS: Record<Language, Record<string, string>> = {
  pt: {
    "plan_monthly_name": "Mensal",
    "9,99 EUR / mês": "9,99 EUR / mês",
    "plan_monthly_desc": "Acesso completo e ilimitado a todas as ferramentas astrológicas.",
    "plan_annual_name": "Anual (Economize 33%)",
    "79,99 EUR / ano": "79,99 EUR / ano",
    "plan_annual_desc": "Melhor valor. Acesso ilimitado o ano todo (apenas 6,66 EUR/mês).",
    "checkout_ready_title": "Sessão Segura Criada!",
    "checkout_ready_desc": "Seu checkout seguro na Stripe está pronto. Caso o ambiente de pagamento não tenha aberto automaticamente em uma nova aba, clique no botão abaixo para prosseguir com segurança:",
    "btn_open_checkout": "Abrir Checkout Seguro",
    "btn_cancel_checkout": "Voltar e Tentar Novamente"
  },
  en: {
    "plan_monthly_name": "Monthly",
    "9,99 EUR / mês": "9.99 EUR / month",
    "plan_monthly_desc": "Complete and unlimited access to all astrological tools.",
    "plan_annual_name": "Annual (Save 33%)",
    "79,99 EUR / ano": "79.99 EUR / year",
    "plan_annual_desc": "Best value. Unlimited access all year round (just 6.66 EUR/month).",
    "checkout_ready_title": "Secure Session Created!",
    "checkout_ready_desc": "Your secure Stripe checkout is ready. If the payment environment did not open automatically in a new tab, click the button below to proceed securely:",
    "btn_open_checkout": "Open Secure Checkout",
    "btn_cancel_checkout": "Go Back & Try Again"
  },
  es: {
    "plan_monthly_name": "Mensual",
    "9,99 EUR / mês": "9,99 EUR / mes",
    "plan_monthly_desc": "Acceso completo e ilimitado a todas las herramientas astrológicas.",
    "plan_annual_name": "Anual (Ahorra un 33%)",
    "79,99 EUR / ano": "79,99 EUR / año",
    "plan_annual_desc": "El mejor valor. Acceso ilimitado todo el año (solo 6,66 EUR/mes).",
    "checkout_ready_title": "¡Sesión Segura Creada!",
    "checkout_ready_desc": "Tu pago seguro de Stripe está listo. Si el entorno de pago no se abrió automáticamente en una nueva pestaña, haz clic en el botón de abajo para proceder de manera segura:",
    "btn_open_checkout": "Abrir Pago Seguro",
    "btn_cancel_checkout": "Volver y Intentar de Nuevo"
  },
  de: {
    "plan_monthly_name": "Monatlich",
    "9,99 EUR / mês": "9,99 EUR / Monat",
    "plan_monthly_desc": "Vollständiger und unbegrenzter Zugriff auf alle astrologischen Werkzeuge.",
    "plan_annual_name": "Jährlich (Sparen Sie 33%)",
    "79,99 EUR / ano": "79,99 EUR / Jahr",
    "plan_annual_desc": "Bestes Preis-Leistungs-Verhältnis. Unbegrenzter Zugriff das ganze Jahr über (nur 6,66 EUR/Monat).",
    "checkout_ready_title": "Sichere Sitzung erstellt!",
    "checkout_ready_desc": "Ihre sichere Stripe-Kasse ist bereit. Wenn sich die Zahlungsumgebung nicht automatisch in einem neuen Tab geöffnet hat, klicken Sie auf die Schaltfläche unten, um sicher fortzufahren:",
    "btn_open_checkout": "Sichere Kasse öffnen",
    "btn_cancel_checkout": "Zurück & Erneut versuchen"
  },
  fr: {
    "plan_monthly_name": "Mensuel",
    "9,99 EUR / mês": "9,99 EUR / mois",
    "plan_monthly_desc": "Accès complet et illimité à tous les outils astrologiques.",
    "plan_annual_name": "Annuel (Économisez 33%)",
    "79,99 EUR / ano": "79,99 EUR / an",
    "plan_annual_desc": "Meilleur rapport qualité-prix. Accès illimité toute l'année (seulement 6,66 EUR/mois).",
    "checkout_ready_title": "Session sécurisée créée !",
    "checkout_ready_desc": "Votre paiement sécurisé Stripe est prêt. Si l'environnement de paiement ne s'est pas ouvert automatiquement dans un nouvel onglet, cliquez sur le bouton ci-dessous pour continuer en toute sécurité :",
    "btn_open_checkout": "Ouvrir le paiement sécurisé",
    "btn_cancel_checkout": "Retourner & Réessayer"
  }
};

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
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [step, setStep] = useState<'checkout' | 'success'>('checkout');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  const { t: i18nT } = useTranslation();
  const t = (key: string, fallback?: string) => {
    const localDict = LOCAL_PREMIUM_TRANSLATIONS[currentLang];
    if (localDict && localDict[key]) {
      return localDict[key];
    }
    const translated = i18nT(key);
    return translated !== key ? translated : (fallback || key);
  };

  const plansList = [
    { 
      id: 'monthly' as const, 
      name: t('plan_monthly_name', 'Mensal'), 
      price: t('9,99 EUR / mês', '9,99 EUR / mês'), 
      stripePrice: '9,99 EUR', 
      desc: t('plan_monthly_desc', 'Acesso completo e ilimitado a todas as ferramentas astrológicas.') 
    },
    { 
      id: 'annual' as const, 
      name: t('plan_annual_name', 'Anual (Economize 33%)'), 
      price: t('79,99 EUR / ano', '79,99 EUR / ano'), 
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
        setCheckoutUrl(session.url);
        
        // Attempt to open in a new tab first (safest and required for Stripe inside iframes)
        const stripeWindow = window.open(session.url, '_blank');
        
        // If popup blocker blocked it or if we are inside an iframe, try top-level redirect or keep the inline state
        if (!stripeWindow || stripeWindow.closed || typeof stripeWindow.closed === 'undefined') {
          try {
            if (window.self !== window.top) {
              window.top!.location.href = session.url;
            } else {
              window.location.href = session.url;
            }
          } catch (e) {
            console.log("Iframe top navigation restricted. Relying on user clicking the fallback checkout button.", e);
          }
        }
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
      {/* Fallback secure checkout modal overlay for iframe context and pop-up block prevention */}
      <AnimatePresence>
        {checkoutUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/35 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-sans font-black text-slate-100 tracking-tight">
                  {t('checkout_ready_title', 'Sessão Segura Criada!')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {t('checkout_ready_desc', 'Seu checkout seguro na Stripe está pronto. Caso o ambiente de pagamento não tenha aberto automaticamente em uma nova aba, clique no botão abaixo para prosseguir com segurança:')}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:via-indigo-500 hover:to-amber-400 text-slate-100 text-xs font-black uppercase tracking-wider rounded-xl transition duration-300 shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer border-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('btn_open_checkout', 'Abrir Checkout Seguro')}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCheckoutUrl(null)}
                  className="w-full py-2.5 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-xl transition duration-200 cursor-pointer"
                >
                  {t('btn_cancel_checkout', 'Voltar e Tentar Novamente')}
                </button>
              </div>

              <div className="flex justify-center items-center gap-1.5 text-[10px] font-mono text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t('stripe_secure_billing', 'Sua conexão é 100% criptografada')}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
