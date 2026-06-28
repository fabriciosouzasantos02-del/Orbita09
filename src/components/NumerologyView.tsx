import React, { useState, useMemo, memo } from 'react';
import { translateUiText, Language } from '../lib/translations';
import { useIdioma } from '../context/IdiomaContext';
import { NumerologyCycle } from '../types';
import { 
  numerologyInterpretationsMultilang, 
  uiTranslationsMultilang 
} from './numerologyTranslations';
import { 
  Sparkles, 
  BookOpen, 
  Activity, 
  Calendar, 
  Compass, 
  ChevronRight, 
  Gem, 
  AlertTriangle, 
  Heart, 
  Quote, 
  Lock, 
  CheckCircle2, 
  Lightbulb
} from 'lucide-react';

interface NumerologyViewProps {
  numerology: NumerologyCycle;
  user: {
    name: string;
    birthDate: string;
    [key: string]: any;
  };
  lang?: string;
}

const NumerologyView = memo(function NumerologyView({ numerology, user, lang }: NumerologyViewProps) {
  const { idioma } = useIdioma();
  const idiomaAtual = (idioma as Language) || 'pt';

  const t = (text: string) => {
    if (!text) return "";
    const translations = uiTranslationsMultilang[idiomaAtual] || uiTranslationsMultilang['pt'];
    return translations[text] || text;
  };

  const userName = user.name;
  const userBirthDate = user.birthDate || "1990-01-01";

  // Safe validation & parsing helper using localized interpretations
  const getSafeNum = (val: any): number => {
    const num = Number(val);
    const activeInterpretations = numerologyInterpretationsMultilang[idiomaAtual] || numerologyInterpretationsMultilang['pt'];
    if (!isNaN(num) && (num in activeInterpretations)) return num;
    try {
      let test = parseInt(String(val).replace(/\D/g, ''));
      if (test > 9 && test !== 11 && test !== 22) {
        test = test.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
      }
      if (test in activeInterpretations) return test;
    } catch {}
    return 7; // Universal standard placeholder
  };

  const cVidaNum = useMemo(() => getSafeNum(numerology.caminhoDeVida), [numerology.caminhoDeVida, idiomaAtual]);
  const expressaoNum = useMemo(() => getSafeNum(numerology.expressao), [numerology.expressao, idiomaAtual]);
  const motivacaoNum = useMemo(() => getSafeNum(numerology.motivacao), [numerology.motivacao, idiomaAtual]);
  const personalidadeNum = useMemo(() => getSafeNum(numerology.personalidade), [numerology.personalidade, idiomaAtual]);

  // States
  const [selectedAspect, setSelectedAspect] = useState<'cVida' | 'expressao' | 'motivacao' | 'personalidade' | 'ciclos'>('cVida');
  const [simulationStep, setSimulationStep] = useState<number | null>(null);
  const [simHistory, setSimHistory] = useState<string[]>([]);
  const [schumannResult, setSchumannResult] = useState<{
    frequency: number;
    coherence: number;
    alignment: string;
    diagnosis: string;
    harmonic: string;
    description: string;
  } | null>(null);

  // Active aspect metadata
  const activeAspectData = useMemo(() => {
    switch (selectedAspect) {
      case 'cVida':
        return {
          title: t("Caminho de Vida (Destino)"),
          num: cVidaNum,
          desc: t("Representa a lição principal da sua encarnação, os rumos que o destino vai inevitavelmente colocar em sua jornada para forçar seu aprendizado essencial humano."),
          icon: Compass,
          colorClass: "border-amber-500/40 text-amber-500 bg-amber-500/10",
          themeColor: "amber"
        };
      case 'expressao':
        return {
          title: t("Expressão (Talentos Inatos)"),
          num: expressaoNum,
          desc: t("O conjunto de competências espirituais e técnicas naturais que você já trouxe consigo. É a sua forma automática de reagir ao mundo e criar canais de prosperidade intelectual."),
          icon: Sparkles,
          colorClass: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
          themeColor: "cyan"
        };
      case 'motivacao':
        return {
          title: t("Motivação (Anseio da Alma)"),
          num: motivacaoNum,
          desc: t("Contorna as suas motivações subjacentes mais intocáveis. É o seu combustível espiritual silencioso: o que você verdadeiramente deseja realizar no plano afetivo e existencial profundo."),
          icon: BookOpen,
          colorClass: "border-rose-500/40 text-rose-400 bg-rose-500/10",
          themeColor: "rose"
        };
      case 'personalidade':
        return {
          title: t("Personalidade (Imagem Social)"),
          num: personalidadeNum,
          desc: t("O avatar social, o filtro ou máscara positiva de entrada que as pessoas notam em você no primeiro contato profissional e civil antes de acessarem as esferas mais secretas da sua alma."),
          icon: Activity,
          colorClass: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
          themeColor: "emerald"
        };
      default:
        return {
          title: t("Grandes Ciclos de Evolução"),
          num: cVidaNum,
          desc: t("As grandes etapas da sua cronologia terrena divididas sob o relógio oculto das três grandes fases energéticas."),
          icon: Calendar,
          colorClass: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
          themeColor: "indigo"
        };
    }
  }, [selectedAspect, cVidaNum, expressaoNum, motivacaoNum, personalidadeNum, idiomaAtual]);

  // Create highly dynamic, personalized explanations
  const selectedInterpret = useMemo(() => {
    const activeInterpretations = numerologyInterpretationsMultilang[idiomaAtual] || numerologyInterpretationsMultilang['pt'];
    const base = activeInterpretations[activeAspectData.num];
    if (!base) return null;
    
    const firstName = userName.split(' ')[0] || "Buscador";
    const formattedBirthDate = userBirthDate.split('-').reverse().join('/');
    
    const especialAnalisado = t("Especialmente analisado para você, {firstName}, nascido(a) em {formattedBirthDate}, esta vibração atua como uma âncora energética fundamental na sua estrutura inconsciente.");
    const cenarioVida = t("No seu cenário de vida atual, sua assinatura vibracional indica que você canaliza de forma otimizada esta força de expressão nos seus rumos evolucionários.");
    const emSeuNome = t("Em seu nome de nascença, \"{userName}\", os talentos espirituais de vibração {aspectNum} refletem-se em {talents}. Isto capacita você, {firstName}, a agir com maestria de propósitos e inteligência nas suas escolhas existenciais.");
    const comoArquetipo = t("Como arquétipo ativo no seu biocampo pessoal, o seu principal desafio de transformação reside em transcender e evitar o apego a {challenges}. Sob as energias do seu momento evolutivo, atente para estas tendências para obter o seu equilíbrio evolutivo.");
    const nasAfinidades = t("Nas afinidades afetivas e amorosas de {firstName}, a vibração {aspectNum} aponta que {love}. O diálogo harmônico e a preservação de sua autonomia individual geram as melhores conexões de alma.");

    const generalText = `${especialAnalisado.replace("{firstName}", firstName).replace("{formattedBirthDate}", formattedBirthDate)} ${base.general} ${cenarioVida}`;
    const talentsText = emSeuNome
      .replace("{userName}", userName)
      .replace("{aspectNum}", activeAspectData.num.toString())
      .replace("{talents}", base.talents.toLowerCase())
      .replace("{firstName}", firstName);
    const challengesText = comoArquetipo.replace("{challenges}", base.challenges.toLowerCase());
    const loveText = nasAfinidades
      .replace("{firstName}", firstName)
      .replace("{aspectNum}", activeAspectData.num.toString())
      .replace("{love}", base.love.substring(0, 1).toLowerCase() + base.love.substring(1));

    return {
      ...base,
      general: generalText,
      talents: talentsText,
      challenges: challengesText,
      love: loveText,
    };
  }, [activeAspectData.num, userName, userBirthDate, idiomaAtual]);

  // Real, personalized Schumann Resonance calculations based on Name + Birth Date
  const calculateSchumann = () => {
    const nameSum = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dateDigits = userBirthDate.replace(/\D/g, '').split('').map(Number);
    const dateSum = dateDigits.reduce((acc, d) => acc + d, 0);

    const freqOffset = ((nameSum + dateSum) % 113) / 100;
    const personalFreq = parseFloat((7.83 + freqOffset).toFixed(2));

    const coherence = 85 + ((nameSum * dateSum) % 15);

    let alignment = t("Ondas Alfa (Inovação, Calmaria e Absorção Intelectiva)");
    if (personalFreq < 8.2) {
      alignment = t("Ondas Alfa-Teta (Forte Conexão Intuitiva, Regeneração Orgânica)");
    } else if (personalFreq >= 8.5) {
      alignment = t("Ondas Alfa-Beta (Foco Ativo, Clareza de Propósitos, Praticidade)");
    }

    const harmonic = `${(personalFreq / 7.83).toFixed(2)}x (Multiplicador de Fase)`;
    const firstName = userName.split(' ')[0] || "Buscador";

    const diagnosis = `${t("Após analisar a assinatura de nascença registrada de")} ${userName}, ${t("o portal quântico correlacionou as forças vibracionais de seu Caminho de Vida")} (${cVidaNum}) ${t("e sua Expressão")} (${expressaoNum}) ${t("com os campos eletromagnéticos ionosféricos terrestres. O alinhamento com seu biocampo atingiu uma Coerência de Fase de incomparáveis")} ${coherence}${t("%, oscilando na banda de")} ${personalFreq} ${t("Hz. Para você,")} ${firstName}, ${t("esta ressonância exata atua de forma direta ativando as qualidades do arquétipo de vibração")} ${activeAspectData.num}, ${t("ampliando sua clareza de mente.")}`;

    const description = `${t("Sua vibração principal")} (${activeAspectData.num}) ${t("flui idealmente em canais harmônicos que encontram estabilidade nas pulsações geomagnéticas de")} ${personalFreq} ${t("Hz. Sintonizar-se com frequências solfeggio correlatadas ampliará consideravelmente sua resiliência mental e foco nas próximas 48 horas.")}`;

    return {
      frequency: personalFreq,
      coherence,
      alignment,
      diagnosis,
      harmonic,
      description
    };
  };

  const runVibrationalCheck = () => {
    setSchumannResult(null);
    const list = [
      t("Iniciando varredura espectral do biocampo vibracional..."),
      `${t("Sincronizando coordenadas planetárias sob a data de nascimento")} (${userBirthDate.split('-').reverse().join('/')})...`,
      `${t("Decodificando ondas cerebrais de")} ${userName.split(' ')[0]} ${t("com o pulso geomagnético terrestre...")}`,
      t("Sintonia quântica concluída com sucesso! Gerando diagnóstico personalizado real...")
    ];
    
    setSimulationStep(0);
    setSimHistory([]);
    let current = 0;
    
    const interval = setInterval(() => {
      setSimHistory(prev => [...prev, list[current]]);
      setSimulationStep(current + 1);
      current++;
      if (current >= list.length) {
        clearInterval(interval);
        const result = calculateSchumann();
        setSchumannResult(result);
      }
    }, 800);
  };

  const activeInterpretations = numerologyInterpretationsMultilang[idiomaAtual] || numerologyInterpretationsMultilang['pt'];

  return (
    <div id="numerology-module" className="space-y-6">
      {/* 1. Header Premium Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="relative text-left">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono font-semibold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 animate-pulse">
              {t("Módulo Pro Premium Ativo")}
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono tracking-wider text-teal-400 bg-teal-500/10 border border-teal-500/20">
              {t("Análise Vibracional Completa")}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-100 mt-2 flex items-center gap-2">
            <Gem className="w-6 h-6 text-amber-400" />
            {t("Análise Numerológica Vibracional")}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
            {t("Seu projeto quântico decodificado. O nome e a data de nascimento funcionam como uma assinatura de frequências eternas. Explore as 5 principais camadas do seu mapa numerológico cabalístico.")}
          </p>
        </div>
      </div>

      {/* 2. Interactive Navigation Panels */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Caminho de vida */}
        <button 
          id="tab-caminho-vida"
          onClick={() => { setSelectedAspect('cVida'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'cVida' 
              ? 'bg-slate-900/90 border-amber-500 shadow-lg shadow-amber-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'cVida' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          )}
          <Compass className={`w-5 h-5 mb-2 ${selectedAspect === 'cVida' ? 'text-amber-500' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">{t("Caminho de Vida")}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{cVidaNum}</span>
            <span className="text-[10px] text-amber-500/70 font-sans font-medium truncate">
              {activeInterpretations[cVidaNum]?.archetype.split(' e ')[0] || activeInterpretations[cVidaNum]?.archetype.split(' and ')[0] || ""}
            </span>
          </div>
        </button>

        {/* Expressão */}
        <button 
          id="tab-expressao"
          onClick={() => { setSelectedAspect('expressao'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'expressao' 
              ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'expressao' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          )}
          <Sparkles className={`w-5 h-5 mb-2 ${selectedAspect === 'expressao' ? 'text-cyan-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">{t("Expressão")}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{expressaoNum}</span>
            <span className="text-[10px] text-cyan-400/70 font-sans font-medium truncate">
              {activeInterpretations[expressaoNum]?.archetype.split(' e ')[0] || activeInterpretations[expressaoNum]?.archetype.split(' and ')[0] || ""}
            </span>
          </div>
        </button>

        {/* Motivação */}
        <button 
          id="tab-motivacao"
          onClick={() => { setSelectedAspect('motivacao'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'motivacao' 
              ? 'bg-slate-900/90 border-rose-500 shadow-lg shadow-rose-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'motivacao' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          )}
          <BookOpen className={`w-5 h-5 mb-2 ${selectedAspect === 'motivacao' ? 'text-rose-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">{t("Motivação")}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{motivacaoNum}</span>
            <span className="text-[10px] text-rose-400/70 font-sans font-medium truncate">
              {activeInterpretations[motivacaoNum]?.archetype.split(' e ')[0] || activeInterpretations[motivacaoNum]?.archetype.split(' and ')[0] || ""}
            </span>
          </div>
        </button>

        {/* Personalidade */}
        <button 
          id="tab-personalidade"
          onClick={() => { setSelectedAspect('personalidade'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all relative ${
            selectedAspect === 'personalidade' 
              ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'personalidade' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          )}
          <Activity className={`w-5 h-5 mb-2 ${selectedAspect === 'personalidade' ? 'text-emerald-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">{t("Personalidade")}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">{personalidadeNum}</span>
            <span className="text-[10px] text-emerald-400/70 font-sans font-medium truncate">
              {activeInterpretations[personalidadeNum]?.archetype.split(' e ')[0] || activeInterpretations[personalidadeNum]?.archetype.split(' and ')[0] || ""}
            </span>
          </div>
        </button>

        {/* Grandes Ciclos */}
        <button 
          id="tab-ciclos"
          onClick={() => { setSelectedAspect('ciclos'); setSimulationStep(null); }}
          className={`p-4 rounded-2xl border text-left transition-all col-span-2 md:col-span-1 relative ${
            selectedAspect === 'ciclos' 
              ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/5 scale-[1.02]' 
              : 'bg-slate-950/60 border-slate-900 hover:border-slate-800'
          }`}
        >
          {selectedAspect === 'ciclos' && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          )}
          <Calendar className={`w-5 h-5 mb-2 ${selectedAspect === 'ciclos' ? 'text-indigo-400' : 'text-slate-500'}`} />
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">{t("Ciclos de Vida")}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-200">3</span>
            <span className="text-[10px] text-indigo-400/70 font-sans font-medium truncate">{t("Grandes Eras")}</span>
          </div>
        </button>
      </div>

      {/* 3. Detailed Display Box */}
      {selectedAspect !== 'ciclos' && selectedInterpret ? (
        <div id="aspect-analysis-panel" className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 text-left animate-in fade-in duration-300 relative">
          
          <div className="pb-4 border-b border-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-lg border ${activeAspectData.colorClass}`}>
                  {React.createElement(activeAspectData.icon, { className: "w-4 h-4" })}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{activeAspectData.title}</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-100 mt-1 flex items-center gap-2">
                {t("Vibração")} {activeAspectData.num} - {selectedInterpret.name}
              </h2>
              <p className="text-[11px] text-slate-400 max-w-2xl mt-0.5">
                {activeAspectData.desc}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-850">
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">{t("Arquétipo Vibracional")}</span>
                <span className="text-xs font-semibold text-amber-500 mt-0.5 block">{selectedInterpret.archetype}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-amber-500/10 to-amber-600/20 border border-amber-500/30 flex items-center justify-center font-mono text-lg font-black text-amber-400">
                {activeAspectData.num}
              </div>
            </div>
          </div>

          {/* Bento layout for interpretation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* General Overview & Mantra (Left column) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  {t("Essência Vibracional Cabalística")}
                </h3>
                <p className="text-slate-300 text-[12px] leading-relaxed">
                  {selectedInterpret.general}
                </p>
              </div>

              {/* Mantra Quote */}
              <div className="bg-slate-900 border border-slate-850/50 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute -bottom-1 right-2 opacity-[0.04]">
                  <Quote className="w-32 h-32 text-white" />
                </div>
                <div className="relative">
                  <span className="text-[9px] font-mono uppercase text-slate-500 block mb-1">{t("Mantra / Afirmação de Poder")}</span>
                  <p className="text-md font-sans italic text-slate-200 tracking-tight leading-relaxed">
                    "{selectedInterpret.motto}"
                  </p>
                </div>
              </div>

              {/* Action Simulation Widget */}
              <div className="bg-linear-to-br from-slate-950/90 to-slate-900 p-5 rounded-2xl border border-amber-500/10 space-y-3 text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-300">{t("Ressonância Quântica de")} {userName}</h4>
                  <p className="text-[10px] text-slate-500">
                    {t("Avalie o acoplamento do seu biocampo com a Frequência de Schumann terrestre neste momento preciso.")}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={runVibrationalCheck}
                    disabled={simulationStep !== null && simulationStep < 4}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-[11px] font-semibold transition-all inline-flex items-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer animate-in fade-in"
                  >
                    {simulationStep !== null && simulationStep < 4 ? t("Sintonizando...") : t("Calcular Sintonia Schumann")}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {simulationStep !== null && (
                  <div className="space-y-3 pt-4 border-t border-slate-850/60 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Activity Feed during simulation */}
                    <div className="space-y-1.5 bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                      {simHistory.map((h, i) => (
                        <p key={i} className="text-[10.5px] font-mono text-slate-300 flex items-start gap-1.5 leading-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </p>
                      ))}
                      {simulationStep < 4 && (
                        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-mono mt-1.5 animate-pulse">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          <span>{t("Harmonizando canais geomagnéticos...")}</span>
                        </div>
                      )}
                    </div>

                    {/* Highly Polished Custom Results card */}
                    {simulationStep >= 4 && schumannResult && (
                      <div className="bg-slate-950 p-4.5 rounded-2xl border border-amber-500/20 space-y-4 shadow-inner mt-2 animate-in zoom-in-95 duration-300 text-left">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="text-[11px] font-bold text-slate-200">{t("RELATÓRIO QUÂNTICO REAL")}</span>
                          </div>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold uppercase tracking-wide">
                            {t("CONECTADO")}
                          </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">{t("Frequência Schumann Pessoal")}</span>
                            <span className="text-sm font-black font-mono text-amber-400 mt-0.5 block">{schumannResult.frequency} Hz</span>
                          </div>
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">{t("Coerência de Fase")}</span>
                            <span className="text-sm font-black font-mono text-emerald-400 mt-0.5 block">{schumannResult.coherence}%</span>
                          </div>
                          <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 col-span-2">
                            <span className="text-[9px] text-slate-500 block uppercase font-mono">{t("Alinhamento Cerebral Estimado")}</span>
                            <span className="text-[11px] font-semibold text-slate-200 mt-0.5 block">{schumannResult.alignment}</span>
                          </div>
                        </div>

                        {/* Visual Coherence Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-slate-400">
                            <span>{t("COERÊNCIA GEO-ELÉTRICA")}</span>
                            <span>{schumannResult.coherence}% / 100%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-1000" 
                              style={{ width: `${schumannResult.coherence}%` }} 
                            />
                          </div>
                        </div>

                        {/* Detailed Diagnostic Text */}
                        <div className="text-[11.5px] text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-850/45 border-dashed">
                          <p>{schumannResult.diagnosis}</p>
                          <p className="mt-2 text-slate-400 text-[10.5px] italic border-t border-slate-900 pt-1.5">{schumannResult.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Talents, Challenges, Love (Right column) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Talents Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-2">
                <span className="text-[9px] uppercase font-mono tracking-widest text-cyan-400 block">{t("Talentos & Vocação Cósmica")}</span>
                <p className="text-[12px] text-slate-300 leading-relaxed">
                  {selectedInterpret.talents}
                </p>
              </div>

              {/* Shadow Box */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500 block">{t("Desafios & Sombra Pragmática")}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {selectedInterpret.challenges}
                </p>
              </div>

              {/* Love Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-[9px] uppercase font-mono tracking-widest text-rose-400 block">{t("No Amor e Afinidades")}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {selectedInterpret.love}
                </p>
              </div>

              {/* Technical indicators */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">{t("Fogo da Vibração")}</span>
                  <span className="text-slate-300 font-medium">{t(selectedInterpret.element)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[9px] uppercase">{t("Frequências Amigas")}</span>
                  <span className="text-amber-500 font-mono font-bold">{selectedInterpret.harmonicNumbers.join(' • ')}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Fallback General Advice and cabalistic synthesis */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-slate-400 leading-relaxed">
            <strong>{t("Conselho Cabalístico Geral:")}</strong> {t("Ative a vibração mestra")} {cVidaNum} {t("no seu dia a dia cooperando de forma integral, mas exercendo sua independência no momento das escolhas éticas. A combinação entre sua Expressão")} {expressaoNum} {t("e seu Caminho")} {cVidaNum} {t("sugere uma vida altamente estruturada que alcançará pleno amadurecimento após os 28 anos.")}
          </div>

        </div>
      ) : selectedAspect === 'ciclos' ? (
        <div id="cycles-analysis-panel" className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 text-left animate-in fade-in duration-300">
          
          <div className="pb-4 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg border border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">{t("Grandes Ciclos de Evolução")}</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 mt-1 text-left">
              {t("Guia de Transição Chronos")}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t("A numerologia divide sua passagem na terra em três grandes fases temporais, cada qual regida por um tom harmônico de evolução.")}
            </p>
          </div>

          {/* Interactive Timeline layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Step-by-step Timeline cards */}
            <div className="lg:col-span-7 space-y-4">
              {numerology.ciclos && numerology.ciclos.length > 0 ? (
                numerology.ciclos.map((cicloStr, index) => {
                  const parts = cicloStr.split(':');
                  let title = parts[0]?.trim() || `Ciclo ${index + 1}`;
                  const description = parts.slice(1).join(':').trim();

                  if (title.startsWith("Ciclo Formativo")) {
                    title = t("Ciclo Formativo (0-28 anos)");
                  } else if (title.startsWith("Ciclo Produtivo")) {
                    title = t("Ciclo Produtivo (28-56 anos)");
                  } else if (title.startsWith("Ciclo de Colheita")) {
                    title = t("Ciclo de Colheita (56+ anos)");
                  }
                  
                  const match = description.match(/Vibração\s+(\d+)/i) || description.match(/Vibration\s+(\d+)/i) || description.match(/Schwingung\s+(\d+)/i);
                  const cycleNum = match ? parseInt(match[1]) : null;
                  const cycleInterpret = cycleNum ? activeInterpretations[cycleNum] : null;

                  return (
                    <div 
                      key={index} 
                      className={`p-5 rounded-2xl border transition-all ${
                        index === 1 
                          ? 'bg-slate-950/80 border-indigo-500/30 shadow-md' 
                          : 'bg-slate-900/60 border-slate-850'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{title}</h3>
                          </div>
                          <p className="text-[12px] text-slate-200 leading-relaxed font-sans">
                            {description}
                          </p>
                        </div>

                        {cycleNum && (
                          <div className="shrink-0 w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                            <span className="text-[7px] text-indigo-400 font-mono font-bold leading-none uppercase">{t("Vibra")}</span>
                            <span className="text-base font-black text-slate-200 font-mono leading-none mt-1">{cycleNum}</span>
                          </div>
                        )}
                      </div>

                      {cycleInterpret && (
                        <div className="mt-4 pt-3 border-t border-slate-850/50 grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-400">
                          <div>
                            <span className="font-semibold text-slate-300 block">{t("Foco Vibracional do Ciclo:")}</span>
                            <span className="italic">"{cycleInterpret.motto}"</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-300 block">{t("Instrução Essential:")}</span>
                            <span>{cycleInterpret.general.substring(0, 100)}...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-850 text-center text-slate-500">
                  {t("Sem informações estruturadas de ciclos.")}
                </div>
              )}
            </div>

            {/* Sidebar with Chronological Guidelines */}
            <div className="lg:col-span-5 space-y-5 text-left">
              
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
                <span className="text-[9px] uppercase font-mono tracking-widest text-indigo-400 block">{t("Sintonizando as Transições")}</span>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-200">{t("Qual a importância dos anos de transição?")}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t("As idades de **28 anos** e **56 anos** servem como grandes portais de repactuação kármica. Durante as transições, você pode sentir reorientações vocacionais dramáticas ou súbito interesse em redefinir seus laços familiares e intelectuais.")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-slate-200">{t("Como harmonizar ciclos opostos?")}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t("Se o seu Ciclo Formativo tem uma vibração diferente do seu Ciclo Produtivo, equilibre-as atuando em projetos extras que utilizem suas aptidões adormecidas nos finais de semana ou investindo em educação terapêutica complementar.")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informative advice lock */}
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>{t("Aviso de Consolidação:")}</strong> {t("Seus trânsitos anuais integrados ao Calendário Cabalístico estão sincronizados com sua carta de tarô de trânsito. Consulte o Módulo de Tarô e Trânsitos Planetários para leituras de ciclos anuais completos.")}
                </span>
              </div>

            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
});

export default NumerologyView;
