import React, { useState, useEffect } from "react";
import { Compass, Moon, Sun, Flame, MessageSquareQuote, RefreshCw, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "../translations";
import { NatalChartData } from "../types";
import { useTranslation } from "react-i18next";
import { translateUiText } from "../lib/translations";

interface DashboardTabProps {
  natalChart: NatalChartData;
  lang: Language;
}

export default function DashboardTab({ natalChart, lang }: DashboardTabProps) {
  const [moonPhaseInfo, setMoonPhaseInfo] = useState({ name: "Lua Nova", symbol: "🌑", percent: 0 });
  const [activeHoroscope, setActiveHoroscope] = useState<'daily' | 'weekly'>('daily');
  const t = translations[lang];
  const { t: tI18nRaw } = useTranslation();

  const tI18n = (text: string) => {
    if (!text) return "";
    const res = tI18nRaw(text);
    if (res === text || !res) {
      return translateUiText(text, lang || 'pt');
    }
    return res;
  };

  // Calculate moon phase mathematically based on current date
  useEffect(() => {
    const knownNewMoon = new Date("2024-01-11T11:57:00Z").getTime();
    const cycleLength = 29.53059 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    const diff = (now - knownNewMoon) % cycleLength;
    const phaseAge = diff / (24 * 60 * 60 * 1000); // age in days
    const percent = diff / cycleLength; // 0.0 to 1.0

    let name = "Lua Cheia";
    let symbol = "🌕";

    if (percent < 0.03 || percent > 0.97) {
      name = lang === "pt" ? "Lua Nova" : lang === "es" ? "Luna Nueva" : lang === "de" ? "Neumond" : "New Moon";
      symbol = "🌑";
    } else if (percent < 0.22) {
      name = lang === "pt" ? "Lua Crescente Minguante" : lang === "de" ? "Zunehmender Sichelmond" : "Waxing Crescent";
      symbol = "🌒";
    } else if (percent < 0.28) {
      name = lang === "pt" ? "Quarto Crescente" : lang === "de" ? "Erstes Viertel" : "First Quarter";
      symbol = "🌓";
    } else if (percent < 0.47) {
      name = lang === "pt" ? "Lua Gibosa Crescente" : lang === "de" ? "Zunehmender Dreiviertelmond" : "Waxing Gibbous";
      symbol = "🌔";
    } else if (percent < 0.53) {
      name = lang === "pt" ? "Lua Cheia" : lang === "de" ? "Vollmond" : "Full Moon";
      symbol = "🌕";
    } else if (percent < 0.72) {
      name = lang === "pt" ? "Lua Gibosa Minguante" : lang === "de" ? "Abnehmender Dreiviertelmond" : "Waning Gibbous";
      symbol = "🌖";
    } else if (percent < 0.78) {
      name = lang === "pt" ? "Quarto Minguante" : lang === "de" ? "Letztes Viertel" : "Last Quarter";
      symbol = "🌗";
    } else {
      name = lang === "pt" ? "Lua Minguante" : lang === "de" ? "Abnehmender Sichelmond" : "Waning Crescent";
      symbol = "🌘";
    }

    setMoonPhaseInfo({ name, symbol, percent: Math.round(percent * 100) });
  }, [lang]);

  // Derived Horoscope message based on Sun sign
  const sunSign = natalChart.planets.find(p => p.name === "Sol")?.sign || "Áries";

  const dailyHoroscopes: Record<string, Record<Language, string>> = {
    Áries: {
      pt: "Hoje a energia convida você a iniciar novos empreendimentos. A Lua ativa sua intuição e propicia o diálogo assertivo.",
      en: "Today the cosmic current encourages starting new projects. The Moon heightens your intuition and fosters clear, assertive expression.",
      de: "Heute ermutigt dich die kosmische Strömung, neue Unternehmungen zu starten. Der Mond stärkt deine Intuition.",
      es: "Hoy la corriente cósmica te anima a iniciar nuevos emprendimientos. La luna potencia tu intuición y valentía.",
      fr: "Aujourd'hui, l'énergie vous invite à lancer de nouvelles initiatives. La Lune active votre intuition et favorise un dialogue affirmé."
    },
    Touro: {
      pt: "Momento excelente para organizar finanças e planejar de forma minuciosa suas próximas metas corporais e espirituais.",
      en: "Excellent day to organize finances and meticulously plan your next physiological and spiritual objectives.",
      de: "Hervorragender Tag, um Finanzen zu regeln und deine nächsten Lebensziele feinfühlig zu strukturieren.",
      es: "Día ideal para consolidar tus recursos y planificar detalladamente tus próximas metas materiales y del alma.",
      fr: "Excellent moment pour organiser vos finances et planifier minutieusement vos prochains objectifs physiques et spirituels."
    },
    Gêmeos: {
      pt: "Mercúrio traz claridade e agilidade ao seu plano de estudos. Um diálogo surpresa trará insights para desvendar mistérios do lar.",
      en: "Mercury brings razor-sharp clarity to your thoughts. A surprising conversation today will unlock keys to solve long-standing puzzles.",
      de: "Merkur schenkt dir messerscharfe mentale Klarheit. Ein überraschendes Gespräch bringt bahnbrechende Erkenntnisse.",
      es: "Mercurio trae mucha elocuencia y dinamismo a tus ideas. Una conversación oportuna abrirá horizontes impensados.",
      fr: "Mercure apporte clarté et agilité à vos études. Un dialogue surprise apportera des éclairages pour révéler les mystères du foyer."
    },
    Câncer: {
      pt: "Sua sensibilidade aflora. Permita-se momentos de interiorização e reconexão com seus sonhos primordiais.",
      en: "Your natural emotional sensitivity is amplified. Allow yourself spaces for meditation and journaling your key subconcious dreams.",
      de: "Deine emotionale Tiefe ist heute besonders stark ausgeprägt. Gönne dir meditative Ruhezeiten.",
      es: "Tu receptividad natural se agudiza. Dedícate unos instantes de silencio para repensar tus mayores prioridades.",
      fr: "Votre sensibilité s'épanouit. Accordez-vous des moments d'intériorisation et de reconnexion avec vos rêves primordiaux."
    },
    default: {
      pt: "Seu signo solar está sob excelentes vibrações celestes. Uma quadratura benéfica estimula ações equilibradas e determinação focada.",
      en: "Your solar coordinate sits under beautiful alignments today. This triggers a balanced motivation to solve key personal goals.",
      de: "Dein Sonnenzeichen empfängt heute kraftvolle kosmische Schwingungen. Nutze den Tag für strukturelle Fortschritte.",
      es: "Tu regente natal se halla en óptima armonía. Aprovecha esta influência constructiva para renovar tu fe en el destino.",
      fr: "Votre signe solaire est sous d'excellentes vibrations célestes. Un aspect bénéfique stimule des actions équilibrées et une détermination ciblée."
    }
  };

  const currentHoroscope = dailyHoroscopes[sunSign] || dailyHoroscopes.default;
  const horoscopeText = currentHoroscope[lang] || currentHoroscope['en'] || currentHoroscope['pt'];

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-semibold text-neutral-900 flex items-center gap-2">
            <Sun className="w-6 h-6 text-indigo-600 animate-spin-slow" />
            <span>{t.welcome}!</span>
          </h2>
          <p className="text-neutral-500 text-xs">
            {t.subtitle} — Sol em <strong>{sunSign}</strong>
          </p>
        </div>
        
        <div className="px-3.5 py-1.5 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center gap-2 text-xs text-neutral-600">
          <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>{t.recalculatingCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Monther Horoscopes (Daily / Weekly) */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveHoroscope('daily')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeHoroscope === 'daily'
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {t.dailyHoroscope}
              </button>
              <button
                onClick={() => setActiveHoroscope('weekly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  activeHoroscope === 'weekly'
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {t.weeklyHoroscope}
              </button>
            </div>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <motion.div
            key={activeHoroscope}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-neutral-55 bg-indigo-50/25 border border-indigo-100/50 rounded-xl space-y-3 leading-relaxed"
          >
            <h3 className="font-semibold text-neutral-800 text-sm">
              {activeHoroscope === 'daily' ? tI18n("Trânsito de Hoje") : tI18n("Maré Cósmica Semanal")}
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm">
              {activeHoroscope === 'daily' 
                ? currentHoroscope[lang]
                : tI18n("Esta semana as energias estão em fase de semeadura. Plutão estabiliza transições e Netuno convida você a decifrar os segredos de seus sonhos noturnos.")
              }
            </p>
          </motion.div>

          {/* Daily Advice snippet card */}
          <div className="flex gap-3 items-start p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <MessageSquareQuote className="w-5 h-5 text-neutral-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{t.insightOfTheDay}</span>
              <p className="italic text-neutral-500 text-xs">
                {tI18n(`"O universo não fala por palavras externas, mas pelo compasso calmo do seu coração quando silencia."`)}
              </p>
            </div>
          </div>
        </section>

        {/* Lunar phase widget */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{t.lunarPhase}</span>
            <Moon className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="text-center py-6 space-y-3">
            <span className="text-7xl block select-none animate-pulse-slow">{moonPhaseInfo.symbol}</span>
            <div>
              <span className="font-display font-bold text-neutral-900 text-lg block">{moonPhaseInfo.name}</span>
              <span className="font-mono text-neutral-400 text-xs tracking-wider">{moonPhaseInfo.percent}% {tI18n("de iluminação")}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100/80 text-[11px] text-neutral-500 leading-relaxed text-center">
            {tI18n("Período ideal para limpar velhos pesos mentais e nutrir ideias novas de forma mística.")}
          </div>
        </section>

      </div>
    </div>
  );
}
