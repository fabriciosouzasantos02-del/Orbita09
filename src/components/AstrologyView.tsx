import React, { useState, useMemo, memo } from 'react';
import { AstrologyMap, AstroAstroPosition, UserProfile } from '../types';
import CircularChart from './CircularChart';
import { 
  Orbit, 
  Compass, 
  User, 
  Globe, 
  MessageSquare, 
  Plus, 
  Minus,
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Heart, 
  Briefcase, 
  Activity, 
  Users, 
  Sparkles, 
  Calendar,
  ArrowRight,
  Scale
} from 'lucide-react';

interface AstrologyViewProps {
  mapData: AstrologyMap;
  user: UserProfile;
  onUpdateMainMap: (birthDetails: any) => void;
  readOnly?: boolean;
}

interface ExtraMap {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
}

const AstrologyView = memo(function AstrologyView({ mapData, user, onUpdateMainMap, readOnly = false }: AstrologyViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'astros' | 'casas' | 'aspectos' | 'extras'>('geral');
  const [selectedAstro, setSelectedAstro] = useState<AstroAstroPosition | null>(() => mapData?.astros?.[0] || null);
  const [selectedHouse, setSelectedHouse] = useState<number>(1);

  // New States for Resumo/Trânsitos Section
  const [resoTab, setResoTab] = useState<'resumo' | 'transitos'>('resumo');
  const [expandedResoCats, setExpandedResoCats] = useState<Record<string, boolean>>({});
  const [expandedTrans, setExpandedTrans] = useState<Record<number, boolean>>({});

  const solSign = useMemo(() => mapData?.astros?.find(a => a.name === "Sol")?.sign || "Aquário", [mapData]);
  const luaSign = useMemo(() => mapData?.astros?.find(a => a.name === "Lua")?.sign || "Peixes", [mapData]);
  const marteSign = useMemo(() => mapData?.astros?.find(a => a.name === "Marte")?.sign || "Aquário", [mapData]);
  const uranoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Urano")?.sign || "Capricórnio", [mapData]);
  const netunoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Netuno")?.sign || "Capricórnio", [mapData]);
  const plutaoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Plutão")?.sign || "Escorpião", [mapData]);
  const saturnoSign = useMemo(() => mapData?.astros?.find(a => a.name === "Saturno")?.sign || "Peixes", [mapData]);

  // Balança Astrológica dynamic tab and calculations
  const [balancaTab, setBalancaTab] = useState<'signos' | 'casas' | 'planetas'>('signos');

  const balancaData = useMemo(() => {
    // 1. SIGNOS
    const signsList = [
      { name: "Áries", symbol: "♈", element: "Fogo" },
      { name: "Touro", symbol: "♉", element: "Terra" },
      { name: "Gêmeos", symbol: "♊", element: "Ar" },
      { name: "Câncer", symbol: "♋", element: "Água" },
      { name: "Leão", symbol: "♌", element: "Fogo" },
      { name: "Virgem", symbol: "♍", element: "Terra" },
      { name: "Libra", symbol: "♎", element: "Ar" },
      { name: "Escorpião", symbol: "♏", element: "Água" },
      { name: "Sagitário", symbol: "♐", element: "Fogo" },
      { name: "Capricórnio", symbol: "♑", element: "Terra" },
      { name: "Aquário", symbol: "♒", element: "Ar" },
      { name: "Peixes", symbol: "♓", element: "Água" }
    ];

    const signs = signsList.map(s => {
      let force = 10;
      let harmony = 60;
      
      const planetsInSign = mapData?.astros?.filter(a => a.sign === s.name) || [];
      planetsInSign.forEach(p => {
        if (p.name === "Sol" || p.name === "Lua" || p.name === "Ascendente") {
          force += 35;
        } else {
          force += 20;
        }
      });
      
      const planetNamesInSign = planetsInSign.map(p => p.name);
      const aspectsInSign = mapData?.aspects?.filter(asp => 
        planetNamesInSign.includes(asp.planet1) || planetNamesInSign.includes(asp.planet2)
      ) || [];
      
      aspectsInSign.forEach(asp => {
        if (asp.aspectType === "Trígono" || asp.aspectType === "Sextil") {
          harmony += 12;
        } else if (asp.aspectType === "Quadratura" || asp.aspectType === "Oposição") {
          harmony -= 12;
        } else {
          harmony += 5; // Conjunção
        }
      });
      
      return {
        name: s.name,
        symbol: s.symbol,
        subtitle: s.element,
        force: Math.min(100, Math.max(10, force)),
        harmony: Math.min(100, Math.max(10, harmony))
      };
    });

    // 2. CASAS (H1 to H12)
    const houses = (mapData?.houses || []).map(h => {
      let force = 15;
      if ([1, 4, 7, 10].includes(h.number)) force = 40; // Angular
      else if ([2, 5, 8, 11].includes(h.number)) force = 25; // Sucedente
      
      let harmony = 60;
      
      if (h.planet) {
        force += 35;
        const planetAspects = mapData?.aspects?.filter(asp => 
          asp.planet1 === h.planet || asp.planet2 === h.planet
        ) || [];
        planetAspects.forEach(asp => {
          if (asp.aspectType === "Trígono" || asp.aspectType === "Sextil") {
            harmony += 15;
          } else if (asp.aspectType === "Quadratura" || asp.aspectType === "Oposição") {
            harmony -= 15;
          } else {
            harmony += 6;
          }
        });
      }
      
      return {
        name: `Casa ${h.number}`,
        symbol: `H${h.number}`,
        subtitle: h.sign,
        force: Math.min(100, Math.max(10, force)),
        harmony: Math.min(100, Math.max(10, harmony))
      };
    });

    // 3. PLANETAS
    const planetBases: Record<string, { baseForce: number; symbol: string }> = {
      "Sol": { baseForce: 85, symbol: "☉" },
      "Lua": { baseForce: 85, symbol: "☽" },
      "Ascendente": { baseForce: 90, symbol: "Asc" },
      "Mercúrio": { baseForce: 65, symbol: "☿" },
      "Vênus": { baseForce: 70, symbol: "♀" },
      "Marte": { baseForce: 70, symbol: "♂" },
      "Júpiter": { baseForce: 60, symbol: "♃" },
      "Saturno": { baseForce: 55, symbol: "♄" },
      "Urano": { baseForce: 45, symbol: "♅" },
      "Netuno": { baseForce: 45, symbol: "♆" },
      "Plutão": { baseForce: 45, symbol: "♇" },
      "Meio do Céu": { baseForce: 50, symbol: "MC" },
      "Quíron": { baseForce: 40, symbol: "⚷" }
    };

    const planetas = (mapData?.astros || []).map(a => {
      const config = planetBases[a.name] || { baseForce: 50, symbol: "★" };
      let force = config.baseForce;
      let harmony = 60;
      
      const pAspects = mapData?.aspects?.filter(asp => 
        asp.planet1 === a.name || asp.planet2 === a.name
      ) || [];
      
      force += pAspects.length * 4;
      
      pAspects.forEach(asp => {
        if (asp.aspectType === "Trígono" || asp.aspectType === "Sextil") {
          harmony += 12;
        } else if (asp.aspectType === "Quadratura" || asp.aspectType === "Oposição") {
          harmony -= 14;
        } else {
          harmony += 6;
        }
      });
      
      if (a.extraInfo) {
        if (a.extraInfo.includes("domicílio") || a.extraInfo.includes("exaltação")) {
          force += 12;
          harmony += 10;
        } else if (a.extraInfo.includes("exílio") || a.extraInfo.includes("queda")) {
          force -= 8;
          harmony -= 10;
        }
      }
      
      return {
        name: a.name,
        symbol: config.symbol,
        subtitle: a.sign,
        force: Math.min(100, Math.max(10, force)),
        harmony: Math.min(100, Math.max(10, harmony))
      };
    });

    return {
      signos: signs,
      casas: houses,
      planetas: planetas
    };
  }, [mapData]);

  const toggleResoCat = (cat: string) => {
    setExpandedResoCats(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const toggleTransit = (idx: number) => {
    setExpandedTrans(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const resoCategories = useMemo(() => [
    {
      id: "amor",
      label: "Amor e relacionamento",
      icon: <Heart className="w-4 h-4 text-rose-400" />,
      colorClass: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      description: `As posições planetárias de hoje harmonizam com seu Sol em ${solSign}. É um momento auspicioso para diálogos profundos com seu par ou para cultivar a vulnerabilidade consciente se estiver buscando um novo elo. A tônica é a escuta generosa, permitindo que a sinergia amorosa se amplie.`
    },
    {
      id: "carreira",
      label: "Dinheiro e Carreira",
      icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
      colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      description: `Seu Sol em ${solSign} recebe aspectos favoráveis de estabilidade material. Bom para organizar planos, revisar orçamentos de longo prazo e propor parcerias construtivas. O foco no pragmatismo evitará escolhas precipitadas sob impulsividade emocional.`
    },
    {
      id: "saude",
      label: "Saúde e Bem-estar",
      icon: <Activity className="w-4 h-4 text-sky-400" />,
      colorClass: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      description: `O fluxo vital convida você a reequilibrar seus hábitos diários. Beba mais água purificada, faça alongamentos suaves pela manhã e considere desacelerar um pouco o ritmo mental acelerado. O estresse acumulado pode ser dissolvido com silêncio e repouso de alta qualidade.`
    },
    {
      id: "familia",
      label: "Família e amigos",
      icon: <Users className="w-4 h-4 text-indigo-400" />,
      colorClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
      description: `As relações mais próximas ganham calor, acolhimento e escuta ativa sob a configuração celeste corrente. Um gesto carinhoso ou uma conversa sincera e desarmada trará resoluções de pendências antigas. Conecte-se com quem genuinamente apoia sua verdadeira essência.`
    },
    {
      id: "espiritualidade",
      label: "Espiritualidade",
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      colorClass: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      description: `Seu portal espiritual de hoje está amplamente expandido, estimulado pelos transições em casas astrológicas sutis do seu mapa de nascimento. Excelente momento para rituais pessoais, orações, leitura oracular de tarot ou meditação profunda. Sua intuição estará extremamente aguçada, trazendo respostas nítidas.`
    },
    {
      id: "periodo",
      label: "O seu período atual",
      icon: <Orbit className="w-4 h-4 text-amber-400" />,
      colorClass: "bg-amber-500/10 border-amber-500/20 text-amber-500",
      description: `Você está atravessando um ciclo de profunda maturação pessoal e renascimento. A fusão das forças celestes de trânsito em seu mapa cobra estruturação interna e resiliência espiritual. É hora de desapegar das velhas estruturas que não servem mais e semear os alicerces do seu novo ano zodiacal.`
    }
  ], [solSign]);

  const getRelativeDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const transitsList = useMemo(() => [
    {
      title: "Abrande os ânimos para não sair dos trilhos",
      startDate: getRelativeDate(0),
      endDate: getRelativeDate(8),
      aspect: `Marte está aos 19º de Touro (passando pela sua Casa 12), em Quadratura cu Sol natal aos 22° de ${solSign}`,
      description: "Muita energia acumulada, força de vontade e um desgosto por qualquer tipo de limitação. Abrande um pouco os ânimos para não sair dos trilhos. Permaneça sob controle e canalize essa poderosa impetuosidade física de forma construtiva em seus projetos profissionais."
    },
    {
      title: "Envolva-se com seu lado espiritual",
      startDate: getRelativeDate(-1),
      endDate: getRelativeDate(7),
      aspect: `Marte está aos 19º de Touro (passando pela sua Casa 12), em Trigono a seu Netuno natal aos 21° de ${netunoSign}`,
      description: "Bom momento para se envolver with atividades mais espirituais ou meditativas. Você pode estar se sentindo mais imaginativo e intuitivo. Concentre-se em seu interior e canalize essa inspiração fluida em rituais diários e conexões empáticas."
    },
    {
      title: "Mais vitalidade, coragem e confiança",
      startDate: getRelativeDate(-3),
      endDate: getRelativeDate(2),
      aspect: `Sol está aos 23º de Gêmeos (passando pela sua Casa 2), em Trigono a seu Sol natal aos 22º de ${solSign}`,
      description: "Período de vitalidade e criatividade mais elevadas. Interações com crianças e com quem possui autoridade estão igualmente favorecidos, assim como uma tendência a se se... (Ler mais)"
    },
    {
      title: "Transformação, regeneração e mudanças profundas",
      startDate: getRelativeDate(-14),
      endDate: getRelativeDate(25),
      aspect: `Júpiter está aos 26º de Câncer (passando pela sua Casa 3), em Trigono a seu Plutão natal aos 27º de ${plutaoSign}`,
      description: "Trânsito que traz mudanças profundas em termos de regeneração física e espiritual. Durante esse trânsito, podemos entrar em contato com conteúdos que estão em nosso inconsciente, permitindo purgar medos e obter autotransformação e sabedoria terapêutica profunda."
    },
    {
      title: "Reorganização interna e externa",
      startDate: getRelativeDate(-18),
      endDate: getRelativeDate(221),
      aspect: `Urano está aos 02º de Gêmeos (passando pela sua Casa 1), em Quadratura com seu Lua natal aos 04° de ${luaSign}`,
      description: "Durante este período de média ou longa duração, pode haver um aumento do grau de irritabilidade, uma crescente intranquilidade em que as emoções tendem a ficar mais instáveis ou flutuantes. Exercite o ancoramento, liberando o apego ao controle absoluto."
    },
    {
      title: "O valor da liberdade",
      startDate: getRelativeDate(-37),
      endDate: getRelativeDate(6),
      aspect: `Júpiter está aos 26º de Câncer (passando pela sua Casa 3), em Oposição a seu Urano natal aos 23º de ${uranoSign}`,
      description: "Ao longo desse trânsito podem surgir problemas com parceiros e amigos devido às mudanças abruptas que o indivíduo tende a começar a fazer na própria vida. Qualquer tentativa exterior de limitação estimula um ímpeto de revolta libertária e rebeldia criativa."
    },
    {
      title: "Agindo com disciplina",
      startDate: getRelativeDate(-60),
      endDate: getRelativeDate(278),
      aspect: `Saturno está aos 13º de Aries (passando pela sua Casa 11), em Sextil a seu Marte natal aos 11º de ${marteSign}`,
      description: "Um período estabilizador em que a disciplina e a sua saúde tende a ser favorecida. Pode haver diminuição de estados inflamatórios e de modo geral, os efeitos observados trazem maior senso de dever, resiliência física e foco pragmático de longo prazo."
    },
    {
      title: "Ressignificando conceitos",
      startDate: getRelativeDate(-78),
      endDate: getRelativeDate(37),
      aspect: `Urano está aos 02º de Gêmeos (passando pela sua Casa 1), em Quadratura com seu Saturno natal aos 01º de ${saturnoSign}`,
      description: "Este período costuma ser um divisor de águas, pois tudo que de alguma forma te impedia de exercer a sua autonomia sobre a própria vida nos últimos tempos poderá cair por terra, exigindo uma reestruturação realista e libertação de dependências obsoletas."
    }
  ], [solSign, luaSign, marteSign, saturnoSign, uranoSign, netunoSign, plutaoSign]);

  // Memoize data configurations to prevent redundant renders during tab changes
  const memoizedAstros = useMemo(() => mapData?.astros || [], [mapData?.astros]);
  const memoizedHouses = useMemo(() => mapData?.houses || [], [mapData?.houses]);
  const memoizedAspects = useMemo(() => mapData?.aspects || [], [mapData?.aspects]);

  // Adjust selected astro if mapData changes
  React.useEffect(() => {
    if (mapData?.astros?.length > 0) {
      setSelectedAstro(mapData.astros[0]);
    }
  }, [mapData]);

  // Extra Maps state 
  const [extraMaps, setExtraMaps] = useState<ExtraMap[]>([]);
  const [showWarning, setShowMainMapWarning] = useState<boolean>(false);
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraDate, setNewExtraDate] = useState('');
  const [newExtraTime, setNewExtraTime] = useState('');
  const [newExtraCity, setNewExtraCity] = useState('');

  // Main Map overwrite form state
  const [overwriteDate, setOverwriteDate] = useState(user.birthDate);
  const [overwriteTime, setOverwriteTime] = useState(user.birthTime);
  const [overwriteCity, setOverwriteCity] = useState(user.birthCity);

  const handleCreateExtraMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExtraName || !newExtraDate) return;
    if (extraMaps.length >= 2) {
      alert("Você atingiu o limite de 2 mapas extras permitidos na conta premium.");
      return;
    }
    setExtraMaps([...extraMaps, {
      name: newExtraName,
      birthDate: newExtraDate,
      birthTime: newExtraTime || "12:00",
      birthCity: newExtraCity || "Desconhecida"
    }]);
    setNewExtraName('');
    setNewExtraDate('');
    setNewExtraTime('');
    setNewExtraCity('');
  };

  const handleDeleteExtra = (index: number) => {
    setExtraMaps(extraMaps.filter((_, i) => i !== index));
  };

  const handleOverwriteMainMap = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMainMap({
      birthDate: overwriteDate,
      birthTime: overwriteTime,
      birthCity: overwriteCity
    });
    setShowMainMapWarning(false);
  };

  return (
    <div id="astrology-module" className="space-y-6">
      {/* Astro Tab Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-semibold tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20">
              Módulo Astrologia Premium
            </span>
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-100">
              Meu Mapa Astral Completo
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Calculado sob o sistema <span className="text-amber-500/80 font-mono">Placidus</span>. Entenda as configurações celestes precisas que moldam sua consciência.
            </p>
          </div>
          
          {!readOnly && (
            <button 
              onClick={() => setShowMainMapWarning(!showWarning)}
              className="flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-xl text-xs font-medium text-amber-500 hover:text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/40 hover:bg-amber-500/15 transition-all duration-300 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recalcular Meu Mapa</span>
            </button>
          )}
        </div>

        {/* Warning card for overwriting main map */}
        {!readOnly && showWarning && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-red-500/30 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-400">Você já possui um mapa principal ativo!</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ao recalcular o mapa, o atual será substituído. Se deseja criar mapas de outras pessoas sem afetar o seu, utilize a aba de <span className="font-semibold text-amber-500">MAPAS EXTRAS</span>.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleOverwriteMainMap} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">DATA DE NASCIMENTO</label>
                <input 
                  type="date" 
                  value={overwriteDate} 
                  onChange={(e) => setOverwriteDate(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">HORA (HH:MM)</label>
                <input 
                  type="text" 
                  value={overwriteTime} 
                  onChange={(e) => setOverwriteTime(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  placeholder="e.g. 15:30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">CIDADE</label>
                <input 
                  type="text" 
                  value={overwriteCity} 
                  onChange={(e) => setOverwriteCity(e.target.value)} 
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  placeholder="e.g. São Paulo"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end gap-2 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowMainMapWarning(false)} 
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-slate-100 rounded-lg text-xs font-semibold"
                >
                  Substituir Mapa Atual
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {mapData?.is_dst && (
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-slate-200 text-xs leading-relaxed flex items-start gap-3 shadow-xl animate-in fade-in duration-500">
          <span className="text-lg leading-none shrink-0 select-none">🌟</span>
          <p className="text-slate-300">
            <strong>Nota de Precisão:</strong> Identificamos que no dia, hora e local do seu nascimento estava vigorando o Horário de Verão. Plataformas de astrologia mais simples costumam errar o seu Ascendente porque esquecem de descontar essa 1 hora do relógio. Nosso sistema recalculou o céu com base na Hora Solar Real do seu nascimento, garantindo que o seu Ascendente em <strong>{mapData?.astros?.find(a => a.name === "Ascendente")?.sign || "sua data correspondente"}</strong> esteja 100% correto e astronamicamente preciso!
          </p>
        </div>
      )}

      {/* Navigation Subtabs */}
      {/* Scroll indicator for mobile screens */}
      <div className="md:hidden flex items-center justify-between text-[10px] text-amber-500/80 font-mono tracking-wider pb-2 px-1 select-none">
        <span className="text-slate-400">Seções do Mapa</span>
        <span className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full text-[9px] animate-pulse">
          Deslize para o lado ⇄
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('geral')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'geral' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Distribuição Energética</span>
        </button>
        <button
          onClick={() => setActiveSubTab('astros')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'astros' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>Posição dos Astros</span>
        </button>
        <button
          onClick={() => setActiveSubTab('casas')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'casas' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Casas Astrológicas</span>
        </button>
        <button
          onClick={() => setActiveSubTab('aspectos')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'aspectos' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Aspectos Planetários</span>
        </button>
        <button
          onClick={() => setActiveSubTab('extras')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeSubTab === 'extras' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-slate-400 hover:text-slate-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Mapas Extras ({extraMaps.length}/2)</span>
        </button>
      </div>

      {/* Main Subtab Contents */}
      {activeSubTab === 'geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Wheel Chart section */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
            <CircularChart astros={mapData.astros} />
            <span className="text-[10px] font-mono text-slate-500 mt-3 text-center uppercase tracking-wide">
              Diagrama do firmamento no nascimento ({user.birthCity})
            </span>
          </div>

          {/* Elements, Qualities and polarization sliders */}
          <div className="lg:col-span-3 space-y-6 bg-slate-900/30 p-6 rounded-3xl border border-slate-800/80">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                1. Distribuição dos Elementos
              </h3>
              
              <div className="space-y-3">
                {/* Fire */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-rose-400 font-medium">Fogo (Entusiasmo & Energia)</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.fire}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${mapData.distribution.elements.fire}%` }} />
                  </div>
                </div>

                {/* Earth */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-medium">Terra (Praticidade & Conquistas)</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.earth}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${mapData.distribution.elements.earth}%` }} />
                  </div>
                </div>

                {/* Air */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-sky-400 font-medium">Ar (Mente, Lógica & Comunicação)</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.air}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${mapData.distribution.elements.air}%` }} />
                  </div>
                </div>

                {/* Water */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-indigo-400 font-medium">Água (Sensibilidade & Intuição)</span>
                    <span className="font-mono text-slate-300">{mapData.distribution.elements.water}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${mapData.distribution.elements.water}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                2. Qualidades Astrológicas
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Cardinal</span>
                  <p className="text-lg font-bold text-slate-100 mt-1">{mapData.distribution.qualities.cardinal}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">Iniciativa & Ação</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Fixo</span>
                  <p className="text-lg font-bold text-amber-500 mt-1">{mapData.distribution.qualities.fixed}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">Estabilidade & Foco</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Mutável</span>
                  <p className="text-lg font-bold text-slate-100 mt-1">{mapData.distribution.qualities.mutable}%</p>
                  <p className="text-[9px] text-slate-500 mt-1">Adaptabilidade</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-xs" />
                3. Polaridade Energética
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-20 shrink-0 text-right">
                  <span className="text-xs text-amber-500 font-mono font-bold">{mapData.distribution.polarization.yang}%</span>
                  <span className="block text-[9px] text-slate-400">Ativo / Yang</span>
                </div>
                
                <div className="flex-1 h-3 rounded-full bg-slate-850 overflow-hidden flex">
                  <div className="h-full bg-amber-500" style={{ width: `${mapData.distribution.polarization.yang}%` }} />
                  <div className="h-full bg-slate-400" style={{ width: `${mapData.distribution.polarization.yin}%` }} />
                </div>

                <div className="w-20 shrink-0">
                  <span className="text-xs text-slate-300 font-mono font-bold">{mapData.distribution.polarization.yin}%</span>
                  <span className="block text-[9px] text-slate-400">Reativo / Yin</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">Potencial de Coexistência:</h4>
              <div className="flex flex-wrap gap-2">
                {mapData.personalityTraits.harmonious.slice(0, 5).map(trait => (
                  <span key={trait} className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-sans">
                    {trait}
                  </span>
                ))}
                {mapData.personalityTraits.disharmonious.slice(0, 4).map(trait => (
                  <span key={trait} className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-sans">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: A Balança Astrológica */}
        <div id="balanca-astrologica-section" className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mt-6 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xs">
          <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Scale className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-md font-bold text-slate-100 uppercase tracking-wider">A Balança Astrológica</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">DNA Astral & Pesos de Personalidade</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2 text-left">
            Este quadro mostra a condição que cada signo, planeta e casa possui em seu mapa astral, sendo parte integrante das informações que você leu acima. Você já se perguntou por quê algumas pessoas atribuem pesos diferentes para os diversos aspectos de sua personalidade ou desprendem mais ou menos energia em uma determinada área da vida? Isso acontece pois como você acompanhou até aqui, há diversas forças em jogo. Todo mapa astral é uma mistura variada de energias que criam uma configuração única, como uma espécie de DNA astral.
          </p>

          {/* Categories Selector: SIGNOS / CASAS / PLANETAS */}
          <div className="flex justify-center border-b border-slate-850 pb-3">
            <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-850 gap-1.5 w-full max-w-md">
              <button
                type="button"
                onClick={() => setBalancaTab('signos')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  balancaTab === 'signos'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                Signos
              </button>
              <button
                type="button"
                onClick={() => setBalancaTab('casas')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  balancaTab === 'casas'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                Casas
              </button>
              <button
                type="button"
                onClick={() => setBalancaTab('planetas')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  balancaTab === 'planetas'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/10 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                Planetas
              </button>
            </div>
          </div>

          {/* List display with Force vs Harmony */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {balancaData[balancaTab].map((item) => (
              <div 
                key={item.name} 
                className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850/65 flex items-center justify-between gap-4 hover:border-slate-800 transition duration-300"
              >
                {/* Symbol & Name */}
                <div className="flex items-center gap-3 w-[100px] shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-md text-amber-400 font-mono font-black shadow-inner">
                    {item.symbol}
                  </div>
                  <div className="text-left truncate">
                    <span className="text-xs font-bold text-slate-100 block truncate">{item.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-mono block mt-0.5 truncate">{item.subtitle}</span>
                  </div>
                </div>

                {/* Progress bars split side-by-side or stacked cleanly */}
                <div className="flex-1 space-y-2 text-left">
                  {/* Força Indicator */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-mono tracking-wider uppercase">
                      <span className="text-slate-400">Força</span>
                      <span className="text-amber-500 font-bold">{item.force}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-1000/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500" 
                        style={{ width: `${item.force}%` }} 
                      />
                    </div>
                  </div>

                  {/* Harmonia Indicator */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-mono tracking-wider uppercase">
                      <span className="text-slate-400">Harmonia</span>
                      <span className="text-emerald-400 font-bold">{item.harmony}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-1000/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500" 
                        style={{ width: `${item.harmony}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Resumo / Trânsitos */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 mt-6 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-850 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                <Calendar className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Resumo / Trânsitos</h3>
                <p className="text-[10px] text-slate-400">Guia de trânsitos contínuos e influências energéticas ativas no seu mapa</p>
              </div>
            </div>

            {/* Side-by-side Navigation Tabs */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-850 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setResoTab('resumo')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  resoTab === 'resumo'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Resumo Geral
              </button>
              <button
                type="button"
                onClick={() => setResoTab('transitos')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  resoTab === 'transitos'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Trânsitos Ativos
              </button>
            </div>
          </div>

          {/* TAB CONTENT: RESUMO DE HOJE */}
          {resoTab === 'resumo' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">RESUMO DE HOJE</h4>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {resoCategories.map((cat) => {
                  const isExpanded = !!expandedResoCats[cat.id];
                  return (
                    <div 
                      key={cat.id} 
                      className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                        isExpanded 
                          ? 'bg-slate-950/60 border-amber-500/20 shadow-md' 
                          : 'bg-slate-900/60 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleResoCat(cat.id)}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors font-sans pointer-events-auto"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl border ${cat.colorClass}`}>
                            {cat.icon}
                          </div>
                          <span className="text-xs font-semibold text-slate-100">{cat.label}</span>
                        </div>

                        <div className={`p-1.5 rounded-lg border transition-all ${
                          isExpanded 
                            ? 'bg-amber-500 text-slate-950 border-amber-500' 
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}>
                          {isExpanded ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-slate-300 text-xs border-t border-slate-850/50 bg-slate-950/40 leading-relaxed font-sans animate-in fade-in duration-300">
                          {cat.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: TRÂNSITOS ATIVOS */}
          {resoTab === 'transitos' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Trânsitos de {user?.name || "Buscador"}</h4>
                </div>
                <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Você tem 8 influências ativas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transitsList.map((tr, idx) => {
                  const isExpanded = !!expandedTrans[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`transition-all duration-300 border rounded-2xl overflow-hidden p-4 flex flex-col justify-between ${
                        isExpanded 
                          ? 'bg-slate-950/80 border-amber-500/30 md:col-span-2 shadow-2xl scale-[1.01]' 
                          : 'bg-slate-900 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-amber-500">{tr.title}</h4>
                        <span className="block text-[9.5px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-850 self-start">
                          De {tr.startDate} a {tr.endDate}
                        </span>
                        <p className="text-[10.5px] font-semibold text-slate-300 leading-tight">
                          {tr.aspect}
                        </p>
                        <p className={`text-xs text-slate-400 leading-relaxed font-sans ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {tr.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-850/50 mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => toggleTransit(idx)}
                          className="text-[9.5px] font-bold font-mono uppercase transition-all flex items-center gap-1 hover:text-amber-400 text-amber-500"
                        >
                          <span>{isExpanded ? "Ver menos" : "Ler mais"}</span>
                          <ArrowRight className={`w-3 h-3 transform transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      {activeSubTab === 'astros' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rank list of planets */}
          <div className="space-y-2 lg:col-span-1 bg-slate-900/40 p-4 rounded-3xl border border-slate-800 max-h-[460px] overflow-y-auto">
            <h3 className="text-xs font-bold font-mono text-slate-400 px-2 uppercase tracking-wide mb-3">Ranking de Astros</h3>
            
            {memoizedAstros.map((ast) => (
              <button
                key={ast.name}
                onClick={() => setSelectedAstro(ast)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  selectedAstro?.name === ast.name
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-md ring-1 ring-amber-500/10'
                    : 'bg-slate-900 border-slate-850 hover:bg-slate-850 hover:border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-amber-500/80">🪐</span>
                  <div>
                    <h4 className="text-xs font-bold">{ast.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {ast.sign} {ast.degree !== null && ast.degree !== undefined ? ast.degree : ''}
                      {ast.degree !== null && ast.degree !== undefined && (typeof ast.degree === 'number' || !String(ast.degree).includes('°')) ? '°' : ''}
                    </p>
                  </div>
                </div>

                {ast.extraInfo && (
                  <span className="px-1.5 py-0.5 rounded-sm bg-slate-950 border border-slate-800 text-[8px] font-mono text-slate-500 uppercase">
                    {ast.extraInfo.split(',')[0]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected planet complete interpretation */}
          <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
            {selectedAstro ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-amber-500 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Influência Cósmica
                    </span>
                    <h2 className="text-2xl font-bold text-slate-100 mt-2 flex items-center gap-1.5">
                      {selectedAstro.name} <span className="text-slate-400 font-medium text-lg">em {selectedAstro.sign}</span>
                    </h2>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-xl font-bold text-amber-500 font-mono">
                      {selectedAstro.degree !== null && selectedAstro.degree !== undefined ? selectedAstro.degree : ''}
                      {selectedAstro.degree !== null && selectedAstro.degree !== undefined && (typeof selectedAstro.degree === 'number' || !String(selectedAstro.degree).includes('°')) ? '°' : ''}
                    </span>
                    {selectedAstro.extraInfo && (
                      <p className="text-[9px] font-mono text-slate-500 uppercase mt-1">{selectedAstro.extraInfo}</p>
                    )}
                  </div>
                </div>

                <div className="text-slate-300 leading-relaxed text-xs space-y-3 font-sans">
                  <p className="p-4 rounded-2xl bg-slate-950 border border-slate-850/80 text-slate-300 selection:bg-amber-500/30">
                    {selectedAstro.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <h4 className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-wider mb-2">Comportamento de Alta Vibração</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Aproveitar a energia de {selectedAstro.name} em {selectedAstro.sign} significa expressar independência genuína sem necessitar de rebeldia vazia. Busque se autoafirmar por suas conquistas reais e inteligência visionária.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                <Orbit className="w-12 h-12 text-slate-700 animate-spin" />
                <p className="text-xs font-mono mt-4">Selecione um astro ao lado para visualizar a interpretação.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'casas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* House list selectors */}
          <div className="lg:col-span-4 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2 bg-slate-900/40 p-4 rounded-3xl border border-slate-800">
            {memoizedHouses.map((house) => (
              <button
                key={house.number}
                onClick={() => setSelectedHouse(house.number)}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  selectedHouse === house.number
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 shadow-md font-bold'
                    : 'bg-slate-900 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-mono block">CASA</span>
                <span className="text-lg font-bold font-mono">{house.number}</span>
                <span className="text-[8px] font-sans text-slate-500 block truncate leading-none mt-0.5">{house.sign}</span>
              </button>
            ))}
          </div>

          {/* House Details Panel */}
          <div className="lg:col-span-8 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
            {(() => {
              const hs = mapData.houses.find(h => h.number === selectedHouse);
              if (!hs) return null;
              return (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                        Divisão do Espaço Terrestre
                      </span>
                      <h2 className="text-xl font-bold text-slate-100 mt-2">
                        Casa Astrológica {hs.number} <span className="text-slate-400 font-medium">em {hs.sign}</span>
                      </h2>
                    </div>

                    {hs.planet && (
                      <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 rounded-xl">
                        Planeta Ocupante: {hs.planet}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed p-4 rounded-xl bg-slate-950/70 border border-slate-850 selection:bg-amber-500/20">
                    {hs.interpretation}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                    <h4 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Temas Principais desta Casa</h4>
                    <ul className="list-disc pl-4 text-[10px] text-slate-500 space-y-1">
                      <li>Interação direta com as áreas terrenas governadas por {hs.sign}.</li>
                      <li>Desafios de manifestação material ou social direta.</li>
                      {hs.planet && <li>A energia mutadora de {hs.planet} traz inquietações cruciais para esta área de sua rotina.</li>}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeSubTab === 'aspectos' && (
        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">Relações Celestes (Orbes & Aspectos)</h3>
            <p className="text-[11px] text-slate-500">Conjunto de ângulos matemáticos formados entre os astros no momento exato do nascimento.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memoizedAspects.map((asp, i) => {
              let aspectColor = "border-sky-500/20 text-sky-400 bg-sky-500/5";
              if (asp.aspectType === "Oposição") aspectColor = "border-rose-500/20 text-rose-400 bg-rose-500/5";
              else if (asp.aspectType === "Quadratura") aspectColor = "border-orange-500/20 text-orange-400 bg-orange-500/5";
              else if (asp.aspectType === "Trígono") aspectColor = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";

              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-850/80 space-y-2 hover:border-slate-800 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{asp.planet1}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wide uppercase ${aspectColor}`}>
                        {asp.aspectType}
                      </span>
                      <span className="text-xs font-bold text-slate-200">{asp.planet2}</span>
                    </div>

                    <span className="text-[9px] font-mono text-slate-500">Orbe: {asp.orb}°</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed leading-[1.6]">
                    {asp.interpretation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'extras' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Creation Form */}
          <div className="lg:col-span-5 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">Cadastrar Novo Mapa Extra</h3>
              <p className="text-[11px] text-slate-500">Crie o mapa de amigos, companheiros ou familiares importante para você.</p>
            </div>

            <form onSubmit={handleCreateExtraMap} className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">NOME DA PESSOA</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Maria Silva"
                  value={newExtraName}
                  onChange={(e) => setNewExtraName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1">DATA DE NASCIMENTO</label>
                <input 
                  type="date" 
                  required
                  value={newExtraDate}
                  onChange={(e) => setNewExtraDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">HORA (HH:MM)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 18:45"
                    value={newExtraTime}
                    onChange={(e) => setNewExtraTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">CIDADE</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rio de Janeiro"
                    value={newExtraCity}
                    onChange={(e) => setNewExtraCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={extraMaps.length >= 2}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-sans font-bold text-xs uppercase transition-all duration-300"
              >
                Gerar & Adicionar {extraMaps.length >= 2 ? '(Limite Atingido)' : ''}
              </button>
            </form>
          </div>

          {/* List of extras slots */}
          <div className="lg:col-span-7 bg-slate-900/20 p-6 rounded-3xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Mapas extras cadastrados</h3>
            
            {extraMaps.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-650 bg-slate-950/40 rounded-2xl border border-slate-850 border-dashed">
                <Compass className="w-10 h-10 text-slate-800 animate-pulse" />
                <p className="text-[11px] text-slate-500 mt-3 text-center max-w-xs leading-relaxed">
                  Nenhum mapa extra criado ainda. Você pode gerir até 2 mapas adicionais de forma premium.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {extraMaps.map((map, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-900 border border-slate-850">
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded uppercase">
                        Slot {idx + 1} / Mapa Secundário
                      </span>
                      <h4 className="text-xs font-bold text-slate-200">{map.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {map.birthDate.split('-').reverse().join('/')} às {map.birthTime} · {map.birthCity}
                      </p>
                    </div>

                    <div className="flex gap-2">
                       <button
                         onClick={() => {
                           // Instantly calculate/visualize them!
                           onUpdateMainMap(map);
                         }}
                         className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-500 rounded-lg text-[10px] font-semibold transition"
                       >
                         Visualizar Como Principal
                       </button>
                       <button
                         onClick={() => handleDeleteExtra(idx)}
                         className="p-1 text-slate-600 hover:text-rose-400 text-xs transition"
                       >
                         Excluir
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default AstrologyView;
