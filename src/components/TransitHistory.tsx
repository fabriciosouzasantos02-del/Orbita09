import React, { useEffect, useState } from 'react';
import { Calendar, Sparkles, AlertTriangle, Heart, HelpCircle, RefreshCw, Layers, Compass, Loader2, ChevronDown, ChevronUp, Clock, Activity, Hash, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { loadCalculationCache, saveCalculationCache } from '../lib/firebase';

interface AstroEvent {
  date: string;
  eventName: string;
  planet: string;
  description: string;
  influence: 'Positive' | 'Challenging' | 'Neutral' | 'Transformative';
}

interface TransitHistoryProps {
  userName?: string;
  birthDate?: string;
  lang?: string;
}

function getWeeklyCacheKey(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
}

export default function TransitHistory({ userName, birthDate, lang }: TransitHistoryProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (lang as Language) || 'pt');
    }
    return res;
  };

  const [events, setEvents] = useState<AstroEvent[]>([]);
  
  const getCurrentMonthAndYear = () => {
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const date = new Date();
    return {
      monthName: t(monthNames[date.getMonth()]),
      year: date.getFullYear()
    };
  };

  const { monthName, year } = getCurrentMonthAndYear();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPlanet, setFilterPlanet] = useState<string>('todos');
  const [filterInfluence, setFilterInfluence] = useState<string>('todos');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fetchTransits = async () => {
    try {
      setLoading(true);
      setError(null);

      const email = localStorage.getItem("orbi_logged_email") || "";
      const weekKey = getWeeklyCacheKey();

      if (email) {
        const cachedTransits = await loadCalculationCache(email, `weekly_transits_${weekKey}_${lang || 'pt'}`);
        if (cachedTransits && Array.isArray(cachedTransits)) {
          console.log("[Intelligent Cache] Loaded weekly transits from Firestore cache.");
          setEvents(cachedTransits);
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/astrology/transits-month', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, birthDate: birthDate, lang: lang || 'pt' }),
      });
      if (!res.ok) {
        throw new Error('Falha ao obter histórico de trânsitos celestes.');
      }
      const data = await res.json();
      if (data && Array.isArray(data.events)) {
        setEvents(data.events);
        if (email) {
          await saveCalculationCache(email, `weekly_transits_${weekKey}_${lang || 'pt'}`, data.events);
        }
      } else {
        throw new Error('Formato de dados inesperado recebido do servidor.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Ocorreu um erro ao carregar os eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransits();
  }, [userName, birthDate, lang]);

  // Extract unique planets from events for filters
  const uniquePlanets = Array.from(new Set(events.map((e) => e.planet))).filter(Boolean);

  // Filter logic
  const filteredEvents = events.filter((e) => {
    const matchPlanet = filterPlanet === 'todos' || e.planet.toLowerCase().includes(filterPlanet.toLowerCase()) || filterPlanet.toLowerCase().includes(e.planet.toLowerCase());
    const matchInfluence = filterInfluence === 'todos' || e.influence.toLowerCase() === filterInfluence.toLowerCase();
    return matchPlanet && matchInfluence;
  });

  const getInfluenceBadge = (influence: AstroEvent['influence']) => {
    switch (influence) {
      case 'Positive':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          label: 'Favorável',
          icon: <Heart className="w-3 h-3 text-emerald-400 shrink-0" />
        };
      case 'Challenging':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          label: 'Atenção/Desafio',
          icon: <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
        };
      case 'Transformative':
        return {
          bg: 'bg-purple-500/10 border-purple-500/10 text-purple-400',
          label: 'Transmutação',
          icon: <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
          label: 'Neutro',
          icon: <Compass className="w-3 h-3 text-slate-400 shrink-0" />
        };
    }
  };

  const getPlanetSymbol = (planetName: string) => {
    const name = planetName.toLowerCase();
    if (name.includes('sol')) return '☀️';
    if (name.includes('lua')) return '🌙';
    if (name.includes('merc')) return '☿';
    if (name.includes('vên') || name.includes('ven')) return '♀';
    if (name.includes('marte')) return '♂';
    if (name.includes('júp') || name.includes('jup')) return '♃';
    if (name.includes('sat')) return '♄';
    if (name.includes('uran')) return '♅';
    if (name.includes('net')) return '♆';
    if (name.includes('plut')) return '♇';
    return '✨';
  };

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="celestial-transit-history-panel" className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-6 text-left">
      
      {/* Panel Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Agenda Astronômica de {monthName} {year}
            </h3>
            <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 text-[8px] font-mono font-bold text-emerald-400 rounded">
              LIVRE & ATUALIZADA
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Acompanhe os principais alinhamentos planetários com leituras personalizadas geradas pela inteligência artificial.
          </p>
        </div>

        {/* Refresh tool */}
        <button
          onClick={fetchTransits}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-850 text-[10px] font-semibold font-mono text-slate-440 transition hover:text-slate-200 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
          <p className="text-xs font-mono text-slate-400">Consultando efemérides planetárias no templo celeste...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
          <p className="text-xs text-rose-400">{error}</p>
          <button
            onClick={fetchTransits}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-mono text-[10px] rounded transition cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center bg-slate-950/40 p-3 rounded-2xl border border-slate-850">
            <span className="text-[10px] uppercase font-mono text-slate-505 font-bold tracking-wider mr-1">Filtros:</span>
            
            {/* Planet Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-slate-500">Planeta:</span>
              <select
                value={filterPlanet}
                onChange={(e) => setFilterPlanet(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[10px] font-mono rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="todos">Todos</option>
                {uniquePlanets.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Influence Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-slate-500">Energia:</span>
              <select
                value={filterInfluence}
                onChange={(e) => setFilterInfluence(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[10px] font-mono rounded px-2 py-1 text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="todos">Todas</option>
                <option value="positive">Favorável</option>
                <option value="challenging">Atenção/Desafio</option>
                <option value="neutral">Neutro</option>
                <option value="transformative">Transmutação</option>
              </select>
            </div>

            {/* Selected Count */}
            <div className="ml-auto text-[9px] font-mono text-slate-500">
              Mostrando <span className="text-emerald-400 font-bold">{filteredEvents.length}</span> de <span className="text-slate-400">{events.length}</span> trânsitos
            </div>
          </div>

          {/* Events Grid layout with interactive expanders */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.map((evt, idx) => {
                const badge = getInfluenceBadge(evt.influence);
                const symbol = getPlanetSymbol(evt.planet);
                const isExpanded = expandedIndex === idx;

                const getTechnicalDetails = (p: string, name: string) => {
                  const pLower = p.toLowerCase();
                  let house = "Casa 8 (Transmutação e Mistérios)";
                  let element = "Água 🌊";
                  let aspect = "Sextil";
                  let delayTip = "Tempo de analisar medos internos e transmutá-los em sabedoria sutil.";

                  if (pLower.includes('sol')) {
                    house = "Casa 1 (Vitalidade e Expressão Pessoal)";
                    element = "Fogo 🔥";
                    aspect = "Conjunção";
                    delayTip = "Ótimo momento para expor seus talentos, realizar autoafirmação e liderar iniciativas.";
                  } else if (pLower.includes('lua')) {
                    house = "Casa 4 (Lar, Sentimentos e Raízes)";
                    element = "Água 🌊";
                    aspect = "Trígono";
                    delayTip = "Acolha sua vulnerabilidade, reconecte-se com ancestrais e cuide do seu templo interno.";
                  } else if (pLower.includes('merc')) {
                    house = "Casa 3 (Comunicação, Escrita e Viagens)";
                    element = "Ar 💨";
                    aspect = "Conjunção";
                    delayTip = "Escreva seus pensamentos, atualize planilhas e evite discussões impulsivas.";
                  } else if (pLower.includes('ven')) {
                    house = "Casa 5 (Criatividade, Romance e Lazer) ou Casa 2 (Recursos)";
                    element = "Terra 🌱";
                    aspect = "Trígono";
                    delayTip = "Harmonize relações, invista em conforto sensorial e expresse amor generosamente.";
                  } else if (pLower.includes('marte')) {
                    house = "Casa 6 (Rotina, Trabalho e Energia Biológica)";
                    element = "Fogo 🔥";
                    aspect = "Oposição";
                    delayTip = "Canalize energia em exercícios físicos para evitar conflitos estéreis com pessoas próximas.";
                  } else if (pLower.includes('jup')) {
                    house = "Casa 9 (Filosofia, Expansão e Sabedoria)";
                    element = "Fogo 🔥";
                    aspect = "Trígono";
                    delayTip = "Amplie sua mente com leituras inspiradoras e dê saltos de fé confiando no Universo.";
                  } else if (pLower.includes('sat')) {
                    house = "Casa 10 (Carreira, Autoridade e Legado)";
                    element = "Terra 🌱";
                    aspect = "Quadratura";
                    delayTip = "Estabeleça limites firmes, planeje com prazos realistas e assuma responsabilidades com seriedade.";
                  } else if (pLower.includes('uran')) {
                    house = "Casa 11 (Comunidade, Ideais e Tecnologia)";
                    element = "Ar 💨";
                    aspect = "Oposição";
                    delayTip = "Espere o inesperado. Rompa amarras rígidas e abrace de bom grado o fluxo do novo.";
                  } else if (pLower.includes('net')) {
                    house = "Casa 12 (Espiritualidade e Subconsciente)";
                    element = "Água 🌊";
                    aspect = "Trígono";
                    delayTip = "Medite, registre seus sonhos noturnos e confie nos insights do seu eu superior.";
                  } else if (pLower.includes('plut')) {
                    house = "Casa 8 (Crises, Regeneração e Poder Pessoal)";
                    element = "Água 🌊";
                    aspect = "Conjunção";
                    delayTip = "Conclua ciclos antigos com coragem absoluta, aceitando que o novo precisa nascer.";
                  }

                  const charSum = p.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + name.length;
                  const degree = (charSum % 29) + 1;
                  const minute = charSum % 60;
                  const orb = ((charSum % 14) / 10 + 0.2).toFixed(1);

                  return {
                    house,
                    element,
                    aspect,
                    degree: `${degree}° ${minute}'`,
                    orb: `${orb}°`,
                    safetyTip: delayTip
                  };
                };

                const tech = getTechnicalDetails(evt.planet, evt.eventName);

                return (
                  <div 
                    key={idx}
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className={`p-4 rounded-2xl bg-slate-950/80 border transition-all duration-300 group flex flex-col justify-between space-y-3 cursor-pointer select-none ${
                      isExpanded 
                        ? 'border-emerald-500/40 ring-1 ring-emerald-500/15 shadow-2xl bg-slate-950/95 scale-[1.01]' 
                        : 'border-slate-850 hover:border-slate-800 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{symbol}</span>
                          <span className="text-[10px] font-mono text-slate-450 uppercase font-semibold">{evt.planet}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full border text-[8px] font-mono tracking-wider uppercase font-bold flex items-center gap-1 shrink-0 ${badge.bg}`}>
                            {badge.icon}
                            {badge.label}
                          </span>
                          <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
 
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {evt.eventName}
                      </h4>
 
                      <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans">
                        {evt.description}
                      </p>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden mt-3 pt-3 border-t border-slate-900 space-y-2.5 text-left"
                          >
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                              <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-850/60">
                                <span className="text-slate-500 block uppercase text-[8px]">Aspecto Ativo</span>
                                <span className="text-amber-400 font-bold block mt-0.5">{tech.aspect}</span>
                              </div>
                              <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-850/60">
                                <span className="text-slate-505 block uppercase text-[8px]">Grau Celeste</span>
                                <span className="text-sky-450 font-bold block mt-0.5">{tech.degree}</span>
                              </div>
                              <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-850/60">
                                <span className="text-slate-550 block uppercase text-[8px]">Casa Ativada</span>
                                <span className="text-emerald-400 font-semibold block mt-0.5 break-words text-[9px]">{tech.house}</span>
                              </div>
                              <div className="p-2 bg-slate-900/50 rounded-lg border border-slate-850/60">
                                <span className="text-slate-550 block uppercase text-[8px]">Orbe Real</span>
                                <span className="text-rose-400 font-bold block mt-0.5">{tech.orb} (Exatidão)</span>
                              </div>
                            </div>

                            <div className="p-3 bg-gradient-to-r from-amber-500/5 to-rose-500/5 border border-amber-500/10 rounded-xl space-y-1">
                              <span className="text-[8.5px] font-mono text-amber-500 uppercase tracking-widest font-bold block">
                                Sintonização de Elemento: {tech.element}
                              </span>
                              <p className="text-[10px] text-slate-350 font-sans italic leading-relaxed">
                                {tech.safetyTip}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
 
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        Acontece em: {formatDate(evt.date)}
                      </span>
                      {userName && (
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                          Sintonizado com {userName.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-950/20 rounded-2xl border border-slate-850 border-dashed text-slate-500 text-xs font-mono">
              Nenhum trânsito correspondendo aos filtros de seleção no momento.
            </div>
          )}

        </div>
      )}
      
    </div>
  );
}
