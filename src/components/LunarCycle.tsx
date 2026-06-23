import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  Sparkles, 
  Calendar, 
  Clock, 
  RefreshCw, 
  Heart, 
  Coins, 
  Activity, 
  Scissors, 
  Info, 
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock3,
  MoonStar
} from 'lucide-react';
import { 
  getJulianDate, 
  calculateMoonLongitude, 
  getZodiacSignInfo, 
  performAstroCalculation 
} from './astroMath';
import { translateUiText, Language } from '../lib/translations';

// Simple analytical Sun longitude
function calculateSunLongitude(T: number): number {
  const L = (280.46646 + 36000.76983 * T) % 360;
  const M = (357.52911 + 35999.05029 * T) % 360;
  const M_rad = M * Math.PI / 180;
  const lambda = L + 1.914602 * Math.sin(M_rad) + 0.020166 * Math.sin(2 * M_rad);
  return (lambda + 360) % 360;
}

// Full astronomical status resolver for a given date-time
function computeMoonState(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  const JD = getJulianDate(year, month, day, hour, minute);
  const T = (JD - 2451545.0) / 36525.0;
  const moonLong = calculateMoonLongitude(T);
  const sunLong = calculateSunLongitude(T);
  const elongation = (moonLong - sunLong + 360) % 360;
  
  const moonInfo = getZodiacSignInfo(moonLong);
  const sunInfo = getZodiacSignInfo(sunLong);
  
  return {
    moonLong,
    sunLong,
    elongation,
    moonSign: moonInfo.sign,
    moonDegree: moonInfo.degree,
    moonMinute: moonInfo.minute,
    sunSign: sunInfo.sign,
    JD,
    T
  };
}

interface LunarPhase {
  name: string;
  icon: string;
  desc: string;
  key: string;
  energy: string;
}

const LUNAR_PHASES: LunarPhase[] = [
  { name: 'Lua Nova', icon: '🌑', key: 'nova', desc: 'Início de ciclo, ideal para intenções, novos rumos e plantar sementes internas.', energy: 'Momento de recolhimento, inspiração e planejamento secreto silencioso.' },
  { name: 'Lua Crescente', icon: '🌒', key: 'crescente', desc: 'Acúmulo de energia física, tração inicial, superabilidade diante de incertezas.', energy: 'Estímulo de ação para sair da inércia, investir esforço consciente de ação.' },
  { name: 'Lua Quarto Crescente', icon: '🌓', key: 'quarto_crescente', desc: 'Força realizadora, teste tático e determinação para desafiar barreiras.', energy: 'Período de superação de obstáculos iniciais com foco e resiliência total.' },
  { name: 'Lua Gibosa', icon: '🌔', key: 'gibosa', desc: 'Ajustes finos minuciosos, amadurecimento e análise detalhada laboriosa.', energy: 'Dia de aperfeiçoar processos e ajustar as metas diante do clímax iminente.' },
  { name: 'Lua Cheia', icon: '🌕', key: 'cheia', desc: 'Clímax magnético, transbordo de águas sentimentais e colheita abundante.', energy: 'Alta sensibilidade social, intuição reveladora e emoções à flor da pele.' },
  { name: 'Lua Disseminadora', icon: '🌖', key: 'disseminadora', desc: 'Partilha de saberes, expressividade carinhosa, gratidão e ensino fluido.', energy: 'Excelente momento para ensinar, distribuir conselhos generosos e socializar.' },
  { name: 'Lua Quarto Minguante', icon: '🌗', key: 'quarto_minguante', desc: 'Eliminação consciente de pendências, divórcio de amarras e depuração do ser.', energy: 'Sugerem depuração, encerramentos práticos, triagem e limpezas profundas.' },
  { name: 'Lua Balsâmica', icon: '🌘', key: 'balsamica', desc: 'Reflexão mística profunda, transmutação silenciosa e sossego restaurador.', energy: 'Fase de quietude, transmutação de pesos mentais e descanso preparatório.' }
];

function getPhaseInfo(elongation: number): LunarPhase {
  const idx = Math.floor(elongation / 45) % 8;
  return LUNAR_PHASES[idx];
}

// Medical astrology correspondences based on Moon Sign
const SIGN_MEDICAL: Record<string, {
  element: string;
  organs: string[];
  finances: string;
  relationships: string;
  health: string;
  beauty: string;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
}> = {
  "Áries": {
    element: "Fogo", modality: "Cardinal",
    organs: ["Cabeça", "Cérebro", "Olhos", "Crânio"],
    finances: "Desejo de inícios comerciais rápidos. Evite compras imediatas por impulso ou por pressões momentâneas.",
    relationships: "Clima de paixão ardente e diálogo direto. Cuidado com discussões ácidas ou reações impacientes.",
    health: "Atenção com dores de cabeça e cansaço visual. Hidrate-se e evite tensões mentais na mandíbula.",
    beauty: "Favorece cortes de cabelo modernos e práticos. Evite cirurgias faciais invasivas neste momento."
  },
  "Touro": {
    element: "Terra", modality: "Fixed",
    organs: ["Pescoço", "Garganta", "Cordas Vocais", "Tireoide"],
    finances: "Propício para organizar orçamentos de segurança. Momento fértil para compras duradouras de alto valor residual.",
    relationships: "Foco em carinho seguro, estabilidade de convívio e fidelidade. Cuidado com o fantasma do ciúme persistente.",
    health: "Garganta e cordas vocais sensíveis. Vista proteções quentes e consuma chás mornos de ervas melíferas.",
    beauty: "Excelente para hidratações corporais suntuosas, massagens com óleos essenciais e banhos aromáticos."
  },
  "Gêmeos": {
    element: "Ar", modality: "Mutable",
    organs: ["Ombros", "Braços", "Mãos", "Laringe", "Sistema Nervoso"],
    finances: "Fluidez na comunicação de negócios e trocas de ideias comerciais. Bom para prospectar clientes novos de forma leve.",
    relationships: "Sintonia de diálogos mentais jocosos, compartilhamento de leituras e passeios curtos divertidos.",
    health: "A respiração e o sistema nervoso pedem atenção. Pratique meditações pausadas para acalmar os fluxos mentais.",
    beauty: "Dia perfeito para manicure, pedicure, esfoliação de mãos e uso de fragrâncias cítricas leves e solares."
  },
  "Câncer": {
    element: "Água", modality: "Cardinal",
    organs: ["Estômago", "Diafragma", "Seios", "Útero"],
    finances: "Decisões que flutuam ao sabor do bem-estar doméstico. Bom para compras que nutrem o lar e agregam valor familiar.",
    relationships: "Vontade de aconchego íntimo de almas, trocas de afeto sincero e sensibilidade carismática profunda.",
    health: "O estômago e a digestão ficam sensíveis. Escolha comidas cozidas leves de fácil digestão e evite frituras.",
    beauty: "Bom para máscaras capilares calmantes de aloe vera e terapias aquáticas regeneradoras no chuveiro ou ofurô."
  },
  "Leão": {
    element: "Fogo", modality: "Fixed",
    organs: ["Coração", "Coluna Vertebral", "Região Dorsal", "Aorta"],
    finances: "Atração por produtos estéticos de luxo e marcas exclusivas. Excelente para promover seu próprio nome corporativo.",
    relationships: "Amor expressivo, leal e fervoroso. Bom para jantares festivos e demonstrações mútuas de prestígio.",
    health: "Cuide da postura vertebral. Evite carregar pesos excessivos ou fazer torções bruscas nas costas.",
    beauty: "O momento ápice para cortes de cabelo visando volume, força dos fios, tratamentos capilares profundos e renovações radicais."
  },
  "Virgem": {
    element: "Terra", modality: "Mutable",
    organs: ["Abdômen", "Intestinos", "Válvula Ileocecal", "Baço"],
    finances: "Excelente para auditar contas milímetro a milímetro. Organize suas planilhas de gastos e corte taxas inúteis.",
    relationships: "Demonstração de amor por serviços práticos, organização mútua do dia a dia e diálogos racionais sinceros.",
    health: "A microbiota intestinal e o abdômen demandam dietas de fibras puras, probióticos naturais e hidratação intensa.",
    beauty: "Favorece limpezas de pele detalhadas, depilações limpas, cuidados com cutículas e detox capilar purificador."
  },
  "Libra": {
    element: "Ar", modality: "Cardinal",
    organs: ["Rins", "Lombar", "Glândulas Suprarrenais", "Ureteres"],
    finances: "Favorece acordos equilibrados, parcerias financeiras conjuntas e compras de adornos de alto design requintado.",
    relationships: "Sintonia elegante, cortesia mútua e conciliação sutil de pequenos desentendimentos prévios.",
    health: "Beba bastante água fresca para purificar a filtragem dos rins. Alongue a lombar com suavidade.",
    beauty: "Momento espetacular para harmonizações de traços, cortes simétricos, design de sobrancelhas e tratamentos de viço facial."
  },
  "Escorpião": {
    element: "Água", modality: "Fixed",
    organs: ["Órgãos Sexuais", "Próstata", "Bexiga", "Cólon"],
    finances: "Forte faro intuitivo para lucrar ou detectar transações ocultas vantajosas. Guarde seus planos financeiros em segredo de todos.",
    relationships: "Clima de entrega total mística, lealdade profunda e confidências íntimas vigorosas entre quatro paredes.",
    health: "A região pélvica e a bexiga merecem atenção preventiva. Pratique meditações de transmutação de mágoas kármicas.",
    beauty: "Excelente para depilações prolongadas, maquiagens de olhar marcante ou aplicação de tinturas capilares de cor intensa."
  },
  "Sagitário": {
    element: "Fogo", modality: "Mutable",
    organs: ["Quadril", "Coxas", "Nervo Ciático", "Fígado", "Fêmur"],
    finances: "Desejo amplo de expansão de negócios ou apostas ousadas. Bom para investir em treinamentos e bagagens acadêmicas.",
    relationships: "Conexão baseada em filosofia de vida, gargalhadas, passeios livres e respeito à liberdade pessoal mútua.",
    health: "Evite alimentos excessivamente gordurosos ou bebidas doces para suavizar a sobrecarga sobre o fígado.",
    beauty: "Favorece cortes de cabelo para crescimento rápido e tratamentos relaxantes tônicos para coxas e panturrilhas."
  },
  "Capricórnio": {
    element: "Terra", modality: "Cardinal",
    organs: ["Esqueleto", "Articulações", "Joelhos", "Dentes", "Pele"],
    finances: "Fóco pragmático na estabilização de longo prazo. Bom para investimentos perfeitamente conservadores regulados.",
    relationships: "Relações seguras pautadas no dever e na fidelidade duradoura. Pouca tolerância a melodramas e infantilidades.",
    health: "Suplemente cálcio, colágeno e cuide bem das articulações e dentes. Faça caminhadas de sola firme.",
    beauty: "Favorece cortes de cabelo sóbrios, clássicos, elegantes e profissionais. Ótimo para tonificar a derme corporal."
  },
  "Aquário": {
    element: "Ar", modality: "Fixed",
    organs: ["Panturrilhas", "Canelas", "Tornozelos", "Sistema Vascular"],
    finances: "Vanguarda de ideias. Ótimo para adquirir sistemas de software úteis, novas tecnologias e subscrever utilidades coletivas.",
    relationships: "Sintonia de amizade madura, mútuo respeito pelos espaços individuais e conversas livres sem cobranças.",
    health: "A circulação nas pernas pede atenção. Faça escalda-pés e eleve as pernas ao fim do dia para favorecer o refluxo linfático.",
    beauty: "Fase espetacular para ousar em cortes futuristas, colorações exóticas originais e franjas expressivas."
  },
  "Peixes": {
    element: "Água", modality: "Mutable",
    organs: ["Pés", "Dedos dos Pés", "Sistema Linfático", "Gânglios"],
    finances: "Dia de guiar-se por vozes internas de intuição comercial. Período próspero para caridade, doações e resgates fraternos.",
    relationships: "Sintonia poética e sentimentos espirituais sublimes. Forte ligação telepática e perdões restauradores profundos.",
    health: "A imunidade e o labirinto linfático demandam cuidado. Pratique escalda-pés curativos com sal grosso e ervas relaxantes.",
    beauty: "Dia ideal para massagens relaxantes podais (reflexologia), hidratações suaves com óleos essenciais de lavanda."
  }
};

// Precise Future lunar phase search (at 15 mins precision)
function getFuturePhasesForDate(startDate: Date, count: number = 6) {
  const list = [];
  let d = new Date(startDate.getTime());
  let lastIdx = Math.floor(computeMoonState(d).elongation / 45) % 8;
  const stepMs = 12 * 60 * 60 * 1000; // 12 hours scan step
  const maxScan = 160; // scan up to 80 days
  let cycles = 0;
  
  while (list.length < count && cycles < maxScan) {
    d = new Date(d.getTime() + stepMs);
    const state = computeMoonState(d);
    const idx = Math.floor(state.elongation / 45) % 8;
    if (idx !== lastIdx) {
      // Transition detected! Refine precisely backward
      let preciseD = new Date(d.getTime() - stepMs);
      const fineStep = 15 * 60 * 1000;
      while (Math.floor(computeMoonState(preciseD).elongation / 45) % 8 === lastIdx) {
        preciseD = new Date(preciseD.getTime() + fineStep);
      }
      list.push({
        date: new Date(preciseD.getTime()),
        phaseIdx: idx,
        phaseName: LUNAR_PHASES[idx].name,
        icon: LUNAR_PHASES[idx].icon,
        desc: LUNAR_PHASES[idx].desc,
        sign: state.moonSign
      });
      lastIdx = idx;
    }
    cycles++;
  }
  return list;
}

// Precise Phase limits finder
function getPhaseLimitsForDate(startDate: Date) {
  const initialIdx = Math.floor(computeMoonState(startDate).elongation / 45) % 8;
  
  // Backward search
  let startD = new Date(startDate.getTime());
  let stepMs = 6 * 60 * 60 * 1000;
  while (Math.floor(computeMoonState(new Date(startD.getTime() - stepMs)).elongation / 45) % 8 === initialIdx) {
    startD = new Date(startD.getTime() - stepMs);
  }
  stepMs = 15 * 60 * 1000;
  while (Math.floor(computeMoonState(new Date(startD.getTime() - stepMs)).elongation / 45) % 8 === initialIdx) {
    startD = new Date(startD.getTime() - stepMs);
  }

  // Forward search
  let endD = new Date(startDate.getTime());
  stepMs = 6 * 60 * 60 * 1000;
  while (Math.floor(computeMoonState(new Date(endD.getTime() + stepMs)).elongation / 45) % 8 === initialIdx) {
    endD = new Date(endD.getTime() + stepMs);
  }
  stepMs = 15 * 60 * 1000;
  while (Math.floor(computeMoonState(new Date(endD.getTime() + stepMs)).elongation / 45) % 8 === initialIdx) {
    endD = new Date(endD.getTime() + stepMs);
  }

  return { startD, endD };
}

interface LunarCycleProps {
  userName?: string;
  userSunSign?: string;
  userAscendant?: string; // Additional props for premium maps
  lang?: string;
}

export default function LunarCycle({ 
  userName, 
  userSunSign = 'Aquário',
  userAscendant = 'Sagitário',
  lang
}: LunarCycleProps) {
  const t = (text: string) => translateUiText(text, (lang as Language) || 'pt');
  
  // Temporal States
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'HOJE' | 'FUTURO'>('HOJE');
  const [timeStepFilter, setTimeStepFilter] = useState<'7d' | '30d' | '3m'>('30d');
  const [activeFaqDetail, setActiveFaqDetail] = useState<number | null>(null);

  // Live timer tick for device clock visualization
  const [currentClockTime, setCurrentClockTime] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentClockTime(new Date());
      if (isLiveSync) {
        setSelectedDate(new Date());
      }
    }, 1000);
    return () => clearInterval(t);
  }, [isLiveSync]);

  const toggleLiveSync = () => {
    setIsLiveSync(prev => {
      if (!prev) {
        setSelectedDate(new Date());
      }
      return !prev;
    });
  };

  const handleManualDateChange = (dateVal: string) => {
    setIsLiveSync(false);
    const [y, m, d] = dateVal.split("-").map(Number);
    const next = new Date(selectedDate.getTime());
    next.setFullYear(y);
    next.setMonth(m - 1);
    next.setDate(d);
    setSelectedDate(next);
  };

  const handleManualTimeChange = (timeVal: string) => {
    setIsLiveSync(false);
    const [h, min] = timeVal.split(":").map(Number);
    const next = new Date(selectedDate.getTime());
    next.setHours(h);
    next.setMinutes(min);
    setSelectedDate(next);
  };

  // Astronomical computations relative to selectedDate state
  const moonState = computeMoonState(selectedDate);
  const phaseInfo = getPhaseInfo(moonState.elongation);
  const limits = getPhaseLimitsForDate(selectedDate);
  const medicalDetails = SIGN_MEDICAL[moonState.moonSign] || SIGN_MEDICAL["Touro"];

  // Compatibility engine: Moon transit Sign vs Natal Sun Sign
  const getNatalAlignment = () => {
    const transitMod = SIGN_MEDICAL[moonState.moonSign]?.modality;
    const natalMod = SIGN_MEDICAL[userSunSign]?.modality;
    const transitElem = SIGN_MEDICAL[moonState.moonSign]?.element;
    const natalElem = SIGN_MEDICAL[userSunSign]?.element;

    if (!transitMod || !natalMod) return {
      type: 'Complementar',
      badge: '★ Apoio Sutil',
      text: 'O trânsito apoia dinâmicas saudáveis com sua órbita planetária solar de forma discreta.'
    };

    if (moonState.moonSign === userSunSign) {
      return {
        type: 'Conjunção Lunar',
        badge: '● Alinhamento Intenso',
        text: 'A Lua transita sobre o seu Sol Natal! Suas faculdades intuitivas, marés sentimentais e reações físicas estão unificadas em clareza máxima.'
      };
    }
    if (transitElem === natalElem) {
      return {
        type: 'Trígono Elemental',
        badge: '▲ Harmonia Fluida',
        text: `Excelente sintonia de elemento de ${transitElem}. Seus sentimentos e impulsos íntimos cooperam de forma pacífica com sua essência consciente de ${userSunSign}.`
      };
    }
    if (transitMod === natalMod) {
      // Opposite signs share same modality (separated by 6 signs, index diff is 6)
      // E.g. Aries vs Libra
      const indices = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
      const tIdx = indices.indexOf(moonState.moonSign);
      const nIdx = indices.indexOf(userSunSign);
      if (Math.abs(tIdx - nIdx) === 6) {
        return {
          type: 'Oposição Celestial',
          badge: '➔ Polaridade / Espelho',
          text: `Eixo de polaridade ativo. Seus sentimentos pedem ponderação entre suas vontades íntimas e desejos externos trazidos pelo signo oposto, ${moonState.moonSign}.`
        };
      }
      return {
        type: 'Quadratura Desafiadora',
        badge: '✦ Tensão Construtiva',
        text: `Ângulo de quadratura instigante. Há pequenos atritos corporais ou ansiedades que convidam você a tomar decisões ativas e sair do conforto rotineiro.`
      };
    }
    return {
      type: 'Sextil Colaborativo',
      badge: '◆ Oportunidade Sutil',
      text: `Harmonia leve de cooperação solar e lunar. Excelente para alinhar oratórias práticas, redigir contratos ou programar metas secundárias.`
    };
  };

  const alignment = getNatalAlignment();

  // Dynamic advice maxim based on Moon phase
  const getDynamicMaxim = () => {
    switch (phaseInfo.key) {
      case 'nova': return "“O silêncio é o útero fértil onde a mente sóbria desenha suas próximas grandes conquistas.”";
      case 'crescente': return "“A força primordial do progresso exige superarmos com audácia o conforto da inércia diária.”";
      case 'quarto_crescente': return "“Todo obstáculo que se ergue à sua frente serve de alavanca para consolidar sua própria maestria.”";
      case 'gibosa': return "“O burilamento dedicado nos menores pormenores antecede o brilho das grandes colheitas.”";
      case 'cheia': return "“Quando as emoções transbordam em abundância, a colheita plena revela quem de fato somos.”";
      case 'disseminadora': return "“A sabedoria retida estagna-se; apenas ao ensinarmos e distribuirmos, florescemos eternamente.”";
      case 'quarto_minguante': return "“Saber separar o joio do trigo é a prudência kármica que limpa o solo da nossa alma.”";
      default: return "“As dores pretéritas transmutam-se em pura sabedoria no santuário acolhedor da quietude.”";
    }
  };

  const getSutleAdvice = () => {
    switch(phaseInfo.key) {
      case 'nova': return { do: 'Semeie intenções estruturadas e planeje inícios ocultos.', avoid: 'Evite expor seus sonhos primordiais a mentes incrédulas.', protect: 'Defenda sua paz íntima meditando em quartos recolhidos.' };
      case 'crescente': return { do: 'Dedique energia física extra no avanço dos projetos.', avoid: 'Evite retroceder mediante desconfianças externas passageiras.', protect: 'Consuma banhos de sálvia ou alecrim para blindar o vigor.' };
      case 'quarto_crescente': return { do: 'Tome as decisões necessárias com firmeza total.', avoid: 'Evite contornar os nós difíceis; encare-os com racionalidade.', protect: 'Faça exercícios de respiração diafragmática para acalmar a mente.' };
      case 'gibosa': return { do: 'Revise contratos, refine planilhas e faça ajustes práticos.', avoid: 'Evite apressar entregas sem antes checar as entrelinhas burocráticas.', protect: 'Evite ambientes barulhentos para focar no foco intelectual.' };
      case 'cheia': return { do: 'Apresente-se publicamente e desfrute de interações fáceis.', avoid: 'Evite tomar decisões frias sob sentimentos turbulentos.', protect: 'Use pedras de quartzo rosa ou ametista para balancear o peito.' };
      case 'disseminadora': return { do: 'Compartilhe seus resultados e ofereça mentoria generosa.', avoid: 'Evite impor dogmas rígidos a quem não está pronto para ouvir.', protect: 'Pratique doações fraternas para destravar o fluxo de Saturno.' };
      case 'quarto_minguante': return { do: 'Defina pendências latentes e limpe gavetas corporáticas.', avoid: 'Evite assinar novos inícios que exijam manutenção extrema future.', protect: 'Acenda incensos de lavanda ou mirra para banir poeiras astrais.' };
      default: return { do: 'Descanse profundamente o corpo físico e medite recolhido.', avoid: 'Evite agendas cheias de compromissos sociais barulhentos.', protect: 'Isole-se energeticamente no aconchego de sua biblioteca mental.' };
    }
  };

  const dynamicSutleAdvice = getSutleAdvice();

  // Dynamic 7d, 30d, 90d Calendar generation
  const getCalendarDays = () => {
    const daysArr = [];
    const count = timeStepFilter === '7d' ? 7 : timeStepFilter === '30d' ? 30 : 90;
    
    for (let i = 0; i < count; i++) {
      const d = new Date(selectedDate.getTime() + i * 24 * 60 * 60 * 1000);
      const state = computeMoonState(d);
      const phase = getPhaseInfo(state.elongation);
      
      // Determine favorable / attention labels base on alignment with user sign element
      const transitElem = SIGN_MEDICAL[state.moonSign]?.element;
      const natalElem = SIGN_MEDICAL[userSunSign]?.element;
      
      const isFavorable = transitElem === natalElem || 
        (natalElem === 'Ar' && transitElem === 'Fogo') || 
        (natalElem === 'Fogo' && transitElem === 'Ar') ||
        (natalElem === 'Terra' && transitElem === 'Água') ||
        (natalElem === 'Água' && transitElem === 'Terra');
        
      const isAttention = SIGN_MEDICAL[state.moonSign]?.modality === SIGN_MEDICAL[userSunSign]?.modality && state.moonSign !== userSunSign;

      daysArr.push({
        date: d,
        phase,
        sign: state.moonSign,
        isFavorable,
        isAttention
      });
    }
    return daysArr;
  };

  const calendarDays = getCalendarDays();
  const futurePhases = getFuturePhasesForDate(selectedDate, 6);

  return (
    <div id="realt-lunar-cycle-system" className="space-y-6 text-left">
      
      {/* Intro Header Banner */}
      <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2 leading-none">
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse shrink-0" />
              Sintonização Gravitacional Universal
            </h3>
            <h2 className="text-lg font-black font-sans uppercase tracking-tight text-white flex items-center gap-2.5">
              <MoonStar className="w-5 h-5 text-indigo-305" /> Ciclo Lunar em Tempo Real
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-950/40 text-indigo-300 font-mono text-[9.5px] rounded-lg border border-indigo-900 leading-none">
              ★ Livre - Acesso Ilimitado
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-350 leading-relaxed font-sans">
          {userName ? (
            <>
              Olá, <strong className="text-indigo-300 font-bold">{userName}</strong> (Sol em <strong className="text-amber-400 font-semibold">{userSunSign}</strong>, Ascendente em <strong className="text-pink-400 font-semibold">{userAscendant}</strong>). O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu para o seu mapa pessoal.
            </>
          ) : (
            <>
              O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu. <strong className="text-indigo-300">Crie seu mapa astral para desbloquear análises personalizadas e preencha seus dados para iniciar sua jornada.</strong>
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Today placement and temporal controller */}
        <div className="lg:col-span-7 bg-slate-900/40 p-5 md:p-6 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Sintonizador Temporal Controller */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-sidebar-divider gap-4">
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('HOJE')}
                className={`px-4 py-1.5 rounded-xl text-[10.5px] font-mono tracking-widest font-bold transition cursor-pointer flex items-center gap-1.5 border uppercase ${
                  activeTab === 'HOJE'
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-inner'
                    : 'bg-slate-950/70 border-slate-900 text-slate-450 hover:text-slate-205'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                HOJE CORRENTE
              </button>
              
              <button
                onClick={() => setActiveTab('FUTURO')}
                className={`px-4 py-1.5 rounded-xl text-[10.5px] font-mono tracking-widest font-bold transition cursor-pointer flex items-center gap-1.5 border uppercase ${
                  activeTab === 'FUTURO'
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-inner'
                    : 'bg-slate-950/70 border-slate-900 text-slate-450 hover:text-slate-205'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                FUTUROS CÍCLICOS
              </button>
            </div>

            <button
              onClick={toggleLiveSync}
              className={`px-3 py-1 rounded-xl text-[10px] font-mono flex items-center gap-2 border transition shrink-0 ${
                isLiveSync 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${isLiveSync ? 'animate-spin' : ''}`} />
              {isLiveSync ? '➔ Tempo Real Ativo' : '⊙ Sincronizar Tempo Real'}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'HOJE' ? (
              <motion.div
                key="tab-hoje"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Temporal Tuner Forms */}
                <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-850 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Painel de Sintonização de Coordenadas</span>
                    {isLiveSync && (
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">
                        Hora atual: {currentClockTime.toLocaleTimeString('pt-BR')}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex bg-slate-900/60 rounded-xl px-3 py-2 border border-slate-800 focus-within:border-indigo-500/40 items-center justify-between">
                      <div className="flex items-center gap-2 w-full">
                        <Calendar className="w-4 h-4 text-slate-550 shrink-0" />
                        <input 
                          type="date"
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => handleManualDateChange(e.target.value)}
                          className="bg-transparent text-xs text-slate-200 focus:outline-none w-full cursor-pointer font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex bg-slate-900/60 rounded-xl px-3 py-2 border border-slate-800 focus-within:border-indigo-500/40 items-center justify-between font-mono">
                      <div className="flex items-center gap-2 w-full">
                        <Clock3 className="w-4 h-4 text-slate-550 shrink-0" />
                        <input 
                          type="time"
                          value={selectedDate.toTimeString().split(' ')[0].substring(0, 5)}
                          onChange={(e) => handleManualTimeChange(e.target.value)}
                          className="bg-transparent text-xs text-slate-200 focus:outline-none w-full cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1.5 flex-wrap gap-2.5 border-t border-slate-900/80">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase tracking-wide">
                      ⊙ {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} às {selectedDate.toTimeString().split(' ')[0].substring(0, 5)} {isLiveSync && '(Relógio Sincro)'}
                    </span>
                    
                    {!isLiveSync && (
                      <button
                        onClick={() => { setSelectedDate(new Date()); setIsLiveSync(true); }}
                        className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-400/25 hover:bg-indigo-500/20 text-[10.5px] font-mono rounded-xl transition text-indigo-305 hover:text-white cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                        Resetar P/ Agora
                      </button>
                    )}
                  </div>
                </div>

                {/* Primary Card: Real Moon Phase Placements */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/20 via-slate-950 to-slate-950 border border-indigo-500/10 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner shrink-0 leading-none select-none">
                        {phaseInfo.icon}
                      </div>
                      <div className="space-y-0.5">
                        <span className="px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-400/20 text-[9px] font-mono text-indigo-405 rounded block uppercase tracking-widest w-fit">
                          Fase Astronomia Real
                        </span>
                        <h3 className="text-base font-black font-sans text-white uppercase mt-1">
                          {t(phaseInfo.name)} ({Math.round(moonState.elongation / 3.6)}% {t("iluminada")})
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono text-[#E5C158] block uppercase font-bold">{t("Duração Real")}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {limits.startD.toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : 'pt-BR', { day: '2-digit', month: 'numeric' })} a {' '}
                        {limits.endD.toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : 'pt-BR', { day: '2-digit', month: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/50 p-3.5 rounded-xl border border-slate-900 space-y-1">
                    <p className="text-slate-300 font-medium">{phaseInfo.desc}</p>
                    <p className="text-[11px] text-slate-400 italic mt-1">{phaseInfo.energy}</p>
                  </div>

                  {/* Scorpio / Sign Placement Readout */}
                  <div className="flex gap-2.5 items-start p-3 bg-slate-950/80 rounded-xl border border-slate-900 text-xs text-slate-350 leading-relaxed font-sans">
                    <span className="text-indigo-400 text-sm leading-none mt-0.5">☄</span>
                    <div>
                      A Lua está posicionada nos exatos <strong className="text-indigo-300 font-mono font-bold">{moonState.moonDegree}º {moonState.moonMinute}'</strong> de <strong className="text-slate-105 font-bold">{moonState.moonSign}</strong> (Elemento de {medicalDetails.element}).
                    </div>
                  </div>
                </div>

                {/* Grid of 4 sectors affected */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">
                    Vetores de Impacto Diário: Lua em {moonState.moonSign}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Finance */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5 text-xs font-sans">
                        <h5 className="font-mono font-bold text-slate-205 uppercase">$ Finanças</h5>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {medicalDetails.finances}
                        </p>
                      </div>
                    </div>

                    {/* Relationships */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5 text-xs font-sans">
                        <h5 className="font-mono font-bold text-slate-205 uppercase">♥ Relacionamentos</h5>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {medicalDetails.relationships}
                        </p>
                      </div>
                    </div>

                    {/* Health */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5 text-xs font-sans">
                        <h5 className="font-mono font-bold text-slate-205 uppercase">✚ Saúde e Bem-estar</h5>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {medicalDetails.health}
                        </p>
                      </div>
                    </div>

                    {/* Beauty */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5 text-xs font-sans">
                        <h5 className="font-mono font-bold text-slate-205 uppercase">✦ Beleza e Autocuidado</h5>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed">
                          {medicalDetails.beauty}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="tab-futuro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Future feed list */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Calendário de Transições Celestiais Próximas</span>
                  <h4 className="text-xs font-bold text-slate-300">Próximos cruzamentos astronômicos de fases (com precisão de 15 minutos):</h4>
                </div>

                <div className="space-y-3 font-sans">
                  {futurePhases.map((phase, fIdx) => (
                    <div 
                      key={fIdx}
                      onClick={() => { setSelectedDate(phase.date); setIsLiveSync(false); setActiveTab('HOJE'); }}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 hover:border-indigo-500/30 transition flex justify-between items-center cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold text-lg select-none shrink-0" title="Ver sintonização desta data">
                          {phase.icon}
                        </span>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                            {phase.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} às {phase.date.toTimeString().substring(0, 5)}
                          </span>
                          <strong className="text-[11.5px] text-slate-205 group-hover:text-indigo-400 transition">
                            {phase.phaseName} em {phase.sign}
                          </strong>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-[9px] font-mono text-indigo-305 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-550/10 uppercase font-bold">Sintonizar</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-605 group-hover:text-indigo-500 transition group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Side: Map integrations, recommendations and calendars */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sensitive Organs Panel */}
          <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 space-y-4 text-left font-sans">
            <div className="pb-1.5 border-b border-slate-850 flex gap-2 items-center">
              <span className="text-xl">🧘</span>
              <div>
                <h4 className="text-xs font-bold font-mono text-slate-350 uppercase tracking-widest leading-none">Órgãos Mais Sensíveis Hoje</h4>
                <p className="text-[9.5px] text-slate-505 mt-1 leading-none">Suscetibilidade anatômica regida pela Lua em {moonState.moonSign}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {medicalDetails.organs.map((org, oIdx) => (
                <div key={oIdx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full shrink-0 flex items-center justify-center animate-pulse" />
                  <span className="text-slate-300 font-medium">{org} <span className="text-slate-500 font-normal text-[10.5px] font-mono">({moonState.moonSign} regência)</span></span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-bold">⚠ Alerta Clínico:</span>
              <span>Segundo as regras clássicas de astrologia médica, evite marcações de cirurgias pesadas e invasões diretas nos órgãos sensíveis do signo transitado hoje para evitar desgastes prolongados.</span>
            </div>
          </div>

          {/* Compatibility and Map Aligner */}
          <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 space-y-4 text-left font-sans">
            <div className="pb-1.5 border-b border-slate-850">
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 rounded uppercase font-bold">
                Interações de Trânsitos Com Seus Astros
              </span>
              <h4 className="text-xs font-bold font-mono text-slate-105 uppercase tracking-widest mt-1.5 font-bold">
                Cotejo Natal: {alignment.type}
              </h4>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 space-y-2">
              <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/20 font-mono text-[9px] rounded uppercase font-bold">
                {alignment.badge}
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {alignment.text}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-1">
                <span className="text-[8.5px] font-mono font-bold text-emerald-450 uppercase block">✓ Oportunidades</span>
                <p className="text-[10px] text-slate-350 leading-relaxed">{dynamicSutleAdvice.do}</p>
              </div>

              <div className="p-2.5 bg-red-500/5 border border-red-500/10 rounded-xl space-y-1">
                <span className="text-[8.5px] font-mono font-bold text-red-400 uppercase block">✗ Desafios / Evitar</span>
                <p className="text-[10px] text-slate-350 leading-relaxed">{dynamicSutleAdvice.avoid}</p>
              </div>
            </div>

            {/* Minim Quote */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[10.5px] text-indigo-305 italic relative leading-relaxed font-serif">
              <span className="absolute top-1 right-2 text-2xl text-slate-850 pointer-events-none select-none font-bold">“</span>
              {getDynamicMaxim()}
            </div>
          </div>

        </div>

      </div>

      {/* Calendário Lunar Interativo Grid View Section */}
      <div className="bg-slate-900/30 p-5 md:p-6 rounded-3xl border border-slate-800 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-850 gap-4">
          <div>
            <h3 className="text-xs font-black font-mono text-slate-300 uppercase tracking-widest">Calendário Lunar Interativo Projetado</h3>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">Role ou transite os dias para antecipar trânsitos, marés emocionais e favorabilidades celestes.</p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 font-mono text-[9px] font-bold">
            <button 
              onClick={() => setTimeStepFilter('7d')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeStepFilter === '7d' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-505/10 shadow' : 'text-slate-450'}`}
            >
              7 Dias
            </button>
            <button 
              onClick={() => setTimeStepFilter('30d')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeStepFilter === '30d' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-505/10 shadow' : 'text-slate-450'}`}
            >
              30 Dias
            </button>
            <button 
              onClick={() => setTimeStepFilter('3m')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeStepFilter === '3m' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-505/10 shadow' : 'text-slate-450'}`}
            >
              3 Meses
            </button>
          </div>
        </div>

        {/* Horizontally scrollable layout for long lists, perfect grid box for monthly views */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-10 gap-3 max-h-80 overflow-y-auto pr-1">
          {calendarDays.map((dayItem, dIdx) => {
            const isTodayCard = dayItem.date.toDateString() === selectedDate.toDateString();
            return (
              <div 
                key={dIdx}
                onClick={() => { setSelectedDate(dayItem.date); setIsLiveSync(false); }}
                className={`p-3 rounded-2xl border transition cursor-pointer select-none space-y-2 text-center text-xs flex flex-col justify-between ${
                  isTodayCard 
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow shadow-indigo-900/50' 
                    : 'bg-slate-950/70 border-slate-900 hover:border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono leading-none font-bold block">
                    {dayItem.date.getDate()} {dayItem.date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()}
                  </span>
                  <span className="text-[8px] text-slate-505 font-mono uppercase block">{dayItem.date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                </div>

                <div className="text-xl font-bold block select-none">
                  {dayItem.phase.icon}
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono block uppercase font-bold tracking-tight bg-slate-900 px-1 py-0.5 rounded border border-slate-850 truncate" title={dayItem.sign}>
                    {dayItem.sign}
                  </span>
                  <div className="flex justify-center gap-1.5">
                    {dayItem.isFavorable && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Dia Elementalmente Favorável" />}
                    {dayItem.isAttention && <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" title="Dia de Tensão Celestial" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legends */}
        <div className="flex flex-wrap gap-4 text-[9.5px] font-mono text-slate-500 pt-1 border-t border-slate-900 leading-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Filiamento Harmônico (Trítono/Elemento)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E5C158]" />
            <span>Dia de Atenção (Fricção Modabilidade)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 border border-indigo-500/50 rounded flex items-center justify-center bg-indigo-950/10 text-[7px]" />
            <span>Dia Ativamente Selecionado</span>
          </div>
        </div>
      </div>

      {/* Educational collapsing panel about Lunar Physics */}
      <div className="bg-slate-900/15 p-5 rounded-3xl border border-slate-800 space-y-4 text-left font-sans">
        <div className="pb-1.5 border-b border-slate-800">
          <h4 className="text-xs font-black font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            Símbolos e Ciências das 8 Lunações Clássicas
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {LUNAR_PHASES.map((ph, idx) => {
            const isDetailActive = activeFaqDetail === idx;
            return (
              <div 
                key={idx}
                className="bg-slate-950/80 p-3 rounded-2xl border border-slate-900 hover:border-slate-850 transition"
              >
                <div 
                  onClick={() => setActiveFaqDetail(isDetailActive ? null : idx)}
                  className="font-bold text-slate-205 flex justify-between items-center cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2 select-none">
                    <span>{ph.icon}</span> <span>{ph.name} ({idx+1}/8)</span>
                  </span>
                  <span className="text-xs font-mono text-indigo-400 text-[10px] font-bold">
                    {isDetailActive ? 'OCULTAR ▲' : 'DETALHES ▼'}
                  </span>
                </div>
                {isDetailActive && (
                  <div className="text-slate-400 mt-2.5 leading-relaxed font-sans text-[11px] space-y-1 animate-in fade-in duration-200">
                    <p className="text-slate-300 font-medium">{ph.desc}</p>
                    <p className="text-slate-500 italic border-l border-indigo-500/10 pl-2 mt-1">{ph.energy}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
