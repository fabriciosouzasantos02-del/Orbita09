import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Check, Moon, Star, Flame, Compass, Trash2, ShieldCheck, 
  Clock, Award, Play, CheckCircle, RefreshCw, Feather
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PracticalRitualsProps {
  user: any;
  activeLang: string;
  dailyQuestsList?: any[];
  onToggleQuest?: (id: string, points: number) => void;
}

interface RitualStep {
  id: string;
  title: string;
  description: string;
}

interface RitualData {
  title: string;
  theme: string;
  intensity: string;
  category: string;
  emoji: string;
  moonNeeded: string;
  numNeeded: number;
  ingredients: string[];
  steps: RitualStep[];
  metaphysicalEffect: string;
}

export default function PracticalRituals({ user, activeLang, dailyQuestsList, onToggleQuest }: PracticalRitualsProps) {
  const { t } = useTranslation();
  
  // Interactive checklist state
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orbi_daily_quests_completed');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [scorePoints, setScorePoints] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orbi_cosmic_points');
      return saved ? parseInt(saved, 10) : 340;
    }
    return 340;
  });

  // Calculate Personal Day (Numerology)
  const personalDayNumber = useMemo(() => {
    if (!user?.birthDate) return 9; // Fallback
    try {
      const birthParts = user.birthDate.split('-');
      if (birthParts.length !== 3) return 9;
      
      const birthDay = parseInt(birthParts[2], 10);
      const birthMonth = parseInt(birthParts[1], 10);
      
      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Sum all digits
      const sumString = `${birthDay}${birthMonth}${currentDay}${currentMonth}${currentYear}`;
      const digits = sumString.replace(/\D/g, '');
      let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      }
      return sum;
    } catch {
      return 9;
    }
  }, [user]);

  // Estimate Moon Phase for Today (Astronomical baseline)
  const moonPhaseInfo = useMemo(() => {
    // New Moon anchor date: Jan 11, 2024
    const anchor = new Date(2024, 0, 11).getTime();
    const today = new Date().getTime();
    const msDiff = today - anchor;
    const daysDiff = msDiff / (1000 * 60 * 60 * 24);
    const cycleDay = daysDiff % 29.53;

    if (cycleDay < 3.5) {
      return { name: t('Lua Nova'), key: 'nova', icon: '🌑', bg: 'from-slate-950 to-indigo-950', desc: t('Momento de plantar sementes e estabelecer novas intenções sagradas.') };
    } else if (cycleDay < 11.5) {
      return { name: t('Lua Crescente'), key: 'crescente', icon: '🌒', bg: 'from-slate-900 via-slate-800 to-cyan-950/40', desc: t('Foco na ação prática, nutrição de projetos e crescimento pessoal ativo.') };
    } else if (cycleDay < 18.5) {
      return { name: t('Lua Cheia'), key: 'cheia', icon: '🌕', bg: 'from-slate-900 via-indigo-950 to-purple-950/50', desc: t('Clímax de iluminação, expansão intuitiva e celebração emocional.') };
    } else if (cycleDay < 26) {
      return { name: t('Lua Minguante'), key: 'minguante', icon: '🌘', bg: 'from-slate-950 via-slate-900 to-rose-950/20', desc: t('Fase de banimento, purificação, desapego e conclusão de ciclos.') };
    } else {
      return { name: t('Lua Nova'), key: 'nova', icon: '🌑', bg: 'from-slate-950 to-indigo-950', desc: t('Momento de plantar sementes e estabelecer novas intenções sagradas.') };
    }
  }, [t]);

  // Determine the Practical Ritual based on Moon Phase + Personal Day
  const currentRitual = useMemo<RitualData>(() => {
    const pNum = personalDayNumber;
    const mKey = moonPhaseInfo.key;
    // Default Fallback / Waning + Day 9 (or similar cleansing ritual)
    if (mKey === 'minguante' || pNum === 9 || pNum === 7) {
      return {
        title: t('rituals.cleansing.title'),
        theme: t('rituals.cleansing.theme'),
        intensity: t('rituals.cleansing.intensity'),
        category: t('rituals.cleansing.category'),
        emoji: '🌿',
        moonNeeded: moonPhaseInfo.name,
        numNeeded: pNum,
        ingredients: [
          t('rituals.cleansing.ingredients.0'),
          t('rituals.cleansing.ingredients.1'),
          t('rituals.cleansing.ingredients.2'),
          t('rituals.cleansing.ingredients.3')
        ],
        steps: [
          {
            id: 'r1',
            title: t('rituals.cleansing.steps.0.title'),
            description: t('rituals.cleansing.steps.0.description')
          },
          {
            id: 'r2',
            title: t('rituals.cleansing.steps.1.title'),
            description: t('rituals.cleansing.steps.1.description')
          },
          {
            id: 'r3',
            title: t('rituals.cleansing.steps.2.title'),
            description: t('rituals.cleansing.steps.2.description')
          },
          {
            id: 'r4',
            title: t('rituals.cleansing.steps.3.title'),
            description: t('rituals.cleansing.steps.3.description')
          }
        ],
        metaphysicalEffect: t('rituals.cleansing.metaphysicalEffect')
      };
    } else if (mKey === 'crescente' || pNum === 1 || pNum === 3 || pNum === 5) {
      return {
        title: t('rituals.prosperity.title'),
        theme: t('rituals.prosperity.theme'),
        intensity: t('rituals.prosperity.intensity'),
        category: t('rituals.prosperity.category'),
        emoji: '🔥',
        moonNeeded: moonPhaseInfo.name,
        numNeeded: pNum,
        ingredients: [
          t('rituals.prosperity.ingredients.0'),
          t('rituals.prosperity.ingredients.1'),
          t('rituals.prosperity.ingredients.2'),
          t('rituals.prosperity.ingredients.3')
        ],
        steps: [
          {
            id: 'r1',
            title: t('rituals.prosperity.steps.0.title'),
            description: t('rituals.prosperity.steps.0.description')
          },
          {
            id: 'r2',
            title: t('rituals.prosperity.steps.1.title'),
            description: t('rituals.prosperity.steps.1.description')
          },
          {
            id: 'r3',
            title: t('rituals.prosperity.steps.2.title'),
            description: t('rituals.prosperity.steps.2.description')
          }
        ],
        metaphysicalEffect: t('rituals.prosperity.metaphysicalEffect')
      };
    } else if (mKey === 'cheia' || pNum === 2 || pNum === 6 || pNum === 11) {
      return {
        title: t('rituals.love.title'),
        theme: t('rituals.love.theme'),
        intensity: t('rituals.love.intensity'),
        category: t('rituals.love.category'),
        emoji: '🔮',
        moonNeeded: moonPhaseInfo.name,
        numNeeded: pNum,
        ingredients: [
          t('rituals.love.ingredients.0'),
          t('rituals.love.ingredients.1'),
          t('rituals.love.ingredients.2'),
          t('rituals.love.ingredients.3')
        ],
        steps: [
          {
            id: 'r1',
            title: t('rituals.love.steps.0.title'),
            description: t('rituals.love.steps.0.description')
          },
          {
            id: 'r2',
            title: t('rituals.love.steps.1.title'),
            description: t('rituals.love.steps.1.description')
          },
          {
            id: 'r3',
            title: t('rituals.love.steps.2.title'),
            description: t('rituals.love.steps.2.description')
          }
        ],
        metaphysicalEffect: t('rituals.love.metaphysicalEffect')
      };
    } else { // New Moon / Other Numbers
      return {
        title: t('rituals.seed.title'),
        theme: t('rituals.seed.theme'),
        intensity: t('rituals.seed.intensity'),
        category: t('rituals.seed.category'),
        emoji: '🌱',
        moonNeeded: moonPhaseInfo.name,
        numNeeded: pNum,
        ingredients: [
          t('rituals.seed.ingredients.0'),
          t('rituals.seed.ingredients.1'),
          t('rituals.seed.ingredients.2'),
          t('rituals.seed.ingredients.3')
        ],
        steps: [
          {
            id: 'r1',
            title: t('rituals.seed.steps.0.title'),
            description: t('rituals.seed.steps.0.description')
          },
          {
            id: 'r2',
            title: t('rituals.seed.steps.1.title'),
            description: t('rituals.seed.steps.1.description')
          },
          {
            id: 'r3',
            title: t('rituals.seed.steps.2.title'),
            description: t('rituals.seed.steps.2.description')
          }
        ],
        metaphysicalEffect: t('rituals.seed.metaphysicalEffect')
      };
    }
  }, [personalDayNumber, moonPhaseInfo, t]);

  // Daily Zen Quests - checklist tailored dynamically
  const quests = useMemo(() => {
    if (dailyQuestsList && dailyQuestsList.length > 0) {
      return dailyQuestsList;
    }
    return [
      {
        id: 'dq1',
        title: t('Completar o Passo 1 do Ritual Diário'),
        desc: t('Realizar a preparação e sintonização do ambiente espiritual.'),
        points: 40,
        isCompleted: !!completedQuests['dq1']
      },
      {
        id: 'dq2',
        title: t('Realizar Exercício de Respiração de 4 Segundos'),
        desc: t('Alinhe seus chakras respirando por 4s, segurando por 4s, expirando por 4s.'),
        points: 30,
        isCompleted: !!completedQuests['dq2']
      },
      {
        id: 'dq3',
        title: t('Limpar Conflito ou Dispersão'),
        desc: t('Envie uma mensagem leve de harmonia ou afaste-se de distrações por 1h hoje.'),
        points: 50,
        isCompleted: !!completedQuests['dq3']
      },
      {
        id: 'dq4',
        title: t('Anotar o Insight de Sintonia do Dia'),
        desc: t('Escreva no centro de anotações ou diário sua principal percepção intuitiva.'),
        points: 40,
        isCompleted: !!completedQuests['dq4']
      }
    ];
  }, [dailyQuestsList, completedQuests, t]);

  // Persist completed quests
  const handleToggleQuest = (id: string, points: number) => {
    if (onToggleQuest) {
      onToggleQuest(id, points);
      if (dailyQuestsList) {
        const nextMissions = dailyQuestsList.map(q => {
          if (q.id === id) return { ...q, isCompleted: !q.isCompleted };
          return q;
        });
        const allDone = nextMissions.every(q => q.isCompleted);
        if (allDone) {
          setShowCelebration(true);
        }
      }
      return;
    }

    const nextCompleted = {
      ...completedQuests,
      [id]: !completedQuests[id]
    };
    
    setCompletedQuests(nextCompleted);
    localStorage.setItem('orbi_daily_quests_completed', JSON.stringify(nextCompleted));

    // Handle score points (with NO regression)
    let nextScore = scorePoints;
    if (!completedQuests[id]) {
      nextScore += points;
    }
    setScorePoints(nextScore);
    localStorage.setItem('orbi_cosmic_points', nextScore.toString());

    // Check if all are completed
    const allDone = quests.every(q => nextCompleted[q.id]);
    if (allDone) {
      setShowCelebration(true);
    }
  };

  const completedCount = useMemo(() => {
    return quests.filter(q => q.isCompleted).length;
  }, [quests]);

  const completionPercent = quests.length > 0 ? Math.round((completedCount / quests.length) * 100) : 0;

  return (
    <div id="practical-rituals-container" className="space-y-8">
      {/* CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-150 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-3xl p-6 text-center space-y-6 relative shadow-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Star className="w-10 h-10 text-slate-950 fill-slate-950" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-white font-sans">{t('Estrela Diária Concluída!')}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('Parabéns! Você completou todas as missões diárias (Daily Zen Quests) e harmonizou sua energia sob a')} <strong>{moonPhaseInfo.name}</strong>. {t('Seu campo áurico está fortalecido para atrair novas conexões e ideias brilhantes.')}
                </p>
              </div>

              <div className="bg-slate-950 py-3 px-6 rounded-2xl border border-slate-850 inline-block">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">{t('Sua Vibração Cósmica')}</span>
                <span className="text-base font-mono font-bold text-amber-500">+{completionPercent}% {t('Alinhamento')}</span>
              </div>

              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-100 opacity-90 text-slate-950 font-bold rounded-xl text-xs uppercase transition cursor-pointer"
              >
                {t('Soberano e Alinhado')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase flex items-center gap-1.5">
            <Feather className="w-4 h-4 text-purple-400 animate-pulse" />
            {t('Ação Prática Diária')}
          </span>
          <h3 className="text-lg font-black tracking-tight text-white font-sans mt-1">
            {t('Rituais Práticos e Sintonias do Dia')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('Prescrições astrológicas e numéricas sob medida para agir no plano material e elevar sua sintonia.')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 py-2 px-4 rounded-2xl">
          <Award className="w-4.5 h-4.5 text-amber-500" />
          <div>
            <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">{t('Créditos Cósmicos')}</span>
            <strong className="text-xs text-slate-300 font-mono font-bold">{scorePoints} OrbiPoints</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ACTIVE RITUAL CARD */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-slate-850 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-850 pb-4">
              <div className="space-y-1.5 text-left">
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono font-bold text-purple-400 rounded-full uppercase tracking-wider">
                  {currentRitual.category}
                </span>
                <h4 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5 leading-tight font-sans">
                  <span className="text-xl">{currentRitual.emoji}</span>
                  {currentRitual.title}
                </h4>
                <p className="text-xs text-slate-400 font-sans">{currentRitual.theme}</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-850 text-center min-w-[80px] shrink-0">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">{t('Vibração')}</span>
                <span className="text-xs font-mono font-bold text-amber-500">Dia {personalDayNumber}</span>
              </div>
            </div>

            {/* Ingredients checklist */}
            <div className="space-y-3 text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">{t('Ingredientes e Elementos Necessários')}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentRitual.ingredients.map((ing, idx) => (
                  <div key={idx} className="bg-slate-950/40 p-3 rounded-xl border border-slate-850 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs text-slate-300 truncate font-sans">{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metaphysical Effect */}
            <div className="bg-slate-950/50 border border-purple-950/40 p-4 rounded-2xl text-left space-y-1">
              <strong className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">🌟 {t('Influência Metafísica Ativa')}</strong>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">{currentRitual.metaphysicalEffect}</p>
            </div>

            {/* Step-by-Step interactive slideshow */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block text-left">{t('Passo a Passo do Ritual')}</span>
              
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850/80 relative text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                    {t('Etapa')} {activeStepIndex + 1} {t('de')} {currentRitual.steps.length}
                  </span>
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#a855f7' }} />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStepIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 min-h-[100px]"
                  >
                    <h5 className="font-extrabold text-slate-200 text-xs flex items-center gap-1.5 font-sans">
                      <span className="w-5 h-5 bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] font-bold rounded-lg flex items-center justify-center">
                        {activeStepIndex + 1}
                      </span>
                      {currentRitual.steps[activeStepIndex].title}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {currentRitual.steps[activeStepIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Step indicators dots */}
                <div className="flex gap-1.5 justify-center mt-4 border-t border-slate-900 pt-3">
                  {currentRitual.steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeStepIndex ? 'w-6 bg-purple-500' : 'w-1.5 bg-slate-800 hover:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DAILY ZEN QUESTS CHECKLIST */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="bg-slate-900/30 p-6 rounded-3xl border border-slate-850 space-y-5">
            <div className="space-y-1.5 border-b border-slate-850 pb-3">
              <div className="text-amber-500 font-bold font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                {t('Daily Zen Quests')}
              </div>
              <h4 className="text-base font-extrabold text-slate-100 font-sans">{t('Missões Diárias de Sintonia')}</h4>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                {t('Pratique o auto-alinhamento e some pontos débito de evolução cósmica. Complete todas as tarefas diárias para receber Dharma ao longo de sua vida')}
              </p>
            </div>

            {/* Circular Progress Display */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">{t('Sua Conclusão Hoje')}</span>
                <strong className="text-xs text-slate-350 block font-bold">
                  {completedCount} {t('de')} {dailyQuestsList.length} {t('Tarefas Feitas')}
                </strong>
              </div>

              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-900"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-500 transition-all duration-1000 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={`${completionPercent}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-slate-200">
                  {completionPercent}%
                </div>
              </div>
            </div>

            {/* Quests Checkable items list */}
            <div className="space-y-3">
              {quests.map((quest) => {
                const isCompleted = !!quest.isCompleted;
                return (
                  <button
                    key={quest.id}
                    onClick={() => handleToggleQuest(quest.id, quest.points)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer focus:outline-none ${
                      isCompleted 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-450' 
                        : 'bg-slate-950/60 border-slate-850 hover:bg-slate-950 hover:border-slate-800'
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-xl flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                      isCompleted 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-inner' 
                        : 'border-slate-800 bg-slate-900 text-transparent hover:border-slate-750'
                    }`}>
                      <Check className="w-3.5 h-3.5 font-bold" />
                    </div>

                    <div className="space-y-0.5 flex-grow min-w-0">
                      <h5 className={`font-sans font-bold text-xs leading-snug truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {quest.title}
                      </h5>
                      <p className={`text-[10px] leading-relaxed font-sans ${isCompleted ? 'text-slate-500/60' : 'text-slate-500'}`}>
                        {quest.desc || quest.description}
                      </p>
                    </div>

                    <span className={`text-[9px] font-mono font-bold shrink-0 px-2 py-0.5 rounded-lg border ${
                      isCompleted 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-900 border-slate-850 text-amber-500'
                    }`}>
                      +{quest.points} XP
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
