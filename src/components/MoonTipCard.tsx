import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { Moon, Sparkles, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';
import { loadCalculationCache, saveCalculationCache } from '../lib/firebase';

interface MoonTipData {
  moonSign: string;
  moonPhase: string;
  tip: string;
}

interface MoonTipCardProps {
  userName?: string;
  birthDate?: string;
  onRewardPoints?: (amount: number) => void;
  lang?: string;
}

export default function MoonTipCard({ userName, birthDate, onRewardPoints, lang }: MoonTipCardProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (lang as Language) || 'pt');
    }
    return res;
  };

  const [data, setData] = useState<MoonTipData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);

  useEffect(() => {
    const email = localStorage.getItem("orbi_logged_email") || "";
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Check if we already have a calculated tip for this browser session and language
    const cached = sessionStorage.getItem(`astrological_moon_tip_session_${lang}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.tip) {
          setData(parsed);
          return;
        }
      } catch (e) {
        console.error("Error parsing cached moon tip:", e);
      }
    }

    // 2. Fetch fresh tip from the endpoint for a new login session
    const fetchTip = async () => {
      setLoading(true);
      try {
        if (email) {
          const cachedFirestore = await loadCalculationCache(email, `daily_moontip_${todayStr}_${lang}`);
          if (cachedFirestore && cachedFirestore.tip) {
            setData(cachedFirestore);
            setLoading(false);
            return;
          }
        }

        const res = await fetch('/api/astrology/moon-tip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: userName, birthDate: birthDate, lang: lang })
        });
        if (res.ok) {
          const fetchedData = await res.json();
          setData(fetchedData);
          // Store in sessionStorage to align with "atualizando a cada nova sessão de login"
          sessionStorage.setItem(`astrological_moon_tip_session_${lang}`, JSON.stringify(fetchedData));
          if (email) {
            await saveCalculationCache(email, `daily_moontip_${todayStr}_${lang}`, fetchedData);
          }
        }
      } catch (err) {
        console.error("Failed to load moon tip:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTip();
  }, [userName, birthDate, lang]);

  // Check if reward was claimed already in this session
  useEffect(() => {
    const isClaimed = sessionStorage.getItem('astrological_moon_tip_reward_claimed');
    if (isClaimed === 'true') {
      setClaimed(true);
    }
  }, []);

  const handleClaimReward = () => {
    if (claimed) return;
    setClaimed(true);
    sessionStorage.setItem('astrological_moon_tip_reward_claimed', 'true');
    if (onRewardPoints) {
      onRewardPoints(150); // reward 150 stelar points for checking the tip
    }
  };

  if (!isOpen || !data) return null;

  // Render a tiny floating bubble if minimized
  if (isMinimized) {
    return (
      <button
        id="moon-tip-floating-bubble"
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 z-55 w-12 h-12 rounded-full bg-slate-900 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-2xl hover:bg-slate-850 hover:border-amber-400 cursor-pointer animate-bounce transition-all duration-300"
        title={t("Abrir Dica Lunar Rápida")}
      >
        <Moon className="w-5 h-5 text-amber-500 fill-amber-500/20" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full" />
      </button>
    );
  }

  return (
    <div
      id="moon-tip-floating-card"
      className="fixed bottom-24 right-6 z-55 max-w-xs md:max-w-sm w-[300px] bg-slate-950/95 border border-amber-500/25 p-4 rounded-2xl shadow-3xl backdrop-blur-lg animate-in fade-in slide-in-from-bottom-6 duration-300 flex flex-col space-y-3"
    >
      {/* Top Bar info */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
          <span className="text-[10px] font-mono uppercase text-amber-450 tracking-wider">
            {t("Sussurro Lunar Diário")}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(true)}
            title={t("Minimizar dica")}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-900 cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {/* Close toggle */}
          <button
            onClick={() => setIsOpen(false)}
            title={t("Fechar")}
            className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tip Body */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-400 font-mono font-bold">
            {t(data.moonPhase)}
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            {t("em")} <strong className="text-emerald-400">{t(data.moonSign)}</strong>
          </span>
        </div>

        <p className="text-[11px] text-slate-300 font-sans leading-relaxed italic">
          "{t(data.tip)}"
        </p>
      </div>

      {/* Reward Action element */}
      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
        <span className="text-[8px] font-mono text-slate-500 uppercase">
          {claimed ? t('Foco Conectado') : t('Sintonizar Freqüência')}
        </span>
        
        {claimed ? (
          <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-1 rounded">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            {t("+150 Pontos Ativados")}
          </div>
        ) : (
          <button
            onClick={handleClaimReward}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg text-[9px] font-mono font-bold text-amber-400 cursor-pointer transition active:scale-95"
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            {t("Venerar Lua (+150 pts)")}
          </button>
        )}
      </div>
      
    </div>
  );
}
