import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Info, Heart, Zap, Award, Compass, Eye, Activity, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateAstronomicalBiorhythms } from './astroMath';

interface CosmicChakrasProps {
  user: any;
  mapData: any;
  activeLang: string;
}

interface ChakraData {
  id: string;
  name: string;
  sanskrit: string;
  color: string;
  glowColor: string;
  bgGlow: string;
  percentage: number;
  coordinates: string;
  yPos: number; // Y position on 1-100 scale for visual mapping
  description: string;
  tips: string[];
  gem: string;
  element: string;
}

export default function CosmicChakras({ user, mapData, activeLang }: CosmicChakrasProps) {
  const { t } = useTranslation();
  const [selectedChakraId, setSelectedChakraId] = useState<string>('cardíaco');
  const [justAligned, setJustAligned] = useState<string | null>(null);

  const bDate = user?.birthDate || "1997-02-11";
  
  // Calculate biorhythms for today
  const todayDateStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const biorhythms = useMemo(() => {
    try {
      return calculateAstronomicalBiorhythms(bDate, "12:00", todayDateStr);
    } catch (e) {
      console.warn("Biorhythm calculation failed inside Chakras:", e);
      return { fisico: 45, emocional: 65, intelectual: 55, espiritual: 75, perceptivo: 60, intuitivo: 80, estetico: 50 };
    }
  }, [bDate, todayDateStr]);

  // Transform raw biorhythm values (normally -100 to 100) to clean percentage (0 to 100)
  const toPercent = (val: number | undefined) => {
    if (val === undefined) return 50;
    return Math.round((val + 100) / 2);
  };

  const chakrasList = useMemo<ChakraData[]>(() => {
    const physicalPct = toPercent(biorhythms.fisico);
    const emotionalPct = toPercent(biorhythms.emocional);
    const intellectualPct = toPercent(biorhythms.intelectual);
    const spiritualPct = toPercent(biorhythms.espiritual);
    const intuitivePct = toPercent(biorhythms.intuitivo);
    const aestheticPct = toPercent(biorhythms.estetico);
    const perceptivePct = toPercent(biorhythms.perceptivo);

    return [
      {
        id: 'coronário',
        name: t('chakras.coronario.name'),
        sanskrit: 'Sahasrara',
        color: 'text-violet-400',
        glowColor: '#c084fc',
        bgGlow: 'bg-violet-500/20',
        percentage: Math.min(100, Math.max(30, Math.round(spiritualPct * 0.85 + 15))),
        coordinates: 'Sol & Júpiter',
        yPos: 8,
        description: t('chakras.coronario.description'),
        tips: [
          t('chakras.coronario.tip1'),
          t('chakras.coronario.tip2'),
          t('chakras.coronario.tip3')
        ],
        gem: t('chakras.coronario.gem'),
        element: t('chakras.coronario.element')
      },
      {
        id: 'frontal',
        name: t('chakras.frontal.name'),
        sanskrit: 'Ajna',
        color: 'text-indigo-400',
        glowColor: '#818cf8',
        bgGlow: 'bg-indigo-500/20',
        percentage: Math.min(100, Math.max(30, Math.round(intuitivePct * 0.9 + 10))),
        coordinates: 'Lua & Netuno',
        yPos: 21,
        description: t('chakras.frontal.description'),
        tips: [
          t('chakras.frontal.tip1'),
          t('chakras.frontal.tip2'),
          t('chakras.frontal.tip3')
        ],
        gem: t('chakras.frontal.gem'),
        element: t('chakras.frontal.element')
      },
      {
        id: 'laríngeo',
        name: t('chakras.laringeo.name'),
        sanskrit: 'Vishuddha',
        color: 'text-sky-400',
        glowColor: '#38bdf8',
        bgGlow: 'bg-sky-500/20',
        percentage: Math.min(100, Math.max(30, Math.round(intellectualPct * 0.8 + perceptivePct * 0.2))),
        coordinates: 'Mercúrio',
        yPos: 35,
        description: t('chakras.laringeo.description'),
        tips: [
          t('chakras.laringeo.tip1'),
          t('chakras.laringeo.tip2'),
          t('chakras.laringeo.tip3')
        ],
        gem: t('chakras.laringeo.gem'),
        element: t('chakras.laringeo.element')
      },
      {
        id: 'cardíaco',
        name: t('chakras.cardiaco.name'),
        sanskrit: 'Anahata',
        color: 'text-emerald-400',
        glowColor: '#34d399',
        bgGlow: 'bg-emerald-500/20',
        percentage: Math.min(100, Math.max(30, Math.round(emotionalPct * 0.85 + 15))),
        coordinates: 'Vênus & Lua',
        yPos: 50,
        description: t('chakras.cardiaco.description'),
        tips: [
          t('chakras.cardiaco.tip1'),
          t('chakras.cardiaco.tip2'),
          t('chakras.cardiaco.tip3')
        ],
        gem: t('chakras.cardiaco.gem'),
        element: t('chakras.cardiaco.element')
      },
      {
        id: 'plexo_solar',
        name: t('chakras.plexo_solar.name'),
        sanskrit: 'Manipura',
        color: 'text-amber-400',
        glowColor: '#fbbf24',
        bgGlow: 'bg-amber-500/20',
        percentage: Math.min(100, Math.max(30, Math.round((intellectualPct + physicalPct) / 2))),
        coordinates: 'Sol & Marte',
        yPos: 65,
        description: t('chakras.plexo_solar.description'),
        tips: [
          t('chakras.plexo_solar.tip1'),
          t('chakras.plexo_solar.tip2'),
          t('chakras.plexo_solar.tip3')
        ],
        gem: t('chakras.plexo_solar.gem'),
        element: t('chakras.plexo_solar.element')
      },
      {
        id: 'sacral',
        name: t('chakras.sacral.name'),
        sanskrit: 'Svadhisthana',
        color: 'text-orange-400',
        glowColor: '#fb923c',
        bgGlow: 'bg-orange-500/20',
        percentage: Math.min(100, Math.max(30, Math.round(aestheticPct * 0.7 + emotionalPct * 0.3))),
        coordinates: 'Lua & Vênus',
        yPos: 78,
        description: t('chakras.sacral.description'),
        tips: [
          t('chakras.sacral.tip1'),
          t('chakras.sacral.tip2'),
          t('chakras.sacral.tip3')
        ],
        gem: t('chakras.sacral.gem'),
        element: t('chakras.sacral.element')
      },
      {
        id: 'raiz',
        name: t('chakras.raiz.name'),
        sanskrit: 'Muladhara',
        color: 'text-rose-500',
        glowColor: '#f43f5e',
        bgGlow: 'bg-rose-500/20',
        percentage: Math.min(100, Math.max(30, Math.round(physicalPct * 0.9 + 10))),
        coordinates: 'Saturno / Elemento Terra',
        yPos: 92,
        description: t('chakras.raiz.description'),
        tips: [
          t('chakras.raiz.tip1'),
          t('chakras.raiz.tip2'),
          t('chakras.raiz.tip3')
        ],
        gem: t('chakras.raiz.gem'),
        element: t('chakras.raiz.element')
      }
    ];
  }, [biorhythms, t]);

  const activeChakra = useMemo(() => {
    return chakrasList.find(c => c.id === selectedChakraId) || chakrasList[3];
  }, [selectedChakraId, chakrasList]);

  const handleAlignAll = (id: string) => {
    setJustAligned(id);
    setTimeout(() => setJustAligned(null), 3000);
  };

  return (
    <div id="cosmic-chakras-container" className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
            <Activity className="w-4 h-4 animate-pulse" />
            {t('Equilíbrio Energético Diário')}
          </span>
          <h3 className="text-lg font-black tracking-tight text-white font-sans mt-1">
            {t('Mapeamento dos Chakras Cósmicos')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('Análise viva da pulsação dos seus centros áuricos sintonizada aos biorritmos e transições celestes.')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-850">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-[10px] font-mono text-slate-400">
            {t('Toque em um pilar na silhueta para inspecionar.')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: 3D-EFFECT TRANSLUCENT HUMAN SILHOUETTE */}
        <div className="lg:col-span-5 bg-slate-950/40 border border-slate-850 p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden h-[480px]">
          {/* Pulsing Auric Aura Background */}
          <div 
            className="absolute inset-0 transition-all duration-1000 opacity-20 blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% ${activeChakra.yPos}%, ${activeChakra.glowColor} 0%, transparent 60%)`
            }}
          />

          {/* Elegant Translucent Human Silhouette SVG */}
          <div className="relative w-full h-full max-w-[200px] flex items-center justify-center">
            {/* Meditator Outline SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full text-slate-800/60 drop-shadow-[0_0_15px_rgba(30,41,59,0.5)] relative z-10"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.8"
            >
              {/* Head & Neck */}
              <path d="M50,15 C54,15 56,18 56,22 C56,26 53,28 50,28 C47,28 44,26 44,22 C44,18 46,15 50,15 Z" fill="currentColor" fillOpacity="0.03" />
              {/* Shoulders & Torso */}
              <path d="M50,28 Q50,30 45,31 T35,35 Q30,37 32,41 T36,44 L38,45 L38,55 Q38,62 34,68 T26,75 Q20,80 25,83 T38,82 Q45,81 50,83 T62,82 Q75,80 80,83 T74,75 T66,68 T62,55 L62,45 L64,44 Q68,43 70,41 T65,35 T55,31 Q50,30 50,28 Z" fill="currentColor" fillOpacity="0.03" />
              {/* Lotus Crossed Legs Base */}
              <path d="M26,75 C23,76 20,78 18,80 C15,83 20,85 28,84 Q38,83 50,84 T72,84 Q80,85 85,83 C80,78 77,76 74,75" fill="currentColor" fillOpacity="0.02" />
              
              {/* Cosmic spine axis line */}
              <line x1="50" y1="15" x2="50" y2="92" stroke="rgba(244, 63, 94, 0.15)" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>

            {/* Interactive Chakra Nodes overlays */}
            {chakrasList.map((ch) => {
              const isActive = ch.id === selectedChakraId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChakraId(ch.id)}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer focus:outline-none"
                  style={{ top: `${ch.yPos}%` }}
                >
                  {/* Outer Pulsing Wave ring */}
                  <span 
                    className="absolute -inset-4 rounded-full opacity-60 transition-all duration-500 scale-75 group-hover:scale-110"
                    style={{
                      border: `2.5px solid ${ch.glowColor}`,
                      boxShadow: isActive ? `0 0 20px ${ch.glowColor}` : 'none',
                      animation: isActive ? 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'
                    }}
                  />
                  
                  {/* Core Node Ball */}
                  <span 
                    className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isActive ? 'scale-125 border-white shadow-lg' : 'border-slate-700/80 hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: ch.glowColor,
                      boxShadow: `0 0 10px ${ch.glowColor}`
                    }}
                  >
                    {/* Tiny center point */}
                    <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                  </span>

                  {/* Label Tooltip shown on hover or active */}
                  <span className={`absolute left-7 top-1/2 -translate-y-1/2 bg-slate-950/90 border border-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 flex items-center gap-1.5 ${
                    isActive ? '!opacity-100 translate-x-1 font-bold' : ''
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ch.glowColor }} />
                    <span className="text-slate-100">{ch.name}</span>
                    <span className="text-amber-500 text-[9px]">{ch.percentage}%</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: CHAKRA DETAILED INSPECTION */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChakra.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800 space-y-6"
            >
              {/* Chakra Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-850 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: activeChakra.glowColor }} />
                    <h4 className="text-lg font-black text-slate-100 font-sans">{activeChakra.name}</h4>
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">
                    {activeChakra.sanskrit} • {t('Elemento:')} <span className="text-slate-400 font-normal">{activeChakra.element}</span>
                  </p>
                </div>

                {/* Big Percentage Display */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">{t('Alinhamento Diário')}</span>
                    <span className="text-lg font-mono font-black text-slate-200">{activeChakra.percentage}%</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 inset-x-0 opacity-40 transition-all duration-1000"
                      style={{ 
                        backgroundColor: activeChakra.glowColor, 
                        height: `${activeChakra.percentage}%` 
                      }}
                    />
                    <Sparkles className="w-5 h-5 text-amber-500/80 relative z-10" />
                  </div>
                </div>
              </div>

              {/* Progress bar scale */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{t('Inércia / Bloqueio')}</span>
                  <span className="font-bold text-slate-350">{t('Fluxo Perfeito')}</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-850/80">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${activeChakra.percentage}%`,
                      backgroundColor: activeChakra.glowColor,
                      boxShadow: `0 0 10px ${activeChakra.glowColor}`
                    }}
                  />
                </div>
              </div>

              {/* Planetary Coordinates */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '30s' }} />
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">{t('Canais Celestiais Ativos')}</span>
                    <strong className="text-xs text-slate-300 font-mono font-bold">{activeChakra.coordinates}</strong>
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-2.5 py-1 border border-indigo-500/20 rounded-xl">
                  {t('Sinergia Astral')}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-widest font-bold">{t('Vibração Primordial')}</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeChakra.description}</p>
              </div>

              {/* Harmonization Tips & Quests */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-widest font-bold">{t('Práticas Recomendadas para Hoje')}</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 space-y-2">
                    <h5 className="font-bold text-amber-500 text-xs">💎 {t('Cristal de Ressonância')}</h5>
                    <p className="text-xs text-slate-350 font-sans">{activeChakra.gem}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/80 space-y-2">
                    <h5 className="font-bold text-cyan-400 text-xs">🌿 {t('Filtro Aromático')}</h5>
                    <p className="text-xs text-slate-350 font-sans">{activeChakra.tips[2]}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2.5">
                  <h5 className="font-bold text-purple-400 text-xs flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    {t('Afirmação e Exercício de Foco')}
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeChakra.tips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactive Align/Meditate button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleAlignAll(activeChakra.id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-100 opacity-90 text-slate-950 font-black font-sans text-xs uppercase rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-lg"
                >
                  {justAligned === activeChakra.id ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>{t('Chakra Alinhado!')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{t('Harmonizar Agora')}</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
