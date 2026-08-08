import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Moon,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Clock,
  Compass,
  CheckCircle2,
  ShieldAlert,
  Sun,
  Star,
  Flame
} from 'lucide-react';
import { generateDailyPrediction, DailyPrediction } from './dailyPredictionsEngine';
import i18next from 'i18next';

export interface AstrologyCalendarModuleProps {
  userBirthDate?: string;
  userSign?: string;
  userName?: string;
  currentDate?: Date;
  mapData?: any;
  userCoordinates?: { latitude: number; longitude: number };
  lang?: 'pt' | 'en' | 'es' | 'de' | 'fr';
  className?: string;
}

const UI_TEXTS = {
  pt: {
    moduleTitle: "Mapa dos Próximos 30 Dias (Calendário de Trânsitos)",
    moduleSubtitle: "Selecione um dia para analisar os trânsitos, aspectos e energias exclusivas em tempo real.",
    dayLabel: "Dia",
    vibrationLabel: "Vibração:",
    energyLevelTitle: "Nível de Energia",
    lunarTransitTitle: "Trânsito Lunar & Setores Afetados",
    planetaryAspectsTitle: "Aspectos Planetários do Dia",
    transitsAndInfluencesTitle: "Trânsitos & Influências Celestes",
    houseTransit: "Trânsito de Casa Astrológica",
    astroInfluence: "Influência Planetária Principal",
    aspectRelation: "Relação de Aspectos",
    opportunitiesAndChallengesTitle: "Oportunidades & Desafios do Dia",
    favoredAreas: "Áreas Favorecidas",
    attentionAreas: "Áreas de Atenção",
    opportunities: "Oportunidade Única",
    challenges: "Desafio a Observar",
    personalizedAdviceTitle: "Conselho Estratégico & Mensagem Estelar",
    quickTipsTitle: "Dicas Rápidas & Janelas do Dia",
    favorableColor: "Cor da Sorte",
    favorableNumber: "Número da Sorte",
    bestPeriod: "Janela Favorável",
    attentionPeriod: "Janela de Atenção"
  },
  en: {
    moduleTitle: "Next 30 Days Map (Transits Calendar)",
    moduleSubtitle: "Select any day to inspect real-time transits, aspects, and exclusive daily energy.",
    dayLabel: "Day",
    vibrationLabel: "Vibration:",
    energyLevelTitle: "Energy Level",
    lunarTransitTitle: "Lunar Transit & Affected Sectors",
    planetaryAspectsTitle: "Planetary Aspects of the Day",
    transitsAndInfluencesTitle: "Celestial Transits & Influences",
    houseTransit: "Astrological House Transit",
    astroInfluence: "Main Planetary Influence",
    aspectRelation: "Aspect Relation",
    opportunitiesAndChallengesTitle: "Daily Opportunities & Challenges",
    favoredAreas: "Favored Areas",
    attentionAreas: "Areas for Attention",
    opportunities: "Unique Opportunity",
    challenges: "Challenge to Watch",
    personalizedAdviceTitle: "Strategic Advice & Stellar Message",
    quickTipsTitle: "Quick Insights & Time Windows",
    favorableColor: "Lucky Color",
    favorableNumber: "Lucky Number",
    bestPeriod: "Favorable Window",
    attentionPeriod: "Caution Window"
  },
  es: {
    moduleTitle: "Mapa de los Próximos 30 Días (Calendario de Tránsitos)",
    moduleSubtitle: "Selecciona un día para inspeccionar tránsitos reales, aspectos y energía diaria exclusiva.",
    dayLabel: "Día",
    vibrationLabel: "Vibración:",
    energyLevelTitle: "Nivel de Energía",
    lunarTransitTitle: "Tránsito Lunar y Sectores Afectados",
    planetaryAspectsTitle: "Aspectos Planetarios del Día",
    transitsAndInfluencesTitle: "Tránsitos e Influencias Celestiales",
    houseTransit: "Tránsito de Casa Astrológica",
    astroInfluence: "Influencia Planetaria Principal",
    aspectRelation: "Relación de Aspectos",
    opportunitiesAndChallengesTitle: "Oportunidades y Desafíos del Día",
    favoredAreas: "Áreas Favorecidas",
    attentionAreas: "Áreas de Atención",
    opportunities: "Oportunidad Única",
    challenges: "Desafío a Observar",
    personalizedAdviceTitle: "Consejo Estratégico y Mensaje Estelar",
    quickTipsTitle: "Consejos Rápidos y Ventanas de Horario",
    favorableColor: "Color de la Suerte",
    favorableNumber: "Número de la Suerte",
    bestPeriod: "Ventana Favorable",
    attentionPeriod: "Ventana de Atención"
  },
  de: {
    moduleTitle: "Karte der nächsten 30 Tage (Transit-Kalender)",
    moduleSubtitle: "Wählen Sie einen Tag, um Echtzeit-Transite, Aspekte und Tagesenergien zu analysieren.",
    dayLabel: "Tag",
    vibrationLabel: "Schwingung:",
    energyLevelTitle: "Energielevel",
    lunarTransitTitle: "Mondtransit & Betroffene Sektoren",
    planetaryAspectsTitle: "Planetare Aspekte des Tages",
    transitsAndInfluencesTitle: "Himmlische Transite & Einflüsse",
    houseTransit: "Astrologischer Haustransit",
    astroInfluence: "Hauptplaneten-Einfluss",
    aspectRelation: "Aspektverhältnis",
    opportunitiesAndChallengesTitle: "Tageschancen & Herausforderungen",
    favoredAreas: "Begünstigte Bereiche",
    attentionAreas: "Achtungsbereiche",
    opportunities: "Einzigartige Chance",
    challenges: "Zu beobachtende Herausforderung",
    personalizedAdviceTitle: "Strategischer Rat & Sternenbotschaft",
    quickTipsTitle: "Schnelle Tipps & Zeitfenster",
    favorableColor: "Glücksfarbe",
    favorableNumber: "Glückszahl",
    bestPeriod: "Günstiges Fenster",
    attentionPeriod: "Achtung-Fenster"
  },
  fr: {
    moduleTitle: "Carte des 30 Prochains Jours (Calendrier des Transits)",
    moduleSubtitle: "Sélectionnez un jour pour analyser les transits réels, aspects et énergies exclusives.",
    dayLabel: "Jour",
    vibrationLabel: "Vibration:",
    energyLevelTitle: "Niveau d'Énergie",
    lunarTransitTitle: "Transit Lunaire & Secteurs Affectés",
    planetaryAspectsTitle: "Aspects Planétaires du Jour",
    transitsAndInfluencesTitle: "Transits & Influences Célestes",
    houseTransit: "Transit de Maison Astrologique",
    astroInfluence: "Influence Planétaire Principale",
    aspectRelation: "Relation d'Aspects",
    opportunitiesAndChallengesTitle: "Opportunités & Défis du Jour",
    favoredAreas: "Domaines Favorisés",
    attentionAreas: "Domaines d'Attention",
    opportunities: "Opportunité Unique",
    challenges: "Défi à Observer",
    personalizedAdviceTitle: "Conseil Stratégique & Message Céleste",
    quickTipsTitle: "Astuces Rapides & Créneaux Horaires",
    favorableColor: "Couleur Porte-Bonheur",
    favorableNumber: "Nombre Porte-Bonheur",
    bestPeriod: "Créneau Favorable",
    attentionPeriod: "Créneau d'Attention"
  }
};

function getFavorableColorHex(colorName: string): string {
  if (!colorName) return "#e2e8f0";
  const c = colorName.toLowerCase();
  if (c.includes("dourado") || c.includes("gold") || c.includes("sol")) return "#eab308";
  if (c.includes("prata") || c.includes("silver") || c.includes("lunar")) return "#cbd5e1";
  if (c.includes("azul") || c.includes("blue") || c.includes("safira") || c.includes("marinho")) return "#38bdf8";
  if (c.includes("verde") || c.includes("green") || c.includes("esmeralda")) return "#10b981";
  if (c.includes("vermelho") || c.includes("red") || c.includes("rubi")) return "#ef4444";
  if (c.includes("roxo") || c.includes("purple") || c.includes("ametista") || c.includes("pourpre")) return "#a855f7";
  if (c.includes("turquesa") || c.includes("turquoise")) return "#06b6d4";
  if (c.includes("rosa") || c.includes("pink") || c.includes("quartzo")) return "#ec4899";
  if (c.includes("âmbar") || c.includes("amber")) return "#f59e0b";
  return "#38bdf8";
}

export const AstrologyCalendarModule: React.FC<AstrologyCalendarModuleProps> = ({
  userBirthDate = "1997-02-11",
  userSign = "Touro",
  userName = "Viajante",
  currentDate,
  mapData,
  userCoordinates,
  lang,
  className = ""
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const activeLang = useMemo(() => {
    if (lang) return lang;
    const detected = (i18next.language || 'pt').toLowerCase().split('-')[0];
    if (['pt', 'en', 'es', 'de', 'fr'].includes(detected)) {
      return detected as 'pt' | 'en' | 'es' | 'de' | 'fr';
    }
    return 'pt';
  }, [lang]);

  const uiTexts = UI_TEXTS[activeLang] || UI_TEXTS.pt;

  // Stable date string reference to avoid unnecessary re-computation
  const baseDate = useMemo(() => currentDate || new Date(), [
    currentDate ? `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}` : ''
  ]);

  const userCoordsLat = userCoordinates?.latitude;
  const userCoordsLon = userCoordinates?.longitude;

  // Compute 30 days predictions
  const predictions: DailyPrediction[] = useMemo(() => {
    return Array.from({ length: 30 }, (_, idx) => {
      return generateDailyPrediction(
        userBirthDate,
        userSign,
        userName,
        idx,
        baseDate,
        activeLang,
        mapData,
        userCoordsLat !== undefined && userCoordsLon !== undefined ? { latitude: userCoordsLat, longitude: userCoordsLon } : undefined
      );
    });
  }, [userBirthDate, userSign, userName, baseDate, activeLang, mapData, userCoordsLat, userCoordsLon]);

  const selectedPred = predictions[selectedDayIndex] || predictions[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Module Title Header */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono">
              {uiTexts.moduleTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {uiTexts.moduleSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-mono font-semibold text-amber-300">
            {userSign}
          </span>
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2 sm:gap-2.5">
          {predictions.map((pred, idx) => {
            const dayNum = idx + 1;
            const isSelected = selectedDayIndex === idx;

            // Formatted weekday abbreviation
            const weekdayShort = pred.date instanceof Date
              ? pred.date.toLocaleDateString(activeLang === 'pt' ? 'pt-BR' : activeLang === 'en' ? 'en-US' : activeLang === 'es' ? 'es-ES' : activeLang === 'de' ? 'de-DE' : 'fr-FR', { weekday: 'short' }).replace('.', '')
              : `D${dayNum}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`group relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-between min-h-[64px] text-center ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-400 text-amber-200 ring-2 ring-amber-400/80 scale-105 shadow-lg shadow-amber-500/20 font-bold z-10"
                    : "bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80"
                }`}
              >
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 group-hover:text-slate-200">
                  {weekdayShort}
                </span>

                <span className="font-mono text-sm sm:text-base font-black my-0.5">
                  {dayNum.toString().padStart(2, '0')}
                </span>

                <span className={`text-[7.5px] font-mono px-1 py-0.5 rounded leading-none uppercase truncate max-w-full border ${pred.tagColorClass}`}>
                  {pred.tagText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Details Panel */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={selectedDayIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="bg-slate-950/90 rounded-3xl border border-amber-500/20 p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Subtle background glow accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Section: Date, Tag & Energy Level */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-850 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono">
                    {selectedPred.dateFormatted} ({uiTexts.dayLabel} {selectedDayIndex + 1})
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono border ${selectedPred.tagColorClass}`}>
                    {uiTexts.vibrationLabel} {selectedPred.tagText}
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-medium mt-0.5">
                  {selectedPred.predominantEnergy}
                </p>
              </div>
            </div>

            {/* Energy Level Bar */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 min-w-[220px]">
              <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  {uiTexts.energyLevelTitle}
                </span>
                <span className="text-emerald-400 font-bold font-mono">
                  {selectedPred.energyLevel}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedPred.energyLevel}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-sky-400 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Stellar Message & Strategic Advice Card */}
          <div className="bg-gradient-to-br from-amber-950/20 via-slate-900/60 to-slate-900/90 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                {uiTexts.personalizedAdviceTitle}
              </h4>
            </div>

            <p className="text-sm font-semibold text-amber-100 leading-relaxed">
              "{selectedPred.personalizedAdvice}"
            </p>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
              {selectedPred.personalizedMessage}
            </div>
          </div>

          {/* Lunar Transit & Affected Sectors */}
          <div className="bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-800 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Moon className="w-5 h-5 text-sky-400" />
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block font-bold">
                {uiTexts.lunarTransitTitle}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                {selectedPred.lunarTransitAndSectors}
              </p>
            </div>
          </div>

          {/* Daily Planetary Aspects List */}
          <div className="bg-slate-900/50 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-400">
              <Star className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                {uiTexts.planetaryAspectsTitle}
              </h4>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {selectedPred.dailyPlanetaryAspects.map((asp, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                  {asp}
                </span>
              ))}
            </div>
          </div>

          {/* Grid of Transits & Influences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Compass className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {uiTexts.transitsAndInfluencesTitle}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">
                  {uiTexts.houseTransit}
                </span>
                <p className="text-xs text-slate-200 font-medium leading-snug">
                  {selectedPred.transit}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">
                  {uiTexts.astroInfluence}
                </span>
                <p className="text-xs text-slate-200 font-medium leading-snug">
                  {selectedPred.astroInfluence}
                </p>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">
                  {uiTexts.aspectRelation}
                </span>
                <p className="text-xs text-slate-200 font-medium leading-snug">
                  {selectedPred.aspects}
                </p>
              </div>
            </div>
          </div>

          {/* Opportunities & Challenges Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                {uiTexts.opportunitiesAndChallengesTitle}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Favored Areas & Opportunity */}
              <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/25 space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {uiTexts.favoredAreas}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPred.favoredAreas.map((area, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-500/15">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                    {uiTexts.opportunities}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedPred.opportunities}
                  </p>
                </div>
              </div>

              {/* Attention Areas & Challenge */}
              <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/25 space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    {uiTexts.attentionAreas}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPred.attentionAreas.map((area, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-rose-500/15">
                  <span className="text-[9px] font-mono text-rose-400 uppercase font-bold block mb-1">
                    {uiTexts.challenges}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedPred.challenges}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Footer: Color, Number, Periods */}
          <div className="pt-2">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Lucky Color */}
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span
                  className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                  style={{ backgroundColor: getFavorableColorHex(selectedPred.favorableColor) }}
                />
                <div className="min-w-0">
                  <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">
                    {uiTexts.favorableColor}
                  </span>
                  <span className="text-xs text-slate-200 font-bold truncate block mt-0.5">
                    {selectedPred.favorableColor}
                  </span>
                </div>
              </div>

              {/* Lucky Number */}
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">
                    {uiTexts.favorableNumber}
                  </span>
                  <span className="text-sm font-black text-amber-400 font-mono block leading-none mt-0.5">
                    {selectedPred.favorableNumber}
                  </span>
                </div>
              </div>

              {/* Best Period */}
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">
                    {uiTexts.bestPeriod}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">
                    {selectedPred.bestPeriod}
                  </span>
                </div>
              </div>

              {/* Attention Period */}
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <span className="text-[8px] font-mono text-slate-400 uppercase block leading-none">
                    {uiTexts.attentionPeriod}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400 block mt-0.5">
                    {selectedPred.attentionPeriod}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AstrologyCalendarModule;
