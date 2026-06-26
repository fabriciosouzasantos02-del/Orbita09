import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Activity, Award, Calendar, Sparkles, ShieldCheck, BookOpen, 
  DollarSign, Heart, Users, Star, Moon, Home, Eye, Sliders,
  Compass, AlertCircle, TrendingUp, Sparkle, ArrowRight, Check, 
  Clock, Zap, Smile, Flame, Shield, HelpCircle, MessageSquare, Send, Bell, X,
  Search, Smartphone, Download, Share2, Copy
} from 'lucide-react';
import SocialCompatibility from './SocialCompatibility';
import SocialNetworkView from './SocialNetworkView';
import { generatePersonalizedProsperityMap } from './prosperityEngine';
import { generateDailyPrediction } from './dailyPredictionsEngine';
import { SIGNS_ZODIAC_LIST, BLOG_ARTICLES_LIST } from '../data';
import { loadCalculationCache, saveCalculationCache } from '../lib/firebase';
import { getAvatarUrl } from '../lib/avatars';
import { translateUiText, Language } from '../lib/translations';

function getLifePathNumber(birthDate: string): number {
  if (!birthDate) return 8; // default fallback
  const digits = birthDate.replace(/\D/g, '');
  let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

function getZodiacSign(dateStr: string): string {
  if (!dateStr) return "Aquário";
  try {
    const date = new Date(dateStr + "T00:00:00");
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Peixes";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
    return "Capricórnio";
  } catch {
    return "Aquário";
  }
}

interface UserDashboardPortalProps {
  user: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthCity: string;
    hasCreatedMap?: boolean;
    isPremium?: boolean;
    email?: string;
    profilePhoto?: string;
  };
  scorePoints: number;
  setScorePoints: React.Dispatch<React.SetStateAction<number>>;
  dailyMissions: Array<{
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    points: number;
    benefit?: string;
    benefitExplanation?: string;
  }>;
  setDailyMissions: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    points: number;
    benefit?: string;
    benefitExplanation?: string;
  }>>>;
  onRequestCreateMap?: () => void;
  dreamsHistory?: any[];
  areaSubTab?: any;
  setAreaSubTab?: any;
  onUpdateCurrentUser?: (updated: any) => void;
  lang?: Language;
}

export default function UserDashboardPortal({
  user,
  scorePoints,
  setScorePoints,
  dailyMissions,
  setDailyMissions,
  onRequestCreateMap,
  dreamsHistory = [],
  areaSubTab: propAreaSubTab,
  setAreaSubTab: propSetAreaSubTab,
  onUpdateCurrentUser,
  lang
}: UserDashboardPortalProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, lang || 'pt');
    }
    return res;
  };
  const travelerFallback = lang === 'de' ? 'Reisender' : lang === 'en' ? 'Traveler' : lang === 'es' ? 'Viajero' : 'Viajante';
  const userFirstName = user?.name ? user.name.split(' ')[0] : travelerFallback;
  const zodiacSign = getZodiacSign(user?.birthDate);
  const lifePathNumber = getLifePathNumber(user?.birthDate);

  const personalProsperity = generatePersonalizedProsperityMap(
    user?.hasCreatedMap ? user.birthDate : "1997-02-11",
    getZodiacSign(user?.birthDate),
    user?.hasCreatedMap ? user.name : "",
    new Date()
  );

  // Interactive states
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(9);

  const selectedDayPrediction = generateDailyPrediction(
    user?.hasCreatedMap ? user.birthDate : "1997-02-11",
    getZodiacSign(user?.birthDate),
    user?.hasCreatedMap ? user?.name : "",
    selectedCalendarDay - 1,
    new Date()
  );

  // Navigation tabs inside User Portal - synced securely with parent Context
  const [localAreaSubTab, setLocalAreaSubTab] = useState<any>('universo_mostrando');
  const areaSubTab = propAreaSubTab !== undefined ? propAreaSubTab : localAreaSubTab;
  const setAreaSubTab = propSetAreaSubTab !== undefined ? propSetAreaSubTab : setLocalAreaSubTab;

  const [activeCalendarFilter, setActiveCalendarFilter] = useState<string>('todos');
  const [selectedOpportunityArea, setSelectedOpportunityArea] = useState<string>('dinheiro');
  const [universoSintonizado, setUniversoSintonizado] = useState<boolean>(false);

  // Weekly Missions State
  const [weeklyMissions, setWeeklyMissions] = useState([
    { id: "w1", title: "Esta semana tente resolver uma pendência antiga", description: "Identifique uma pendência material ou burocrática acumulada e tome uma ação para resolvê-la, liberando fluxo de Saturno.", isCompleted: false, points: 150 },
    { id: "w2", title: "Esta semana fortaleça um relacionamento importante", description: "Envie uma mensagem genuína de carinho ou faça um gesto de consideração a alguém do seu círculo íntimo.", isCompleted: false, points: 120 },
    { id: "w3", title: "Esta semana dedique tempo ao aprendizado", description: "Invista pelo menos 1 hora em um livro, curso ou áudio de meditação voltado ao seu desenvolvimento pessoal.", isCompleted: false, points: 100 }
  ]);

  // Osiris Intelligent AI System States
  const [osirisDashboard, setOsirisDashboard] = useState<any>(null);
  const [osirisLoading, setOsirisLoading] = useState<boolean>(true);
  const [osirisOnlineAlert, setOsirisOnlineAlert] = useState<boolean>(true);
  const [osirisChatMessages, setOsirisChatMessages] = useState<Array<{ sender: 'user' | 'osiris', text: string }>>([
    { sender: 'osiris', text: `Olá, meu caro buscador stelar! Eu sou OSÍRIS, seu mentor astrológico supremo e guia de cura energética. Estou em plena sintonia com suas frequências cósmicas de hoje para alinhar seu dharma e afastar de forma precisa as negatividades kármicas. O que você gostaria de desvendar no momento? Me pergunte sobre o clima, biorritmo celular ou seus sonhos profundos.` }
  ]);
  const [osirisChatInput, setOsirisChatInput] = useState<string>('');
  const [osirisChatSending, setOsirisChatSending] = useState<boolean>(false);

  // Search Engine states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedSign, setSelectedSign] = useState<any>(null);

  const blogResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return BLOG_ARTICLES_LIST.filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.summary.toLowerCase().includes(query) || 
      art.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const planetResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return SIGNS_ZODIAC_LIST.filter(sign => 
      sign.name.toLowerCase().includes(query) || 
      sign.regente.toLowerCase().includes(query) || 
      sign.traits.toLowerCase().includes(query) || 
      sign.horoscopo.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const navigationDestinations = useMemo(() => {
    return [
      { id: 'missao', label: 'Missões do Portal', category: '🏆 Práticas & Evolução', keywords: 'missao pontos evolucao tarefas' },
      { id: 'amuletos', label: 'Símbolos & Amuletos', category: '🏆 Práticas & Evolução', keywords: 'amuletos simbolos protecao sorte' },
      { id: 'radar', label: 'Radar do Dia', category: '📈 Sinais & Oportunidades', keywords: 'radar dia conselho transicao' },
      { id: 'oportunidades_hoje', label: 'Radar de Oportunidades (0-100)', category: '📈 Sinais & Oportunidades', keywords: 'oportunidades dinheiro amor sorte' },
      { id: 'painel_mes', label: 'Painel do Mês', category: '🗓️ Previsões & Ciclos', keywords: 'painel mes ciclo lua conselho' },
      { id: 'calendario', label: 'Calendário Inteligente', category: '🗓️ Previsões & Ciclos', keywords: 'calendario dias datas astrologico' },
      { id: 'cores', label: 'Cores do Mês', category: '🗓️ Previsões & Ciclos', keywords: 'cores cromoterapia energia auspicioso' },
      { id: 'mensagem', label: 'Mensagem e Avisos', category: '🗓️ Previsões & Ciclos', keywords: 'mensagem avisos esferas' },
      { id: 'prosperidade', label: 'Prosperidade & Dinheiro', category: '💎 Áreas de Foco', keywords: 'dinheiro prosperidade contratos financas business' },
      { id: 'amor', label: 'Amor & Romance', category: '💎 Áreas de Foco', keywords: 'amor romance afetivo coracao cupido' },
      { id: 'compatibilidade_social', label: 'Sinergia Social & Compatibilidade', category: '💎 Áreas de Foco', keywords: 'compatibilidade sinergia afinidade social pessoas' },
      { id: 'relacionamentos', label: 'Relacionamentos Sociais', category: '💎 Áreas de Foco', keywords: 'relacionamentos amigos circulo social' },
      { id: 'desenvolvimento', label: 'Desenvolvimento Pessoal', category: '💎 Áreas de Foco', keywords: 'desenvolvimento pessoal habito saude' },
      { id: 'energia_casa', label: 'Energia da Casa', category: '🌱 Campo Energético', keywords: 'energia casa organizacao harmonia lar' },
      { id: 'sonhos', label: 'Centro de Sonhos', category: '🌱 Campo Energético', keywords: 'sonhos onirico cofre de sonhos dormir pesadelo' },
    ];
  }, []);

  const navigationResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return navigationDestinations.filter(dest => 
      dest.label.toLowerCase().includes(query) || 
      dest.category.toLowerCase().includes(query) || 
      dest.keywords.toLowerCase().includes(query)
    );
  }, [searchQuery, navigationDestinations]);

  React.useEffect(() => {
    if (!user || !user.hasCreatedMap) return;
    
    const email = user.email || localStorage.getItem("orbi_logged_email") || "";
    const todayStr = new Date().toISOString().split('T')[0];

    // Fetch daily missions
    const fetchMissions = async () => {
      try {
        if (email) {
          const cachedMissions = await loadCalculationCache(email, `daily_missions_${todayStr}`);
          if (cachedMissions && Array.isArray(cachedMissions)) {
            const updated = cachedMissions.map((m: any) => {
              const matched = dailyMissions.find(curr => curr.id === m.id);
              return {
                ...m,
                isCompleted: matched ? matched.isCompleted : false
              };
            });
            setDailyMissions(updated);
            return;
          }
        }

        const res = await fetch("/api/astrology/daily-missions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userProfile: user, lang: lang })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.missions)) {
            // Merge isCompleted from current dailyMissions if IDs match (to retain completion)
            const updated = data.missions.map((m: any) => {
              const matched = dailyMissions.find(curr => curr.id === m.id);
              return {
                ...m,
                isCompleted: matched ? matched.isCompleted : false
              };
            });
            setDailyMissions(updated);
            if (email) {
              await saveCalculationCache(email, `daily_missions_${todayStr}`, data.missions);
            }
          }
        }
      } catch (err) {
        console.warn("Falha ao carregar missões dinâmicas do Osíris:", err);
      }
    };

    // Fetch Osiris dashboard priority & alerts
    const fetchOsirisDashboard = async () => {
      setOsirisLoading(true);
      try {
        if (email) {
          const cachedDashboard = await loadCalculationCache(email, `daily_osiris_dashboard_${todayStr}`);
          if (cachedDashboard) {
            setOsirisDashboard(cachedDashboard);
            setOsirisLoading(false);
            return;
          }
        }

        const defaultBiorhythm = { physical: 78, emotional: 82, intellectual: 65 };
        const defaultWeather = { temperature: 24, condition: lang === 'de' ? "Teilweise bewölkt" : lang === 'en' ? "Partly Cloudy" : lang === 'es' ? "Parcialmente Nublado" : "Parcialmente Nublado" };
        const locationStr = user?.birthCity || "São Paulo, SP";

        const res = await fetch("/api/osiris/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userProfile: user,
            weather: defaultWeather,
            biorhythm: defaultBiorhythm,
            location: locationStr,
            lastDream: dreamsHistory && dreamsHistory.length > 0 ? dreamsHistory[0] : null,
            lang: lang
          })
        });
        if (res.ok) {
          const data = await res.json();
          setOsirisDashboard(data);
          if (email) {
            await saveCalculationCache(email, `daily_osiris_dashboard_${todayStr}`, data);
          }
        }
      } catch (err) {
        console.warn("Falha ao carregar dashboard inteligente do Osíris:", err);
      } finally {
        setOsirisLoading(false);
      }
    };

    fetchMissions();
    fetchOsirisDashboard();
  }, [user]);

  const handleSendOsirisMessage = async () => {
    if (!osirisChatInput.trim() || osirisChatSending) return;
    const userMsgText = osirisChatInput;
    setOsirisChatInput('');
    setOsirisChatMessages(prev => [...prev, { sender: 'user', text: userMsgText }]);
    setOsirisChatSending(true);

    try {
      const defaultBiorhythm = { physical: 78, emotional: 82, intellectual: 65 };
      const defaultWeather = { temperature: 24, condition: lang === 'de' ? "Teilweise bewölkt" : lang === 'en' ? "Partly Cloudy" : lang === 'es' ? "Parcialmente Nublado" : "Parcialmente Nublado" };
      const locationStr = user?.birthCity || "São Paulo, SP";

      const res = await fetch("/api/osiris/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...osirisChatMessages.map(m => ({ sender: m.sender === 'user' ? 'user' : 'assistant', text: m.text })),
            { sender: 'user', text: userMsgText }
          ],
          userProfile: user,
          weather: defaultWeather,
          biorhythm: defaultBiorhythm,
          location: locationStr,
          dreams: dreamsHistory
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.response) {
          setOsirisChatMessages(prev => [...prev, { sender: 'osiris', text: data.response }]);
          return;
        }
      }
      throw new Error("Resposta inválida do Osíris");
    } catch (err) {
      console.warn("Erro no chat com Osíris:", err);
      setOsirisChatMessages(prev => [
        ...prev,
        { sender: 'osiris', text: `Desculpe, sinto uma instabilidade temporária nas esferas celestes. Mas recorde: a força solar brilha firme em sua alma hoje.` }
      ]);
    } finally {
      setOsirisChatSending(false);
    }
  };

  // RESTRICTED VIEW: ÁREA PESSOAL SEM MAPA
  if (!user?.hasCreatedMap) {
    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in duration-305 p-3 md:p-6 select-none max-w-7xl mx-auto">
        
        {/* 1. PERFIL CARD */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-850 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-600 rounded-full blur-xs opacity-55" />
              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-amber-400/80 bg-slate-950 flex items-center justify-center">
                {user.profilePhoto ? (
                  <img src={getAvatarUrl(user.profilePhoto)} alt={user.name} className="w-full h-full object-cover relative z-10" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-2xl font-black text-amber-300 font-sans relative z-10">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h2 className="text-lg font-extrabold text-slate-100">{user.name || t("Viajante Estelar")}</h2>
                <span className="w-fit mx-auto sm:mx-0 px-2 py-0.5 bg-amber-500/10 border border-amber-500/25 text-[8.5px] font-mono font-bold text-amber-450 rounded-md">
                  {t("Assinatura Premium Ativa")}
                </span>
              </div>
              <div className="text-slate-450 text-xs font-sans space-y-1">
                {user.email && <p>{t("E-mail")}: <span className="font-mono text-slate-300">{user.email}</span></p>}
                <p>Status: <span className="text-amber-400 font-bold font-mono">{t("Aguardando seu Mapa Primordial")}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CONVITE PARA CRIAR O MAPA */}
        <div className="bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 p-6 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-xl">
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-black text-amber-450 rounded-lg uppercase tracking-wider">
              {t("ALINHAMENTO COLETIVO GRATUITO")}
            </span>
            <h3 className="text-base md:text-lg font-black font-sans text-slate-100 tracking-tight">{t("Sua Assinatura está Pronta. Sincronize seu Mapa Astral!")}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {t("Calcule as 12 ordens de casas sob o método clássico Placidus, as 10 distâncias angulares do Sol ao Meio do Céu, o guia numerológico de prosperidade e as sinergias sociais criptografadas.")}
            </p>
          </div>
          <button
            onClick={onRequestCreateMap}
            className="w-full md:w-auto shrink-0 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-600 rounded-xl text-xs font-black font-sans uppercase text-slate-950 shadow-lg tracking-wide hover:opacity-100 opacity-90 transition cursor-pointer active:scale-95"
          >
            {t("Criar Meu Mapa Astral")}
          </button>
        </div>

        {/* 3. EXPLICAÇÃO DAS FUNCIONALIDADES */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest text-left">{t("Guia de Portais e Funcionalidades Ativas")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-left">
            {[
              { title: t("Mapa Natal Placidus Completo"), desc: t("Mapeamento das 12 ordens de casas, posições exatas dos astros clássicos e modernos em relação ao horizonte e local de nascimento."), highlight: t("CÁLCULO GEOMÉTRICO") },
              { title: t("Sinergia Social & Compatibilidade"), desc: t("Varredura do ecossistema de usuários reais em afinidade afetiva, amizade, prosperidade e energia para sintonizar afinidades mutáveis."), highlight: t("CONEXÃO REAL") },
              { title: t("Radar do Dia & Biorritmo"), desc: t("Acompanhamento detalhado e dinâmico de suas oscilações moleculares e intelectuais com conselhos estratégicos atualizados."), highlight: t("FALAS DIÁRIAS") },
              { title: t("Conselheira Orbia"), desc: t("O auge da sabedoria integrada. Chat interativo e confidencial baseado no seu mapa natal para sanar anseios de carreira e propósitos."), highlight: t("SUPORTE INDIVIDUAL") },
              { title: t("Guia Semanal do Tarô"), desc: t("Sorteio consciente do arcano semanal orientador trazendo as diretrizes práticas para resguardo energético e expansão."), highlight: t("ORÁCULO SEMANAL") },
              { title: t("Vibrações de Prosperidade"), desc: t("Conheça seu caminho evolutivo numerológico, as cores auspiciosas, os amuletos recomendados e dias ideias para contratos."), highlight: t("NUMEROLOGIA ATIVA") },
            ].map((func, i) => (
              <div key={i} className="bg-slate-900/30 p-5 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.55">
                  <span className="text-[8px] font-mono text-amber-450 uppercase font-bold tracking-wide bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.5 rounded-md">
                    {func.highlight}
                  </span>
                  <h4 className="font-bold text-slate-200 text-xs mt-2">{func.title}</h4>
                  <p className="text-[11px] text-slate-405 leading-relaxed font-normal">{func.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. DEMONSTRAÇÕES ILUSTRATIVAS (POLISHED BLURRED PREVIEWS) */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest text-left font-bold">{t("Demonstrações Ilustrativas Pré-Mapa")}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-sans">
            
            {/* Mock Radar do Dia */}
            <div className="p-5 bg-slate-900/10 border border-slate-850/80 rounded-2xl space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10 text-center space-y-2 select-none">
                <span className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs">
                  🔒
                </span>
                <span className="font-bold text-xs text-amber-450 tracking-wide uppercase font-mono">{t("Funcionalidade Bloqueada")}</span>
                <p className="text-[10px] text-slate-400 max-w-xs leading-normal">{t("Crie seu mapa astral oficial para sintonizar e liberar seu biorritmo científico e estatísticas diárias.")}</p>
              </div>

              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{t("⚡ Radar do Dia")}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              </div>
              <div className="space-y-3 opacity-25">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span>{t("Energia Vital")}</span>
                    <span className="font-mono">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[92%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span>{t("Produtividade Sideral")}</span>
                    <span className="font-mono">81%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[81%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Tarot Semanal */}
            <div className="p-5 bg-slate-900/10 border border-slate-850/80 rounded-2xl space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-10 text-center space-y-2 select-none">
                <span className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs">
                  🔒
                </span>
                <span className="font-bold text-xs text-amber-450 tracking-wide uppercase font-mono">{t("Funcionalidade Bloqueada")}</span>
                <p className="text-[10px] text-slate-400 max-w-xs leading-normal">{t("Seu conselho do tarô semanal do destino requer as coordenadas geométricas do seu nascimento.")}</p>
              </div>

              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">{t("🔮 Arcana Maior Semanal")}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-405" />
              </div>
              <div className="flex gap-4 items-center opacity-25">
                <div className="w-12 h-18 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-lg select-none font-sans font-bold text-amber-400/50">
                  ♚
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-bold text-slate-350 text-xs font-sans">{t("O Imperador (Arcano IV)")}</h4>
                  <p className="text-[10px] text-slate-500 leading-snug">{t("Autoridade, ordem prática e estabilidade rígida para expandir metas materiais organizadas.")}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // Toggle helpers
  const handleToggleDailyMission = (id: string) => {
    setDailyMissions(prev => prev.map(m => {
      if (m.id === id) {
        const next = !m.isCompleted;
        setScorePoints(s => next ? s + m.points : Math.max(0, s - m.points));
        return { ...m, isCompleted: next };
      }
      return m;
    }));
  };

  const handleToggleWeeklyMission = (id: string) => {
    setWeeklyMissions(prev => prev.map(m => {
      if (m.id === id) {
        const next = !m.isCompleted;
        setScorePoints(s => next ? s + m.points : Math.max(0, s - m.points));
        return { ...m, isCompleted: next };
      }
      return m;
    }));
  };

  // 1. DATA DEFINITIONS FOR DISPENSATION & TENDENCIES
  const opportunityRadarValues: Record<string, { val: number, bg: string, color: string, text: string, conselho: string }> = {
    dinheiro: { 
      val: 85, bg: 'bg-emerald-500/10 border-emerald-500/35', color: 'text-emerald-400', 
      text: 'Oportunidades de ganhos secundários intelectuais sob ar ativo.',
      conselho: 'O trânsito atual favorece a formatação de serviços de mentoria ou rascunhos de propostas comerciais. Fique atento a propostas nas terças ou quintas-feiras.'
    },
    amor: { 
      val: 68, bg: 'bg-pink-500/10 border-pink-500/35', color: 'text-pink-400', 
      text: 'Magnetismo em alta, facilitando conexões profundas e românticas.',
      conselho: 'Com Vênus emanando trígonos estelares, desfaça os muros analíticos e compartilhe desejos sinceros. Sexta-feira à noite é o melhor período para conversas afetivas.'
    },
    estudos: { 
      val: 94, bg: 'bg-sky-500/10 border-sky-505/35', color: 'text-sky-400', 
      text: 'Retenção intelectual extraordinária e foco linear ativado.',
      conselho: 'Sua mente possui uma facilidade única hoje para absorver conceitos metafísicos, matemáticos e científicos. Ótimo dia para devorar livros ou rascunhar códigos.'
    },
    trabalho: { 
      val: 81, bg: 'bg-indigo-500/10 border-indigo-500/35', color: 'text-indigo-400', 
      text: 'Capacidade de estruturação mecânica e conclusão de pendências.',
      conselho: 'A influência do Caminho de Vida 8 ressoa para estabilizar as tarefas administrativas do seu negócio. Execute sem procrastinar.'
    },
    criatividade: { 
      val: 90, bg: 'bg-amber-500/10 border-amber-500/35', color: 'text-amber-400', 
      text: 'Canal mental de ideias originais e soluções inovadoras fluido.',
      conselho: 'Não filtre seus insights à primeira vista. Deixe o ar soprar novas ideias sem compromisso no papel de rascunho.'
    },
    networking: { 
      val: 75, bg: 'bg-teal-500/10 border-teal-500/35', color: 'text-teal-400', 
      text: 'Facilidade para gerar engajamento em causas sociais e projetos coletivos.',
      conselho: 'Entre em contato com mentores ou parceiros adormecidos. Compartilhar ideais éticos fortalece o Sol em Aquário.'
    },
    espiritualidade: { 
      val: 88, bg: 'bg-purple-500/10 border-purple-500/35', color: 'text-purple-400', 
      text: 'Frequência onírica aberta e trânsito favorável a rituais astrológicos.',
      conselho: 'Medite com cristais de Sodalita ou Selenita. Suas conexões áuricas com esferas superiores estão extremamente receptivas hoje.'
    }
  };

  // 2. INTELLIGENT CALENDAR CONFIGURATION
  // Day categories maps for June 2026
  const calendarCategories = [
    { id: 'todos', label: 'Todos os Dias', icon: Calendar, color: 'text-slate-400', list: [] },
    { id: 'produtividade', label: 'Produtividade', icon: Activity, color: 'text-orange-400', list: [3, 7, 12, 15, 21, 28] },
    { id: 'descanso', label: 'Descanso', icon: ShieldCheck, color: 'text-teal-400', list: [6, 11, 14, 20, 24, 30] },
    { id: 'familia', label: 'Família', icon: Users, color: 'text-blue-400', list: [2, 9, 16, 23, 29] },
    { id: 'encontros', label: 'Encontros', icon: Heart, color: 'text-rose-400', list: [5, 10, 18, 22, 27] },
    { id: 'diversao', label: 'Diversão', icon: Smile, color: 'text-yellow-405', list: [4, 13, 17, 25] },
    { id: 'entrevistas', label: 'Entrevistas', icon: Sparkle, color: 'text-indigo-400', list: [1, 8, 19, 26] },
    { id: 'vendas', label: 'Vendas', icon: DollarSign, color: 'text-emerald-400', list: [3, 12, 18, 28] },
    { id: 'investimentos', label: 'Investimentos', icon: Zap, color: 'text-amber-500', list: [8, 15, 22] },
    { id: 'viagens', label: 'Viagens', icon: Compass, color: 'text-sky-400', list: [10, 20, 29] },
    { id: 'mudancas', label: 'Mudanças', icon: Flame, color: 'text-rose-500', list: [11, 25] },
    { id: 'projetos', label: 'Iniciar Projetos', icon: Award, color: 'text-pink-400', list: [1, 7, 15, 21] },
    { id: 'contratos', label: 'Assinar Contratos', icon: BookOpen, color: 'text-purple-400', list: [5, 12, 22] },
    { id: 'conversas', label: 'Conversas Difíceis', icon: AlertCircle, color: 'text-red-450', list: [9, 16, 30] },
    { id: 'estudos', label: 'Estudos', icon: Star, color: 'text-emerald-505', list: [2, 6, 13, 19, 27] },
    { id: 'exercicios', label: 'Exercícios Físicos', icon: Activity, color: 'text-amber-400', list: [4, 11, 18, 25] },
    { id: 'meditacao', label: 'Meditação', icon: Eye, color: 'text-teal-400', list: [6, 14, 20, 28] },
    { id: 'espiritualidade', label: 'Espiritualidade', icon: Sparkles, color: 'text-purple-400', list: [8, 17, 26] },
    { id: 'compras', label: 'Compras Importantes', icon: DollarSign, color: 'text-amber-450', list: [5, 15, 22] }
  ];

  const getCalendarDayIconAndBg = (day: number) => {
    const calLabels: Record<string, string[]> = {
      pt: ["Descanso", "Produtividade", "Encontros", "Avisos", "Financeiro", "Social"],
      en: ["Rest", "Productivity", "Meetings", "Alerts", "Financial", "Social"],
      de: ["Erholung", "Produktivität", "Treffen", "Warnungen", "Finanzen", "Soziales"],
      es: ["Descanso", "Productividad", "Encuentros", "Avisos", "Financiero", "Social"],
    };
    const labels = calLabels[lang || 'pt'] || calLabels['pt'];
    const syms = ["🌙", "🎯", "💖", "⚡", "💸", "💬"];
    if (activeCalendarFilter === 'todos') {
      return { sym: syms[day % 6], label: labels[day % 6] };
    }

    const matchedCat = calendarCategories.find(c => c.id === activeCalendarFilter);
    if (matchedCat && matchedCat.list.includes(day)) {
      return { sym: "⭐️", label: matchedCat.label, isMatched: true };
    }
    return { sym: "", label: "", isMatched: false };
  };

  const getDetailedDayGuidance = (day: number) => {
    const matchedFavorableTypes: string[] = [];
    calendarCategories.forEach(cat => {
      if (cat.id !== 'todos' && cat.list.includes(day)) {
        matchedFavorableTypes.push(cat.label);
      }
    });

    const neutralInfluences = lang === 'de' ? 'Allgemeine neutrale Einflüsse' : lang === 'en' ? 'General Neutral Influences' : lang === 'es' ? 'Influencias Generales Neutras' : 'Influências Gerais Neutras';
    const guidanceEven = lang === 'de'
      ? "Ein Tag, der von der reflektiven Energie des Mondes dominiert wird. Ideal, um alte Geschäftsideen zu strukturieren oder den Finanzfluss mit saturnischem Urteil zu überprüfen. Müdigkeit ist heilig — respektiere natürliche Pausen."
      : lang === 'en'
      ? "A day dominated by the Moon's reflective energy. Perfect for structuring old business ideas or reviewing the flow of finances with Saturnian discernment. Tiredness is sacred — respect natural pauses."
      : lang === 'es'
      ? "Un día dominado por la energía reflexiva de la Luna. Perfecto para estructurar ideas antiguas de negocios o revisar el flujo de las finanzas con criterio saturnino. El cansancio es sagrado, respeta las pausas naturales."
      : "Dia dominado pela energia reflexiva da Lua. Perfeito para estruturar ideias antigas de negócios ou revisar o fluxo das finanças com critério saturnino. O cansaço é sagrado, respeite as pausas naturais.";
    const guidanceOdd = lang === 'de'
      ? "Ein Tag, der vom Sonnenimpuls des Luftelements geprägt ist. Ausgezeichnet, um Geschäftsvorschläge mündlich zu äußern, Ideen mit Partnern ungezwungen zu diskutieren oder über onirologische Spiritualität zu lesen."
      : lang === 'en'
      ? "A day marked by the solar impulse of the Air element. Excellent for verbally expressing business proposals, discussing ideas casually with partners or reading about oneiric spirituality."
      : lang === 'es'
      ? "Un día marcado por el impulso solar del elemento Aire. Excelente para expressar verbalmente propuestas comerciales, debatir ideas de forma distendida con socios o leer sobre espiritualidad onírica."
      : "Dia marcado pelo impulso solar do elemento Ar. Excelente para expressar verbalmente propostas comerciais, debater ideias de forma descontraída com parceiros ou ler sobre espiritualidade onírica.";
    const tips: Record<string, string[]> = {
      pt: [
        "Acenda um incenso de sândalo de manhã para sintonizar a sabedoria e limpe sua mesa.",
        "Evite comprar itens supérfluos no final do dia. Aguarde 24 horas antes de decidir.",
        "Faça alongamentos respiratórios intensificados de 5 minutos logo ao despertar."
      ],
      en: [
        "Light a sandalwood incense in the morning to tune into wisdom and clear your desk.",
        "Avoid buying superfluous items at the end of the day. Wait 24 hours before deciding.",
        "Do 5 minutes of intensive breathing stretches right when you wake up."
      ],
      de: [
        "Zünde morgens ein Sandelholzräucherstäbchen an, um Weisheit zu empfangen und deinen Schreibtisch aufzuräumen.",
        "Vermeide es, am Ende des Tages überflüssige Dinge zu kaufen. Warte 24 Stunden vor einer Entscheidung.",
        "Mache beim Aufwachen 5 Minuten intensive Atemübungen."
      ],
      es: [
        "Enciende un incienso de sándalo por la mañana para sintonizar la sabiduría y limpia tu mesa.",
        "Evita comprar artículos superfluos al final del día. Espera 24 horas antes de decidir.",
        "Haz estiramientos respiratorios intensificados de 5 minutos al despertar."
      ],
    };
    const langTips = tips[lang || 'pt'] || tips['pt'];

    return {
      favorable: matchedFavorableTypes.length > 0 ? matchedFavorableTypes.join(', ') : neutralInfluences,
      guidance: day % 2 === 0 ? guidanceEven : guidanceOdd,
      tip: day % 3 === 0 ? langTips[0] : day % 3 === 1 ? langTips[1] : langTips[2],
    };
  };

  return (
    <div className="space-y-6">

      {/* FEATURED PORTAL HEADLINE & UNIVERSE SHOWCASE HIGHLIGHT BANNER */}
      <div className="relative p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-850 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.06),transparent)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="text-left space-y-1 z-10 max-w-xl">
          <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'de' ? 'Aktives synchronisiertes Portal' : lang === 'en' ? 'Active Synchronized Portal' : lang === 'es' ? 'Portal Activo Sincronizado' : 'Portal Ativo Sincronizado'}
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight leading-snug">
            {lang === 'de' ? 'Beschleunige deine Ziele, navigiere durch die aktiven Portale' : lang === 'en' ? 'Accelerate Your Goals, Navigate the Active Portals' : lang === 'es' ? 'Acelera tus Objetivos, Navega por los Portales Activos' : 'Acelere Seus Objetivos, Navegue pelos Portais Ativos'}
          </h2>
        </div>

        {/* Highlighted Universe Spot Box */}
        <button
          type="button"
          onClick={() => setAreaSubTab('painel_mes')}
          className="relative group p-3 rounded-2xl bg-slate-950/70 hover:bg-slate-950/90 border border-amber-500/35 hover:border-amber-400/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 transition-all duration-300 w-full md:w-auto shrink-0 z-10 text-left shadow-[0_0_25px_rgba(245,158,11,0.03)] focus:outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/10 to-indigo-500/20 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <Eye className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-400 tracking-wide uppercase flex items-center gap-1 flex-wrap font-sans">
                🪐 {lang === 'de' ? 'Sieh was das Universum dir zeigen möchte' : lang === 'en' ? 'See what the universe wants to show you' : lang === 'es' ? 'Ve lo que el universo quiere mostrarte' : 'Veja o que o universo quer te mostrando'}
              </span>
              <p className="text-[9px] text-slate-400 font-medium">{lang === 'de' ? 'Monatspanel und kosmische Orientierungen.' : lang === 'en' ? 'Monthly panel and cosmic guidance.' : lang === 'es' ? 'Panel del mes y orientaciones cósmicas.' : 'Painel do mês e orientações cósmicas.'}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider self-end sm:self-center shrink-0 transition shadow-md hover:shadow-amber-500/10 hover:scale-102">
            {lang === 'de' ? 'Alles sehen →' : lang === 'en' ? 'See all →' : lang === 'es' ? 'Ver todo →' : 'Ver tudo →'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
        {/* 1. LEFT SIDEBAR NAVIGATION OR MOBILE DROPDOWN */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">

          {/* Mobile Dropdown Category Selector */}
          <div className="lg:hidden animate-in fade-in duration-300">
            <label className="block text-[10px] font-mono text-slate-500 mb-1.5 uppercase font-black tracking-wide">
              {t("Acelere Seus Objetivos, Navegue pelos Portais Ativos")}
            </label>
            <div className="relative">
              <select
                value={areaSubTab}
                onChange={(e) => setAreaSubTab(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-black text-slate-200 tracking-wider focus:outline-hidden cursor-pointer"
              >
                <optgroup label={`🌌 ${t("Revelação Semanal")}`}>
                  <option value="universo_mostrando">🪐 {t("Veja o que o universo quer te mostrando")}</option>
                </optgroup>
                <optgroup label={`🏆 ${t("Práticas & Evolução")}`}>
                  <option value="missao">🏅 {t("Missões do Portal")}</option>
                  <option value="amuletos">🔮 {t("Símbolos & Amuletos")}</option>
                </optgroup>
                <optgroup label={`📈 ${t("Sinais & Oportunidades do Dia")}`}>
                  <option value="radar">⚡ {t("Radar do Dia")}</option>
                  <option value="oportunidades_hoje">🎯 {t("Radar de Oportunidades (0-100)")}</option>
                </optgroup>
                <optgroup label={`🗓️ ${t("Previsões & Ciclos do Mês")}`}>
                  <option value="painel_mes">🌙 {t("Painel do Mês")}</option>
                  <option value="calendario">📅 {t("Calendário Inteligente")}</option>
                  <option value="cores">🎨 {t("Cores do Mês")}</option>
                  <option value="mensagem">✉️ {t("Mensagem e Avisos")}</option>
                </optgroup>
                <optgroup label={`💎 ${t("Áreas de Foco")}`}>
                  <option value="prosperidade">💸 {t("Prosperidade & Dinheiro")}</option>
                  <option value="amor">💖 {t("Amor & Romance")}</option>
                  <option value="compatibilidade_social">👥 {t("Sinergia Social & Compatibilidade")}</option>
                  <option value="relacionamentos">👥 {t("Relacionamentos Sociais")}</option>
                  <option value="desenvolvimento">🌱 {t("Desenvolvimento Pessoal")}</option>
                </optgroup>
                <optgroup label={`🌱 ${t("Campo Energético")}`}>
                  <option value="energia_casa">🏡 {t("Energia da Casa")}</option>
                  <option value="sonhos">🌙 {t("Centro de Sonhos")}</option>
                </optgroup>
                <optgroup label={`📱 ${t("Aplicativo Mobile")}`}>
                  <option value="baixar_app">📱 {t("Instalar APK / PWA")}</option>
                </optgroup>
              </select>
            </div>
          </div>

        {/* Desktop Styled Sidebar Navigation inside a bento container */}
        <div className="hidden lg:block space-y-4 sticky top-6">
          <div className="p-4 bg-slate-950/60 rounded-3xl border border-slate-850/80 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider block">
                {lang === 'de' ? 'Kosmische Navigation' : lang === 'en' ? 'Cosmic Navigation' : lang === 'es' ? 'Navegación Cósmica' : 'Navegação Cósmica'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-4">
              {[
                {
                  group: "Oráculo de Entrada",
                  items: [
                    { id: 'universo_mostrando', label: 'Elias & Sinais', icon: Eye, color: 'text-purple-400', bg: 'hover:bg-purple-500/5' }
                  ]
                },
                {
                  group: "Práticas & Evolução",
                  items: [
                    { id: 'missao', label: 'Missões do Portal', icon: Award, color: 'text-indigo-400', bg: 'hover:bg-indigo-500/5' },
                    { id: 'amuletos', label: 'Símbolos & Amuletos', icon: ShieldCheck, color: 'text-emerald-400', bg: 'hover:bg-emerald-500/5' }
                  ]
                },
                {
                  group: "Estatísticas Diárias",
                  items: [
                    { id: 'radar', label: 'Radar do Dia', icon: Activity, color: 'text-rose-400', bg: 'hover:bg-rose-500/5' },
                    { id: 'oportunidades_hoje', label: 'Radar Oportunidades', icon: Compass, color: 'text-amber-400', bg: 'hover:bg-amber-500/5' }
                  ]
                },
                {
                  group: "Planejamento Astrológico",
                  items: [
                    { id: 'painel_mes', label: 'Painel do Mês', icon: Calendar, color: 'text-teal-400', bg: 'hover:bg-teal-500/5' },
                    { id: 'calendario', label: 'Calendário Inteligente', icon: Calendar, color: 'text-sky-400', bg: 'hover:bg-sky-500/5' },
                    { id: 'cores', label: 'Cores do Mês', icon: Sparkles, color: 'text-indigo-400', bg: 'hover:bg-indigo-500/5' },
                    { id: 'mensagem', label: 'Mensagem & Alertas', icon: BookOpen, color: 'text-pink-400', bg: 'hover:bg-pink-500/5' }
                  ]
                },
                {
                  group: "Pilares do Destino",
                  items: [
                    { id: 'prosperidade', label: 'Prosperidade e Capital', icon: DollarSign, color: 'text-emerald-400', bg: 'hover:bg-emerald-505/5' },
                    { id: 'amor', label: 'Amor & Intimidade', icon: Heart, color: 'text-red-400', bg: 'hover:bg-red-500/5' },
                    { id: 'compatibilidade_social', label: 'Sinergia Social', icon: Users, color: 'text-amber-400', bg: 'hover:bg-amber-500/5' },
                    { id: 'relacionamentos', label: 'Relacionamentos', icon: Users, color: 'text-cyan-400', bg: 'hover:bg-cyan-500/5' },
                    { id: 'desenvolvimento', label: 'Desenv. Pessoal', icon: Star, color: 'text-yellow-405', bg: 'hover:bg-yellow-500/5' },
                    { id: 'energia_casa', label: 'Energia da Casa', icon: Home, color: 'text-indigo-405', bg: 'hover:bg-indigo-505/5' },
                    { id: 'sonhos', label: 'Centro de Sonhos', icon: Moon, color: 'text-pink-400', bg: 'hover:bg-pink-500/5' }
                  ]
                },
                {
                  group: "Aplicativo Celular",
                  items: [
                    { id: 'baixar_app', label: 'Instalar APK / PWA', icon: Smartphone, color: 'text-rose-450', bg: 'hover:bg-rose-500/5' }
                  ]
                }
              ].map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-1">
                  <span className="text-[8px] font-mono font-black text-slate-600 block uppercase px-2 tracking-widest leading-none mb-1">{t(group.group)}</span>
                  <div className="space-y-0.5">
                    {group.items.map((sub) => {
                      const Icon = sub.icon;
                      const isSelected = areaSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setAreaSubTab(sub.id as any)}
                          className={`w-full px-3 py-1.5 rounded-xl text-[10.5px] font-bold tracking-wide transition-all duration-300 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 border border-slate-800 text-slate-100 shadow-xs scale-102 font-black'
                              : `text-slate-400 border border-transparent ${sub.bg} hover:text-slate-205`
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-3.5 h-3.5 ${sub.color}`} />
                            <span>{t(sub.label)}</span>
                          </div>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* 2. MAIN DASHBOARD CONTENT AREA */}
        <div className="lg:col-span-8 xl:col-span-9 min-h-[500px]">
          <div className="animate-in fade-in duration-300">
            {areaSubTab === 'universo_mostrando' && (
            <div className="space-y-6">
              {/* OSÍRIS ALIGNED WELCOME & INTUITIVE ONLINE ACTION BANNER */}
              {osirisOnlineAlert && osirisDashboard?.contextMessage && (
                <div className="bg-slate-900 border border-amber-500/30 p-4 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
                  <div className="space-y-0.5 text-left pl-3">
                    <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Mensagem Contextual de Osíris</span>
                    <p className="text-xs text-slate-250 leading-relaxed font-sans">{osirisDashboard.contextMessage.sentence}</p>
                    <p className="text-xs text-amber-200/90 font-bold font-serif">{osirisDashboard.contextMessage.prompt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        const chatEl = document.getElementById("osiris-chat-box");
                        if (chatEl) {
                          chatEl.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg tracking-wider transition uppercase"
                    >
                      Perguntar Agora
                    </button>
                    <button
                      type="button"
                      onClick={() => setOsirisOnlineAlert(false)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
                      title="Fechar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* MAIN METRIC: PRIORIDADE DO DIA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* PART A: SINGLE KEY DAILY FOCUS CARD */}
                <div className="bg-gradient-to-br from-indigo-950/30 via-slate-950 to-slate-950 p-6 rounded-3xl border border-indigo-500/20 shadow-lg relative overflow-hidden text-left flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono text-indigo-400 font-extrabold rounded-lg uppercase tracking-wider">
                        ★ Prioridade do Dia: {osirisDashboard?.prioridadeDia?.category || "Espiritualidade"}
                      </span>
                      <span className="text-[10px] font-mono text-amber-500 font-extrabold flex items-center gap-1">
                        ✦ Sincronia: {osirisDashboard?.prioridadeDia?.rating || "4.9"}/5
                      </span>
                    </div>

                    {osirisLoading ? (
                      <div className="space-y-2 animate-pulse py-4">
                        <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-800 rounded w-full"></div>
                        <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-100 tracking-tight font-sans">
                          {osirisDashboard?.prioridadeDia?.title || "Sintonia de Foco Celular"}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          {osirisDashboard?.prioridadeDia?.description || `Sua bússola biológica e o trânsito do Sol em de ${zodiacSign} orientam seu fluxo prático nesta coordenada.`}
                        </p>
                        <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl mt-3">
                          <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-0.5">Conselho do Místico</span>
                          <p className="text-[11px] text-slate-300 font-serif italic leading-relaxed">
                            "{osirisDashboard?.prioridadeDia?.advice || 'Seja vigilante ao seu biorritmo. Pequenas reflexões de 3 minutos trarão alinhamento.'}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-900/50 flex items-center justify-between mt-4">
                    <span className="text-[9px] text-slate-500 font-mono">Orientação Única Diária de Osíris</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* PART B: OFFLINE PUSH NOTIFICATIONS LOG (SIMULATED COPT CHART) */}
                <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-850 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-500 animate-swing" />
                        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">Fila Push Offline (Hoje)</span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-500">Últimas 3 Notificações</span>
                    </div>

                    {osirisLoading ? (
                      <div className="space-y-3 animate-pulse">
                        <div className="h-10 bg-slate-900 rounded-xl"></div>
                        <div className="h-10 bg-slate-900 rounded-xl"></div>
                        <div className="h-10 bg-slate-900 rounded-xl"></div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {osirisDashboard?.offlineNotifications?.map((notif: any) => (
                          <div key={notif.id} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-850/40 flex items-start gap-2.5 hover:border-slate-800 transition">
                            <span className="text-xs mt-0.5 shrink-0">
                              {notif.type === 'transit' ? '🪐' : notif.type === 'lune' ? '🌙' : '✨'}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex justify-between items-baseline gap-2">
                                <h5 className="text-[10px] font-extrabold text-slate-205 truncate">{notif.title}</h5>
                                <span className="text-[8px] text-slate-500 font-mono shrink-0">{notif.time}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{notif.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-[8.5px] text-slate-500 font-sans mt-3">★ Mensagens despachadas pelas esferas celestes enquanto você estava em desconexão prática.</p>
                </div>
              </div>

              {/* SECTION: OSÍRIS CHAT ASSISTANT COMPANION */}
              <div id="osiris-chat-box" className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="pb-3 border-b border-slate-850 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-xs animate-ping" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block z-10 relative" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest">Osíris: Mentor e Conselheiro Live</h3>
                      <p className="text-[9.5px] text-slate-500">Sincronizado aos seus Transitos Estelares, Temperatura do ar e Biorritmo celular</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 rounded">
                    Sábio Ativo
                  </span>
                </div>

                {/* Osiris Chat History Stream */}
                <div className="h-[250px] overflow-y-auto px-2 space-y-3 flex flex-col scrollbar-thin scrollbar-thumb-slate-850 text-left">
                  {osirisChatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] rounded-2xl p-3 text-[11px] leading-relaxed font-sans ${
                        msg.sender === 'user'
                          ? 'bg-amber-600/10 border border-amber-500/25 text-amber-100 self-end'
                          : 'bg-slate-950/90 border border-slate-850/60 text-slate-300 self-start'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1 font-mono text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>{msg.sender === 'user' ? 'Você' : 'Osíris'}</span>
                        <span>•</span>
                        <span>Agora</span>
                      </div>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  ))}
                  {osirisChatSending && (
                    <div className="bg-slate-950/90 border border-slate-850/60 text-slate-400 self-start rounded-2xl p-3 text-[11px] max-w-[80%] flex items-center gap-1.5 font-mono animate-pulse">
                      <span>✦ Osíris está sintonizando energias...</span>
                    </div>
                  )}
                </div>

                {/* Osiris Chat Box Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendOsirisMessage();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={osirisChatInput}
                    onChange={(e) => setOsirisChatInput(e.target.value)}
                    placeholder="Pergunte ao Osíris sobre seus trânsitos, clima ou sonhos de hoje..."
                    disabled={osirisChatSending}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-205 placeholder-slate-500 focus:outline-hidden focus:border-amber-500/50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={osirisChatSending || !osirisChatInput.trim()}
                    className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:opacity-50 text-slate-950 rounded-xl transition cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: RADAR DO DIA */}
          {areaSubTab === 'radar' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    Radar do dia
                  </h3>
                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono font-bold text-rose-455 rounded-lg">
                    Atualização Diária
                  </span>
                </div>

                <div className="space-y-4 font-sans text-left">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/60">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Frequência Dominante Celular</span>
                    <span className="text-xs font-black text-rose-455 block tracking-wide mt-1">
                      Intuição Harmoniosa & Foco Singular (Sol e Mercúrio em Trígono)
                    </span>
                  </div>

                  {/* The 5 Metrics */}
                  <div className="space-y-3 pt-1">
                    {[
                      { label: 'Energia Vital', val: 92, grad: 'from-amber-500 to-orange-500', desc: 'Sua vitalidade celular física e impulso vital ativo sob sua regência estelar.' },
                      { label: 'Produtividade', val: 88, grad: 'from-indigo-500 to-purple-600', desc: 'Retenção intelectual e foco singular de mercúrio ativo.' },
                      { label: 'Relacionamentos', val: 74, grad: 'from-pink-500 to-rose-550', desc: 'Expressão de afetos, diplomacia e conexões áuricas com base em Vênus.' },
                      { label: 'Organização', val: 81, grad: 'from-emerald-500 to-teal-500', desc: 'Estruturação de afazeres diários sob o Caminho de Vida 8.' },
                      { label: 'Bem-estar', val: 90, grad: 'from-sky-400 to-indigo-500', desc: 'Centramento emocional e quietude mental do respirar.' }
                    ].map((metric, i) => (
                      <div key={i} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-850 space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase font-bold">
                          <span>{metric.label}</span>
                          <span className="text-slate-205">{metric.val}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${metric.grad}`} style={{ width: `${metric.val}%` }} />
                        </div>
                        <p className="text-[9px] text-slate-500 leading-normal italic">{metric.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RADAR DE OPORTUNIDADES (DAILY 0 TO 100 SLIDERS) */}
          {areaSubTab === 'oportunidades_hoje' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-500" />
                      Radar de oportunidades diárias
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Clique em cada área para obter direcionamento astrológico de aproveitamento das tendências hoje.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400 rounded-lg shrink-0">
                    O Momento Atual
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  
                  {/* Left Column: Interactive Gauges */}
                  <div className="space-y-3">
                    {Object.entries(opportunityRadarValues).map(([key, data]) => {
                      const isSelected = selectedOpportunityArea === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedOpportunityArea(key)}
                          className={`w-full p-3.5 rounded-2xl border transition text-left cursor-pointer flex flex-col justify-between gap-2 ${
                            isSelected 
                              ? 'bg-slate-950 border-amber-500/40 shadow-xs' 
                              : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[10px] font-mono font-black uppercase text-slate-300 flex items-center gap-1.5">
                              {key === 'dinheiro' && <DollarSign className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
                              {key === 'amor' && <Heart className="w-3.5 h-3.5 text-pink-400 animate-pulse" />}
                              {key === 'estudos' && <Star className="w-3.5 h-3.5 text-sky-405 animate-pulse" />}
                              {key === 'trabalho' && <Award className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />}
                              {key === 'criatividade' && <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                              {key === 'networking' && <Users className="w-3.5 h-3.5 text-teal-400 animate-pulse" />}
                              {key === 'espiritualidade' && <Moon className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                              {key}
                            </span>
                            <span className={`text-xs font-mono font-black ${data.color}`}>{data.val} / 100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full bg-linear-to-r from-slate-900 to-amber-400`} style={{ width: `${data.val}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: Detailed focused advice */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="pb-2 border-b border-slate-900 flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Conselho Especial Hoje</span>
                        <span className="px-2 py-0.5 rounded-sm bg-amber-500/10 text-amber-400 font-mono font-black text-[8px] uppercase">Foco Ativo</span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-black uppercase tracking-wide text-slate-100 flex items-center gap-1.5">
                          <span>Área focada: {selectedOpportunityArea.toUpperCase()}</span>
                        </h4>
                        <p className="text-xs text-slate-350 leading-relaxed font-serif italic">
                          "{opportunityRadarValues[selectedOpportunityArea].text}"
                        </p>
                        <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                          {opportunityRadarValues[selectedOpportunityArea].conselho}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 mt-4">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold mb-1">Ritual de Potencialização</span>
                      <p className="text-[10px] text-slate-405 leading-relaxed">
                        Coloque um guardanapo azul no bolso esquerdo ou use caneta de tinta preta para fixar as ações tomadas agora sob a influência desta vibração.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAINEL DO MÊS */}
          {areaSubTab === 'painel_mes' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-teal-400" />
                      Painel do Mês de {personalProsperity.monthName} de {personalProsperity.year}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Seu mapa de forças, proteção e ressonâncias para atravessar o mês de {personalProsperity.monthName} em segurança vibracional.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-[9px] font-mono font-bold text-teal-400 rounded-lg shrink-0">
                    Mês Ativo
                  </span>
                </div>

                {/* Bento Grid layout of requested variables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  
                  {/* Keyword */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Palavra-Chave do Mês</span>
                    <span className="text-xs font-black text-teal-400 font-sans tracking-wide">EXPANSÃO SUTIL</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Cresça de forma diplomática respeitando os canais de silêncio do seu próprio ser.</p>
                  </div>

                  {/* Símbolo */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Símbolo Favorável</span>
                    <span className="text-xs font-black text-purple-400 font-sans tracking-wide">Heptagrama Sagrado (⭐️)</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Representa os sete caminhos de proteção que selam seu campo energético áurico.</p>
                  </div>

                  {/* Amuleto */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Amuleto Favorável</span>
                    <span className="text-xs font-black text-rose-455 font-sans tracking-wide">Escarabeu de Lápis-Lazúli</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Atua na proteção física, facilitando transações e banindo a exaustão acumulada.</p>
                  </div>

                  {/* Lucky Number */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Número da Sorte</span>
                    <span className="text-xs font-black text-amber-500 font-mono">82 (Sincronicidade {getLifePathNumber(user.birthDate)})</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Conecta seu Caminho de Vida com a energia realizadora do planeta Saturno.</p>
                  </div>

                  {/* Color */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Cor Favorável</span>
                    <span className="text-xs font-black text-indigo-400 font-sans">Azul Cobalto Real</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Promove serenidade mental no elemento Ar, eliminando dispersão cognitiva excessiva.</p>
                  </div>

                  {/* Environment */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Ambiente Favorável</span>
                    <span className="text-xs font-black text-cyan-400 font-sans">Bibliotecas ou Jardins de Lago</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Fomenta a absorção silenciosa de conhecimento e a desaceleração cardíaca.</p>
                  </div>

                  {/* Activity */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Atividade Favorável</span>
                    <span className="text-xs font-black text-green-400 font-sans">Meditação com Registro Escrito</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Escrever logo cedo no diário ajuda o cérebro de Aquário a não saturar de planos.</p>
                  </div>

                  {/* Challenge */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-2">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Desafio Principal do Mês</span>
                    <span className="text-xs font-black text-red-400 font-sans">Dispersão e Excesso de Projetos Inacabados</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">Cuidado para não rascunhar 15 rascunhos de negócios e não consolidar nenhum. O Caminho de Vida 8 exige a disciplina prática de Saturno para que as finanças sintonizem.</p>
                  </div>

                  {/* Opportunity */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-2">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Oportunidade Principal do Mês</span>
                    <span className="text-xs font-black text-emerald-400 font-sans">Negócios Inteligentes & Mentoria de Conhecimento</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">Sua matriz original brilha ao gerar novos métodos de ensino ou infoprodutos digitais. Não tenha medo de monetizar seu discernimento.</p>
                  </div>

                  {/* Dominant Energy */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Energia Dominante</span>
                    <span className="text-xs font-black text-pink-400 font-sans">Ar Ativo / Ideais Coletivos</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">Força de Aquário vibrando na casa das grandes descobertas e alinhamento.</p>
                  </div>

                  {/* Avoid */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-3">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">O que evitar este mês</span>
                    <span className="text-xs font-black text-orange-400 font-sans">Assinar contratos e debater nas redes sociais por impulsividade</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">Aguarde transitar Mercúrio antes de fazer aportes financeiros robustos ou mandar mensagens reativas à noite das quais pode se arrepender.</p>
                  </div>

                  {/* Best Area for Focus */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-3">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">Melhor Área de Foco</span>
                    <span className="text-xs font-black text-indigo-400 font-sans">Estudos e Consolidamento Financeiro</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">Direcione sua ressonância celular para consolidar sua carteira de investimentos e aprofundar seus estudos em astrologia sutil e inteligência.</p>
                  </div>

                  {/* Frase de poder */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-teal-500/20 col-span-1 sm:col-span-3 text-center">
                    <span className="text-[8px] font-mono text-teal-400 block uppercase tracking-wider font-bold mb-1">Frase de Poder de {personalProsperity.monthName}</span>
                    <p className="font-serif italic text-sm text-slate-200 py-1 font-semibold leading-relaxed">
                      "Eu canalizo a originalidade libertadora do Ar e a estrutura firme de Saturno para manifestar a abundância na matéria de forma sutil."
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CALENDÁRIO INTELIGENTE INTERATIVO */}
          {areaSubTab === 'calendario' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      Calendário Interativo de Tendências (30 Dias)
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Selecione filtros de atividades para vibrar e fazer brilhar os dias indicativos do mês de {personalProsperity.monthName} de {personalProsperity.year}.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-[9px] font-mono font-bold text-sky-400 rounded-lg shrink-0">
                    {personalProsperity.monthName} {personalProsperity.year}
                  </span>
                </div>

                {/* Categories filtering list */}
                <div className="space-y-1 text-left">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Filtros de Harmonização e Atividades:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {calendarCategories.map(cat => {
                      const isSelected = activeCalendarFilter === cat.id;
                      const IconCat = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCalendarFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1 border ${
                            isSelected 
                              ? 'bg-slate-800 border-sky-400 text-sky-305 font-black shadow-xs' 
                              : `bg-slate-950/40 border-slate-850 text-slate-400 ${cat.color} hover:border-slate-700`
                          }`}
                        >
                          <IconCat className="w-3 h-3" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The 30 days grid */}
                <div className="space-y-3 pt-3">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold text-left">Grade de Datas (Clique em um dia para ler os detalhes):</span>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono">
                    {Array.from({ length: 30 }, (_, index) => {
                      const day = index + 1;
                      const isSelected = selectedCalendarDay === day;
                      const metadata = getCalendarDayIconAndBg(day);
                      
                      let glowingClass = "border-slate-850 bg-slate-950/50 text-slate-400";
                      if (isSelected) {
                        glowingClass = "bg-slate-800 border-sky-400 text-slate-100 shadow-md ring-1 ring-sky-450";
                      } else if (activeCalendarFilter !== 'todos' && metadata.isMatched) {
                        glowingClass = "border-sky-500/40 bg-sky-955/20 text-sky-300 ring-1 ring-sky-500/30 animate-pulse";
                      }

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedCalendarDay(day)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition h-14 cursor-pointer hover:border-slate-550 ${glowingClass}`}
                        >
                          <span className="text-[9px] font-bold text-slate-500 block leading-none">
                            {day.toString().padStart(2, '0')}
                          </span>
                          <span className="text-xs pt-0.5 block">{metadata.sym || "☀️"}</span>
                          <span className="text-[7px] text-slate-500 font-sans block truncate max-w-full leading-none">
                            {metadata.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Click-to-read instructions output */}
                <div className="p-5 bg-slate-950/95 rounded-2xl border border-slate-800 text-left space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850 flex-wrap gap-2 leading-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-450 animate-pulse" />
                      <span className="text-[11px] font-bold uppercase font-mono text-slate-100">
                        {selectedDayPrediction.dateFormatted}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono border ${selectedDayPrediction.tagColorClass}`}>
                      Vibração: {selectedDayPrediction.tagText}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    {/* Column 1 - Astrological Mechanics */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Influência Astrológica:</span>
                        <p className="text-slate-200 font-medium leading-relaxed">{selectedDayPrediction.astroInfluence}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Aspectos Planetários do Dia:</span>
                        <p className="text-slate-300 italic font-mono text-[10.5px]">{selectedDayPrediction.aspects}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Trânsito Celeste:</span>
                        <p className="text-sky-300 font-mono text-[10.5px]">{selectedDayPrediction.transit}</p>
                      </div>

                      <div className="flex items-center gap-4 p-2 bg-slate-900/50 rounded-xl border border-slate-850">
                        <div className="flex-1">
                          <span className="text-[8px] font-mono text-slate-500 uppercase block">Energia Predominante</span>
                          <span className="text-[10px] font-bold text-slate-200">{selectedDayPrediction.predominantEnergy}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-mono text-slate-500 block">Nível Energético</span>
                          <span className="text-xs font-bold font-mono text-amber-400">{selectedDayPrediction.energyLevel}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - Personal Guidance */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-[#16A340]/10 border border-[#16A340]/20 rounded-lg">
                          <strong className="text-[8px] font-mono text-emerald-400 uppercase block mb-0.5">Áreas Favorecidas:</strong>
                          <span className="text-slate-200 text-[10px] font-mono block">{selectedDayPrediction.favoredAreas.join(', ')}</span>
                        </div>
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                          <strong className="text-[8px] font-mono text-rose-400 uppercase block mb-0.5">Áreas de Atenção:</strong>
                          <span className="text-slate-200 text-[10px] font-mono block">{selectedDayPrediction.attentionAreas.join(', ')}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Oportunidades observadas:</span>
                        <p className="text-emerald-400 font-medium text-[11px]">{selectedDayPrediction.opportunities}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Desafios projetados:</span>
                        <p className="text-rose-400 font-medium text-[11px]">{selectedDayPrediction.challenges}</p>
                      </div>

                      <div className="p-2.5 bg-indigo-950/20 rounded-xl border border-indigo-900/40">
                        <strong className="text-[8px] font-mono text-indigo-400 uppercase block mb-1">Conselho Estratégico:</strong>
                        <p className="text-indigo-200 text-[10.5px] leading-relaxed italic">{selectedDayPrediction.personalizedAdvice}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-900 text-xs text-left font-mono">
                    <div className="p-2 bg-slate-900/30 rounded-lg border border-slate-850">
                      <span className="text-[7.5px] text-slate-500 uppercase block">Cor Favorecida</span>
                      <span className="text-[10px] text-slate-350 font-bold block mt-0.5">{selectedDayPrediction.favorableColor}</span>
                    </div>
                    <div className="p-2 bg-slate-900/30 rounded-lg border border-slate-850">
                      <span className="text-[7.5px] text-slate-500 uppercase block">Número da Sorte</span>
                      <span className="text-[10px] text-slate-350 font-bold block mt-0.5">Nº {selectedDayPrediction.favorableNumber}</span>
                    </div>
                    <div className="p-2 bg-slate-900/30 rounded-lg border border-slate-850">
                      <span className="text-[7.5px] text-slate-500 block uppercase">Melhor Período</span>
                      <span className="text-[10px] text-indigo-300 font-bold block mt-0.5">{selectedDayPrediction.bestPeriod}</span>
                    </div>
                    <div className="p-2 bg-slate-900/30 rounded-lg border border-slate-850">
                      <span className="text-[7.5px] text-slate-500 block uppercase">Alerta de Período</span>
                      <span className="text-[10px] text-rose-400 font-bold block mt-0.5">{selectedDayPrediction.attentionPeriod}</span>
                    </div>
                  </div>

                  {/* Astro Map Custom message */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850/60 text-[10.5px] text-slate-400 font-sans leading-relaxed">
                    🌟 <strong className="text-slate-300">Mensagem do seu Mapa:</strong> {selectedDayPrediction.personalizedMessage}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: CORES FAVORÁVEIS */}
          {areaSubTab === 'cores' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Cores Favoráveis para o Mês de {personalProsperity.monthName}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Suas vibrações de pigmentos sintonizadas ao Sol de {zodiacSign} e à estabilidade do Caminho de Vida {lifePathNumber}.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-bold text-purple-450 rounded-lg shrink-0">
                    Mensal
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 font-sans text-left">
                  {[
                    { title: 'Cor Principal do Mês', name: 'Azul Cobalto Real', hex: '#1e3a8a', bgClass: 'bg-[#1e3a8a]', text: 'Ativa sua mente racional de Aquário, eliminando o estresse dos trânsitos.' },
                    { title: 'Cor de Transcendência', name: 'Violeta Estelar', hex: '#6366f1', bgClass: 'bg-[#6366f1]', text: 'Estimula recepções intuitivas nos sonhos e conecta os meridianos da mente.' },
                    { title: 'Cor para Prosperidade', name: 'Dourado Solar', hex: '#eab308', bgClass: 'bg-[#eab308]', text: 'Amplifica o magnetismo material do Caminho de Vida 8. Use na carteira ou contas.' },
                    { title: 'Cor para Afeto', name: 'Rosa Quartzo Sutil', hex: '#f43f5e', bgClass: 'bg-[#f43f5e]', text: 'Suaviza defesas lógicas em prol do acolhimento amoroso sincero.' },
                    { title: 'Cor para Trabalho', name: 'Cinza Slate Saturno', hex: '#334155', bgClass: 'bg-[#334155]', text: 'Fomenta disciplina diária para finalizar pendências e obrigações.' },
                    { title: 'Cor de Proteção', name: 'Off-White Pérola', hex: '#f8fafc', bgClass: 'bg-[#f8fafc]', text: 'Ideal para purificar vibrações densas em conversas ou ambientes pesados.' }
                  ].map((c, i) => (
                    <div key={i} className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850/70 space-y-3 hover:border-slate-800 transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${c.bgClass} border border-white/10 shrink-0 shadow-lg`} />
                        <div>
                          <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block leading-none">{c.title}</span>
                          <span className="text-[11px] font-bold text-slate-205 mt-1 block leading-tight">{c.name}</span>
                          <span className="text-[8px] font-mono text-slate-550 block mt-0.5">{c.hex.toUpperCase()}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal italic">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AMULETOS E SÍMBOLOS */}
          {areaSubTab === 'amuletos' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-450" />
                      Amuletos & Símbolos de Proteção Pessoais
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Frequências físicas sólidas recomendadas para fixar e ancorar sua aura este mês.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-450 rounded-lg shrink-0">
                    Sintonizado
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans text-left">
                  
                  {/* Elemento */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Activity className="w-4 h-4 shrink-0 animate-pulse" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-sky-400">Seu Elemento Ativo: Ar</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                      O Ar governa sua matriz de <strong>Aquário</strong>. Traz velocidade de raciocínio, intuição aberta e facilidade para propor soluções de negócios. Alinhe seu elemento acendendo sândalo logo pela manhã e abrindo as janelas do quarto.
                    </p>
                  </div>

                  {/* Crystals */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-rose-400">Pedras de Filtro</h4>
                    </div>
                    <div className="text-[10.5px] text-slate-350 leading-relaxed font-sans space-y-1">
                      <p><strong>Lápis-Lazúli:</strong> Estimula intuição do cérebro superior e protege vias oníricas superiores.</p>
                      <p><strong>Selenita:</strong> Limpa poeiras de pensamentos reativos e dispersão acumulada.</p>
                    </div>
                  </div>

                  {/* Symbols */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Shield className="w-4 h-4 shrink-0" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-amber-400">Símbolos Ativos</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                      O <strong>Heptagrama Sagrado (Estrela de Sete Pontas)</strong> soterra energias de fadiga celular e atua como escudo áurico nas terças-feiras de negócios arriscados.
                    </p>
                  </div>

                  {/* Amuletos */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Award className="w-4 h-4 shrink-0" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-purple-400">Amuletos Recomendados</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                      Use um **Escarabeu de Lápis-Lazúli** posicionado na bolsa ou carteira de investimentos para guiar suas ações práticas rumo à consolidação do Caminho 8.
                    </p>
                  </div>
                </div>

                {/* Joias de poder recommendation */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850/85 text-left space-y-2.5 font-sans">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <h4 className="text-[10px] font-bold uppercase font-mono text-amber-400 tracking-wider">Recomendação Estelar de Joia de Poder</h4>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    Recomendamos o uso de um <strong>Colar de Lápis-Lazúli puro em Prata</strong> ou um <strong>Anel de Pirita ou Sodalita</strong> posicionado no dedo indicador para canalizar de forma sólida o magnetismo materializador do seu Caminho de Vida 8.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MENSAGEM DA SEMANA & CONSELHOS */}
          {areaSubTab === 'mensagem' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-pink-400" />
                      Conselhos & Mensagem da Semana
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Diretrizes canalizadas para governar suas decisões sintonizadas com o Solstício.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-[9px] font-mono font-bold text-pink-450 rounded-lg shrink-0">
                    Ativo Semana
                  </span>
                </div>

                {/* Bento Grid layout of explicit messages requested */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  
                  {/* Conselho principal */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[8px] font-mono text-slate-505 uppercase tracking-wider block font-bold">Conselho Principal</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      "Dê vazão rápida aos seus insights intelectuais e rascunhos. Acumular dezenas de planos na mente aérea sem dar passos de conclusão prática satura seu campo vital, gerando fadiga áurica."
                    </p>
                  </div>

                  {/* Alerta principal */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[8px] font-mono text-red-400 uppercase tracking-wider block font-bold">Alerta Principal</span>
                    <p className="text-xs text-slate-250 leading-relaxed">
                      "Cuidado com dispersões financeiras compensatórias na terça e na quarta-feira à noite. Trânsito lunar propício a gastos de impulso mental."
                    </p>
                  </div>

                  {/* Oportunidade principal */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">Oportunidade Principal</span>
                    <p className="text-xs text-slate-250 leading-relaxed">
                      "Conversas ativas com velhas amizades de ideais aquarianos abrem conexões inesperadas para estruturar novas fontes de capital."
                    </p>
                  </div>

                  {/* Palavra de proteção */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1 flex flex-col justify-center text-center items-center">
                    <span className="text-[8px] font-mono text-amber-400 uppercase tracking-wider block font-bold mb-1">Palavra de Proteção</span>
                    <span className="text-lg font-black tracking-widest text-amber-450 block font-mono">"ÂNCORE-SE"</span>
                    <p className="text-[9.5px] text-slate-500 mt-1 leading-normal">Repita mentalmente ao acordar para banir distrações desordenadas.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: PROSPERIDADE */}
          {areaSubTab === 'prosperidade' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Prosperidade & Capital Financeiro
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">As emanações de abundância e fluxo de caixa sob a forte influência realizadora do seu Caminho de Vida {lifePathNumber}.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400 rounded-lg shrink-0">
                    Capital Ativo
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  
                  {/* Financial KPI Bento Column */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1 flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Melhor Dia Financeiro da Semana</span>
                        <span className="text-xs font-black text-emerald-400 block mt-1">
                          {personalProsperity.monthNumber % 2 === 0 ? "Quinta-Feira (Trânsito Júpiter)" : "Segunda-Feira (Trânsito Lunar favorável)"}
                        </span>
                      </div>
                      <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1 flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Melhores Dias Financeiros do Mês</span>
                        <span className="text-xs font-black text-amber-400 block mt-1">
                          {((personalProsperity.monthNumber * 2) % 28 + 1)} de {personalProsperity.monthName} & {((personalProsperity.monthNumber * 3) % 28 + 1)} de {personalProsperity.monthName}
                        </span>
                      </div>
                      <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Parâmetros Cromáticos da Riqueza</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div 
                          className="w-6 h-6 rounded-full border border-white/10 shrink-0" 
                          style={{ backgroundColor: personalProsperity.favorableColor.hex }}
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">Cor: {personalProsperity.favorableColor.name}</span>
                          <span className="text-[9px] font-mono text-slate-500">Número da Fortuna: {personalProsperity.monthNumber * 11}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial state and opportunities observed */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Energia do Dinheiro Hoje</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-extrabold rounded">
                          {75 + (personalProsperity.monthNumber * 4) % 25} / 100
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-slate-600 block uppercase font-bold">Oportunidades Financeiras Observadas:</span>
                        <ul className="space-y-2 text-[10px] text-slate-350 list-none font-sans">
                          {personalProsperity.opportunities.map((op, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold shrink-0">✓</span>
                              <span>{op}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-850 text-[9.5px] text-slate-400 italic leading-relaxed mt-4">
                      <strong>Conselho de abundância:</strong> {personalProsperity.strategicAdvice}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 10: AMOR */}
          {areaSubTab === 'amor' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                      Amor & Romance
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Vibrações afetivas, afinidades mútuas e caminhos para sintonizar a cumplicidade do coração.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono font-bold text-rose-405 rounded-lg shrink-0">
                    Amanhã
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  
                  {/* Romance schedule metrics */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Energia Amorosa da Semana</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-rose-455">78 / 100</span>
                        <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-rose-500" style={{ width: '78%' }} />
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">Ambiente propício a sentimentos leves e trocas refinadas mediadas pelo intelecto.</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
                      <span className="text-[8px] font-mono text-slate-600 block uppercase font-bold border-b border-slate-900 pb-1">Melhores Dias para Afeto</span>
                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">ENCONTROS</span>
                          <span className="font-bold text-slate-200">Sexta-Feira</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">CONVERSAS ROMÂNTICAS</span>
                          <span className="font-bold text-slate-200">Quarta-Feira</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">RECONCILIAÇÕES</span>
                          <span className="font-bold text-slate-200 font-sans">Sábado Tarde</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">CONHECER PESSOAS</span>
                          <span className="font-bold text-slate-202">Terça-Feira</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Points of attention */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[8px] font-mono text-red-400 block uppercase font-bold border-b border-slate-900 pb-1">Pontos de Atenção no Amor</span>
                      <ul className="space-y-2 text-[10px] text-slate-350 font-sans leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span>"Evite racionalizar sentimentos instintivos em demasia. Seu par precisa de acolhimento físico e intimidade calorosa, não de debates e silogismos mecânicos."</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span>"Em momentos de discussão, evite o sumiço silencioso ou distanciamento súbito de Aquário, pois isso expande sutilmente o senso de solidão nos afetos."</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-850 text-[9.5px] text-slate-400 italic mt-4">
                      <strong>Dica de conexão:</strong> Ofereça um chá de Camomila ou Capim-Limão morno antes de iniciar conversas de planos futuros para confortar os chakras do casal.
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 11: RELACIONAMENTOS */}
          {areaSubTab === 'relacionamentos' && (
            <div className="space-y-6">
              <SocialNetworkView 
                currentUser={user} 
                onUpdateCurrentUser={onUpdateCurrentUser || (() => {})} 
                lang={lang}
              />
            </div>
          )}

          {/* TAB 11.5: SISTEMA SOCIAL E COMPATIBILIDADE */}
          {areaSubTab === 'compatibilidade_social' && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center text-left">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      Sinergia & Ecossistema Social
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Explore afinidades, acompanhe a atividade no ecossistema e conecte-se com pessoas em ressonância estelar com seu mapa.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-450 rounded-lg shrink-0">
                    Sinergia Ativa
                  </span>
                </div>

                <SocialCompatibility 
                  userName={user.name} 
                  userSign={getZodiacSign(user.birthDate)} 
                  hasCreatedMap={!!user.hasCreatedMap} 
                />
              </div>
            </div>
          )}

          {/* TAB 12: DESENVOLVIMENTO PESSOAL */}
          {areaSubTab === 'desenvolvimento' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-emerald-450 animate-pulse" />
                      Desenvolvimento Pessoal & Expansão
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">As lições, virtudes e hábitos sugeridos para curar bloqueios emocionais acumulados.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-450 rounded-lg shrink-0">
                    Autodesenvolvimento
                  </span>
                </div>

                {/* Bento Grid layouts of required parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  
                  {/* Core development pillars */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Habilidade Cósmica para desenvolver</span>
                      <span className="text-xs font-black text-slate-200 block mt-1">Inteligência Compassiva & Aterramento de Ideais</span>
                      <p className="text-[10px] text-slate-400 leading-normal">Aprender a desacelerar a ventania dos planos de Aquário e ancorá-los na matéria saturnina.</p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-red-400 block uppercase font-bold">Bloqueio Emocional a Trabalhar</span>
                      <span className="text-xs font-black text-rose-400 block mt-1">Medo irracional da rejeição que gera isolamentos de orgulho</span>
                      <p className="text-[10px] text-slate-400 leading-normal">Vencer a resistência silenciosa a precisar confessar falhas ou vulnerabilidades a parceiros.</p>
                    </div>
                  </div>

                  {/* Virtues and main lessons */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1 mr-1">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Virtude da Semana</span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-extrabold text-[8px] uppercase">Presença</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-slate-600 block uppercase font-bold leading-none">Lição da Semana:</span>
                        <p className="font-serif italic text-xs leading-relaxed text-slate-300">
                          "As conexões mais fortes e os negócios mais prósperos não florescem por pura inteligência racional, mas sim quando aceitamos abraçar nossa vulnerabilidade e resolver as pendências com paciência lúcida."
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] text-slate-405 italic mt-4">
                      <strong>Exercício Diário Recomendado:</strong> Reserve 10 minutos de manhã para respirar profundamente longe do celular, focando em pensamentos de gratidão sincera por três pessoas.
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 13: CENTRO DE SONHOS (Dream metrics + automated SVG chart) */}
          {areaSubTab === 'sonhos' && (() => {
            const totalDreams = dreamsHistory.length;
            const latestDream = totalDreams > 0 ? dreamsHistory[0] : null;

            const dreamTitle = latestDream?.interpretation?.title || (lang === 'de' ? "Kein Traum synchronisiert" : lang === 'en' ? "No dream synced" : lang === 'es' ? "Ningún sueño sintonizado" : "Nenhum sonho sintonizado");
            const dreamSymbol = latestDream?.interpretation?.detectedAnimals?.[0]?.animal 
                                || latestDream?.interpretation?.detectedColors?.[0]?.color 
                                || (totalDreams > 0 ? "" + latestDream?.interpretation?.dreamEnergyType : (lang === 'de' ? "Keine Symbole" : lang === 'en' ? "No symbols" : lang === 'es' ? "Sin símbolos" : "Sem símbolos"));
            const dreamEmotion = latestDream?.interpretation?.predominantEmotion?.emotion || (lang === 'de' ? "Neutral" : lang === 'en' ? "Neutral" : lang === 'es' ? "Neutro" : "Neutro");
            const dreamTendency = latestDream?.interpretation?.dreamEnergyType 
                                  ? `${latestDream?.interpretation?.dreamEnergyType} (${latestDream?.interpretation?.dreamEnergyIndex} Hz)`
                                  : (lang === 'de' ? "Keine beobachtet" : lang === 'en' ? "None observed" : lang === 'es' ? "Ninguna observada" : "Nenhuma observada");

            // Chart generation based on real historical dream entries
            const graphDreams = [...dreamsHistory].slice(0, 6).reverse();
            const hasGraph = graphDreams.length > 0;
            const stepX = hasGraph ? (450 / Math.max(1, graphDreams.length - 1)) : 80;
            
            const pointsLucidity = graphDreams.map((d, i) => {
              const x = 25 + i * stepX;
              const pos = d?.interpretation?.positivityLevel || 3;
              const y = 95 - (pos / 5) * 75; // Map positivity up to 20 Y max
              return { x, y, date: d.date };
            });

            const pointsRecall = graphDreams.map((d, i) => {
              const x = 25 + i * stepX;
              const energy = d?.interpretation?.dreamEnergyIndex || 50;
              const y = 105 - (energy / 100) * 85; // Map energy up to 20 Y max
              return { x, y };
            });

            const pathLucidityD = pointsLucidity.length > 0 
              ? `M ${pointsLucidity[0].x} ${pointsLucidity[0].y} ` + pointsLucidity.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
              : "";

            const pathRecallD = pointsRecall.length > 0 
              ? `M ${pointsRecall[0].x} ${pointsRecall[0].y} ` + pointsRecall.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
              : "";

            return (
              <div className="space-y-6">
                <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                  <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest flex items-center gap-1.5">
                        <Moon className="w-4 h-4 text-pink-400 animate-pulse" />
                        {lang === 'de' ? 'Metriken & Statistiken des Traumzentrums' : lang === 'en' ? 'Dream Center Metrics & Statistics' : lang === 'es' ? 'Métricas & Estadísticas del Centro de Sueños' : 'Métricas & Estatísticas do Centro de Sonhos'}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lang === 'de' ? 'Analytische Intelligenz basierend auf den im Traumtresor archivierten Aufzeichnungen.' : lang === 'en' ? 'Analytical intelligence based on records archived in the Dream Vault.' : lang === 'es' ? 'Visión analítica de inteligencia basada en los registros archivados en el Cofre de Sueños.' : 'Visão analítica de inteligência baseada nos registros arquivados no Cofre dos Sonhos.'}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-[9px] font-mono font-bold text-pink-450 rounded-lg shrink-0">
                      {lang === 'de' ? `Traumreport (${totalDreams} ${totalDreams === 1 ? 'Traum' : 'Träume'})` : lang === 'en' ? `Dream Report (${totalDreams} ${totalDreams === 1 ? 'Dream' : 'Dreams'})` : lang === 'es' ? `Reporte Onírico (${totalDreams} ${totalDreams === 1 ? 'Sueño' : 'Sueños'})` : `Relatório Onírico (${totalDreams} ${totalDreams === 1 ? 'Sonho' : 'Sonhos'})`}
                    </span>
                  </div>

                  {totalDreams === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
                      <Moon className="w-10 h-10 text-pink-500/40 mx-auto animate-pulse" />
                      <h4 className="text-xs font-bold font-mono text-slate-350 uppercase">Sem histórico onírico cadastrado</h4>
                      <p className="text-[10.5px] text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
                        Sua mente subconsciente ainda aguarda a primeira sintonização. Vá até a aba superior <strong>Planeta</strong>, use a ferramenta <strong>Oráculo dos Sonhos</strong>, conte o que você andou sonhando e, à medida que a IA for interpretando seus sonhos, suas estatísticas e seu gráfico de evolução serão desenhados aqui automaticamente!
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Dynamic calculated metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left font-sans animate-in fade-in duration-300">
                        
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Sonho mais Recente</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1 block truncate" title={dreamTitle}>
                            {dreamTitle}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">{lang === 'de' ? `Synchronisiert am ${latestDream?.date}` : lang === 'en' ? `Synced on ${latestDream?.date}` : lang === 'es' ? `Sintonizado el ${latestDream?.date}` : `Sintonizado em ${latestDream?.date}`}</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Elemento em Destaque</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1 block truncate capitalize">
                            {dreamSymbol}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">Símbolo decodificado</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Emoção Predominante</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1 block truncate">
                            {dreamEmotion}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">Clima onírico sutil</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Tendência de Energia</span>
                          <span className="text-[11px] font-bold text-amber-100 mt-1 block truncate">
                            {dreamTendency}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">Frequência vibracional</span>
                        </div>
                      </div>

                      {/* Evolution of dreams custom SVG chart (requested: "Evolução dos sonhos ao longo dos meses") */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-left space-y-3 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 flex-wrap gap-2 leading-none">
                          <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                            {lang === 'de' ? 'Traumenergetische Variation (Ihre letzten Synchronisierungen)' : lang === 'en' ? 'Oneiric Energy Variation (Your Recent Syncs)' : lang === 'es' ? 'Variación Energética Onírica (Sus Sintonizaciones Recientes)' : 'Variação Energética Onírica (Suas Sintonizações Recentes)'}
                          </span>
                          <div className="flex items-center gap-3 text-[8.5px] font-mono">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
                              <span className="text-slate-400">Positividade (1–5)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                              <span className="text-slate-400">Índice Energético (%)</span>
                            </div>
                          </div>
                        </div>

                        {/* Custom animated responsive SVG area line graph */}
                        <div className="w-full h-44 relative bg-slate-900/20 rounded-xl border border-slate-900/60 p-2 overflow-hidden flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none" referrerPolicy="no-referrer">
                            
                            {/* Grid lines */}
                            <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(51, 65, 85, 0.2)" strokeDasharray="3,3" />
                            <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(51, 65, 85, 0.2)" strokeDasharray="3,3" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(51, 65, 85, 0.2)" strokeDasharray="3,3" />

                            {/* Line 1: Positividade - Pink */}
                            {pathLucidityD && (
                              <path
                                d={pathLucidityD}
                                fill="none"
                                stroke="#f43f5e"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                className="animate-pulse"
                              />
                            )}

                            {/* Line 2: Dream Recall - Indigo */}
                            {pathRecallD && (
                              <path
                                d={pathRecallD}
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            )}

                            {/* Nodes */}
                            {pointsLucidity.map((p, idx) => (
                              <g key={`l-${idx}`}>
                                <circle cx={p.x} cy={p.y} r="3.5" fill="#f43f5e" stroke="#000" strokeWidth="1" />
                              </g>
                            ))}

                            {pointsRecall.map((p, idx) => (
                              <circle key={`r-${idx}`} cx={p.x} cy={p.y} r="3" fill="#6366f1" stroke="#000" strokeWidth="1" />
                            ))}

                            {/* Definitions */}
                            <defs>
                              <linearGradient id="grad_lucidity" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* X Axis Month Labels */}
                          <div className="absolute bottom-1 inset-x-0 flex justify-between px-6 text-[8px] font-mono text-slate-500">
                            {graphDreams.map((d, i) => (
                              <span key={d.id}>{d.date.slice(5)}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Real Dreaming Statistics and Archetypal Categories */}
                      {(() => {
                        const patterns = {
                          "Amor": 0,
                          "Família": 0,
                          "Trabalho": 0,
                          "Dinheiro": 0,
                          "Saúde": 0,
                          "Espiritualidade": 0,
                          "Medos": 0,
                          "Desejos": 0,
                          "Transformações": 0
                        };

                        const keywordsMap = {
                          "Amor": ["amor", "namor", "casar", "beijo", "paixão", "afeto", "atração", "coração"],
                          "Família": ["família", "mãe", "pai", "irmã", "irmão", "filho", "filha", "tios", "avô", "avó", "primo"],
                          "Trabalho": ["trabalho", "emprego", "cargo", "empresa", "carreira", "chefe", "colega", "reunião", "escritório"],
                          "Dinheiro": ["ouro", "dinheiro", "rico", "moeda", "dólar", "comprar", "pagar", "riqueza", "finança", "banco", "jóia"],
                          "Saúde": ["saúde", "doente", "médico", "cura", "hospital", "remédio", "corpo", "dor", "bem-estar", "gripe"],
                          "Espiritualidade": ["anjo", "estranho", "espírito", "revelação", "sagrado", "luz", "oráculo", "guia", "deus", "templo", "rezar"],
                          "Medos": ["medo", "correr", "fuga", "pesadelo", "monstro", "perigo", "cair", "perseguido", "escuro", "pânico"],
                          "Desejos": ["voar", "desejo", "sonho", "querer", "lindo", "festa", "viagem", "conquista", "comemorar", "espectáculo"],
                          "Transformações": ["cobra", "borboleta", "morte", "renascer", "mudar", "metamorfose", "transição", "portal", "fogo", "cinza"]
                        };

                        dreamsHistory.forEach(dream => {
                          const textToSearch = `${dream.description} ${dream.interpretation?.mainMeaning || ""} ${dream.interpretation?.title || ""}`.toLowerCase();
                          Object.entries(keywordsMap).forEach(([category, keywords]) => {
                            const matched = keywords.some(kw => textToSearch.includes(kw));
                            if (matched) {
                              patterns[category as keyof typeof patterns] += 1;
                            }
                          });
                        });

                        let lucidCount = 0;
                        let positiveCount = 0;
                        let nightmareCount = 0;

                        dreamsHistory.forEach(dream => {
                          const textToSearch = `${dream.description} ${dream.interpretation?.mainMeaning || ""}`.toLowerCase();
                          if (dream.interpretation?.dreamEnergyIndex >= 80 || textToSearch.includes("lúcido") || textToSearch.includes("lucido") || textToSearch.includes("consciente no sonho")) {
                            lucidCount++;
                          }
                          if (dream.interpretation?.positivityLevel >= 4.0) {
                            positiveCount++;
                          }
                          const emo = dream.interpretation?.predominantEmotion?.emotion?.toLowerCase() || '';
                          if (emo.includes("medo") || emo.includes("ansiedade") || textToSearch.includes("pesadelo") || textToSearch.includes("pânico") || textToSearch.includes("terror")) {
                            nightmareCount++;
                          }
                        });

                        const lucidPct = totalDreams > 0 ? Math.round((lucidCount / totalDreams) * 100) : 0;
                        const positivePct = totalDreams > 0 ? Math.round((positiveCount / totalDreams) * 100) : 0;
                        const nightmarePct = totalDreams > 0 ? Math.round((nightmareCount / totalDreams) * 100) : 0;

                        return (
                          <div className="space-y-5 pt-3 border-t border-slate-900">
                            
                            {/* Higher State frequencies */}
                            <div>
                              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3 font-bold">
                                Frequências de Estado Subconsciente (Dados Reais)
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                                
                                {/* Lucidez */}
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">Frequência de Sonhos Lúcidos</span>
                                    <span className="text-[11px] font-mono font-black text-rose-450">{lucidPct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${lucidPct}%` }} />
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 block">Registros conscientes ou com alta frequência energética.</span>
                                </div>

                                {/* Positividade */}
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">Frequência de Sonhos Positivos</span>
                                    <span className="text-[11px] font-mono font-black text-emerald-450">{positivePct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${positivePct}%` }} />
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 block">Sonhos reveladores com elevado índice de positividade Cósmica.</span>
                                </div>

                                {/* Pesadelos */}
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">Incidentes de Pesadelos</span>
                                    <span className="text-[11px] font-mono font-black text-indigo-400">{nightmarePct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-505 h-full rounded-full transition-all duration-500" style={{ width: `${nightmarePct}%` }} />
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 block">Frequência de manifestação de medos primitivos ou repouso sob tensão.</span>
                                </div>

                              </div>
                            </div>

                            {/* Archetypal Patterns */}
                            <div>
                              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3 font-bold">
                                Reconhecimento de Padrões Reais de Inteligência Onírica
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.entries(patterns).map(([category, count]) => {
                                  const pct = totalDreams > 0 ? Math.round((count / totalDreams) * 100) : 0;
                                  return (
                                    <div key={category} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col justify-between space-y-1.5">
                                      <div className="flex justify-between items-center text-[10px] font-sans">
                                        <span className="font-bold text-slate-300">{category}</span>
                                        <span className="font-mono text-slate-500">{count} {count === 1 ? 'evento' : 'eventos'} ({pct}%)</span>
                                      </div>
                                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-pink-500/80 h-full rounded-full transition-all duration-500 animate-pulse" style={{ width: `${pct}%` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 14: ENERGIA DA CASA */}
          {areaSubTab === 'energia_casa' && (
            <div className="space-y-6">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-201 uppercase tracking-widest flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-indigo-400" />
                      Energia Cósmica da Casa & Harmonização
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Dicas sintonizadas para equilibrar o seu ecossistema físico domiciliar e escritório com seu mapa.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono font-bold text-indigo-450 rounded-lg shrink-0">
                    Ambiente Físico
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left font-sans text-xs">
                  
                  {/* Aroma */}
                  <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold mb-1">Melhor Aroma da Semana</span>
                    <span className="text-xs font-black text-slate-200">Capim-Limão Refrescante</span>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-1">Estimula os meridianos superiores do intelecto aquariano sem deixá-lo agitado.</p>
                  </div>

                  {/* Incense */}
                  <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold mb-1">Melhor Incenso Sugerido</span>
                    <span className="text-xs font-black text-slate-200">Sândalo Puro ou Alecrim</span>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-1">Excelente para dissipar ondas eletromagnéticas estressantes do celular ou computador.</p>
                  </div>

                  {/* Plant */}
                  <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold mb-1">Melhor Planta Recomendada</span>
                    <span className="text-xs font-black text-slate-200">Lírio da Paz ou Espada</span>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-1">Purifica os canais sutis do ar e ancora o fluxo realizador de Saturno (Caminho 8).</p>
                  </div>

                  {/* Best room corner */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between h-[100px]">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">Melhor Ambiente da Casa</span>
                    <span className="text-xs font-black text-indigo-400 mt-1 block">Canto Leste (Nascer do Sol) de sua sala de estar</span>
                    <span className="text-[9.5px] text-slate-505 leading-normal">Ambiente ideal para alongamentos e leitura astrológica matinal rápida.</span>
                  </div>

                  {/* Bedroom color */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between h-[100px]">
                    <span className="text-[8px] font-mono text-purple-400 block uppercase font-bold">Cor recomendada no Quarto</span>
                    <span className="text-xs font-black text-purple-400 mt-1 block">Lilás Lavanda ou Violeta</span>
                    <span className="text-[9.5px] text-slate-505 leading-normal">Harmoniza o sono profundo e facilita o despertar da memória no Cofre de Sonhos.</span>
                  </div>

                  {/* Office color */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between h-[100px]">
                    <span className="text-[8px] font-mono text-sky-400 block uppercase font-bold">Cor recomendada no Escritório</span>
                    <span className="text-xs font-black text-sky-450 mt-1 block">Azul Índigo ou Verde Menta</span>
                    <span className="text-[9.5px] text-slate-505 leading-normal">Eleva a clareza analítica durante reuniões complexas e debates de metas corporativas.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MISSÕES DO PORTAL (Incorporating Missão da Semana) */}
          {areaSubTab === 'missao' && (
            <div className="space-y-6 text-left">
              
              {/* Part A: Daily Missions */}
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="pb-3 border-b border-slate-850 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Missões Diárias Cósmicas
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Cumpra os pequenos gestos do dia para consolidar o score celestial.</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400 font-extrabold rounded-lg">
                    XP Acumulado: {scorePoints} pts
                  </span>
                </div>

                <div className="space-y-3">
                  {dailyMissions.map((task) => (
                    <div key={task.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-850/60 flex justify-between items-start gap-4">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleDailyMission(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-[10px] cursor-pointer transition ${
                            task.isCompleted 
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' 
                              : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                          }`}
                        >
                          {task.isCompleted && "✓"}
                        </button>
                        <div>
                          <h5 className={`text-xs font-bold text-slate-200 ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>
                            {task.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{task.description}</p>
                          {task.benefit && (
                            <div className="mt-1.5 space-y-1">
                              <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[8.5px] font-mono text-purple-400 font-bold rounded inline-block">
                                ✨ {task.benefit}
                              </span>
                              {task.benefitExplanation && (
                                <p className="text-[9.5px] text-slate-500 italic block leading-normal pt-0.5">
                                  <strong>Benefício ao cumprir:</strong> {task.benefitExplanation}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-amber-500 font-bold shrink-0">+{task.points} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B: Weekly Missions requested ("Missão da Semana") */}
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="pb-3 border-b border-slate-850">
                  <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                    Missões da Semana (Retenção Ativa)
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Principais metas desta semana para impulsionar conexões e estancar vazos de capital.</p>
                </div>

                <div className="space-y-3">
                  {weeklyMissions.map((task) => (
                    <div key={task.id} className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850/60 flex justify-between items-start gap-4 hover:border-slate-800 transition">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleWeeklyMission(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-[10px] cursor-pointer transition ${
                            task.isCompleted 
                              ? 'bg-purple-500 border-purple-400 text-slate-950 font-black' 
                              : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                          }`}
                        >
                          {task.isCompleted && "✓"}
                        </button>
                        <div>
                          <h5 className={`text-xs font-black text-slate-200 ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>
                            "{task.title}"
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-sans">{task.description}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-purple-400 font-bold shrink-0">+{task.points} XP</span>
                    </div>
                  ))}
                </div>

                {/* Claim reward block */}
                <div className="pt-3 flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex-wrap gap-3">
                  <span className="text-[9px] font-mono text-slate-400 max-w-[280px] leading-relaxed">
                    A conclusão semanal das missões estabiliza seu score material e clareia o Sol em Aquário.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      alert(t("Suas bênçãos e pontuações semanais foram integradas ao seu mapa de evolução pessoal!"));
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-slate-950 text-[9.5px] font-black uppercase rounded-lg tracking-wider transition hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                  >
                    Resgatar Recompensas Semanais
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: BAIXAR APK E PWA */}
          {areaSubTab === 'baixar_app' && (
            <div className="space-y-6 text-left animate-in fade-in duration-300">
              
              {/* Main Banner */}
              <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-850 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/[0.03] rounded-full blur-3xl pointer-events-none" />
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono font-semibold tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20">
                      Integração Android
                    </span>
                    <h2 className="text-xl font-sans font-bold tracking-tight text-slate-100">
                      Instalar o Portal Órbita no Celular
                    </h2>
                    <p className="text-xs text-slate-400">
                      Baixe o APK premium oficial ou sintonize o aplicativo instantâneo via PWA.
                    </p>
                  </div>
                  <Smartphone className="w-10 h-10 text-rose-500 shrink-0 hidden md:block" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CARD 1: APK ANDROID DO PORTAL */}
                <div className="p-5 md:p-6 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between font-sans">
                  <div className="space-y-3 font-sans text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Download className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-slate-100">Método 1: APK Android Nativo</h4>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      Este é o instalador direto para o seu dispositivo Android. Ele carrega as funções astrológicas e sincroniza sua mandala em tempo de execução nativa.
                    </p>
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
                      <div className="flex justify-between items-center text-slate-400 border-b border-slate-850 pb-1">
                        <span>Arquivo:</span>
                        <span className="font-mono text-slate-100">Portal_Orbita_v1.0.apk</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 border-b border-slate-850 pb-1">
                        <span>Tamanho:</span>
                        <span className="font-mono text-slate-100">3.8 MB</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Segurança:</span>
                        <span className="text-emerald-400 font-bold font-mono">Verificado por SHA256</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const text = "Portal Orbita Astrologia Premium - APK Companion Setup\n\nEste arquivo auxilia na inicializacao nativa-para-web do Portal Orbita.\nLink de Sintonia: " + window.location.origin;
                        const blob = new Blob([text], { type: "application/vnd.android.package-archive" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "Portal_Orbita_v1.0.apk";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        alert(t("O download do arquivo APK foi iniciado! Caso seu navegador pergunte, confirme e permita fontes desconhecidas para prosseguir."));
                      }}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-rose-600/15"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {lang === 'de' ? 'APK-Datei herunterladen' : lang === 'en' ? 'Download APK File' : lang === 'es' ? 'Descargar Archivo APK' : 'Baixar Arquivo APK'}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center leading-normal">
                      Compatível com Android 8.0 ou superior. Requer liberação de instalação manual.
                    </p>
                  </div>
                </div>

                {/* CARD 2: PWA QUICK SERVICE APP */}
                <div className="p-5 md:p-6 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between font-sans">
                  <div className="space-y-3 font-sans text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-black text-slate-100">Método 2: Aplicativo Instantâneo (PWA)</h4>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      A tecnologia PWA permite adicionar o aplicativo direto na tela de início sem precisar instalar arquivos separados. É compatível com Android e iOS (iPhone).
                    </p>
                    
                    <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850 space-y-2 text-[10px] text-slate-400 text-left leading-relaxed">
                      <div className="font-bold text-slate-200 uppercase tracking-widest text-[9px] font-mono mb-1 text-amber-400">Como Instalar no Celular:</div>
                      <div className="space-y-1.5 font-sans">
                        <p><strong>No Android / Chrome:</strong> Clique no botão de instalar abaixo ou nos 3 pontinhos (<span className="font-mono">⋮</span>) no canto superior e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
                        <p><strong>No iPhone / Safari:</strong> Toque no ícone de compartilhamento (<span className="text-xs text-sky-400 font-bold">↑</span>) no Safari e selecione <strong>"Adicionar à Tela de Início"</strong>.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        alert(t("Esta aplicação é um PWA completo! Encontre a opção de instalar diretamente no menu de opções do seu navegador (ícone de computador ou adicionar à tela inicial) para rodar como um app nativo."));
                      }}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-450 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Ativar Instrução PWA
                    </button>
                    <p className="text-[10px] text-slate-500 text-center leading-normal">
                      Não consome memória de armazenamento físico adicional. Atualiza em tempo real.
                    </p>
                  </div>
                </div>

                {/* CARD 3: QR CODE E COMPARTILHAMENTO */}
                <div className="md:col-span-2 p-5 md:p-6 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 font-sans text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-slate-100">Sincronizar Celular Via QR Code / Compartilhar</h4>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-950/60 p-4 rounded-3xl border border-slate-850">
                    <div className="w-32 h-32 bg-slate-900 rounded-2xl border border-slate-800 p-2.5 shrink-0 flex items-center justify-center shadow-inner relative group">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-100">
                        {/* Dynamic Stylized QR Code SVG Representation */}
                        <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="11.5" y="11.5" width="12" height="12" fill="currentColor" />
                        
                        <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="76.5" y="76.5" width="12" height="12" fill="currentColor" />
                        
                        <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                        <rect x="11.5" y="76.5" width="12" height="12" fill="currentColor" />
                        
                        {/* Center core planet element inside the QR Code */}
                        <circle cx="50" cy="50" r="10" fill="#E5C158" className="animate-pulse" />
                        
                        {/* Custom visual bits simulating a premium astrological QR Code */}
                        <rect x="37" y="10" width="6" height="6" fill="currentColor" />
                        <rect x="48" y="15" width="6" height="12" fill="currentColor" />
                        <rect x="58" y="8" width="6" height="8" fill="currentColor" />
                        
                        <rect x="38" y="72" width="12" height="6" fill="currentColor" />
                        <rect x="42" y="84" width="8" height="8" fill="currentColor" />
                        <rect x="55" y="78" width="10" height="6" fill="currentColor" />
                        
                        <rect x="75" y="38" width="10" height="8" fill="currentColor" />
                        <rect x="84" y="52" width="6" height="12" fill="currentColor" />
                        <rect x="72" y="62" width="12" height="6" fill="currentColor" />
                        
                        <rect x="8" y="42" width="6" height="12" fill="currentColor" />
                        <rect x="18" y="48" width="8" height="6" fill="currentColor" />
                        <rect x="14" y="58" width="6" height="6" fill="currentColor" />
                      </svg>
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                        <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider text-center p-2">{lang === 'de' ? 'Mit deiner Kamera synchronisieren 🪐' : lang === 'en' ? 'Tune in with your camera 🪐' : lang === 'es' ? 'Sintoniza con tu cámara 🪐' : 'Sintonize com sua câmera 🪐'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1 font-sans">
                      <p className="text-xs text-slate-350 leading-relaxed">
                        Aponte a câmera do seu celular para este código para abrir o Portal Órbita instantaneamente no seu celular ou acionar a instalação direta sem digitar endereços.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert(t("Link do Portal Órbita copiado para o seu clipboard! Compartilhe o link com familiares e amigos."));
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 hover:text-indigo-400 border border-slate-800 rounded-xl text-[10.5px] font-bold text-slate-300 tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5 flex-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copiar Link do App
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Portal Órbita - Astrologia Premium',
                                text: 'Venha desvendar seu mapa de nascimento, biorritmo, tarô e conselhos da IA Orbia no Portal Órbita!',
                                url: window.location.href,
                              }).catch(console.warn);
                            } else {
                              navigator.clipboard.writeText(window.location.href);
                              alert(t("Recurso de compartilhamento nativo indisponível. O link do aplicativo foi copiado para a área de transferência!"));
                            }
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-950 font-black rounded-xl text-[10.5px] font-sans uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 flex-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          Enviar via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECURITY ASSURANCE BANNER AND TECHNICAL SPECIFICATIONS AND TUTORIAL */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3 font-sans">
                <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">🛡️ Informações Úteis de Instalação e Distribuição Independente</h5>
                <p className="text-[10.5px] text-slate-500 leading-relaxed">
                  Sendo uma plataforma de sabedoria avançada e criptografia astro-quântica, o APK do <strong>Portal Órbita</strong> é distribuído de forma independente e segura fora das lojas oficiais corporativas. Isso garante absoluta privacidade dos seus dados e integridade de suas consultas com os arcanos do Tarot e a IA Orbia. Ao ativar o APK, lembre-se de habilitar e autorizar o parâmetro "Instalação de Fontes Desconhecidas" nas configurações de segurança do seu dispositivo. É totalmente seguro e livre de vírus.
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    {/* Blog Article Interactive Reader Modal */}
    {selectedArticle && (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[160] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-2xl p-6 relative overflow-hidden text-left shadow-2xl animate-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-350 p-1 bg-slate-955/50 rounded-lg hover:bg-slate-850 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-extrabold font-mono">Artigo de Saber</span>
          <h1 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight mt-3 mb-1">{selectedArticle.title}</h1>
          <p className="text-[10px] text-slate-500 font-mono">Por {selectedArticle.author} · {selectedArticle.date}</p>
          
          <div className="my-4 border-b border-slate-850" />
          
          <p className="text-xs text-slate-400 italic mb-4 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-850">{selectedArticle.summary}</p>
          <p className="text-xs md:text-sm text-slate-205 leading-relaxed selection:bg-amber-500/30 whitespace-pre-wrap">{selectedArticle.content}</p>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="px-4 py-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-black uppercase rounded-xl transition cursor-pointer"
            >
              Concluir Leitura
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Planet Definition Interactive Modal */}
    {selectedSign && (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[160] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-3xl p-6 relative overflow-hidden text-left shadow-2xl animate-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => setSelectedSign(null)}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-350 p-1 bg-slate-955/50 rounded-lg hover:bg-slate-850 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl text-purple-400">{selectedSign.symbol}</span>
            <div>
              <span className="text-[9px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md font-extrabold font-mono">Definição Planetária</span>
              <h1 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight mt-1">{selectedSign.name}</h1>
            </div>
          </div>

          <div className="my-4 border-b border-slate-850" />

          <div className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                <span className="text-slate-500 block uppercase">Planeta Regente</span>
                <strong className="text-slate-200 mt-0.5 block">{selectedSign.regente}</strong>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                <span className="text-slate-500 block uppercase">Elemento</span>
                <strong className="text-slate-200 mt-0.5 block">{selectedSign.element}</strong>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Características / Traços</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedSign.traits}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Previsão Cósmica (Horóscopo)</h4>
              <p className="text-xs text-amber-100/90 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 italic">"{selectedSign.horoscopo}"</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedSign(null)}
              className="px-4 py-2 bg-purple-500 text-slate-950 hover:bg-purple-400 text-xs font-black uppercase rounded-xl transition cursor-pointer"
            >
              Concluiu
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
    </div>
  );
}
