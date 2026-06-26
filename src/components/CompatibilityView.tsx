import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { CompatibilityResult, UserProfile } from '../types';
import { computeDetailedCompatibility } from './compatibilityEngine';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Plus, 
  AlertCircle, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Check, 
  RotateCcw,
  Compass,
  Star,
  Eye,
  Search,
  SlidersHorizontal,
  Filter,
  Clock,
  Globe,
  Calendar,
  Zap,
  TrendingUp,
  Lock,
  ShieldAlert,
  Smile,
  Info
} from 'lucide-react';

interface CompatibilityViewProps {
  user: UserProfile;
  lang?: string;
}

interface SavedContact {
  id: string;
  name: string;
  birthDate: string;
  relationType: 'love' | 'friend' | 'business';
  love: number;
  friendship: number;
  business: number;
  communication: number;
  harmony: number;
}

// Highly polished custom 8 profiles for "Curtidas recebidas" astrológicas
const LIKES_RECEIVED = [
  {
    id: "like_1",
    name: "Beatriz Castro",
    age: 24,
    sign: "Câncer",
    symbol: "♋",
    match: 96,
    location: "São Paulo, SP",
    avatarColor: "from-pink-500 to-rose-500",
    description: "Sente uma conexão magnética de almas desde o primeiro instante no mapa solar.",
    weakness: "Vulnerabilidade emocional profunda de carinho",
    strength: "Cuidado íntimo, intuição sinérgica ativa",
    bestDay: "Segundas de Lua Cheia"
  },
  {
    id: "like_2",
    name: "Mariana Lins",
    age: 27,
    sign: "Escorpião",
    symbol: "♏",
    match: 91,
    location: "Rio de Janeiro, RJ",
    avatarColor: "from-purple-600 to-indigo-700",
    description: "As posições de Vênus indicam forte atração cósmica e conversas profundas transformadoras.",
    weakness: "Excesso de mistério inicial receptivo",
    strength: "Lealdade absoluta, paixão intelectual",
    bestDay: "Terças regidas por Marte celeste"
  },
  {
    id: "like_3",
    name: "Juliana Ribeiro",
    age: 25,
    sign: "Peixes",
    symbol: "♓",
    match: 88,
    location: "Belo Horizonte, MG",
    avatarColor: "from-blue-400 to-teal-500",
    description: "Sua Lua dita um sincronismo que entra em harmonia absoluta com a sensibilidade transcendental de Peixes.",
    weakness: "Devaneios frequentes e excesso de idealização",
    strength: "Empatia universal pura, inspiração astrológica",
    bestDay: "Quintas de Júpiter"
  },
  {
    id: "like_4",
    name: "Camila Meireles",
    age: 28,
    sign: "Touro",
    symbol: "♉",
    match: 85,
    location: "Curitiba, PR",
    avatarColor: "from-emerald-500 to-green-600",
    description: "Estabilidade extraordinária de metas materiais e propósitos refinados em parcerias duradouras.",
    weakness: "Teimosia em rotinas consolidadas",
    strength: "Pé no chão de realidade, sensualidade estável e calma",
    bestDay: "Sextas de Vênus soberana"
  },
  {
    id: "like_5",
    name: "Gabriela Sol",
    age: 23,
    sign: "Leão",
    symbol: "♌",
    match: 82,
    location: "Salvador, BA",
    avatarColor: "from-amber-400 to-orange-500",
    description: "Uma explosão maravilhosa de criatividade calorosa, brilho compartilhado e risadas sinceras.",
    weakness: "Gosta de ser o centro absoluto das atenções",
    strength: "Alegria radiante solar, generosidade calorosa de espírito",
    bestDay: "Domingos de Sol central"
  },
  {
    id: "like_6",
    name: "Fernanda Werner",
    age: 26,
    sign: "Capricórnio",
    symbol: "♑",
    match: 79,
    location: "Porto Alegre, RS",
    avatarColor: "from-slate-600 to-zinc-800",
    description: "Forte magnetismo profissional e alinhamento admirável de ambições materiais concretas.",
    weakness: "Rigidez extrema ou excesso de foco no dever",
    strength: "Disciplina estrutural exemplar, sabedoria madura secular",
    bestDay: "Sábados de Saturno"
  },
  {
    id: "like_7",
    name: "Larissa Prado",
    age: 25,
    sign: "Gêmeos",
    symbol: "♊",
    match: 75,
    location: "Brasília, DF",
    avatarColor: "from-cyan-400 to-blue-500",
    description: "Estimulação magnética de mente ágil, debates intelectuais provocativos e roteiros de viagens inusitadas.",
    weakness: "Inconstância em focos mundanos de longo prazo",
    strength: "Comunicação verbal brilhante, adaptabilidade rápida",
    bestDay: "Quartas de Mercúrio veloz"
  },
  {
    id: "like_8",
    name: "Amanda Ramos",
    age: 29,
    sign: "Virgem",
    symbol: "♍",
    match: 72,
    location: "Recife, PE",
    avatarColor: "from-stone-600 to-amber-700",
    description: "Equilíbrio prático e organization precisa no cotidiano. Otimização mútua de hábitos saudáveis.",
    weakness: "Autoexigência minuciosa exagerada de padrões",
    strength: "Foco analítico refinado, prestatividade sincera cotidiana",
    bestDay: "Quartas de Mercúrio terrestre"
  }
];

// Elegant Visitors List representing Recent Visitors ("Visitantes recentes")
const VISITORS = [
  {
    id: "visitor_1",
    name: "Gabriela Silveira",
    age: 23,
    sign: "Libra",
    symbol: "♎",
    time: "Há 10 minutos",
    status: "online",
    match: 94,
    avatarColor: "from-purple-500 to-pink-500",
    location: "São Paulo, SP",
    astroAura: "Vênus exaltado em conjunção harmônica",
    purpose: "Visitou para analisar compatibilidade afetiva no elemento Ar."
  },
  {
    id: "visitor_2",
    name: "Alexandre Pontes",
    age: 28,
    sign: "Gêmeos",
    symbol: "♊",
    time: "Há 1 hora",
    status: "offline",
    match: 87,
    avatarColor: "from-blue-500 to-indigo-600",
    location: "Campinas, SP",
    astroAura: "Mercúrio em trígono perfeito solar",
    purpose: "Analisou sua afinidade intelectual e padrão de comunicação."
  },
  {
    id: "visitor_3",
    name: "Rebeca Castro",
    age: 25,
    sign: "Sagitário",
    symbol: "♐",
    time: "Há 4 horas",
    status: "offline",
    match: 83,
    avatarColor: "from-amber-555 to-red-500",
    location: "Rio de Janeiro, RJ",
    astroAura: "Júpiter em oposição estimulante",
    purpose: "Atraída pela sua assinatura de aventura e exploração filosófica."
  },
  {
    id: "visitor_4",
    name: "Mateus Alencar",
    age: 26,
    sign: "Áries",
    symbol: "♈",
    time: "Ontem",
    status: "offline",
    match: 79,
    avatarColor: "from-red-600 to-orange-500",
    location: "Belo Horizonte, MG",
    astroAura: "Marte ativando sua casa 5 amorosa",
    purpose: "Química magnética instantânea despertada em análise solar."
  },
  {
    id: "visitor_5",
    name: "Isabella Dias",
    age: 22,
    sign: "Câncer",
    symbol: "♋",
    time: "Há 2 dias",
    status: "offline",
    match: 75,
    avatarColor: "from-pink-400 to-rose-600",
    location: "Salvador, BA",
    astroAura: "Lua em conjunção com seu Ascendente",
    purpose: "Buscou conexão profunda de intuição e afeto familiar mútuo."
  },
  {
    id: "visitor_6",
    name: "Thiago Mendes",
    age: 30,
    sign: "Touro",
    symbol: "♉",
    time: "Há 3 dias",
    status: "offline",
    match: 68,
    avatarColor: "from-emerald-600 to-green-500",
    location: "Curitiba, PR",
    astroAura: "Saturno influenciando estabilidade terrestre",
    purpose: "Visitou visando avaliar sinergia profissional e objetivos de longo prazo."
  }
];

// Dynamic Database for Finding People ("Encontrar Pessoas")
const FIND_PEOPLE_DATABASE = [
  {
    id: "fp_1",
    name: "Wanderson da Silva Ferreira",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-teal-500 to-indigo-555",
    chart: {
      sol: "Touro",
      ascendente: "Virgem",
      lua: "Capricórnio",
      marte: "Peixes",
      venus: "Câncer",
      mercurio: "Touro",
      jupiter: "Áries",
      saturno: "Touro"
    },
    location: "Belo Horizonte, MG",
    age: 26,
    match: 84
  },
  {
    id: "fp_2",
    name: "CALEBE DA SILVA PEREIRA TOLEDO",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-orange-500 to-red-500",
    chart: {
      sol: "Leão",
      ascendente: "Sagitário",
      lua: "Áries",
      marte: "Leão",
      venus: "Gêmeos",
      mercurio: "Câncer",
      jupiter: "Peixes",
      saturno: "Capricórnio"
    },
    location: "São Paulo, SP",
    age: 22,
    match: 78
  },
  {
    id: "fp_3",
    name: "Eugênio Antunes Nunes Dotto",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-blue-500 to-purple-600",
    chart: {
      sol: "Aquário",
      ascendente: "Gêmeos",
      lua: "Libra",
      marte: "Libra",
      venus: "Peixes",
      mercurio: "Aquário",
      jupiter: "Touro",
      saturno: "Aquário"
    },
    location: "Porto Alegre, RS",
    age: 31,
    match: 89
  },
  {
    id: "fp_4",
    name: "Icaro Gabriel",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-indigo-500 to-cyan-500",
    chart: {
      sol: "Áries",
      ascendente: "Leão",
      lua: "Sagitário",
      marte: "Áries",
      venus: "Áries",
      mercurio: "Câncer",
      jupiter: "Leão",
      saturno: "Sagitário"
    },
    location: "Recife, PE",
    age: 24,
    match: 81
  },
  {
    id: "fp_5",
    name: "Marcus Vinicius de Lima quaresma",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-emerald-500 to-teal-700",
    chart: {
      sol: "Escorpião",
      ascendente: "Escorpião",
      lua: "Peixes",
      marte: "Escorpião",
      venus: "Escorpião",
      mercurio: "Libra",
      jupiter: "Virgem",
      saturno: "Touro"
    },
    location: "Rio de Janeiro, RJ",
    age: 28,
    match: 92
  },
  {
    id: "fp_6",
    name: "Jaqueline turco",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-pink-500 to-rose-450",
    chart: {
      sol: "Libra",
      ascendente: "Sagitário",
      lua: "Touro",
      marte: "Libra",
      venus: "Sagitário",
      mercurio: "Virgem",
      jupiter: "Libra",
      saturno: "Leão"
    },
    location: "Curitiba, PR",
    age: 27,
    match: 95
  },
  {
    id: "fp_7",
    name: "ADSON HENRIQUE",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-amber-450 to-orange-600",
    chart: {
      sol: "Sagitário",
      ascendente: "Áries",
      lua: "Gêmeos",
      marte: "Sagitário",
      venus: "Capricórnio",
      mercurio: "Sagitário",
      jupiter: "Escorpião",
      saturno: "Capricórnio"
    },
    location: "Goiânia, GO",
    age: 25,
    match: 86
  },
  {
    id: "fp_8",
    name: "Priscila Ribeiro Silva",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-purple-400 to-fuchsia-600",
    chart: {
      sol: "Câncer",
      ascendente: "Peixes",
      lua: "Escorpião",
      marte: "Câncer",
      venus: "Touro",
      mercurio: "Câncer",
      jupiter: "Câncer",
      saturno: "Câncer"
    },
    location: "Niterói, RJ",
    age: 29,
    match: 88
  },
  {
    id: "fp_9",
    name: "Adriane Santos",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-slate-400 to-slate-500",
    chart: {
      sol: "Peixes",
      ascendente: "Touro",
      lua: "Virgem",
      marte: "Aquário",
      venus: "Peixes",
      mercurio: "Peixes",
      jupiter: "Touro",
      saturno: "Peixes"
    },
    location: "Salvador, BA",
    age: 33,
    match: 73
  },
  {
    id: "fp_10",
    name: "Iasmim de Souza Alves",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-sky-450 to-blue-500",
    chart: {
      sol: "Gêmeos",
      ascendente: "Aquário",
      lua: "Gêmeos",
      marte: "Gêmeos",
      venus: "Gêmeos",
      mercurio: "Gêmeos",
      jupiter: "Áries",
      saturno: "Gêmeos"
    },
    location: "Fortaleza, CE",
    age: 23,
    match: 90
  },
  {
    id: "fp_11",
    name: "Natasha Oliveira Cavalcante",
    status: "offline",
    hasPhoto: true,
    avatarColor: "from-rose-500 to-violet-600",
    chart: {
      sol: "Virgem",
      ascendente: "Capricórnio",
      lua: "Touro",
      marte: "Virgem",
      venus: "Virgem",
      mercurio: "Virgem",
      jupiter: "Virgem",
      saturno: "Virgem"
    },
    location: "Manaus, AM",
    age: 27,
    match: 82
  }
];

export default function CompatibilityView({ user, lang }: CompatibilityViewProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (lang as Language) || 'pt');
    }
    return res;
  };

  const [activeSubTab, setActiveSubTab] = useState<'geral'>('geral'); // Only Cruzamento Astrológico remains
  const [relationCategory, setRelationCategory] = useState<'love' | 'business' | 'friend' | 'family' | 'marriage' | 'partnership'>('love');
  const [partnerName, setPartnerName] = useState('');
  const [partnerDate, setPartnerDate] = useState('');
  
  // Surgical birth details
  const [partnerTime, setPartnerTime] = useState('');
  const [partnerCity, setPartnerCity] = useState('');
  const [partnerCountry, setPartnerCountry] = useState('');
  const [showSurgical, setShowSurgical] = useState(false);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Interactivity for planetary aspect accordions and elements details
  const [expandedAspectIndex, setExpandedAspectIndex] = useState<number | null>(0);
  const [showElementsDetails, setShowElementsDetails] = useState<boolean>(false);
  const [showMinorAspects, setShowMinorAspects] = useState<boolean>(false);

  // Curtidas custom interactive states
  const [selectedLikeId, setSelectedLikeId] = useState<string | null>("like_1");
  const [revealedLikes, setRevealedLikes] = useState<Record<string, boolean>>({
    like_1: true, // Beatriz is pre-revealed
    like_2: true
  });
  const [likedBack, setLikedBack] = useState<Record<string, boolean>>({});

  // Visitors interactive states
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>("visitor_1");
  const [notifiedVisitors, setNotifiedVisitors] = useState<Record<string, boolean>>({});

  // FIND_PEOPLE filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Dropdowns for advanced filter
  const [filterSol, setFilterSol] = useState('Qualquer');
  const [filterAsc, setFilterAsc] = useState('Qualquer');
  const [filterLua, setFilterLua] = useState('Qualquer');
  const [filterMarte, setFilterMarte] = useState('Qualquer');
  const [filterVenus, setFilterVenus] = useState('Qualquer');
  const [filterMercurio, setFilterMercurio] = useState('Qualquer');
  const [filterJupiter, setFilterJupiter] = useState('Qualquer');
  const [filterSaturno, setFilterSaturno] = useState('Qualquer');

  // Selected find people profile
  const [selectedFpId, setSelectedFpId] = useState<string | null>("fp_1");

  // Dynamic filter logic for Find People
  const filteredPeople = useMemo(() => {
    return FIND_PEOPLE_DATABASE.filter(person => {
      // "Escreva o nome" text input filter
      if (searchTerm && !person.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // "Apenas perfis com foto" checkbox filter
      if (onlyWithPhoto && !person.hasPhoto) {
        return false;
      }
      
      // Individual dropdown positions filters
      if (filterSol !== 'Qualquer' && person.chart.sol !== filterSol) return false;
      if (filterAsc !== 'Qualquer' && person.chart.ascendente !== filterAsc) return false;
      if (filterLua !== 'Qualquer' && person.chart.lua !== filterLua) return false;
      if (filterMarte !== 'Qualquer' && person.chart.marte !== filterMarte) return false;
      if (filterVenus !== 'Qualquer' && person.chart.venus !== filterVenus) return false;
      if (filterMercurio !== 'Qualquer' && person.chart.mercurio !== filterMercurio) return false;
      if (filterJupiter !== 'Qualquer' && person.chart.jupiter !== filterJupiter) return false;
      if (filterSaturno !== 'Qualquer' && person.chart.saturno !== filterSaturno) return false;

      return true;
    });
  }, [searchTerm, onlyWithPhoto, filterSol, filterAsc, filterLua, filterMarte, filterVenus, filterMercurio, filterJupiter, filterSaturno]);

  // Detector state
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([
    {
      id: "sc1",
      name: "Eduarda Santos",
      birthDate: "1995-10-14",
      relationType: "love",
      love: 92,
      friendship: 85,
      business: 65,
      communication: 88,
      harmony: 82
    },
    {
      id: "sc2",
      name: "João Silva (Trabalho)",
      birthDate: "1991-03-22",
      relationType: "business",
      love: 42,
      friendship: 76,
      business: 94,
      communication: 90,
      harmony: 75
    }
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactDate, setNewContactDate] = useState('');
  const [newContactType, setNewContactType] = useState<'love' | 'friend' | 'business'>('friend');

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName) return;
    setIsEvaluating(true);

    try {
      const response = await fetch("/api/compatibility/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name || "Você",
          birthDate: user.birthDate,
          birthTime: user.birthTime || "12:00",
          birthCity: user.birthCity || "São Paulo",
          companionName: partnerName,
          companionBirthDate: partnerDate,
          companionBirthTime: partnerTime,
          companionBirthCity: partnerCity,
          companionBirthCountry: partnerCountry,
          category: relationCategory,
        })
      });
      const data = await response.json();
      if (data.compatibility) {
        setResult(data.compatibility);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName) return;

    // Plausible values
    const hash = newContactName.length + newContactType.length;
    const loveVal = 40 + (hash * 7) % 58;
    const friendVal = 40 + (hash * 4) % 58;
    const bizVal = 40 + (hash * 9) % 58;
    const commVal = 40 + (hash * 3) % 58;
    const harmVal = Math.round((loveVal + friendVal + bizVal + commVal) / 4);

    const newContact: SavedContact = {
      id: `sc_${Date.now()}`,
      name: newContactName,
      birthDate: newContactDate || "1994-06-09",
      relationType: newContactType,
      love: loveVal,
      friendship: friendVal,
      business: bizVal,
      communication: commVal,
      harmony: harmVal
    };

    setSavedContacts([...savedContacts, newContact]);
    setNewContactName('');
    setNewContactDate('');
  };

  const handleDeleteContact = (id: string) => {
    setSavedContacts(savedContacts.filter(c => c.id !== id));
  };

  const handleToggleRevealLike = (id: string) => {
    setRevealedLikes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLikeBack = (id: string, name: string) => {
    if (likedBack[id]) return;
    
    setLikedBack(prev => ({ ...prev, [id]: true }));
    
    // Automatically add tosaved contacts
    const newContact: SavedContact = {
      id: `like_back_${id}`,
      name: name,
      birthDate: "1998-05-20",
      relationType: "love",
      love: 90,
      friendship: 85,
      business: 70,
      communication: 93,
      harmony: 88
    };
    setSavedContacts(prev => [...prev, newContact]);
  };

  return (
    <div id="compatibility-module" className="space-y-6">
      {/* Dynamic Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-slate-950 to-pink-950/40 border border-pink-500/15 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-84 h-84 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-84 h-84 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-semibold tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20">
            Módulo Sinastria & Interesse Premium
          </span>
          <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white mt-2">
            Compatibilidade Astrológica
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mt-1 leading-relaxed">
            Compare o seu mapa astral com as pessoas cruciais da sua vida. Descubra forças de comunicação, química amorosa, afinidade profissional e descubra quem demonstrou interesse em você.
          </p>
        </div>
      </div>



      <AnimatePresence mode="wait">
        {false && (
          <motion.div
            key="curtidas-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            
            {/* Introductory statement / requested text */}
            <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-805 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4">
                <div>
                  <h4 className="text-[10px] font-bold font-mono text-pink-400 uppercase tracking-widest">
                    Veja quem demonstrou interesse por você!
                  </h4>
                  <h2 className="text-base font-bold text-white mt-1 uppercase font-mono">
                    QUEM ME CURTIU
                  </h2>
                </div>
                
                <div className="px-3.5 py-2 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-pink-500/20 rounded-2xl">
                  <span className="text-xs font-mono font-bold text-pink-400 block sm:inline">
                     8 pessoas já curtiram o seu perfil
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed max-w-3xl">
                Confira a lista completa de pessoas que se interessaram por você e curtiram o seu perfil. Analise as compatibilidades biológicas e os mapas astrológicos cruzados de cada um para descobrir quem compartilha o melhor ritmo de sua frequência.
              </p>
            </div>

            {/* Split screen content: 8 Cards and Selected Detailed analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: 8 Card profiles listing */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase font-semibold">Candidatas Sintonizadas ({LIKES_RECEIVED.length})</span>
                  <span className="text-[9px] font-mono text-slate-600">Clique para expandir relatório astral</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {LIKES_RECEIVED.map((profile) => {
                    const isSelected = selectedLikeId === profile.id;
                    const isRevealed = revealedLikes[profile.id];
                    const hasLiked = likedBack[profile.id];

                    return (
                      <div
                        key={profile.id}
                        onClick={() => setSelectedLikeId(profile.id)}
                        className={`p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 flex-wrap cursor-pointer border ${
                          isSelected 
                            ? 'bg-slate-900 border-pink-500/55 shadow-md shadow-pink-500/5' 
                            : 'bg-slate-900/50 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Profile Avatar custom graphic style representation */}
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${profile.avatarColor} text-slate-950 flex shadow-inner items-center justify-center font-bold relative shrink-0`}>
                            {isRevealed ? (
                              <span className="text-sm font-sans tracking-tighter">{profile.name.split(' ')[0][0]}{profile.name.split(' ')[1]?.[0] || 'A'}</span>
                            ) : (
                              <span className="text-sm">?</span>
                            )}
                            <div className="absolute -bottom-1.5 -right-1 bg-slate-950 text-pink-400 font-mono text-[9px] w-5 h-5 rounded-full border border-slate-850 flex items-center justify-center" title="Signo">
                              {profile.symbol}
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-slate-200">
                                {isRevealed ? profile.name : "Perfil Oculto Sideral"}
                              </h4>
                              <span className="text-[10px] text-slate-405 font-medium">({profile.age} anos)</span>
                            </div>

                            <p className="text-[10px] font-mono text-slate-505 truncate mt-0.5">
                              {profile.sign} • {profile.location}
                            </p>
                          </div>
                        </div>

                        {/* Interactive match percent and custom actions */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[8px] font-mono text-slate-500 uppercase block">Compatibilidade</span>
                            <span className="text-xs font-black font-mono text-pink-400">{profile.match}% Match</span>
                          </div>

                          {/* Action button to like back */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeBack(profile.id, profile.name);
                            }}
                            className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                              hasLiked 
                                ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10' 
                                : 'bg-pink-500/10 border-pink-500/25 text-pink-400 hover:bg-pink-500/20 hover:scale-105 active:scale-95'
                            }`}
                            title={hasLiked ? "Match Conectado!" : "Curtir de volta para conversar"}
                          >
                            {hasLiked ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-pink-500/10" />}
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Compatibility of Selected Profile */}
              <div className="lg:col-span-5">
                <div className="sticky top-20">
                  {selectedLikeId ? (() => {
                    const profile = LIKES_RECEIVED.find(p => p.id === selectedLikeId)!;
                    const isRevealed = revealedLikes[profile.id];
                    const hasLiked = likedBack[profile.id];

                    return (
                      <div className="bg-slate-900 border border-slate-805 rounded-3xl p-5 space-y-4 shadow-xl">
                        
                        {/* Profile header analysis panel */}
                        <div className="text-center pb-4 border-b border-slate-850 space-y-2">
                          <div className={`w-16 h-16 rounded-full bg-linear-to-tr ${profile.avatarColor} text-slate-950 flex items-center justify-center font-bold text-lg mx-auto shadow-lg relative`}>
                            {isRevealed ? (
                              <span>{profile.name.split(' ').map(n => n[0]).join('')}</span>
                            ) : (
                              <span>?</span>
                            )}
                            <span className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-800 text-pink-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              {profile.symbol}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-white">
                              {isRevealed ? profile.name : "Perfil Oculto de Luz"}
                            </h3>
                            <p className="text-[10px] font-mono text-slate-450 mt-0.5">
                              {profile.sign} • {profile.age} anos • {profile.location}
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono text-[10px] rounded-full font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            {profile.match}% Afinação Sideral
                          </div>
                        </div>

                        {/* Description & Weakness / strength dynamics */}
                        <div className="space-y-3 pt-1">
                          
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-slate-500 uppercase block">Análise de Atração Cósmica</span>
                            <p className="text-xs text-slate-350 leading-relaxed font-sans">
                              {profile.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2 text-[10.5px]">
                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850/60 space-y-1">
                              <span className="text-[8px] font-mono text-emerald-400 uppercase block font-bold">Pontos Fortes</span>
                              <p className="text-slate-400 leading-normal">{profile.strength}</p>
                            </div>
                            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-850/60 space-y-1">
                              <span className="text-[8px] font-mono text-orange-400 uppercase block font-bold">Ajustes Mútuos</span>
                              <p className="text-slate-400 leading-normal">{profile.weakness}</p>
                            </div>
                          </div>

                          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex justify-between items-center text-[10px] font-mono text-slate-350">
                            <span>Sintonia estelar favorável:</span>
                            <span className="font-bold text-indigo-400">{profile.bestDay}</span>
                          </div>

                        </div>

                        {/* Interactive operations inside report */}
                        <div className="space-y-2 pt-2">
                          <button
                            onClick={() => handleToggleRevealLike(profile.id)}
                            className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{isRevealed ? "Ocultar Dados Pessoais" : "Revelar Dados Completos"}</span>
                          </button>
                          
                          <button
                            onClick={() => handleLikeBack(profile.id, profile.name)}
                            disabled={hasLiked}
                            className={`w-full py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                              hasLiked 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-md shadow-pink-500/10'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-emerald-450 text-emerald-400' : 'fill-white'}`} />
                            <span>{hasLiked ? "Sintonia Ativa!" : "Curtir de Volta e Conectar"}</span>
                          </button>
                        </div>

                      </div>
                    );
                  })() : (
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-805 text-center text-slate-500 space-y-2">
                      <Heart className="w-8 h-8 text-slate-800 mx-auto animate-pulse" />
                      <p className="text-xs font-mono">Selecione algum perfil ao lado para visualizar o relatório astral completo de Sinastria do interesse recebido.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {false && (
          <motion.div
            key="visitantes-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Introductory panel with requested labels */}
            <div id="visitas-intro-card" className="bg-slate-900/40 p-6 rounded-3xl border border-slate-805 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-850 pb-4">
                <div>
                  <h4 className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-widest">
                    Veja as pessoas que visualizaram o seu perfil.
                  </h4>
                  <h2 className="text-base font-bold text-white mt-1 uppercase font-mono">
                    VISITAS RECENTES
                  </h2>
                </div>
                
                <div className="px-3.5 py-2 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-2xl">
                  <span className="text-xs font-mono font-bold text-cyan-400 block sm:inline">
                     Seu perfil já foi visualizado 6 vezes.
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed max-w-3xl">
                Veja quem visitou seu perfil e saiba quem são as pessoas que se interessaram por você! Sintonize suas posições planetárias rítmicas e descubra o magnetismo que uniu esses acessos.
              </p>
            </div>

            {/* Visitors Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: 6 Visitors cards */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase font-semibold">Visualizações Recentes ({VISITORS.length})</span>
                  <span className="text-[9px] font-mono text-slate-600">Explore o horário e intenção astrológica</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {VISITORS.map((visitor) => {
                    const isSelected = selectedVisitorId === visitor.id;
                    return (
                      <div
                        key={visitor.id}
                        id={`visitor-card-${visitor.id}`}
                        onClick={() => setSelectedVisitorId(visitor.id)}
                        className={`p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 flex-wrap cursor-pointer border ${
                          isSelected 
                            ? 'bg-slate-900 border-cyan-500/55 shadow-md shadow-cyan-500/5' 
                            : 'bg-slate-900/50 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Visitor Avatar representation */}
                          <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${visitor.avatarColor} text-slate-950 flex shadow-inner items-center justify-center font-bold relative shrink-0`}>
                            <span className="text-sm font-sans tracking-tighter">
                              {visitor.name.split(' ').map(n => n[0]).join('')}
                            </span>
                            <div className="absolute -bottom-1.5 -right-1 bg-slate-950 text-cyan-400 font-mono text-[9px] w-5 h-5 rounded-full border border-slate-850 flex items-center justify-center" title="Signo">
                              {visitor.symbol}
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-slate-200">
                                {visitor.name}
                              </h4>
                              <span className="text-[10px] text-slate-450">({visitor.age} anos)</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${visitor.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} title={visitor.status} />
                            </div>

                            <p className="text-[10px] font-mono text-slate-505 truncate mt-0.5">
                              {visitor.sign} • {visitor.location}
                            </p>
                          </div>
                        </div>

                        {/* Right side metrics */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[8px] font-mono text-slate-500 uppercase block">{visitor.time}</span>
                            <span className="text-xs font-bold font-mono text-cyan-400">{visitor.match}% Afinidade</span>
                          </div>
                          
                          <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/10">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Detailed Visitor Analysis */}
              <div className="lg:col-span-5">
                <div className="sticky top-20">
                  {selectedVisitorId ? (() => {
                    const visitor = VISITORS.find(v => v.id === selectedVisitorId)!;
                    return (
                      <div id="visitas-detalhe-panel" className="bg-slate-900 border border-slate-805 rounded-3xl p-5 space-y-4 shadow-xl text-left">
                        
                        <div className="text-center pb-4 border-b border-slate-850 space-y-2">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${visitor.avatarColor} text-slate-950 flex items-center justify-center font-bold text-lg mx-auto shadow-lg relative`}>
                            <span>{visitor.name.split(' ').map(n => n[0]).join('')}</span>
                            <span className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-800 text-cyan-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              {visitor.symbol}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-center gap-1.5">
                              <h3 className="text-sm font-bold text-white">{visitor.name}</h3>
                              <span className={`w-2 h-2 rounded-full ${visitor.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                            </div>
                            <p className="text-[10px] font-mono text-slate-450 mt-0.5">
                              {visitor.sign} • {visitor.age} anos • {visitor.location}
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] rounded-full font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            {visitor.match}% Alinhamento Vibracional
                          </div>
                        </div>

                        {/* Astro aura and details */}
                        <div className="space-y-3 pt-1">
                          
                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Ressonância Vibracional</span>
                            <p className="text-xs text-indigo-300 font-mono font-semibold bg-indigo-500/5 p-2 rounded-xl border border-indigo-500/10">
                              ⚡ {visitor.astroAura}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Objetivo da Visita Sideral</span>
                            <p className="text-xs text-slate-350 leading-relaxed">
                              {visitor.purpose}
                            </p>
                          </div>

                          <div className="p-3 bg-slate-950 rounded-xl border border-slate-850/60 flex justify-between items-center text-[10px] font-mono text-slate-400">
                            <span>Último acesso ao seu sinal:</span>
                            <span className="text-cyan-400 font-bold">{visitor.time}</span>
                          </div>

                        </div>

                        {/* Interactive operations inside report */}
                        <div className="space-y-2 pt-2">
                          <button
                            id={`btn-sinal-cosmico-${visitor.id}`}
                            onClick={() => {
                              setNotifiedVisitors(prev => ({ ...prev, [visitor.id]: true }));
                            }}
                            disabled={notifiedVisitors[visitor.id]}
                            className={`w-full py-2.5 rounded-xl font-bold font-sans text-xs uppercase tracking-wider transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                              notifiedVisitors[visitor.id] 
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/10'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{notifiedVisitors[visitor.id] ? "Sinal Cósmico Enviado!" : "Enviar Sinal Cósmico de Sintonia"}</span>
                          </button>
                        </div>

                      </div>
                    );
                  })() : (
                    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-805 text-center text-slate-400 space-y-2">
                      <Eye className="w-8 h-8 text-slate-800 mx-auto animate-pulse" />
                      <p className="text-xs font-mono">Selecione algum visitante recente da lista para expandir seus relatórios de acesso planetário e intenção astrológica.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {activeSubTab === 'busca' && (
          <motion.div
            key="busca-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-left"
          >
            {/* Introductory statement / requested text */}
            <div id="encontrar-intro-card" className="bg-slate-900/40 p-6 rounded-3xl border border-slate-805 space-y-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-850 pb-3">
                <div>
                  <h4 className="text-[10px] font-bold font-mono text-amber-500 uppercase tracking-widest">
                    Procure por amigos ou pessoas com o perfil astrológico desejado.
                  </h4>
                  <h2 className="text-base font-bold text-white mt-1 uppercase font-mono tracking-tight">
                    Encontrar Pessoas
                  </h2>
                </div>
                
                <span className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold rounded-full">
                  Pessoas
                </span>
              </div>
              <p className="text-xs text-slate-405 leading-relaxed">
                Utilize o filtro de busca avançada para cruzar posições de Sol, Ascendente, Lua, Vênus e mais. Encontre afinidades naturais ou posições astronômicas específicas perfeitas para suas sinastrias.
              </p>
            </div>

            {/* Filter controls and Results lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Filter Form parameters */}
              <div className="lg:col-span-4 bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                  <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-amber-500" />
                    Parâmetros de Busca
                  </h3>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setOnlyWithPhoto(false);
                      setFilterSol('Qualquer');
                      setFilterAsc('Qualquer');
                      setFilterLua('Qualquer');
                      setFilterMarte('Qualquer');
                      setFilterVenus('Qualquer');
                      setFilterMercurio('Qualquer');
                      setFilterJupiter('Qualquer');
                      setFilterSaturno('Qualquer');
                    }}
                    className="text-[9px] font-mono text-slate-500 hover:text-amber-400 underline cursor-pointer"
                  >
                    Resetar Filtros
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="block text-[9.5px] font-mono text-slate-400 uppercase">Escreva o nome</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pesquise por nome..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-none focus:border-amber-500/55"
                      />
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>

                  {/* Photo toggle checkbox */}
                  <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-950 rounded-xl border border-slate-850/60">
                    <input
                      type="checkbox"
                      id="only-with-photo-checkbox"
                      checked={onlyWithPhoto}
                      onChange={(e) => setOnlyWithPhoto(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="only-with-photo-checkbox" className="text-xs text-slate-350 font-medium select-none cursor-pointer">
                      Apenas perfis com foto
                    </label>
                  </div>

                  {/* Advanced settings toggle button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs font-mono font-bold text-slate-350 rounded-xl transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                        + busca avançada
                      </span>
                      <span className="text-[10px] text-slate-500">{showAdvanced ? "Ocultar" : "Mostrar"}</span>
                    </button>
                  </div>

                  {/* Advanced multi dropdown selectors */}
                  {showAdvanced && (
                    <div className="grid grid-cols-2 gap-3 pt-2 text-[10px]">
                      {/* Sol */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Sol:</label>
                        <select
                          value={filterSol}
                          onChange={(e) => setFilterSol(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/50 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Ascendente */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Ascendente:</label>
                        <select
                          value={filterAsc}
                          onChange={(e) => setFilterAsc(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/50 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Lua */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Lua:</label>
                        <select
                          value={filterLua}
                          onChange={(e) => setFilterLua(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/50 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Marte */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Marte:</label>
                        <select
                          value={filterMarte}
                          onChange={(e) => setFilterMarte(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/50 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Vênus */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Vênus:</label>
                        <select
                          value={filterVenus}
                          onChange={(e) => setFilterVenus(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/50 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Mercúrio */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Mercúrio:</label>
                        <select
                          value={filterMercurio}
                          onChange={(e) => setFilterMercurio(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/50 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Júpiter */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Júpiter:</label>
                        <select
                          value={filterJupiter}
                          onChange={(e) => setFilterJupiter(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/55 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Saturno */}
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-500 uppercase block font-bold">Saturno:</label>
                        <select
                          value={filterSaturno}
                          onChange={(e) => setFilterSaturno(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 focus:outline-none focus:border-amber-500/55 text-[10px]"
                        >
                          {['Qualquer', 'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* Right Column: Search results showing 11 requested profiles exactly */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10.5px] font-mono text-slate-400 uppercase font-semibold">Pessoas Encontradas ({filteredPeople.length})</span>
                  <span className="text-[9px] font-mono text-slate-600">Mostrando perfis cadastrados no alinhamento</span>
                </div>

                {filteredPeople.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900/50 border border-slate-850 rounded-3xl text-slate-500 font-mono text-xs">
                    Nenhuma pessoa de sintonia encontrada com esses filtros. Tente reduzir ou ajustar as regras de busca.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredPeople.map((person) => {
                      const isSelected = selectedFpId === person.id;
                      return (
                        <div
                          key={person.id}
                          id={`fp-card-${person.id}`}
                          onClick={() => setSelectedFpId(person.id)}
                          className={`p-4 rounded-2xl transition-all duration-300 border text-left flex flex-col justify-between gap-3 cursor-pointer ${
                            isSelected 
                              ? 'bg-slate-900 border-amber-500/55 shadow-md shadow-amber-500/5' 
                              : 'bg-slate-900/50 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Avatar representation explicitly stating "Avatar de ..." as required by user list */}
                            <div className="relative shrink-0">
                              <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${person.avatarColor} text-slate-950 flex shadow-inner items-center justify-center font-extrabold uppercase`} title={`Avatar de ${person.name}`}>
                                <span className="text-xs font-sans">
                                  {person.name.split(' ').filter(n => n.length > 2).slice(0, 2).map(n => n[0]).join('') || '?'}
                                </span>
                              </div>
                              <span className="absolute -bottom-1 -right-1 bg-slate-950 border border-slate-800 text-[9px] text-amber-550 px-1 rounded-full font-mono">
                                ☼
                              </span>
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <h4 className="text-xs font-bold text-slate-200 leading-snug tracking-tight">
                                {person.name}
                              </h4>
                              
                              <p className="text-[10px] text-slate-450 font-mono">
                                {person.chart.sol} • {person.location}
                              </p>

                              {/* REQUIRED LABEL: online/offline status explicitly shown! */}
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-650" />
                                <span className="text-[9px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                                  {person.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Astrological placements tags summary inside the card */}
                          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-850 text-[9.5px] font-mono text-slate-450">
                            <div>
                              <span className="text-[8px] text-slate-600 block uppercase">Sol</span>
                              <span className="text-amber-300 font-semibold">{person.chart.sol}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-600 block uppercase">Asc</span>
                              <span className="text-indigo-300 font-semibold">{person.chart.ascendente}</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-600 block uppercase font-mono">Lua</span>
                              <span className="text-teal-300 font-semibold">{person.chart.lua}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-1.5">
                            <span className="text-[9px] font-mono text-amber-500/90 font-bold bg-amber-500/5 px-2 py-0.5 border border-amber-500/10 rounded-lg">
                              {person.match}% Match
                            </span>
                            <span className="text-[9.5px] font-mono text-slate-550 hover:text-amber-500 flex items-center gap-1">
                              Análise completa <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB SUB-VIEW: CRUZAMENTO ASTROLÓGICO (Geral Fast match) */}
      {activeSubTab === 'geral' && (
        <div id="sinastria-full-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Comparison Form Input */}
          <div className="lg:col-span-4 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4 text-left self-start shadow-xl">
            <h3 className="text-sm font-semibold text-slate-200">Comparar Mapas</h3>
            <form onSubmit={handleEvaluate} className="space-y-4">
              
              {/* Elegant Visual Card explaining that User's Map is used automatically */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/10 shadow-lg text-left">
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  🔮 Mapa Principal Ativo
                </span>
                <p className="text-xs font-sans text-slate-200 font-semibold">
                  {user.name || "Seu Perfil"}
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5 leading-normal">
                  Nascimento: {user.birthDate ? user.birthDate.split('-').reverse().join('/') : "Não informado"} {user.birthTime ? `às ${user.birthTime}` : ""} {user.birthCity ? `em ${user.birthCity}` : ""}
                </p>
                
                <div className="mt-3 pt-3 border-t border-slate-800/60">
                  <p className="text-[11px] font-sans text-amber-500/95 leading-relaxed font-semibold">
                    Preencha as informações abaixo com os dados da pessoa que você deseja comparar com seu mapa principal.
                  </p>
                </div>
              </div>

              <div id="dados-outra-pessoa-form" className="space-y-3.5 pt-1">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                  Dados da outra pessoa
                </span>
                
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 mb-1">NOME DA PESSOA</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:border-rose-500/40 focus:outline-hidden transition"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 mb-1">DATA DE NASCIMENTO</label>
                  <input
                    type="date"
                    required
                    value={partnerDate}
                    onChange={(e) => setPartnerDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:border-rose-500/40 focus:outline-hidden font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-450 mb-1">HORA DE NASCIMENTO</label>
                  <input
                    type="time"
                    required
                    value={partnerTime}
                    onChange={(e) => setPartnerTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:border-rose-500/40 focus:outline-hidden font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-450 mb-1">CIDADE DE NASCIMENTO</label>
                  <input
                    type="text"
                    required
                    placeholder="Cidade de nascimento"
                    value={partnerCity}
                    onChange={(e) => setPartnerCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:border-rose-500/40 focus:outline-hidden transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-450 mb-1">PAÍS (OPCIONAL)</label>
                  <input
                    type="text"
                    placeholder="País de nascimento"
                    value={partnerCountry}
                    onChange={(e) => setPartnerCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:border-rose-500/40 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full py-2.5 mt-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-slate-100 font-sans font-bold text-xs uppercase transition duration-300 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEvaluating ? 'Efetuando Alinhamento...' : 'Efetuar Cruzamento de Mapas'}</span>
              </button>
            </form>
          </div>

          {/* Compatibility Results Area */}
          <div className="lg:col-span-8 bg-slate-900/20 p-6 rounded-3xl border border-slate-800/80 space-y-6">
            
            {/* INFORMATIVE EXPLANATION BANNER */}
            <div className="bg-slate-900/60 p-5 border border-pink-500/10 rounded-3xl text-[11px] leading-relaxed text-slate-350 font-sans flex items-start gap-3 text-left">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5 animate-pulse" />
              <span>
                Esta é a análise profissional da sua <strong>Compatibilidade Astrológica (Sinastria de Alinhamento)</strong> executada com base nas efemérides reais e trânsitos em tempo real de altíssima precisão. Escolha o tipo de relação que deseja analisar no menu abaixo.
              </span>
            </div>

            {/* CATEGORIES FILTERS SEGMENT */}
            <div id="sinastria-category-filters" className="bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
              {[
                { id: 'love', label: 'Amor', icon: Heart, gradient: 'from-rose-600 to-pink-600 shadow-pink-500/5' },
                { id: 'friend', label: 'Amizade', icon: Users, gradient: 'from-amber-600 to-orange-600 shadow-orange-500/5' },
                { id: 'business', label: 'Trabalho', icon: Briefcase, gradient: 'from-blue-600 to-cyan-600 shadow-cyan-500/5' },
                { id: 'family', label: 'Família', icon: Smile, gradient: 'from-emerald-600 to-teal-600 shadow-emerald-500/5' },
                { id: 'marriage', label: 'Casamento', icon: Star, gradient: 'from-indigo-600 to-violet-600 shadow-indigo-500/5' },
                { id: 'partnership', label: 'Sociedade', icon: Compass, gradient: 'from-purple-600 to-fuchsia-600 shadow-fuchsia-500/5' }
              ].map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = relationCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setRelationCategory(cat.id as any)}
                    className={`py-2 px-1 rounded-xl text-[10.5px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border ${
                      isSelected
                        ? `bg-linear-to-r ${cat.gradient} border-transparent text-slate-100 shadow-md`
                        : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-850/30'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'animate-bounce' : ''}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {result ? (
              <div className="space-y-8 animate-in fade-in duration-350 text-left">
                
                {/* 1. ANÁLISE INICIAL & OVERALL SCORE */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-pink-950/15 p-6 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono font-bold text-rose-450 uppercase tracking-widest block">
                      GRAU DE SINTONIA FINAL
                    </span>
                    <div className="flex items-center justify-center gap-3 py-1.5 max-w-sm mx-auto">
                      <span className="text-sm font-bold font-mono text-slate-100 uppercase">{user.name || "Você"}</span>
                      <span className="text-xs text-rose-505 font-bold">⭐ SINASTRIA ⭐</span>
                      <span className="text-sm font-bold font-mono text-slate-100 uppercase">{result.partnerName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col items-center justify-center pt-2">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="72" cy="72" r="62" stroke="rgba(30, 41, 59, 1)" strokeWidth="6" fill="transparent" />
                          <circle
                            cx="72"
                            cy="72"
                            r="62"
                            stroke="url(#sinastriaGeralGrad)"
                            strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 62}
                            strokeDashoffset={2 * Math.PI * 62 * (1 - (result.compatibilidadeGeral / 100))}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                          <defs>
                            <linearGradient id="sinastriaGeralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="50%" stopColor="#f43f5e" />
                              <stop offset="100%" stopColor="#818cf8" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-3xl font-black font-mono text-slate-50 tracking-tighter">
                            {result.compatibilidadeGeral * 10}
                          </span>
                          <span className="text-[9px] font-mono text-slate-450 uppercase font-bold tracking-widest leading-none mt-0.5">Pontos</span>
                          <span className="text-[10px] font-mono text-pink-400 font-bold leading-none mt-1">{result.compatibilidadeGeral}% Geral</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-rose-400 tracking-wide font-sans">
                        Alinhamento e Sinergia Estelar
                      </h4>
                      <p className="text-xs text-slate-350 leading-relaxed font-sans">
                        {result.porQueExisteCompatibilidade.slice(0, 180)}... Suas posições estelares em relação ao perfil de {result.partnerName} mostram uma magnífica ponte fiduciária na categoria de {relationCategory === 'love' ? 'Amor' : relationCategory === 'friend' ? 'Amizade' : 'Cooperação'}.
                      </p>
                    </div>
                  </div>

                  {/* 9 compatibility fields grid */}
                  <div className="border-t border-slate-850 pt-5 space-y-3">
                    <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Tabela de Percentagens Astrológicas</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Compatibilidade Geral', score: result.compatibilidadeGeral, color: 'sky' },
                        { label: 'Compatibilidade Emocional', score: result.compatibilidadeEmocional, color: 'pink' },
                        { label: 'Compatibilidade Intelectual', score: result.compatibilidadeIntelectual, color: 'blue' },
                        { label: 'Compatibilidade Amorosa', score: result.compatibilidadeAmorosa, color: 'rose' },
                        { label: 'Compatibilidade Sexual', score: result.compatibilidadeSexual, color: 'orange' },
                        { label: 'Compatibilidade Financeira', score: result.compatibilidadeFinanceira, color: 'emerald' },
                        { label: 'Compatibilidade Profissional', score: result.compatibilidadeProfissional, color: 'teal' },
                        { label: 'Compatibilidade Espiritual', score: result.compatibilidadeEspiritual, color: 'indigo' },
                        { label: 'Compatibilidade Familiar', score: result.compatibilidadeFamiliar, color: 'amber' }
                      ].map((bar, bIdx) => (
                        <div key={bIdx} className="p-2 rounded-xl bg-slate-950/40 border border-slate-850 text-left space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-sans">
                            <span className="text-slate-400 truncate">{bar.label}</span>
                            <span className="font-bold font-mono text-slate-200">{bar.score}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full transition-all duration-500"
                              style={{ width: `${bar.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CATEGORY-SPECIFIC EXCLUSIVE REPORT CONTENT */}
                <div id="exclusive-category-report" className="space-y-8 animate-in duration-300">
                  {(() => {
                    const categoryData = (result as any).categories?.[relationCategory];
                    if (!categoryData) return (
                      <div className="p-6 text-center text-xs font-mono text-slate-500">
                        Nenhum dado estelar calculado para esta categoria.
                      </div>
                    );

                    // Get category identity info
                    const catTheme = {
                      love: { title: "Amor & Paixão", icon: Heart, text: "text-rose-400", border: "border-rose-500/15", bg: "bg-rose-500/5", glow: "from-rose-500 to-pink-500" },
                      friend: { title: "Amizade & Cumplicidade", icon: Users, text: "text-amber-400", border: "border-amber-500/15", bg: "bg-amber-500/5", glow: "from-amber-600 to-orange-600" },
                      business: { title: "Trabalho & Produtividade", icon: Briefcase, text: "text-blue-400", border: "border-blue-500/15", bg: "bg-blue-500/5", glow: "from-blue-600 to-cyan-600" },
                      family: { title: "Família & Clã", icon: Smile, text: "text-emerald-400", border: "border-emerald-500/15", bg: "bg-emerald-500/5", glow: "from-emerald-500 to-teal-500" },
                      marriage: { title: "Casamento & Longo Prazo", icon: Star, text: "text-indigo-450", border: "border-indigo-500/15", bg: "bg-indigo-500/5", glow: "from-indigo-600 to-violet-600" },
                      partnership: { title: "Sociedade & Negócios", icon: Compass, text: "text-purple-400", border: "border-purple-500/15", bg: "bg-purple-500/5", glow: "from-purple-600 to-fuchsia-600" }
                    }[relationCategory as 'love' | 'friend' | 'business' | 'family' | 'marriage' | 'partnership'] || {
                      title: "Sinastria Estelar", icon: Sparkles, text: "text-pink-450", border: "border-slate-800", bg: "bg-slate-900/40", glow: "from-rose-500 to-indigo-500"
                    };

                    const IconComp = catTheme.icon;

                    return (
                      <div className="space-y-8">
                        {/* HEADER DA CATEGORIA */}
                        <div className={`p-6 rounded-3xl ${catTheme.bg} border ${catTheme.border} relative overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-950/20 rounded-full blur-2xl pointer-events-none" />
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-2xl bg-slate-950/60 border ${catTheme.border}`}>
                                <IconComp className={`w-5 h-5 ${catTheme.text}`} />
                              </div>
                              <div className="text-left">
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">MÓDULO PROFISSIONAL DE CRUZAMENTO</span>
                                <h3 className="text-base font-bold text-slate-50 tracking-wide font-sans">{catTheme.title}</h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-3.5 bg-slate-950/60 px-4 py-2.5 rounded-2xl border border-slate-800 max-w-fit shrink-0">
                              <div className="text-left leading-none font-mono">
                                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">AFINIDADE ESPECÍFICA</span>
                                <div className="text-lg font-black text-slate-100 tracking-tighter mt-1">{categoryData.score}%</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-900 overflow-hidden relative border border-slate-800 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle cx="16" cy="16" r="13" stroke="rgba(30, 41, 59, 0.4)" strokeWidth="2.5" fill="transparent" />
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="13"
                                    stroke="url(#localGradMini)"
                                    strokeWidth="3.5"
                                    strokeDasharray={2 * Math.PI * 13}
                                    strokeDashoffset={2 * Math.PI * 13 * (1 - (categoryData.score / 100))}
                                    strokeLinecap="round"
                                    fill="transparent"
                                  />
                                </svg>
                                <span className="absolute text-[8px] font-mono font-bold text-slate-300">{categoryData.score}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 1. MAPA DE HARMONIA */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Compass className="w-3.5 h-3.5 text-slate-400" />
                            <span>1. Mapa de Harmonia de {catTheme.title}</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Pontos Fortes */}
                            <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-900/30 text-left space-y-2.5">
                              <div className="flex items-center gap-2 text-emerald-400">
                                <Check className="w-4 h-4 shrink-0" />
                                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider">PONTOS FORTES</span>
                              </div>
                              <ul className="space-y-2 text-[11px] text-slate-300 leading-relaxed font-sans">
                                {categoryData.mapaHarmonia.pontosFortes.map((p: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Pontos de Atenção */}
                            <div className="p-5 rounded-2xl bg-amber-950/15 border border-amber-900/30 text-left space-y-2.5">
                              <div className="flex items-center gap-2 text-amber-400">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider">PONTOS DE ATENÇÃO</span>
                              </div>
                              <ul className="space-y-2 text-[11px] text-slate-300 leading-relaxed font-sans">
                                {categoryData.mapaHarmonia.pontosAtencao.map((p: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Áreas de Conflito */}
                            <div className="p-5 rounded-2xl bg-red-950/15 border border-red-900/30 text-left space-y-2.5">
                              <div className="flex items-center gap-2 text-red-400">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider">ÁREAS DE CONFLITO</span>
                              </div>
                              <ul className="space-y-2 text-[11px] text-slate-300 leading-relaxed font-sans">
                                {categoryData.mapaHarmonia.areasConflito.map((p: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-red-500 font-bold mt-0.5">•</span>
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* 2. ANÁLISE DETALHADA */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            <span>2. Análise Detalhada Estelar</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left space-y-3">
                              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block font-bold">POR QUE EXISTE COMPATIBILIDADE</span>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">{categoryData.analiseDetalhada.compatibilidadeMessage}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left space-y-3">
                              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block font-bold">POR QUE EXISTE CONFLITO</span>
                              <p className="text-xs text-slate-300 leading-relaxed font-sans">{categoryData.analiseDetalhada.conflitoMessage}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left space-y-3">
                              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block font-bold">CARACTERÍSTICAS QUE UNEM</span>
                              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                                {categoryData.analiseDetalhada.caracteristicasUnem.map((u: string, idx: number) => (
                                  <li key={idx} className="flex items-center gap-1.5">
                                    <span className="text-indigo-400 text-sm">✔</span>
                                    <span>{u}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left space-y-3">
                              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block font-bold">CARACTERÍSTICAS QUE AFASTAM</span>
                              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                                {categoryData.analiseDetalhada.caracteristicasAfastam.map((u: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-red-400 font-bold block mt-0.5">•</span>
                                    <span>{u}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* 3. CHANCE DE CONVIVÊNCIA NO DIA A DIA / DINÂMICA */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-slate-400" />
                            <span>3. {categoryData.dinamicaConviver.title}</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoryData.dinamicaConviver.items.map((item: { label: string; desc: string }, idx: number) => (
                              <div key={idx} className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left space-y-1">
                                <span className="font-mono font-bold text-slate-300 text-[10.5px] block uppercase">{item.label}</span>
                                <p className="text-slate-400 leading-normal text-[11px] mt-0.5 font-sans">{item.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. RESUMO DE COMPATIBILIDADE (PERCENTUAIS) */}
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold text-left">4. Resumo de Compatibilidades Detalhadas</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                            {categoryData.resumoScores.map((bar: { label: string; percent: number }, bIdx: number) => (
                              <div key={bIdx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-1.5">
                                <div className="flex justify-between items-center text-[10px] font-sans">
                                  <span className="text-slate-400 truncate uppercase font-bold text-[8.5px]">{bar.label}</span>
                                  <span className="font-bold font-mono text-slate-100">{bar.percent}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                    style={{ width: `${bar.percent}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 5. TRÂNSITOS EM TEMPO REAL */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>5. {categoryData.transitosAtuais.title}</span>
                          </h4>
                          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 text-left">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-slate-800 pb-3">
                              <div>
                                <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Data Real</span>
                                <span className="text-xs font-mono text-slate-200 mt-0.5 block">{categoryData.transitosAtuais.data}</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Hora Local</span>
                                <span className="text-xs font-mono text-slate-200 mt-0.5 block">{categoryData.transitosAtuais.hora}</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Fuso Horário</span>
                                <span className="text-xs font-mono text-slate-405 mt-0.5 block truncate">{categoryData.transitosAtuais.fuso.split(' ')[0]}</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-mono text-slate-400 uppercase block font-bold">Última Atualização</span>
                                <span className="text-xs font-mono text-slate-200 mt-0.5 block">{categoryData.transitosAtuais.atualizacao.split(' ')[1]}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{categoryData.transitosAtuais.influencia}</p>
                          </div>
                        </div>

                        {/* 6. CALENDÁRIO DA RELAÇÃO */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>6. Calendário & Ciclos de Tendências Futuras</span>
                          </h4>
                          <div className="relative border-l border-slate-800 ml-3.5 pl-5 space-y-5 text-left">
                            {[
                              { label: "Próximos 7 Dias", desc: categoryData.calendarioIndicadores.label7Dias },
                              { label: "Próximos 30 Dias", desc: categoryData.calendarioIndicadores.label30Dias },
                              { label: "Próximos 3 Meses", desc: categoryData.calendarioIndicadores.label3Meses },
                              { label: "Próximos 6 Meses", desc: categoryData.calendarioIndicadores.label6Meses },
                              { label: "Próximo Ano", desc: categoryData.calendarioIndicadores.label1Ano },
                              ...(categoryData.calendarioIndicadores.labelRangeX ? [{
                                label: categoryData.calendarioIndicadores.labelRangeX,
                                desc: categoryData.calendarioIndicadores.descRangeX || ""
                              }] : [])
                            ].map((cycle, cIdx) => (
                              <div key={cIdx} className="relative">
                                <span className="absolute -left-[27.5px] top-1 w-3.5 h-3.5 rounded-full bg-slate-900 border border-rose-500/60 flex items-center justify-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                </span>
                                <span className="text-[10px] font-mono text-rose-500 block uppercase font-bold tracking-wider">{cycle.label}</span>
                                <p className="text-[11.5px] text-slate-300 mt-0.5 leading-relaxed font-sans">{cycle.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 7. DIAS FAVORÁVEIS */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Check className="w-3.5 h-3.5" />
                            <span>7. Dias Favoráveis Reais Calculados</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoryData.diasFavoraveisItems.map((df: { icon: string; category: string; description: string }, dfIdx: number) => (
                              <div key={dfIdx} className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left flex items-start gap-3">
                                <span className="text-lg shrink-0 mt-0.5">{df.icon}</span>
                                <div className="space-y-0.5">
                                  <span className="font-mono font-bold text-slate-200 text-[10.5px] uppercase block">{df.category}</span>
                                  <p className="text-slate-405 leading-relaxed text-[11px] font-sans">{df.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 8. DIAS DE ATENÇÃO */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>8. Dias de Atenção & Cautela Cósmica</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoryData.diasAtencaoItems.map((da: { category: string; description: string }, daIdx: number) => (
                              <div key={daIdx} className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <span className="font-mono font-bold text-red-400 text-[10.5px] uppercase block">{da.category}</span>
                                  <p className="text-slate-405 leading-relaxed text-[11px] font-sans">{da.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 9. VISÃO DE LONGO PRAZO */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                            <span>9. Visão Estelar de Longo Prazo</span>
                          </h4>
                          <div className="grid grid-cols-1 gap-3.5">
                            {categoryData.visaoLongoPrazoItems.map((vlp: { category: string; description: string }, vlpIdx: number) => (
                              <div key={vlpIdx} className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left space-y-1">
                                <span className="font-mono font-bold text-slate-350 text-[10.5px] block uppercase">{vlp.category}</span>
                                <p className="text-slate-405 leading-normal text-[11px] font-sans">{vlp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 10. PONTOS OCULTOS */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>10. Pontos Ocultos & Ligações Kármicas</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoryData.pontosOcultosItems.map((po: { category: string; description: string }, poIdx: number) => (
                              <div key={poIdx} className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left space-y-1">
                                <span className="font-mono font-bold text-slate-300 text-[10.5px] block uppercase">{po.category}</span>
                                <p className="text-slate-405 leading-normal text-[11px] font-sans">{po.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 11. INTELIGÊNCIA DE RELACIONAMENTO */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                            <span>11. Inteligência de Relacionamento Cósmico</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-emerald-950/10 border border-emerald-900/20 text-left space-y-3">
                              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block font-bold">O QUE FAZER</span>
                              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                                {categoryData.inteligenciaRelacionamento.oQueFazer.map((doItem: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold block mt-0.5">•</span>
                                    <span>{doItem}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-5 rounded-2xl bg-red-950/10 border border-red-900/20 text-left space-y-3">
                              <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block font-bold">O QUE EVITAR</span>
                              <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                                {categoryData.inteligenciaRelacionamento.oQueEvitar.map((dontItem: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-red-500 font-bold block mt-0.5">•</span>
                                    <span>{dontItem}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left space-y-1">
                              <span className="font-mono font-bold text-slate-300 text-[10.5px] block uppercase">COMO MELHORAR A COMUNICAÇÃO</span>
                              <p className="text-slate-400 leading-normal text-[11px] mt-0.5 font-sans">{categoryData.inteligenciaRelacionamento.melhorarComunicacao}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left space-y-1">
                              <span className="font-mono font-bold text-slate-300 text-[10.5px] block uppercase">COMO REDUZIR CONFLITOS</span>
                              <p className="text-slate-400 leading-normal text-[11px] mt-0.5 font-sans">{categoryData.inteligenciaRelacionamento.reduzirConflitos}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950/45 border border-slate-800 text-left space-y-1 md:col-span-2">
                              <span className="font-mono font-bold text-slate-300 text-[10.5px] block uppercase">COMO FORTALECER A CONEXÃO</span>
                              <p className="text-slate-400 leading-normal text-[11px] mt-0.5 font-sans">{categoryData.inteligenciaRelacionamento.fortalecerConexao}</p>
                            </div>
                          </div>
                        </div>

                        <svg className="hidden">
                          <defs>
                            <linearGradient id="localGradMini" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-600">
                <Users className="w-12 h-12 text-slate-800 animate-pulse" />
                <p className="text-xs font-mono mt-4 text-center max-w-sm leading-relaxed">
                  Preencha os dados do parceiro(a) ao lado para realizar o cruzamento astrológico de sinastria e obter o relatório completo de 15 módulos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
