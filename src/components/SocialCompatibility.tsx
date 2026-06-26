import React, { useState, useEffect } from 'react';
import { 
  Heart, Users, Sparkles, UserPlus, UserMinus, ShieldAlert, 
  MapPin, Award, Check, TrendingUp, RefreshCw, MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';

interface SocialUser {
  id: string;
  name: string;
  age: number;
  city: string;
  sign: string;
  bio: string;
  avatarUrl: string;
  avatarGradient: string;
  interests: string[];
}

interface SocialCompatibilityProps {
  userName: string;
  userSign: string;
  hasCreatedMap: boolean;
  onRefresh?: () => void;
}

export default function SocialCompatibility({
  userName,
  userSign,
  hasCreatedMap,
  onRefresh
}: SocialCompatibilityProps) {
  const { t: i18nT, i18n } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (i18n.language as Language) || 'pt');
    }
    return res;
  };

  // Profiles database (real mock personas in system)
  const candidateUsers: SocialUser[] = [
    {
      id: "u_mariana",
      name: "Mariana",
      age: 24,
      city: "São Paulo, SP",
      sign: "Libra",
      bio: "Amante da harmonia, constelações de ar e design minimalista. Procuro trocas inteligentes e sinceras.",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-fuchsia-600 to-indigo-600",
      interests: ["Yoga", "Astrologia", "Arte Coletiva", "Café"]
    },
    {
      id: "u_gustavo",
      name: "Gustavo",
      age: 27,
      city: "Rio de Janeiro, RJ",
      sign: "Gêmeos",
      bio: "Curioso por natureza, baterista e leitor voror de ficção. Sagitário me move a buscar novos horizontes.",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-sky-500 to-teal-500",
      interests: ["Música", "Livros", "Tecnologia", "Viagens"]
    },
    {
      id: "u_anabeatriz",
      name: "Ana Beatriz",
      age: 22,
      city: "Curitiba, PR",
      sign: "Sagitário",
      bio: "Vivendo guiata pelo otimismo e expansão espiritual de Júpiter. Trilhas, fotografia e cafés especiais.",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-amber-500 to-rose-600",
      interests: ["Trilhas", "Fotografia", "Espiritualidade", "Vinho"]
    },
    {
      id: "u_felipe",
      name: "Felipe",
      age: 29,
      city: "Belo Horizonte, MG",
      sign: "Aquário",
      bio: "Empreendedor social, astrônomo amador e desenvolvedor. Amigo acima de tudo, idealista ao extremo.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-indigo-600 to-purple-600",
      interests: ["Astronomia", "Negócios", "Meditação", "Cozinha"]
    },
    {
      id: "u_camila",
      name: "Camila",
      age: 25,
      city: "Salvador, BA",
      sign: "Áries",
      bio: "Fogo cardeal motivada a criar projetos inovadores. Amo praias quentes, shows ao vivo e meditação áurica.",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-rose-500 to-orange-500",
      interests: ["Música ao Vivo", "Praia", "Empreendedorismo", "Moda"]
    },
    {
      id: "u_lucas",
      name: "Lucas",
      age: 28,
      city: "Porto Alegre, RS",
      sign: "Leão",
      bio: "Apaixonado por teatro, vinhos e conversas profundas sobre destino. Busco conexões que façam brilhar o Sol.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-violet-600 to-rose-500",
      interests: ["Cinema", "Teatro", "Vinhos", "Filosofia"]
    },
    {
      id: "u_patricia",
      name: "Patrícia",
      age: 31,
      city: "Recife, PE",
      sign: "Touro",
      bio: "Amante da gastronomia, conforto material do lar e boas discussões de negócios sustentáveis.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-emerald-500 to-indigo-500",
      interests: ["Culinária", "Design de Interiores", "Estudos", "Finanças"]
    },
    {
      id: "u_rodrigo",
      name: "Rodrigo",
      age: 26,
      city: "Campinas, SP",
      sign: "Libra",
      bio: "Arquiteto na busca da proporção áurea material e social. Conciliador nas horas vagas e fã de vinis.",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
      avatarGradient: "from-teal-600 to-sky-600",
      interests: ["Arquitetura", "Música Analógica", "Exposições", "Cerveja Artesanal"]
    }
  ];

  // System statistics derived deterministically based on today's date
  const [ecoStats, setEcoStats] = useState({
    mapsToday: 134,
    compatibilityResolvedToday: 247,
    readingsToday: 318,
    dreamsToday: 82
  });

  // User social relations state
  const [likedProfiles, setLikedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem("orbi_liked_users");
    return saved ? JSON.parse(saved) : [];
  });
  const [followedProfiles, setFollowedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem("orbi_followed_users");
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic visible suggestions based on the 48h periodic shuffle rule
  const [visibleSuggestions, setVisibleSuggestions] = useState<SocialUser[]>([]);
  const [selectedCompanion, setSelectedCompanion] = useState<SocialUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync likes and follows
  useEffect(() => {
    localStorage.setItem("orbi_liked_users", JSON.stringify(likedProfiles));
  }, [likedProfiles]);

  useEffect(() => {
    localStorage.setItem("orbi_followed_users", JSON.stringify(followedProfiles));
  }, [followedProfiles]);

  // Generate deterministic eco stats based on current time/date
  useEffect(() => {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 30;
    
    // Add hours logic to make it tick up during the day
    const hours = today.getHours();
    
    setEcoStats({
      mapsToday: Math.floor(110 + (seed % 45) + (hours * 3.5)),
      compatibilityResolvedToday: Math.floor(210 + (seed % 73) + (hours * 5.2)),
      readingsToday: Math.floor(280 + (seed % 92) + (hours * 7.1)),
      dreamsToday: Math.floor(60 + (seed % 28) + (hours * 1.8))
    });

    // 48 hours periodic suggestion list shuffle: or we can tie the selected subset of candidates matching user sign!
    // To ensure a high feel of life and activity, we select 4 profiles out of candidateUsers
    // seeded deterministically by the 48h calendar period: Math.floor(Date.now() / (1000 * 60 * 60 * 48))
    const shuffleSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 48));
    
    // Select 4 users showing a diverse matching set
    const selectedIndices: number[] = [];
    const len = candidateUsers.length;
    for (let i = 0; i < 4; i++) {
      let idx = (shuffleSeed + i * 3) % len;
      while (selectedIndices.includes(idx)) {
        idx = (idx + 1) % len;
      }
      selectedIndices.push(idx);
    }
    
    const suggested = selectedIndices.map(idx => candidateUsers[idx]);
    setVisibleSuggestions(suggested);
  }, []);

  // Handle manual/periodic refreshment simulation
  const handleShuffleSuggestions = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Pick a different offset of users
      const randomSeed = Math.floor(Math.random() * 8);
      const selectedIndices: number[] = [];
      const len = candidateUsers.length;
      for (let i = 0; i < 4; i++) {
        let idx = (randomSeed + i * 2) % len;
        while (selectedIndices.includes(idx)) {
          idx = (idx + 1) % len;
        }
        selectedIndices.push(idx);
      }
      setVisibleSuggestions(selectedIndices.map(idx => candidateUsers[idx]));
      setIsRefreshing(false);
    }, 8000);
  };

  // Helper score calculator (completely deterministic using strings to keep it stable)
  const calculateScores = (name1: string, name2: string) => {
    const s1 = name1.toLowerCase();
    const s2 = name2.toLowerCase();
    const totalLen = s1.length + s2.length;
    
    // Deterministic modulo calculations
    const amor = 75 + (totalLen * 7 % 22); // 75% to 97%
    const amizade = 80 + (totalLen * 3 % 18); // 80% to 98%
    const profissional = 72 + (totalLen * 11 % 24); // 72% to 96%
    const energetica = 78 + (totalLen * 5 % 20); // 78% to 98%
    const media = Math.round((amor + amizade + profissional + energetica) / 4);

    return { amor, amizade, profissional, energetica, media };
  };

  // Toggle follows and likes
  const handleToggleLike = (id: string) => {
    setLikedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleToggleFollow = (id: string) => {
    setFollowedProfiles(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Profile compatibility summary texts based on the candidate's sign and user's sign
  const getCompatibilitySummaryText = (sign1: string, sign2: string) => {
    const s1 = (sign1 || "").toLowerCase();
    const s2 = (sign2 || "").toLowerCase();

    if (s1 === "aquário" || s2 === "aquário") {
      if (s1 === "libra" || s2 === "libra") {
        return "Sinergia de Ar tríplice extraordinária. O diálogo flui sem amarras teológicas, compartilhando uma visão humanitária idêntica.";
      }
      if (s1 === "gêmeos" || s2 === "gêmeos") {
        return "Conexão intelectual efervescente. Estimulação mútua fantástica e ausência completa de cobranças materiais limitantes.";
      }
      if (s1 === "sagitário" || s2 === "sagitário") {
        return "Aventura idealista e filosófica sem fronteiras. Júpiter expande o desejo de independência mútua de Aquário de forma magnífica.";
      }
      if (s1 === "áries" || s2 === "áries") {
        return "Dinamismo e iniciativa entusiasmados. O fogo de Áries fornece a faísca e a força realizadora que as grandes utopias de Aquário necessitam.";
      }
      return "Estreito canal relacional moldado pelo respeito ao espaço individual e curiosidade intelectual mútua inovadora.";
    }

    return "Harmonia celeste sintonizada com alto teor de compatibilidade espiritual sob o elemento correspondente.";
  };

  return (
    <div className="space-y-6">
      
      {/* 1. ECOSYSTEM LIVE LOGS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/20 border border-slate-850 p-4 rounded-3xl text-left font-sans">
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Novos Mapas Hoje")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-amber-500 font-mono tracking-tight">{ecoStats.mapsToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("realizados")}</span>
          </div>
        </div>
        
        <div className="space-y-1 border-l border-slate-850 pl-4">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Sinastrias Avaliadas")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-cyan-400 font-mono tracking-tight">{ecoStats.compatibilityResolvedToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("sinergias")}</span>
          </div>
        </div>

        <div className="space-y-1 border-l border-slate-850 pl-4">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Leituras de Tarô")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-rose-455 font-mono tracking-tight">{ecoStats.readingsToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("consultas")}</span>
          </div>
        </div>

        <div className="space-y-1 border-l border-slate-850 pl-4">
          <span className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest block">{t("Sonhos Interpretados")}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-purple-400 font-mono tracking-tight">{ecoStats.dreamsToday}</span>
            <span className="text-[8px] text-slate-450 uppercase font-bold tracking-wider">{t("revelações")}</span>
          </div>
        </div>
      </div>

      {/* 2. DISCOVER PEOPLE SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-850">
          <div>
            <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500 animate-pulse" />
              {t("Pessoas Compatíveis Com Você")}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {t("Indivíduos em ressonância geométrica de nascimento sintonizados com seu Sol em")} {t(userSign)}.
            </p>
          </div>
          
          <button
            onClick={handleShuffleSuggestions}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer text-[10px] uppercase font-mono flex items-center gap-1 font-bold"
            title={t("Atualizar sugestões do Star Map")}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t("Sintonizando...") : t("Recarregar")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-left">
          {visibleSuggestions.map((candidate) => {
            const scores = calculateScores(userName, candidate.name);
            const isLiked = likedProfiles.includes(candidate.id);
            const isFollowed = followedProfiles.includes(candidate.id);

            return (
              <div 
                key={candidate.id}
                className="bg-slate-900/45 p-5 rounded-3xl border border-slate-850 space-y-4 relative overflow-hidden flex flex-col justify-between"
              >
                
                {/* Photo profile and Name header layout */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <div className={`absolute inset-0 bg-gradient-to-tr ${candidate.avatarGradient} rounded-full blur-xs opacity-70`} />
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-950 flex items-center justify-center">
                        <img 
                          src={candidate.avatarUrl} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover relative z-10"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback to elegant initials background if Unsplash fails/offline
                            (e.target as any).style.display = "none";
                          }}
                        />
                        <span className="absolute z-0 text-amber-200 text-base font-black font-sans uppercase">
                          {candidate.name.substring(0, 2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-100 text-sm">{candidate.name}, {candidate.age}</h4>
                        <span className="px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 text-[8.5px] font-mono text-amber-450 rounded-md font-bold">
                          {t(candidate.sign)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-slate-450 text-[10px]">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{candidate.city}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3 text-emerald-450" />
                          <span className="text-[10px] text-emerald-400 font-bold font-mono">
                            {scores.media}% {t("Sinergia")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-350 leading-relaxed italic border-l-2 border-slate-800 pl-2.5">
                    "{candidate.bio}"
                  </p>

                  <p className="text-[10px] text-slate-400 leading-normal bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/60 font-sans">
                    <span className="font-bold text-amber-500 shrink-0 block text-[9.5px] uppercase font-mono tracking-wide mb-1">{t("Destaque de Sinergia")}</span>
                    {getCompatibilitySummaryText(userSign, candidate.sign)}
                  </p>
                </div>

                {/* Compatibility percentages metrics list */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">💖 {t("Amor")}:</span>
                      <span className="font-mono font-bold text-rose-450">{scores.amor}%</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">👥 {t("Amizade")}:</span>
                      <span className="font-mono font-bold text-sky-400">{scores.amizade}%</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">💼 {t("Trabalho")}:</span>
                      <span className="font-mono font-bold text-indigo-400">{scores.profissional}%</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
                      <span className="text-slate-450">⚡ {t("Energia")}:</span>
                      <span className="font-mono font-bold text-emerald-400">{scores.energetica}%</span>
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-850/50 mt-1">
                    <button 
                      onClick={() => handleToggleLike(candidate.id)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-sans uppercase font-bold flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 border ${
                        isLiked 
                          ? 'bg-rose-500/10 border-rose-500/35 text-rose-400 shadow-md' 
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 shrink-0 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isLiked ? t('Curtido') : t('Curtir')}</span>
                    </button>

                    <button 
                      onClick={() => handleToggleFollow(candidate.id)}
                      className={`flex-1 py-1.5 px-2.5 rounded-xl text-[10px] font-sans uppercase font-bold flex items-center justify-center gap-1 cursor-pointer transition-all duration-300 border ${
                        isFollowed 
                          ? 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400 shadow-md' 
                          : 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {isFollowed ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t('Seguindo')}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{t('Seguir')}</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setSelectedCompanion(candidate)}
                      className="py-1.5 px-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-100 opacity-90 text-slate-950 rounded-xl text-[10px] font-sans font-bold uppercase cursor-pointer"
                    >
                      {t('Ver')}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 3. VER COMPATIBILIDADE - PROFILE DETAILS MODAL */}
      {selectedCompanion && (() => {
        const scores = calculateScores(userName, selectedCompanion.name);
        return (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-150 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 md:p-8 space-y-6 relative text-left animate-in zoom-in-95 duration-200 shadow-2xl">
              
              <button 
                onClick={() => setSelectedCompanion(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 border-b border-slate-850 pb-4 pr-10">
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden relative shrink-0">
                  <img 
                    src={selectedCompanion.avatarUrl} 
                    alt={selectedCompanion.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as any).style.display = "none";
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-amber-200 bg-gradient-to-tr from-rose-600 to-amber-600 uppercase">
                    {selectedCompanion.name.substring(0, 2)}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-extrabold text-slate-100 text-lg">{selectedCompanion.name}, {selectedCompanion.age}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedCompanion.city} • {t("Sol")} em <strong>{t(selectedCompanion.sign)}</strong></span>
                  </p>
                </div>
              </div>

              {/* Sub-Affinities Breakdown */}
              <div className="space-y-4 font-sans text-xs">
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider block mb-2">{t("Afinidades e Ressonâncias Celestiais")}</span>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-rose-400">{t("Afinidade Amorosa & Sentimental")}</span>
                        <span className="font-mono text-rose-400">{scores.amor}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-rose-500 to-rose-450" style={{ width: `${scores.amor}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-sky-400">{t("Afinidade Intelectual & Mental")}</span>
                        <span className="font-mono text-sky-400">{scores.amizade}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-sky-450" style={{ width: `${scores.amizade}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-emerald-400">{t("Ressonância Energética & Áurica")}</span>
                        <span className="font-mono text-emerald-400">{scores.energetica}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${scores.energetica}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold">
                        <span className="text-indigo-400">{t("Sinergia Profissional & Conquistas")}</span>
                        <span className="font-mono text-indigo-400">{scores.profissional}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-550" style={{ width: `${scores.profissional}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3.5 leading-relaxed text-[11px]">
                  <div>
                    <h5 className="font-bold text-amber-500 text-xs">💪 {t("Pontos Fortes da Conexão:")}</h5>
                    <p className="text-slate-300 mt-1">{t("Convergência sublime de pensamentos voltados ao progresso tecnológico e social. Ideais compartilhados livres de possessividade ou ciúmes históricos sufocantes.")}</p>
                  </div>
                  
                  <div className="border-t border-slate-900 pt-3">
                    <h5 className="font-bold text-red-400 text-xs">⚠️ {t("Pontos de Atenção (Cuidado):")}</h5>
                    <p className="text-slate-300 mt-1">{t("O excesso de intelectualização pode às vezes minar a intimidade física calorosa e a escuta visceral de afetos espontâneos no cotidiano.")}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setSelectedCompanion(null)}
                  className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 rounded-xl text-xs font-bold font-sans uppercase text-slate-300 border border-slate-850 transition cursor-pointer"
                >
                  {t("Concluir Análise")}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
