import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Activity, 
  Brain, 
  Sparkles, 
  Eye, 
  Palette, 
  Compass, 
  Info, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  User, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle 
} from 'lucide-react';
import { translateUiText, Language } from '../lib/translations';

interface BiorhythmViewProps {
  userName?: string;
  birthDate?: string;
  lang?: string;
}

// Fixed periods in days for the 7 biorhythm cycles
const CYCLES = {
  fisico: { name: 'Físico', period: 23, color: 'text-rose-450', stroke: '#ef4444', desc: 'Disposição muscular, fôlego cardiovascular e resistência física geral.' },
  emocional: { name: 'Emocional', period: 28, color: 'text-indigo-400', stroke: '#6366f1', desc: 'Humor receptivo, sensibilidade, empatia, criatividade e resiliência sentimental.' },
  intelectual: { name: 'Intelectual', period: 33, color: 'text-sky-400', stroke: '#38bdf8', desc: 'Poder de concentração, facilidade de retenção intelectual, discernimento e raciocínio lógico.' },
  espiritual: { name: 'Espiritual', period: 53, color: 'text-purple-400', stroke: '#c084fc', desc: 'Conexão com propósitos transcendentais, estabilidade de fé e harmonia mística de alma.' },
  perceptivo: { name: 'Perceptivo', period: 38, color: 'text-emerald-400', stroke: '#34d399', desc: 'Atenção aos sinais invisíveis do ambiente, reflexos corporais e presença diária.' },
  intuitivo: { name: 'Intuitivo', period: 48, color: 'text-amber-400', stroke: '#fbbf24', desc: 'Sexto sentido ativo, premonições cotidianas e sintonia com caminhos de alma.' },
  estetico: { name: 'Estético-Criativo', period: 43, color: 'text-pink-400', stroke: '#f472b6', desc: 'Apreciação artística refinada, criação espontânea de beleza e bom gosto.' }
};

export default function BiorhythmView({ userName, birthDate = '1997-02-11', lang }: BiorhythmViewProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (lang as Language) || 'pt');
    }
    return res;
  };
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });
  const [showTheory, setShowTheory] = useState<boolean>(false);
  const [expandedCycle, setExpandedCycle] = useState<string | null>('emocional'); // Default expand Emotional as requested

  // Format first name
  const displayFirstName = userName ? userName.split(' ')[0] : '';

  // Helper to parse date string safely
  const parseDate = (dStr: string) => {
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    return new Date();
  };

  const targetDateObj = useMemo(() => parseDate(selectedDate), [selectedDate]);
  const birthDateObj = useMemo(() => parseDate(birthDate), [birthDate]);

  // Calculate days elapsed between birth and a target date
  const calculateDaysElapsed = (birth: Date, target: Date) => {
    const diffTime = target.getTime() - birth.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Generate 15-day range list centered around target
  const rawDaysRange = useMemo(() => {
    const days: Date[] = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date(targetDateObj);
      d.setDate(targetDateObj.getDate() + i);
      days.push(d);
    }
    return days;
  }, [targetDateObj]);

  // Helper to compute specific cycle percentage (-100 to 100) for a given days elapsed
  const getBiorhythmVal = (days: number, period: number) => {
    // Formula: sin(2 * pi * t / period) * 100
    const val = Math.sin((2 * Math.PI * days) / period) * 100;
    return Math.round(val);
  };

  // Compute trending (is it going up?)
  const getIsTrendingUp = (days: number, period: number) => {
    const valToday = getBiorhythmVal(days, period);
    const valTomorrow = getBiorhythmVal(days + 1, period);
    return valTomorrow > valToday;
  };

  // Compile calculations for today (targetDateObj)
  const todayDaysElapsed = useMemo(() => {
    return calculateDaysElapsed(birthDateObj, targetDateObj);
  }, [birthDateObj, targetDateObj]);

  const todayMetrics = useMemo(() => {
    const res: Record<string, { value: number; isUp: boolean; isCritical: boolean }> = {};
    Object.entries(CYCLES).forEach(([key, details]) => {
      const value = getBiorhythmVal(todayDaysElapsed, details.period);
      const isUp = getIsTrendingUp(todayDaysElapsed, details.period);
      // Critical state is when cycle crosses zero line (+-10% boundary) or is near extreme peaks
      const isCritical = Math.abs(value) <= 12;
      res[key] = { value, isUp, isCritical };
    });
    return res;
  }, [todayDaysElapsed]);

  // Get weekday name in target language
  const getWeekdayName = (date: Date) => {
    try {
      return new Intl.DateTimeFormat(lang || 'pt', { weekday: 'long' }).format(date);
    } catch {
      const daysPt = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      return daysPt[date.getDay()];
    }
  };

  // Get month name in target language
  const getMonthName = (date: Date) => {
    try {
      return new Intl.DateTimeFormat(lang || 'pt', { month: 'long' }).format(date);
    } catch {
      const monthsPt = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return monthsPt[date.getMonth()];
    }
  };

  // Format full date line
  const formattedTodayLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(lang || 'pt', { dateStyle: 'full' }).format(targetDateObj);
    } catch {
      const wDay = getWeekdayName(targetDateObj);
      const day = targetDateObj.getDate();
      const month = getMonthName(targetDateObj);
      const year = targetDateObj.getFullYear();
      return `${wDay}, ${day} de ${month} de ${year}`;
    }
  }, [targetDateObj, lang]);

  // Chart coordinate calculation for the 15 days window (SVG width 600, height 200)
  // X: 0 to 600 map from index 0 to 14
  // Y: 0 to 200 map from 100% to -100% (value of 100 maps to Y=10, 0 maps to Y=100, -100 maps to Y=190)
  const mapY = (val: number) => {
    // 100 is top, -100 is bottom
    // We scale from 15 (at +100) to 185 (at -100)
    return 100 - (val / 100) * 85;
  };

  const mapX = (index: number) => {
    return (index / 14) * 560 + 20;
  };

  // Compile path data for each of the 7 cycles over the 15-day window
  const cyclePaths = useMemo(() => {
    const paths: Record<string, string> = {};
    Object.entries(CYCLES).forEach(([key, details]) => {
      const points = rawDaysRange.map((d, idx) => {
        const daysElapsed = calculateDaysElapsed(birthDateObj, d);
        const val = getBiorhythmVal(daysElapsed, details.period);
        return `${mapX(idx)},${mapY(val)}`;
      });
      paths[key] = `M ${points.join(' L ')}`;
    });
    return paths;
  }, [rawDaysRange, birthDateObj]);

  // Friendly date list for chart bottom axis
  const chartDates = useMemo(() => {
    return rawDaysRange.map(d => {
      const day = String(d.getDate()).padStart(2, '0');
      const mon = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}/${mon}`;
    });
  }, [rawDaysRange]);

  const rawRangeStartDateStr = useMemo(() => {
    const start = rawDaysRange[0];
    const end = rawDaysRange[14];
    const startStr = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}`;
    const endStr = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}`;
    
    if (lang === 'de') return `vom ${startStr} bis ${endStr}`;
    if (lang === 'en') return `from ${startStr} to ${endStr}`;
    if (lang === 'es') return `del ${startStr} al ${endStr}`;
    if (lang === 'fr') return `du ${startStr} au ${endStr}`;
    return `de ${startStr} a ${endStr}`;
  }, [rawDaysRange, lang]);

  return (
    <div id="biorhythm-root-panel" className="space-y-6 text-left">
      
      {/* Intro Header Section */}
      <div className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-slate-805 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-full text-[9px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 w-fit">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              {t("TEORIA DA PERIODICIDADE VITAL")}
            </span>
            <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight text-white uppercase">
              {t("Meu Biorritmo")}
            </h2>
          </div>

          <button
            onClick={() => setShowTheory(!showTheory)}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-400 font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            {showTheory ? t('Ocultar Teoria') : t('Saiba Mais')}
          </button>
        </div>

        <p className="text-xs text-slate-350 leading-relaxed font-sans mt-4 max-w-4xl">
          {displayFirstName ? (
            <>
              {t("Olá")} <strong className="text-indigo-305">{displayFirstName}</strong>, {t("aqui você encontra o seu atual panorama de Biorritmo, composto de ciclos que se alternam e criam diversas dinâmicas de influência diariamente.")}
            </>
          ) : (
            <>
              {t("Aqui você encontra o atual panorama de Biorritmo personalizado, composto de ciclos biológicos, emocionais e intelectuais que se alternam e criam dinâmicas influentes de produtividade e foco diariamente.")}
            </>
          )} {t("O estudo também é chamado de Teoria da Periodicidade Vital e indica como se comportam alguns ciclos da experiência humana em diversas esferas. Em paralelo à astrologia e o hermetismo, use-o para se conhecer melhor, entender as causas de determinados acontecimentos, lidar com instabilidades ou até mesmo para escolher os melhores momentos para fazer algo importante.")}
        </p>

        {/* Collapsible Educational Box */}
        <AnimatePresence>
          {showTheory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-slate-850"
            >
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850/60 text-xs text-slate-400 space-y-3 font-sans">
                <h4 className="font-bold text-slate-200 uppercase tracking-widest font-mono text-[10.5px]">{t("Como Funciona o Biorritmo?")}</h4>
                <p>
                  {t("Postulado cientificamente no início do século XX pelos médicos Wilhelm Fliess e Hermann Swoboda, o biorritmo mapeia ciclos biológicos matemáticos que se iniciam exatamente no momento do nascimento:")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-[11px]">
                  <div className="space-y-1">
                    <strong className="text-rose-450 font-mono">{t("FÍSICO (23 dias):")}</strong>
                    <p className="text-slate-450">{t("Influencia força física, resistência mecânica, coordenação motora e tolerância à fadiga muscular.")}</p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-indigo-400 font-mono">{t("EMOCIONAL (28 dias):")}</strong>
                    <p className="text-slate-450">{t("Rege a estabilidade nervosa, o otimismo sincero, a sensibilidade artística, a intuição afetiva e humores.")}</p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-sky-400 font-mono">{t("INTELECTUAL (33 dias):")}</strong>
                    <p className="text-slate-450">{t("Comanda a facilidade mnemônica, velocidade de raciocínio, lógica complexa e destreza de aprendizados.")}</p>
                  </div>
                </div>
                <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-slate-350 italic text-[10.5px] leading-relaxed">
                  <strong>{t("Nota sobre os Dias Críticos:")}</strong> {t("Sempre que as linhas cruzam a linha central do zero (0%), ocorre um momento de reorientação extrema. Cuidado redobrado e paciência são recomendados nesses pontos críticos.")}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive Controls & Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: 15-day Interactive Multi-line Sine Chart */}
        <div className="lg:col-span-8 bg-slate-900/40 p-5 md:p-6 rounded-3xl border border-slate-805 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-slate-850">
            <div>
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">{t("HISTÓRICO DE FLUXOS TRIDIMENSIONAIS")}</span>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-tight">
                {t("Análise Biorrítmica")} ({rawRangeStartDateStr})
              </h3>
            </div>

            {/* Quick date navigator inputs inside chart to customize analyzed day */}
            <div className="flex gap-2 items-center">
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-xl focus:border-indigo-500/60 outline-none font-mono"
              />
              <input 
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-2 py-1.5 rounded-xl focus:border-indigo-500/60 outline-none font-mono w-20"
              />
            </div>
          </div>

          {/* SVG Custom Chart Canvas */}
          <div className="relative bg-slate-950 rounded-2xl border border-slate-850 p-3 pt-6 overflow-hidden">
            
            {/* Background grids */}
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-indigo-500/10 border-t border-dashed border-indigo-400/25 z-0" />
            
            {/* Chart Grid Lines & Percentages labels on Right */}
            <div className="absolute left-2.5 top-2.5 bottom-2.5 flex flex-col justify-between text-[9px] font-mono text-slate-650 select-none z-10 pointer-events-none">
              <span>+100%</span>
              <span>+60%</span>
              <span>0% ({t("Crítico!")})</span>
              <span>-60%</span>
              <span>-100%</span>
            </div>

            <div className="h-44 w-full relative z-10">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                
                {/* Vertical Center Line for Today */}
                <line x1={mapX(7)} y1={5} x2={mapX(7)} y2={195} stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                
                {/* Horizontal reference zero line */}
                <line x1={15} y1={100} x2={585} y2={100} stroke="#475569" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

                {/* Render paths for all 7 cycles */}
                {Object.entries(CYCLES).map(([key, details]) => (
                  <g key={key}>
                    {/* Background shadow path */}
                    <path
                      d={cyclePaths[key]}
                      fill="none"
                      stroke={details.stroke}
                      strokeWidth="2"
                      opacity={expandedCycle === key ? "1" : "0.22"}
                      strokeDasharray={key === 'espiritual' || key === 'intuitivo' ? "4 3" : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Interactive Dot for Today */}
                    <circle
                      cx={mapX(7)}
                      cy={mapY(todayMetrics[key]?.value || 0)}
                      r={expandedCycle === key ? "5" : "3"}
                      fill={details.stroke}
                      className="transition-all duration-300"
                    />
                  </g>
                ))}

              </svg>
              
              {/* Floating "Hoje" Indicator Tag above vertical divider */}
              <div 
                className="absolute text-[9px] font-mono bg-indigo-500 text-white px-2 py-0.5 rounded-full font-bold z-20 shadow-md flex items-center gap-1"
                style={{ left: `calc(${mapX(7) / 6}% - 24px)`, top: '6px' }}
              >
                <span>{t("Hoje")}</span>
                <span className="opacity-90">{selectedTime}</span>
              </div>
            </div>

            {/* Bottom dates ticks */}
            <div className="flex justify-between text-[8.5px] font-mono text-slate-500 pt-2 border-t border-slate-900 px-5 relative z-10 select-none">
              {chartDates.map((dLabel, idx) => (
                <span 
                  key={idx} 
                  className={`transition-colors ${idx === 7 ? 'text-indigo-400 font-bold underline decoration-indigo-500 underline-offset-2' : ''}`}
                >
                  {dLabel}
                </span>
              ))}
            </div>

          </div>

          {/* Sintonização dynamic advice alert */}
          <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs text-slate-300 leading-relaxed space-y-1.5">
            <div className="flex gap-2 items-center text-[11px] font-mono font-bold text-indigo-305">
              <span>★</span>
              <span>{t("SINTONIA SINDICAL ATIVA AMARA")}</span>
            </div>
            <p>
              <strong>{t("Sabedoria e confiança!")}</strong> {t("No momento, hay uma sintonia benéfica entre seu ciclo intelectual e emocional, algo que pode te influenciar a tomar as decisões cruciais de longo prazo com muito mais clareza, harmonia e estabilidade de alma.")}
            </p>
          </div>

        </div>

        {/* Right Side: Analysis Display with Accordion for primary and secondary cycles */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-805 space-y-4">
            <div className="pb-1 border-b border-slate-850">
              <span className="text-[8px] font-mono text-slate-500 block uppercase">{t("ANÁLISE INDIVIDUALIZADA")}</span>
              <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider mt-1">
                {t("Hoje:")} {formattedTodayLabel}
              </h3>
            </div>

            {/* 3 Primary Cycles Section */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-slate-350 tracking-wide font-bold">{t("Ciclos primários")}</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase">{t("Aspectos Vitais")}</span>
              </div>
              <p className="text-[10px] text-slate-505 leading-relaxed">
                {t("Os principais ciclos, que lidam com os aspectos Físicos, Emocionais e Intelectuais.")}
              </p>

              <div className="space-y-2">
                {['fisico', 'emocional', 'intelectual'].map((key) => {
                  const details = CYCLES[key as keyof typeof CYCLES];
                  const data = todayMetrics[key];
                  const isOpen = expandedCycle === key;

                  return (
                    <div 
                      key={key} 
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isOpen ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-950/40 border-slate-900/60 hover:bg-slate-950/60'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedCycle(isOpen ? null : key)}
                        className="w-full p-3 flex justify-between items-center text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          {key === 'fisico' && <Activity className="w-4 h-4 text-rose-455" />}
                          {key === 'emocional' && <Heart className="w-4 h-4 text-indigo-400" />}
                          {key === 'intelectual' && <Brain className="w-4 h-4 text-sky-455" />}
                          
                          <span className="text-xs font-bold text-slate-200">{t(details.name)}</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className={`font-bold ${data.value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {data.value > 0 ? `+${data.value}` : data.value}%
                          </span>
                          
                          {data.isUp ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          
                          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-3 pb-3 pt-0.5 text-[10.5px] text-slate-355 space-y-1.5 border-t border-slate-900"
                          >
                            <span className="text-[10px] font-mono text-indigo-400 block uppercase font-semibold">
                              {data.value > 80 ? t('✦ Alto Potencial') : data.value < -80 ? t('⚡ Período de Depuração') : t('★ Frequência Intermediária')}
                            </span>
                            
                            <p className="leading-relaxed font-sans">
                              {key === 'emocional' ? (
                                t("Com o ciclo emocional em alta (+100%), há um aumento do potential para se sentir mais de bem com a vida, consigo mesmo e com os outros, algo que afeta positivamente sua sensibilidade, seu lado sentimental, carismático e empático. Por isso, é importante aproveitar para fortalecer seus relacionamentos e demais vínculos sadios de alma.")
                              ) : key === 'fisico' ? (
                                t("Seu ciclo físico está em recuperação energética. Evite sobrecargas exaustivas musculares, mas aproveite para caminhadas leves contemplativas e alongamentos regulares ao alvorecer.")
                              ) : (
                                t("O discernimento racional e a agilidade de aprendizados gozam de excelente fertilidade. Dobre o foco nos estudos técnicos, leituras complexas e na organização estratégica financeira.")
                              )}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Secondary Cycles Section */}
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-slate-350 tracking-wide font-bold">{t("Ciclos secundários")}</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase">{t("Esferas Sutis")}</span>
              </div>
              <p className="text-[10px] text-slate-505 leading-relaxed">
                {t("Ciclos de relevância menor, mas igualmente interessantes.")}
              </p>

              <div className="space-y-2">
                {['espiritual', 'perceptivo', 'intuitivo', 'estetico'].map((key) => {
                  const details = CYCLES[key as keyof typeof CYCLES];
                  const data = todayMetrics[key];
                  const isOpen = expandedCycle === key;

                  return (
                    <div 
                      key={key} 
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isOpen ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-950/40 border-slate-900/60 hover:bg-slate-950/60'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedCycle(isOpen ? null : key)}
                        className="w-full p-2.5 flex justify-between items-center text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {key === 'espiritual' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                          {key === 'perceptivo' && <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                          {key === 'intuitivo' && <Compass className="w-3.5 h-3.5 text-amber-400" />}
                          {key === 'estetico' && <Palette className="w-3.5 h-3.5 text-pink-400" />}
                          
                          <span className="text-xs text-slate-300">{t(details.name)}</span>
                        </div>

                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          {data.isCritical ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-red-950/45 border border-red-500/20 text-red-400 rounded">
                              {t("Crítico!")}
                            </span>
                          ) : (
                            <span className={`font-semibold ${data.value >= 0 ? 'text-emerald-400/90' : 'text-slate-450'}`}>
                              {data.value > 0 ? `+${data.value}` : data.value}%
                            </span>
                          )}

                          {isOpen ? <ChevronUp className="w-3 h-3 text-slate-600" /> : <ChevronDown className="w-3 h-3 text-slate-600" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-3 pb-3 pt-0.5 text-[10.5px] text-slate-350 space-y-1.5 border-t border-slate-900"
                          >
                            <span className="text-[9.5px] font-mono text-indigo-400 block uppercase font-semibold">
                              {data.isUp ? t('Tendência de alta!') : t('Tendência de baixa')} {data.isCritical && t('• Ponto Crítico')}
                            </span>
                            
                            <p className="leading-relaxed font-sans">
                              {key === 'espiritual' ? (
                                t("Seu lado espiritual está passando por um momento de transição de frequências, sendo este um período curto, mas propício a choques de realidade, questionamentos existenciais ou testes em sua confiança interna. Mantenha-se alinhada à sua fé e confie na ordem universal, escutando sempre seu coração ao tomar decisões sadios.")
                              ) : key === 'perceptivo' ? (
                                t("Sintonias sensoriais estão calibradas. Excelente momento para contemplar a natureza selvagem, perceber detalhes estéticos ocultos no trabalho ou exercitar o corpo físico de carne.")
                              ) : key === 'intuitivo' ? (
                                t("Intuição em altíssima fluência de luz. Confie em seus palpites viscerais repentinos e evite se sobrecarregar de lógicas burocráticas pesadas.")
                              ) : (
                                t("Estética refinada e criatividade pujante. Ideal para decorar cômodos do lar, desenhar novas frentes, comprar peças de vestuário e apreciar boa música.")
                              )}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
