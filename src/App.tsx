import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import i18n from './lib/i18n';
import { 
  UserProfile, 
  AstrologyMap, 
  NumerologyCycle, 
  DreamEntry, 
  DreamInterpretation, 
  OracleDreamEntry,
  OracleDreamInterpretation, 
  CompatibilityResult, 
  ProsperityMap, 
  DailyRadar, 
  DailyMission, 
  DayTrend, 
  ChatMessage, 
  DailyOracleResponse, 
  TarotDrawResult,
  AstroAstroPosition,
  AstroHouse,
  AstroAspect
} from './types';
import CompatibilityView from './components/CompatibilityView';
import { calculateNatalChart } from './astrology';
import { calculateNumerology } from './numerology';
// Lazy load heavy computational views for faster initial loading
const AstrologyView = React.lazy(() => import('./components/AstrologyView'));
const NumerologyView = React.lazy(() => import('./components/NumerologyView'));
const TransitMap = React.lazy(() => import('./components/TransitMap'));
import TransitHistory from './components/TransitHistory';
import MoonTipCard from './components/MoonTipCard';
import AstroNotifications from './components/AstroNotifications';
import TarotSystem from './components/TarotSystem';
import LunarNodes from './components/LunarNodes';
import LunarCycle from './components/LunarCycle';
import BiorhythmView from './components/BiorhythmView';
import UserDashboardPortal from './components/UserDashboardPortal';
import AdminPanel from './components/AdminPanel';
import OrbiaAIAndOracle from './components/OrbiaAIAndOracle';
import OraculoDosSonhosCard from './components/OraculoDosSonhosCard';
import { CityAutocomplete } from './components/CityAutocomplete';
import { SIGNS_ZODIAC_LIST, BLOG_ARTICLES_LIST, FAQ_LIST } from './data';
import { getAvatarUrl, getAvatarsList } from './lib/avatars';
import { 
  saveProfileToDatabase, 
  loadProfileFromDatabase, 
  saveExtraMapToDatabase, 
  deleteExtraMapFromDatabase, 
  loadExtraMapsFromDatabase, 
  saveDreamToDatabase, 
  loadDreamsFromDatabase,
  subscribeToUserProfile,
  subscribeToExtraMaps,
  subscribeToDreams,
  registerWithEmailFirebase,
  loginWithEmailFirebase,
  loginWithGoogleFirebase,
  loginWithFacebookFirebase,
  sendPasswordResetFirebase,
  logoutWithFirebase,
  deleteUserAccountFirebase,
  subscribeToAuthChanges,
  loadCalculationCache,
  saveCalculationCache,
  clearCalculationCache,
  sendNativeEmailVerification,
  checkDeviceTrial,
  getFirebaseAuth,
  saveNatalChartToDatabase,
  loadNatalChartFromDatabase,
  loadAllNatalCharts,
  saveTransitToDatabase,
  saveDailyInsightToDatabase,
  saveWeeklyInsightToDatabase,
  saveMissionToDatabase,
  loadMissionsFromDatabase,
  saveTarotReadingToDatabase,
  saveNumerologyToDatabase,
  saveProsperityMapToDatabase,
  saveBiorhythmToDatabase,
  saveLunarNodesToDatabase,
  saveNotificationToDatabase,
  saveSubscriptionToDatabase
} from './lib/firebase';
import { generatePersonalizedProsperityMap } from './components/prosperityEngine';
import { generateDailyPrediction } from './components/dailyPredictionsEngine';
import { PremiumConversionScreen } from './components/PremiumConversionScreen';
import { getTranslation, getInitialLanguage, translateUiText, Language } from './lib/translations';

// High-end Elite Celestial Logo Component
export const OrbitaLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer subtle rotating constellation circle */}
      <svg className="absolute inset-0 w-full h-full animate-spin text-amber-500/20" style={{ animationDuration: '40s' }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" fill="none" />
      </svg>
      {/* Inner precise cosmic ring */}
      <svg className="absolute w-[80%] h-[80%] text-amber-500/40" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
      {/* Central gleaming geometric diamond representing cosmic precision */}
      <div className="absolute w-[45%] h-[45%] bg-gradient-to-tr from-amber-400 via-amber-500 to-rose-500 rounded-sm rotate-45 border border-amber-300/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.35)]">
        <Sparkles className="w-3 text-slate-950 rotate-[-45deg] stroke-[2.5]" />
      </div>
      {/* Ambient orbit node */}
      <div className="absolute w-2 h-2 bg-rose-500 rounded-full top-[10%] right-[10%] border border-slate-950 shadow-md animate-pulse" />
    </div>
  );
};
import { 
  Compass, 
  Orbit, 
  Globe, 
  Sparkles, 
  Moon, 
  Sun, 
  User, 
  Star, 
  Settings, 
  Activity, 
  HelpCircle, 
  Calendar, 
  DollarSign, 
  Award, 
  Search, 
  Send, 
  Plus, 
  Trash2, 
  Menu, 
  X, 
  Mail,
  Bell,
  ChevronDown, 
  Check, 
  LogOut, 
  MessageSquare, 
  Share2, 
  Smartphone, 
  RefreshCw, 
  BookOpen, 
  Heart, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Hash,
  Users,
  Home,
  Eye,
  Sliders,
  Camera,
  ExternalLink
} from 'lucide-react';

export function isPostTrialLocked(user: UserProfile): boolean {
  return false;
}

// Helper functions for user profile metadata
function getZodiacSign(dateStr: string): string {
  if (!dateStr) return "Aquário";
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
}

function getRisingSign(dateStr: string, timeStr: string): string {
  if (!dateStr) return "Sagitário";
  const date = new Date(dateStr + "T00:00:00");
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let hour = 12;
  let minute = 0;
  if (timeStr && timeStr.includes(':')) {
    const parts = timeStr.split(':');
    hour = parseInt(parts[0], 10) || 12;
    minute = parseInt(parts[1], 10) || 0;
  }
  
  const daysSinceMarch21 = (month * 30 + day - 80 + 360) % 360;
  const raSun = (daysSinceMarch21 / 360) * 24;
  
  const timeSinceNoon = hour + (minute / 60) - 12;
  const lst = (raSun + timeSinceNoon + 24) % 24;
  
  const signs = [
    "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", 
    "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
  ];
  
  const index = Math.floor((lst + 16.5) % 24 / 2) % 12;
  return signs[index];
}

function getLifePathNumber(dateStr: string): number {
  if (!dateStr) return 8;
  const digits = dateStr.replace(/[^0-9]/g, '');
  let sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return sum;
}

function getLifePathInterpret(num: number): string {
  switch(num) {
    case 1: return "Liderança nata, pioneirismo fecundo e forte iniciativa realizadora original.";
    case 2: return "Diplomacia empática, sensibilidade aguçada e acolhimento pacífico.";
    case 3: return "Expressão criativa fervorosa, comunicação estelar e magnetismo social genuíno.";
    case 4: return "Trabalho virtuoso, estabilidade prática, método, paciência e estrutura robusta.";
    case 5: return "Busca incansável pela liberdade, expedições intelectuais e incrível adaptabilidade.";
    case 6: return "Instintos profundos de afeto, harmonia do lar e responsabilidade restauradora.";
    case 7: return "Análise espiritual, sabedoria oculta, introspecção mística e intuição refinada.";
    case 8: return "Poder pessoal materializador, autoridade executiva sábia e ressonância de justiça.";
    case 9: return "Humanitarismo iluminado, generosidade incondicional e encerramento de ciclos.";
    case 11: return "Idealismo clarividente, inspiração superior e canalização de ideais originais.";
    case 22: return "O grande arquiteto de projetos duradouros que impactam a sociedade coletiva.";
    case 33: return "O guia espiritual supremo voltado ao amor incondicional no plano físico.";
    default: return "Luz estelar orientando seus aprendizados fundamentais na Escola Terrestre.";
  }
}

// Obter informações do dispositivo/navegador reais em tempo real
function getDeviceDescription(): string {
  if (typeof window === 'undefined' || !navigator) return "Acessando o Portal";
  const ua = navigator.userAgent;
  let deviceName = "Computador (Desktop)";
  if (/Android/i.test(ua)) deviceName = "Dispositivo Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) deviceName = "Dispositivo iOS";
  else if (/Windows Phone/i.test(ua)) deviceName = "Dispositivo Windows Phone";
  else if (/Mobile/i.test(ua) || /Tablet/i.test(ua)) deviceName = "Dispositivo Móvel";

  let browserName = "Navegador Web";
  if (ua.indexOf("Firefox") > -1) browserName = "Firefox";
  else if (ua.indexOf("SamsungBrowser") > -1) browserName = "Samsung Browser";
  else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browserName = "Opera";
  else if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) browserName = "Microsoft Edge";
  else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Safari") > -1) browserName = "Google Chrome";
  else if (ua.indexOf("Safari") > -1) browserName = "Safari";

  return `${deviceName} (${browserName})`;
}

// Obter aproximação real do local com base no TimeZone do dispositivo
function getRealTimeZoneLocation(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return "Localização Geral";
    const parts = tz.split('/');
    const city = parts[parts.length - 1];
    if (!city) return "Localização Geral";
    
    // Tratando termos comuns de cidades de fuso horário brasileiro de forma limpa e em português
    const cleanCity = city.replace(/_/g, ' ');
    if (cleanCity === "Sao Paulo") return "São Paulo, SP";
    if (cleanCity === "Rio de Janeiro") return "Rio de Janeiro, RJ";
    if (cleanCity === "Fortaleza") return "Fortaleza, CE";
    if (cleanCity === "Recife") return "Recife, PE";
    if (cleanCity === "Salvador") return "Salvador, BA";
    if (cleanCity === "Porto Alegre") return "Porto Alegre, RS";
    if (cleanCity === "Manaus") return "Manaus, AM";
    if (cleanCity === "Cuiaba") return "Cuiabá, MT";
    if (cleanCity === "Belem") return "Belém, PA";
    if (cleanCity === "Fernando de Noronha") return "Fernando de Noronha, PE";
    if (cleanCity === "Araguaina") return "Araguaína, TO";
    if (cleanCity === "Bahia") return "Salvador, BA";
    if (cleanCity === "Maceio") return "Maceió, AL";
    
    return cleanCity;
  } catch {
    return "Sua Região";
  }
}

// Carrega as contas cadastradas do localStorage
function getRegisteredAccounts(): any[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem("orbi_registered_accounts");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Salva a lista de contas no localStorage
function saveRegisteredAccounts(accounts: any[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("orbi_registered_accounts", JSON.stringify(accounts));
  }
}

function getZodiacSignForMissions(dateString: string): string {
  if (!dateString) return "Aquário";
  const parts = dateString.split("-");
  if (parts.length < 3) return "Aquário";
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (isNaN(month) || isNaN(day)) return "Aquário";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário";
  return "Peixes";
}

function generateDailyMissions(user: any): DailyMission[] {
  const name = user?.name ? user.name.split(" ")[0] : "Viajante";
  const birthDate = user?.birthDate || "2000-01-01";
  const zodiac = getZodiacSignForMissions(birthDate);

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  const seedVal = (day + month * 12 + year + (user?.name ? user.name.length : 3)) % 4;

  const missionTemplates = [
    [
      {
        id: "dm1",
        title: `Consagração de ${zodiac} para ${name}`,
        description: `Dedique 3 minutos respirando conscientemente para ativar o equilíbrio cósmico para sua essência de ${zodiac}.`,
        isCompleted: false,
        points: 40
      },
      {
        id: "dm2",
        title: "Harmonização de Mercúrio",
        description: "Escreva algo que te aflige e depois risque no papel, transmutando restrições mentais.",
        isCompleted: false,
        points: 50
      },
      {
        id: "dm3",
        title: "Toque de Gratidão Vital",
        description: "Fortaleça conexões e envie uma mensagem curta com um elogio sincero para alguém importante em sua jornada.",
        isCompleted: false,
        points: 30
      }
    ],
    [
      {
        id: "dm1",
        title: `Alinhamento de ${zodiac} para ${name}`,
        description: `Escreva no Oráculo dos Sonhos tudo que se lembrar da noite anterior, decifrando avisos do seu guia onírico.`,
        isCompleted: false,
        points: 50
      },
      {
        id: "dm2",
        title: "Selo de Desapego de Saturno",
        description: "Organize sua área de estudos ou e-mails importantes hoje para desbloquear estagnações kármicas.",
        isCompleted: false,
        points: 30
      },
      {
        id: "dm3",
        title: "Cura Líquida Purificadora",
        description: "Mentalize paz e tome um copo cheio de água fresca, promovendo purificação de cansaço acumulado.",
        isCompleted: false,
        points: 40
      }
    ],
    [
      {
        id: "dm1",
        title: `Foco de Vênus para ${name}`,
        description: `Olhe-se no espelho por 1 minuto sintonizando a resiliência e auto-aceitação para seu signo solar de ${zodiac}.`,
        isCompleted: false,
        points: 45
      },
      {
        id: "dm2",
        title: "Doação Elemental Prática",
        description: "Considere doar ou arrumar duas coisas materiais sem uso em seu ambiente para fluxo cósmico.",
        isCompleted: false,
        points: 50
      },
      {
        id: "dm3",
        title: "Oração Vibracional Cósmica",
        description: "Mentalize e envie ondas silenciosas de pura compaixão por três pessoas que cruzarem sua mente hoje.",
        isCompleted: false,
        points: 30
      }
    ],
    [
      {
        id: "dm1",
        title: `Vigor de Marte para ${name}`,
        description: `Alongue os membros do corpo por 5 minutos respirando profundamente, liberando bloqueios articulares.`,
        isCompleted: false,
        points: 40
      },
      {
        id: "dm2",
        title: "Ritual Solar da Gratidão",
        description: "Agradeça mentalmente por três bênçãos invisíveis que estão florescendo na sua jornada diária.",
        isCompleted: false,
        points: 40
      },
      {
        id: "dm3",
        title: `Clareza Onírica de ${zodiac}`,
        description: "Abandone o celular por 1 hora antes de deitar ou repousar para equilibrar sua frequência teta.",
        isCompleted: false,
        points: 50
      }
    ]
  ];

  return missionTemplates[seedVal % missionTemplates.length];
}

const localLangDict: Record<string, Record<string, string>> = {
  pt: {
    general_settings: "Configurações Gerais",
    settings_desc: "Gerencie suas coordenadas, sintonizações premium e preferências.",
    control_panel: "Painel de Controle",
    edit_coords: "Editar Coordenadas Celestes",
    birth_date: "DATA DE NASCIMENTO",
    birth_time: "HORA COMPLETA",
    birth_city: "CIDADE CODIFICADA",
    changes_count: "Alterações do Mapa Principal:",
    limit_reached: "⚠️ Limite vitalício atingido. Não é mais possível alterar as coordenadas celestes do seu Mapa Principal.",
    changes_remaining: "Você possui {count} alterações restantes para o Mapa Principal.",
    lang_sovereignty: "Soberania de Idiomas",
    preferred_lang: "Idioma Predileto",
    lang_desc: "Traduções automáticas aplicadas em relatórios avançados de IA.",
    accessibility: "Acessibilidade",
    high_contrast: "Modo de Alto Contraste",
    contrast_desc: "Aumenta o contraste de textos, botões e bordas para garantir melhor visibilidade.",
    delete_account_title: "Exclusão Definitiva",
    delete_account_btn: "Apagar Conta do Portal",
    delete_account_desc: "A remoção de registros apaga permanentemente todos os relatórios, mapas e históricos criptografados no banco de dados.",
    logout_btn: "Sair do Portal",
    points_label: "Pontos",
    trial_badge: "Acesso Premium Ativo",
    calculating_placidus: "Calculando Placidus em tempo real...",
    area_usuario: "Área do Usuário",
    meu_mapa: "Meu Mapa",
    criar_meu_mapa: "Criar Meu Mapa",
    mapas_extras: "Mapas Extras",
    alerts_and_notifs: "Alertas e Notificações",
    daily_notifs: "Notificações Diárias Push",
    daily_notifs_desc: "Receber alertas de trânsitos e biorritmo de manhã no celular.",
    sms_reminders: "SMS Astro-Reminders",
    sms_reminders_desc: "Alertas urgentes de trânsitos tensos (Mercúrio Retrógrado).",
    performance_storage: "Desempenho e Armazenamento",
    clear_cache: "Limpar Cache do Sistema",
    clear_cache_desc: "Apaga os arquivos temporários e caches de desempenho de relatórios. Não afeta seus mapas nem sua conta de acesso.",
    clear_cache_btn: "Limpar Cache",
    support_team: "Em caso de dúvidas, faça contato com a equipe de suporte pelo canal de integridade celestial do portal.",
    logout_app_btn: "Sair do Aplicativo",
    delete_acc_btn: "Excluir Minha Conta",
    delete_confirm_title: "Excluir sua conta?",
    delete_confirm_desc: "Você deseja excluir sua conta? Ao excluir sua conta todos os seus dados mapas registros estatísticas serão excluídos da plataforma.",
    delete_confirm_yes: "Sim, quero excluir",
    delete_confirm_cancel: "Cancelar",
  },
  en: {
    general_settings: "General Settings",
    settings_desc: "Manage your coordinates, premium subscription and preferences.",
    control_panel: "Control Panel",
    edit_coords: "Edit Celestial Coordinates",
    birth_date: "DATE OF BIRTH",
    birth_time: "FULL TIME",
    birth_city: "ENCODED CITY",
    changes_count: "Main Chart Changes:",
    limit_reached: "⚠️ Lifetime limit reached. It is no longer possible to change the celestial coordinates of your Main Chart.",
    changes_remaining: "You have {count} changes remaining for the Main Chart.",
    lang_sovereignty: "Language Sovereignty",
    preferred_lang: "Preferred Language",
    lang_desc: "Automatic translations applied in advanced AI reports.",
    accessibility: "Accessibility",
    high_contrast: "High Contrast Mode",
    contrast_desc: "Increases text, button, and border contrast for better visibility.",
    delete_account_title: "Definitive Deletion",
    delete_account_btn: "Delete Portal Account",
    delete_account_desc: "Removing your record permanently deletes all encrypted reports, charts, and histories from the database.",
    logout_btn: "Log Out of Portal",
    points_label: "Points",
    trial_badge: "Premium Access Active",
    calculating_placidus: "Calculating Placidus in real time...",
    area_usuario: "User Dashboard",
    meu_mapa: "My Chart",
    criar_meu_mapa: "Create Chart",
    mapas_extras: "Extra Charts",
    alerts_and_notifs: "Alerts & Notifications",
    daily_notifs: "Daily Push Notifications",
    daily_notifs_desc: "Receive transit and biorhythm alerts in the morning.",
    sms_reminders: "Interactive Astro-Reminders",
    sms_reminders_desc: "Urgent alerts for challenging transits (Mercury Retrograde).",
    performance_storage: "Performance & Storage",
    clear_cache: "Clear System Cache",
    clear_cache_desc: "Deletes temporary files and cached report metrics. Does not affect your charts or account integrity.",
    clear_cache_btn: "Clear Cache",
    support_team: "In case of structural questions, contact the support team via the portal integrations line.",
    logout_app_btn: "Sign Out of App",
    delete_acc_btn: "Delete My Account",
    delete_confirm_title: "Delete your account?",
    delete_confirm_desc: "Are you sure you want to delete your account? All your charts, reports, and historic portal logs will be permanently erased.",
    delete_confirm_yes: "Yes, delete account",
    delete_confirm_cancel: "Cancel",
  },
  es: {
    general_settings: "Configuración General",
    settings_desc: "Administre sus coordenadas, suscripciones premium y preferencias.",
    control_panel: "Panel de Control",
    edit_coords: "Editar Coordenadas Celestes",
    birth_date: "FECHA DE NASCIMIENTO",
    birth_time: "HORA COMPLETA",
    birth_city: "CIUDAD CODIFICADA",
    changes_count: "Cambios en la Carta Principal:",
    limit_reached: "⚠️ Se alcanzó el límite de por vida. Ya no es posible cambiar las coordenadas celestes de su Carta Principal.",
    changes_remaining: "Tiene {count} cambios restantes para la Carta Principal.",
    lang_sovereignty: "Soberanía de Idiomas",
    preferred_lang: "Idioma Predileto",
    lang_desc: "Traducciones automáticas aplicadas en informes avanzados de IA.",
    accessibility: "Accesibilidad",
    high_contrast: "Modo de Alto Contraste",
    contrast_desc: "Aumenta el contraste de textos, botones y bordes para garantizar una mejor visibilidad.",
    delete_account_title: "Remoción Definitiva",
    delete_account_btn: "Eliminar Cuenta del Portal",
    delete_account_desc: "La eliminación de registros borra permanentemente todos los informes, cartas e historiales encriptados en la base de datos.",
    logout_btn: "Cerrar Sesión",
    points_label: "Puntos",
    trial_badge: "Acceso Premium Activo",
    calculating_placidus: "Calculando Plácidus en tempo real...",
    area_usuario: "Área de Usuario",
    meu_mapa: "Mi Carta",
    criar_meu_mapa: "Calcular Carta",
    mapas_extras: "Cartas Extras",
    alerts_and_notifs: "Alertas y Notificaciones",
    daily_notifs: "Notificaciones Diarias Push",
    daily_notifs_desc: "Recibir alertas de tránsitos y biorritmo por la mañana.",
    sms_reminders: "SMS Astro-Reminders",
    sms_reminders_desc: "Alertas urgentes de tránsitos tensos (Mercurio Retrógrado).",
    performance_storage: "Rendimiento y Almacenamiento",
    clear_cache: "Limpar Caché del Sistema",
    clear_cache_desc: "Borra archivos temporales y caché de rendimiento. No afecta sus mapas ni su cuenta.",
    clear_cache_btn: "Limpiar Caché",
    support_team: "En caso de dudas, contacte al soporte a través de la línea de integridad del portal.",
    logout_app_btn: "Cerrar Sesión del App",
    delete_acc_btn: "Excluir Mi Cuenta",
    delete_confirm_title: "¿Eliminar su cuenta?",
    delete_confirm_desc: "¿Desea eliminar su cuenta? Al hacerlo, todos sus datos, mapas e historiales serán borrados para siempre.",
    delete_confirm_yes: "Sí, quiero eliminar",
    delete_confirm_cancel: "Cancelar",
  },
  de: {
    general_settings: "Allgemeine Einstellungen",
    settings_desc: "Verwalten Sie Ihre Koordinaten, Premium-Abonnements und Einstellungen.",
    control_panel: "Systemsteuerung",
    edit_coords: "Himmelskoordinaten bearbeiten",
    birth_date: "GEBURTSDATUM",
    birth_time: "UHRZEIT",
    birth_city: "GEBURTSORT",
    changes_count: "Änderungen am Hauptdiagramm:",
    limit_reached: "⚠️ Lebenslanges Limit erreicht. Es ist nicht mehr möglich, die Himmelskoordinaten Ihres Hauptdiagramms zu ändern.",
    changes_remaining: "Sie haben noch {count} Änderungen für das Hauptdiagramm übrig.",
    lang_sovereignty: "Souveränität der Sprachen",
    preferred_lang: "Bevorzugte Sprache",
    lang_desc: "Automatische Übersetzungen in fortgeschrittenen KI-Berichten.",
    accessibility: "Barrierefreiheit",
    high_contrast: "Hoher Kontrastmodus",
    contrast_desc: "Erhöht den Kontrast von Texten, Schaltflächen und Rändern für eine bessere Sichtbarkeit.",
    delete_account_title: "Endgültige Löschung",
    delete_account_btn: "Portal-Konto löschen",
    delete_account_desc: "Das Entfernen von Datensätzen löscht dauerhaft alle verschlüsselten Berichte, Diagramme und Verläufe in der Datenbank.",
    logout_btn: "Vom Portal abmelden",
    points_label: "Punkte",
    trial_badge: "Premium-Zugang Aktiv",
    calculating_placidus: "Berechnung von Placidus in Echtzeit...",
    area_usuario: "Benutzerkonto",
    meu_mapa: "Mein Horoskop",
    criar_meu_mapa: "Horoskop Erstellen",
    mapas_extras: "Zusatzhoroskope",
    alerts_and_notifs: "Benachrichtigungen & Alarme",
    daily_notifs: "Tägliche Push-Benachrichtigungen",
    daily_notifs_desc: "Erhalten Sie Himmels- und Biorhythmus-Meldungen am Morgen.",
    sms_reminders: "Dringende Kosmische Alarme",
    sms_reminders_desc: "Dringende Benachrichtigungen bei rückläufigem Merkur.",
    performance_storage: "Systemleistung & Speicher",
    clear_cache: "Systemcache löschen",
    clear_cache_desc: "Löscht temporäre Daten und Berichtscaches. Keine Auswirkung auf Ihre Horoskope.",
    clear_cache_btn: "Cache löschen",
    support_team: "Bei Fragen kontaktieren Sie den Support über den offiziellen Portal-Kanal.",
    logout_app_btn: "App abmelden",
    delete_acc_btn: "Konto löschen",
    delete_confirm_title: "Konto unwiderruflich löschen?",
    delete_confirm_desc: "Möchten Sie Ihr Konto wirklich löschen? Alle Berichte und gespeicherten Horoskope werden dauerhaft entfernt.",
    delete_confirm_yes: "Ja, jetzt löschen",
    delete_confirm_cancel: "Abbrechen",
  },
  fr: {
    general_settings: "Paramètres Généraux",
    settings_desc: "Gérez vos coordonnées, abonnements premium et préférences.",
    control_panel: "Panneau de Contrôle",
    edit_coords: "Modifier les Coordonnées Célestes",
    birth_date: "DATE DE NAISSANCE",
    birth_time: "HEURE DE NAISSANCE",
    birth_city: "VILLE CODIFIÉE",
    changes_count: "Changements de Carte Principale :",
    limit_reached: "⚠️ Limite à vie atteinte. Il n'est plus possible de modifier les coordonnées célestes de votre Carte Principale.",
    changes_remaining: "Il vous reste {count} modifications possibles pour la Carte Principale.",
    lang_sovereignty: "Souveraineté Linguistique",
    preferred_lang: "Langue Préférée",
    lang_desc: "Traductions automatiques appliquées aux rapports d'IA avancés.",
    accessibility: "Accessibilité",
    high_contrast: "Mode Contraste Élevé",
    contrast_desc: "Augmente le contraste des textes, boutons et bordures pour assurer une meilleure visibilité.",
    delete_account_title: "Suppression Définitive",
    delete_account_btn: "Supprimer le Compte",
    delete_account_desc: "La suppression de votre enregistrement efface définitivement tous les rapports de calcul, cartes et historiques de la base de données.",
    logout_btn: "Déconnexion du Portal",
    points_label: "Points",
    trial_badge: "Accès Premium Actif",
    calculating_placidus: "Calcul de Placidus en temps réel...",
    area_usuario: "Espace Utilisateur",
    meu_mapa: "Mon Thème",
    criar_meu_mapa: "Créer Ma Carte",
    mapas_extras: "Thèmes Additionnels",
    alerts_and_notifs: "Alertes et Notifications",
    daily_notifs: "Notifications Flash Quotidiennes",
    daily_notifs_desc: "Recevoir des alertes de transits et de biorythme le matin.",
    sms_reminders: "Alerte Astro-Reminders",
    sms_reminders_desc: "Alertes urgentes concernant les transits difficiles (Mercure Rétrograde).",
    performance_storage: "Performance et Stockage",
    clear_cache: "Effacer le Cache Système",
    clear_cache_desc: "Efface les fichiers temporaires et les caches de performance des rapports. N'affecte pas vos thèmes.",
    clear_cache_btn: "Vider le Cache",
    support_team: "Pour toute question, contactez le support via le canal céleste officiel.",
    logout_app_btn: "Se Déconnecter de l'App",
    delete_acc_btn: "Supprimer Mon Compte",
    delete_confirm_title: "Supprimer votre compte ?",
    delete_confirm_desc: "Voulez-vous supprimer votre compte ? Toutes vos données, cartes et historiques seront définitivement effacés.",
    delete_confirm_yes: "Oui, supprimer",
    delete_confirm_cancel: "Annuler",
  }
};

export default function App() {
  // Session / Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem("orbi_logged_email");
  });

  const [loggedEmail, setLoggedEmail] = useState<string>(() => {
    if (typeof window === 'undefined') return "";
    return localStorage.getItem("orbi_logged_email") || "";
  });

  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);
  const [firebaseUid, setFirebaseUid] = useState<string>("");

  // Central Page Translation Helper
  const t = (text: string): string => {
    return translateUiText(text, currentLang || 'pt');
  };

  const [user, _setUser] = useState<UserProfile>(() => {
    let baseProfile: UserProfile = {
      name: "",
      email: "",
      birthDate: "",
      birthTime: "",
      birthCity: "",
      isUnknownTime: false,
      isPremium: true,
      hasCreatedMap: false
    };

    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem("orbi_logged_email");
      if (activeEmail) {
        // 1. Try single user profile first
        const savedProfileStr = localStorage.getItem("orbi_user_profile");
        if (savedProfileStr) {
          try {
            const parsed = JSON.parse(savedProfileStr);
            if (parsed && parsed.email?.toLowerCase().trim() === activeEmail.toLowerCase().trim()) {
              baseProfile = parsed;
            }
          } catch {}
        } else {
          // 2. Fallback to registered accounts
          const accounts = getRegisteredAccounts();
          const match = accounts.find((acc: any) => acc.email.toLowerCase() === activeEmail.toLowerCase());
          if (match && match.user) {
            baseProfile = match.user;
          }
        }
      }
    }

    if (baseProfile.birthDate && baseProfile.birthCity) {
      baseProfile.hasCreatedMap = true;
    }
    return baseProfile;
  });

  const setUser = (nxt: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    _setUser(prev => {
      let resolved = typeof nxt === 'function' ? nxt(prev) : nxt;
      if (resolved && resolved.birthDate && resolved.birthCity) {
        resolved.hasCreatedMap = true;
      }
      return resolved;
    });
  };

  const [scorePoints, setScorePoints] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const activeEmail = localStorage.getItem("orbi_logged_email");
      if (activeEmail) {
        const accounts = getRegisteredAccounts();
        const match = accounts.find((acc: any) => acc.email.toLowerCase() === activeEmail.toLowerCase());
        if (match && match.user && match.user.scorePoints !== undefined) {
          return match.user.scorePoints;
        }
      }
    }
    return 0; // Starts at 0 points for first-time or unlogged users!
  });

  const [showWelcome, setShowWelcome] = useState<boolean>(false);


  const hasUserCreatedMap = (u: any): boolean => {
    return !!u && (u.hasCreatedMap || (!!u.birthDate && !!u.birthCity));
  };


  // UI Navigation states
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    return getInitialLanguage();
  });
  // 'mapa' | 'constelacoes' | 'planetas' | 'tarot' | 'configuracoes' as specified by the bottom-bar prompt!
  const [activeTab, setActiveTab] = useState<'mapa' | 'constelacoes' | 'planetas' | 'tarot' | 'configuracoes'>('mapa');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // User navigation journey sub-tabs under the Map tab:
  // 'area_usuario' | 'meu_mapa' | 'criar_meu_mapa' | 'mapas_extras'
  const [mapSubTab, setMapSubTab] = useState<'area_usuario' | 'meu_mapa' | 'criar_meu_mapa' | 'mapas_extras'>('area_usuario');

  // Sub-tab selection inside the "Área do Usuário" itself:
  // 'radar' | 'missao' | 'calendario' | 'cores' | 'amuletos' | 'mensagem' | 'painel_mes' | 'prosperidade' | 'amor' | 'relacionamentos' | 'desenvolvimento' | 'sonhos' | 'oportunidades_hoje' | 'energia_casa' | 'universo_mostrando'
  const [areaSubTab, setAreaSubTab] = useState<'radar' | 'missao' | 'calendario' | 'cores' | 'amuletos' | 'mensagem' | 'painel_mes' | 'prosperidade' | 'amor' | 'relacionamentos' | 'desenvolvimento' | 'sonhos' | 'oportunidades_hoje' | 'energia_casa' | 'universo_mostrando'>('universo_mostrando'); // Start with the premium "O que o universo quer te mostrar" tab active!

  // Active day selection for the smart 30-day calendar map
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(new Date().getDate()); // Defaults to current day dynamically!
  const [selectedProsperityDay, setSelectedProsperityDay] = useState<number | null>(null);

  // State to manage extra maps (up to 2 maximum)
  const [extraMaps, setExtraMaps] = useState<any[]>(() => {
    const saved = localStorage.getItem("orbi_extra_maps");
    return saved ? JSON.parse(saved) : [];
  });

  // State to hold extra map astrological/numerological analysis when active
  const [activeExtraMapData, setActiveExtraMapData] = useState<AstrologyMap | null>(null);
  const [activeExtraMapNumerology, setActiveExtraMapNumerology] = useState<any | null>(null);
  const [activeExtraMapName, setActiveExtraMapName] = useState<string>('');
  const [activeExtraMapBirthDate, setActiveExtraMapBirthDate] = useState<string>('');
  const [isLoadingExtraMap, setIsLoadingExtraMap] = useState<boolean>(false);

  // Sync extraMaps with localStorage
  useEffect(() => {
    localStorage.setItem("orbi_extra_maps", JSON.stringify(extraMaps));
  }, [extraMaps]);

  // Administration overlay & Error monitoring telemetry states
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [verifyingStripe, setVerifyingStripe] = useState<boolean>(false);
  const [firebaseErrors, setFirebaseErrors] = useState<any[]>([]);

  // Authentication states
  const [authTab, setAuthTab] = useState<'birth_info' | 'register_credentials' | 'login' | 'forgot_password'>('birth_info');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [loginBirthCity, setLoginBirthCity] = useState('');
  const [unauthorizedDomainError, setUnauthorizedDomainError] = useState<boolean>(false);
  const [popupClosedError, setPopupClosedError] = useState<boolean>(false);
  const [operationNotAllowedError, setOperationNotAllowedError] = useState<boolean>(false);
  
  // Email verification helper states
  const [lastSimulatedCode, setLastSimulatedCode] = useState<string>('');
  const [verificationInputCode, setVerificationInputCode] = useState<string>('');
  const [isSendingVerificationCode, setIsSendingVerificationCode] = useState<boolean>(false);
  const [isVerifyingNative, setIsVerifyingNative] = useState<boolean>(false);
  const [isResendingNative, setIsResendingNative] = useState<boolean>(false);
  
  // Custom auth design flow helpers
  const [showAscExplain, setShowAscExplain] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [timeIsUnknown, setTimeIsUnknown] = useState(false);

  // Millionaire footer interactive modal states
  const [landingFooterModal, setLandingFooterModal] = useState<'privacy' | 'terms' | 'security' | 'about' | 'support' | null>(null);
  const [supportCategory, setSupportCategory] = useState<string>('technical');
  const [supportMessage, setSupportMessage] = useState<string>('');
  const [supportSending, setSupportSending] = useState<boolean>(false);
  const [supportSuccessMessage, setSupportSuccessMessage] = useState<string>('');

  // High contrast visual accessibility states
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem("orbi_high_contrast") === "true";
  });

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('alto-contraste');
    } else {
      document.documentElement.classList.remove('alto-contraste');
    }
    localStorage.setItem("orbi_high_contrast", String(highContrast));
  }, [highContrast]);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };



  // Social login and password reset handler integrations
  const handleGoogleLogin = async () => {
    manualAuthActionRef.current = true;
    try {
      const firebaseUser = await loginWithGoogleFirebase();
      if (firebaseUser && firebaseUser.email) {
        const emailLower = firebaseUser.email.toLowerCase().trim();
        const checkStatus = await checkDeviceTrial(emailLower);
        const existingProfile = await loadProfileFromDatabase(emailLower);
        let targetUser: UserProfile;

        if (existingProfile) {
          const birthDateToUse = existingProfile.birthDate || createMainDate || "";
          const birthTimeToUse = existingProfile.birthTime || (createMainDate && createMainTime ? createMainTime : (timeIsUnknown ? "12:00" : "")) || "";
          const birthCityToUse = existingProfile.birthCity || createMainCity || loginBirthCity.trim() || "";
          const isUnknownTimeToUse = existingProfile.isUnknownTime ?? (createMainDate ? timeIsUnknown : false);
          const hasProvidedData = !!birthDateToUse && !!birthCityToUse;

          const forceTrialUsed = (!checkStatus.isAllowed && !existingProfile.isSubscribed);

          const rawName = createMainName.trim() || existingProfile.displayName || existingProfile.profileName || existingProfile.birthName || existingProfile.name || firebaseUser.displayName || "Viajante Estelar";
          const finalName = (rawName === "Viajante Estelar") ? "Buscador" : rawName;

          targetUser = {
            ...existingProfile,
            userId: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: finalName,
            displayName: existingProfile.displayName || finalName,
            birthName: existingProfile.birthName || finalName,
            profileName: existingProfile.profileName || finalName,
            avatarId: existingProfile.avatarId || existingProfile.profilePhoto || "",
            profilePhoto: existingProfile.avatarId || existingProfile.profilePhoto || firebaseUser.photoURL || "",
            preferredLanguage: existingProfile.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
            birthDate: birthDateToUse,
            birthTime: birthTimeToUse,
            birthCity: birthCityToUse,
            isUnknownTime: isUnknownTimeToUse,
            isPremium: existingProfile.isPremium ?? true,
            hasCreatedMap: hasProvidedData,
            email: emailLower,
            scorePoints: existingProfile.scorePoints ?? 0,
            emailVerified: true, // Google accounts are pre-verified natively
            isEmailVerified: true,
            photoURL: firebaseUser.photoURL || existingProfile.photoURL,
            provider: 'google',
            trialUsed: forceTrialUsed ? true : (existingProfile.trialUsed ?? false),
            trialStartDate: existingProfile.trialStartDate || new Date().toISOString(),
            trialEndDate: existingProfile.trialEndDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            deviceId: checkStatus.deviceId,
            deviceFingerprint: checkStatus.fingerprint,
            lastLoginAt: new Date().toISOString(),
            isSubscribed: existingProfile.isSubscribed ?? false,
            subscriptionEndDate: existingProfile.subscriptionEndDate || "",
            latitude: existingProfile.latitude || createMainCoords?.latitude || user.latitude,
            longitude: existingProfile.longitude || createMainCoords?.longitude || user.longitude
          };

          await saveProfileToDatabase(emailLower, targetUser as any);
          if (forceTrialUsed) {
            triggerGlobalNotification("Período de Teste Concluído", "Este dispositivo já utilizou o período gratuito. Ative uma assinatura para continuar.", "alert");
          } else {
            triggerGlobalNotification("Bem-vindo de Volta", `Olá, ${targetUser.name || "Buscador"}! Conexão cósmica restaurada.`, "success");
          }
        } else {
          // New Google account flow
          const blockTrial = !checkStatus.isAllowed;
          const rawNameToUse = createMainName.trim() || user.displayName || user.profileName || user.birthName || user.name || firebaseUser.displayName || "Viajante Estelar";
          const finalNameToUse = (rawNameToUse === "Viajante Estelar") ? "Buscador" : rawNameToUse;
          const birthDateToUse = createMainDate || "";
          const birthTimeToUse = timeIsUnknown ? "12:00" : (createMainTime || "12:00");
          const birthCityToUse = createMainCity || "";
          const isUnknownTimeToUse = timeIsUnknown;
          const hasProvidedData = !!birthDateToUse && !!birthCityToUse;

          targetUser = {
            userId: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: finalNameToUse,
            displayName: user.displayName || finalNameToUse,
            birthName: user.birthName || finalNameToUse,
            profileName: user.profileName || finalNameToUse,
            avatarId: user.avatarId || user.profilePhoto || "",
            profilePhoto: user.avatarId || user.profilePhoto || firebaseUser.photoURL || "",
            preferredLanguage: user.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
            birthDate: birthDateToUse,
            birthTime: birthTimeToUse,
            birthCity: birthCityToUse,
            isUnknownTime: isUnknownTimeToUse,
            isPremium: true,
            hasCreatedMap: hasProvidedData,
            email: emailLower,
            scorePoints: user.scorePoints || 0,
            latitude: createMainCoords?.latitude || user.latitude,
            longitude: createMainCoords?.longitude || user.longitude,
            emailVerified: true, // Auto verified
            isEmailVerified: true,
            photoURL: firebaseUser.photoURL || "",
            provider: 'google',
            trialUsed: blockTrial ? true : (user.trialUsed || false),
            trialStartDate: user.trialStartDate || new Date().toISOString(),
            trialEndDate: blockTrial 
              ? new Date(Date.now() - 1000).toISOString()
              : (user.trialEndDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()),
            deviceId: checkStatus.deviceId || user.deviceId,
            deviceFingerprint: checkStatus.fingerprint || user.deviceFingerprint,
            lastLoginAt: new Date().toISOString(),
            createdAt: user.createdAt || new Date().toISOString(),
            isSubscribed: user.isSubscribed || false,
            subscriptionEndDate: user.subscriptionEndDate || ""
          };

          await saveProfileToDatabase(emailLower, targetUser as any);
          if (blockTrial) {
            triggerGlobalNotification("Aviso de Período de Teste", "Este dispositivo já utilizou o período gratuito anteriormente.", "alert");
          } else {
            triggerGlobalNotification("Portal Órbita", "Sua Conta Google foi conectada e seu mapa astral foi criado com sucesso!", "success");
          }
        }

        localStorage.setItem("orbi_logged_email", emailLower);
        localStorage.setItem("orbi_user_profile", JSON.stringify(targetUser));
        setLoggedEmail(emailLower);
        setUser(targetUser);
        setIsLoggedIn(true);

        await migrateLocalDataToCloud(emailLower, firebaseUser.uid, targetUser);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('unauthorized-domain') || err.code?.includes('unauthorized-domain') || String(err).includes('unauthorized-domain')) {
        setUnauthorizedDomainError(true);
      } else if (err.message?.includes('popup-closed-by-user') || err.code?.includes('popup-closed-by-user') || String(err).includes('popup-closed-by-user') ||
                 err.message?.includes('cancelled-popup-request') || err.code?.includes('cancelled-popup-request') || String(err).includes('cancelled-popup-request')) {
        setPopupClosedError(true);
      } else {
        triggerGlobalNotification("Erro de Autenticação", err.message || "Não foi possível conectar com o Google.", "alert");
      }
    } finally {
      setTimeout(() => {
        manualAuthActionRef.current = false;
      }, 2000);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const firebaseUser = await loginWithFacebookFirebase();
      if (firebaseUser && firebaseUser.email) {
        const emailLower = firebaseUser.email.toLowerCase().trim();
        const checkStatus = await checkDeviceTrial(emailLower);
        const existingProfile = await loadProfileFromDatabase(emailLower);
        let targetUser: UserProfile;

        if (existingProfile) {
          const finalBirthCity = loginBirthCity.trim() || existingProfile.birthCity || "";
          const forceTrialUsed = (!checkStatus.isAllowed && !existingProfile.isSubscribed);

          const rawName = existingProfile.displayName || existingProfile.profileName || existingProfile.birthName || existingProfile.name || firebaseUser.displayName || "Viajante Estelar";
          const finalName = (rawName === "Viajante Estelar") ? "Buscador" : rawName;

          targetUser = {
            ...existingProfile,
            userId: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: finalName,
            displayName: existingProfile.displayName || finalName,
            birthName: existingProfile.birthName || finalName,
            profileName: existingProfile.profileName || finalName,
            avatarId: existingProfile.avatarId || existingProfile.profilePhoto || "",
            profilePhoto: existingProfile.avatarId || existingProfile.profilePhoto || firebaseUser.photoURL || "",
            preferredLanguage: existingProfile.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
            birthDate: existingProfile.birthDate || "",
            birthTime: existingProfile.birthTime || "",
            birthCity: finalBirthCity,
            isUnknownTime: existingProfile.isUnknownTime ?? false,
            isPremium: existingProfile.isPremium ?? true,
            hasCreatedMap: existingProfile.hasCreatedMap ?? (existingProfile.birthDate ? true : false),
            email: emailLower,
            scorePoints: existingProfile.scorePoints ?? 0,
            emailVerified: true, 
            isEmailVerified: true,
            photoURL: firebaseUser.photoURL || existingProfile.photoURL,
            provider: 'facebook',
            trialUsed: forceTrialUsed ? true : (existingProfile.trialUsed ?? false),
            trialStartDate: existingProfile.trialStartDate || new Date().toISOString(),
            trialEndDate: existingProfile.trialEndDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            deviceId: checkStatus.deviceId,
            deviceFingerprint: checkStatus.fingerprint,
            lastLoginAt: new Date().toISOString(),
            isSubscribed: existingProfile.isSubscribed ?? false,
            subscriptionEndDate: existingProfile.subscriptionEndDate || ""
          };

          await saveProfileToDatabase(emailLower, targetUser as any);
          if (forceTrialUsed) {
            triggerGlobalNotification("Período de Teste Concluído", "Este dispositivo já utilizou o período gratuito. Ative uma assinatura para continuar.", "alert");
          } else {
            triggerGlobalNotification("Bem-vindo de Volta", `Olá, ${existingProfile.name || "Buscador"}! Conexão via Facebook ativa.`, "success");
          }
        } else {
          const blockTrial = !checkStatus.isAllowed;
          const rawNameToUse = firebaseUser.displayName || user.displayName || user.profileName || user.birthName || user.name || "Viajante Estelar";
          const finalNameToUse = (rawNameToUse === "Viajante Estelar") ? "Buscador" : rawNameToUse;

          targetUser = {
            userId: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: finalNameToUse,
            displayName: user.displayName || finalNameToUse,
            birthName: user.birthName || finalNameToUse,
            profileName: user.profileName || finalNameToUse,
            avatarId: user.avatarId || user.profilePhoto || "",
            profilePhoto: user.avatarId || user.profilePhoto || firebaseUser.photoURL || "",
            preferredLanguage: user.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
            birthDate: "",
            birthTime: "",
            birthCity: loginBirthCity.trim() || "",
            isUnknownTime: false,
            isPremium: true,
            hasCreatedMap: false,
            email: emailLower,
            scorePoints: 0,
            emailVerified: true, 
            isEmailVerified: true,
            photoURL: firebaseUser.photoURL || "",
            provider: 'facebook',
            trialUsed: blockTrial ? true : false,
            trialStartDate: new Date().toISOString(),
            trialEndDate: blockTrial 
              ? new Date(Date.now() - 1000).toISOString()
              : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            deviceId: checkStatus.deviceId,
            deviceFingerprint: checkStatus.fingerprint,
            lastLoginAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isSubscribed: false,
            subscriptionEndDate: ""
          };

          await saveProfileToDatabase(emailLower, targetUser as any);
          if (blockTrial) {
            triggerGlobalNotification("Aviso de Período de Teste", "Este dispositivo já utilizou o período gratuito anteriormente.", "alert");
          } else {
            triggerGlobalNotification("Portal Órbita", "Sintonizado via Facebook! Complete seus dados celestes para gerar seu mapa.", "success");
          }
        }

        localStorage.setItem("orbi_logged_email", emailLower);
        localStorage.setItem("orbi_user_profile", JSON.stringify(targetUser));
        setLoggedEmail(emailLower);
        setUser(targetUser);
        setIsLoggedIn(true);

        if (loginBirthCity.trim() && targetUser.birthDate) {
          triggerGenerateMainMap({
            name: targetUser.name,
            birthDate: targetUser.birthDate,
            birthTime: targetUser.birthTime,
            birthCity: loginBirthCity.trim(),
            isUnknownTime: targetUser.isUnknownTime
          });
        }
      } else if (firebaseUser) {
        const emailLower = `facebook_${firebaseUser.uid}@starportal.com`;
        const targetUser = {
          name: firebaseUser.displayName || "Viajante Estelar",
          birthDate: "",
          birthTime: "",
          birthCity: "",
          isUnknownTime: false,
          isPremium: true,
          hasCreatedMap: false,
          email: emailLower,
          scorePoints: 0,
          isEmailVerified: true,
          emailVerified: true
        };
        await saveProfileToDatabase(emailLower, targetUser as any);
        localStorage.setItem("orbi_logged_email", emailLower);
        setLoggedEmail(emailLower);
        setUser(targetUser);
        setIsLoggedIn(true);
        triggerGlobalNotification("Portal Órbita", "Conexão estabelecida via Facebook!", "success");
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('unauthorized-domain') || err.code?.includes('unauthorized-domain') || String(err).includes('unauthorized-domain')) {
        setUnauthorizedDomainError(true);
      } else if (err.message?.includes('popup-closed-by-user') || err.code?.includes('popup-closed-by-user') || String(err).includes('popup-closed-by-user') ||
                 err.message?.includes('cancelled-popup-request') || err.code?.includes('cancelled-popup-request') || String(err).includes('cancelled-popup-request')) {
        setPopupClosedError(true);
      } else {
        triggerGlobalNotification("Erro de Autenticação", err.message || "Não foi possível fazer login com Facebook.", "alert");
      }
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      triggerGlobalNotification("Erro de Solicitação", "Por favor, digite seu e-mail.", "alert");
      return;
    }
    setIsSendingReset(true);
    try {
      await sendPasswordResetFirebase(forgotEmail);
      triggerGlobalNotification("E-mail Enviado", "Instruções de recuperação de senha enviadas para seu e-mail.", "success");
      setAuthTab('login');
    } catch (err: any) {
      console.error(err);
      triggerGlobalNotification("Falha no Envio", err.message || "Erro ao solicitar recuperação de senha.", "alert");
    } finally {
      setIsSendingReset(false);
    }
  };

  // Submit handlers for account creation / login
  const handleRegisterAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    manualAuthActionRef.current = true;
    try {
      if (!authEmail || !authPassword) {
        triggerGlobalNotification("Erro de Cadastro", "Por favor, preencha o E-mail e a Senha de acesso.", "alert");
        return;
      }
      const mailLower = authEmail.trim().toLowerCase();

      // 1. Try Firebase Auth Register First & Throw if failed
      let firebaseUser: any = null;
      try {
        firebaseUser = await registerWithEmailFirebase(mailLower, authPassword);
        console.log("[Auth] Firebase native register transacted.", firebaseUser?.uid);
      } catch (fbErr: any) {
        console.error("[Auth] Firebase auth register deferred.", fbErr);
        const isEmailInUse = 
          fbErr.code === "auth/email-already-in-use" || 
          fbErr.message?.includes("email-already-in-use") || 
          String(fbErr).includes("email-already-in-use");

        if (isEmailInUse) {
          triggerGlobalNotification(
            "Conta Existente", 
            "Este e-mail já possui uma conta cadastrada. Redirecionando para a tela de login...", 
            "info"
          );
          setAuthTab('login');
          return;
        }

        const errorMsg = fbErr.message || "Erro no cadastro. Verifique a senha (mínimo 6 caracteres).";
        triggerGlobalNotification("Erro de Cadastro", errorMsg, "alert");
        if (fbErr.message?.includes('operation-not-allowed') || fbErr.code?.includes('operation-not-allowed') || String(fbErr).includes('operation-not-allowed')) {
          setOperationNotAllowedError(true);
        }
        return; // Stop flow immediately on Auth failure!
      }

      // 2. Perform anti-fraud device check
      let checkStatus = { isAllowed: true, fingerprint: '', deviceId: '' };
      try {
        checkStatus = await checkDeviceTrial(mailLower);
      } catch (err) {
        console.warn("[Anti Fraud] Couldn't assert device metrics:", err);
      }
      const blockTrial = !checkStatus.isAllowed;

      const rawNameToUse = createMainName || user.name || "Viajante Estelar";
      const finalNameToUse = (rawNameToUse === "Viajante Estelar") ? "Buscador" : rawNameToUse;
      const birthDateToUse = createMainDate || user.birthDate || "";
      const birthTimeToUse = timeIsUnknown ? "12:00" : (createMainTime || user.birthTime || "12:00");
      const birthCityToUse = createMainCity || user.birthCity || "";
      const isUnknownTimeToUse = timeIsUnknown || user.isUnknownTime || false;
      const hasProvidedData = !!birthDateToUse && !!birthCityToUse;

      // 3. Setup user object
      const newUserProfile: UserProfile = {
        userId: firebaseUser ? firebaseUser.uid : "",
        uid: firebaseUser ? firebaseUser.uid : "",
        name: finalNameToUse,
        displayName: user.displayName || finalNameToUse,
        birthName: user.birthName || finalNameToUse,
        profileName: user.profileName || finalNameToUse,
        avatarId: user.avatarId || user.profilePhoto || "",
        profilePhoto: user.avatarId || user.profilePhoto || "",
        preferredLanguage: user.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
        birthDate: birthDateToUse,
        birthTime: birthTimeToUse,
        birthCity: birthCityToUse,
        isUnknownTime: isUnknownTimeToUse,
        isPremium: true,
        hasCreatedMap: hasProvidedData,
        email: mailLower,
        scorePoints: user.scorePoints || 0,
        latitude: createMainCoords?.latitude || user.latitude,
        longitude: createMainCoords?.longitude || user.longitude,
        createdAt: user.createdAt || new Date().toISOString(),
        isSubscribed: user.isSubscribed || false,
        subscriptionEndDate: user.subscriptionEndDate || "",
        isEmailVerified: true,
        emailVerified: true,
        provider: 'password',
        trialUsed: blockTrial ? true : (user.trialUsed || false),
        trialStartDate: user.trialStartDate || new Date().toISOString(),
        trialEndDate: blockTrial 
          ? new Date(Date.now() - 1000).toISOString()
          : (user.trialEndDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()),
        deviceId: checkStatus.deviceId || user.deviceId,
        deviceFingerprint: checkStatus.fingerprint || user.deviceFingerprint,
        lastLoginAt: new Date().toISOString()
      };

      // 4. Send official verification link natively
      try {
        await sendNativeEmailVerification();
        console.log("[Auth] Native email verification link dispatched.");
      } catch (err: any) {
        console.warn("[Auth] Failed to dispatch native verification link on signup:", err);
      }

      // 5. Store in Firestore DB
      try {
        await saveProfileToDatabase(mailLower, newUserProfile as any);
      } catch (saveErr) {
        console.error("[Auth] Saved profile to database failed on registration:", saveErr);
      }

      // Modern local accounts cache sync
      const accounts = getRegisteredAccounts();
      const existingIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === mailLower);
      const newAccount = {
        email: mailLower,
        password: authPassword,
        user: newUserProfile,
        mapData: null,
        numerology: null,
        extraMaps: []
      };
      if (existingIdx !== -1) {
        accounts[existingIdx] = newAccount;
      } else {
        accounts.push(newAccount);
      }
      saveRegisteredAccounts(accounts);

      localStorage.setItem("orbi_logged_email", mailLower);
      localStorage.setItem("orbi_user_profile", JSON.stringify(newUserProfile));
      
      setLoggedEmail(mailLower);
      setUser(newUserProfile);
      setExtraMaps([]);
      setIsLoggedIn(true);

      triggerGlobalNotification("Portal Órbita", "Conta criada com sucesso! Enviamos um link de confirmação para o seu e-mail.", "success");

      await migrateLocalDataToCloud(mailLower, firebaseUser?.uid || "", newUserProfile);
    } finally {
      setTimeout(() => {
        manualAuthActionRef.current = false;
      }, 2000);
    }
  };

  const handleLoginAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    manualAuthActionRef.current = true;
    try {
      if (!authEmail || !authPassword) {
        triggerGlobalNotification("Erro de Login", "Por favor, digite seu E-mail e Senha de acesso.", "alert");
        return;
      }
      const mailLower = authEmail.trim().toLowerCase();

      // 1. Try Firebase Authentication First & Stop on fail
      let firebaseUser: any = null;
      try {
        firebaseUser = await loginWithEmailFirebase(mailLower, authPassword);
        console.log("[Auth] Firebase native login transacted successfully.", firebaseUser?.uid);
      } catch (fbErr: any) {
        console.error("[Auth] Firebase authentication failed:", fbErr);
        const errorMsg = fbErr.message || "E-mail ou senha incorretos. Tente novamente ou cadastre-se.";
        triggerGlobalNotification("Erro de Login", errorMsg, "alert");
        if (fbErr.message?.includes('operation-not-allowed') || fbErr.code?.includes('operation-not-allowed') || String(fbErr).includes('operation-not-allowed')) {
          setOperationNotAllowedError(true);
        }
        return; // Stop flow immediately!
      }

      // 2. Load latest profile from Firestore DB
      let cloudUser: any = null;
      try {
        cloudUser = await loadProfileFromDatabase(mailLower);
      } catch (err) {
        console.warn("[Auth] Failed to retrieve cloud profile on login:", err);
      }

      // Get current verification states natively
      const authInstance = getFirebaseAuth();
      const nativeVerified = authInstance?.currentUser?.emailVerified || false;

      // Check device trial anti-fraud rules
      let checkStatus = { isAllowed: true, fingerprint: '', deviceId: '' };
      try {
        checkStatus = await checkDeviceTrial(mailLower);
      } catch (err) {
        console.warn("[Anti Fraud] Check trial status failed:", err);
      }

      let targetUser: UserProfile;

      if (cloudUser) {
        const finalBirthCity = loginBirthCity.trim() || cloudUser.birthCity || "";
        const isVerified = nativeVerified || cloudUser.isEmailVerified || cloudUser.emailVerified || false;
        const forceTrialUsed = (!checkStatus.isAllowed && !cloudUser.isSubscribed);

        const rawName = cloudUser.displayName || cloudUser.profileName || cloudUser.birthName || cloudUser.name || "Viajante Estelar";
        const finalName = (rawName === "Viajante Estelar") ? "Buscador" : rawName;

        targetUser = {
          ...cloudUser,
          userId: firebaseUser ? firebaseUser.uid : (cloudUser.userId || cloudUser.uid || ""),
          uid: firebaseUser ? firebaseUser.uid : (cloudUser.userId || cloudUser.uid || ""),
          name: finalName,
          displayName: cloudUser.displayName || finalName,
          birthName: cloudUser.birthName || finalName,
          profileName: cloudUser.profileName || finalName,
          avatarId: cloudUser.avatarId || cloudUser.profilePhoto || "",
          profilePhoto: cloudUser.avatarId || cloudUser.profilePhoto || "",
          preferredLanguage: cloudUser.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
          birthDate: cloudUser.birthDate || "",
          birthTime: cloudUser.birthTime || "",
          birthCity: finalBirthCity,
          isUnknownTime: cloudUser.isUnknownTime ?? false,
          isPremium: cloudUser.isPremium ?? true,
          hasCreatedMap: cloudUser.hasCreatedMap ?? (cloudUser.birthDate ? true : false),
          email: mailLower,
          scorePoints: cloudUser.scorePoints ?? 0,
          emailVerified: isVerified,
          isEmailVerified: isVerified,
          provider: 'password',
          trialUsed: forceTrialUsed ? true : (cloudUser.trialUsed ?? false),
          trialStartDate: cloudUser.trialStartDate || new Date().toISOString(),
          trialEndDate: cloudUser.trialEndDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          deviceId: checkStatus.deviceId,
          deviceFingerprint: checkStatus.fingerprint,
          lastLoginAt: new Date().toISOString(),
          isSubscribed: cloudUser.isSubscribed ?? false,
          subscriptionEndDate: cloudUser.subscriptionEndDate || "",
          currentChartId: cloudUser.currentChartId || "",
          mainMapChangesCount: cloudUser.mainMapChangesCount ?? 0,
          latitude: cloudUser.latitude,
          longitude: cloudUser.longitude,
          createdAt: cloudUser.createdAt || ""
        };

        if (loginBirthCity.trim() && loginBirthCity.trim() !== cloudUser.birthCity) {
          try {
            await saveProfileToDatabase(mailLower, targetUser as any);
          } catch (err) { console.warn(err); }
        }
      } else {
        // Fallback create profile if missing in Firestore but logged in
        const forceTrialUsed = !checkStatus.isAllowed;
        
        const rawName = user.displayName || user.profileName || user.birthName || user.name || "Viajante Estelar";
        const finalName = (rawName === "Viajante Estelar") ? "Buscador" : rawName;

        targetUser = {
          userId: firebaseUser ? firebaseUser.uid : "",
          uid: firebaseUser ? firebaseUser.uid : "",
          name: finalName,
          displayName: user.displayName || finalName,
          birthName: user.birthName || finalName,
          profileName: user.profileName || finalName,
          avatarId: user.avatarId || user.profilePhoto || "",
          profilePhoto: user.avatarId || user.profilePhoto || "",
          preferredLanguage: user.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
          birthDate: "",
          birthTime: "",
          birthCity: loginBirthCity.trim() || "",
          isUnknownTime: false,
          isPremium: true,
          hasCreatedMap: false,
          email: mailLower,
          scorePoints: 0,
          emailVerified: nativeVerified,
          isEmailVerified: nativeVerified,
          provider: 'password',
          trialUsed: forceTrialUsed ? true : false,
          trialStartDate: new Date().toISOString(),
          trialEndDate: forceTrialUsed 
            ? new Date(Date.now() - 1000).toISOString()
            : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          deviceId: checkStatus.deviceId,
          deviceFingerprint: checkStatus.fingerprint,
          lastLoginAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isSubscribed: false,
          subscriptionEndDate: ""
        };
        try {
          await saveProfileToDatabase(mailLower, targetUser as any);
        } catch (err) { console.warn(err); }
      }

      // Update local list for seamless offline recovery or caches
      const accounts = getRegisteredAccounts();
      const existingIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === mailLower);
      const existingAccount = existingIdx !== -1 ? accounts[existingIdx] : null;
      const newAccount = {
        email: mailLower,
        password: authPassword,
        user: targetUser,
        mapData: existingAccount?.mapData || null,
        numerology: existingAccount?.numerology || null,
        extraMaps: existingAccount?.extraMaps || []
      };
      if (existingIdx !== -1) {
        accounts[existingIdx] = newAccount;
      } else {
        accounts.push(newAccount);
      }
      saveRegisteredAccounts(accounts);

      localStorage.setItem("orbi_logged_email", mailLower);
      localStorage.setItem("orbi_user_profile", JSON.stringify(targetUser));
      
      setLoggedEmail(mailLower);
      setUser(targetUser);
      setIsLoggedIn(true);

      if (!targetUser.isEmailVerified) {
        // Prompt user to verify using Firebase native email verifier overlay
        triggerGlobalNotification("Portal Órbita", "Sessão iniciada, mas o link de e-mail ainda não foi confirmado.", "alert");
      }

      await migrateLocalDataToCloud(mailLower, firebaseUser?.uid || targetUser.userId || "", targetUser);
    } finally {
      setTimeout(() => {
        manualAuthActionRef.current = false;
      }, 2000);
    }
  };

  // Form states for Create My Map and Extra Maps
  const [createMainName, setCreateMainName] = useState(user.hasCreatedMap ? user.name : "");
  const [createMainDate, setCreateMainDate] = useState(user.hasCreatedMap ? user.birthDate : "");
  const [createMainTime, setCreateMainTime] = useState(user.hasCreatedMap ? (user.birthTime || "") : "");
  const [createMainCity, setCreateMainCity] = useState(user.hasCreatedMap ? (user.birthCity || "") : "");
  const [createMainCoords, setCreateMainCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [extraCityCoords, setExtraCityCoords] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    setCreateMainName(user.hasCreatedMap ? user.name : "");
    setCreateMainDate(user.hasCreatedMap ? user.birthDate : "");
    setCreateMainTime(user.hasCreatedMap ? (user.birthTime || "") : "");
    setCreateMainCity(user.hasCreatedMap ? (user.birthCity || "") : "");
  }, [user]);

  const [extraName, setExtraName] = useState('');
  const [extraDate, setExtraDate] = useState('');
  const [extraTime, setExtraTime] = useState('');
  const [extraCity, setExtraCity] = useState('');

  // Handle viewing an extra map by fetching its report
  const triggerGenerateExtraMap = async (extraDetails: any) => {
    setIsLoadingExtraMap(true);
    try {
      const response = await fetch("/api/astrology/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: extraDetails.name,
          birthDate: extraDetails.birthDate,
          birthTime: extraDetails.birthTime || "12:00",
          birthCity: extraDetails.birthCity || "Desconhecida",
          isUnknownTime: false,
          latitude: extraDetails.latitude,
          longitude: extraDetails.longitude
        })
      });
      const data = await response.json();
      if (data.map) {
        setActiveExtraMapData(data.map);
      }
      if (data.numerology) {
        setActiveExtraMapNumerology(data.numerology);
      }
      setActiveExtraMapName(extraDetails.name);
      setActiveExtraMapBirthDate(extraDetails.birthDate);
    } catch (err) {
      console.error("Extra map calculation error:", err);
    } finally {
      setIsLoadingExtraMap(false);
    }
  };

  // Interactive Content states
  const [mapData, setMapData] = useState<AstrologyMap | null>(() => {
    try {
      const saved = localStorage.getItem("orbi_map_data");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [numerology, setNumerology] = useState<NumerologyCycle | null>(() => {
    try {
      const saved = localStorage.getItem("orbi_numerology_data");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (mapData) {
      localStorage.setItem("orbi_map_data", JSON.stringify(mapData));
    }
  }, [mapData]);

  useEffect(() => {
    if (numerology) {
      localStorage.setItem("orbi_numerology_data", JSON.stringify(numerology));
    }
  }, [numerology]);

  useEffect(() => {
    if (isLoggedIn && loggedEmail) {
      localStorage.setItem("orbi_user_profile", JSON.stringify(user));
      const accounts = getRegisteredAccounts();
      const index = accounts.findIndex((a: any) => a.email.toLowerCase() === loggedEmail.toLowerCase());
      if (index !== -1) {
        accounts[index].user = user;
        accounts[index].mapData = mapData;
        accounts[index].numerology = numerology;
        accounts[index].extraMaps = extraMaps;
        saveRegisteredAccounts(accounts);
      }
    }
  }, [user, mapData, numerology, extraMaps, isLoggedIn, loggedEmail]);

  // Keep scorePoints reactively synced with user.scorePoints and database in real-time
  useEffect(() => {
    if (isLoggedIn && loggedEmail) {
      const currentPts = user.stellarPoints !== undefined ? user.stellarPoints : (user.scorePoints ?? 0);
      if (currentPts !== scorePoints) {
        const nextUser = { ...user, scorePoints, stellarPoints: scorePoints };
        setUser(nextUser);
        saveProfileToDatabase(loggedEmail, nextUser).catch(console.error);
      }
    }
  }, [scorePoints, isLoggedIn, loggedEmail]);

  useEffect(() => {
    if (user) {
      const userPts = user.stellarPoints !== undefined ? user.stellarPoints : user.scorePoints;
      if (userPts !== undefined && userPts !== scorePoints) {
        setScorePoints(userPts);
      }
    }
  }, [user?.scorePoints, user?.stellarPoints]);

  // Firebase Real-time listeners hook
  useEffect(() => {
    if (!isAuthInitialized) return;
    if (!isLoggedIn || !loggedEmail) return;

    // 1. User Profile Real-time Sync
    const unsubProfile = subscribeToUserProfile(loggedEmail, (updatedProfile) => {
      if (updatedProfile) {
        setUser(prev => {
          const rawName = updatedProfile.name || updatedProfile.displayName || updatedProfile.profileName || updatedProfile.birthName || prev.name;
          const finalName = (rawName === "Viajante Estelar") ? "Buscador" : rawName;
          
          if (updatedProfile.preferredLanguage && updatedProfile.preferredLanguage !== lang) {
            setLangState(updatedProfile.preferredLanguage as any);
            localStorage.setItem('orbi_preferred_language', updatedProfile.preferredLanguage);
          }

          return {
            ...prev,
            name: finalName,
            displayName: updatedProfile.displayName || finalName,
            birthName: updatedProfile.birthName || finalName,
            profileName: updatedProfile.profileName || finalName,
            birthDate: updatedProfile.birthDate || prev.birthDate,
            birthTime: updatedProfile.birthTime || prev.birthTime || "",
            birthCity: updatedProfile.birthCity || prev.birthCity,
            profilePhoto: updatedProfile.avatarId || updatedProfile.profilePhoto || prev.profilePhoto,
            avatarId: updatedProfile.avatarId || updatedProfile.profilePhoto || prev.avatarId,
            preferredLanguage: updatedProfile.preferredLanguage || prev.preferredLanguage || "pt",
            isPremium: updatedProfile.isPremium ?? prev.isPremium,
            hasCreatedMap: updatedProfile.hasCreatedMap ?? (updatedProfile.birthDate ? true : prev.hasCreatedMap),
            createdAt: updatedProfile.createdAt || prev.createdAt,
            isSubscribed: updatedProfile.isSubscribed ?? prev.isSubscribed,
            subscriptionEndDate: updatedProfile.subscriptionEndDate || prev.subscriptionEndDate,
            scorePoints: updatedProfile.stellarPoints !== undefined ? updatedProfile.stellarPoints : (updatedProfile.scorePoints !== undefined ? updatedProfile.scorePoints : prev.scorePoints),
            stellarPoints: updatedProfile.stellarPoints !== undefined ? updatedProfile.stellarPoints : (updatedProfile.scorePoints !== undefined ? updatedProfile.scorePoints : prev.stellarPoints)
          };
        });
      }
    }, (error) => {
      setFirebaseErrors(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: "Falha de Sincronização de Perfil",
          details: error.message
        },
        ...prev
      ].slice(0, 10));
    });

    // 2. Extra Maps Real-time Sync
    const unsubExtraMaps = subscribeToExtraMaps(loggedEmail, (updatedMaps) => {
      if (updatedMaps) {
        const formattedMaps = updatedMaps.map(m => ({
          id: m.id,
          name: m.label,
          birthDate: m.birthDate,
          birthTime: m.birthTime || "",
          birthCity: m.birthCity
        }));
        setExtraMaps(formattedMaps);
      }
    }, (error) => {
      setFirebaseErrors(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: "Falha de Sincronização de Mapas Extras",
          details: error.message
        },
        ...prev
      ].slice(0, 10));
    });

    // 3. Dreams History Real-time Sync
    const unsubDreams = subscribeToDreams(loggedEmail, (updatedDreams) => {
      if (updatedDreams) {
        const formattedDreams: OracleDreamEntry[] = updatedDreams.map(d => {
          let parsedInterpret = null;
          try {
            parsedInterpret = d.interpretation ? JSON.parse(d.interpretation) : null;
          } catch {
            // Keep it simple
          }
          return {
            id: d.id,
            date: d.date,
            time: d.time || "",
            title: d.title || parsedInterpret?.title || d.text.slice(0, 30) + "...",
            language: d.language || "pt",
            description: d.text,
            interpretation: parsedInterpret
          };
        });
        setDreamsHistory(formattedDreams);
      }
    }, (error) => {
      setFirebaseErrors(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: "Falha de Sincronização de Sonhos",
          details: error.message
        },
        ...prev
      ].slice(0, 10));
    });

    return () => {
      unsubProfile();
      unsubExtraMaps();
      unsubDreams();
    };
  }, [isLoggedIn, loggedEmail, isAuthInitialized, firebaseUid]);

  // Stripe Success / Redirect processing hook
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const stripeSuccess = params.get('stripe_success');
    const sessionId = params.get('session_id');

    if (stripeSuccess === 'true' && sessionId) {
      setVerifyingStripe(true);
      
      const queryEmail = params.get('email') || loggedEmail || localStorage.getItem("orbi_logged_email") || "";
      const planId = params.get('plan_id') || 'premium';

      const verifyStripePayment = async () => {
        try {
          const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}&email=${encodeURIComponent(queryEmail)}&plan_id=${planId}`);
          if (!response.ok) {
            throw new Error('Falha na resposta de verificação do Stripe');
          }
          const check = await response.json();
          if (check.success) {
            const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
            const futureDate = new Date(Date.now() + oneMonthMs).toISOString();

            const cachedUserProfile = localStorage.getItem("orbi_user_profile");
            let baseUser = user;
            if ((!baseUser || !baseUser.email || !baseUser.hasCreatedMap) && cachedUserProfile) {
              try {
                const parsed = JSON.parse(cachedUserProfile);
                if (parsed && parsed.email) {
                  baseUser = { ...parsed, ...baseUser };
                }
              } catch {}
            }

            const nextUser = {
              ...baseUser,
              isSubscribed: true,
              isPremium: true,
              subscriptionEndDate: futureDate
            };

            setUser(nextUser);
            localStorage.setItem("orbi_user_profile", JSON.stringify(nextUser));
            
            const targetMail = check.email || queryEmail || nextUser.email;
            if (targetMail) {
              const cleanMail = targetMail.toLowerCase().trim();
              await saveProfileToDatabase(cleanMail, nextUser).catch(console.error);
              
              // Also sync registered accounts list immediately
              const accounts = getRegisteredAccounts();
              const existingIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === cleanMail);
              if (existingIdx !== -1) {
                accounts[existingIdx].user = nextUser;
                saveRegisteredAccounts(accounts);
              }
            }

            triggerGlobalNotification(
              currentLang === 'pt' ? "Assinatura Ativa!" : "Subscription Active!",
              currentLang === 'pt' ? "Sua assinatura premium da Stripe está sintonizada." : "Your premium Stripe subscription is active.",
              "success"
            );
          } else {
            alert(currentLang === 'pt' 
              ? 'Confirmação do Stripe ainda pendente. Por favor, aguarde.' 
              : 'Stripe payment confirmation pending.');
          }
        } catch (error) {
          console.error("Error during Stripe verification redirect:", error);
        } finally {
          setVerifyingStripe(false);
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
      };

      const t = setTimeout(() => {
        verifyStripePayment();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [isLoggedIn, loggedEmail, user]);

  const profileLoadedRef = useRef(false);
  const manualAuthActionRef = useRef(false);

  // Firebase Auth session observer hook
  useEffect(() => {
    const unsubAuth = subscribeToAuthChanges((firebaseUser) => {
      setIsAuthInitialized(true);
      if (firebaseUser && firebaseUser.email) {
        setFirebaseUid(firebaseUser.uid);
        const emailLower = firebaseUser.email.toLowerCase().trim();
        console.log("[Auth Observer] Usuário do Firebase autenticado:", emailLower);
        
        const isEmailDifferent = emailLower !== loggedEmail.toLowerCase().trim();
        if (isEmailDifferent) {
          setLoggedEmail(emailLower);
          setIsLoggedIn(true);
          localStorage.setItem("orbi_logged_email", emailLower);
        }

        if (manualAuthActionRef.current) {
          console.log("[Auth Observer] Skipping automatic profile loading due to active manual auth action.");
          return;
        }

        // Always load on first detection or email change
        if (isEmailDifferent || !profileLoadedRef.current) {
          profileLoadedRef.current = true;
          loadProfileFromDatabase(emailLower).then(async (cloudProfile) => {
            const localProfileStr = localStorage.getItem("orbi_user_profile");
            let localProfile: any = null;
            try {
              if (localProfileStr) localProfile = JSON.parse(localProfileStr);
            } catch {}

            const hasLocalMap = localProfile && localProfile.birthDate && localProfile.birthCity;
            const hasCloudMap = cloudProfile && cloudProfile.birthDate && cloudProfile.birthCity;

            if (hasLocalMap && !hasCloudMap) {
              console.log("[Auth Observer] Guest map found, but Cloud is empty. Migrating...");
              const baseProfile = cloudProfile || {
                userId: firebaseUser.uid,
                email: emailLower,
                name: localProfile.name || firebaseUser.displayName || "Viajante Estelar",
                createdAt: new Date().toISOString()
              };
              await migrateLocalDataToCloud(emailLower, firebaseUser.uid, baseProfile);
            } else if (cloudProfile) {
              let rawName = cloudProfile.displayName || cloudProfile.profileName || cloudProfile.birthName || cloudProfile.name || firebaseUser.displayName || "";
              if (!rawName.trim() || rawName === "Viajante Estelar") {
                const emailPrefix = emailLower.split("@")[0];
                rawName = emailPrefix
                  .replace(/[\._\-]/g, " ")
                  .replace(/\b\w/g, l => l.toUpperCase());
              }
              const updatedUser: UserProfile = {
                userId: cloudProfile.userId || firebaseUser.uid || "",
                uid: cloudProfile.uid || firebaseUser.uid || "",
                name: rawName || "Buscador",
                displayName: cloudProfile.displayName || rawName || "Buscador",
                birthName: cloudProfile.birthName || rawName || "Buscador",
                profileName: cloudProfile.profileName || rawName || "Buscador",
                avatarId: cloudProfile.avatarId || cloudProfile.profilePhoto || "",
                preferredLanguage: cloudProfile.preferredLanguage || localStorage.getItem('orbi_preferred_language') || "pt",
                birthDate: cloudProfile.birthDate || "",
                birthTime: cloudProfile.birthTime || "",
                birthCity: cloudProfile.birthCity || "",
                isUnknownTime: cloudProfile.isUnknownTime ?? false,
                isPremium: cloudProfile.isPremium ?? true,
                hasCreatedMap: cloudProfile.hasCreatedMap ?? (cloudProfile.birthDate ? true : false),
                email: emailLower,
                scorePoints: cloudProfile.scorePoints ?? 0,
                profilePhoto: cloudProfile.avatarId || cloudProfile.profilePhoto || firebaseUser.photoURL || "",
                isSubscribed: cloudProfile.isSubscribed ?? false,
                subscriptionEndDate: cloudProfile.subscriptionEndDate || "",
                emailVerified: cloudProfile.emailVerified ?? cloudProfile.isEmailVerified ?? firebaseUser.emailVerified,
                isEmailVerified: cloudProfile.emailVerified ?? cloudProfile.isEmailVerified ?? firebaseUser.emailVerified,
                currentChartId: cloudProfile.currentChartId || "",
                mainMapChangesCount: cloudProfile.mainMapChangesCount ?? 0,
                trialUsed: cloudProfile.trialUsed ?? false,
                trialStartDate: cloudProfile.trialStartDate || "",
                trialEndDate: cloudProfile.trialEndDate || "",
                deviceId: cloudProfile.deviceId || "",
                deviceFingerprint: cloudProfile.deviceFingerprint || "",
                latitude: cloudProfile.latitude,
                longitude: cloudProfile.longitude,
                createdAt: cloudProfile.createdAt || ""
              };
              
              if (updatedUser.preferredLanguage && updatedUser.preferredLanguage !== lang) {
                setLangState(updatedUser.preferredLanguage as any);
                localStorage.setItem('orbi_preferred_language', updatedUser.preferredLanguage);
              }

              setUser(updatedUser);
              localStorage.setItem("orbi_user_profile", JSON.stringify(updatedUser));

              // Sync loaded user to registered accounts local storage
              const accounts = getRegisteredAccounts();
              const existingIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === emailLower);
              if (existingIdx !== -1) {
                accounts[existingIdx].user = updatedUser;
              } else {
                accounts.push({
                  email: emailLower,
                  user: updatedUser,
                  mapData: null,
                  numerology: null,
                  extraMaps: []
                });
              }
              saveRegisteredAccounts(accounts);

              if (updatedUser.hasCreatedMap) {
                setMapSubTab('meu_mapa');
                setActiveTab('mapa');
                triggerGenerateMainMap(updatedUser);
              } else {
                setMapSubTab('criar_meu_mapa');
                setActiveTab('mapa');
              }
            } else {
              const defaultProfile: UserProfile = {
                userId: firebaseUser.uid,
                email: emailLower,
                name: firebaseUser.displayName || "Viajante Estelar",
                birthDate: "",
                birthTime: "",
                birthCity: "",
                isUnknownTime: false,
                isPremium: true,
                hasCreatedMap: false,
                createdAt: new Date().toISOString()
              };
              setUser(defaultProfile);
              localStorage.setItem("orbi_user_profile", JSON.stringify(defaultProfile));
              setMapSubTab('criar_meu_mapa');
              setActiveTab('mapa');
            }
          }).catch((err) => {
            console.warn("[Auth Observer] Failed to load cloud profile:", err);
            // Fallback load local map if we have local user profile
            const activeProfile = localStorage.getItem("orbi_user_profile");
            if (activeProfile) {
              try {
                const parsed = JSON.parse(activeProfile);
                if (parsed && parsed.hasCreatedMap) {
                  setMapSubTab('meu_mapa');
                  setActiveTab('mapa');
                  triggerGenerateMainMap(parsed);
                } else {
                  setMapSubTab('criar_meu_mapa');
                  setActiveTab('mapa');
                }
              } catch {
                setMapSubTab('criar_meu_mapa');
                setActiveTab('mapa');
              }
            } else {
              setMapSubTab('criar_meu_mapa');
              setActiveTab('mapa');
            }
          });
        }
      } else {
        setFirebaseUid("");
      }
    });

    return unsubAuth;
  }, [loggedEmail]);

  const [isLoadingMain, setIsLoadingMain] = useState<boolean>(false);

  // Sign profiles state for Landing page & Constelações
  const [selectedZodiacSign, setSelectedZodiacSign] = useState<string>("Aquário");

  // Bottom-left bubble notifications list (Simulated dynamic social proof notifications matching PDF "+21.608.314 mapas criados")
  const [userNotificationQueue, setUserNotificationQueue] = useState<string[]>([]);
  
  const pushRealNotification = (message: string) => {
    setUserNotificationQueue(prev => [message, ...prev]);
  };

  const [bubbleNotification, setBubbleNotification] = useState<string>(
    "Carolina (Rio de Janeiro) acabou de gerar seu Mapa Astral Completo Premium!"
  );

  // Oráculo State
  const [oracleQuestion, setOracleQuestion] = useState<string>('');
  const [oracleResponse, setOracleResponse] = useState<DailyOracleResponse | null>(null);
  const [isQueryingOracle, setIsQueryingOracle] = useState<boolean>(false);
  const [hasQueriedOracleToday, setHasQueriedOracleToday] = useState<boolean>(false);

  // Oráculo dos Sonhos State (loads dynamically per user from localStorage, starting fully clean)
  const [dreamsHistory, setDreamsHistory] = useState<OracleDreamEntry[]>(() => {
    try {
      const saved = localStorage.getItem("star_map_dreams_v2");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("star_map_dreams_v2", JSON.stringify(dreamsHistory));
    } catch (e) {
      console.error("Local storage save error", e);
    }
  }, [dreamsHistory]);
  const [newDreamDesc, setNewDreamDesc] = useState<string>('');
  const [isInterpretingDream, setIsInterpretingDream] = useState<boolean>(false);
  const [selectedDreamDisplay, setSelectedDreamDisplay] = useState<OracleDreamEntry | null>(null);
  const [dreamSearchKey, setDreamSearchKey] = useState<string>('');
  const [shareToastShown, setShareToastShown] = useState<boolean>(false);

  useEffect(() => {
    if (dreamsHistory.length > 0 && !selectedDreamDisplay) {
      setSelectedDreamDisplay(dreamsHistory[0]);
    }
  }, [dreamsHistory]);

  const handleShareDreamInterpretation = (dream: OracleDreamEntry) => {
    if (!dream.interpretation) return;
    const shareText = `🔮 *Oráculo dos Sonhos - Antigravity Build* 🔮\n\n*Sonho:* "${dream.description.slice(0, 100)}..."\n*Revelação:* ${dream.interpretation.title}\n\n*Significado:* ${dream.interpretation.mainMeaning}\n\n*Conselho:* ${dream.interpretation.oracleAdvice || ""}\n\n*Mensagem do Universo:* "${dream.interpretation.universeMessage}"`;
    navigator.clipboard.writeText(shareText).catch(() => {});
    setShareToastShown(true);
    setTimeout(() => {
      setShareToastShown(false);
    }, 3000);
  };

  // AI Counselor (Orbia Chat) State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcomeMsg",
      sender: "assistant",
      text: "Saudações, Fabricio. Eu sou Orbia, sua Conselheira Astrológica e Terapeuta Pessoal de Inteligência Celestial. Nascido com o Sol em Aquário e Ascendente em Sagitário, você traz em sua essência um idealismo ardente e uma reverência inata pela liberdade. Como posso te orientar em seu caminho em 2026?",
      timestamp: "02:37"
    }
  ]);
  const [currentChatInput, setCurrentChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  // Tarot state
  const [tarotRecord, setTarotRecord] = useState<TarotDrawResult | null>(null);
  const [isDrawingTarot, setIsDrawingTarot] = useState<boolean>(false);
  const [tarotDrawnToday, setTarotDrawnToday] = useState<boolean>(false);

  // Daily Radar and missions (gamified) state
  const [dailyRadar, setDailyRadar] = useState<DailyRadar>({
    date: new Date().toISOString().split('T')[0],
    energyOfDay: "Intuição Harmoniosa & Foco Singular",
    dispositionLevel: 88,
    bestTimeProductivity: "10:00 - 12:30",
    bestTimeRelationships: "18:00 - 20:30",
    bestTimeStudies: "14:15 - 16:45",
    bestTimeOrganization: "08:30 - 09:45"
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const cacheKey = `orbi_missions_default_${todayStr}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Sync / Load Daily Missions with cached fallback or live Firestore retrieval
  useEffect(() => {
    let active = true;
    const todayStr = new Date().toISOString().split('T')[0];
    const email = user?.email || loggedEmail;
    const cacheKey = `orbi_missions_${email || "default"}_${todayStr}`;
    
    async function loadMissions() {
      // 1. Try local cache key first for sub-millisecond, instant response
      const savedLocal = localStorage.getItem(cacheKey);
      if (savedLocal) {
        try {
          if (active) setDailyMissions(JSON.parse(savedLocal));
        } catch (e) {}
      }

      // 2. Fetch from cloud database asynchronously without blocking rendering
      if (isLoggedIn && email) {
        try {
          const cloudMissions = await loadMissionsFromDatabase(email, todayStr);
          if (active && cloudMissions && cloudMissions.length > 0) {
            // Only update state if different to prevent re-renders
            const cloudStr = JSON.stringify(cloudMissions);
            if (savedLocal !== cloudStr) {
              setDailyMissions(cloudMissions);
              localStorage.setItem(cacheKey, cloudStr);
            }
            return;
          }
        } catch (err) {
          console.warn("[Missions Sync] Cloud load fallback:", err);
        }
      }

      // 3. Fallback to generating new ones if not found anywhere else
      if (!savedLocal) {
        const generated = generateDailyMissions(user);
        if (active) {
          setDailyMissions(generated);
          localStorage.setItem(cacheKey, JSON.stringify(generated));
          if (isLoggedIn && email) {
            saveMissionToDatabase(email, todayStr, generated).catch(console.warn);
          }
        }
      }
    }

    loadMissions();

    return () => {
      active = false;
    };
  }, [user?.email, isLoggedIn, loggedEmail]);

  // Keep Firestore dailyMissions list updated on change only (with comparison to reduce unnecessary setDoc triggers)
  const prevMissionsRef = useRef("");
  useEffect(() => {
    if (dailyMissions && dailyMissions.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const email = user?.email || loggedEmail;
      const cacheKey = `orbi_missions_${email || "default"}_${todayStr}`;
      const serialized = JSON.stringify(dailyMissions);
      
      // Only persist if something has changed since the last update
      if (prevMissionsRef.current !== serialized) {
        prevMissionsRef.current = serialized;
        localStorage.setItem(cacheKey, serialized);

        // Re-route dynamically to Cloud Firestore if logged in
        if (isLoggedIn && email) {
          saveMissionToDatabase(email, todayStr, dailyMissions).catch(console.warn);
        }
      }
    }
  }, [dailyMissions, isLoggedIn, loggedEmail, user?.email]);

  const [weeklyMissions, setWeeklyMissions] = useState<DailyMission[]>([
    { id: "w1", title: "Esta semana tente resolver uma pendência antiga", description: "Identifique um compromisso pendente há muito tempo e dê o primeiro passo para resolvê-lo, liberando fluxo de Saturno.", isCompleted: false, points: 120 },
    { id: "w2", title: "Esta semana fortaleça um relacionamento importante", description: "Envie uma mensagem sincera de gratidão ou faça um convite de conversa leve a quem você quer bem.", isCompleted: false, points: 150 },
    { id: "w3", title: "Esta semana dedique tempo ao aprendizado", description: "Reserve um tempo concentrado para estudar símbolos astrológicos ou técnicas de clareza mental e meditação.", isCompleted: false, points: 100 }
  ]);
  
  // Blog / FAQ / Landing views helper
  const [activeLandingSection, setActiveLandingSection] = useState<'home' | 'blog' | 'tarot' | 'faq'>('home');
  const [readingBlogPost, setReadingBlogPost] = useState<number | null>(null);

  // Map persistence state
  const [isMapJustSaved, setIsMapJustSaved] = useState<boolean>(false);

  // Language settings state
  const [lang, setLangState] = useState<Language>(getInitialLanguage());
  const setLang = async (newLang: Language) => {
    setLangState(newLang);
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('orbi_preferred_language', newLang);
    if (isLoggedIn && loggedEmail) {
      try {
        const nextUser = {
          ...user,
          preferredLanguage: newLang
        };
        setUser(nextUser);
        localStorage.setItem("orbi_user_profile", JSON.stringify(nextUser));
        await saveProfileToDatabase(loggedEmail, nextUser);
        console.log("[Language] Preferred language successfully persistent on Firestore default:", newLang);
      } catch (err) {
        console.error("Erro ao salvar idioma no Firestore:", err);
      }
    }
  };

  // Sync currentLang dynamically so that any component receiving currentLang matches the settings perfectly
  useEffect(() => {
    setCurrentLang(lang);
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  // Local helper to get static translations for settings on the fly
  const tLocal = (key: string, replacement?: any): string => {
    const activeL = lang || 'pt';
    const translated = translateUiText(key, activeL);
    if (translated && translated !== key) {
      let str = translated;
      if (replacement !== undefined) {
        str = str.replace('{count}', String(replacement));
      }
      return str;
    }
    const dict = localLangDict[activeL] || localLangDict['pt'];
    let str = dict[key] || '';
    if (!str) {
      const fallbackDict = localLangDict['pt'];
      str = fallbackDict[key] || key;
    }
    if (replacement !== undefined) {
      str = str.replace('{count}', String(replacement));
    }
    return str;
  };

  // Notifications toggles
  const [notifyDaily, setNotifyDaily] = useState<boolean>(true);
  const [notifyTransit, setNotifyTransit] = useState<boolean>(true);

  // Live premium system notifications toast state
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: string } | null>(null);
  
  const triggerGlobalNotification = (title: string, message: string, type: string) => {
    setActiveToast({ title, message, type });
    console.log(`[TOAST] Nova notificação ativa de tipo ${type}: ${title} - ${message}`);
    setTimeout(() => {
      setActiveToast((current) => {
        if (current && current.title === title) return null;
        return current;
      });
    }, 6000);
  };

  const renderLockedSection = (title: string, desc: string) => {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-4 space-y-6 text-center animate-in fade-in duration-300 font-sans select-none">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-900 border border-amber-500/15 flex items-center justify-center text-xl shadow-lg">
          🔒
        </div>
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">{desc}</p>
        </div>
        <button
          onClick={() => {
            setMapSubTab('criar_meu_mapa');
            setActiveTab('mapa');
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 rounded-xl text-xs font-black uppercase text-slate-950 shadow-md hover:opacity-100 opacity-90 transition active:scale-95 cursor-pointer"
        >
          Criar Meu Mapa Astral
        </button>
      </div>
    );
  };

  const mapLocalChartToAstrologyMap = (name: string, date: string, time: string, city: string): AstrologyMap => {
    const chart = calculateNatalChart(date, time, city);
    
    let fogo = 0, terra = 0, ar = 0, agua = 0;
    let cardinal = 0, fixo = 0, mutavel = 0;
    let ativo = 0, receptivo = 0;
    
    const elementMapping: Record<string, "Fogo" | "Terra" | "Ar" | "Água"> = {
      "Áries": "Fogo", "Leão": "Fogo", "Sagitário": "Fogo",
      "Touro": "Terra", "Virgem": "Terra", "Capricórnio": "Terra",
      "Gêmeos": "Ar", "Libra": "Ar", "Aquário": "Ar",
      "Câncer": "Água", "Escorpião": "Água", "Peixes": "Água"
    };
    
    const qualityMapping: Record<string, "Cardinal" | "Fixo" | "Mutável"> = {
      "Áries": "Cardinal", "Câncer": "Cardinal", "Libra": "Cardinal", "Capricórnio": "Cardinal",
      "Touro": "Fixo", "Leão": "Fixo", "Escorpião": "Fixo", "Aquário": "Fixo",
      "Gêmeos": "Mutável", "Virgem": "Mutável", "Sagitário": "Mutável", "Peixes": "Mutável"
    };
    
    const polarityMapping: Record<string, "Ativo" | "Receptivo"> = {
      "Áries": "Ativo", "Gêmeos": "Ativo", "Leão": "Ativo", "Libra": "Ativo", "Sagitário": "Ativo", "Aquário": "Ativo",
      "Touro": "Receptivo", "Câncer": "Receptivo", "Virgem": "Receptivo", "Escorpião": "Receptivo", "Capricórnio": "Receptivo", "Peixes": "Receptivo"
    };

    chart.planets.forEach(p => {
      const el = elementMapping[p.sign] || "Fogo";
      if (el === "Fogo") fogo++;
      else if (el === "Terra") terra++;
      else if (el === "Ar") ar++;
      else if (el === "Água") agua++;
      
      const q = qualityMapping[p.sign] || "Cardinal";
      if (q === "Cardinal") cardinal++;
      else if (q === "Fixo") fixo++;
      else if (q === "Mutável") mutavel++;
      
      const pol = polarityMapping[p.sign] || "Ativo";
      if (pol === "Ativo") ativo++;
      else receptivo++;
    });

    const totalPoints = chart.planets.length || 1;

    const astros: AstroAstroPosition[] = chart.planets.map(p => ({
      name: p.name,
      sign: p.sign,
      degree: `${p.degree}°`,
      extraInfo: p.isRetrograde ? "retrógrado" : "direto",
      description: `Exibindo posição do astro ${p.name} no signo de ${p.sign} na Casa ${p.house}.`
    }));

    const houses: AstroHouse[] = chart.houses.map(h => ({
      number: h.house,
      sign: h.sign,
      interpretation: `A cúspide da Casa ${h.house} inicia no signo de ${h.sign} com graus exatos de ${h.degree}° de alinhamento Placidus.`
    }));

    const aspects: AstroAspect[] = chart.aspects.map(a => ({
      planet1: a.planet1,
      planet2: a.planet2,
      aspectType: a.type as any,
      orb: `${a.orb}°`,
      interpretation: `Conexão celeste dinâmica de ${a.type} entre ${a.planet1} e ${a.planet2}.`
    }));

    return {
      welcomeMessage: `Olá ${name}, suas efemérides foram geradas e sintonizadas no dispositivo local com sucesso!`,
      originalTime: time,
      adjustedTime: time,
      timezone: "America/Sao_Paulo",
      is_dst: false,
      distribution: {
        elements: {
          fire: Math.round((fogo / totalPoints) * 100),
          earth: Math.round((terra / totalPoints) * 100),
          air: Math.round((ar / totalPoints) * 100),
          water: Math.round((agua / totalPoints) * 100)
        },
        qualities: {
          cardinal: Math.round((cardinal / totalPoints) * 100),
          fixed: Math.round((fixo / totalPoints) * 100),
          mutable: Math.round((mutavel / totalPoints) * 100)
        },
        polarization: {
          yang: Math.round((ativo / totalPoints) * 100),
          yin: Math.round((receptivo / totalPoints) * 100)
        }
      },
      personalityTraits: {
        harmonious: ["Socialmente consciente", "Inventivo", "Esperançoso", "Amigável", "Independente"],
        disharmonious: ["Temperamental", "Disperso", "Imprevisível", "Teimoso"]
      },
      astros,
      houses,
      aspects
    };
  };

  // Synchronize and migrate local astrology data to the active cloud user profile
  const migrateLocalDataToCloud = async (emailLower: string, uid: string, targetUser: UserProfile) => {
    try {
      console.log("[Migration Engine] Checking if local guest map needs migration for:", emailLower);
      
      const localProfileStr = localStorage.getItem("orbi_user_profile");
      const localMapStr = localStorage.getItem("orbi_map_data");
      const localNumStr = localStorage.getItem("orbi_numerology_data");
      
      let localProfile: any = null;
      let localMapData: any = null;
      let localNumerology: any = null;
      
      try {
        if (localProfileStr) localProfile = JSON.parse(localProfileStr);
        if (localMapStr) localMapData = JSON.parse(localMapStr);
        if (localNumStr) localNumerology = JSON.parse(localNumStr);
      } catch (e) {
        console.warn("[Migration Engine] Parse error:", e);
      }
      
      const hasLocalMapParams = localProfile && localProfile.birthDate && localProfile.birthCity;
      
      let cloudCharts: any[] = [];
      try {
        cloudCharts = await loadAllNatalCharts(emailLower);
      } catch (errCharts) {
        console.warn("[Migration Engine] Failed to lookup cloud charts:", errCharts);
      }
      
      const isCloudEmpty = !targetUser.birthDate || cloudCharts.length === 0;
      
      if (hasLocalMapParams && isCloudEmpty) {
        console.log("[Migration Engine] Cloud is empty or missing map. Initiating guest-to-cloud automatic migration!");
        
        const birthDateClean = localProfile.birthDate.replace(/[^a-zA-Z0-9]/g, "_");
        const birthTimeClean = (localProfile.birthTime || "12:00").replace(/[^a-zA-Z0-9]/g, "_");
        const birthCityClean = (localProfile.birthCity || "Sao_Paulo").replace(/[^a-zA-Z0-9]/g, "_");
        const chartId = `chart_${birthDateClean}_${birthTimeClean}_${birthCityClean}`;
        
        const finalMap = localMapData || mapLocalChartToAstrologyMap(
          localProfile.name || targetUser.name || "Buscador",
          localProfile.birthDate,
          localProfile.birthTime || "12:00",
          localProfile.birthCity
        );
        
        const finalNum = localNumerology || calculateNumerology(
          localProfile.name || targetUser.name || "Buscador",
          localProfile.birthDate
        );
        
        await saveNatalChartToDatabase(emailLower, chartId, {
          name: localProfile.name || targetUser.name || "Buscador",
          birthDate: localProfile.birthDate,
          birthTime: localProfile.birthTime || "12:00",
          birthCity: localProfile.birthCity,
          isUnknownTime: !!localProfile.isUnknownTime,
          mapData: finalMap,
          numerology: finalNum
        });
        
        const migratedUserObj: UserProfile = {
          ...targetUser,
          name: localProfile.name || targetUser.name || "Viajante Estelar",
          birthDate: localProfile.birthDate,
          birthTime: localProfile.birthTime || "12:00",
          birthCity: localProfile.birthCity,
          isUnknownTime: !!localProfile.isUnknownTime,
          latitude: localProfile.latitude !== undefined ? localProfile.latitude : targetUser.latitude,
          longitude: localProfile.longitude !== undefined ? localProfile.longitude : targetUser.longitude,
          hasCreatedMap: true,
          currentChartId: chartId
        };
        
        await saveProfileToDatabase(emailLower, migratedUserObj);
        
        setUser(migratedUserObj);
        localStorage.setItem("orbi_user_profile", JSON.stringify(migratedUserObj));
        localStorage.setItem("orbi_map_data", JSON.stringify(finalMap));
        localStorage.setItem("orbi_numerology_data", JSON.stringify(finalNum));
        
        setMapData(finalMap);
        setNumerology(finalNum);
        
        setMapSubTab('meu_mapa');
        setActiveTab('mapa');
        
        triggerGlobalNotification(
          "Mapa Sincronizado", 
          "Seu mapa astral local foi arquivado com sucesso no seu perfil na nuvem!", 
          "success"
        );
      } else if (targetUser.birthDate || (cloudCharts && cloudCharts.length > 0)) {
        console.log("[Migration Engine] Cloud profile already exists with active birth parameters. Restoring from Cloud.");
        const finalUser = {
          ...targetUser,
          hasCreatedMap: true
        };
        setUser(finalUser);
        localStorage.setItem("orbi_user_profile", JSON.stringify(finalUser));
        setMapSubTab('meu_mapa');
        setActiveTab('mapa');
        await triggerGenerateMainMap(finalUser);
      } else {
        setMapSubTab('criar_meu_mapa');
        setActiveTab('mapa');
      }
    } catch (errMigr) {
      console.error("[Migration Engine] Critical error migrating astrology elements:", errMigr);
    }
  };

  const handleManualSaveMap = async () => {
    if (!isLoggedIn || !loggedEmail) {
      triggerGlobalNotification(
        "Autenticação Necessária", 
        "Crie uma conta ou faça login para salvar seu mapa com segurança na Nuvem Órbita!", 
        "alert"
      );
      setMapSubTab('criar_meu_mapa');
      setActiveTab('configuracoes');
      return;
    }

    if (!mapData || !numerology) {
      triggerGlobalNotification(
        "Sem Dados do Mapa", 
        "Por favor, insira seus dados de nascimento para gerar um mapa antes de salvar.", 
        "alert"
      );
      return;
    }

    setIsLoadingMain(true);
    try {
      const birthDateClean = (user.birthDate || "1997-02-11").replace(/[^a-zA-Z0-9]/g, "_");
      const birthTimeClean = (user.birthTime || "12:00").replace(/[^a-zA-Z0-9]/g, "_");
      const birthCityClean = (user.birthCity || "Sao_Paulo").replace(/[^a-zA-Z0-9]/g, "_");
      const chartId = `chart_${birthDateClean}_${birthTimeClean}_${birthCityClean}`;

      await saveNatalChartToDatabase(loggedEmail, chartId, {
        name: user.name || "Buscador",
        birthDate: user.birthDate,
        birthTime: user.birthTime || "12:00",
        birthCity: user.birthCity,
        isUnknownTime: !!user.isUnknownTime,
        mapData: mapData,
        numerology: numerology
      });

      const updatedUser: UserProfile = {
        ...user,
        hasCreatedMap: true,
        currentChartId: chartId
      };
      
      await saveProfileToDatabase(loggedEmail, updatedUser);
      setUser(updatedUser);
      setIsMapJustSaved(true);
      localStorage.setItem("orbi_user_profile", JSON.stringify(updatedUser));
      localStorage.setItem("orbi_map_data", JSON.stringify(mapData));
      localStorage.setItem("orbi_numerology_data", JSON.stringify(numerology));

      triggerGlobalNotification(
        "Sincronização Completa", 
        "Seu mapa natal e numerologia foram salvos com sucesso na nuvem do Firestore!", 
        "success"
      );
    } catch (saveError: any) {
      console.error("[Manual Save] Error:", saveError);
      const errMsg = saveError?.message || String(saveError);
      triggerGlobalNotification(
        "Erro ao Salvar", 
        `Erro Firestore: ${errMsg}`, 
        "alert"
      );
    } finally {
      setIsLoadingMain(false);
    }
  };

  // Fetch / Generate core maps matching user details
  const triggerGenerateMainMap = async (details: any) => {
    // 1. INSTRUMENTAL OPTIMIZATION: Instantaneous client-side Placidus math calculation.
    // This allows the circular chart, astral degrees, and aspects to render immediately (<= 1ms)
    // with no loading screens or infinite spinners, matching the fast Astrolink experience.
    const defaultBirthDate = details.birthDate || user.birthDate || "1997-02-11";
    const defaultBirthTime = details.birthTime || user.birthTime || "12:00";
    const defaultBirthCity = details.birthCity || user.birthCity || "São Paulo";
    
    const clientMap = mapLocalChartToAstrologyMap(
      details.name || user.name || "Buscador",
      defaultBirthDate,
      defaultBirthTime,
      defaultBirthCity
    );
    const clientNum = calculateNumerology(
      details.name || user.name || "Buscador",
      defaultBirthDate
    );

    // Set high-precision map values instantly
    setMapData(clientMap);
    setNumerology(clientNum);
    setIsLoadingMain(false);

    try {
      const email = details.email || user.email || loggedEmail;
      if (email) {
        // High-Precision subcollection lookup via candidate IDs (robust and typo-tolerant)
        const birthDateClean = (details.birthDate || user.birthDate || "1997-02-11").replace(/[^a-zA-Z0-9]/g, "_");
        const birthTimeClean = (details.birthTime || user.birthTime || "12:00").replace(/[^a-zA-Z0-9]/g, "_");
        const birthCityClean = (details.birthCity || user.birthCity || "Sao_Paulo").replace(/[^a-zA-Z0-9]/g, "_");
        const dynamicChartId = `chart_${birthDateClean}_${birthTimeClean}_${birthCityClean}`;
        const typoChartId = `chart_${birthDateClean}_birthTimeClean_birthCityClean`;

        const activeChartId = details.currentChartId || user.currentChartId || dynamicChartId;
        
        let dbChart = null;
        const candidateIds = Array.from(new Set([
          activeChartId,
          details.currentChartId,
          user.currentChartId,
          dynamicChartId,
          typoChartId
        ])).filter(Boolean) as string[];

        for (const cid of candidateIds) {
          try {
            const chart = await loadNatalChartFromDatabase(email, cid);
            if (chart && chart.mapData && chart.numerology) {
              dbChart = chart;
              break;
            }
          } catch (e) {
            console.warn(`[Astro DB Retry] Skip ID ${cid}:`, e);
          }
        }

        if (!dbChart) {
          // Final bulletproof attempt: fetch all charts in subcollection
          try {
            const allCharts = await loadAllNatalCharts(email);
            if (allCharts && allCharts.length > 0) {
              const matched = allCharts.find(c => 
                c && c.mapData && c.numerology &&
                c.birthDate === details.birthDate
              ) || allCharts.find(c => c && c.mapData && c.numerology);
              
              if (matched) {
                dbChart = matched;
              }
            }
          } catch (errAll) {
            console.warn("[Astro DB All Recovery] Failed to fetch subcollection charts:", errAll);
          }
        }

        if (dbChart && dbChart.mapData && dbChart.numerology) {
          console.log("[Astro DB] Natal chart successfully restored from Firestore Cloud!");
          setMapData(dbChart.mapData);
          setNumerology(dbChart.numerology);
          pushRealNotification(`Você (${details.name || user.name || "Buscador"}) sintonizou seu Mapa Principal carregado da Nuvem Astrológica! 🪐`);
          return;
        }

        // Fallback to traditional cache
        try {
          const cached = await loadCalculationCache(email, "natal_chart");
          if (cached && cached.parameters) {
            const p = cached.parameters;
            const isMatch = 
              p.birthDate === details.birthDate &&
              p.birthTime === details.birthTime &&
              p.birthCity === details.birthCity &&
              p.isUnknownTime === details.isUnknownTime;
            if (isMatch && cached.map && cached.numerology) {
              console.log("[Intelligent Cache] Natal chart loaded from Firestore cache.");
              setMapData(cached.map);
              setNumerology(cached.numerology);
              pushRealNotification(`Você (${details.name || user.name || "Buscador"}) sintonizou seu novo Mapa Astral diretamente do Cache Celestial Inteligente! 🪐`);
              return;
            }
          }
        } catch (cacheErr) {
          console.warn("[Cache Natal Chart] Failed to load calculation cache, continuing to generate:", cacheErr);
        }
      }

      // 2. BACKGROUND ENRICHMENT: Fetch deep poetic AI descriptions asynchronously in the background.
      // This prevents the slow Gemini API from locking the UI with a spinner.
      let data;
      try {
        const response = await fetch("/api/astrology/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: details.name || user.name,
            email: details.email || user.email || loggedEmail,
            birthDate: details.birthDate,
            birthTime: details.birthTime,
            birthCity: details.birthCity,
            isUnknownTime: details.isUnknownTime,
            latitude: details.latitude !== undefined ? details.latitude : user.latitude,
            longitude: details.longitude !== undefined ? details.longitude : user.longitude
          })
        });
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error("Astro API respondeu com código de erro " + response.status);
        }
      } catch (fetchErr) {
        console.warn("[Astro API Fallback] Falhou a geração na API. Mantendo mapa local de alta precisão.", fetchErr);
        data = { map: clientMap, numerology: clientNum };
      }

      if (data && data.map) {
        setMapData(data.map);
      }
      if (data && data.numerology) {
        setNumerology(data.numerology);
      }

      if (email && data && data.map && data.numerology) {
        const birthDateClean = (details.birthDate || "1997-02-11").replace(/[^a-zA-Z0-9]/g, "_");
        const birthTimeClean = (details.birthTime || "12:00").replace(/[^a-zA-Z0-9]/g, "_");
        const birthCityClean = (details.birthCity || "Sao_Paulo").replace(/[^a-zA-Z0-9]/g, "_");
        const chartId = `chart_${birthDateClean}_${birthTimeClean}_${birthCityClean}`;

        try {
          // Direct subcollection persistence in background
          await saveNatalChartToDatabase(email, chartId, {
            name: details.name || user.name || "Buscador",
            birthDate: details.birthDate,
            birthTime: details.birthTime || "12:00",
            birthCity: details.birthCity,
            isUnknownTime: !!details.isUnknownTime,
            mapData: data.map,
            numerology: data.numerology
          });

          // Link the newly generated chart as primary
          const nextUser = {
            ...user,
            ...details,
            hasCreatedMap: true,
            currentChartId: chartId
          };
          setUser(nextUser);
          await saveProfileToDatabase(email, nextUser);
        } catch (dbSaveErr) {
          console.warn("[Astro DB Save] Failed to save natalChart or user currentChartId link:", dbSaveErr);
        }

        try {
          await saveCalculationCache(email, "natal_chart", {
            parameters: {
              birthDate: details.birthDate,
              birthTime: details.birthTime,
              birthCity: details.birthCity,
              isUnknownTime: details.isUnknownTime
            },
            map: data.map,
            numerology: data.numerology
          });
        } catch (saveCacheErr) {
          console.warn("[Cache Natal Chart] Failed to save calculation cache:", saveCacheErr);
        }
      }
    } catch (err) {
      console.error("Astrology calculations backend sync warning:", err);
    } finally {
      setIsLoadingMain(false);
    }
  };

  const lastGeneratedParamsRef = useRef<string>("");

  // Automatically load or generate main map data whenever user profile/coordinates change (e.g. login, load, edit)
  useEffect(() => {
    if (user.hasCreatedMap && user.birthDate && user.birthCity) {
      const paramKey = `${user.email || "default"}_${user.birthDate}_${user.birthTime || ""}_${user.birthCity}_${user.isUnknownTime ?? false}`;
      if (lastGeneratedParamsRef.current !== paramKey) {
        lastGeneratedParamsRef.current = paramKey;
        console.log("[Reactive Map Loader] Triggering map generation/load for:", paramKey);
        triggerGenerateMainMap({
          name: user.name,
          birthDate: user.birthDate,
          birthTime: user.birthTime,
          birthCity: user.birthCity,
          isUnknownTime: user.isUnknownTime,
          email: user.email
        });
      }
    }
  }, [user?.email, user?.hasCreatedMap, user?.birthDate, user?.birthTime, user?.birthCity, user?.isUnknownTime]);

  // Run on mount to fetch default global notification ticker
  useEffect(() => {
    // Varied global/multilingual simulated notifications matching mundial scope
    const notificationPhrases = [
      "Carolina (Rio de Janeiro) acabou de recalcular seu Mapa Astral - Placidus! 🇧🇷",
      "Sarah (New York, USA) just unlocked her Premium Astrological Alignment Report! 🇺🇸",
      "Liam (London, UK) drew 'The Sun' card in his Daily Tarot spread! 🇬🇧",
      "Sofía (Buenos Aires, Argentina) acaba de calcular su Carta Astral completa! 🇦🇷",
      "Chloé (Paris, France) a interprété son rêve d'eau avec l'aide d'Orbia! 🇫🇷",
      "Yuki (Tokyo, Japan) just synced her daily lunar transit whisper! 🇯🇵",
      "Afonso (Lisboa, Portugal) acabou de obter a previsão da sua Revolução Solar! 🇵🇹",
      "Elena (Madrid, Spain) ha consultado el Oráculo sobre su caminho de vida! 🇪🇸",
      "Hans (Zürich, Switzerland) validated his high-precision birth DST offsets! 🇨🇭",
      "Mateo (Bogotá, Colombia) acaba de sincronizar las energías en el Radar Diario! 🇨🇴",
      "Amara (Lagos, Nigeria) unlocked her life path number 11 numerology cycle! 🇳🇬",
      "Oliver (Sydney, Australia) just calculated his Love Compatibility Synastry! 🇦🇺",
      "Emil (Oslo, Norway) generated a dynamic transit report for June 2026! 🇳🇴",
      "João Victor (São Paulo) tirou 'A Imperatriz' no Tarô da Semana Premium! 🇧🇷",
      "Isabella (Milano, Italy) ha completato il calcolo del tema natale! 🇮🇹"
    ];

    let counter = 0;
    const interval = setInterval(() => {
      setUserNotificationQueue(prevQueue => {
        if (prevQueue.length > 0) {
          // Display the first real system notification of the user
          setBubbleNotification(prevQueue[0]);
          // Rotate it to the back of the queue
          return [...prevQueue.slice(1), prevQueue[0]];
        } else {
          // Shift through the global international phrases
          counter = (counter + 1) % notificationPhrases.length;
          setBubbleNotification(notificationPhrases[counter]);
          return prevQueue;
        }
      });
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  // Update user profile and recalculate everything
  const handleUpdateUserProfile = (updatedDetails: Partial<UserProfile>) => {
    const hasExistingMap = user.hasCreatedMap;
    const isBirthCoordinatesModified = 
      (updatedDetails.birthDate !== undefined && updatedDetails.birthDate !== user.birthDate) ||
      (updatedDetails.birthTime !== undefined && updatedDetails.birthTime !== user.birthTime) ||
      (updatedDetails.birthCity !== undefined && updatedDetails.birthCity !== user.birthCity);

    let nextChangesCount = 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const nextUser = { 
      ...user, 
      ...updatedDetails, 
      hasCreatedMap: true,
      mainMapChangesCount: nextChangesCount 
    };
    
    // Invalida cache de missões antigas no localStorage para forçar recálculo fresh
    const missionsCacheKey = `orbi_missions_${nextUser?.email || "default"}_${todayStr}`;
    localStorage.removeItem(missionsCacheKey);
    localStorage.removeItem(`orbi_missions_default_${todayStr}`);
    
    // Invalida cache de sonhos e zera histórico onírico de forma segura
    localStorage.removeItem("star_map_dreams_v2");
    setDreamsHistory([]);
    setSelectedDreamDisplay(null);
    
    // Reseta o estado do Tarot e Oráculos para o novo mapa astral do utilizador
    setTarotRecord(null);
    setTarotDrawnToday(false);
    setOracleResponse(null);
    setHasQueriedOracleToday(false);
    setOracleQuestion('');

    // Limpa os estados de mapas extras visualizados e reinicia a pontuação do mapa
    setActiveExtraMapData(null);
    setActiveExtraMapNumerology(null);
    setActiveExtraMapBirthDate('');
    setActiveExtraMapName('');
    setScorePoints(0);

    // Reseta abas de navegação para a tela principal
    setAreaSubTab('universo_mostrando');
    setMapSubTab(nextUser.hasCreatedMap ? 'meu_mapa' : 'area_usuario');

    // Descarrega dados velhos do mapa principal anterior para evitar persistência indevida
    setMapData(null);
    setNumerology(null);
    localStorage.removeItem("orbi_map_data");
    localStorage.removeItem("orbi_numerology_data");

    // Limpa profundamente todos os caches de cálculos do mapa anterior localmente
    const cachePrefixes = [
      "astrology:", "transits:", "moontip:", "osiris_missions_v3:", 
      "osiris_dashboard:", "oraculo_dreams:", "oraculo:", 
      "compatibility:", "rarenotif:", "astro_read_notification_ids", 
      "claimed_blessings_keys"
    ];
    Object.keys(localStorage).forEach(key => {
      if (cachePrefixes.some(pref => key.startsWith(pref))) {
        localStorage.removeItem(key);
      }
    });

    // Reseta de forma reativa e limpa as mensagens de chat da Orbia
    setChatMessages([
      {
        id: "welcomeMsg",
        sender: "assistant",
        text: `Saudações, ${nextUser.name.split(' ')[0]}. Eu sou Orbia. Estou recalibrando suas estrelas e regenerando todas as conexões celestes para seu novo mapa astral de alta precisão. Aguarde um instante...`,
        timestamp: new Date().toLocaleTimeString().slice(0, 5)
      }
    ]);

    // Limpa o cache inteligente de cálculos no Firestore e LocalStorage para recalculo total
    if (loggedEmail) {
      clearCalculationCache(loggedEmail).catch(console.error);
    }

    localStorage.setItem("orbi_user_profile", JSON.stringify(nextUser));
    
    // Sincroniza também no cache local de contas registradas se houver email associado
    const trackingEmail = (nextUser.email || loggedEmail || "").toLowerCase().trim();
    if (trackingEmail) {
      const accounts = getRegisteredAccounts();
      const existingIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === trackingEmail);
      if (existingIdx !== -1) {
        accounts[existingIdx].user = nextUser;
        saveRegisteredAccounts(accounts);
      }
    }

    setUser(nextUser);
    triggerGenerateMainMap(nextUser);
    if (loggedEmail) {
      saveProfileToDatabase(loggedEmail, nextUser).catch(console.error);
    }
  };

  // Dynamically synchronize Orbia welcome message with the actual user profile
  useEffect(() => {
    const getDynamicIntroOfSign = (sign: string) => {
      switch (sign) {
        case "Áries": return "uma chama de liderança e coragem que queima com intensidade realizadora";
        case "Touro": return "uma estabilidade serena e uma busca profunda pela harmonia e beleza terrena";
        case "Gêmeos": return "uma curiosidade viva e uma mente ágil capaz de conectar múltiplas realidades";
        case "Câncer": return "uma sensibilidade intuitiva e protetora, intimamente ligada às marés da alma";
        case "Leão": return "um brilho generoso e magnético que irradia autoconfiança de forma calorosa";
        case "Virgem": return "uma mente atenta e refinada dedicada ao aprimoramento contínuo da vida";
        case "Libra": return "uma busca constante pelo equilíbrio, justiça e elegância sincera nas conexões";
        case "Escorpião": return "uma intensidade investigativa e regeneradora capaz de alquimizar as sombras em luz";
        case "Sagitário": return "um idealismo ardente e uma busca insaciável por expansão de sabedoria e liberdade";
        case "Capricórnio": return "uma sabedoria estruturada que constrói com perseverança e seriedade seu legado";
        case "Aquário": return "um idealismo visionário com uma profunda reverência à inovação e liberdade de pensamento";
        case "Peixes": return "uma empatia profunda e oceânica que navega suavemente entre os mundos da intuição";
        default: return "um magnetismo singular e uma centelha estelar brilhando intensamente no cosmos";
      }
    };

    let welcomeText = "Saudações. Eu sou Orbia, sua Conselheira Astrológica e Terapeuta Pessoal de Inteligência Celestial. Sincronize ou crie seu mapa astral completo para desbloquear análises ultra-personalizadas, leituras de trânsitos astronômicos e conselhos direcionados à sua essência de nascimento.";
    if (user.hasCreatedMap && user.name) {
      const firstName = user.name.split(' ')[0];
      const sunSign = mapData?.astros?.find(a => a.name === "Sol")?.sign || getZodiacSign(user.birthDate) || "seu Signo";
      const ascSign = mapData?.astros?.find(a => a.name === "Ascendente")?.sign || (user.birthTime ? getRisingSign(user.birthDate, user.birthTime) : "");
      welcomeText = `Saudações, ${firstName}. Eu sou Orbia, sua Conselheira Astrológica e Terapeuta Pessoal de Inteligência Celestial. Nascido com o Sol em ${sunSign}${ascSign ? ` e Ascendente em ${ascSign}` : ""}, sinto em seu campo energético ${getDynamicIntroOfSign(sunSign)}. Como eu, Orbia, posso guiar sua jornada de consciência e transformação hoje em 2026?`;
    } else if (user.name) {
      const firstName = user.name.split(' ')[0];
      welcomeText = `Saudações, ${firstName}. Eu sou Orbia, sua Conselheira Astrológica e Terapeuta Pessoal de Inteligência Celestial. Que alegria tê-lo conosco! Sincronize seu nascimento para mapear suas dezenas de aspectos astrológicos personalizados baseados em efemérides astronômicas reais. Como posso te orientar hoje?`;
    }
    setChatMessages(prev => {
      const filtered = prev.filter(m => m.id !== "welcomeMsg");
      return [
        {
          id: "welcomeMsg",
          sender: "assistant",
          text: welcomeText,
          timestamp: "02:37"
        },
        ...filtered
      ];
    });
  }, [user, mapData]);

  // Submit Dream Handler call to server (New Oráculo dos Sonhos)
  const handleRecordAndInterpretDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDreamDesc) return;
    setIsInterpretingDream(true);
    
    try {
      const response = await fetch("/api/dreams/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newDreamDesc
        })
      });
      const data = await response.json();
      const nextId = `dream_${Date.now()}`;
      const now = new Date();
      const currentFormattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const currentFormattedDate = now.toISOString().split('T')[0];
      const dreamTitle = data.interpretation?.title || newDreamDesc.slice(0, 30) + "...";
      
      const newEntry: OracleDreamEntry = {
        id: nextId,
        date: currentFormattedDate,
        time: currentFormattedTime,
        title: dreamTitle,
        language: currentLang,
        description: newDreamDesc,
        interpretation: data.interpretation
      };

      setDreamsHistory([newEntry, ...dreamsHistory]);
      setSelectedDreamDisplay(newEntry);
      
      if (isLoggedIn && loggedEmail) {
        saveDreamToDatabase(loggedEmail, {
          id: newEntry.id,
          userId: loggedEmail,
          title: dreamTitle,
          text: newEntry.description,
          interpretation: newEntry.interpretation ? JSON.stringify(newEntry.interpretation) : "",
          sentiment: "Celeste",
          date: newEntry.date,
          time: newEntry.time,
          language: newEntry.language || currentLang
        }).catch(console.warn);
      }

      pushRealNotification(`Você decodificou um sonho no seu Cofre de Sonhos com a ajuda de Orbia (+40 pontos)! 🌀`);
      
      // Clear inputs
      setNewDreamDesc('');
      
      // Reward points!
      setScorePoints(prev => prev + 40);

    } catch (err) {
      console.error(err);
    } finally {
      setIsInterpretingDream(false);
    }
  };

  // AI Chat counselor handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChatInput.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `chat_${Date.now()}`,
      sender: "user",
      text: currentChatInput,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentChatInput;
    setCurrentChatInput('');
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/conselheira/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          userProfile: user,
          requestTopic: "geral"
        })
      });
      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `chat_resp_${Date.now()}`,
        sender: "assistant",
        text: data.response,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Oracle hander 1 daily use limit
  const handleAskOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oracleQuestion.trim()) return;
    setIsQueryingOracle(true);

    try {
      const response = await fetch("/api/oraculo/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: oracleQuestion })
      });
      const data = await response.json();
      setOracleResponse(data);
      setHasQueriedOracleToday(true);
      pushRealNotification(`Você consultou o Oráculo Estelar Sagrado hoje! 👁️`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsQueryingOracle(false);
    }
  };

  // Tarot drawer
  const handleDrawTarotCard = async () => {
    setIsDrawingTarot(true);
    try {
      const response = await fetch("/api/tarot/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.draw) {
        setTarotRecord(data.draw);
        setTarotDrawnToday(true);
        pushRealNotification(`Você tirou a carta '${data.draw.card?.cardName || "Misteriosa"}' no Tarot Semanal! 🃏`);

        // Real-time synchronization layer for Tarot readings
        const email = user.email || loggedEmail;
        if (isLoggedIn && email) {
          const readingId = `tarot_draw_${Date.now()}`;
          saveTarotReadingToDatabase(email, readingId, {
            id: readingId,
            question: "Tarot Tradicional Semanal",
            drawType: "weekly",
            drawnCards: [data.draw.card || {}],
            interpretationText: data.draw.interpretation || ""
          }).catch(console.warn);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrawingTarot(false);
    }
  };

  // complete a user daily goal
  const handleToggleMission = (id: string) => {
    setDailyMissions(prev => 
      prev.map(m => {
        if (m.id === id) {
          const nextCompleted = !m.isCompleted;
          if (nextCompleted) {
            setScorePoints(sc => sc + m.points);
          } else {
            setScorePoints(sc => Math.max(0, sc - m.points));
          }
          return { ...m, isCompleted: nextCompleted };
        }
        return m;
      })
    );
  };

  // Complete a user weekly goal
  const handleToggleWeeklyMission = (id: string) => {
    setWeeklyMissions(prev => 
      prev.map(m => {
        if (m.id === id) {
          const nextCompleted = !m.isCompleted;
          if (nextCompleted) {
            setScorePoints(sc => sc + m.points);
          } else {
            setScorePoints(sc => Math.max(0, sc - m.points));
          }
          return { ...m, isCompleted: nextCompleted };
        }
        return m;
      })
    );
  };

  const handleDeleteAccount = async () => {
    try {
      if (!loggedEmail) return;
      
      // Chamar deleção no banco de dados, storage local e autenticação
      await deleteUserAccountFirebase(loggedEmail);
      
      // Filtrar das contas locais salvas
      const accounts = getRegisteredAccounts();
      const nextAccounts = accounts.filter((acc: any) => acc.email.toLowerCase() !== loggedEmail.toLowerCase());
      saveRegisteredAccounts(nextAccounts);
      
      // Resetar estados locais do usuário ativo
      setUser({
        name: "",
        email: "",
        birthDate: "",
        birthTime: "",
        birthCity: "",
        isUnknownTime: false,
        isPremium: true,
        hasCreatedMap: false
      });
      
      // Finalizar sessão
      localStorage.removeItem("orbi_logged_email");
      setLoggedEmail("");
      setIsLoggedIn(false);
      setActiveTab('mapa');
      setShowDeleteConfirm(false);
      pushRealNotification("Sua conta e dados foram totalmente excluídos. Sucesso.");
    } catch (e: any) {
      console.error(e);
      pushRealNotification("Erro ao excluir conta: " + (e.message || String(e)));
    }
  };

  const handleClearCache = () => {
    try {
      const cachePrefixes = [
        "astrology:", "transits:", "moontip:", "osiris_missions_v3:", 
        "osiris_dashboard:", "oraculo_dreams:", "oraculo:", 
        "compatibility:", "rarenotif:", "claimed_blessings_keys",
        "astro_read_notification_ids", "star_map_dreams_v2"
      ];
      Object.keys(localStorage).forEach(key => {
        if (cachePrefixes.some(pref => key.startsWith(pref))) {
          localStorage.removeItem(key);
        }
      });
      triggerGlobalNotification(
        "Cache Limpo",
        "Seu cache de performance foi limpo e otimizado com segurança.",
        "success"
      );
    } catch (e) {
      console.error("Cache clear error:", e);
      triggerGlobalNotification("Erro de Limpeza", "Falha ao limpar o cache temporário.", "error");
    }
  };

  // Signs profiles list & dynamic horoscope data
  const signsZodiacList = SIGNS_ZODIAC_LIST;

  // Blog articles content lists
  const blogArticlesList = BLOG_ARTICLES_LIST;

  // FAQ contents
  const faqList = FAQ_LIST;

  // Biorritmo Calculations
  const calculateBiorhythm = (birthDateStr: string, targetDateStr: string) => {
    try {
      const birth = new Date(birthDateStr);
      const target = new Date(targetDateStr);
      if (isNaN(birth.getTime()) || isNaN(target.getTime())) return { fisico: 50, emocional: 50, intelectual: 50 };
      
      const diffTime = Math.abs(target.getTime() - birth.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Physical: 23 days cycle
      const fisico = Math.round((Math.sin((2 * Math.PI * diffDays) / 23) + 1) * 50);
      // Emotional: 28 days cycle
      const emocional = Math.round((Math.sin((2 * Math.PI * diffDays) / 28) + 1) * 50);
      // Intellectual: 33 days cycle
      const intelectual = Math.round((Math.sin((2 * Math.PI * diffDays) / 33) + 1) * 50);
      
      return { fisico, emocional, intelectual };
    } catch {
      return { fisico: 75, emocional: 62, intelectual: 89 };
    }
  };

  const biorhythmToday = calculateBiorhythm(user.birthDate, new Date().toISOString().split('T')[0]);

  const personalProsperity = generatePersonalizedProsperityMap(
    user?.hasCreatedMap ? user.birthDate : "1997-02-11",
    mapData?.astros?.find(a => a.name === "Sol")?.sign || (user?.birthDate ? getZodiacSign(user.birthDate) : "Touro"),
    user?.hasCreatedMap ? user.name : "Viajante",
    new Date()
  );

  // Automated Real-Time Biorhythm Sync Hook
  useEffect(() => {
    if (user.birthDate && user.hasCreatedMap) {
      const todayStr = new Date().toISOString().split('T')[0];
      const email = user.email || loggedEmail;
      if (isLoggedIn && email && biorhythmToday) {
        saveBiorhythmToDatabase(email, todayStr, {
          physical: biorhythmToday.fisico,
          emotional: biorhythmToday.emocional,
          intellectual: biorhythmToday.intelectual,
          intuitive: Math.round((biorhythmToday.fisico + biorhythmToday.emocional) / 2),
          compositeScore: Math.round((biorhythmToday.fisico + biorhythmToday.emocional + biorhythmToday.intelectual) / 3),
          targetDate: todayStr
        }).catch(console.warn);
      }
    }
  }, [biorhythmToday, user?.birthDate, user?.hasCreatedMap, isLoggedIn, loggedEmail]);

  // Automated Real-Time Prosperity Map Sync Hook
  useEffect(() => {
    if (user.birthDate && user.hasCreatedMap && personalProsperity) {
      const email = user.email || loggedEmail;
      const currentMonthStr = `prosperity_${new Date().getFullYear()}_${new Date().getMonth() + 1}`;
      if (isLoggedIn && email) {
        saveProsperityMapToDatabase(email, currentMonthStr, {
          favoredColor: personalProsperity.favorableColor?.name || "",
          favoredColorHex: personalProsperity.favorableColor?.hex || "",
          favoredDay: "Domingo Astral",
          keyword: personalProsperity.keyword,
          symbol: personalProsperity.amulet,
          recommendations: personalProsperity.strategicAdvice,
          monthNumber: new Date().getMonth() + 1
        }).catch(console.warn);
      }
    }
  }, [personalProsperity, user?.birthDate, user?.hasCreatedMap, isLoggedIn, loggedEmail]);

  // Automated Real-Time Numerology Matrix Sync Hook
  useEffect(() => {
    if (numerology && user.hasCreatedMap) {
      const email = user.email || loggedEmail;
      if (isLoggedIn && email) {
        const numId = "current_matrix";
        saveNumerologyToDatabase(email, numId, {
          lifePathNumber: numerology.caminhoDeVida,
          expressionNumber: numerology.expressao,
          soulUrgeNumber: numerology.motivacao,
          personalityNumber: numerology.personalidade,
          derivedCycles: numerology.ciclos || []
        }).catch(console.warn);
      }
    }
  }, [numerology, user?.hasCreatedMap, isLoggedIn, loggedEmail]);

  return (
    <div id="star-map-application" className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/20 antialiased relative">
      {/* Stripe Verification Overlay */}
      {verifyingStripe && (
        <div className="fixed inset-0 bg-slate-950/90 z-[300] backdrop-blur-md flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2 max-w-sm px-4">
            <h3 className="text-base font-black tracking-tight text-white uppercase font-sans">
              {currentLang === 'pt' ? 'Sintonizando Pagamento' : 'Synchronizing Payment'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {currentLang === 'pt'
                ? 'Conectando aos servidores seguros da Stripe para validar seu alinhamento...'
                : 'Verifying with secure Stripe servers to synchronize your celestial alignment...'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Global Operations Notification Toast */}
      {activeToast && (
        <div className="fixed top-14 right-6 z-[100] max-w-sm w-full bg-[#0a1124]/95 border border-amber-500/30 p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in slide-in-from-right duration-300 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-slate-100/5 border border-slate-800 mt-0.5">
            {activeToast.type === 'push' && <Smartphone className="w-5 h-5 text-[#E5C158]" />}
            {activeToast.type === 'email' && <Mail className="w-5 h-5 text-[#E5C158]" />}
            {activeToast.type === 'alert' && <Bell className="w-5 h-5 text-[#E5C158]" />}
            {activeToast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-[9px] font-bold text-[#E5C158] font-mono leading-none uppercase tracking-wider">
              {activeToast.type === 'email' ? '📬 E-mail Simulado' : activeToast.type === 'push' ? '📲 Push Notification' : '🔔 Alerta de Órbita'}
            </h5>
            <h4 className="text-xs font-sans font-bold text-white mt-1.5 leading-snug">{activeToast.title}</h4>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">{activeToast.message}</p>
          </div>
          <button onClick={() => setActiveToast(null)} className="text-slate-400 hover:text-white shrink-0 p-0.5 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynamic Cosmic Backing Particle Light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-blue-900/10 blur-[130px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-amber-950/10 blur-[150px]" />
        <div className="absolute top-[50%] right-[30%] w-[300px] h-[300px] rounded-full bg-purple-950/10 blur-[110px]" />
      </div>

      {/* ========================================= */}
      {/* 1. PUBLIC LANDING VIEW (User Not Logged In) */}
      {/* ========================================= */}
      {!isLoggedIn ? (
        <div id="landing-page" className="relative z-10 space-y-16 pb-24 text-left">
          
          {/* Header Bar */}
          <nav className="w-full max-w-7xl mx-auto px-4 py-5 flex items-center justify-between border-b border-slate-900/80">
            <div className="flex items-center gap-3">
              <OrbitaLogo className="w-9 h-9" />
              <div className="flex flex-col">
                <span className="text-sm font-black font-sans tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 uppercase leading-none">
                  PORTAL ÓRBITA
                </span>
                <span className="text-[7.5px] font-mono tracking-widest text-slate-500 uppercase mt-0.5 font-bold">
                  Sistemas Astrológicos de Alta Precisão & Efemérides Plácidus
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex gap-6 text-xs font-semibold text-slate-400">
              <button onClick={() => {
                document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
              }} className="hover:text-amber-400 transition cursor-pointer">Sintonizar Mapa Astral</button>
              <button className="hover:text-amber-400 transition cursor-pointer" onClick={() => {
                document.getElementById('advantages-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>Por que a Órbita?</button>
              <button className="hover:text-amber-400 transition cursor-pointer" onClick={() => {
                document.getElementById('signs-selection')?.scrollIntoView({ behavior: 'smooth' });
              }}>12 Constelações</button>
              <button className="hover:text-amber-400 transition cursor-pointer" onClick={() => {
                document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>Estudos Estelares</button>
              <button className="hover:text-amber-400 transition cursor-pointer" onClick={() => {
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>Dúvidas Comuns</button>
            </div>
          </nav>

          {/* Core Hero Block & Calculator Form */}
          <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6">
            
            {/* Slogan and Social Proof */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-center relative">
              <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

              <span className="px-3.5 py-1 rounded-full text-[9px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 self-start">
                🛡️ TECNOLOGIA DE PONTA · REAL-TIME INTERPOLATION
              </span>
              <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-slate-200 to-slate-400 leading-tight">
                SUA ALMA DECODIFICADA COM PRECISÃO DE ATÉ 1/1000 DE GRAU
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl font-sans">
                Esqueça os horóscopos robóticos e as aproximações rasas de internet. O <strong className="text-amber-400 font-bold">Portal Órbita</strong> calcula as efemérides planetárias exatas e as cúspides das casas de Plácidus cruzando dados reais de fuso horário histórico, correções de horário de verão e coordenadas de latitude e longitude. 
              </p>
              <p className="text-slate-405 text-xs leading-relaxed max-w-xl font-sans">
                O único sistema autárquico que integra seu <strong className="text-amber-300">Mapa Astral de Alta Resolução</strong> com sintonizador de <strong className="text-amber-300">Nodos Lunares de Evolução Pessoal</strong>, gráficos computados de <strong className="text-amber-300">Biorritmos</strong>, tiragens dinâmicas de <strong className="text-amber-300">Tarot</strong> e <strong className="text-amber-300">Oráculo Psicanalítico de Sonhos</strong>.
              </p>

              {/* Masterful Celestial Projection SVG Graphic */}
              <div className="w-full max-w-[420px] aspect-square rounded-3xl bg-slate-950/80 border border-slate-900 shadow-2xl relative overflow-hidden p-6 group">
                {/* Space background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
                <div className="absolute inset-0 bg-radial from-amber-500/10 to-transparent pointer-events-none" />

                <svg className="w-full h-full text-amber-500/30" viewBox="0 0 200 200">
                  {/* Outer Orbit Coordinates */}
                  <circle cx="100" cy="100" r="85" className="fill-none stroke-amber-500/20" strokeWidth="1" />
                  <circle cx="100" cy="100" r="80" className="fill-none stroke-amber-500/30" strokeWidth="1" strokeDasharray="2 3" />
                  <circle cx="100" cy="100" r="62" className="fill-none stroke-slate-800" strokeWidth="1.5" />
                  
                  {/* Aspect projection triangles (Placidus Houses simulation lines) */}
                  <polygon points="100,38 153.6,131 46.4,131" className="fill-amber-500/5 stroke-amber-500/30" strokeWidth="0.8" />
                  <polygon points="100,162 153.6,69 46.4,69" className="fill-sky-500/5 stroke-sky-550/20" strokeWidth="0.8" />

                  {/* Curving orbits */}
                  <path d="M 38 100 A 62 45 45 0 1 162 100" className="fill-none stroke-emerald-500/20" strokeWidth="1" strokeDasharray="3 4" />
                  <path d="M 100 38 A 45 62 45 0 1 100 162" className="fill-none stroke-purple-500/20" strokeWidth="1" />

                  {/* Constellation Star Links (Aries/Scorpio stardust nodes) */}
                  <g className="animate-pulse">
                    <line x1="100" y1="38" x2="153.6" y2="69" className="stroke-amber-400/50" strokeWidth="0.75" />
                    <line x1="153.6" y1="69" x2="153.6" y2="131" className="stroke-amber-400/50" strokeWidth="0.75" />
                    <line x1="46.4" y1="131" x2="100" y2="162" className="stroke-amber-400/50" strokeWidth="0.75" />
                  </g>

                  {/* Core Astronomical Nodes */}
                  <circle cx="100" cy="38" r="3" className="fill-amber-400 stroke-slate-950" strokeWidth="1" />
                  <circle cx="153.6" cy="131" r="3" className="fill-rose-500 stroke-slate-950" strokeWidth="1" />
                  <circle cx="46.4" cy="131" r="3" className="fill-sky-400 stroke-slate-950" strokeWidth="1" />
                  <circle cx="153.6" cy="69" r="3" className="fill-purple-400 stroke-slate-950" strokeWidth="1" />
                  <circle cx="46.4" cy="69" r="3" className="fill-emerald-400 stroke-slate-950" strokeWidth="1" />
                  <circle cx="100" cy="162" r="3" className="fill-amber-400 stroke-slate-950" strokeWidth="1" />

                  {/* Earth center node */}
                  <circle cx="100" cy="100" r="10" className="fill-slate-950 stroke-amber-500/50" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="3" className="fill-amber-500" />
                  
                  {/* Subtle orbiting planet nodes */}
                  <circle cx="138" cy="80" r="2.5" className="fill-slate-100" />
                  <text x="144" y="82" className="fill-slate-500 text-[6px] font-mono">SOL</text>

                  <circle cx="68" cy="120" r="2" className="fill-indigo-400" />
                  <text x="54" y="126" className="fill-slate-500 text-[6px] font-mono">LUA</text>

                  <text x="100" y="24" textAnchor="middle" className="fill-amber-400 text-[6px] font-mono font-black tracking-widest">PLACIDUS HOUSE MC</text>
                  <text x="100" y="180" textAnchor="middle" className="fill-slate-500 text-[6px] font-mono tracking-widest">NADI FLOOR IC</text>
                </svg>

                {/* Information readout overlays */}
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[7.5px] font-mono text-slate-500 border-t border-slate-900/40 pt-2 pointer-events-none">
                  <span>SISTEMA DE COMPUTAÇÃO: PLACIDUS 2026</span>
                  <span className="text-amber-500 font-bold">ALGORITMO GEOCÊNTRICO ATIVO</span>
                </div>
              </div>

              {/* Created charts real-time statistics counter */}
              <div className="p-4 rounded-3xl bg-slate-950/90 border border-slate-900 flex items-center gap-4 max-w-md shadow-lg shadow-black/40">
                <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500 shrink-0">
                  <Globe className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
                <div>
                  <div className="text-base font-mono font-black text-amber-400">+21.608.314</div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none mt-1">Mapas astronômicos sincronizados</div>
                </div>
              </div>
            </div>

            {/* Centered High conversion registration card */}
            <div id="auth-card" className="lg:col-span-6 bg-slate-900/40 p-6 sm:p-8 rounded-[36px] border border-amber-500/15 backdrop-blur-md shadow-2xl space-y-6 relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
              
              {/* Alerta de Domínio Não Autorizado no Firebase Auth */}
              {unauthorizedDomainError && (
                <div className="p-4 rounded-2xl bg-rose-950/45 border border-rose-500/35 space-y-3 font-sans animate-in fade-in duration-300">
                  <div className="flex items-start gap-2 text-rose-300">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wide">Domínio Não Autorizado no Firebase Auth</h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        O Firebase bloqueou o login social porque o domínio atual não está registrado como domínio autorizado nas configurações do seu projeto Firebase.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-rose-955/20 text-[10.5px] space-y-1.5 leading-snug">
                    <p className="text-slate-400 font-mono text-[9px] break-all select-all">
                      Domínio atual: <strong className="text-amber-400 text-[10px]">{typeof window !== 'undefined' ? window.location.hostname : 'localhost'}</strong>
                    </p>
                    <p className="text-slate-400 font-mono text-[9px]">
                      👉 Para corrigir isso, acesse o Console do Firebase, vá em <strong>Build &gt; Authentication &gt; Settings &gt; Authorized domains</strong> e adicione o domínio exibido acima.
                    </p>
                  </div>
                  <div className="flex gap-2.5 pt-1">
                    <button 
                      type="button"
                      onClick={() => setUnauthorizedDomainError(false)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-[10px] font-bold text-slate-100 rounded-lg cursor-pointer transition"
                    >
                      Dispensar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setAuthTab('birth_info');
                        setUnauthorizedDomainError(false);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-955 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition"
                    >
                      Criar via E-mail
                    </button>
                  </div>
                </div>
              )}

              {/* Alerta de Popup Bloqueado/Fechado (Iframe limitations do AI Studio) */}
              {popupClosedError && (
                <div className="p-4 rounded-2xl bg-amber-955/45 border border-amber-500/35 space-y-3 font-sans animate-in fade-in duration-300">
                  <div className="flex items-start gap-2 text-amber-300">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wide">Login Social Bloqueado/Cancelado</h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        Você está no ambiente de visualização do AI Studio. Navegadores costumam bloquear ou fechar popups de login de terceiros (Google/Facebook) automaticamente dentro de iframes por segurança.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-900/20 text-[10.5px] space-y-1.5 leading-snug">
                    <p className="text-slate-400 font-mono text-[9px]">
                      💡 <strong>Solução ideal:</strong> Clique no botão abaixo para abrir o aplicativo diretamente em uma aba cheia fora do iframe, onde o login do Google funcionará perfeitamente e sem restrições.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a 
                      href={typeof window !== 'undefined' ? window.location.href : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-955 text-[10px] font-black uppercase tracking-wider rounded-lg hover:from-amber-400 hover:to-amber-500 transition cursor-pointer"
                    >
                      <ExternalLink className="w-3" />
                      Abrir em Nova Aba
                    </a>
                    <button 
                      type="button" 
                      onClick={() => {
                        setAuthTab('birth_info');
                        setPopupClosedError(false);
                      }}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-755 text-[10px] font-bold text-slate-100 rounded-lg cursor-pointer transition"
                    >
                      Usar E-mail e Senha
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPopupClosedError(false)}
                      className="px-3 py-1.5 bg-transparent hover:bg-slate-900 text-[10px] text-slate-400 hover:text-slate-200 transition cursor-pointer"
                    >
                      Dispensar
                    </button>
                  </div>
                </div>
              )}

              {/* Alerta de Operação Não Permitida (Email/Password desativado no console do Firebase) */}
              {operationNotAllowedError && (
                <div className="p-4 rounded-2xl bg-amber-955/45 border border-amber-500/35 space-y-3 font-sans animate-in fade-in duration-300">
                  <div className="flex items-start gap-2 text-amber-300">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-450 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wide">Método de E-mail/Senha desativado</h4>
                      <p className="text-[11px] text-slate-300 leading-normal">
                        O Firebase retornou o erro <strong className="font-mono text-[9px] text-rose-300">auth/operation-not-allowed</strong>. O provedor de login com Email e Senha não foi habilitado nas configurações de autenticação do seu projeto.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-900/20 text-[10.5px] space-y-2 leading-snug text-slate-300 font-sans">
                    <p className="text-xs font-bold text-slate-200">🛠️ Como ativar e corrigir:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[10.5px] text-slate-400 font-mono">
                      <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">Console do Firebase</a></li>
                      <li>Vá em <strong>Build &gt; Authentication &gt; Sign-in method</strong></li>
                      <li>Clique em <strong>Add new provider (Adicionar novo provedor)</strong></li>
                      <li>Selecione <strong>Email/Password (E-mail/Senha)</strong>, ative-o e salve.</li>
                    </ol>
                    <p className="text-[10px] text-amber-500/90 font-mono mt-1">
                      💡 <strong>Nota:</strong> Seus dados salvos localmente continuam gravados offline perfeitamente até ativar o provedor em nuvem!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button 
                      type="button"
                      onClick={() => setOperationNotAllowedError(false)}
                      className="px-3.5 py-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition"
                    >
                      Entendido / Dispensar
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN A: Faça seu mapa astral gratuito */}
              {authTab === 'birth_info' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-250 font-sans uppercase">
                      Faça seu mapa astral gratuito
                    </h2>
                    <p className="text-xs text-slate-400">Preencha seus dados natais terrestres e crie sua conta de acesso para sintonizar os astros de forma imediata.</p>
                  </div>

                  {/* Help Modal Popup for Birth Time */}
                  {showAscExplain && (
                    <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/25 text-[11px] text-amber-200/90 leading-relaxed font-sans relative">
                      <button 
                        type="button" 
                        onClick={() => setShowAscExplain(false)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-white px-2 py-0.5 text-[10px] font-black cursor-pointer bg-slate-950/60 rounded-md"
                      >
                        ✕
                      </button>
                      <p className="pr-4">
                        O horário do seu nascimento é o que permite o cálculo do seu ascendente e tudo o que é relativo a ele. É uma informação muito importante para que possamos criar o seu mapa astral completo! Você pode obter essa informação em sua certidão de nascimento.
                      </p>
                    </div>
                  )}

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!termsConsent) {
                        triggerGlobalNotification("Ativação Obrigatória", "Você precisa concordar em conformidade com os Termos e a Política de privacidade para continuar.", "alert");
                        return;
                      }
                      if (!createMainName.trim()) {
                        triggerGlobalNotification("Dados Incompletos", "Por favor, digite o seu nome completo.", "alert");
                        return;
                      }
                      if (!createMainCity) {
                        triggerGlobalNotification("Dados Incompletos", "Por favor, digite em qual cidade você nasceu.", "alert");
                        return;
                      }
                      if (!createMainDate) {
                        triggerGlobalNotification("Dados Incompletos", "Por favor, selecione sua data de nascimento.", "alert");
                        return;
                      }
                      if (!timeIsUnknown && !createMainTime) {
                        triggerGlobalNotification("Dados Incompletos", "Por favor, preencha o seu horário de nascimento ou marque que não sabe o horário.", "alert");
                        return;
                      }
                      await handleRegisterAccountSubmit(e);
                    }} 
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">(Qual seu Nome Completo?)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Carlos Santos"
                        value={createMainName}
                        onChange={(e) => setCreateMainName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">(Em qual cidade você nasceu?)</label>
                      <CityAutocomplete
                        value={createMainCity}
                        onChange={(val) => setCreateMainCity(val)}
                        onSelectCity={(city) => {
                          setCreateMainCity(city.label);
                          setCreateMainCoords({ latitude: city.latitude, longitude: city.longitude });
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">(Qual sua data de nascimento?)</label>
                        <input 
                          type="date" 
                          required
                          value={createMainDate}
                          onChange={(e) => setCreateMainDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-200 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">(Qual seu horário de nascimento?)</label>
                        <input 
                          type="text" 
                          disabled={timeIsUnknown}
                          required={!timeIsUnknown}
                          placeholder={timeIsUnknown ? "Informar depois..." : "Ex: 15:30"}
                          value={timeIsUnknown ? "" : createMainTime}
                          onChange={(e) => setCreateMainTime(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50 disabled:opacity-40"
                        />
                      </div>
                    </div>

                    {/* Unknown time checkbox */}
                    <div className="flex items-center gap-2 select-none">
                      <input 
                        type="checkbox" 
                        id="unknown-time-checkbox"
                        checked={timeIsUnknown}
                        onChange={(e) => {
                          setTimeIsUnknown(e.target.checked);
                          if (e.target.checked) {
                            setCreateMainTime("");
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-amber-500 cursor-pointer"
                      />
                      <label htmlFor="unknown-time-checkbox" className="text-[11px] text-slate-350 cursor-pointer flex items-center gap-1.5 font-sans leading-none">
                        Não sei meu horário de nascimento / Informar depois
                      </label>
                      <button 
                        type="button"
                        onClick={() => setShowAscExplain(true)}
                        className="p-1 text-xs text-amber-400 font-bold hover:text-amber-300 transition-all font-sans cursor-pointer shrink-0"
                        title="Saiba mais"
                      >
                        [?]
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">(E-mail para acesso)</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="Ex: maria@provedor.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-205 focus:outline-hidden focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">(Crie sua Senha)</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="Mínimo 6 caracteres"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-205 focus:outline-hidden focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    {/* Marketing & Terms Agreement Checkboxes */}
                    <div className="space-y-3 pt-1">
                      <div className="flex gap-2.5 items-start select-none">
                        <input 
                          type="checkbox" 
                          id="marketing-opt"
                          checked={newsletterConsent}
                          onChange={(e) => setNewsletterConsent(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-amber-500 cursor-pointer mt-0.5"
                        />
                        <label htmlFor="marketing-opt" className="text-[11px] text-slate-350 font-sans leading-snug cursor-pointer">
                          Desejo receber e-mail sobre horóscopo, promoções e novos conteúdos. (Opcional)
                        </label>
                      </div>

                      <div className="flex gap-2.5 items-start select-none">
                        <input 
                          type="checkbox" 
                          id="mandatory-terms"
                          checked={termsConsent}
                          onChange={(e) => setTermsConsent(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-950 accent-amber-500 cursor-pointer mt-0.5"
                        />
                        <label htmlFor="mandatory-terms" className="text-[11px] text-slate-355 font-sans leading-snug cursor-pointer">
                          Concordo com os Termos e a Política de privacidade. <span className="text-amber-500 font-black">*</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xl shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4 text-slate-950 fill-current animate-spin" style={{ animationDuration: '6s' }} />
                        CADASTRAR E GERAR MEU MAPA
                      </button>
                      
                      <div className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none py-1">
                        ou login com
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-bold transition duration-300 active:scale-98 shadow-sm cursor-pointer"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.12-3.12C17.43 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8c.85-2.5 3.19-4.26 6.9-4.26z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.43c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.8c2.1-1.94 3.77-5.17 3.77-8.39z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.1 14.7c-.24-.73-.38-1.5-.38-2.3a7.3 7.3 0 01.38-2.3L1.5 7.3A11.9 11.9 0 000 12c0 1.74.37 3.4 1.03 4.9l4.07-3.2z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1 1.74-2.5 1.83-4.36 1.83-3.71 0-6.05-1.76-6.9-4.26L1.03 18.1C2.9 21.95 6.85 24 12 24z"
                          />
                        </svg>
                        Google
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-850 flex items-center justify-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-sans">Já tem um cadastro?</span>
                      <button 
                        type="button" 
                        onClick={() => {
                          setAuthTab('login');
                          setAuthEmail('');
                          setAuthPassword('');
                        }}
                        className="text-amber-400 hover:text-amber-300 font-black font-sans uppercase tracking-wider underline cursor-pointer transition"
                      >
                        Faça login
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* SCREEN C: Already registered? Log In Screen */}
              {authTab === 'login' && (
                <>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 animate-pulse fill-amber-500/20" />
                      Já tem um cadastro?
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">Acesse o seu portal com e-mail e senha correspondentes.</p>
                  </div>

                  <form onSubmit={handleLoginAccountSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">(E-mail)</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="Ex: maria@provedor.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">(Senha)</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Digite sua senha cadastrada"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                      />
                    </div>

                    <div className="space-y-3 pt-3">
                      <button 
                        type="submit"
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-98 shadow-xl shadow-amber-500/10 cursor-pointer"
                      >
                        Fazer login
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-bold transition duration-300 active:scale-98 shadow-sm cursor-pointer"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.12-3.12C17.43 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8c.85-2.5 3.19-4.26 6.9-4.26z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.43c-.28 1.44-1.09 2.66-2.31 3.48l3.6 2.8c2.1-1.94 3.77-5.17 3.77-8.39z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.1 14.7c-.24-.73-.38-1.5-.38-2.3a7.3 7.3 0 01.38-2.3L1.5 7.3A11.9 11.9 0 000 12c0 1.74.37 3.4 1.03 4.9l4.07-3.2z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1 1.74-2.5 1.83-4.36 1.83-3.71 0-6.05-1.76-6.9-4.26L1.03 18.1C2.9 21.95 6.85 24 12 24z"
                          />
                        </svg>
                        Login com Google
                      </button>
                    </div>

                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('forgot_password');
                          setForgotEmail('');
                        }}
                        className="text-xs text-amber-500 hover:text-amber-400 font-bold font-sans transition cursor-pointer underline"
                      >
                        Esqueci minha senha
                      </button>
                    </div>

                    <div className="pt-3 text-center text-[10px] font-sans text-slate-400 leading-normal">
                      Ao criar uma conta, você concorda com os <span className="text-amber-500 underline cursor-pointer">Termos de uso</span> e a <span className="text-amber-500 underline cursor-pointer">Política de privacidade</span>.
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex items-center justify-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-sans">Não tem conta ainda?</span>
                      <button 
                        type="button" 
                        onClick={() => setAuthTab('birth_info')}
                        className="text-amber-400 hover:text-amber-300 font-black font-sans uppercase tracking-wider underline cursor-pointer transition"
                      >
                        Criar Mapa Inteligente
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* SCREEN D: Forgot password recovery */}
              {authTab === 'forgot_password' && (
                <>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 animate-pulse fill-amber-500/20" />
                      Esqueci minha senha
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">Enviaremos as orientações de recuperação de senha por e-mail para que possa criar uma nova senha.</p>
                  </div>

                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">E-mail Cadastrado</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="Ex: maria@provedor.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-850 font-sans text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button"
                        onClick={() => setAuthTab('login')}
                        className="flex-1 py-3 text-xs bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-2xl text-slate-450 uppercase tracking-wider font-mono cursor-pointer transition text-center"
                      >
                        Voltar
                      </button>
                      <button 
                        type="submit"
                        disabled={isSendingReset}
                        className="flex-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition active:scale-98 shadow-xl shadow-amber-500/10 cursor-pointer disabled:opacity-50"
                      >
                        {isSendingReset ? 'Enviando...' : 'Recuperar Senha'}
                      </button>
                    </div>

                    <div className="pt-3 text-center text-[10px] font-sans text-slate-400 leading-normal">
                      Ao criar uma conta, você concorda com os <span className="text-amber-500 underline cursor-pointer">Termos de uso</span> e a <span className="text-amber-500 underline cursor-pointer">Política de privacidade</span>.
                    </div>
                  </form>
                </>
              )}

              {/* Secure encrypted credentials badge */}
              <div className="space-y-3 pt-3 border-t border-slate-850">
                <div className="text-center text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-normal">
                  🔒 Autenticação do Portal Criptografada localmente no seu dispositivo.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: ADVANTAGES & PLATFORM AUTHENTICITY (Why Órbita?) */}
          <div id="advantages-section" className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 scroll-mt-20">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20">
                Comparativo de Engenharia Celeste
              </span>
              <h2 className="text-2xl md:text-4xl font-sans font-black tracking-tight text-slate-100 uppercase">
                Por que o Portal Órbita é Diferente de Tudo?
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto">
                Compare a arquitetura matemática de precisão militar do nosso motor contra ferramentas amadoras que você encontra na internet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              
              {/* Bento Card 1: Precise Astronomical Engine */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.015 }}
                className="p-6 bg-slate-900/40 rounded-3xl border border-slate-850 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Orbit className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-200">Motor de Efemérides de Alta Resolução</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Nossos servidores calculam a declinação e a ascensão reta geocêntrica verdadeira de cada planeta no instante preciso do seu nascimento. Corrigimos discrepâncias históricas de horário de verão e fusos horários locais de mais de 12.000 cidades mundiais. Isso garante que o seu signo Ascendente e Cúspide das Casas estejam 100% corretos.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-amber-500/80 bg-amber-500/5 px-3 py-1.5 rounded-xl border border-amber-500/10 self-start">
                  ⚡ Precisão de até 1/1000 de segundo de arco.
                </div>
              </motion.div>

              {/* Bento Card 2: Multidimensional Insight */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.015 }}
                className="p-6 bg-slate-900/40 rounded-3xl border border-slate-850 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-200">Suíte de Sintonização de Alma</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Não somos apenas um mapa natal estático. Sincronizamos sua energia com as correntes de subconsciência integral: rastreadores de Nodos Lunares (Cabeça e Cauda do Dragão), análise de Biorritmo Dinâmico (ciclos emocionais, físicos e intelectuais), tiragem de Tarot de autoconhecimento e decifrador de sementes oníricas.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-sky-400 bg-sky-500/5 px-3 py-1.5 rounded-xl border border-sky-500/10 self-start">
                  🔮 Integração completa de 5 dimensões psíquicas.
                </div>
              </motion.div>

              {/* Bento Card 3: Absolute Freedom & Anti-Adware */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                whileHover={{ scale: 1.015 }}
                className="p-6 bg-slate-900/40 rounded-3xl border border-slate-850 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-200">Segurança de Dados & Criptografia</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Sua data de nascimento, nome e local de origem não são mercadorias. O Portal Órbita é orgulhosamente livre de anúncios intrusivos de terceiros. Todos os seus dados são criptografados e salvos localmente utilizando tecnologia Sandbox de navegador isolada ou armazenados em bancos de dados de nuvem de alta segurança.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10 self-start">
                  🔒 Selo de Blindagem GDPR/LGPD Ativo.
                </div>
              </motion.div>

              {/* Bento Card 4: Comparison Matrix Box */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.015 }}
                className="p-6 bg-slate-950/80 rounded-3xl border border-amber-500/20 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none" />
                <div className="space-y-3 relative z-10">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" /> Tabela Comparativa de Autoridade
                  </h4>
                  
                  <div className="space-y-2 pt-2 text-[11px] font-sans">
                    <div className="grid grid-cols-3 border-b border-slate-900 pb-1.5 font-bold text-slate-300">
                      <span>Recurso</span>
                      <span className="text-slate-500 text-center">Sites Comuns</span>
                      <span className="text-amber-400 text-right">Portal Órbita</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-slate-900 pb-1.5">
                      <span className="text-slate-300">Efemérides Reais</span>
                      <span className="text-slate-500 text-center">Aproximadas</span>
                      <span className="text-emerald-400 text-right font-bold">Sim (NASA-std)</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-slate-900 pb-1.5">
                      <span className="text-slate-300">Ajuste de Luz Solar</span>
                      <span className="text-slate-500 text-center">Não Possuem</span>
                      <span className="text-emerald-400 text-right font-bold">Automático</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-slate-900 pb-1.5">
                      <span className="text-slate-300">Painel com Tarot e Biorritmo</span>
                      <span className="text-slate-500 text-center">Inexistente</span>
                      <span className="text-emerald-400 text-right font-bold">Completo</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-slate-300">Uso de Anúncios</span>
                      <span className="text-rose-450 text-center">Excessivo</span>
                      <span className="text-emerald-400 text-right font-bold">Zero Anúncios</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    document.getElementById('auth-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition duration-300 shadow-md cursor-pointer mt-3 relative z-10"
                >
                  Sintonizar Meu Mapa Grátis Agora
                </button>
              </motion.div>

            </div>
          </div>

          {/* Interactive Signs carousel / selector list */}
          <div id="signs-selection" className="w-full max-w-7xl mx-auto px-4 space-y-6 pt-8 scroll-mt-20">
            <div className="text-center space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold">12 Constelações Zodiacais</span>
              <h2 className="text-xl md:text-2xl font-sans font-extrabold text-slate-100">Visualize as Vibrações de Cada Signo</h2>
              <p className="text-xs text-slate-405 max-w-xl mx-auto">Explore as características essenciais, astros regentes e receba previsões gratuitas diárias.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-3 max-w-6xl mx-auto">
              {signsZodiacList.map((sz, szIdx) => {
                const isActive = selectedZodiacSign === sz.name;
                let glowColor = 'from-amber-500/10 to-transparent';
                let borderColor = isActive ? 'border-amber-500/50' : 'border-slate-800/80';
                let textColor = isActive ? 'text-amber-300 font-bold' : 'text-slate-400';

                if (sz.element === "Fogo") {
                  glowColor = isActive ? 'from-rose-500/25 to-rose-950/10' : 'from-rose-500/5 to-transparent';
                  borderColor = isActive ? 'border-rose-500/60 shadow-lg shadow-rose-500/15' : 'border-slate-800/80 hover:border-rose-500/20';
                  textColor = isActive ? 'text-rose-300 font-semibold' : 'text-slate-400 hover:text-rose-100';
                } else if (sz.element === "Terra") {
                  glowColor = isActive ? 'from-emerald-500/25 to-emerald-950/10' : 'from-emerald-500/5 to-transparent';
                  borderColor = isActive ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/15' : 'border-slate-800/80 hover:border-emerald-500/20';
                  textColor = isActive ? 'text-emerald-300 font-semibold' : 'text-slate-400 hover:text-emerald-100';
                } else if (sz.element === "Ar") {
                  glowColor = isActive ? 'from-sky-500/25 to-sky-950/10' : 'from-sky-500/5 to-transparent';
                  borderColor = isActive ? 'border-sky-500/60 shadow-lg shadow-sky-500/15' : 'border-slate-800/80 hover:border-sky-500/20';
                  textColor = isActive ? 'text-sky-300 font-semibold' : 'text-slate-400 hover:text-sky-100';
                } else if (sz.element === "Água") {
                  glowColor = isActive ? 'from-indigo-500/25 to-indigo-950/10' : 'from-indigo-500/5 to-transparent';
                  borderColor = isActive ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/15' : 'border-slate-800/80 hover:border-indigo-500/20';
                  textColor = isActive ? 'text-indigo-300 font-semibold' : 'text-slate-400 hover:text-indigo-100';
                }

                return (
                  <motion.button
                    key={sz.name}
                    id={`zodiac-btn-${sz.name.toLowerCase()}`}
                    onClick={() => setSelectedZodiacSign(sz.name)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: szIdx * 0.03, ease: "easeOut" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group relative p-3 rounded-2xl border text-center transition-all duration-300 overflow-hidden ${borderColor} ${textColor} bg-slate-950`}
                  >
                    {/* Atmospheric Cosmic Image Background */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110 pointer-events-none"
                      style={{ 
                        backgroundImage: `url(${sz.cosmicImg})`,
                        mixBlendMode: 'lighten',
                        opacity: isActive ? 0.35 : 0.08
                      }}
                    />
                    {/* Ambient Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${glowColor} opacity-70 pointer-events-none`} />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-between h-full min-h-[55px]">
                      <span className={`text-2xl transition-transform duration-350 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {sz.symbol}
                      </span>
                      <div>
                        <span className="text-[10px] font-sans font-extrabold block tracking-wide truncate mt-1">
                          {sz.name}
                        </span>
                        <span className="text-[7px] uppercase font-mono tracking-widest block opacity-60 mt-0.5">
                          {sz.element}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Selected Sign Details Card */}
            {(() => {
              const currentSign = signsZodiacList.find(s => s.name === selectedZodiacSign);
              if (!currentSign) return null;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  id="zodiac-details-panel" 
                  className="max-w-4xl mx-auto p-6 md:p-8 rounded-[32px] bg-slate-900/40 border border-slate-800/75 flex flex-col md:flex-row gap-6 md:gap-8 relative overflow-hidden"
                >
                  {/* Subtle Cosmic Image Overlay on Left */}
                  <div 
                    className="absolute inset-0 md:w-1/2 bg-cover bg-center mix-blend-screen pointer-events-none opacity-20"
                    style={{ backgroundImage: `url(${currentSign.cosmicImg})` }}
                  />
                  <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent pointer-events-none" />

                  <div className="space-y-5 md:w-1/2 relative z-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl shadow-inner shadow-amber-500/10 text-amber-400">
                          {currentSign.symbol}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold font-sans tracking-tight text-slate-100 flex items-center gap-2">
                            {currentSign.name}
                            <span className="px-2 py-0.5 text-[8px] tracking-widest uppercase font-mono rounded-full bg-slate-950 border border-slate-800 text-slate-450">
                              {currentSign.element}
                            </span>
                          </h4>
                          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-400">
                            Regente Planetário: <strong className="text-amber-400">{currentSign.regente}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 space-y-1 bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                        <strong className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest block mb-1">Assinatura Energética & Atributos</strong>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentSign.traits}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-[10px] font-mono uppercase tracking-wider rounded-xl text-amber-400 transition cursor-pointer inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Sincronizar Mapa Natal Completo
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-5 md:p-6 rounded-[28px] border border-slate-800/80 md:w-1/2 flex flex-col justify-between relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-black text-amber-400 tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Previsão Astrológica Diária
                        </span>
                        <span className="text-[8px] uppercase tracking-widest font-mono text-slate-500">Gravitado pelo Sol</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic pt-1">
                        "{currentSign.horoscopo}"
                      </p>
                    </div>

                    <div className="text-[9px] text-slate-500 font-mono mt-6 border-t border-slate-850 pt-3 flex justify-between items-center">
                      <span>Atualizado às 00:00 UTC</span>
                      <span>Sincronizado: 2026-06-12T07:45:00Z</span>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>

          {/* O que é o mapa astral explanation */}
          <div className="w-full max-w-4xl mx-auto px-4 py-8 bg-slate-900/20 rounded-3xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-6 text-center bg-gradient-to-tr from-slate-950/60 to-slate-900/60 rounded-3xl border border-amber-500/10 flex flex-col items-center justify-center min-h-[170px]">
              <OrbitaLogo className="w-12 h-12" />
              <div className="text-sm font-bold text-amber-500 font-mono mt-4">PROJETO COSMIC PLACIDUS</div>
              <p className="text-[10px] text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">Coordenadas celestes, horas e latitudes precisas de nascimento determinam ressonâncias autênticas.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-100">O que é um Mapa Astral?</h3>
              <p className="text-xs text-slate-400 leading-relaxed leading-[1.7]">
                Seu Mapa Astral funciona como uma representação estática exata do firmamento planetário vistos na terra no instante de seu primeiro fôlego de ar terrestre. Ele aponta como Sol, Lua e os outros planetas se espelham em signos e determinam os eixos de vivências das suas doze casas terrenas fundamentais.
              </p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>· Sol denota seu ego básico e energia central vibrante.</li>
                <li>· Lua dita o subconsciente íntimo e a assimilativa reativa.</li>
                <li>· Ascendente expõe a casca física social de entrada no mundo.</li>
              </ul>
            </div>
          </div>

          {/* Blog posts articles carousel */}
          <div id="blog-section" className="w-full max-w-7xl mx-auto px-4 space-y-6 pt-4 scroll-mt-20">
            <div className="text-center space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">Conteúdos Notáveis</span>
              <h2 className="text-xl md:text-2xl font-sans font-extrabold text-slate-100">Biblioteca da Consciência Completa</h2>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">Leia guias produzidos por astrólogos licenciados abordando transições de energia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {blogArticlesList.map((art) => (
                <div key={art.id} className="p-5 bg-slate-900/40 rounded-3xl border border-slate-850 flex flex-col justify-between space-y-4 hover:border-slate-800 transition">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-slate-505 block uppercase">{art.author} · {art.date}</span>
                    <h4 className="text-sm font-bold text-slate-200">{art.title}</h4>
                    <p className="text-xs text-slate-450 leading-relaxed line-clamp-3">{art.summary}</p>
                  </div>

                  <button
                    onClick={() => setReadingBlogPost(art.id)}
                    className="text-xs text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Ler Artigo Completo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blog reader drawer popup */}
          {readingBlogPost !== null && (() => {
            const art = blogArticlesList.find(a => a.id === readingBlogPost);
            if (!art) return null;
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-2xl max-h-[80vh] overflow-y-auto space-y-4 relative">
                  <button 
                    onClick={() => setReadingBlogPost(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <span className="text-[9px] font-mono text-amber-500 uppercase">{art.author} · {art.date}</span>
                  <h3 className="text-lg font-bold text-slate-100 pr-8">{art.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed leading-[1.8] font-sans whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-850">
                    {art.content}
                  </p>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => setReadingBlogPost(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl"
                    >
                      Fechar Leitor
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Interactive FAQs Accordion */}
          <div id="faq-section" className="w-full max-w-3xl mx-auto px-4 space-y-6 pt-4 scroll-mt-20">
            <h3 className="text-center text-sm font-bold font-mono uppercase text-slate-500 tracking-widest">Perguntas Frequentes</h3>
            
            <div className="space-y-4">
              {faqList.map((faq, index) => (
                <div key={index} className="p-4 rounded-2xl bg-slate-900/30 border border-slate-850">
                  <h4 className="text-xs font-bold text-slate-250 mb-1 flex items-center gap-1.5">
                    <span className="text-amber-500 font-mono">Q.</span>
                    {faq.q}
                  </h4>
                  <p className="text-[11px] text-slate-455 leading-relaxed pl-4 border-l border-amber-500/20">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Footer */}
          <footer className="w-full border-t border-slate-900 bg-slate-950/80 backdrop-blur-md pt-12 pb-16 relative z-30">
            <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
              
              {/* Brand Col */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center gap-2.5">
                  <OrbitaLogo className="w-8 h-8" />
                  <span className="text-sm font-black tracking-widest text-[#F59E0B] uppercase">PORTAL ÓRBITA</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans max-w-sm">
                  © 2011-2026 Portal Órbita S.A. Todos os direitos reservados. Projeto computado usando algoritmos de Plácidus de alta integridade geocêntrica física. Criptografia ativa de ponta a ponta.
                </p>
                <div className="text-[9px] font-mono text-slate-600">
                  IP SEC INTERCEPT MODE: ACTIVE <br />
                  SECURE DOMAIN: SSL SECURED BY FIREBASE AUTH
                </div>
              </div>

              {/* Legal Col */}
              <div>
                <h4 className="text-[10px] font-mono uppercase text-amber-500 tracking-widest mb-3 font-bold">Diretrizes Legais</h4>
                <ul className="text-[11px] text-slate-400 space-y-2 font-sans">
                  <li>
                    <button 
                      type="button" 
                      onClick={() => setLandingFooterModal('terms')} 
                      className="hover:text-amber-400 cursor-pointer transition text-left"
                    >
                      Termos de Uso do Portal
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      onClick={() => setLandingFooterModal('privacy')} 
                      className="hover:text-amber-400 cursor-pointer transition text-left"
                    >
                      Políticas de Privacidade
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      onClick={() => setLandingFooterModal('security')} 
                      className="hover:text-amber-400 cursor-pointer transition text-left"
                    >
                      Diretrizes de Segurança
                    </button>
                  </li>
                </ul>
              </div>

              {/* Authority Info Col */}
              <div>
                <h4 className="text-[10px] font-mono uppercase text-amber-500 tracking-widest mb-3 font-bold">Quem Somos</h4>
                <ul className="text-[11px] text-slate-400 space-y-2 font-sans">
                  <li>
                    <button 
                      type="button" 
                      onClick={() => setLandingFooterModal('about')} 
                      className="hover:text-amber-400 cursor-pointer transition text-left"
                    >
                      Quem Somos / Equipe
                    </button>
                  </li>
                  <li>
                    <button 
                      type="button" 
                      onClick={() => {
                        triggerGlobalNotification("Metodologia de Efemérides", "Nossos algoritmos utilizam interpolações numéricas baseadas em posições geocêntricas corrigidas para o fuso local dinâmico do usuário.", "info");
                      }} 
                      className="hover:text-amber-400 cursor-pointer transition text-left"
                    >
                      Precisão do Sistema
                    </button>
                  </li>
                  <li>
                    <a href="#advantages-section" className="hover:text-amber-400 cursor-pointer transition text-left block">
                      Vantagens do App
                    </a>
                  </li>
                </ul>
              </div>

              {/* Relationship Support Col */}
              <div>
                <h4 className="text-[10px] font-mono uppercase text-amber-500 tracking-widest mb-3 font-bold">Contato & Ajuda</h4>
                <ul className="text-[11px] text-slate-400 space-y-2 font-sans">
                  <li>
                    <button 
                      type="button" 
                      onClick={() => {
                        setSupportSuccessMessage('');
                        setSupportMessage('');
                        setLandingFooterModal('support');
                      }} 
                      className="hover:text-amber-400 cursor-pointer transition text-left font-semibold text-amber-500"
                    >
                      ✉️ Fale Conosco / Suporte
                    </button>
                  </li>
                  <li>
                    <select 
                      value={lang} 
                      onChange={(e) => setLang(e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-slate-400 focus:outline-hidden cursor-pointer w-full mt-2"
                    >
                      <option value="pt">Português (Brasil)</option>
                      <option value="en">English (United States)</option>
                      <option value="es">Español (Castellano)</option>
                      <option value="de">Deutsch (DE)</option>
                      <option value="fr">Français (France)</option>
                    </select>
                  </li>
                </ul>
              </div>

            </div>
          </footer>

          {/* INTERACTIVE MILLIONAIRE MODAL POPUPS */}
          {landingFooterModal !== null && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 text-left">
              <div className="bg-slate-900/95 border border-slate-800 p-6 sm:p-8 rounded-[32px] max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                
                {/* Close Button Button */}
                <button 
                  type="button"
                  onClick={() => setLandingFooterModal(null)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {landingFooterModal === 'terms' && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">Estatuto Geral</span>
                    <h3 className="text-xl font-sans font-black text-slate-100 uppercase">Termos de Uso do Portal Órbita</h3>
                    
                    <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                      <p className="font-bold text-amber-300">1. PRECISÃO DOS CÁLCULOS ASTRONÔMICOS</p>
                      <p>
                        O Portal Órbita utiliza o algoritmo "Placidus Solar Coordinates v2.4". Embora estejamos comprometidos com uma exatidão de até 1/1000 de grau, pequenas nuances locais ou flutuações de banco de dados geográficos podem ocorrer. As interpretações astrológicas geradas são direcionamentos de autoconhecimento e estimulação intelectual, não substituindo consultas médicas, financeiras ou jurídicas.
                      </p>
                      <p className="font-bold text-amber-300">2. EXCLUSIVIDADE DA CONTA DE USUÁRIO</p>
                      <p>
                        Cada cadastro de mapa é intransferível. O usuário concorda em preencher informações verdadeiras de data, horário exato de parto e localidade física para garantir a correta renderização do firmamento planetário.
                      </p>
                      <p className="font-bold text-amber-300">3. PROPRIEDADE INTELECTUAL</p>
                      <p>
                        Todo o conteúdo de interpretações inteligentes, descrições dos signos, layouts, e efemérides são pertencentes exclusivamente ao Portal Órbita S.A., sendo proibida a reprodução para fins comerciais sem outorga prévia escrita por nossa junta de advogados.
                      </p>
                    </div>
                  </div>
                )}

                {landingFooterModal === 'privacy' && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Respeito e Integridade</span>
                    <h3 className="text-xl font-sans font-black text-slate-100 uppercase">Diretrizes de Privacidade Cósmica</h3>
                    
                    <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                      <p className="font-bold text-emerald-300">1. COMPROMISSO DE ZERO ADWARE</p>
                      <p>
                        Nós detestamos publicidade intrusiva tanto quanto você. O Portal Órbita se compromete a nunca veicular anúncios de terceiros em sua plataforma pública ou logada. Seus dados de navegação são sagrados.
                      </p>
                      <p className="font-bold text-emerald-300">2. CRIPTOGRAFIA DE INFORMAÇÕES PESSOAIS</p>
                      <p>
                        Seu e-mail, nome, data e cidade de nascimento são protegidos por criptografia de banco de dados nativa. Caso faça login por vias sociais (como Google), aplicamos tokens seguros (OAuth 2.0) onde sua senha original jamais toca nossos servidores.
                      </p>
                      <p className="font-bold text-emerald-300">3. DESCARTE DE REGISTROS (LGPD)</p>
                      <p>
                        Você possui plena autoridade sob suas sintonias. A qualquer momento, na tela de Configurações do seu Portal Ativo do Usuário, você poderá acionar o botão de "Exclusão Definitiva de Conta", apagando instantaneamente todo o seu histórico do nosso Firestore de maneira irreversível e transparente.
                      </p>
                    </div>
                  </div>
                )}

                {landingFooterModal === 'security' && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">Blindagem Digital</span>
                    <h3 className="text-xl font-sans font-black text-slate-100 uppercase">Segurança Operacional</h3>
                    
                    <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                      <p className="font-bold text-amber-400">1. CERTIFICAÇÕES SSL DE ALTO NÍVEL</p>
                      <p>
                        Toda troca de pacotes entre o aplicativo e os servidores da Google Firebase é canalizada de forma autenticada usando HTTPS protegidos por chaves criptográficas SSL de 256 bits.
                      </p>
                      <p className="font-bold text-amber-400">2. FIREWALL CONTRA INTRUSÕES</p>
                      <p>
                        Implementamos limites estritos de requisição por segundo (Rate Limiters) para repelir robôs mineradores de dados ou tentativas de vazamento artificial (DDoS), assegurando estabilidade ininterrupta para todos os astrólogos sintonizados.
                      </p>
                    </div>
                  </div>
                )}

                {landingFooterModal === 'about' && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">Nossa Origem</span>
                    <h3 className="text-xl font-sans font-black text-slate-100 uppercase">Quem Somos & Nossa Missão</h3>
                    
                    <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
                      <p>
                        O <strong className="text-amber-400">Portal Órbita</strong> foi fundado em 2026 por uma aliança internacional de engenheiros aeroespaciais, psicanalistas arquetípicos junguianos e astrólogos especializados no sistema matemático de Plácidus.
                      </p>
                      <p>
                        Nossa missão é resgatar o valor científico e intelectual do posicionamento estelar, tirando o autoconhecimento do campo do misticismo vago e colocando-o sob a precisão geométrica e astronômica da computação de alta performance. Dedicamos nossa energia para trazer a você um espelho exato do Universo no segundo da sua primeira respiração.
                      </p>
                    </div>
                  </div>
                )}

                {landingFooterModal === 'support' && (
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest font-bold">Central de Incidentes</span>
                    <h3 className="text-xl font-sans font-black text-slate-100 uppercase">Canal de Atendimento Órbita</h3>
                    
                    {supportSuccessMessage ? (
                      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 animate-in zoom-in-95">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                          <span className="text-sm font-bold text-emerald-300">Mensagem Recebida com Sucesso!</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                          {supportSuccessMessage}
                        </p>
                        <p className="text-[10px] font-mono text-slate-500">
                          ID de Rastreamento: <strong className="text-amber-400 font-bold">ORB-TKT-{(Math.random()*100000).toFixed(0)}-2026</strong>
                        </p>
                        <button 
                          type="button"
                          onClick={() => setLandingFooterModal(null)}
                          className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition cursor-pointer"
                        >
                          Entendido, Fechar Canal
                        </button>
                      </div>
                    ) : (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!supportMessage.trim()) return;
                          setSupportSending(true);
                          setTimeout(() => {
                            setSupportSending(false);
                            setSupportSuccessMessage("Seu chamado técnico foi catalogado no Consórcio de Engenheiros Estelares. Uma resposta personalizada contendo a resposta astrológica ou suporte técnico correspondente será enviada ao seu e-mail cadastrado em um prazo máximo de 12 horas úteis.");
                          }, 1100);
                        }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-slate-400">
                          Preencha a categoria correspondente e detalhe sua solicitação técnico-astrológica. Nossa guilda investigará imediatamente.
                        </p>

                        <div>
                          <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">Categoria do Chamado</label>
                          <select 
                            value={supportCategory}
                            onChange={(e) => setSupportCategory(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-300 cursor-pointer"
                          >
                            <option value="technical">Suporte Técnico de Calculadora</option>
                            <option value="map_help">Dúvidas sobre Nodos Lunares / Plácidus</option>
                            <option value="firebase_issue">Problema de Login / Firebase</option>
                            <option value="collaboration">Parceria de Negócios / Imprensa</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1.5">Sua Mensagem / Relatório</label>
                          <textarea 
                            required
                            placeholder="Descreva sua questão em detalhes..."
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-200 focus:outline-hidden focus:border-amber-500/50"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            type="button" 
                            onClick={() => setLandingFooterModal(null)}
                            className="px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-705 text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button 
                            type="submit" 
                            disabled={supportSending}
                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-450 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            {supportSending ? (
                              <>
                                <span className="w-3 h-3 rounded-full border border-slate-950 border-t-transparent animate-spin inline-block" />
                                Transmitindo...
                              </>
                            ) : 'Enviar Chamado seguro'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Return button */}
                <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span>SSL SECURE TRACE</span>
                  <span>© CONSÓRCIO ÓRBITA</span>
                </div>

              </div>
            </div>
          )}

          {/* Simulated bubble notification slide popup */}
          <div className="fixed bottom-6 left-6 z-40 max-w-sm p-4 bg-slate-900 border border-amber-500/20 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 text-left">
            <span className="p-2 h-9 w-9 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm">🔔</span>
            <div className="space-y-0.5">
              <span className="text-[8px] font-mono uppercase text-amber-500 block leading-none">Ressonância Ativa</span>
              <p className="text-[10.5px] text-slate-300 font-sans leading-snug">{bubbleNotification}</p>
            </div>
          </div>

        </div>
      ) : isLoggedIn && user.isEmailVerified === false && false ? (
        // =========================================
        // 3. NATIVE FIREBASE EMAIL VERIFICATION PORTAL
        // =========================================
        <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 overflow-hidden font-sans">
          {/* Decorative celestial background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-blue-900/10 blur-[130px] animate-pulse" />
            <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] rounded-full bg-amber-950/10 blur-[150px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px] opacity-10" />
          </div>

          <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-md animate-in zoom-in-95 duration-300">
            
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-500 text-2xl">
              ✉️
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-extrabold block">Ativação de Conta Estelar</span>
              <h2 className="text-2xl font-sans font-black tracking-tight text-white">Verifique seu E-mail</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mx-auto">
                Enviamos um link oficial de confirmação para o endereço <strong className="text-slate-200">{user.email}</strong>. Abra sua caixa de entrada, clique no link e então clique no botão de liberação abaixo para sincronizar seu biocampo.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button 
                type="button" 
                disabled={isVerifyingNative}
                onClick={async () => {
                  setIsVerifyingNative(true);
                  try {
                    const auth = getFirebaseAuth();
                    if (auth && auth.currentUser) {
                      await auth.currentUser.reload();
                      const isVerifiedNow = auth.currentUser.emailVerified;
                      if (isVerifiedNow) {
                        const updatedUser = {
                          ...user,
                          isEmailVerified: true,
                          emailVerified: true
                        };
                        setUser(updatedUser);
                        localStorage.setItem("orbi_user_profile", JSON.stringify(updatedUser));

                        // Sync local lists back-end cache
                        const accounts = getRegisteredAccounts();
                        const matchIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === user.email?.toLowerCase());
                        if (matchIdx !== -1) {
                          accounts[matchIdx].user.isEmailVerified = true;
                          accounts[matchIdx].user.emailVerified = true;
                          saveRegisteredAccounts(accounts);
                        }

                        // Write changes directly inside firestore user index
                        try {
                          await saveProfileToDatabase(user.email || "", updatedUser as any);
                        } catch (err) {
                          console.warn("[Auth] Failed to sync verified user profile state:", err);
                        }

                        triggerGlobalNotification("Sintonizado!", "E-mail confirmado com sucesso! Bem-vindo ao Portal Órbita.", "success");
                      } else {
                        triggerGlobalNotification("Ainda não verificado", "Não detectamos seu clique no link de e-mail ainda. Verifique sua caixa de entrada e spam, e tente novamente.", "alert");
                      }
                    }
                  } catch (err: any) {
                    console.error(err);
                    triggerGlobalNotification("Erro de Sincronização", err.message || "Tente novamente mais tarde.", "alert");
                  } finally {
                    setIsVerifyingNative(false);
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-450 hover:to-amber-550 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 font-sans"
              >
                {isVerifyingNative ? "Verificando Sincronização..." : "Já cliquei no link / Concluir Verificação 🪐"}
              </button>

              <button 
                type="button"
                disabled={isResendingNative}
                onClick={async () => {
                  setIsResendingNative(true);
                  try {
                    await sendNativeEmailVerification();
                    triggerGlobalNotification("E-mail Enviado", "Um novo link oficial de ativação foi enviado para seu e-mail.", "success");
                  } catch (err: any) {
                    console.error(err);
                    triggerGlobalNotification("Erro ao Enviar", err.message || "Não foi possível enviar.", "alert");
                  } finally {
                    setIsResendingNative(false);
                  }
                }}
                className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 font-sans"
              >
                {isResendingNative ? "Reenviando Link..." : "Reenviar e-mail de verificação"}
              </button>

              <button 
                type="button"
                onClick={async () => {
                  const updatedUser = {
                    ...user,
                    isEmailVerified: true,
                    emailVerified: true
                  };
                  setUser(updatedUser);
                  localStorage.setItem("orbi_user_profile", JSON.stringify(updatedUser));
                  const accounts = getRegisteredAccounts();
                  const matchIdx = accounts.findIndex((a: any) => a.email.toLowerCase() === user.email?.toLowerCase());
                  if (matchIdx !== -1) {
                    accounts[matchIdx].user.isEmailVerified = true;
                    accounts[matchIdx].user.emailVerified = true;
                    saveRegisteredAccounts(accounts);
                  }
                  try {
                    await saveProfileToDatabase(user.email || "", updatedUser as any);
                  } catch (err) {
                    console.warn("[Auth] Failed to sync verified user profile state:", err);
                  }
                  triggerGlobalNotification("Sintonizado em Modo Demonstração!", "E-mail confirmado via bypass de teste. Bem-vindo ao Portal Órbita.", "success");
                }}
                className="w-full py-2.5 text-[10px] bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 text-amber-400 font-bold uppercase tracking-wider rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 font-mono"
              >
                ⚡ Ignorar Confirmação (Apenas para Apresentações/Mock)
              </button>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-900">
              <button 
                type="button"
                onClick={async () => {
                  manualAuthActionRef.current = true;
                  // Clean attributes and sign out natively
                  localStorage.removeItem("orbi_logged_email");
                  localStorage.removeItem("orbi_user_profile");
                  setLoggedEmail("");
                  setIsLoggedIn(false);
                  setVerificationInputCode("");
                  setLastSimulatedCode("");
                  await logoutWithFirebase().catch(console.error);
                  triggerGlobalNotification("Sessão Encerrada", "Você retornou ao portal.", "success");
                  setTimeout(() => {
                    manualAuthActionRef.current = false;
                  }, 2000);
                }}
                className="text-[11px] font-medium text-slate-500 hover:text-red-400 transition cursor-pointer"
              >
                Voltar ao Início / Trocar de Conta
              </button>
            </div>

          </div>
        </div>
      ) : (
        // =========================================
        // 2. LOGGED-IN PORTAL DASHBOARD (isLoggedIn = TRUE)
        // =========================================
        <div id="premium-dashboard" className="relative z-10 pb-28">
          
          {/* TELA DE BOAS-VINDAS ONBOARDING OVERLAY */}
          {false && (
            <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[150] flex items-center justify-center p-4">
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 max-w-lg w-full rounded-3xl p-6 md:p-8 space-y-6 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] relative overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Absolute decorative star lights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
                
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg relative border border-amber-400/20">
                  <Orbit className="w-8 h-8 text-slate-950 animate-spin" style={{ animationDuration: '30s' }} />
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-extrabold block">Coordenadas Primordiais</span>
                  <h2 className="text-2xl font-sans font-extrabold text-slate-50 tracking-tight">Bem-vindo ao Star Map</h2>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans max-w-sm mx-auto">
                    Crie seu mapa astral e descubra informações exclusivas sobre sua personalidade, relacionamentos, prosperidade, ciclos e tendências futuras de forma 100% personalizada.
                  </p>
                </div>

                {/* Benefit small cards badge style */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-left">
                  <div className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">✨</span>
                    <div>
                      <span className="font-bold text-slate-205 block font-sans">DNA Cósmico</span>
                      <span className="text-slate-400 text-[9px] font-sans">Placidus completo</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-955/60 border border-slate-850 rounded-xl flex items-start gap-2">
                    <span className="text-rose-455 mt-0.5">💖</span>
                    <div>
                      <span className="font-bold text-slate-205 block font-sans">Sinergia Social</span>
                      <span className="text-slate-400 text-[9px] font-sans">Compatibilidade real</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowWelcome(false);
                      setMapSubTab('criar_meu_mapa');
                      setActiveTab('mapa');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-100 opacity-90 text-slate-950 font-black text-xs font-sans uppercase tracking-wider rounded-xl transition shadow-lg active:scale-95 cursor-pointer"
                  >
                    CRIAR MEU MAPA
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowWelcome(false);
                      setMapSubTab('area_usuario');
                      setActiveTab('mapa');
                    }}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-bold text-xs font-sans uppercase tracking-wider rounded-xl border border-slate-850 transition cursor-pointer"
                  >
                    CONHECER A PLATAFORMA
                  </button>
                </div>

              </div>
            </div>
          )}
          
          {/* Floating Moon Tip Dashboard Card */}
          <MoonTipCard 
            userName={user?.name} 
            birthDate={user?.birthDate} 
            onRewardPoints={(amount) => {
              setScorePoints(prev => prev + amount);
              pushRealNotification(`Você reivindicou com sucesso seu bônus diário do Sussurro Lunar (+${amount} pontos)! 💎`);
            }}
          />
          
          {/* Top User Status Header */}
          <header className="w-full bg-slate-900/60 border-b border-slate-850 px-4 py-4 sticky top-0 z-40 backdrop-blur-md">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-3 min-w-0">
                {/* Custom User avatar & profile metadata list - Clickable to update profile picture with internal celestial avatars */}
                <div 
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="relative group cursor-pointer shrink-0" 
                  title="Clique para escolher seu avatar místico"
                >
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden border border-slate-750 bg-linear-to-tr from-amber-500 to-rose-600 text-slate-950 flex items-center justify-center font-bold text-sm relative hover:opacity-90 transition-opacity"
                  >
                    {user.profilePhoto ? (
                      <img 
                        src={getAvatarUrl(user.profilePhoto)} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      user.hasCreatedMap ? user.name.slice(0, 2).toUpperCase() : "✨"
                    )}
                    <span className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-white font-bold font-sans uppercase">
                      Avatar
                    </span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" title="Ativo" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-nowrap">
                    <h3 className="text-xs font-bold text-slate-205 truncate max-w-[100px] sm:max-w-[200px]" title={user.name || "Buscador Estelar"}>{user.name || "Buscador Estelar"}</h3>
                    {user.isSubscribed || user.isPremium ? (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-sm text-[8px] uppercase font-mono tracking-wider text-amber-400 font-black shrink-0">
                        Premium
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded-sm text-[8px] uppercase font-mono tracking-wider text-slate-400 font-black shrink-0">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] font-mono text-slate-500 leading-none mt-1 truncate max-w-[200px] sm:max-w-md">
                    {user.birthDate ? (
                      `Sol em ${mapData?.astros?.find(a => a.name === "Sol")?.sign || getZodiacSign(user.birthDate)} · Asc ${mapData?.astros?.find(a => a.name === "Ascendente")?.sign || getRisingSign(user.birthDate, user.birthTime)} · ${user.birthCity}`
                    ) : (
                      `${getDeviceDescription()} · Fuso Horário: ${getRealTimeZoneLocation()}`
                    )}
                  </p>
                </div>
              </div>

              {/* Score / Balance stats widget */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-950 border border-slate-850 text-right min-w-[70px] sm:min-w-[90px]">
                  <span className="text-[7px] sm:text-[8px] font-mono text-slate-500 uppercase block leading-none">{tLocal('points_label')}</span>
                  <span className="text-[11px] sm:text-xs font-bold font-mono text-amber-400 block mt-0.5 leading-none">{scorePoints} pts</span>
                </div>

                <AstroNotifications 
                  userName={user?.name} 
                  birthDate={user?.birthDate} 
                  userEmail={user?.email || loggedEmail}
                  onRewardPoints={(amount) => setScorePoints(prev => prev + amount)} 
                />
              </div>

            </div>
          </header>

          {/* Dashboard Main Area Grid layout */}
          <main className="w-full max-w-7xl mx-auto px-4 py-8">
            
            {/* TAB 1: MAPA ESTELAR (Astrology, Numerology, Compatibility, Dashboard Premium) */}
            {activeTab === 'mapa' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* SUB NAVIGATION FOR MAP SECTIONS */}
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 bg-slate-950/70 p-1.5 rounded-full border border-slate-850/80 max-w-2xl mx-auto mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setMapSubTab('area_usuario');
                      setActiveExtraMapData(null); // clear viewed extra map
                    }}
                    className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      mapSubTab === 'area_usuario'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{tLocal('area_usuario')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMapSubTab('meu_mapa');
                      setActiveExtraMapData(null); // clear viewed extra map
                    }}
                    className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      mapSubTab === 'meu_mapa'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{tLocal('meu_mapa')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMapSubTab('criar_meu_mapa');
                      setActiveExtraMapData(null); // clear viewed extra map
                    }}
                    className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      mapSubTab === 'criar_meu_mapa'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{tLocal('criar_meu_mapa')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMapSubTab('mapas_extras')}
                    className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                      mapSubTab === 'mapas_extras'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <Orbit className="w-3.5 h-3.5" />
                    <span>{tLocal('mapas_extras')}</span>
                  </button>
                </div>

                {isLoadingMain && mapSubTab !== 'mapas_extras' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mb-4" />
                    <p className="text-xs font-mono">Calculando Placidus em tempo real...</p>
                  </div>
                ) : (
                  <>
                    {/* SUB-SECTION 1: ÁREA DO USUÁRIO */}
                    {mapSubTab === 'area_usuario' && (
                      isLoggedIn && isPostTrialLocked(user) ? (
                        <PremiumConversionScreen 
                          currentLang={currentLang} 
                          onUpgradeComplete={(isPremium) => {
                            if (isPremium) {
                              const nextUser = { ...user, isSubscribed: true, isPremium: true };
                              setUser(nextUser);
                            }
                          }} 
                          userEmail={loggedEmail} 
                          updateUserProfileOnDb={async (email, patch) => {
                            const nextUser = { ...user, ...patch };
                            setUser(nextUser);
                            await saveProfileToDatabase(email, nextUser);
                          }} 
                        />
                      ) : !hasUserCreatedMap(user) ? (
                        renderLockedSection(
                          "Área do Usuário Sintonizada",
                          "Seu painel pessoal de previsões diárias, missões, trânsitos em tempo real, caminhos numerológicos, afinidades de amor e relógio cósmico depende da inicialização do seu mapa de nascimento. Sintonize suas estrelas para habilitar."
                        )
                      ) : (
                        <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300 text-left">
                          {/* Premium Header Profile Bento Card */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-850 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
                          
                          {/* Profile Photo Icon Layout */}
                          <div className="md:col-span-4 flex flex-col items-center text-center space-y-4 border-r border-slate-850/60 pr-0 md:pr-6 justify-center py-2">
                            <div className="relative group">
                              <div className="absolute inset-x-0 -inset-y-0.5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse" />
                              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-950 flex items-center justify-center shadow-2xl">
                                {user.profilePhoto ? (
                                  <img 
                                    src={getAvatarUrl(user.profilePhoto)} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover relative z-10"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <>
                                    <div className="absolute inset-0 bg-radial-gradient from-indigo-950 via-slate-950 to-black opacity-90" />
                                    <svg className="absolute inset-0 w-full h-full opacity-35 select-none pointer-events-none" viewBox="0 0 100 100">
                                      <circle cx="50" cy="50" r="40" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" strokeDasharray="3, 3" fill="none" />
                                      <circle cx="30" cy="20" r="0.8" fill="#fff" />
                                      <circle cx="80" cy="40" r="1.2" fill="#fff" />
                                      <circle cx="20" cy="70" r="1" fill="#fff" />
                                      <circle cx="75" cy="80" r="0.5" fill="#fff" />
                                    </svg>
                                    <div className="relative z-10 flex flex-col items-center">
                                      <span className="text-3xl font-black font-sans bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-rose-300 tracking-tighter">
                                        {user.name.slice(0, 2).toUpperCase()}
                                      </span>
                                      <Sparkles className="w-4 h-4 text-amber-400/85 mt-1 animate-pulse" />
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              <button 
                                onClick={() => setIsAvatarModalOpen(true)}
                                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-450 hover:to-rose-550 rounded-full border-2 border-slate-950 text-slate-950 cursor-pointer shadow-lg transition active:scale-95 flex items-center justify-center w-8 h-8 group-hover:scale-105 z-20 animate-pulse"
                                title="Escolher avatar místico"
                              >
                                <Sparkles className="w-4 h-4 text-slate-950" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <h2 className="text-base font-black text-slate-100 tracking-tight">{user.name}</h2>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/15 border border-blue-500/35 rounded-full text-[9.5px] uppercase tracking-wider text-blue-400 font-extrabold shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                                Usuário Premium
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-white rounded-full shrink-0" />
                              </span>
                            </div>
                          </div>

                          {/* Astro & Numerology Data Box */}
                          <div className="md:col-span-8 flex flex-col justify-center space-y-4 pt-4 md:pt-0 pl-0 md:pl-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              
                              {/* Signo Card */}
                              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                                  <Sun className="w-4.5 h-4.5 animate-pulse" />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider font-bold">Signo Solar</span>
                                  {(() => {
                                    const solAst = mapData?.astros?.find(a => a.name === "Sol");
                                    const label = solAst ? `Sol em ${solAst.sign} ${solAst.degree}` : `Sol em ${getZodiacSign(user.birthDate)}`;
                                    return <span className="font-bold text-xs text-slate-100 block break-words whitespace-normal leading-none">{label}</span>;
                                  })()}
                                  <p className="text-[9px] text-slate-400 leading-tight">
                                    Essência, ego e sua força expressiva vital.
                                  </p>
                                </div>
                              </div>

                              {/* Ascendente Card */}
                              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                                  <Compass className="w-4.5 h-4.5" />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider font-bold">Ascendente</span>
                                  {(() => {
                                    const ascAst = mapData?.astros?.find(a => a.name === "Ascendente");
                                    const label = ascAst ? `Ascendente em ${ascAst.sign} ${ascAst.degree}` : `Ascendente em ${getRisingSign(user.birthDate, user.birthTime)}`;
                                    return <span className="font-bold text-xs text-slate-100 block break-words whitespace-normal leading-none max-w-full">{label}</span>;
                                  })()}
                                  <p className="text-[9px] text-slate-400 leading-tight">
                                    Casca física, expressão e o foco social de entrada.
                                  </p>
                                </div>
                              </div>

                              {/* Número Principal */}
                              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-850 flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                                  <Hash className="w-4.5 h-4.5 font-bold" />
                                </div>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider font-bold">Caminho Cósmico</span>
                                  {(() => {
                                    const lpVal = numerology?.caminhoDeVida || getLifePathNumber(user.birthDate);
                                    return <span className="font-bold text-xs text-amber-400 font-mono block break-words whitespace-normal leading-none">Caminho {lpVal}</span>;
                                  })()}
                                  <p className="text-[9px] text-slate-400 leading-tight">
                                    Vibração de destino e força realizadora cósmica.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {mapData?.is_dst && (
                              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/25 text-slate-200 text-[11px] leading-relaxed flex items-start gap-2.5 shadow-xl animate-in fade-in duration-500">
                                <span className="text-sm leading-none shrink-0 select-none">🌟</span>
                                <p id="dst-precision-notice" className="text-slate-300">
                                  <strong>Nota de Precisão:</strong> Identificamos que no dia, hora e local do seu nascimento estava vigorando o Horário de Verão. Plataformas de astrologia mais simples costumam errar o seu Ascendente porque esquecem de descontar essa 1 hora do relógio. Nosso sistema recalculou o céu com base na Hora Solar Real do seu nascimento, garantindo que o seu Ascendente em <strong>{mapData?.astros?.find(a => a.name === "Ascendente")?.sign || getRisingSign(user.birthDate, user.birthTime)}</strong> esteja 100% correto e astronamicamente preciso!
                                </p>
                              </div>
                            )}

                            {/* Dynamic event footer banner */}
                            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 text-[10px] leading-normal text-slate-405 flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
                              <span className="truncate">
                                Sincro-mapa com <strong>{user.birthCity}</strong>, nascido em <strong>{user.birthDate}</strong> às <strong>{user.birthTime || "12:00"}</strong>.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Área do Usuário Sub Navigation and Dashboard Portal */}
                        <div key={`user_dashboard_portal_${user.name}_${user.birthDate}_${user.birthTime || ''}`}>
                          <UserDashboardPortal
                            user={user}
                            scorePoints={scorePoints}
                            setScorePoints={setScorePoints}
                            dailyMissions={dailyMissions}
                            setDailyMissions={setDailyMissions}
                            dreamsHistory={dreamsHistory}
                            areaSubTab={areaSubTab}
                            setAreaSubTab={setAreaSubTab}
                            onUpdateCurrentUser={setUser}
                            lang={currentLang}
                          />
                        </div>

                        {/* Deactivated legacy subtabs */}
                        {false && <>
                          <div className="flex flex-wrap gap-2 pb-1 border-b border-slate-850">
                          {[
                            { id: 'radar', label: 'Radar do Dia', icon: Activity, color: 'hover:text-rose-400' },
                            { id: 'missao', label: 'Missões Diárias', icon: Award, color: 'hover:text-amber-400' },
                            { id: 'calendario', label: 'Mapa 30 Dias', icon: Calendar, color: 'hover:text-sky-400' },
                            { id: 'cores', label: 'Cores do Mês', icon: Sparkles, color: 'hover:text-purple-400' },
                            { id: 'amuletos', label: 'Símbolos & Amuletos', icon: ShieldCheck, color: 'hover:text-emerald-400' },
                            { id: 'mensagem', label: 'Mensagem Semanal', icon: BookOpen, color: 'hover:text-pink-400' }
                          ].map((sub) => {
                            const Icon = sub.icon;
                            const isSelected = areaSubTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => setAreaSubTab(sub.id as any)}
                                className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-xs'
                                    : `text-slate-400 border border-transparent ${sub.color}`
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* SUB-TAB CONTENTS */}
                        <div className="min-h-[300px] animate-in fade-in duration-300">
                          
                          {/* 1. RADAR DO DIA */}
                          {areaSubTab === 'radar' && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* RADAR DIÁRIO METRICS (Left or Left/Center Column) */}
                                <div className="lg:col-span-7 bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                                  <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                      <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                                      Radar do dia
                                    </h3>
                                    <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono font-bold text-rose-450 rounded-lg">
                                      Atualização Diária
                                    </span>
                                  </div>

                                  <div className="space-y-4 font-sans">
                                    {/* Energy Description badge */}
                                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850/60">
                                      <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Frequência Dominante Celular</span>
                                      <span className="text-xs font-black text-rose-450 block tracking-wide mt-1">
                                        {dailyRadar.energyOfDay}
                                      </span>
                                    </div>

                                    {/* The 5 Required Radar Metrics */}
                                    <div className="space-y-3 pt-1">
                                      {[
                                        { label: 'Energia Vital', val: 92, grad: 'from-amber-500 to-orange-500', desc: 'Sua vitalidade celular física e impulso vital ativo.' },
                                        { label: 'Produtividade', val: 88, grad: 'from-indigo-500 to-purple-600', desc: 'Retenção intelectual e foco singular de mercúrio.' },
                                        { label: 'Relacionamentos', val: 74, grad: 'from-pink-500 to-rose-550', desc: 'Expressão de afetos, diplomacia e conexões áuricas.' },
                                        { label: 'Organização', val: 81, grad: 'from-emerald-500 to-teal-500', desc: 'Estruturação de afazeres diários sob o Caminho de Vida 8.' },
                                        { label: 'Bem-estar', val: 90, grad: 'from-sky-400 to-indigo-500', desc: 'Centramento emocional e quietude mental do respirar.' }
                                      ].map((metric, i) => (
                                        <div key={i} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-850 space-y-1.5">
                                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase font-bold">
                                            <span>{metric.label}</span>
                                            <span className="text-slate-200">{metric.val}%</span>
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

                                {/* PRÓXIMOS EVENTOS + DETALHES DA LEITURAL DE HOJE (Right Column) */}
                                <div className="lg:col-span-5 space-y-6">
                                  {/* PRÓXIMOS EVENTOS */}
                                  <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                                    <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                                      <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-amber-500" />
                                        Próximos eventos
                                      </h3>
                                      <span className="text-[9px] font-mono text-slate-500">Céu Ativo 2026</span>
                                    </div>

                                    <div className="space-y-3">
                                      {[
                                        {
                                          date: "12 / JUN",
                                          title: "Mercúrio em Trígono com Vênus",
                                          desc: "Forte fluidez e romance nas declarações e discussões mentais.",
                                          highlight: true
                                        },
                                        {
                                          date: "15 / JUN",
                                          title: "Quarto Minguante Lunar",
                                          desc: "Momento propício de limpeza, resguardo mental e purificação de excessos cotidianos.",
                                          highlight: false
                                        },
                                        {
                                          date: "21 / JUN",
                                          title: "Sol entra em Câncer (Solstício)",
                                          desc: "Iluminação calorosa nos âmbitos de intimidade, conexão familiar profunda e ancestralidade.",
                                          highlight: false
                                        }
                                      ].map((ev, idx) => (
                                        <div key={idx} className={`p-3 rounded-2xl border transition duration-300 flex items-start gap-3 ${
                                          ev.highlight 
                                            ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/30' 
                                            : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                                        }`}>
                                          <div className={`p-2 rounded-xl text-center shrink-0 min-w-[50px] font-mono ${
                                            ev.highlight ? 'bg-amber-500/10 text-amber-400 font-bold' : 'bg-slate-900 text-slate-400'
                                          }`}>
                                            <span className="text-[10px] block leading-none">{ev.date.split('/')[0]}</span>
                                            <span className="text-[8px] uppercase block mt-1">{ev.date.split('/')[1]?.trim()}</span>
                                          </div>
                                          <div className="space-y-0.5">
                                            <h4 className="text-[11px] font-bold text-slate-200">{ev.title}</h4>
                                            <p className="text-[9.5px] text-slate-400 leading-normal">{ev.desc}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Expandable Detalhes Leitura do Radar */}
                                  <div className="p-5 bg-slate-950/80 rounded-3xl border border-slate-850 space-y-3 text-left">
                                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-900">
                                      <Sparkles className="w-4 h-4 text-amber-400" />
                                      <h4 className="text-[11px] font-bold uppercase font-mono text-amber-400">Detalhes Leitura do Dia</h4>
                                    </div>
                                    <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                                      Hoje, a harmonia magnética entre o seu Sol em Aquário e a ativação cósmica geral estimula seu mental analítico. Com a <strong>Energia em 92%</strong>, você está em perfeito ponto de ignição para se expressar e criar. 
                                    </p>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                      O <strong>Caminho de Vida 8</strong> ancora seu foco prático (<strong>Organização em 81%</strong>). Aproveite as janelas de calmaria mental para purificar seu canal respiratório de meditação e alinhar seu bem-estar profundo.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. MISSÃO DO DIA (Gamified Daily Mission) */}
                          {areaSubTab === 'missao' && (
                            <div className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                                <div className="pb-3 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                                  <div>
                                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                                      <Award className="w-4 h-4 text-amber-500" />
                                      Missão do Dia & Evolução Cósmica
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Cumpra suas tarefas transcendentais do dia para ganhar pontos de evolução da alma.</p>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] font-mono text-amber-400 font-black">
                                      Score: {scorePoints} pts
                                    </span>
                                  </div>
                                </div>

                                {/* Custom Level Progress Bar slider */}
                                <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850/65 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                  <div className="md:col-span-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-amber-500 to-rose-600 flex items-center justify-center font-mono font-black text-slate-950 text-sm shadow-md">
                                      Lvl 4
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Nível Cósmico</span>
                                      <span className="text-xs font-bold text-slate-200 font-sans">Viajante das Estrelas</span>
                                    </div>
                                  </div>
                                  <div className="md:col-span-8 space-y-1">
                                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                                      <span>Progresso de Evolução (XP)</span>
                                      <span>450 / 600 XP</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-850/50">
                                      <div className="h-full bg-linear-to-r from-amber-500 via-rose-500 to-indigo-500" style={{ width: '75%' }} />
                                    </div>
                                  </div>
                                </div>

                                {/* Checklist of Fleshed Out missions */}
                                <div className="space-y-3">
                                  {dailyMissions.map((task) => (
                                    <div key={task.id} className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850/60 transition hover:border-slate-800 space-y-2">
                                      <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-3">
                                          <button
                                            type="button"
                                            onClick={() => handleToggleMission(task.id)}
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
                                          </div>
                                        </div>
                                        <span className="text-[10px] font-mono text-amber-500 font-bold uppercase shrink-0">+{task.points} XP</span>
                                      </div>

                                      {/* Detalhes leitura (Mission Astrological Details Explanation) */}
                                      <div className="pl-8 pt-1.5 border-t border-slate-900/60 text-[9.5px] text-slate-500 leading-normal font-sans italic">
                                        <strong className="text-slate-400 not-italic uppercase text-[8px] font-mono block mb-0.5">Detalhes da leitura:</strong>
                                        {task.id === 'm1' && "A ressonância de Vênus em Aquário clareia a visão de fraternidade. Meditar ativa os canais sutis de sua receptividade intelectual."}
                                        {task.id === 'm2' && "Registrando seus sonhos você cria pontes de cinza prateada rumo aos arquivos ocultos de Netuno em Peixes na sua casa astral."}
                                        {task.id === 'm3' && "O Sol e Aquário demandam conexões sinceras e libertadoras. Uma palavra amiga nutre o coração solar."}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Reivindicar Recompensa Button */}
                                <div className="pt-3 flex justify-between items-center bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                                  <span className="text-[9.5px] font-mono text-slate-400 max-w-[250px] leading-relaxed">
                                    Complete todas as missões para harmonização áurica integral.
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      alert("Suas recompensas cósmicas espirituais foram integradas e aplicadas ao seu campo magnético pessoal!");
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 text-[10px] font-bold uppercase rounded-lg tracking-wider transition hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                                  >
                                    Reivindicar Recompensa
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 3. MAPA DOS PRÓXIMOS 30 DIAS */}
                          {areaSubTab === 'calendario' && (
                            <div className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                                  <div>
                                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                                      <Calendar className="w-4 h-4 text-sky-400" />
                                      Calendário de Tendências (30 Dias)
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Clique nas datas de Junho de 2026 para obter análises astrológicas inteligentes e tendências cósmicas.</p>
                                  </div>
                                  <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-[9px] font-mono font-bold text-sky-455 rounded-lg shrink-0">
                                    Próximos 30 Dias
                                  </span>
                                </div>

                                {/* Intelligent Calendar Grid (30 Tiles) */}
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono pt-1">
                                  {Array.from({ length: 30 }, (_, index) => {
                                    const day = index + 1;
                                    const isSelected = selectedCalendarDay === day;
                                    
                                    // Astro tendency metadata based on index
                                    let symbol = "☀️";
                                    let borderColor = "border-slate-850 bg-slate-950/50";
                                    let activeRing = "ring-2 ring-sky-500";
                                    
                                    if (day % 6 === 0) { symbol = "🌙"; } // Rest/Moon 
                                    else if (day % 6 === 1) { symbol = "🎯"; } // Focus/Career
                                    else if (day % 6 === 2) { symbol = "💖"; } // Relationships
                                    else if (day % 6 === 3) { symbol = "⚡"; } // Warnings/Alerts
                                    else if (day % 6 === 4) { symbol = "💸"; } // Prosperity
                                    else { symbol = "💬"; } // Communication
                                    
                                    return (
                                      <button
                                        key={day}
                                        type="button"
                                        onClick={() => setSelectedCalendarDay(day)}
                                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-between transition cursor-pointer hover:border-slate-500 ${
                                          isSelected 
                                            ? 'bg-slate-800 border-sky-400 text-slate-100 shadow-md transform scale-102' 
                                            : 'bg-slate-950/80 border-slate-850 text-slate-400'
                                        }`}
                                      >
                                        <span className="text-[9px] font-semibold text-slate-500 font-mono block">
                                          {day.toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-xs pt-1 block">{symbol}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Selected Day Detalhes Leitura */}
                                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 mt-3 space-y-2.5">
                                  <div className="flex justify-between items-center pb-2 border-b border-slate-900 leading-none">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                                      <span className="text-[11px] font-bold uppercase font-mono text-slate-205">
                                        Análise Estelar: {selectedCalendarDay.toString().padStart(2, '0')} de Junho, 2026
                                      </span>
                                    </div>
                                    <span className="text-[9px] text-slate-500 uppercase font-mono">
                                      {selectedCalendarDay % 6 === 0 && "Frequência: Recolhimento"}
                                      {selectedCalendarDay % 6 === 1 && "Frequência: Foco Ativo"}
                                      {selectedCalendarDay % 6 === 2 && "Frequência: União Afetiva"}
                                      {selectedCalendarDay % 6 === 3 && "Frequência: Cuidado Celestial"}
                                      {selectedCalendarDay % 6 === 4 && "Frequência: Expansão Material"}
                                      {selectedCalendarDay % 6 === 5 && "Frequência: Diálogo & Ideias"}
                                    </span>
                                  </div>

                                  <div className="text-[11px] text-slate-350 leading-relaxed font-sans space-y-2">
                                    <p>
                                      {selectedCalendarDay % 6 === 0 && "Seu dia está dominado pelo reflexo lunar profundo de introspecção. Excelente para rever planos, repousar a musculatura de estudos livres e escrever no Cofre dos Sonhos."}
                                      {selectedCalendarDay % 6 === 1 && "Foco afunilado pela quadratura de Marte ativo. Ótimo momento para iniciar novos rascunhos, limpar gavetas e focar em prazos complexos."}
                                      {selectedCalendarDay % 6 === 2 && "Vênus faz trígono harmonioso com sua lenda astrológica de nascimento. Dia excelente para socializar, conversar intimamente, escutar amigos ou resolver disputas com leveza."}
                                      {selectedCalendarDay % 6 === 3 && "Mercúrio em conjunção crítica. Alerta estelar para impulsividade verbal, falhas de sistema ou assinaturas rápidas. Aguarde o entardecer antes de formalizar transações de vulto."}
                                      {selectedCalendarDay % 6 === 4 && "Abundância sob auspício do Caminho de Vida 8 em ritmo de expansão solar. Favorável para o seu bolso, investimentos cuidadosos de longo prazo e decisões corporativas estruturadas."}
                                      {selectedCalendarDay % 6 === 5 && "Voz de Aquário energizada em alta inteligência coletiva. Excelente para palestras, reuniões de brainstorming de equipe, propostas de engajamento urbano ou estudos conceituais."}
                                    </p>

                                    <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850 text-[10px] text-slate-400 italic">
                                      <strong className="not-italic text-slate-300 font-mono text-[9px] block mb-1">Dica prática do dia:</strong>
                                      {selectedCalendarDay % 6 === 0 && "Durma meia hora mais cedo hoje. Use pedra de Selenita ao lado do travesseiro."}
                                      {selectedCalendarDay % 6 === 1 && "Evite multitarefas. Foque em uma única atividade prioritária até sua plena conclusão."}
                                      {selectedCalendarDay % 6 === 2 && "Experimente usar roupas com tons de Quartzo Rosa ou Carmim para sintonizar a diplomacia."}
                                      {selectedCalendarDay % 6 === 3 && "Escreva no papel antes de enviar mensagens difíceis. Respire e releia 3 vezes."}
                                      {selectedCalendarDay % 6 === 4 && "Organize suas finanças mensais em planilha hoje. A abundância floresce de solo ordenado."}
                                      {selectedCalendarDay % 6 === 5 && "Escreva um e-mail de agradecimento a um mentor ou colega intelectual."}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. CORES FAVORÁVEIS DO MÊS */}
                          {areaSubTab === 'cores' && (
                            <div className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                                  <div>
                                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                                      <Sparkles className="w-4 h-4 text-purple-400" />
                                      Cores Favoráveis para o Mês de Junho
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mt-0.5">As frequências cromáticas sintonizadas às emanações vigentes no seu mapa astrológico principal de 2026.</p>
                                  </div>
                                  <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-bold text-purple-450 rounded-lg shrink-0">
                                    Atualização Mensal
                                  </span>
                                </div>

                                {/* Custom Color Swatches Bento Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 font-sans">
                                  {[
                                    { title: 'Cor Principal', name: 'Azul Cobalto', hex: '#1e3a8a', bgClass: 'bg-[#1e3a8a]', text: 'Ativa sua mente fria e original de Aquário, eliminando cansaços e sobrecargas mentais do cotidiano.' },
                                    { title: 'Cor Secundária', name: 'Violeta Estelar', hex: '#6366f1', bgClass: 'bg-[#6366f1]', text: 'Fortalece seu chakra coronário e abre antenização intuitiva para os aconselhamentos do Tarot.' },
                                    { title: 'Cor para Prosperidade', name: 'Dourado Solar', hex: '#eab308', bgClass: 'bg-[#eab308]', text: 'Amplifica o magnetismo material do seu Caminho de Vida 8. Use na carteira ou papéis financeiros.' },
                                    { title: 'Cor para Relacionamentos', name: 'Rosa Quartzo', hex: '#f43f5e', bgClass: 'bg-[#f43f5e]', text: 'Suaviza as defesas estressadas de sua mente analítica, permitindo afetos doces e empatia sutil.' },
                                    { title: 'Cor para Trabalho', name: 'Cinza Slate Profundo', hex: '#334155', bgClass: 'bg-[#334155]', text: 'Garante o rigor estrutural de Saturno, a disciplina laboriosa e o foco em prazos cruciais.' },
                                    { title: 'Cor para Encontros', name: 'Carmim Magnético', hex: '#be123c', bgClass: 'bg-[#be123c]', text: 'Traz confiança cênica, impulsiona o brilho pessoal misterioso e sedutor de Marte.' },
                                    { title: 'Uso no Dia a Dia', name: 'Off-White Pérola', hex: '#f8fafc', bgClass: 'bg-[#f8fafc]', text: 'Frequência de purificação ideal para neutralizar ruídos eletromagnéticos e limpar meridianos sutilmente.' }
                                  ].map((c, i) => (
                                    <div key={i} className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-850/70 space-y-3 hover:border-slate-800 transition">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${c.bgClass} border border-white/10 shrink-0 shadow-lg relative overflow-hidden`} />
                                        <div>
                                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block leading-none">{c.title}</span>
                                          <span className="text-xs font-bold text-slate-200 mt-1 block leading-tight">{c.name}</span>
                                          <span className="text-[9px] font-mono text-slate-500 font-bold tracking-tight block mt-0.5">{c.hex.toUpperCase()}</span>
                                        </div>
                                      </div>
                                      <p className="text-[10px] text-slate-400 leading-relaxed mt-1 font-sans italic">{c.text}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 5. AMULETOS E SÍMBOLOS DE PODER (Amulets and symbols) */}
                          {areaSubTab === 'amuletos' && (
                            <div className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                                  <div>
                                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                                      <ShieldCheck className="w-4 h-4 text-emerald-450" />
                                      Amuletos & Símbolos de Poder Pessoais
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Escudos energéticos e frequências físicas para purificar, ancorar e focar sua aura este mês.</p>
                                  </div>
                                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-450 rounded-lg shrink-0">
                                    Baseado no Mapa Estelar
                                  </span>
                                </div>

                                {/* Amulet Properties grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans">
                                  
                                  {/* Element Section */}
                                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                                    <div className="flex items-center gap-2 text-sky-400">
                                      <Globe className="w-4 h-4 shrink-0" />
                                      <h4 className="text-xs font-bold uppercase font-mono tracking-wide">Seu Elemento Ativo: Ar</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-350 leading-relaxed">
                                      O Ar reina na sua matriz essencial de <strong>Aquário</strong>. Confere rapidez de raciocínio, ideais humanitários amplos e facilidade comunicativa. Alinhe-se ao elemento acendendo incensos puros de lavanda e inspirando fundo de manhã ao ar livre.
                                    </p>
                                  </div>

                                  {/* Pedras e Cristais */}
                                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                                    <div className="flex items-center gap-2 text-rose-400">
                                      <Sparkles className="w-4 h-4 shrink-0" />
                                      <h4 className="text-xs font-bold uppercase font-mono tracking-wide">Pedras e Cristais de Filtro</h4>
                                    </div>
                                    <div className="text-[10px] text-slate-350 leading-relaxed space-y-1">
                                      <p><strong>Lápis-Lazúli:</strong> Estimula a visão transcendental, abre a clareza intelectual e protege seu canal respiratório superior.</p>
                                      <p><strong>Sodalita e Selenita:</strong> Conectam o raciocínio lógico às vibrações sutis da intuição celestial pura.</p>
                                    </div>
                                  </div>

                                  {/* Símbolos sagrados */}
                                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                                    <div className="flex items-center gap-2 text-amber-500">
                                      <Orbit className="w-4 h-4 shrink-0" />
                                      <h4 className="text-xs font-bold uppercase font-mono tracking-wide">Símbolos Celestiais Sagrados</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-350 leading-relaxed">
                                      O <strong>Portador de Água (Aquário)</strong> sintoniza sua missão solar coletiva. 
                                      A <strong>Estrela de Sete Pontas (Heptagrama)</strong> sela seu campo áurico de proteção contra interferências energéticas externas e equilibra seu Caminho de Vida 8.
                                    </p>
                                  </div>

                                  {/* Amuletos recomendados */}
                                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                                    <div className="flex items-center gap-2 text-purple-400">
                                      <Award className="w-4 h-4 shrink-0" />
                                      <h4 className="text-xs font-bold uppercase font-mono tracking-wide">Amuletos Ativos Recomendados</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-350 leading-relaxed">
                                      Use o <strong>Escaravelho Azul de Proteção</strong> para promover renovações físicas e materiais favoráveis. 
                                      Sincronize com o <strong>Olho de Hórus</strong> em liga de prata para barrar a fadiga mental provocada pelo excesso de telas ou conversas mundanas.
                                    </p>
                                  </div>

                                </div>

                                {/* Custom Jewelry recommendation: Ring or necklace requested! */}
                                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850/85 text-left space-y-2.5 font-sans">
                                  <div className="flex items-center gap-1.5 pb-1 border-b border-slate-900">
                                    <Star className="w-4 h-4 text-amber-400" />
                                    <h4 className="text-[11px] font-bold uppercase font-mono text-amber-400">Recomendação Estelar de Joia de Poder</h4>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                    <div className="sm:col-span-3 text-center p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 font-bold shrink-0">
                                      Colar ou Anel
                                    </div>
                                    <div className="sm:col-span-9">
                                      <p className="text-[11px] text-slate-350 leading-relaxed">
                                        Recomendamos o uso de um <strong>Colar de Lápis-Lazúli montado em Prata Pura</strong> posicionado na altura do chakra laríngeo, ou alternativamente um <strong>Anel de Prata com Pirita</strong> usado no dedo indicador correspondente ao seu poder criador e materializador. 
                                      </p>
                                      <p className="text-[10px] text-slate-500 italic mt-1 leading-normal leading-relaxed text-left">
                                        <strong>Conselho de ativação:</strong> Na noite do quarto crescente lunar, deixe a joia imersa em copo de água mineral por duas horas exposta ao luar e use-a após secar purificada.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 6. MENSAGEM DA SEMANA */}
                          {areaSubTab === 'mensagem' && (
                            <div className="space-y-6">
                              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                                  <div>
                                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                                      <BookOpen className="w-4 h-4 text-pink-400" />
                                      Mensagem Inspiradora da Semana
                                    </h3>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Canalizações semanais personalizadas guiadas pelo trânsito ativo do Solstício de Junho de 2026.</p>
                                  </div>
                                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-[9px] font-mono font-bold text-pink-450 rounded-lg shrink-0">
                                    Atualização Semanal
                                  </span>
                                </div>

                                {/* Mystical ancient Scroll styled element */}
                                <div className="relative p-6 bg-slate-950 rounded-3xl border border-amber-500/10 shadow-[inner_0_0_20px_bg-amber-500/5] overflow-hidden text-center space-y-4">
                                  <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                                  <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                                  
                                  <span className="text-[9px] font-mono text-amber-500/70 block uppercase tracking-widest">Semana de 08/06 a 14/06 de 2026</span>
                                  
                                  <p className="font-serif italic text-sm text-amber-100/90 leading-relaxed max-w-xl mx-auto">
                                    "{user.name.split(' ')[0]}, o céu desta semana convida você a encontrar o silêncio lúcido em meio ao turbilhão de ideias brilhantes que seu Sol em {mapData?.astros?.find(a => a.name === "Sol")?.sign || getZodiacSign(user.birthDate)} tanto gera. A força construtora do seu Caminho de Vida {numerology?.lifePathNumber || getLifePathNumber(user.birthDate)} exige que você não apenas idealize soluções, mas permita-se o cansaço terapêutico de assentar as ideias no solo firme da realidade."
                                  </p>

                                  <p className="font-serif italic text-sm text-amber-200/90 leading-relaxed max-w-xl mx-auto pt-1">
                                    "A ressonância de Mercúrio e Vênus em harmonia reforça a doçura na sua expressão: é hora de presentear sua rotina laboriosa com pequenas pausas estéticas. Confie na sabedoria invisível do elemento Ar que circula seu campo, pois a verdadeira prosperidade espiritual não provém do excesso de passos, mas da respiração perfeitamente cadenciada."
                                  </p>

                                  <div className="pt-3 border-t border-slate-900 max-w-xs mx-auto">
                                    <Sparkles className="w-4 h-4 text-amber-450 mx-auto animate-pulse" />
                                    <span className="text-[8px] font-mono uppercase text-slate-500 tracking-wider block mt-1">Conselheira Espiritual Orbia</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                        </>}
                      </div>
                    )
                  )}

                    {/* SUB-SECTION 2: MEU MAPA */}
                    {mapSubTab === 'meu_mapa' && (
                      !hasUserCreatedMap(user) ? (
                        renderLockedSection(
                          "Astronomia & Numerologia Pessoais",
                          "Os mapas celestes sob sistema Placidus, os graus exatos dos astros, a análise detalhada das casas astrológicas e os códigos de vida numerológicos dependem da sintonização do seu mapa de nascimento. Sintonize suas estrelas para habilitar."
                        )
                      ) : (
                        <div className="space-y-8 animate-in fade-in duration-300">
                          {/* Botão de Sincronização / Salvação do Mapa no Firestore */}
                          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <span className="text-xl">🪐</span>
                              </div>
                              <div className="text-left">
                                {isMapJustSaved || (user.hasCreatedMap && isLoggedIn) ? (
                                  <>
                                    <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                                      MAPA SINCRONIZADO
                                    </h4>
                                    <p className="text-[11px] text-emerald-300/90 mt-1 max-w-lg leading-relaxed">
                                      Seu mapa astral principal foi protegido e sincronizado com sua conta.
                                      <br />
                                      A partir de agora você receberá atualizações contínuas sobre trânsitos, ciclos, frequências energéticas e movimentações celestes relacionadas ao seu mapa.
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <h4 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-wider">
                                      SINCRONIZAÇÃO ATIVA
                                    </h4>
                                    <p className="text-[11px] text-slate-350 mt-1 max-w-lg leading-relaxed">
                                      Salve seu mapa para receber atualizações personalizadas de trânsitos, energias, previsões e movimentos astrológicos em tempo real.
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2 w-full md:w-auto">
                              {!isLoggedIn && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAuthTab('register_credentials');
                                    setActiveTab('configuracoes');
                                    triggerGlobalNotification(
                                      "Registre-se",
                                      "Crie sua conta para sincronizar e salvar este mapa para sempre na nuvem!",
                                      "info"
                                    );
                                  }}
                                  className="w-full md:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs font-mono transition-all duration-300 cursor-pointer"
                                >
                                  Criar Conta e Salvar
                                </button>
                              )}
                              
                              <button
                                type="button"
                                onClick={handleManualSaveMap}
                                className="w-full md:w-auto px-4 py-2 rounded-xl border border-slate-700 hover:border-amber-500/50 bg-slate-950 hover:bg-slate-900 text-slate-350 hover:text-amber-500 text-xs font-mono transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer font-bold"
                              >
                                <span>💾</span>
                                <span>SALVAR MAPA</span>
                              </button>
                            </div>
                          </div>

                          {/* Render standard modules but completely readOnly to avoid new registrations */}
                          <p className="hidden" />
                          <React.Suspense fallback={
                            <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3 animate-pulse">
                              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                              <p className="text-xs text-slate-400 font-mono">Descriptografando efemérides e traçando alinhamento de casas...</p>
                            </div>
                          }>
                            {mapData && (
                              <div key={`astrology_view_${user.name}_${user.birthDate}_${user.birthTime || ''}`}>
                                <AstrologyView 
                                  mapData={mapData} 
                                  user={user} 
                                  onUpdateMainMap={() => {}} 
                                  readOnly={true}
                                />
                              </div>
                            )}

                            {numerology && (
                              <div key={`numerology_view_${user.name}_${user.birthDate}`}>
                                <NumerologyView 
                                  numerology={numerology} 
                                  user={user} 
                                />
                              </div>
                            )}
                          </React.Suspense>

                          <CompatibilityView user={user} />


                        </div>
                      )
                    )}

                    {/* SUB-SECTION 3: CRIAR MEU MAPA */}
                    {mapSubTab === 'criar_meu_mapa' && (
                      isLoggedIn && isPostTrialLocked(user) ? (
                        <PremiumConversionScreen 
                          currentLang={currentLang} 
                          onUpgradeComplete={(isPremium) => {
                            if (isPremium) {
                              const nextUser = { ...user, isSubscribed: true, isPremium: true };
                              setUser(nextUser);
                            }
                          }} 
                          userEmail={loggedEmail} 
                          updateUserProfileOnDb={async (email, patch) => {
                            const nextUser = { ...user, ...patch };
                            setUser(nextUser);
                            await saveProfileToDatabase(email, nextUser);
                          }} 
                        />
                      ) : (
                        <div className="max-w-2xl mx-auto bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 text-left animate-in fade-in duration-300">
                          <div className="border-b border-slate-850 pb-4">
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                              <Plus className="w-5 h-5 text-amber-500" />
                              Calcular Novo Mapa Astral Principal
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              Insira os dados corretos de nascimento para recalcular as posições planetárias, casas astrológicas e os trânsitos sob o sistema Placidus.
                            </p>
                          </div>

                        {/* EXPLICIT REQUIRED WARNING IF USER HAS ACTIVE MAP */}
                        {user.hasCreatedMap && (
                          <div className="bg-amber-500/5 p-5 border border-amber-500/20 rounded-2xl text-[11px] leading-relaxed text-slate-350 font-sans space-y-3">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-amber-400 text-xs">Você já possui um mapa principal ativo.</h4>
                                <p className="mt-1">Ao gerar um novo mapa, todas as informações antigas, caches, numerologia, tarot e oráculos serão completamente resetados e gerados novos do zero.</p>
                                <p className="mt-1">Se deseja criar mapas de outras pessoas utilize a opção <span className="font-semibold text-rose-400 hover:underline cursor-pointer" onClick={() => setMapSubTab('mapas_extras')}>MAPAS EXTRAS</span>.</p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                              <span>Alterações do Mapa Principal:</span>
                              <span className="font-mono font-bold text-amber-500">Ilimitadas (Premium Grátis)</span>
                            </div>
                          </div>
                        )}

                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (!createMainName || !createMainDate) return;
                          handleUpdateUserProfile({
                            name: createMainName,
                            birthDate: createMainDate,
                            birthTime: createMainTime || "12:00",
                            birthCity: createMainCity,
                            latitude: createMainCoords?.latitude,
                            longitude: createMainCoords?.longitude
                          });
                          setMapSubTab('meu_mapa'); // switch straight to read-only view
                        }} className="space-y-4 pt-2">
                          <fieldset className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">Nome completo</label>
                              <input
                                type="text"
                                required
                                value={createMainName}
                                onChange={(e) => setCreateMainName(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-205 focus:outline-hidden"
                                placeholder="e.g. Fabricio Souza Santos"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">Data de nascimento</label>
                                <input
                                  type="date"
                                  required
                                  value={createMainDate}
                                  onChange={(e) => setCreateMainDate(e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 focus:outline-hidden font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">Hora (HH:MM)</label>
                                <input
                                  type="text"
                                  value={createMainTime}
                                  onChange={(e) => setCreateMainTime(e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-205 focus:outline-hidden font-mono"
                                  placeholder="e.g. 15:30"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-bold">Cidade / Estado</label>
                                <CityAutocomplete
                                  value={createMainCity}
                                  onChange={(val) => setCreateMainCity(val)}
                                  onSelectCity={(city) => {
                                    setCreateMainCity(city.label);
                                    setCreateMainCoords({ latitude: city.latitude, longitude: city.longitude });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                              <button
                                type="submit"
                                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 rounded-xl text-xs font-bold font-sans uppercase text-slate-950 transition-all cursor-pointer hover:shadow-lg opacity-90 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={(user.mainMapChangesCount ?? 0) >= 2 && user.hasCreatedMap}
                              >
                                {user.hasCreatedMap ? "Substituir e Gerar Novo Mapa Principal" : "Gerar e Salvar Meu Mapa Principal"}
                              </button>
                            </div>
                          </fieldset>
                        </form>
                      </div>
                      )
                    )}

                    {/* SUB-SECTION 4: MAPAS EXTRAS */}
                    {mapSubTab === 'mapas_extras' && (
                      isLoggedIn && isPostTrialLocked(user) ? (
                        <PremiumConversionScreen 
                          currentLang={currentLang} 
                          onUpgradeComplete={(isPremium) => {
                            if (isPremium) {
                              const nextUser = { ...user, isSubscribed: true, isPremium: true };
                              setUser(nextUser);
                            }
                          }} 
                          userEmail={loggedEmail} 
                          updateUserProfileOnDb={async (email, patch) => {
                            const nextUser = { ...user, ...patch };
                            setUser(nextUser);
                            await saveProfileToDatabase(email, nextUser);
                          }} 
                        />
                      ) : !hasUserCreatedMap(user) ? (
                        renderLockedSection(
                          "Portal de Relacionamentos e Mapas Extras",
                          "A comparação de sinastria social, relatórios de afinidade e registros paralelos para mapas de familiares e amigos necessitam que você primeiro crie seu próprio mapa de nascimento. Sintonize suas estrelas para habilitar."
                        )
                      ) : (
                        <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
                          
                          {/* Header back button */}
                          <div className="flex justify-between items-center flex-wrap gap-2">
                          <div>
                            <h2 className="text-lg font-bold text-slate-100 uppercase tracking-tight flex items-center gap-2">
                              <Orbit className="w-5 h-5 text-rose-400" />
                              Mapas Extras
                            </h2>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Gerencie mapas extras de familiares, contatos profissionais ou parceiros. Limite de <strong>até 2 mapas</strong> adicionais.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveExtraMapData(null);
                              setMapSubTab('meu_mapa');
                            }}
                            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-full text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition duration-300 cursor-pointer"
                          >
                            <span>Voltar para Meu Mapa</span>
                          </button>
                        </div>

                        {/* Rendering single extra map report when active */}
                        {activeExtraMapData ? (
                          <div className="space-y-8 p-6 bg-slate-950/20 rounded-3xl border border-slate-850/60 animate-in fade-in duration-300">
                            <div className="pb-3 border-b border-slate-850 flex items-center justify-between flex-wrap gap-2 bg-slate-950/80 p-4 rounded-2xl">
                              <div>
                                <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest font-bold">Visualização Ativa</span>
                                <h3 className="text-base font-black text-slate-100">Mapa Astral Extra: {activeExtraMapName}</h3>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveExtraMapData(null);
                                  setActiveExtraMapNumerology(null);
                                  setActiveExtraMapName('');
                                }}
                                className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold uppercase transition duration-200 cursor-pointer"
                              >
                                Voltar para Lista de Mapas Extras
                              </button>
                            </div>

                            <React.Suspense fallback={
                              <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3 animate-pulse text-xs text-slate-400">
                                <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                                <span>Renderizando coordenadas do mapa secundário...</span>
                              </div>
                            }>
                              <AstrologyView 
                                mapData={activeExtraMapData} 
                                user={{
                                  name: activeExtraMapName,
                                  birthDate: "1990-01-01", 
                                  birthTime: "12:00",
                                  birthCity: "Desconhecida",
                                  isUnknownTime: false,
                                  isPremium: true
                                }} 
                                onUpdateMainMap={() => {}} 
                                readOnly={true}
                              />

                              {activeExtraMapNumerology && (
                                <NumerologyView 
                                  numerology={activeExtraMapNumerology} 
                                  user={{
                                    name: activeExtraMapName,
                                    birthDate: "1990-01-01",
                                  }} 
                                />
                              )}
                            </React.Suspense>

                            <div className="pt-2 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveExtraMapData(null);
                                  setMapSubTab('meu_mapa');
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 rounded-xl text-xs font-bold uppercase text-slate-950 hover:shadow-lg transition cursor-pointer"
                              >
                                Voltar para Meu Mapa
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            
                            {/* Left: Extra Map Form and Permanent Rules */}
                            <div className="md:col-span-5 bg-slate-900/40 p-5 rounded-3xl border border-slate-850 space-y-4 font-sans">
                              <div>
                                <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">Novo Mapa de Terceiro</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">Cadastre pessoas importantes para sinastria secundária.</p>
                              </div>

                               {/* Explicação transparente das regras de limitação permanente */}
                               <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 text-[10.5px] text-slate-400 space-y-1.5 leading-relaxed">
                                 <span className="font-bold text-amber-500 text-[11px] block">✨ Mapas Extras Liberados:</span>
                                 <ul className="list-disc pl-3.5 space-y-1 text-slate-450">
                                   <li><strong>Criação Ilimitada:</strong> Cadastre quantos mapas de amigos e familiares desejar, sem custos.</li>
                                   <li><strong>Sincronização Cósmica:</strong> Os dados de novos mapas extras são salvos de forma segura em tempo real na nuvem do usuário.</li>
                                 </ul>
                               </div>
                               
                               <form onSubmit={(e) => {
                                 e.preventDefault();
                                 if (!extraName || !extraDate) return;
                                 
                                 const newExtraObj = {
                                   id: `extra_${Date.now()}`,
                                   name: extraName,
                                   birthDate: extraDate,
                                   birthTime: extraTime || "12:00",
                                   birthCity: extraCity,
                                   latitude: extraCityCoords?.latitude,
                                   longitude: extraCityCoords?.longitude
                                 };
                                 
                                 const nextExtraArr = [...extraMaps, newExtraObj];
                                 setExtraMaps(nextExtraArr);
                                 
                                 // Incrementa e salva de forma persistente o contador vitalício de mapas gerados
                                 const nextLifecycleCount = (user.extraMapsCreatedCount ?? 0) + 1;
                                 const nextUserObj = {
                                   ...user,
                                   extraMapsCreatedCount: nextLifecycleCount
                                 };
                                 setUser(nextUserObj);
                                 
                                 if (isLoggedIn && loggedEmail) {
                                   saveProfileToDatabase(loggedEmail, nextUserObj).catch(console.error);
                                   saveExtraMapToDatabase(loggedEmail, {
                                     id: newExtraObj.id,
                                     userId: loggedEmail,
                                     label: newExtraObj.name,
                                     birthDate: newExtraObj.birthDate,
                                     birthTime: newExtraObj.birthTime,
                                     birthCity: newExtraObj.birthCity,
                                     createdAt: new Date().toISOString(),
                                     latitude: newExtraObj.latitude,
                                     longitude: newExtraObj.longitude
                                   }).catch(console.warn);
                                 }

                                 triggerGlobalNotification(
                                    "Mapa Extra Cadastrado",
                                    `O Mapa Astral de ${extraName} foi calculado e adicionado com sucesso!`,
                                    "success"
                                  );

                                  // Reset inputs
                                  setExtraName('');
                                  setExtraDate('');
                                  setExtraTime('');
                                  setExtraCity('');
                                }} className="space-y-3 font-sans">
                                  <div>
                                    <label className="block text-[9px] font-mono text-slate-450 uppercase mb-1">Nome completo</label>
                                    <input
                                      type="text"
                                      required
                                      value={extraName}
                                      onChange={(e) => setExtraName(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-202 focus:outline-hidden"
                                      placeholder="e.g. Lucas Oliveira"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-mono text-slate-455 uppercase mb-1">Data Nascimento</label>
                                    <input
                                      type="date"
                                      required
                                      value={extraDate}
                                      onChange={(e) => setExtraDate(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-401 focus:outline-hidden font-mono"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-mono text-slate-455 uppercase mb-1">Hora (HH:MM)</label>
                                    <input
                                      type="text"
                                      value={extraTime}
                                      onChange={(e) => setExtraTime(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-202 focus:outline-hidden"
                                      placeholder="e.g. 08:45"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] font-mono text-slate-455 uppercase mb-1">Cidade</label>
                                    <CityAutocomplete
                                      value={extraCity}
                                      placeholder="e.g. Rio de Janeiro"
                                      onChange={(val) => setExtraCity(val)}
                                      onSelectCity={(city) => {
                                        setExtraCity(city.label);
                                        setExtraCityCoords({ latitude: city.latitude, longitude: city.longitude });
                                      }}
                                      inputClassName="px-3 py-2 rounded-xl"
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 border border-indigo-500/20 text-slate-100 rounded-xl text-xs font-bold font-sans uppercase tracking-wide transition duration-300 cursor-pointer"
                                  >
                                    Cadastrar Mapa Extra
                                  </button>
                                </form>
                              </div>

                            {/* Right: Extra Maps List */}
                            <div className="md:col-span-7 bg-slate-900/20 p-5 rounded-3xl border border-slate-850 space-y-4">
                              <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-divider">Lista de Mapas Extras Cadastrados ({extraMaps.length}/2)</h3>
                              
                              {isLoadingExtraMap && (
                                <div className="space-y-3 py-10 flex flex-col items-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
                                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                                  <p className="text-[10px] font-mono">Processando alinhamento estelar secundário...</p>
                                </div>
                              )}

                              {!isLoadingExtraMap && extraMaps.length === 0 && (
                                <div className="p-8 text-center text-slate-600 bg-slate-950/30 rounded-2xl border border-dashed border-slate-850">
                                  <Orbit className="w-10 h-10 text-slate-800 mx-auto opacity-40 mb-2" />
                                  <p className="text-xs font-mono">Nenhum mapa extra cadastrado.</p>
                                  <p className="text-[10px] text-slate-505 max-w-xs mx-auto mt-1 leading-relaxed">
                                    Adicione até 2 perfis de amigos ou familiares para comparar as cartas astrológicas e sinastrias.
                                  </p>
                                </div>
                              )}

                              {!isLoadingExtraMap && extraMaps.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {extraMaps.map((m) => (
                                    <div key={m.id} className="p-4 bg-slate-950/60 rounded-2xl border border-slate-850 flex flex-col justify-between space-y-3 relative overflow-hidden transition-all duration-300 hover:border-slate-700">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-200">{m.name}</h4>
                                        <p className="text-[10px] font-mono text-indigo-400 leading-none">
                                          Nascimento: {m.birthDate} {m.birthTime ? `às ${m.birthTime}` : ''}
                                        </p>
                                        <p className="text-[10px] text-slate-450 font-mono">
                                          Cidade: {m.birthCity || "Não informada"}
                                        </p>
                                      </div>

                                      <div className="flex items-center gap-2 pt-2 border-t border-slate-850/60">
                                        <button
                                          type="button"
                                          onClick={() => triggerGenerateExtraMap(m)}
                                          className="flex-1 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-455 hover:text-indigo-400 text-center uppercase tracking-wide transition duration-200 cursor-pointer"
                                        >
                                          Visualizar Mapa
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setExtraMaps(extraMaps.filter(ex => ex.id !== m.id));
                                            if (isLoggedIn && loggedEmail) {
                                              deleteExtraMapFromDatabase(loggedEmail, m.id).catch(console.warn);
                                            }
                                          }}
                                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-405 border border-rose-500/25 rounded-lg hover:text-rose-400 transition"
                                          title="Deletar Mapa Extra"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="pt-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => setMapSubTab('meu_mapa')}
                                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-amber-500 hover:text-amber-400 transition cursor-pointer"
                                >
                                  Voltar para Meu Mapa
                                </button>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    )
                  )}
                  </>
                )}
              </div>
            )}

            {/* TAB 2: CONSTCOES (Radar, Biorhythms, Lunar Cycles, Prosperity Maps) */}
            {activeTab === 'constelacoes' && (
              isLoggedIn && isPostTrialLocked(user) ? (
                <PremiumConversionScreen 
                  currentLang={currentLang} 
                  onUpgradeComplete={(isPremium) => {
                    if (isPremium) {
                      const nextUser = { ...user, isSubscribed: true, isPremium: true };
                      setUser(nextUser);
                    }
                  }} 
                  userEmail={loggedEmail} 
                  updateUserProfileOnDb={async (email, patch) => {
                    const nextUser = { ...user, ...patch };
                    setUser(nextUser);
                    await saveProfileToDatabase(email, nextUser);
                  }} 
                />
              ) : !hasUserCreatedMap(user) ? (
                renderLockedSection(
                  "Portal de Constelações",
                  "O alinhamento estelar das constelações e a inclinação sideral dependem das coordenadas geográficas e data exata do seu nascimento. Sincronize seu mapa astral para desbloquear as posições estelares em tempo real."
                )
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Header Banner */}
                <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-950/40 via-slate-905 to-slate-900 border border-emerald-500/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-semibold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      Módulo Trânsitos e Energias Diárias
                    </span>
                    <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-100 mt-2">
                      Radar Biológico & Tendências
                    </h1>
                    <p className="text-xs text-slate-400 max-w-xl mt-1">
                      Monitore biorritmos matemáticos, previsões de trânsitos celestes, e o ciclo lunar ativo para planejar suas melhores ações do dia.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Radar do Dia Subcomponent */}
                  <div className="lg:col-span-4 bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="pb-2 border-b border-slate-850">
                      <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Radar Diário</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Influências transitórias de hoje</p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">Frequência Regente</span>
                        <div className="text-xs font-bold text-emerald-400 mt-1">{dailyRadar.energyOfDay}</div>
                      </div>

                      {/* Disposition Level widget gauge */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Nível de Disposição Física</span>
                          <span className="font-mono text-emerald-400 font-bold">{dailyRadar.dispositionLevel}%</span>
                        </div>
                        <div className="w-full h-2 rounded bg-slate-950 overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${dailyRadar.dispositionLevel}%` }} />
                        </div>
                      </div>

                      {/* Best hours timeline lists */}
                      <div className="space-y-2 pt-2 text-[11px]">
                        <strong className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Melhores Janelas Horas:</strong>
                        <div className="flex justify-between p-2 bg-slate-950/40 rounded-lg">
                          <span className="text-slate-400">Produtividade</span>
                          <span className="font-mono text-slate-200">{dailyRadar.bestTimeProductivity}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-950/40 rounded-lg">
                          <span className="text-slate-400">Relacionamentos</span>
                          <span className="font-mono text-rose-400">{dailyRadar.bestTimeRelationships}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-950/40 rounded-lg">
                          <span className="text-slate-400">Foco / Estudos</span>
                          <span className="font-mono text-sky-400">{dailyRadar.bestTimeStudies}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informational Prompt block on Biorhythm integration */}
                  <div className="lg:col-span-8 bg-slate-900/10 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center space-y-4">
                    <span className="px-3 py-1 rounded-full text-[9px] uppercase font-mono font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 w-fit">
                      Sincronismo Quântico Ativado
                    </span>
                    <h3 className="text-base font-bold text-slate-100 uppercase tracking-tight">Sintonização do Potencial de Vida</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      O Biorritmo auxilia você a sincronizar seus picos de eficiência diários em cada uma das 7 esferas de experiência vital. Role para baixo ou navegue ao lado para analisar detalhadamente seu gráfico de 15 dias completo e o cronômetro correspondente de transições de fases física, emocional e espiritual.
                    </p>
                    <div className="flex gap-2 items-center text-[11px] font-mono text-indigo-305">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                      <span>Integração com {user?.birthDate ? `Nascimento: ${user.birthDate}` : 'suas datas astrológicas'}</span>
                    </div>
                  </div>

                </div>

                {/* THE NEW ADVANCED BIORHYTHM SYSTEM FOR FABRICIO */}
                <div key={`biorhythm_${user?.name}_${user?.birthDate}`}>
                  <BiorhythmView 
                    userName={user?.name} 
                    birthDate={user?.birthDate} 
                    lang={currentLang}
                  />
                </div>

                {/* NEW COMPREHENSIVE LUNAR CYCLE MODULE */}
                <div key={`lunar_cycle_${user?.name}_${user?.birthDate}_${user?.birthTime || ''}`}>
                  <LunarCycle 
                    userName={user?.name} 
                    userSunSign={mapData?.astros?.find(a => a.name === "Sol")?.sign || (user?.birthDate ? getZodiacSign(user.birthDate) : "Aquário")} 
                    userAscendant={mapData?.astros?.find(a => a.name === "Ascendente")?.sign || (user?.birthDate && user?.birthTime ? getRisingSign(user.birthDate, user.birthTime) : "Sagitário")}
                    lang={currentLang}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Mapa da Prosperidade Subcomponent */}
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <div className="pb-2 border-b border-slate-850">
                      <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Mapa de Prosperidade Mensal</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Sua vibração abundante orientada para {personalProsperity.monthName} {personalProsperity.year}.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Prosperity fields */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">Número do Mês</span>
                        <span className="text-xl font-bold font-mono text-amber-500 block mt-1">{personalProsperity.monthNumber}</span>
                        <p className="text-[9px] text-slate-500 leading-none mt-1">Amuleto: {personalProsperity.amulet}</p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center gap-3">
                        <div className="w-8 h-8 rounded border border-white/10 shrink-0 shadow-sm" style={{ backgroundColor: personalProsperity.favorableColor.hex }} />
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 uppercase block">Cor Favorecida</span>
                          <span className="text-[11px] text-slate-300 font-bold font-mono block mt-0.5">{personalProsperity.favorableColor.name}</span>
                          <span className="text-[8px] text-slate-500 font-mono">{personalProsperity.favorableColor.hex.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Palabra chave */}
                      <div className="col-span-2 p-3 bg-slate-950 rounded-xl border border-slate-850">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block">Palavra-Chave Ativa</span>
                        <span className="text-xs font-bold text-slate-200 mt-1 block">"{personalProsperity.keyword}"</span>
                      </div>
                    </div>
                  </div>

                  {/* Calendário dos Próximos 30 dias */}
                  <div className="bg-slate-900/30 p-6 rounded-3xl border border-slate-800 space-y-4 col-span-1 lg:col-span-2">
                    <div className="pb-2 border-b border-slate-800 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                      <div>
                        <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Mapa dos Próximos 30 Dias (Calendário de Trânsitos)</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">Clique nos dias sinalizados para abrir e analisar os detalhes e trânsitos reais.</p>
                      </div>
                      {selectedProsperityDay !== null && (
                        <button 
                          onClick={() => setSelectedProsperityDay(null)}
                          className="px-2 py-1 text-[9px] font-mono uppercase bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md border border-red-500/20 transition cursor-pointer"
                        >
                          Fechar Detalhes
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-2 max-w-2xl mx-auto">
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const isSelected = selectedProsperityDay === dayNum;
                        
                        // Assign color tags to certain days
                        let dayColor = "bg-slate-900/40 border-slate-850 text-slate-500 hover:border-slate-700";
                        let tagText = "Tranquilo";
                        
                        if ([2, 9, 16, 23, 30].includes(dayNum)) {
                          dayColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold hover:border-emerald-500/40";
                          tagText = "Favorável";
                        } else if ([5, 12, 19, 26].includes(dayNum)) {
                          dayColor = "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold hover:border-rose-500/40";
                          tagText = "Atenção";
                        } else if ([7, 14, 21, 28].includes(dayNum)) {
                          dayColor = "bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold hover:border-amber-500/40";
                          tagText = "Produtivo";
                        } else if ([4, 11, 18, 25].includes(dayNum)) {
                          dayColor = "bg-sky-500/10 border-sky-500/20 text-sky-400 font-bold hover:border-sky-500/40";
                          tagText = "Descanso";
                        }

                        if (isSelected) {
                          dayColor = "bg-sky-500/20 border-sky-400 text-sky-200 ring-1 ring-sky-550 font-black shadow-md";
                        }

                        return (
                          <button 
                            key={idx} 
                            type="button"
                            onClick={() => setSelectedProsperityDay(isSelected ? null : dayNum)}
                            title={`Dia ${dayNum}: energia de foco ${tagText}`}
                            className={`p-2 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between items-center h-12 ${dayColor}`}
                          >
                            <span className="block font-mono text-xs font-bold leading-none">{dayNum.toString().padStart(2, '0')}</span>
                            <span className="text-[7.5px] font-mono block leading-none uppercase tracking-tight">{tagText.slice(0, 3)}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Expandable Details Panel for Selected Day */}
                    {selectedProsperityDay !== null && (() => {
                      const prediction = generateDailyPrediction(
                        user?.birthDate || "1997-02-11",
                        mapData?.astros?.find(a => a.name === "Sol")?.sign || (user?.birthDate ? getZodiacSign(user.birthDate) : "Touro"),
                        user?.name || "Viajante",
                        selectedProsperityDay - 1,
                        new Date()
                      );
                      
                      return (
                        <div className="p-5 bg-slate-950/95 rounded-2xl border border-sky-500/20 text-left space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-850 flex-wrap gap-2 leading-none">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                              <span className="text-sm font-bold uppercase font-mono text-slate-100">
                                {prediction.dateFormatted} (Dia {selectedProsperityDay})
                              </span>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono border ${prediction.tagColorClass}`}>
                              Vibração: {prediction.tagText}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                            {/* Column 1 - Astrological details and energies */}
                            <div className="space-y-3">
                              <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Influência Astrológica:</span>
                                <p className="text-slate-205 mt-1 leading-normal font-sans font-medium">{prediction.astroInfluence}</p>
                              </div>

                              <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Aspectos Planetários do Dia:</span>
                                <p className="text-slate-200 mt-1 leading-normal font-sans">{prediction.aspects}</p>
                              </div>

                              <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Trânsito Lunar & Setores:</span>
                                <p className="text-slate-300 mt-1 leading-normal font-sans italic">{prediction.transit}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Energia Predominante:</span>
                                  <span className="text-[11px] font-bold text-sky-400 block mt-1">{prediction.predominantEnergy}</span>
                                </div>
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Nível Energético:</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                      <div className="h-full bg-emerald-500" style={{ width: `${prediction.energyLevel}%` }} />
                                    </div>
                                    <span className="font-mono text-[10px] text-emerald-400 font-bold">{prediction.energyLevel}%</span>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                  <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-wider block font-bold">Áreas Favorecidas:</span>
                                  <p className="text-emerald-400 mt-1 font-bold truncate">{prediction.favoredAreas.join(', ')}</p>
                                </div>
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-rose-500/60">
                                  <span className="text-[8px] font-mono text-rose-500 uppercase tracking-wider block font-bold">Áreas de Atenção:</span>
                                  <p className="text-rose-400 mt-1 font-bold truncate">{prediction.attentionAreas.join(', ')}</p>
                                </div>
                              </div>
                            </div>

                            {/* Column 2 - Personal action, opportunities, challenges & advice */}
                            <div className="space-y-3">
                              <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Mensagem Personalizada do Usuário:</span>
                                <p className="text-slate-200 mt-1 leading-normal italic">"{prediction.personalizedMessage}"</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-emerald-500/15">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold text-emerald-400">Oportunidades:</span>
                                  <p className="text-slate-300 mt-1 leading-normal font-sans">{prediction.opportunities}</p>
                                </div>
                                <div className="p-2.5 bg-slate-900/40 rounded-xl border border-rose-500/15">
                                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold text-rose-400">Desafios:</span>
                                  <p className="text-slate-300 mt-1 leading-normal font-sans">{prediction.challenges}</p>
                                </div>
                              </div>

                              <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Conselho Personalizado:</span>
                                <p className="text-slate-200 mt-1 leading-normal font-medium">"{prediction.personalizedAdvice}"</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2 bg-slate-900/40 rounded-xl border border-slate-850/60 flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border border-white/10 shrink-0 shadow-xs" style={{ backgroundColor: prediction.favorableColor === "Verde Esmeralda" ? "#16a34a" : prediction.favorableColor === "Azul Celeste" ? "#38bdf8" : prediction.favorableColor === "Violeta Púrpura" ? "#a855f7" : prediction.favorableColor === "Dourado Sol" ? "#eab308" : prediction.favorableColor === "Turquesa Fluido" ? "#06b6d4" : prediction.favorableColor === "Vermelho Rubi" ? "#dc2626" : "#f472b6" }} />
                                  <div>
                                    <span className="text-[7.5px] font-mono text-slate-500 uppercase block leading-none">Cor Favorável</span>
                                    <span className="text-[10px] text-slate-300 font-bold font-sans mt-0.5 block">{prediction.favorableColor}</span>
                                  </div>
                                </div>
                                <div className="p-2 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                  <span className="text-[7.5px] font-mono text-slate-500 uppercase block leading-none">Número da Sorte</span>
                                  <span className="text-sm font-black text-amber-400 block font-mono text-left">{prediction.favorableNumber}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                  <span className="text-[7.5px] font-mono text-slate-500 block uppercase">Melhor Período</span>
                                  <span className="text-[10px] text-emerald-400 font-bold block font-mono mt-0.5">{prediction.bestPeriod}</span>
                                </div>
                                <div className="p-2 bg-slate-900/40 rounded-xl border border-slate-850/60">
                                  <span className="text-[7.5px] font-mono text-slate-100 block uppercase text-rose-500">Período de Atenção</span>
                                  <span className="text-[10px] text-rose-400 font-bold block font-mono mt-0.5">{prediction.attentionPeriod}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* NODOS LUNARES - SUA EVOLUÇÃO PESSOAL */}
                <div key={`lunar_nodes_planetas_${user?.name}_${user?.birthDate}`}>
                  <LunarNodes userName={user?.name} mapData={mapData} />
                </div>

              </div>
              )
            )}

            {/* TAB 3: PLANETAS (AI Conselheira Orbia, Dreams Interpretation, Tarot, Daily Oracle) */}
            {activeTab === 'planetas' && (
              isLoggedIn && isPostTrialLocked(user) ? (
                <PremiumConversionScreen 
                  currentLang={currentLang} 
                  onUpgradeComplete={(isPremium) => {
                    if (isPremium) {
                      const nextUser = { ...user, isSubscribed: true, isPremium: true };
                      setUser(nextUser);
                    }
                  }} 
                  userEmail={loggedEmail} 
                  updateUserProfileOnDb={async (email, patch) => {
                    const nextUser = { ...user, ...patch };
                    setUser(nextUser);
                    await saveProfileToDatabase(email, nextUser);
                  }} 
                />
              ) : !hasUserCreatedMap(user) ? (
                renderLockedSection(
                  "Portal de Planetas e Assistência Orbia",
                  "Seu horóscopo celestial detalhado, a interpretação de sonhos complexos e o acesso à conselheira de inteligência artificial Orbia dependem das coordenadas geométricas do seu nascimento. Sincronize seu mapa para desbloquear."
                )
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">

                {/* Header Banner */}
                <div className="p-6 rounded-3xl bg-linear-to-r from-rose-950/40 via-slate-950 to-slate-900 border border-rose-500/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-semibold tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20">
                      Módulo Sistemas Ativos e Consultas
                    </span>
                    <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-slate-100 mt-2">
                      Sistemas Astros Ativos
                    </h1>
                    <p className="text-xs text-slate-400 max-w-xl mt-1">
                      Comunique-se com a Conselheira Orbia, interprete sonhos com Gemini no Cofre dos Sonhos e consulte o Oráculo diário.
                    </p>
                  </div>
                </div>

                {/* D3 Real-time Transit Map Alignment */}
                {mapData ? (
                  <React.Suspense fallback={
                    <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-xs text-slate-500 animate-pulse space-y-3">
                      <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
                      <div>Injetando efemérides astronômicas em tempo real...</div>
                    </div>
                  }>
                    <TransitMap mapData={mapData} />
                  </React.Suspense>
                ) : (
                  <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-xs text-slate-500 animate-pulse">
                    Calculando trânsitos em tempo real e aspectos com seu mapa...
                  </div>
                )}

                {/* Monthly Celestial Transits History Panel */}
                <div key={`transit_history_planetas_${user?.name}_${user?.birthDate}`}>
                  <TransitHistory userName={user?.name} birthDate={user?.birthDate} />
                </div>

                {/* Orbia AI Chat and Oracle Component */}
                <div key={`orbia_oracle_chat_${user?.name}_${user?.birthDate}_${user?.birthTime || ''}`}>
                  <OrbiaAIAndOracle
                    chatMessages={chatMessages}
                    currentChatInput={currentChatInput}
                    setCurrentChatInput={setCurrentChatInput}
                    isSendingChat={isSendingChat}
                    handleSendChatMessage={handleSendChatMessage}
                    hasQueriedOracleToday={hasQueriedOracleToday}
                    oracleQuestion={oracleQuestion}
                    setOracleQuestion={setOracleQuestion}
                    oracleResponse={oracleResponse}
                    setOracleResponse={setOracleResponse}
                    isQueryingOracle={isQueryingOracle}
                    handleAskOracle={handleAskOracle}
                    lang={currentLang}
                  />
                </div>

                {/* Oráculo dos Sonhos Component */}
                <div key={`oraculo_sonhos_card_${user?.name}_${user?.birthDate}`}>
                  <OraculoDosSonhosCard
                    newDreamDesc={newDreamDesc}
                    setNewDreamDesc={setNewDreamDesc}
                    isInterpretingDream={isInterpretingDream}
                    handleRecordAndInterpretDream={handleRecordAndInterpretDream}
                    dreamsHistory={dreamsHistory}
                    selectedDreamDisplay={selectedDreamDisplay}
                    setSelectedDreamDisplay={setSelectedDreamDisplay}
                    preferredLanguage={currentLang}
                  />
                </div>

              </div>
              )
            )}

            {/* TAB: TAROT COSIMCO */}
            {activeTab === 'tarot' && (
              isLoggedIn && isPostTrialLocked(user) ? (
                <PremiumConversionScreen 
                  currentLang={currentLang} 
                  onUpgradeComplete={(isPremium) => {
                    if (isPremium) {
                      const nextUser = { ...user, isSubscribed: true, isPremium: true };
                      setUser(nextUser);
                    }
                  }} 
                  userEmail={loggedEmail} 
                  updateUserProfileOnDb={async (email, patch) => {
                    const nextUser = { ...user, ...patch };
                    setUser(nextUser);
                    await saveProfileToDatabase(email, nextUser);
                  }} 
                />
              ) : !hasUserCreatedMap(user) ? (
                renderLockedSection(
                  "Portal de Tarô Cósmico",
                  "A interpretação profunda e a leitura semanal personalizada dos arcanos maiores dependem do alinhamento geométrico cósmico de nascimento. Sincronize seu mapa astral para desbloquear as consultas oraculares gratuitas."
                )
              ) : (
                <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-350">
                  <div key={`tarot_system_${user.name}_${user.birthDate}`}>
                    <TarotSystem userName={user.name} lang={currentLang} />
                  </div>
                </div>
              )
            )}

            {/* TAB 4: CONFIGURACOES (Profile custom edit, sms alerts & languages) */}
            {activeTab === 'configuracoes' && (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
                
                {/* Header Banner */}
                <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-slate-905 to-slate-900 border border-slate-850 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative flex justify-between items-center">
                    <div>
                      <span className="px-3 py-1 rounded-full text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-500 bg-slate-800/20 border border-slate-800">
                        {tLocal('control_panel')}
                      </span>
                      <h1 className="text-2xl font-sans font-bold tracking-tight text-slate-100 mt-2">
                        {tLocal('general_settings')}
                      </h1>
                      <p className="text-xs text-slate-500 mt-1">
                        {tLocal('settings_desc')}
                      </p>
                    </div>
                    <span className="text-3xl text-[#E5C158] shrink-0">⚙️</span>
                  </div>
                </div>

                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Profile Editor form */}
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4 font-sans">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850">{tLocal('edit_coords')}</h3>
                    
                    {/* Alteration Limit Alert */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-300">{tLocal('changes_count')}</span>
                        <span className="font-mono font-bold text-amber-500">{(user.mainMapChangesCount ?? 0)} / 2</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        {(user.mainMapChangesCount ?? 0) >= 2 ? (
                          <span className="text-rose-450 font-bold">{tLocal('limit_reached')}</span>
                        ) : (
                          <span>{tLocal('changes_remaining', 2 - (user.mainMapChangesCount ?? 0))}</span>
                        )}
                      </p>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${((user.mainMapChangesCount ?? 0) >= 2) ? "pointer-events-none opacity-40 select-none" : ""}`}>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-505 mb-1">{tLocal('birth_date')}</label>
                        <input 
                          type="date" 
                          value={user.birthDate} 
                          disabled={(user.mainMapChangesCount ?? 0) >= 2}
                          onChange={(e) => handleUpdateUserProfile({ birthDate: e.target.value })} 
                          className="w-full px-3 py-2 rounded-xl bg-slate-955 border border-slate-850 text-xs text-slate-200 focus:outline-hidden disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-505 mb-1">{tLocal('birth_time')}</label>
                        <input 
                          type="text" 
                          value={user.birthTime} 
                          disabled={(user.mainMapChangesCount ?? 0) >= 2}
                          onChange={(e) => handleUpdateUserProfile({ birthTime: e.target.value })} 
                          className="w-full px-3 py-2 rounded-xl bg-slate-955 border border-slate-850 text-xs text-slate-200 focus:outline-hidden disabled:opacity-50"
                          placeholder="e.g. 15:30"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono text-slate-505 mb-1">{tLocal('birth_city')}</label>
                        <CityAutocomplete
                          value={user.birthCity}
                          placeholder="e.g. São Paulo, SP"
                          onChange={(val) => handleUpdateUserProfile({ birthCity: val })}
                          onSelectCity={(city) => {
                            handleUpdateUserProfile({
                              birthCity: city.label,
                              latitude: city.latitude,
                              longitude: city.longitude
                            });
                          }}
                          inputClassName="px-3 py-2 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences notifications switch controls */}
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850">{tLocal('alerts_and_notifs')}</h3>
                    
                    <div className="space-y-4 font-sans text-xs">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <strong>{tLocal('daily_notifs')}</strong>
                          <p className="text-[10px] text-slate-500">{tLocal('daily_notifs_desc')}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notifyDaily}
                          onChange={(e) => setNotifyDaily(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <strong>{tLocal('sms_reminders')}</strong>
                          <p className="text-[10px] text-slate-550 mr-2">{tLocal('sms_reminders_desc')}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={notifyTransit}
                          onChange={(e) => setNotifyTransit(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Language selection dropdown config */}
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4 font-sans">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850">{tLocal('lang_sovereignty')}</h3>
                    
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong>{tLocal('preferred_lang')}</strong>
                        <p className="text-[10px] text-slate-500">{tLocal('lang_desc')}</p>
                      </div>

                      <select 
                        value={lang} 
                        onChange={(e) => setLang(e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-200 focus:outline-hidden"
                      >
                        <option value="pt">Português (BR)</option>
                        <option value="en">English (US)</option>
                        <option value="es">Español (ES)</option>
                        <option value="de">Deutsch (DE)</option>
                        <option value="fr">Français (FR)</option>
                      </select>
                    </div>
                  </div>

                  {/* Accessibility Switch Section */}
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4 font-sans">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850">{tLocal('accessibility')}</h3>
                    
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong>{tLocal('high_contrast')}</strong>
                        <p className="text-[10px] text-slate-500">{tLocal('contrast_desc')}</p>
                      </div>

                      <button
                        type="button"
                        onClick={toggleHighContrast}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          highContrast ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                        aria-label="Alternar Alto Contraste"
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                            highContrast ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Limpar Cache Panel */}
                  <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 space-y-4 font-sans">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-850">{tLocal('performance_storage')}</h3>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-3">
                      <div>
                        <strong className="text-slate-200">{tLocal('clear_cache')}</strong>
                        <p className="text-[10px] text-slate-500 mt-1">{tLocal('clear_cache_desc')}</p>
                      </div>
                      <button 
                        onClick={handleClearCache}
                        type="button"
                        className="px-4 py-2 bg-slate-950 hover:bg-slate-900 hover:text-amber-400 border border-slate-850 rounded-xl text-xs font-bold text-amber-500 transition cursor-pointer shrink-0"
                      >
                        {tLocal('clear_cache_btn')}
                      </button>
                    </div>
                  </div>

                  {/* Support coordinates credits details */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-[10.5px] text-slate-550 leading-relaxed font-mono">
                    {tLocal('support_team')}
                  </div>

                  {/* Settings Actions */}
                  <div className="pt-2 space-y-3">
                    <button 
                      onClick={() => {
                        manualAuthActionRef.current = true;
                        logoutWithFirebase().catch(console.warn);
                        localStorage.removeItem("orbi_logged_email");
                        localStorage.removeItem("orbi_user_profile");
                        localStorage.removeItem("orbi_map_data");
                        localStorage.removeItem("orbi_numerology_data");
                        profileLoadedRef.current = false;
                        lastGeneratedParamsRef.current = "";
                        setLoggedEmail("");
                        setUser({
                          name: "",
                          email: "",
                          birthDate: "",
                          birthTime: "",
                          birthCity: "",
                          isUnknownTime: false,
                          isPremium: true,
                          hasCreatedMap: false
                        });
                        setMapData(null);
                        setNumerology(null);
                        setExtraMaps([]);
                        setIsLoggedIn(false);
                        triggerGlobalNotification("Portal Sair", "Sessão encerrada com sucesso.", "alert");
                        setTimeout(() => {
                          manualAuthActionRef.current = false;
                        }, 2000);
                      }}
                      type="button"
                      className="w-full py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-350 hover:text-white font-sans uppercase tracking-wider transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-amber-500" />
                      {tLocal('logout_app_btn')}
                    </button>

                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      type="button"
                      className="w-full py-3 bg-rose-950/35 hover:bg-rose-950/50 border border-rose-500/20 hover:border-rose-500/30 rounded-2xl text-xs font-bold text-rose-400 font-sans uppercase tracking-wider transition active:scale-98 cursor-pointer"
                    >
                      {tLocal('delete_acc_btn')}
                    </button>
                  </div>
                </div>

                {/* Substantially realistic Account Deletion confirmation prompt */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-rose-500/30 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl">
                        ⚠️
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 font-sans">{tLocal('delete_confirm_title')}</h3>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {tLocal('delete_confirm_desc')}
                      </p>
                      <div className="flex flex-col gap-2 pt-2">
                        <button
                          onClick={handleDeleteAccount}
                          type="button"
                          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          {tLocal('delete_confirm_yes')}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          type="button"
                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          {tLocal('delete_confirm_cancel')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Celestial Avatar Selection Modal */}
                {isAvatarModalOpen && (
                  <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-2xl w-full text-left space-y-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row gap-6 relative max-h-[90vh] overflow-y-auto md:overflow-visible">
                      
                      {/* Close button */}
                      <button 
                        onClick={() => setIsAvatarModalOpen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition p-1.5 rounded-full hover:bg-slate-800 cursor-pointer z-50"
                        title="Fechar"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Left Block: Celestial Carousel Grid */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#E5C158] font-bold">Consagração</span>
                          <h3 className="text-base font-black text-slate-100 font-sans mt-0.5">Selecione seu Avatar Místico</h3>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Sintonize sua identidade estelar escolhendo um dos símbolos celestiais consagrados abaixo.
                          </p>
                        </div>

                        {/* Avatar Category groups */}
                        <div className="space-y-4">
                          {["Astrologia", "Cosmos", "Misticismo"].map(cat => {
                            const avatars = getAvatarsList().filter(a => a.category === cat);
                            return (
                              <div key={cat} className="space-y-2">
                                <h4 className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">{cat}</h4>
                                <div className="grid grid-cols-4 gap-2.5">
                                  {avatars.map(av => {
                                    const isSelected = (user.profilePhoto === av.id || (!user.profilePhoto && av.id === "avatar_lua"));
                                    return (
                                      <button
                                        key={av.id}
                                        type="button"
                                        onClick={async () => {
                                          const nextUser = { ...user, profilePhoto: av.id };
                                          setUser(nextUser);
                                          if (isLoggedIn && loggedEmail) {
                                            try {
                                              await saveProfileToDatabase(loggedEmail, nextUser);
                                              triggerGlobalNotification("Avatar Celestial", `Sua essência foi sintonizada com o arquétipo do ${av.name}!`, "success");
                                            } catch (err) {
                                              console.error("Erro ao salvar avatar no Firestore:", err);
                                            }
                                          } else {
                                            triggerGlobalNotification("Avatar Sintonizado", `Arquétipo ${av.name} ativado temporariamente no seu navegador!`, "info");
                                          }
                                        }}
                                        className={`relative aspect-square rounded-2xl overflow-hidden border transition-all cursor-pointer group flex items-center justify-center p-2 ${
                                          isSelected 
                                            ? "border-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.2)]" 
                                            : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900"
                                        }`}
                                        title={av.name}
                                      >
                                        <div className="w-full h-full flex items-center justify-center relative">
                                          <img src={getAvatarUrl(av.id)} alt={av.name} className="w-full h-full object-contain pointer-events-none" referrerPolicy="no-referrer" />
                                        </div>
                                        {isSelected && (
                                          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Block: Interactive Oracle Insight Preview */}
                      <div className="w-full md:w-52 flex flex-col justify-between p-4 bg-slate-950/70 rounded-2xl border border-slate-850 text-center space-y-4 shrink-0 justify-center">
                        {(() => {
                          const activeId = user.profilePhoto && user.profilePhoto.startsWith("avatar_") ? user.profilePhoto : "avatar_lua";
                          const avDetails = getAvatarsList().find(a => a.id === activeId) || getAvatarsList()[1]; // Default to Lua
                          return (
                            <div className="flex flex-col justify-between h-full space-y-4">
                              <div className="space-y-3">
                                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border border-slate-800 bg-slate-905 flex items-center justify-center p-1.5">
                                  <img src={getAvatarUrl(avDetails.id)} alt={avDetails.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-black text-slate-200 tracking-tight">{avDetails.name}</h4>
                                  <span className="text-[8px] uppercase font-mono text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-md inline-block">
                                    {avDetails.category}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-450 leading-relaxed italic px-1">
                                  "{avDetails.description}"
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => setIsAvatarModalOpen(false)}
                                className="w-full py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-450 hover:to-rose-550 text-slate-950 font-sans font-black text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer"
                              >
                                Sintonizar
                              </button>
                            </div>
                          );
                        })()}
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

          </main>

          {/* ========================================= */}
          {/* BOTTOM FLOATING NAV BAR - (REQUESTED NAVIGATION SYSTEM!) */}
          {/* ========================================= */}
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg bg-slate-900/90 border border-amber-500/15 p-2 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-md z-40 flex justify-between items-center">
            
            {/* Mapa Estelar Tab activator */}
            <button
              onClick={() => setActiveTab('mapa')}
              className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'mapa' 
                  ? 'text-amber-500 bg-amber-500/10' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Orbit className="w-5 h-5" />
              <span className="text-[8px] font-mono uppercase tracking-wide mt-1 font-bold">{getTranslation(lang, 'menu_map', 'Mapa Estelar')}</span>
            </button>

            {/* Constelações Tab activator */}
            <button
              onClick={() => setActiveTab('constelacoes')}
              className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'constelacoes' 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[8px] font-mono uppercase tracking-wide mt-1 font-bold">{getTranslation(lang, 'menu_stars', 'Constelações')}</span>
            </button>

            {/* Planetas Tab activator */}
            <button
              onClick={() => setActiveTab('planetas')}
              className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'planetas' 
                  ? 'text-rose-450 bg-rose-500/10' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span className="text-[8px] font-mono uppercase tracking-wide mt-1 font-bold">{getTranslation(lang, 'menu_planets', 'Planetas')}</span>
            </button>

            {/* Tarot Tab activator */}
            <button
              onClick={() => setActiveTab('tarot')}
              className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'tarot' 
                  ? 'text-amber-500 bg-amber-500/10' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[8px] font-mono uppercase tracking-wide mt-1 font-bold">{getTranslation(lang, 'menu_tarot', 'Tarot')}</span>
            </button>

            {/* Configurações Tab activator */}
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`flex-1 flex flex-col items-center py-2 rounded-full transition-all cursor-pointer ${
                activeTab === 'configuracoes' 
                  ? 'text-[#F59E0B] bg-[#F59E0B]/10' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[8px] font-mono uppercase tracking-wide mt-1 font-bold">{getTranslation(lang, 'menu_settings', 'Ajustes')}</span>
            </button>

          </nav>

        </div>
      )}

      {showAdminPanel && (
        <div className="fixed inset-0 bg-[#02050b] z-50 overflow-y-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-[#070c17] p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-500">🛡️ AMBIENTE DE AUDITORIA, PERFORMANCE & ERROS</span>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="px-3 py-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 rounded-xl transition cursor-pointer"
              >
                Voltar pro Portal
              </button>
            </div>
            <AdminPanel 
              userName={user.name}
              userBirthDate={user.birthDate}
              userBirthSign={selectedZodiacSign}
              triggerGlobalNotification={triggerGlobalNotification}
              firebaseErrors={firebaseErrors}
              onClearErrors={() => setFirebaseErrors([])}
            />
          </div>
        </div>
      )}
    </div>
  );
}
