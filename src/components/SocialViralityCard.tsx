import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Share2, Copy, Heart, Compass, Users, Check, Flame, 
  Sparkle, ShieldCheck, Zap, ArrowRight, Star, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SocialViralityCardProps {
  user: any;
  mapData: any;
  preciseZodiacSign: string;
  lifePathNumber: number;
  activeLang: string;
}

// Map zodiac sign to its element
const signElements: Record<string, 'Fogo' | 'Terra' | 'Ar' | 'Água'> = {
  'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
  'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
  'Gêmeos': 'Ar', 'Libra': 'Ar', 'Aquário': 'Ar',
  'Câncer': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
  // Support English translation fallbacks if needed
  'Aries': 'Fogo', 'Leo': 'Fogo', 'Sagittarius': 'Fogo',
  'Taurus': 'Terra', 'Virgo': 'Terra', 'Capricorn': 'Terra',
  'Gemini': 'Ar', 'Libra-En': 'Ar', 'Aquarius': 'Ar',
  'Cancer': 'Água', 'Scorpio': 'Água', 'Pisces': 'Água'
};

const elementGradients = {
  Fogo: 'from-rose-600 via-orange-500 to-amber-500 text-rose-100',
  Terra: 'from-emerald-700 via-teal-600 to-amber-600 text-emerald-100',
  Ar: 'from-cyan-500 via-pink-500 to-indigo-600 text-cyan-100',
  Água: 'from-blue-600 via-purple-600 to-indigo-800 text-blue-100'
};

const elementTitles = {
  Fogo: 'Explosão Criativa e Impulso Vital',
  Terra: 'Estrutura, Foco e Manifestação Prática',
  Ar: 'Intelecto, Liberdade e Comunicação Cósmica',
  Água: 'Intuição Profunda e Fluidez Emocional'
};

export default function SocialViralityCard({
  user,
  mapData,
  preciseZodiacSign,
  lifePathNumber,
  activeLang
}: SocialViralityCardProps) {
  const { t } = useTranslation();
  
  // Localized state for notifications
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // URL Inviter detection
  const [inviter, setInviter] = useState<{ name: string; sign: string; birthDate?: string } | null>(null);
  const [synastryResult, setSynastryResult] = useState<any>(null);

  // Parse invite details from URL parameters
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const inviteUid = params.get('invite');
    const inviterName = params.get('inviterName');
    const inviterSign = params.get('inviterSign');
    const inviterBirth = params.get('inviterBirth');

    if (inviteUid && inviterName && inviterSign) {
      setInviter({
        name: decodeURIComponent(inviterName),
        sign: decodeURIComponent(inviterSign),
        birthDate: inviterBirth ? decodeURIComponent(inviterBirth) : undefined
      });
    }
  }, []);

  // Calculate user-specific elements and signs
  const userSunSign = preciseZodiacSign || 'Aquário';
  const userMoonSign = mapData?.astros?.find((a: any) => a.name === "Lua")?.sign || 'Gêmeos';
  const userAscendant = mapData?.astros?.find((a: any) => a.name === "Ascendente")?.sign || 'Libra';
  
  const userSunElement = signElements[userSunSign] || 'Ar';
  const userMoonElement = signElements[userMoonSign] || 'Ar';
  const userAscElement = signElements[userAscendant] || 'Ar';

  // Determine dominant element
  const elementCounts = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 };
  elementCounts[userSunElement] += 3; // Sun has highest weight
  elementCounts[userMoonElement] += 2; // Moon weight
  elementCounts[userAscElement] += 2;  // Ascendant weight
  
  let dominantElement: 'Fogo' | 'Terra' | 'Ar' | 'Água' = 'Ar';
  let maxCount = 0;
  (Object.keys(elementCounts) as Array<keyof typeof elementCounts>).forEach(el => {
    if (elementCounts[el] > maxCount) {
      maxCount = elementCounts[el];
      dominantElement = el;
    }
  });

  // Calculate Synastry (Compatibility) when Inviter is present
  useEffect(() => {
    if (inviter && user?.birthDate) {
      // Semi-deterministic calculations based on names and signs
      const inviterNameClean = inviter.name.toLowerCase().trim();
      const userNameClean = user.name.toLowerCase().trim();
      
      const combinedLength = inviterNameClean.length + userNameClean.length;
      const affinityScore = 70 + (combinedLength % 26); // Score between 70% and 96%
      
      const inviterElement = signElements[inviter.sign] || 'Ar';
      const userElement = userSunElement;

      let elementMatchDesc = "";
      let matchLabel = "";

      if (inviterElement === userElement) {
        matchLabel = t("Sincronia Absoluta de") + " " + t(inviterElement);
        elementMatchDesc = t("Vocês compartilham o mesmo elemento primordial. A sintonia entre vocês é instantânea, instintiva e de fácil fluidez. Vocês vibram na mesma frequência cósmica!");
      } else if (
        (inviterElement === 'Fogo' && userElement === 'Ar') || 
        (inviterElement === 'Ar' && userElement === 'Fogo')
      ) {
        matchLabel = t("Alquimia da Inspiração");
        elementMatchDesc = t("O Ar alimenta o Fogo, criando uma união de ideias brilhantes, criatividade expandida e dinamismo infinito. Um impulsiona a mente do outro!");
      } else if (
        (inviterElement === 'Terra' && userElement === 'Água') || 
        (inviterElement === 'Água' && userElement === 'Terra')
      ) {
        matchLabel = t("Nutrição e Fertilidade Cósmica");
        elementMatchDesc = t("A Água nutre a Terra, enquanto a Terra dá sustentação e porto seguro para as emoções da Água. Uma parceria extremamente construtiva e protetora.");
      } else {
        matchLabel = t("Desafio da Evolução mútua");
        elementMatchDesc = t("Elementos complementares que estimulam o crescimento fora da zona de conforto. Diferenças que se atraem e ensinam novos caminhos cósmicos.");
      }

      setSynastryResult({
        score: affinityScore,
        label: matchLabel,
        description: elementMatchDesc,
        inviterElement,
        userElement
      });
    }
  }, [inviter, user, userSunElement]);

  // Generate Invite URL
  const getInviteUrl = () => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    const path = window.location.pathname;
    const uid = user?.uid || user?.userId || 'orbi_friend';
    return `${origin}${path}?invite=${uid}&inviterName=${encodeURIComponent(user?.name || 'Amigo Estelar')}&inviterSign=${encodeURIComponent(userSunSign)}`;
  };

  const handleCopyLink = () => {
    const url = getInviteUrl();
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCard = () => {
    const cardText = `🌌 ${t('MINHA IDENTIDADE ASTRO-NUMEROLÓGICA')} 🌌\n` +
      `👤 ${t('Nome')}: ${user?.name || 'Viajante'}\n` +
      `☀️ ${t('Sol')}: ${t(userSunSign)} (${t(userSunElement)})\n` +
      `🌙 ${t('Lua')}: ${t(userMoonSign)} (${t(userMoonElement)})\n` +
      `🌅 ${t('Ascendente')}: ${t(userAscendant)} (${t(userAscElement)})\n` +
      `🔢 ${t('Destino Divino')}: ${t('Número')} ${lifePathNumber}\n` +
      `🔥 ${t('Elemento Dominante')}: ${t(dominantElement)} (${t(elementTitles[dominantElement])})\n` +
      `🔗 ${t('Descubra o seu também no Portal Órbita!')}`;
    
    navigator.clipboard.writeText(cardText);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const getElementIcon = (el: string) => {
    switch (el) {
      case 'Fogo': return <Flame className="w-5 h-5 text-red-400" />;
      case 'Terra': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'Ar': return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Água': return <Sparkle className="w-5 h-5 text-blue-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div id="social-virality-card-container" className="space-y-8">
      {/* SECTION 1: INVITATION RESPONSE (SYNASTRY CHALLENGE) */}
      <AnimatePresence>
        {inviter && synastryResult && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 rounded-3xl border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
              <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-4 rounded-2xl shrink-0 shadow-lg border border-purple-400/20">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div className="space-y-2 flex-grow">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono font-bold text-indigo-300 rounded-full uppercase tracking-wider">
                  {t('Sincronia Ativada por Link')}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white font-sans">
                  {t('Conexão Galáctica Recebida!')}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  {t('Você acessou o portal através do link de')} <strong className="text-amber-400">{inviter.name}</strong> ({t('Sol em')} <strong>{t(inviter.sign)}</strong>). 
                  {user?.hasCreatedMap ? (
                    <span> {t('Analisamos os vossos mapas natais e revelamos a compatibilidade cósmica entre vocês.')}</span>
                  ) : (
                    <span className="text-amber-300"> {t('Cadastre seu mapa natal abaixo para desbloquear o gráfico completo de compatibilidade cósmica!')}</span>
                  )}
                </p>
              </div>
            </div>

            {user?.hasCreatedMap && (
              <div className="mt-6 p-4 md:p-6 bg-slate-950/80 rounded-2xl border border-indigo-950/60 space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{inviter.name}</div>
                    <div className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl font-bold text-xs text-slate-200">
                      ☀️ {t(inviter.sign)} ({synastryResult.inviterElement})
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-indigo-500/30 bg-indigo-950/20 flex items-center justify-center shadow-lg relative">
                      <span className="text-sm font-black font-mono text-indigo-400">{synastryResult.score}%</span>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{t('Você')} ({user?.name})</div>
                    <div className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl font-bold text-xs text-slate-200">
                      ☀️ {t(userSunSign)} ({synastryResult.userElement})
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-4 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs font-mono">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{synastryResult.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {synastryResult.description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STYLISH CORE DUAL PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: THE STORIES PREVIEW (ASTRO-CARD) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center justify-center gap-1">
              <Sparkle className="w-3.5 h-3.5 text-amber-500" />
              {t('Astro-Card Compartilhável')}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('Sua identidade estelar em design ideal para Stories')}</p>
          </div>

          {/* Interactive Phone Frame / Aesthetic Mockup Card */}
          <div className="w-full max-w-xs relative group aspect-[9/16] rounded-[2.5rem] border-[8px] border-slate-950 bg-slate-950 p-2 shadow-2xl overflow-hidden ring-1 ring-slate-800">
            {/* Speaker / Notch bar */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-8 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Inner Content */}
            <div className={`w-full h-full rounded-[2rem] bg-gradient-to-b ${elementGradients[dominantElement]} p-6 relative flex flex-col justify-between overflow-hidden`}>
              
              {/* Star noise backgrounds */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
              
              {/* Header inside Phone */}
              <div className="relative z-10 flex justify-between items-start pt-2">
                <div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-white/50 block">{t('ORBITA PORTAL')}</span>
                  <span className="text-[11px] font-bold text-white/90 font-mono tracking-tight">{t('Identidade Cósmica')}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[9px] font-mono font-bold">
                  #{lifePathNumber}
                </div>
              </div>

              {/* Central Astral Body */}
              <div className="relative z-10 flex flex-col items-center text-center py-4 space-y-4 my-auto">
                <div className="w-20 h-20 rounded-full bg-slate-950/30 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner relative group-hover:scale-105 transition duration-500">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-sm animate-pulse" />
                  {getElementIcon(dominantElement)}
                </div>

                <div className="space-y-1">
                  <h3 className="font-sans font-black text-xl tracking-tight text-white leading-tight uppercase">
                    {user?.name || 'Viajante'}
                  </h3>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-950/40 border border-white/20 rounded-full text-[10px] font-mono font-bold tracking-wide">
                    {t('Elemento')} {t(dominantElement)}
                  </div>
                </div>

                {/* Grid of Signs */}
                <div className="grid grid-cols-3 gap-2 w-full pt-4 text-left">
                  <div className="bg-slate-950/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <span className="text-[8px] font-mono uppercase text-white/50">☀️ {t('Sol')}</span>
                    <strong className="text-white text-[11px] mt-0.5 leading-tight truncate">{t(userSunSign)}</strong>
                  </div>
                  <div className="bg-slate-950/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <span className="text-[8px] font-mono uppercase text-white/50">🌙 {t('Lua')}</span>
                    <strong className="text-white text-[11px] mt-0.5 leading-tight truncate">{t(userMoonSign)}</strong>
                  </div>
                  <div className="bg-slate-950/30 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <span className="text-[8px] font-mono uppercase text-white/50">🌅 {t('Asc')}</span>
                    <strong className="text-white text-[11px] mt-0.5 leading-tight truncate">{t(userAscendant)}</strong>
                  </div>
                </div>
              </div>

              {/* Footer inside Phone */}
              <div className="relative z-10 border-t border-white/20 pt-4 flex justify-between items-center text-[9px] text-white/70 font-mono">
                <div>
                  <div className="font-bold text-white">{t('Número de Destino')}</div>
                  <div>{t('Vibração Ativa')} {lifePathNumber}</div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-white">{t('ORBITA.AI')}</span>
                  <span>{t('Astronomia Quântica')}</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleCopyCard}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-2xl text-xs font-bold font-sans flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              {copiedCard ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{t('Copiado!')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{t('Copiar Identidade')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: VIRAL LOOPS & INVITATION SETUP */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="bg-slate-905 p-6 rounded-3xl border border-slate-800 bg-slate-900/20 space-y-5">
            <div className="space-y-1 border-b border-slate-850 pb-3">
              <div className="text-amber-500 font-bold font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
                <Users className="w-4 h-4" />
                {t('Sincronia Compartilhada')}
              </div>
              <h3 className="text-base font-extrabold text-slate-100">{t('Desafio da Sincronia Cósmica')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('Crie conexões profundas e duradouras. Gere seu link pessoal de Sincronia e envie para amigos, familiares ou parceiros. Quando eles entrarem no portal, seus dados cósmicos serão comparados dinamicamente em uma análise exclusiva de compatibilidade.')}
              </p>
            </div>

            {/* How it works pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center">1</div>
                <h4 className="font-bold text-slate-200">{t('Copie seu Link')}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t('Gere um link codificado com seu Sol, nome e UID.')}</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono font-bold flex items-center justify-center">2</div>
                <h4 className="font-bold text-slate-200">{t('Compartilhe')}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t('Envie no WhatsApp ou cole na sua bio do Instagram.')}</p>
              </div>

              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850 space-y-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center">3</div>
                <h4 className="font-bold text-slate-200">{t('Veja a Mágica')}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{t('Acompanhe o Match de Elementos e porcentagem de energia.')}</p>
              </div>
            </div>

            {/* Invite Generator Box */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-wider mb-1.5">{t('Seu Link Exclusivo de Sincronia')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getInviteUrl()}
                    className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-100 opacity-90 text-slate-950 text-xs font-bold font-sans rounded-xl flex items-center gap-1 transition shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? t('Copiado!') : t('Copiar')}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{t('Gera ressonância mútua em tempo real')}</span>
                </span>
                <span className="font-mono font-bold text-amber-500/80">#{user?.name ? user.name.split(' ')[0] : 'Orbita'}Link</span>
              </div>
            </div>

            {/* Premium Callout */}
            <div className="bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-slate-950/20 p-4 rounded-2xl border border-amber-500/10 flex items-center gap-3.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div className="text-xs">
                <strong className="text-slate-200 block font-bold">{t('Ressoar Atrai Sincronicidades')}</strong>
                <span className="text-slate-400 leading-normal">{t('Ao comparar sua energia com amigos, o ecossistema sincroniza conselhos diários ideais para fortalecer e aproximar os vossos caminhos.')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
