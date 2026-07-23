import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { getFirestoreDB, getFirebaseAuth } from '../lib/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { 
  Sparkles, 
  Compass, 
  BookOpen, 
  Heart, 
  CreditCard, 
  Lock, 
  Check, 
  Loader2, 
  Orbit, 
  Globe, 
  X,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface PremiumConversionScreenProps {
  userEmail: string;
  userUid: string;
  currentLang: string;
  onClose: () => void;
  triggerGlobalNotification?: (title: string, message: string, type: 'success' | 'alert' | 'info') => void;
}

export const PremiumConversionScreen: React.FC<PremiumConversionScreenProps> = ({
  userEmail,
  userUid,
  currentLang,
  onClose,
  triggerGlobalNotification
}) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleCheckout = async () => {
    setIsRedirecting(true);
    try {
      const priceId = selectedPlan === 'monthly' 
        ? 'price_1TjSCjLy2FLlsgZ1QX39rY8J' 
        : 'price_1Tu3HmLy2FLlsgZ1jlfKwPQT';

      const activeUid = userUid || getFirebaseAuth()?.currentUser?.uid || localStorage.getItem("orbi_logged_uid") || "";
      if (!activeUid) {
        throw new Error(currentLang === 'pt' ? 'Usuário não autenticado. Por favor, faça login para continuar.' : 'User not authenticated. Please log in.');
      }

      const db = getFirestoreDB();
      if (!db) {
        throw new Error('Serviço do Firebase não disponível no momento.');
      }

      const checkoutSessionData = {
        price: priceId,
        success_url: "https://portalorbit.vercel.app/success",
        cancel_url: "https://portalorbit.vercel.app/failure",
        clientReferenceId: activeUid,
        metadata: {
          uid: activeUid,
          email: userEmail || localStorage.getItem("orbi_logged_email") || ""
        }
      };

      console.log("[Stripe Firebase Extension] Creating checkout session document for UID:", activeUid, checkoutSessionData);

      const docRef = await addDoc(
        collection(db, "customers", activeUid, "checkout_sessions"), 
        checkoutSessionData
      );

      // Listen to the document for updates from the extension
      let resolved = false;
      const unsubscribe = onSnapshot(docRef, (snap) => {
        const data = snap.data();
        if (data && !resolved) {
          if (data.error) {
            resolved = true;
            unsubscribe();
            setIsRedirecting(false);
            console.error("[Stripe Extension Error]", data.error);
            const errMsg = data.error.message || "Erro retornado pela extensão Stripe.";
            if (triggerGlobalNotification) {
              triggerGlobalNotification(t('Erro de Conexão'), errMsg, 'alert');
            } else {
              alert(errMsg);
            }
          } else if (data.url) {
            resolved = true;
            unsubscribe();
            const stripeUrl = data.url;
            console.log("[Stripe Firebase Extension] Redirecting to Stripe URL:", stripeUrl);
            
            // Safe redirection for iFrames (AI Studio/Sandbox/Vercel)
            try {
              if (window.self !== window.top) {
                const openedWindow = window.open(stripeUrl, '_blank');
                if (!openedWindow) {
                  window.top!.location.href = stripeUrl;
                }
              } else {
                window.location.href = stripeUrl;
              }
            } catch (iframeErr) {
              const openedWindow = window.open(stripeUrl, '_blank');
              if (!openedWindow) {
                window.location.href = stripeUrl;
              }
            }
          }
        }
      });

      // Timeout safety: if the extension doesn't process the session within 6 seconds, we attempt fallback to the local backend API
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          unsubscribe();
          console.warn("[Stripe Firebase Extension] Timeout listening for checkout URL. Falling back to secure API endpoint...");
          
          // Secure API endpoint fallback
          const planName = selectedPlan === 'monthly' ? 'Orbita Monthly' : 'Orbita Annual';
          fetch('/api/stripe/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userEmail || localStorage.getItem("orbi_logged_email") || "",
              planId: priceId,
              planName: planName,
              lang: currentLang || 'pt',
              uid: activeUid
            }),
          })
          .then(async (response) => {
            if (!response.ok) throw new Error('Falha no fallback de checkout');
            const data = await response.json();
            if (data.url) {
              try {
                if (window.self !== window.top) {
                  const openedWindow = window.open(data.url, '_blank');
                  if (!openedWindow) window.top!.location.href = data.url;
                } else {
                  window.location.href = data.url;
                }
              } catch {
                const openedWindow = window.open(data.url, '_blank');
                if (!openedWindow) window.location.href = data.url;
              }
            } else {
              throw new Error('Retorno de fallback inválido');
            }
          })
          .catch((err) => {
            console.error('[Stripe Fallback Error]', err);
            const displayMsg = t('Não foi possível iniciar o checkout seguro da Stripe. Tente novamente.');
            if (triggerGlobalNotification) {
              triggerGlobalNotification(t('Erro de Conexão'), displayMsg, 'alert');
            } else {
              alert(displayMsg);
            }
            setIsRedirecting(false);
          });
        }
      }, 6000);

    } catch (err: any) {
      console.error('[Stripe Checkout Error]', err);
      const displayMsg = err.message ? `${err.message}` : t('Não foi possível iniciar o checkout seguro da Stripe. Tente novamente.');
      if (triggerGlobalNotification) {
        triggerGlobalNotification(
          t('Erro de Conexão'),
          displayMsg,
          'alert'
        );
      } else {
        alert(displayMsg);
      }
      setIsRedirecting(false);
    }
  };

  const benefits = [
    {
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      titleKey: 'premium_benefit_1_title',
      titleDefault: 'Análise Avançada da IA Orbia',
      descKey: 'premium_benefit_1_desc',
      descDefault: 'Conselhos diários e interpretação personalizada em tempo real baseada em seus trânsitos e mapa astral.'
    },
    {
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      titleKey: 'premium_benefit_2_title',
      titleDefault: 'Tarot Cósmico Profissional',
      descKey: 'premium_benefit_2_desc',
      descDefault: 'Tiragens ilimitadas com correspondências alquímicas, astrológicas e numéricas exclusivas.'
    },
    {
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      titleKey: 'premium_benefit_3_title',
      titleDefault: 'Compatibilidade e Sinastria',
      descKey: 'premium_benefit_3_desc',
      descDefault: 'Entenda os fios invisíveis de atração, desafios e afinidades entre sua energia e a de quem você ama.'
    },
    {
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      titleKey: 'premium_benefit_4_title',
      titleDefault: 'Oráculo dos Sonhos',
      descKey: 'premium_benefit_4_desc',
      descDefault: 'Desvende as mensagens ocultas de seu subconsciente com interpretações guiadas e arquivamento seguro.'
    },
    {
      icon: <Orbit className="w-5 h-5 text-amber-500" />,
      titleKey: 'premium_benefit_5_title',
      titleDefault: 'Mapas Extras Ilimitados',
      descKey: 'premium_benefit_5_desc',
      descDefault: 'Crie, salve e analise as mandalas astrais e relatórios numerológicos de seus amigos e familiares.'
    }
  ];

  return (
    <div id="premium-conversion-screen" className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8">
      
      {/* Background stars animation visual container */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/5 my-auto"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          disabled={isRedirecting}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all text-slate-400 hover:text-slate-200 z-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('Voltar ao Portal')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Column - Benefits list */}
          <div className="col-span-1 md:col-span-7 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                <Zap className="w-3.5 h-3.5 fill-amber-400/20" />
                <span>{t('premium', 'Premium')}</span>
              </div>

              {/* Title & Headline */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-slate-100">
                  {t('conversion_headline', 'ALINHAMENTO CÓSMICO PREMIUM')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  {t('conversion_sub', 'Sua assinatura sintoniza interpretações exclusivas e tecnologia planetária de alta definição.')}
                </p>
              </div>

              {/* Precision JPL NASA Text */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-850 text-[11px] leading-relaxed text-slate-400 flex gap-3">
                <Globe className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {t('conversion_nasa_text', 'Tecnologia astrológica avançada de interpretação, com cálculos astronômicos de altíssima precisão conectados ao motor softwares da NASA/JPL, calculando posições planetárias, casas e trânsitos em tempo real.')}
                </span>
              </div>

              {/* Benefits list */}
              <div className="space-y-4 pt-2">
                {benefits.map((b, idx) => (
                  <div key={idx} className="flex gap-3.5 items-start">
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        {t(b.titleKey, b.titleDefault)}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-normal mt-0.5">
                        {t(b.descKey, b.descDefault)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Privacy details */}
            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-6 mt-6 border-t border-slate-850">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('sub_billing_info', 'Faturamento via Stripe Subscription seguro e criptografado.')}</span>
            </div>
          </div>

          {/* Right Column - Plan options & Call to action */}
          <div className="col-span-1 md:col-span-5 p-6 sm:p-8 bg-slate-950/40 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div>
                <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase font-mono">
                  {t('select_plan_title', 'Escolha seu Alinhamento')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t('select_plan_desc', 'Selecione o ciclo ideal para continuar sua jornada cósmica:')}
                </p>
              </div>

              {/* Plan cards */}
              <div className="space-y-3">
                
                {/* Annual Plan (Best Value) */}
                <div 
                  onClick={() => !isRedirecting && setSelectedPlan('annual')}
                  className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    selectedPlan === 'annual'
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold uppercase font-mono tracking-wider text-emerald-400">
                    {t('plan_annual_save', 'Economize 33%')}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                      selectedPlan === 'annual' 
                        ? 'border-amber-500 bg-amber-500 text-slate-950' 
                        : 'border-slate-700 bg-transparent'
                    }`}>
                      {selectedPlan === 'annual' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide font-mono">
                        {t('plan_annual_title', 'Plano Anual')}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {t('plan_annual_sub', 'Cobrado anualmente')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5 border-t border-slate-850/50 pt-2.5">
                    <span className="text-lg font-black font-mono text-slate-100">79,99 EUR</span>
                    <span className="text-[10px] text-slate-500 font-mono">/ {t('year', 'ano')}</span>
                    <span className="text-[10px] text-emerald-400 font-mono ml-auto font-bold">(~6,66 EUR/{t('month', 'mês')})</span>
                  </div>
                </div>

                {/* Monthly Plan */}
                <div 
                  onClick={() => !isRedirecting && setSelectedPlan('monthly')}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    selectedPlan === 'monthly'
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                      selectedPlan === 'monthly' 
                        ? 'border-amber-500 bg-amber-500 text-slate-950' 
                        : 'border-slate-700 bg-transparent'
                    }`}>
                      {selectedPlan === 'monthly' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide font-mono">
                        {t('plan_monthly_title', 'Plano Mensal')}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {t('plan_monthly_sub', 'Cancele quando quiser')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5 border-t border-slate-850/50 pt-2.5">
                    <span className="text-lg font-black font-mono text-slate-100">9,99 EUR</span>
                    <span className="text-[10px] text-slate-500 font-mono">/ {t('month', 'mês')}</span>
                  </div>
                </div>

              </div>

              {/* Summary description text */}
              <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <div className="flex gap-2 items-start">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    {selectedPlan === 'annual' 
                      ? t('plan_annual_desc_info', 'O ciclo anual garante 12 meses completos de sintonia astrológica ininterrupta, trânsitos diários e IA por menos do que o preço de um café por semana.')
                      : t('plan_monthly_desc_info', 'O ciclo mensal é cobrado automaticamente a cada 30 dias. Oferece total flexibilidade de cancelamento a qualquer momento diretamente no painel.')
                    }
                  </span>
                </div>
              </div>

            </div>

            {/* Main Action Button */}
            <div className="pt-8">
              <button
                onClick={handleCheckout}
                disabled={isRedirecting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-sans font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{t('btn_connecting_stripe', 'CONECTANDO...')}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-slate-950" />
                    <span>{t('btn_upgrade', 'CONTINUAR MINHA JORNADA')}</span>
                  </>
                )}
              </button>
              <p className="text-[8px] text-center text-slate-500 font-mono uppercase tracking-wider mt-2.5 leading-none">
                {t('stripe_secure_payment_guaranteed', 'Stripe Secure Checkout • Ativação Imediata')}
              </p>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
