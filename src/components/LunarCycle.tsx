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
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { LUNAR_PHASES_TRANSLATIONS, SIGN_MEDICAL_TRANSLATED, LOCAL_UI_TRANSLATIONS } from '../lib/lunarTranslations';

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
  const { t: i18nT } = useTranslation();
  const activeL = (lang as Language) || 'pt';
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, activeL);
    }
    return res;
  };

  const tLocal = (ptText: string) => {
    if (activeL === 'pt') return ptText;
    const item = LOCAL_UI_TRANSLATIONS[ptText];
    if (item && item[activeL]) {
      return item[activeL];
    }
    return translateUiText(ptText, activeL);
  };
  
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
  const rawPhaseInfo = getPhaseInfo(moonState.elongation);
  const phaseTranslation = LUNAR_PHASES_TRANSLATIONS[rawPhaseInfo.key]?.[activeL];
  const phaseInfo = {
    ...rawPhaseInfo,
    name: phaseTranslation?.name || rawPhaseInfo.name,
    desc: phaseTranslation?.desc || rawPhaseInfo.desc,
    energy: phaseTranslation?.energy || rawPhaseInfo.energy,
  };
  const limits = getPhaseLimitsForDate(selectedDate);
  const medicalDetails = SIGN_MEDICAL_TRANSLATED[moonState.moonSign]?.[activeL] || SIGN_MEDICAL_TRANSLATED["Touro"]?.[activeL];

  // Compatibility engine: Moon transit Sign vs Natal Sun Sign
  const getNatalAlignment = () => {
    const transitMod = SIGN_MEDICAL_TRANSLATED[moonState.moonSign]?.[activeL]?.modality;
    const natalMod = SIGN_MEDICAL_TRANSLATED[userSunSign]?.[activeL]?.modality;
    const transitElem = SIGN_MEDICAL_TRANSLATED[moonState.moonSign]?.[activeL]?.element;
    const natalElem = SIGN_MEDICAL_TRANSLATED[userSunSign]?.[activeL]?.element;

    if (!transitMod || !natalMod) {
      return {
        type: { pt: 'Complementar', en: 'Complementary', es: 'Complementario', de: 'Komplementär', fr: 'Complémentaire' }[activeL] || 'Complementar',
        badge: { pt: '★ Apoio Sutil', en: '★ Subtle Support', es: '★ Apoyo Sutil', de: '★ Subtile Unterstützung', fr: '★ Soutien Subtil' }[activeL] || '★ Apoio Sutil',
        text: { 
          pt: 'O trânsito apoia dinâmicas saudáveis com sua órbita planetária solar de forma discreta.',
          en: 'The transit supports healthy dynamics with your solar planetary orbit in a discreet way.',
          es: 'El tránsito apoya dinámicas saludables con su órbita planetaria solar de manera discreta.',
          de: 'Der Transit unterstützt auf diskrete Weise eine gesunde Dynamik in Ihrer solaren Planetenbahn.',
          fr: 'Le transit soutient discrètement des dynamiques saines avec votre orbite planétaire solaire.'
        }[activeL] || 'O trânsito apoia dinâmicas saudáveis com sua órbita planetária solar de forma discreta.'
      };
    }

    if (moonState.moonSign === userSunSign) {
      return {
        type: { pt: 'Conjunção Lunar', en: 'Lunar Conjunction', es: 'Conjunción Lunar', de: 'Mondkonjunktion', fr: 'Conjonction Lunaire' }[activeL] || 'Conjunção Lunar',
        badge: { pt: '● Alinhamento Intenso', en: '● Intense Alignment', es: '● Alineación Intensa', de: '● Intensive Ausrichtung', fr: '● Alignement Intense' }[activeL] || '● Alinhamento Intenso',
        text: {
          pt: 'A Lua transita sobre o seu Sol Natal! Suas faculdades intuitivas, marés sentimentais e reações físicas estão unificadas em clareza máxima.',
          en: 'The Moon transits over your Natal Sun! Your intuitive faculties, emotional tides, and physical reactions are unified in maximum clarity.',
          es: '¡La Luna transita sobre tu Sol Natal! Tus facultades intuitivas, mareas sentimentales y reacciones físicas se unifican con la máxima claridad.',
          de: 'Der Mond zieht über Ihre Geburtsonne! Ihre intuitiven Fähigkeiten, emotionalen Gezeiten und körperlichen Reaktionen sind in maximaler Klarheit vereint.',
          fr: 'La Lune transite sur votre Soleil Natal ! Vos facultades intuitives, vos marées sentimentales et vos réactions physiques sont unifiées dans une clarté maximale.'
        }[activeL] || 'A Lua transita sobre o seu Sol Natal! Suas faculdades intuitivas, marés sentimentais e reações físicas estão unificadas em clareza máxima.'
      };
    }
    if (transitElem === natalElem) {
      const transitElemName = { pt: transitElem, en: { 'Fogo': 'Fire', 'Terra': 'Earth', 'Ar': 'Air', 'Água': 'Water' }[transitElem] || transitElem, es: { 'Fogo': 'Fuego', 'Terra': 'Tierra', 'Ar': 'Aire', 'Água': 'Agua' }[transitElem] || transitElem, de: { 'Fogo': 'Feuer', 'Terra': 'Erde', 'Ar': 'Luft', 'Água': 'Wasser' }[transitElem] || transitElem, fr: { 'Fogo': 'Feu', 'Terra': 'Terre', 'Ar': 'Air', 'Água': 'Eau' }[transitElem] || transitElem }[activeL] || transitElem;
      const userSunSignName = translateUiText(userSunSign, activeL);
      return {
        type: { pt: 'Trígono Elemental', en: 'Elemental Trine', es: 'Trígono Elemental', de: 'Elementares Trigon', fr: 'Trigone Élémentaire' }[activeL] || 'Trígono Elemental',
        badge: { pt: '▲ Harmonia Fluida', en: '▲ Fluid Harmony', es: '▲ Armonía Fluida', de: '▲ Fließende Harmonie', fr: '▲ Harmonie Fluide' }[activeL] || '▲ Harmonia Fluida',
        text: {
          pt: `Excelente sintonia de elemento de ${transitElemName}. Seus sentimentos e impulsos íntimos cooperam de forma pacífica com sua essência consciente de ${userSunSignName}.`,
          en: `Excellent element alignment of ${transitElemName}. Your feelings and intimate impulses cooperate peacefully with your conscious essence of ${userSunSignName}.`,
          es: `Excelente sintonía de elemento de ${transitElemName}. Tus sentimientos e impulsos íntimos cooperan de forma pacífica con tu esencia consciente de ${userSunSignName}.`,
          de: `Hervorragende Übereinstimmung des Elements ${transitElemName}. Ihre Gefühle und inneren Impulse kooperieren friedlich mit Ihrem bewussten Wesen von ${userSunSignName}.`,
          fr: `Excellent alignement d'élément de ${transitElemName}. Vos sentiments et impulsions intimes coopèrent de manière pacifique avec votre essence consciente de ${userSunSignName}.`
        }[activeL] || `Excelente sintonia de elemento de ${transitElemName}. Seus sentimentos e impulsos íntimos cooperam de forma pacífica com sua essência consciente de ${userSunSignName}.`
      };
    }
    if (transitMod === natalMod) {
      const indices = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
      const tIdx = indices.indexOf(moonState.moonSign);
      const nIdx = indices.indexOf(userSunSign);
      if (Math.abs(tIdx - nIdx) === 6) {
        const moonSignName = translateUiText(moonState.moonSign, activeL);
        return {
          type: { pt: 'Oposição Celestial', en: 'Celestial Opposition', es: 'Oposición Celestial', de: 'Himmlische Opposition', fr: 'Opposition Céleste' }[activeL] || 'Oposição Celestial',
          badge: { pt: '➔ Polaridade / Espelho', en: '➔ Polarity / Mirror', es: '➔ Polaridad / Espejo', de: '➔ Polarität / Spiegel', fr: '➔ Polarité / Miroir' }[activeL] || '➔ Polaridade / Espelho',
          text: {
            pt: `Eixo de polaridade ativo. Seus sentimentos pedem ponderação entre suas vontades íntimas e desejos externos trazidos pelo signo oposto, ${moonState.moonSign}.`,
            en: `Active polarity axis. Your feelings call for balance between your inner desires and external wishes brought by the opposite sign, ${moonSignName}.`,
            es: `Eje de polaridad activo. Tus sentimientos piden ponderación entre tus deseos internos y los deseos externos traídos por el signo opuesto, ${moonSignName}.`,
            de: `Aktive Polaritätsachse. Ihre Gefühle verlangen ein Abwägen zwischen Ihren inneren Wünschen und den äußeren Bestrebungen, die das entgegengesetzte Zeichen, ${moonSignName}, mit sich bringt.`,
            fr: `Axe de polarité actif. Vos sentiments appellent à un équilibre entre vos désirs intérieurs et les souhaits extérieurs apportés par le signe opposé, ${moonSignName}.`
          }[activeL] || `Eixo de polaridade ativo. Seus sentimentos pedem ponderação entre suas vontades íntimas e desejos externos trazidos pelo signo oposto, ${moonState.moonSign}.`
        };
      }
      return {
        type: { pt: 'Quadratura Desafiadora', en: 'Challenging Square', es: 'Cuadratura Desafiadora', de: 'Herausforderndes Quadrat', fr: 'Carré Stimulant' }[activeL] || 'Quadratura Desafiadora',
        badge: { pt: '✦ Tensão Construtiva', en: '✦ Constructive Tension', es: '✦ Tensión Constructiva', de: '✦ Konstruktive Spannung', fr: '✦ Tension Constructive' }[activeL] || '✦ Tensão Construtiva',
        text: {
          pt: 'Ângulo de quadratura instigante. Há pequenos atritos corporais ou ansiedades que convidam você a tomar decisões ativas e sair do conforto rotineiro.',
          en: 'Intriguing square angle. There are minor body frictions or anxieties inviting you to make active decisions and step out of your comfort zone.',
          es: 'Ángulo de cuadratura intrigante. Hay pequeñas fricciones corporales o ansiedades que te invitan a tomar decisiones activas y salir de la zona de confort.',
          de: 'Anregender Quadratwinkel. Es gibt kleine körperliche Reibungen oder Ängste, die Sie einladen, aktive Entscheidungen zu treffen und die Komfortzone zu verlassen.',
          fr: 'Angle de carré intrigant. Il y a de légères frictions corporelles ou des anxiétés qui vous invitent à prendre des décisions actives et à sortir de votre zone de confort.'
        }[activeL] || 'Ângulo de quadratura instigante. Há pequenos atritos corporais ou ansiedades que convidam você a tomar decisões ativas e sair do conforto rotineiro.'
      };
    }
    return {
      type: { pt: 'Sextil Colaborativo', en: 'Collaborative Sextile', es: 'Sextil Colaborativo', de: 'Kollaborativer Sextil', fr: 'Sextile Collaboratif' }[activeL] || 'Sextil Colaborativo',
      badge: { pt: '◆ Oportunidade Sutil', en: '◆ Subtle Opportunity', es: '◆ Oportunidad Sutil', de: '◆ Subtile Gelegenheit', fr: '◆ Opportunité Subtile' }[activeL] || '◆ Oportunidade Sutil',
      text: {
        pt: 'Harmonia leve de cooperação solar e lunar. Excelente para alinhar oratórias práticas, redigir contratos ou programar metas secundárias.',
        en: 'Light harmony of solar and lunar cooperation. Excellent for aligning practical talks, writing contracts, or setting secondary goals.',
        es: 'Armonía leve de cooperación solar y lunar. Excelente para alinear oratorias prácticas, redactar contratos o programar metas secundarias.',
        de: 'Leichte Harmonie aus solarer und lunarer Kooperation. Hervorragend geeignet zur Abstimmung praktischer Reden, zur Ausarbeitung von Verträgen oder zur Planung sekundärer Ziele.',
        fr: 'Légère harmonie de coopération solaire et lunaire. Excellent pour aligner des discours pratiques, rédiger des contrats ou planifier des objectifs secondaires.'
      }[activeL] || 'Harmonia leve de cooperação solar e lunar. Excelente para alinhar oratórias práticas, redigir contratos ou programar metas secundárias.'
    };
  };

  const alignment = getNatalAlignment();

  // Dynamic advice maxim based on Moon phase
  const getDynamicMaxim = () => {
    const maxims: Record<string, Record<Language, string>> = {
      nova: {
        pt: "“O silêncio é o útero fértil onde a mente sóbria desenha suas próximas grandes conquistas.”",
        en: "“Silence is the fertile womb where the sober mind designs its next great achievements.”",
        es: "“El silencio es el útero fértil donde la mente sobria diseña sus próximas grandes conquistas.”",
        de: "“Stille ist der fruchtbare Schoß, in dem der nüchterne Geist seine nächsten großen Erfolge entwirft.”",
        fr: "“Le silence est l'utérus fertile où l'esprit sobre conçoit ses prochaines grandes réalisations.”"
      },
      crescente: {
        pt: "“A força primordial do progresso exige superarmos com audácia o conforto da inércia diária.”",
        en: "“The primordial force of progress demands that we boldly overcome the comfort of daily inertia.”",
        es: "“La fuerza primordial del progreso exige superar con audacia la comodidad de la inercia diaria.”",
        de: "“Die Urkraft des Fortschritts verlangt, dass wir die Bequemlichkeit der täglichen Trägheit kühn überwinden.”",
        fr: "“La force primordiale du progrès exige que nous surmontions avec audace le confort de l'inertie quotidienne.”"
      },
      quarto_crescente: {
        pt: "“Todo obstáculo que se ergue à sua frente serve de alavanca para consolidar sua própria maestria.”",
        en: "“Every obstacle that rises in front of you serves as a lever to consolidate your own mastery.”",
        es: "“Cada obstáculo que se presenta ante ti sirve de palanca para consolidar tu propia maestría.”",
        de: "“Jedes Hindernis, das sich vor Ihnen erhebt, dient als Hebel, um Ihre eigene Meisterschaft zu festigen.”",
        fr: "“Chaque obstacle qui se dresse devant vous sert de levier pour consolider votre propre maîtrise.”"
      },
      gibosa: {
        pt: "“O burilamento dedicado nos menores pormenores antecede o brilho das grandes colheitas.”",
        en: "“Dedicated refinement in the smallest details precedes the shine of great harvests.”",
        es: "“El refinamiento dedicado en los detalles más pequeños precede al brillo de las grandes cosechas.”",
        de: "“Die engagierte Verfeinerung bis ins kleinste Detail geht dem Glanz großer Ernten voraus.”",
        fr: "“Le raffinement dédié aux plus petits détails précède l'éclat des grandes récoltes.”"
      },
      cheia: {
        pt: "“Quando as emoções transbordam em abundância, a colheita plena revela quem de fato somos.”",
        en: "“When emotions overflow in abundance, the full harvest reveals who we truly are.”",
        es: "“Cuando las emociones se desbordan en abundancia, la cosecha completa revela quiénes somos realmente.”",
        de: "“Wenn die Gefühle im Überfluss überquellen, offenbart die reiche Ernte, wer wir wirklich sind.”",
        fr: "“Quand les émotions débordent en abondance, la récolte pleine révèle qui nous sommes vraiment.”"
      },
      disseminadora: {
        pt: "“A sabedoria retida estagna-se; apenas ao ensinarmos e distribuirmos, florescemos eternamente.”",
        en: "“Retained wisdom stagnates; only when we teach and distribute do we flourish eternally.”",
        es: "“La sabiduría retenida se estanca; solo cuando enseñamos y distribuimos florecemos eternamente.”",
        de: "“Zurückgehaltene Weisheit stagniert; nur wenn wir lehren und verteilen, gedeihen wir ewig.”",
        fr: "“La sagesse retenue stagne ; ce n'est que lorsque nous enseignons et partageons que nous nous épanouissons éternellement.”"
      },
      quarto_minguante: {
        pt: "“Saber separar o joio do trigo é a prudência kármica que limpa o solo da nossa alma.”",
        en: "“Knowing how to separate the wheat from the chaff is the karmic prudence that cleanses our soul's soil.”",
        es: "“Saber separar la paja del trigo es la cuzdrência kármica que limpia el suelo de nuestra alma.”",
        de: "“Die Spreu vom Weizen zu trennen, ist die karmische Klugheit, die den Boden unserer Seele reinigt.”",
        fr: "“Savoir séparer le bon grain de l'ivraie est la prudence karmique qui purifie le sol de notre âme.”"
      }
    };
    const defaultMaxim = {
      pt: "“As dores pretéritas transmutam-se em pura sabedoria no santuário acolhedor da quietude.”",
      en: "“Past pains transmute into pure wisdom in the welcoming sanctuary of quietude.”",
      es: "“Los dolores pasados se transmutan en pura sabiduría en el santuario acogedor de la quietud.”",
      de: "“Vergangene Schmerzen verwandeln sich im einladenden Heiligtum der Stille in reine Weisheit.”",
      fr: "“Les douleurs passées se transmutent en pure sagesse dans le sanctuaire accueillant de la quiétude.”"
    };

    const item = maxims[phaseInfo.key];
    if (item && item[activeL]) {
      return item[activeL];
    }
    return defaultMaxim[activeL] || defaultMaxim["pt"];
  };

  const getSutleAdvice = () => {
    const advices: Record<string, Record<Language, { do: string; avoid: string; protect: string }>> = {
      nova: {
        pt: { do: 'Semeie intenções estruturadas e planeje inícios ocultos.', avoid: 'Evite expor seus sonhos primordiais a mentes incrédulas.', protect: 'Defenda sua paz íntima meditando em quartos recolhidos.' },
        en: { do: 'Sow structured intentions and plan hidden beginnings.', avoid: 'Avoid exposing your primary dreams to disbelieving minds.', protect: 'Defend your inner peace by meditating in secluded rooms.' },
        es: { do: 'Siembre intenciones estructuradas y planifique inicios ocultos.', avoid: 'Evite exponer sus sueños primordiales a mentes incrédulas.', protect: 'Defienda su paz íntima meditando en habitaciones recogidas.' },
        de: { do: 'Säen Sie strukturierte Absichten und planen Sie verborgene Anfänge.', avoid: 'Vermeiden Sie es, Ihre primären Träume ungläubigen Geistern zu offenbaren.', protect: 'Verteidigen Sie Ihren inneren Frieden, indem Sie in abgelegenen Räumen meditieren.' },
        fr: { do: 'Semez des intentions structurées et planifiez des débuts cachés.', avoid: 'Évitez d\'exposer vos rêves premiers à des esprits incrédules.', protect: 'Défendez votre paix intérieure en méditant dans des pièces isolées.' }
      },
      crescente: {
        pt: { do: 'Dedique energia física extra no avanço dos projetos.', avoid: 'Evite retroceder mediante desconfianças externas passageiras.', protect: 'Consuma banhos de sálvia ou alecrim para blindar o vigor.' },
        en: { do: 'Dedicate extra physical energy to advancing projects.', avoid: 'Avoid backsliding due to passing external distrust.', protect: 'Take sage or rosemary baths to shield vigor.' },
        es: { do: 'Dedique energía física adicional al avance de los proyectos.', avoid: 'Evite retroceder ante desconfianzas externas pasajeras.', protect: 'Tome baños de salvia o romero para blindar el vigor.' },
        de: { do: 'Widmen Sie zusätzliche körperliche Energie dem Vorankommen von Projekten.', avoid: 'Vermeiden Sie Rückschritte aufgrund vorübergehenden externen Misstrauens.', protect: 'Nehmen Sie Salbei- oder Rosmarinsbäder, um Ihre Lebenskraft zu schützen.' },
        fr: { do: 'Consacrez de l\'énergie physique supplémentaire à l\'avancement des projets.', avoid: 'Évitez de reculer face aux méfiances extérieures passagères.', protect: 'Prenez des bains de sauge ou de romarin pour protéger votre vigueur.' }
      },
      quarto_crescente: {
        pt: { do: 'Tome as decisões necessárias com firmeza total.', avoid: 'Evite contornar os nós difíceis; encare-os com racionalidade.', protect: 'Faça exercícios de respiração diafragmática para acalmar a mente.' },
        en: { do: 'Make necessary decisions with complete firmness.', avoid: 'Avoid bypassing difficult knots; face them with rationality.', protect: 'Do diaphragmatic breathing exercises to calm the mind.' },
        es: { do: 'Tome las decisiones necesarias con firmeza total.', avoid: 'Evite esquivar los nudos difíciles; enfréntelos con racionalidad.', protect: 'Realice ejercicios de respiración diafragmática para calmar la mente.' },
        de: { do: 'Treffen Sie notwendige Entscheidungen mit absoluter Entschlossenheit.', avoid: 'Vermeiden Sie es, schwierige Knoten zu umgehen; begegnen Sie ihnen mit Rationalität.', protect: 'Machen Sie Zwerchfellatmungsübungen, um den Geist zu beruhigen.' },
        fr: { do: 'Prenez les décisions nécessaires with une fermeté totale.', avoid: 'Évitez de contourner les nœuds difficiles ; affrontez-les avec rationalité.', protect: 'Faites des exercices de respiration diaphragmatique pour calmer l\'esprit.' }
      },
      gibosa: {
        pt: { do: 'Revise contratos, refine planilhas e faça ajustes práticos.', avoid: 'Evite apressar entregas sem antes checar as entrelinhas burocráticas.', protect: 'Evite ambientes barulhentos para focar no foco intelectual.' },
        en: { do: 'Review contracts, refine spreadsheets, and make practical adjustments.', avoid: 'Avoid rushing deliveries without first checking bureaucratic fine print.', protect: 'Avoid noisy environments to focus on intellectual concentration.' },
        es: { do: 'Revise contratos, refine planillas y realice ajustes prácticos.', avoid: 'Evite apresurar entregas sin antes revisar las líneas pequeñas burocráticas.', protect: 'Evite ambientes ruidosos para concentrarse en el enfoque intelectual.' },
        de: { do: 'Überprüfen Sie Verträge, verfeinern Sie Tabellen und nehmen Sie praktische Anpassungen vor.', avoid: 'Vermeiden Sie überstürzte Lieferungen, ohne vorher das bürokratische Kleingedruckte zu prüfen.', protect: 'Vermeiden Sie laute Umgebungen, um sich auf die intellektuelle Konzentration zu fokussieren.' },
        fr: { do: 'Révisez les contrats, affinez les feuilles de calcul et faites des ajustements pratiques.', avoid: 'Évitez de précipiter les livraisons sans avoir vérifié les petits caractères administratifs.', protect: 'Évitez les environnements bruyants pour vous concentrer sur l\'aspect intellectuel.' }
      },
      cheia: {
        pt: { do: 'Apresente-se publicamente e desfrute de interações fáceis.', avoid: 'Evite tomar decisões frias sob sentimentos turbulentos.', protect: 'Use pedras de quartzo rosa ou ametista para balancear o peito.' },
        en: { do: 'Present yourself publicly and enjoy easy interactions.', avoid: 'Avoid making cold decisions under turbulent feelings.', protect: 'Use rose quartz or amethyst stones to balance your chest.' },
        es: { do: 'Preséntese públicamente y disfrute de interacciones fáciles.', avoid: 'Evite tomar decisiones frías bajo sentimientos turbulentos.', protect: 'Use piedras de cuarzo rosa o amatista para equilibrar el pecho.' },
        de: { do: 'Präsentieren Sie sich öffentlich und genießen Sie einfache Interaktionen.', avoid: 'Vermeiden Sie es, kalte Entscheidungen unter turbulenten Gefühlen zu treffen.', protect: 'Verwenden Sie Rosenquarz- oder Amethyststeine, um Ihre Brustenergie auszugleichen.' },
        fr: { do: 'Présentez-vous publiquement et profitez d\'interactions fluides.', avoid: 'Évitez de prendre des décisions froides sous le coup d\'émotions turbulentes.', protect: 'Utilisez des pierres de quartz rose ou d\'améthyste pour équilibrer le plexus.' }
      },
      disseminadora: {
        pt: { do: 'Compartilhe seus resultados e ofereça mentoria generosa.', avoid: 'Evite impor dogmas rígidos a quem não está pronto para ouvir.', protect: 'Pratique doações fraternas para destravar o fluxo de Saturno.' },
        en: { do: 'Share your results and offer generous mentoring.', avoid: 'Avoid imposing rigid dogmas on those not ready to hear.', protect: 'Practice fraternal donations to unlock the flow of Saturn.' },
        es: { do: 'Comparta sus resultados y ofrezca mentorías generosas.', avoid: 'Evite imponer dogmas rígidos a quienes no están listos para escuchar.', protect: 'Practique donaciones fraternas para desbloquear el flujo de Saturno.' },
        de: { do: 'Teilen Sie Ihre Ergebnisse und bieten Sie großzügiges Mentoring an.', avoid: 'Vermeiden Sie es, Personen, die nicht bereit sind zuzuhören, starre Dogmen aufzuerlegen.', protect: 'Praktizieren Sie brüderliche Spenden, um den Fluss Saturns freizusetzen.' },
        fr: { do: 'Partagez vos résultats et offrez un mentorat généreux.', avoid: 'Évitez d\'imposer des dogmes rigides à ceux qui ne sont pas prêts à écouter.', protect: 'Pratiquez des dons fraternels pour débloquer le flux de Saturne.' }
      },
      quarto_minguante: {
        pt: { do: 'Defina pendências latentes e limpe gavetas corporáticas.', avoid: 'Evite assinar novos inícios que exijam manutenção extrema future.', protect: 'Acenda incensos de lavanda ou mirra para banir poeiras astrais.' },
        en: { do: 'Settle latent pending issues and clean corporate drawers.', avoid: 'Avoid signing new beginnings that require extreme future maintenance.', protect: 'Light lavender or myrrh incense to banish astral dust.' },
        es: { do: 'Defina pendientes latentes y limpie cajones corporativos.', avoid: 'Evite firmar nuevos inicios que requieran un mantenimiento futuro extremo.', protect: 'Encienda inciensos de lavanda o mirra para desterrar el polvo astral.' },
        de: { do: 'Regeln Sie latente offene Fragen und räumen Sie Unternehmensschubladen auf.', avoid: 'Vermeiden Sie den Abschluss neuer Anfänge, die zukünftig extreme Wartung erfordern.', protect: 'Zünden Sie Lavendel- oder Myrrhe-Räucherstäbchen an, um astralen Staub zu vertreiben.' },
        fr: { do: 'Réglez les affaires en cours et faites du tri dans vos dossiers.', avoid: 'Évitez de vous engager dans de nouveaux projets exigeant un entretien futur extrême.', protect: 'Faites brûler de l\'encens de lavande ou de myrrhe pour bannir les poussières astrales.' }
      }
    };
    const defaultAdvice = {
      pt: { do: 'Descanse profundamente o corpo físico e medite recolhido.', avoid: 'Evite agendas cheias de compromissos sociais barulhentos.', protect: 'Isole-se energeticamente no aconchego de sua biblioteca mental.' },
      en: { do: 'Deeply rest the physical body and meditate secluded.', avoid: 'Avoid schedules full of noisy social commitments.', protect: 'Isolate yourself energetically in the comfort of your mental library.' },
      es: { do: 'Descanse profundamente el cuerpo físico y medite recogido.', avoid: 'Evite agendas llenas de compromisos sociales ruidosos.', protect: 'Aíslese energéticamente en la calidez de su biblioteca mental.' },
      de: { do: 'Gönnen Sie dem physischen Körper tiefe Ruhe und meditieren Sie zurückgezogen.', avoid: 'Vermeiden Sie volle Terminkalender mit lauten sozialen Verpflichtungen.', protect: 'Isolieren Sie sich energetisch in der Gemütlichkeit Ihrer mentalen Bibliothek.' },
      fr: { do: 'Reposez-vous profondément et méditez dans le calme.', avoid: 'Évitez les agendas surchargés de rendez-vous sociaux bruyants.', protect: 'Isolez-vous énergétiquement dans le confort de votre bibliothèque mentale.' }
    };

    const item = advices[phaseInfo.key];
    if (item && item[activeL]) {
      return item[activeL];
    }
    return defaultAdvice[activeL] || defaultAdvice["pt"];
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

  const calendarDaysRaw = getCalendarDays();
  const calendarDays = calendarDaysRaw.map(dayItem => {
    const pTranslation = LUNAR_PHASES_TRANSLATIONS[dayItem.phase.key]?.[activeL];
    return {
      ...dayItem,
      sign: translateUiText(dayItem.sign, activeL),
      phase: {
        ...dayItem.phase,
        name: pTranslation?.name || dayItem.phase.name,
        desc: pTranslation?.desc || dayItem.phase.desc,
        energy: pTranslation?.energy || dayItem.phase.energy,
      }
    };
  });

  const futurePhasesRaw = getFuturePhasesForDate(selectedDate, 6);
  const futurePhases = futurePhasesRaw.map(phase => {
    const rawPhase = LUNAR_PHASES[phase.phaseIdx];
    const pTranslation = LUNAR_PHASES_TRANSLATIONS[rawPhase.key]?.[activeL];
    return {
      ...phase,
      phaseName: pTranslation?.name || phase.phaseName,
      desc: pTranslation?.desc || phase.desc,
      sign: translateUiText(phase.sign, activeL)
    };
  });

  return (
    <div id="realt-lunar-cycle-system" className="space-y-6 text-left">
      
      {/* Intro Header Banner */}
      <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2 leading-none">
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse shrink-0" />
              {t("Sintonização Gravitacional Universal")}
            </h3>
            <h2 className="text-lg font-black font-sans uppercase tracking-tight text-white flex items-center gap-2.5">
              <MoonStar className="w-5 h-5 text-indigo-305" /> {t("Ciclo Lunar em Tempo Real")}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-950/40 text-indigo-300 font-mono text-[9.5px] rounded-lg border border-indigo-900 leading-none">
              {t("★ Livre - Acesso Ilimitado")}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-350 leading-relaxed font-sans">
          {userName ? (
            <>
              {t("Olá,")} <strong className="text-indigo-300 font-bold">{userName}</strong> ({t("Sol em")} <strong className="text-amber-400 font-semibold">{t(userSunSign)}</strong>, {t("Ascendente em")} <strong className="text-pink-400 font-semibold">{t(userAscendant)}</strong>). {t("O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu para o seu mapa pessoal.")}
            </>
          ) : (
            <>
              {t("O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu.")} <strong className="text-indigo-300">{t("Crie seu mapa astral para desbloquear análises personalizadas e preencha seus dados para iniciar sua jornada.")}</strong>
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
                {t("HOJE CORRENTE")}
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
                {t("FUTUROS CÍCLICOS")}
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
              {isLiveSync ? t('➔ Tempo Real Ativo') : t('⊙ Sincronizar Tempo Real')}
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
                      ⊙ {selectedDate.toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : 'pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} {t("às")} {selectedDate.toTimeString().split(' ')[0].substring(0, 5)} {isLiveSync && `(${t("Relógio Sincro")})`}
                    </span>
                    
                    {!isLiveSync && (
                      <button
                        onClick={() => { setSelectedDate(new Date()); setIsLiveSync(true); }}
                        className="px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-400/25 hover:bg-indigo-500/20 text-[10.5px] font-mono rounded-xl transition text-indigo-305 hover:text-white cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                        {t("Resetar P/ Agora")}
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
                            {phase.date.toLocaleDateString(activeL === 'en' ? 'en-US' : activeL === 'es' ? 'es-ES' : activeL === 'de' ? 'de-DE' : activeL === 'fr' ? 'fr-FR' : 'pt-BR', { day: '2-digit', month: 'long' })} {tLocal('às')} {phase.date.toTimeString().substring(0, 5)}
                          </span>
                          <strong className="text-[11.5px] text-slate-205 group-hover:text-indigo-400 transition">
                            {phase.phaseName} {tLocal('em')} {phase.sign}
                          </strong>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-[9px] font-mono text-indigo-305 bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-550/10 uppercase font-bold">{tLocal('Sintonizar')}</span>
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
                <h4 className="text-xs font-bold font-mono text-slate-350 uppercase tracking-widest leading-none">{tLocal('Órgãos Mais Sensíveis Hoje')}</h4>
                <p className="text-[9.5px] text-slate-505 mt-1 leading-none">{tLocal('Suscetibilidade anatômica regida pela Lua em')} {translateUiText(moonState.moonSign, activeL)}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {medicalDetails.organs.map((org, oIdx) => (
                <div key={oIdx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full shrink-0 flex items-center justify-center animate-pulse" />
                  <span className="text-slate-300 font-medium">{org} <span className="text-slate-500 font-normal text-[10.5px] font-mono">({translateUiText(moonState.moonSign, activeL)} {tLocal('regência')})</span></span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed">
              <span className="text-amber-400 font-bold">⚠ {tLocal('Alerta Clínico:')}</span>
              <span>{tLocal('Segundo as regras clássicas de astrologia médica, evite marcações de cirurgias pesadas e invasões diretas nos órgãos sensíveis do signo transitado hoje para evitar desgastes prolongados.')}</span>
            </div>
          </div>

          {/* Compatibility and Map Aligner */}
          <div className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800 space-y-4 text-left font-sans">
            <div className="pb-1.5 border-b border-slate-850">
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 rounded uppercase font-bold">
                {tLocal('Interações de Trânsitos Com Seus Astros')}
              </span>
              <h4 className="text-xs font-bold font-mono text-slate-105 uppercase tracking-widest mt-1.5 font-bold">
                {tLocal('Cotejo Natal:')} {alignment.type}
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
                <span className="text-[8.5px] font-mono font-bold text-emerald-450 uppercase block">{tLocal('✓ Oportunidades')}</span>
                <p className="text-[10px] text-slate-350 leading-relaxed">{dynamicSutleAdvice.do}</p>
              </div>

              <div className="p-2.5 bg-red-500/5 border border-red-500/10 rounded-xl space-y-1">
                <span className="text-[8.5px] font-mono font-bold text-red-400 uppercase block">{tLocal('✗ Desafios / Evitar')}</span>
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
            <h3 className="text-xs font-black font-mono text-slate-300 uppercase tracking-widest">{tLocal('Calendário Lunar Interativo Projetado')}</h3>
            <p className="text-[10px] text-slate-500 font-sans mt-0.5">{tLocal('Role ou transite os dias para antecipar trânsitos, marés emocionais e favorabilidades celestes.')}</p>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 font-mono text-[9px] font-bold">
            <button 
              onClick={() => setTimeStepFilter('7d')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeStepFilter === '7d' ? 'bg-indigo-500/15 text-indigo-305 border border-indigo-550/10 shadow' : 'text-slate-450'}`}
            >
              {tLocal('7 Dias')}
            </button>
            <button 
              onClick={() => setTimeStepFilter('30d')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeStepFilter === '30d' ? 'bg-indigo-500/15 text-indigo-305 border border-indigo-550/10 shadow' : 'text-slate-450'}`}
            >
              {tLocal('30 Dias')}
            </button>
            <button 
              onClick={() => setTimeStepFilter('3m')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${timeStepFilter === '3m' ? 'bg-indigo-500/15 text-indigo-305 border border-indigo-550/10 shadow' : 'text-slate-450'}`}
            >
              {tLocal('3 Meses')}
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
                    {dayItem.date.getDate()} {dayItem.date.toLocaleDateString(activeL === 'en' ? 'en-US' : activeL === 'es' ? 'es-ES' : activeL === 'de' ? 'de-DE' : activeL === 'fr' ? 'fr-FR' : 'pt-BR', { month: 'short' }).replace('.', '').toUpperCase()}
                  </span>
                  <span className="text-[8px] text-slate-505 font-mono uppercase block">{dayItem.date.toLocaleDateString(activeL === 'en' ? 'en-US' : activeL === 'es' ? 'es-ES' : activeL === 'de' ? 'de-DE' : activeL === 'fr' ? 'fr-FR' : 'pt-BR', { weekday: 'short' })}</span>
                </div>

                <div className="text-xl font-bold block select-none">
                  {dayItem.phase.icon}
                </div>

                <div className="space-y-1">
                  <span className="text-[8.5px] font-mono block uppercase font-bold tracking-tight bg-slate-900 px-1 py-0.5 rounded border border-slate-850 truncate" title={dayItem.sign}>
                    {dayItem.sign}
                  </span>
                  <div className="flex justify-center gap-1.5">
                    {dayItem.isFavorable && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title={tLocal("Dia Elementalmente Favorável")} />}
                    {dayItem.isAttention && <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" title={tLocal("Dia de Tensão Celestial")} />}
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
            <span>{tLocal("Filiamento Harmônico (Trítono/Elemento)")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E5C158]" />
            <span>{tLocal("Dia de Atenção (Fricção Modabilidade)")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 border border-indigo-500/50 rounded flex items-center justify-center bg-indigo-950/10 text-[7px]" />
            <span>{tLocal("Dia Ativamente Selecionado")}</span>
          </div>
        </div>
      </div>

      {/* Educational collapsing panel about Lunar Physics */}
      <div className="bg-slate-900/15 p-5 rounded-3xl border border-slate-800 space-y-4 text-left font-sans">
        <div className="pb-1.5 border-b border-slate-800">
          <h4 className="text-xs font-black font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            {tLocal("Símbolos e Ciências das 8 Lunações Clássicas")}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {LUNAR_PHASES.map((ph, idx) => {
            const isDetailActive = activeFaqDetail === idx;
            const phTranslation = LUNAR_PHASES_TRANSLATIONS[ph.key]?.[activeL];
            const name = phTranslation?.name || ph.name;
            const desc = phTranslation?.desc || ph.desc;
            const energy = phTranslation?.energy || ph.energy;
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
                    <span>{ph.icon}</span> <span>{name} ({idx+1}/8)</span>
                  </span>
                  <span className="text-xs font-mono text-indigo-400 text-[10px] font-bold">
                    {isDetailActive ? tLocal('OCULTAR ▲') : tLocal('DETALHES ▼')}
                  </span>
                </div>
                {isDetailActive && (
                  <div className="text-slate-400 mt-2.5 leading-relaxed font-sans text-[11px] space-y-1 animate-in fade-in duration-200">
                    <p className="text-slate-300 font-medium">{desc}</p>
                    <p className="text-slate-500 italic border-l border-indigo-500/10 pl-2 mt-1">{energy}</p>
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
