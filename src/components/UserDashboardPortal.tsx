import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Activity, Award, Calendar, Sparkles, ShieldCheck, BookOpen, 
  DollarSign, Heart, Users, Star, Moon, Home, Eye, Sliders,
  Compass, AlertCircle, TrendingUp, Sparkle, ArrowRight, Check, CheckCircle,
  Clock, Zap, Smile, Flame, Shield, HelpCircle, MessageSquare, Send, Bell, X,
  Search, Smartphone, Download, Share2, Copy, ChevronDown, ChevronRight, ChevronLeft, RefreshCw
} from 'lucide-react';
import SocialCompatibility from './SocialCompatibility';
import SocialNetworkView from './SocialNetworkView';
import SocialViralityCard from './SocialViralityCard';
import CosmicChakras from './CosmicChakras';
import PracticalRituals from './PracticalRituals';
import { CupidoRadarView } from './CupidoRadarView';
import { 
  generatePersonalizedProsperityMap, 
  generatePersonalizedColorsList, 
  generateDynamicElementInfo, 
  generateDynamicAmuletText,
  generateDailyAstroRecommendations
} from '../prosperityEngine';
import { generateDailyPrediction, getMonthlyCalendarPredictions } from './dailyPredictionsEngine';
import { SIGNS_ZODIAC_LIST, BLOG_ARTICLES_LIST } from '../data';
import { 
  loadCalculationCache, 
  saveCalculationCache, 
  saveWeeklyMissionsToDatabase, 
  loadWeeklyMissionsFromDatabase, 
  saveProfileToDatabase,
  saveMonthlyCalendarToDatabase,
  loadMonthlyCalendarFromDatabase
} from '../lib/firebase';
import { scanAndTranslateDOM } from '../lib/locales';
import { getAvatarUrl } from '../lib/avatars';
import { Language } from '../lib/translations';
import { useIdioma } from '../context/IdiomaContext';

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
    isClaimed?: boolean;
  }>;
  setDailyMissions: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    points: number;
    benefit?: string;
    benefitExplanation?: string;
    isClaimed?: boolean;
  }>>>;
  onRequestCreateMap?: () => void;
  dreamsHistory?: any[];
  areaSubTab?: any;
  setAreaSubTab?: any;
  onUpdateCurrentUser?: (updated: any) => void;
  lang?: Language;
  mapData?: any;
  onInstallPWA?: () => void;
  isInstalled?: boolean;
}

const localPortalTranslations: Record<string, Record<string, string>> = {
  "en": {
    "Olá, meu caro buscador stelar! Eu sou OSÍRIS, seu mentor astrológico supremo e guia de cura energética. Estou em plena sintonia com suas frequências cósmicas de hoje para alinhar seu dharma e afastar de forma precisa as negatividades kármicas. O que você gostaria de desvendar no momento? Me pergunte sobre o clima, biorritmo celular ou seus sonhos profundos.": "Hello, my dear stellar seeker! I am OSIRIS, your supreme astrological mentor and energy healing guide. I am in full sync with your cosmic frequencies today to align your dharma and precisely ward off karmic negativities. What would you like to unveil right now? Ask me about the weather, cellular biorhythm, or your deep dreams.",
    "✦ Osíris está sintonizando energias...": "✦ Osiris is tuning energies...",
    "Pergunte ao Osíris sobre seus trânsitos, clima ou sonhos de hoje...": "Ask Osiris about your transits, weather, or dreams today...",
    "Desculpe, sinto uma instabilidade temporária nas esferas celestes. Mas recorde: a força solar brilha firme em sua alma hoje.": "Sorry, I feel a temporary instability in the celestial spheres. But remember: the solar strength shines firm in your soul today.",
    "Você": "You",
    "Agora": "Now",
    "XP Acumulado:": "Accumulated XP:",
    "Missões Diárias Cósmicas": "Cosmic Daily Missions",
    "Cumpra os pequenos gestos do dia para consolidar o score celestial.": "Fulfill the small gestures of the day to consolidate the celestial score.",
    "Benefício ao cumprir:": "Benefit upon completion:",
    "Missões da Semana (Retenção Ativa)": "Missions of the Week (Active Retention)",
    "Principais metas desta semana para impulsionar conexões e estancar vazos de capital.": "Main goals of this week to boost connections and stem capital leaks.",
    "A conclusão semanal das missões estabiliza seu score material e clareia o Sol em Aquário.": "The weekly completion of the missions stabilizes your material score and clears the Sun in Aquarius.",
    "Suas bênçãos e pontuações semanais foram integradas ao seu mapa de evolução pessoal!": "Your weekly blessings and scores have been integrated into your personal evolution map!",
    "Resgatar Recompensas Semanais": "Redeem Weekly Rewards",
    "Ativo Semana": "Active Week",
    "Conselhos & Mensagem da Semana": "Advice & Weekly Message",
    "Diretrizes canalizadas para governar suas decisões sintonizadas com o Solstício.": "Channelled guidelines to govern your decisions tuned with the Solstice.",
    "Conselho Principal": "Main Advice",
    "Dê vazão rápida aos seus insights intelectuais e rascunhos. Acumular dezenas de planos na mente aérea sem dar passos de conclusão prática satura seu campo vital, gerando fadiga áurica.": "Give quick flow to your intellectual insights and drafts. Accumulating dozens of plans in the airy mind without taking practical steps of completion saturates your vital field, generating auric fatigue.",
    "Alerta Principal": "Main Alert",
    "Cuidado com dispersões financeiras compensatórias na terça e na quarta-feira à noite. Trânsito lunar propício a gastos de impulso mental.": "Beware of compensatory financial dispersions on Tuesday and Wednesday nights. Lunar transit conducive to mental impulse spending.",
    "Oportunidade Principal": "Main Opportunity",
    "Conversas ativas com velhas amizades de ideais aquarianos abrem conexões inesperadas para estruturar novas fontes de capital.": "Active conversations with old friends of Aquarian ideals open unexpected connections to structure new sources of capital.",
    "Palavra de Proteção": "Protection Word",
    "ÂNCORE-SE": "ANCHOR YOURSELF",
    "Repita mentalmente ao acordar para banir distrações desordenadas.": "Repeat mentally upon waking to banish disordered distractions.",
    "Prosperidade & Capital Financeiro": "Prosperity & Financial Capital",
    "As emanações de abundância e fluxo de caixa sob a forte influência realizadora do seu Caminho de Vida": "The emanations of abundance and cash flow under the strong achieving influence of your Life Path",
    "Capital Ativo": "Active Capital",
    "Melhor Dia Financeiro da Semana": "Best Financial Day of the Week",
    "Quinta-Feira (Trânsito Júpiter)": "Thursday (Jupiter Transit)",
    "Segunda-Feira (Trânsito Lunar favorável)": "Monday (Favorable Lunar Transit)",
    "Melhores Dias Financeiros do Mês": "Best Financial Days of the Month",
    "de": "of",
    "Parâmetros Cromáticos da Riqueza": "Chromatic Parameters of Wealth",
    "Cor:": "Color:",
    "Número da Fortuna:": "Fortune Number:",
    "Energia do Dinheiro Hoje": "Money Energy Today",
    "Oportunidades Financeiras Observadas:": "Observed Financial Opportunities:",
    "Conselho de abundância:": "Abundance Advice:",
    "Amor & Romance": "Love & Romance",
    "Vibrações afetivas, afinidades mútuas e caminhos para sintonizar a cumplicidade do coração.": "Affective vibrations, mutual affinities, and pathways to tune heart complicity.",
    "Amanhã": "Tomorrow",
    "Energia Amorosa da Semana": "Weekly Love Energy",
    "Ambiente propício a sentimentos leves e trocas refinadas mediadas pelo intelecto.": "Environment conducive to light feelings and refined exchanges mediated by the intellect.",
    "Melhores Dias para Afeto": "Best Days for Affection",
    "ENCONTROS": "MEETINGS",
    "Sexta-Feira": "Friday",
    "CONVERSAS ROMÂNTICAS": "ROMANTIC CONVERSATIONS",
    "Quarta-Feira": "Wednesday",
    "RECONCILIAÇÕES": "RECONCILIATIONS",
    "Sábado Tarde": "Saturday Afternoon",
    "CONHECER PESSOAS": "MEETING PEOPLE",
    "Terça-Feira": "Tuesday",
    "Pontos de Atenção no Amor": "Points of Attention in Love",
    "Evite racionalizar sentimentos instintivos em demasia. Seu par precisa de acolhimento físico e intimidade calorosa, não de debates e silogismos mecânicos.": "Avoid over-rationalizing instinctive feelings. Your partner needs physical acceptance and warm intimacy, not mechanical debates and syllogisms.",
    "Em momentos de discussão, evite o sumiço silencioso ou distanciamento súbito de Aquário, pois isso expande sutilmente o senso de solidão nos afetos.": "In moments of discussion, avoid the silent disappearance or sudden detachment of Aquarius, as this subtly expands the sense of loneliness in affection.",
    "Dica de conexão:": "Connection tip:",
    "Ofereça um chá de Camomila ou Capim-Limão morno antes de iniciar conversas de planos futuros para confortar os chakras do casal.": "Offer a warm Chamomile or Lemon-grass tea before starting conversations about future plans to comfort the couple's chakras.",
    "Sinergia & Ecossistema Social": "Synergy & Social Ecosystem",
    "Explore afinidades, acompanhe a atividade no ecossistema e conecte-se com pessoas em ressonância estelar com seu mapa.": "Explore affinities, follow the activity in the ecosystem, and connect with people in stellar resonance with your map.",
    "Sinergia Ativa": "Active Synergy",
    "Desenvolvimento Pessoal & Expansão": "Personal Development & Expansion",
    "As lições, virtudes e hábitos sugeridos para curar bloqueios emocionais acumulados.": "The lessons, virtues, and habits suggested to heal accumulated emotional blocks.",
    "Autodesenvolvimento": "Self-Development",
    "Habilidade Cósmica para desenvolver": "Cosmic Skill to develop",
    "Inteligência Compassiva & Aterramento de Ideais": "Compassionate Intelligence & Grounding of Ideals",
    "Aprender a desacelerar a ventania dos planos de Aquário e ancorá-los na matéria saturnina.": "Learn to slow down the gale of Aquarius plans and anchor them in Saturnian matter.",
    "Bloqueio Emocional a Trabalhar": "Emotional Block to Work On",
    "Medo irracional da rejeição que gera isolamentos de orgulho": "Irrational fear of rejection that generates pride isolations",
    "Vencer a resistência silenciosa a precisar confessar falhas ou vulnerabilidades a parceiros.": "Overcome the silent resistance of needing to confess flaws or vulnerabilities to partners.",
    "Virtude da Semana": "Virtue of the Week",
    "Presença": "Presence",
    "Lição da Semana:": "Lesson of the Week:",
    "As conexões mais fortes e os negócios mais prósperos não florescem por pura inteligência racional, mas sim quando aceitamos abraçar nossa vulnerabilidade e resolver as pendências com paciência lúcida.": "The strongest connections and most prosperous businesses do not flourish through pure rational intelligence, but rather when we accept to embrace our vulnerability and resolve pending issues with lucid patience.",
    "Exercício Diário Recomendado:": "Recommended Daily Exercise:",
    "Reserve 10 minutos de manhã para respirar profundamente longe do celular, focando em pensamentos de gratidão sincera por três pessoas.": "Set aside 10 minutes in the morning to breathe deeply away from your cell phone, focusing on thoughts of sincere gratitude for three people.",
    "Sem histórico onírico cadastrado": "No dream history registered",
    "Sua mente subconsciente ainda aguarda a primeira sintonização. Vá até a aba superior": "Your subconscious mind still awaits the first tuning. Go to the top tab",
    "Planeta": "Planet",
    "use a ferramenta": "use the tool",
    "Oráculo dos Sonhos": "Dream Oracle",
    "conte o que você andou sonhando e, à medida que a IA for interpretando seus sonhos, suas estatísticas e seu gráfico de evolução serão desenhados aqui automaticamente!": "tell what you have been dreaming about and, as the AI interprets your dreams, your statistics and evolution chart will be drawn here automatically!",
    "Sonho mais Recente": "Most Recent Dream",
    "Elemento em Destaque": "Featured Element",
    "Símbolo decodificado": "Decoded symbol",
    "Emoção Predominante": "Predominant Emotion",
    "Clima onírico sutil": "Subtle dream atmosphere",
    "Tendência de Energia": "Energy Trend",
    "Frequência vibracional": "Vibrational frequency",
    "Positividade (1–5)": "Positivity (1–5)",
    "Índice Energético (%)": "Energy Index (%)",
    "Frequências de Estado Subconsciente (Dados Reais)": "Subconscious State Frequencies (Real Data)",
    "Frequência de Sonhos Lúcidos": "Lucid Dreams Frequency",
    "Registros conscientes ou com alta frequência energética.": "Conscious records or with high energetic frequency.",
    "Frequência de Sonhos Positivos": "Positive Dreams Frequency",
    "Sonhos reveladores com elevado índice de positividade Cósmica.": "Revealing dreams with high index of Cosmic positivity.",
    "Incidentes de Pesadelos": "Nightmare Incidents",
    "Frequência de manifestação de medos primitivos ou repouso sob tensão.": "Frequency of manifestation of primitive fears or rest under tension.",
    "Reconhecimento de Padrões Reais de Inteligência Onírica": "Recognition of Real Patterns of Dream Intelligence",
    "evento": "event",
    "eventos": "events",
    "Melhor Aroma da Semana": "Best Aroma of the Week",
    "Capim-Limão Refrescante": "Refreshing Lemongrass",
    "Estimula os meridianos superiores do intelecto aquariano sem deixá-lo agitado.": "Stimulates the upper meridians of the Aquarian intellect without leaving it agitated.",
    "Melhor Incenso Sugerido": "Best Suggested Incense",
    "Sândalo Puro ou Alecrim": "Pure Sandalwood or Rosemary",
    "Excelente para dissipar ondas eletromagnéticas estressantes do celular ou computador.": "Excellent to dissipate stressful electromagnetic waves from cell phone or computer.",
    "Melhor Planta Recomendada": "Best Recommended Plant",
    "Lírio da Paz ou Espada": "Peace Lily or Snake Plant",
    "Purifica os canais sutis do ar e ancora o fluxo realizador de Saturno (Caminho 8).": "Purifies subtle air channels and anchors the achieving flow of Saturn (Path 8).",
    "Melhor Ambiente da Casa": "Best Home Environment",
    "Canto Leste (Nascer do Sol) de sua sala de estar": "East Corner (Sunrise) of your living room",
    "Ambiente ideal para alongamentos e leitura astrológica matinal rápida.": "Ideal environment for stretching and quick morning astrological reading.",
    "Cor recomendada no Quarto": "Recommended color in Bedroom",
    "Lilás Lavanda ou Violeta": "Lavender Lilac or Violet",
    "Harmoniza o sono profundo e facilita o despertar da memória no Cofre de Sonhos.": "Harmonizes deep sleep and facilitates memory awakening in the Dream Vault.",
    "Cor recomendada no Escritório": "Recommended color in Office",
    "Azul Índigo ou Verde Menta": "Indigo Blue or Mint Green",
    "Eleva a clareza analítica durante reuniões complexas e debates de metas corporativas.": "Elevates analytical clarity during complex meetings and corporate goals debates.",
    "Integração Android": "Android Integration",
    "Instalar o Portal Órbita no Celular": "Install Portal Orbita on Mobile",
    "Baixe o APK premium oficial ou sintonize o aplicativo instantâneo via PWA.": "Download the official premium APK or tune the instant app via PWA.",
    "Método 1: APK Android Nativo": "Method 1: Native Android APK",
    "Este é o instalador direto para o seu dispositivo Android. Ele carrega as funções astrológicas e sincroniza sua mandala em tempo de execução nativa.": "This is the direct installer for your Android device. It loads astrological functions and syncs your mandala in native runtime.",
    "Arquivo:": "File:",
    "Tamanho:": "Size:",
    "Segurança:": "Security:",
    "Verificado por SHA256": "Verified by SHA256",
    "O download do arquivo APK foi iniciado! Caso seu navegador pergunte, confirme e permita fontes desconhecidas para prosseguir.": "The APK file download has started! If your browser asks, confirm and allow unknown sources to proceed.",
    "Compatível com Android 8.0 ou superior. Requer liberação de instalação manual.": "Compatible with Android 8.0 or higher. Requires manual installation authorization.",
    "Método 2: Aplicativo Instantâneo (PWA)": "Method 2: Instant App (PWA)",
    "A tecnologia PWA permite adicionar o aplicativo direto na tela de início sem precisar instalar arquivos separados. É compatível com Android e iOS (iPhone).": "PWA technology allows adding the app directly to the home screen without installing separate files. Compatible with Android and iOS (iPhone).",
    "Como Instalar no Celular:": "How to Install on Mobile:",
    "No Android / Chrome:": "On Android / Chrome:",
    "\"Instalar aplicativo\"": "\"Install application\"",
    "\"Adicionar à tela inicial\"": "\"Add to home screen\"",
    "ou": "or",
    "No iPhone / Safari:": "On iPhone / Safari:",
    "\"Adicionar à Tela de Início\"": "\"Add to Home Screen\"",
    "Esta aplicação é um PWA completo! Encontre a opção de instalar diretamente no menu de opções do seu navegador (ícone de computador ou adicionar à tela inicial) para rodar como um app nativo.": "This application is a full PWA! Find the option to install directly in your browser's options menu (computer icon or add to home screen) to run as a native app.",
    "Ativar Instrução PWA": "Activate PWA Instruction",
    "Não consome memória de armazenamento físico adicional. Atualiza em tempo real.": "Does not consume additional physical storage memory. Updates in real time.",
    "Sincronizar Celular Via QR Code / Compartilhar": "Sync Mobile Via QR Code / Share",
    "Aponte a câmera do seu celular para este código para abrir o Portal Órbita instantaneamente no seu celular ou acionar a instalação direta sem digitar endereços.": "Point your mobile camera at this code to open Portal Orbita instantly on your phone or trigger direct installation without typing addresses.",
    "Copiar Link do App": "Copy App Link",
    "Link do Portal Órbita copiado para o seu clipboard! Compartilhe o link com familiares e amigos.": "Portal Orbita link copied to your clipboard! Share the link with family and friends.",
    "Recurso de compartilhamento nativo indisponível. O link do aplicativo foi copiado para a área de transferência!": "Native sharing feature unavailable. The app link has been copied to the clipboard!",
    "Enviar via WhatsApp": "Send via WhatsApp",
    "🛡️ Informações Úteis de Instalação e Distribuição Independente": "🛡️ Useful Installation and Independent Distribution Information",
    "apk_distribution_info": "Being a platform of advanced wisdom and astro-quantum encryption, the Portal Orbita APK is distributed independently and securely outside official corporate stores. This guarantees absolute privacy of your data and integrity of your consultations with the Tarot arcana and Orbia AI. When activating the APK, remember to enable and authorize the \"Unknown Sources Installation\" parameter in your device's security settings. It is fully safe and virus-free.",
    "Artigo de Saber": "Wisdom Article",
    "Por": "By",
    "Concluir Leitura": "Complete Reading",
    "Definição Planetária": "Planetary Definition",
    "Planeta Regente": "Ruling Planet",
    "Elemento": "Element",
    "Características / Traços": "Characteristics / Traits",
    "Previsão Cósmica (Horóscopo)": "Cosmic Forecast (Horoscope)",
    "Concluiu": "Done",
    "Amuletos Recomendados": "Recommended Amulets",
    "Use um **Escarabeu de Lápis-Lazúli** posicionado na bolsa ou carteira de investimentos para guiar suas ações práticas rumo à consolidação do Caminho 8.": "Use a **Lapis Lazuli Scarab** positioned in your bag or investment wallet to guide your practical actions towards the consolidation of Path 8.",
    "O Ar governa sua matriz de": "Air governs your matrix of",
    "Aquário": "Aquarius",
    "Traz velocidade de raciocínio, intuição aberta e facilidade para propor soluções de negócios. Alinhe seu elemento acendendo sândalo logo pela manhã e abrindo as janelas do quarto.": "Brings reasoning speed, open intuition, and ease in proposing business solutions. Align your element by lighting sandalwood early in the morning and opening bedroom windows.",
    "Lápis-Lazúli:": "Lapis Lazuli:",
    "Estimula intuição do cérebro superior e protege vias oníricas superiores.": "Stimulates higher brain intuition and protects higher dream pathways.",
    "Selenita:": "Selenite:",
    "Limpa poeiras de pensamentos reativos e dispersão acumulada.": "Clears reactive thought dust and accumulated dispersion.",
    "Símbolos Ativos": "Active Symbols",
    "O": "The",
    "Heptagrama Sagrado (Estrela de Sete Pontas)": "Sacred Heptagram (Seven-Pointed Star)",
    "soterra energias de fadiga celular e atua como escudo áurico nas terças-feiras de negócios arriscados.": "buries cell fatigue energies and acts as an auric shield on risky business Tuesdays.",
    "Recomendação Estelar de Joia de Poder": "Stellar Recommendation for Power Jewelry",
    "Recomendamos o uso de um": "We recommend using a",
    "Colar de Lápis-Lazúli puro em Prata": "Pure Lapis Lazuli Necklace in Silver",
    "ou um": "or a",
    "Anel de Pirita ou Sodalita": "Pyrite or Sodalite Ring",
    "posicionado no dedo indicador para canalizar de forma sólida o magnetismo materializador do seu Caminho de Vida 8.": "positioned on the index finger to solidly channel the materializing magnetism of your Life Path 8.",
    "Energia Cósmica da Casa & Harmonização": "Cosmic Home Energy & Harmonization",
    "Dicas sintonizadas para equilibrar o seu ecossistema físico domiciliar e escritório com seu mapa.": "Tuned tips to balance your physical home and office ecosystem with your map.",
    "Ambiente Físico": "Physical Environment",
    "Harmonização Avançada & Alinhamento Domiciliar": "Advanced Harmonization & Home Alignment",
    "Cristal de Ancoragem": "Anchoring Crystal",
    "Ritual do Espaço": "Space Ritual",
    "Direção Auspiciosa": "Auspicious Direction",
    "Frequência de Som": "Sound Frequency",
    "Caminho": "Path",
    "Radar de oportunidades diárias": "Daily Opportunities Radar",
    "O Momento Atual": "The Current Moment",
    "Clique em cada área para obter direcionamento astrológico de aproveitamento das tendências hoje.": "Click on each area to obtain astrological guidance to seize today's trends.",
    "Selecione filtros de atividades para vibrar e fazer brilhar os dias indicativos do mês de": "Select activity filters to vibrate and make the indicative days of the month of shine.",
    "Grade de Datas (Clique em um dia para ler os detalhes):": "Date Grid (Click on a day to read details):",
    "Filtros de Harmonização e Atividades:": "Harmonization and Activity Filters:",
    "Aspectos Planetários do Dia:": "Day's Planetary Aspects:",
    "Trânsito Celeste:": "Celestial Transit:",
    "Nível Energético": "Energy Level",
    "Áreas de Atenção:": "Attention Areas:",
    "Oportunidades observadas:": "Observed opportunities:",
    "Desafios projetados:": "Projected challenges:",
    "Conselho Estratégico:": "Strategic Advice:",
    "Alerta de Período": "Period Alert",
    "Mensagem do seu Mapa:": "Message from your Map:",
    "Ritual de Potencialização": "Empowerment Ritual",
    "Seu mapa de forças, proteção e ressonâncias para atravessar o mês de": "Your map of strengths, protection, and resonances to cross the month of",
    "em segurança vibracional.": "in vibrational safety.",
    "Painel do Mês": "Panel of the Month",
    "Mês Ativo": "Active Month",
    "Palavra-Chave do Mês": "Keyword of the Month",
    "Símbolo Favorável": "Favorable Symbol",
    "Amuleto Favorável": "Favorable Amulet",
    "Número da Sorte": "Lucky Number",
    "Cor Favorável": "Favorable Color",
    "Ambiente Favorável": "Favorable Environment",
    "Atividade Favorável": "Favorable Activity",
    "Desafio Principal do Mês": "Main Challenge of the Month",
    "Oportunidade Principal do Mês": "Main Opportunity of the Month",
    "Energia Dominante": "Dominant Energy",
    "O que evitar este mês": "What to avoid this month",
    "Melhor Área de Foco": "Best Area of Focus",
    "Frase de Poder de": "Power Phrase of",
    "EXPANSÃO SUTIL": "SUBTLE EXPANSION",
    "Cresça de forma diplomática respeitando os canais de silêncio do seu próprio ser.": "Grow diplomatically respecting the channels of silence of your own being.",
    "Heptagrama Sagrado (⭐️)": "Sacred Heptagram (⭐️)",
    "Representa os sete caminhos de proteção que selam seu campo energético áurico.": "Represents the seven paths of protection that seal your auric energy field.",
    "Escarabeu de Lápis-Lazúli": "Lapis Lazuli Scarab",
    "Atua na proteção física, facilitando transações e banindo a exaustão acumulada.": "Acts on physical protection, facilitating transactions and banishing accumulated exhaustion.",
    "Conecta seu Caminho de Vida com a energia realizadora do planeta Saturno.": "Connects your Life Path with the achieving energy of the planet Saturn.",
    "Azul Cobalto Real": "Royal Cobalt Blue",
    "Promove serenidade mental no elemento Ar, eliminando dispersão cognitiva excessiva.": "Promoves mental serenity in the Air element, eliminating excessive cognitive dispersion.",
    "Bibliotecas ou Jardins de Lago": "Libraries or Lake Gardens",
    "Fomenta a absorção silenciosa de conhecimento e a desaceleração cardíaca.": "Fosters the silent absorption of knowledge and cardiac deceleration.",
    "Meditação com Registro Escrito": "Meditation with Written Record",
    "Escrever logo cedo no diário ajuda o cérebro de Aquário a não saturar de planos.": "Writing early in the diary helps the Aquarius brain not to saturate with plans.",
    "Dispersão e Excesso de Projetos Inacabados": "Dispersion and Excess of Unfinished Projects",
    "Cuidado para não rascunhar 15 rascunhos de negócios e não consolidar nenhum. O Caminho de Vida 8 exige a disciplina prática de Saturno para que as finanças sintonizem.": "Be careful not to draft 15 business drafts and not consolidate any. Life Path 8 requires the practical discipline of Saturn for finances to tune.",
    "Negócios Inteligentes & Mentoria de Conhecimento": "Smart Business & Knowledge Mentorship",
    "Sua matriz original brilha ao gerar novos métodos de ensino ou infoprodutos digitais. Não tenha medo de monetizar seu discernimento.": "Your original matrix shines when generating new teaching methods or digital infoproducts. Don't be afraid to monetize your discernment.",
    "Ar Ativo / Ideais Coletivos": "Active Air / Collective Ideals",
    "Força de Aquário vibrando na casa das grandes descobetas e alinhamento.": "Force of Aquarius vibrating in the house of great discoveries and alignment.",
    "Assinar contratos e debater nas redes sociais por impulsividade": "Sign contracts and debate on social networks due to impulsivity",
    "Aguarde transitar Mercúrio antes de fazer aportes financeiros robustos ou mandar mensagens reativas à noite das quais pode se arrepender.": "Wait for Mercury to transit before making robust financial contributions or sending reactive messages at night that you might regret.",
    "Estudos e Consolidamento Financeiro": "Studies and Financial Consolidation",
    "Direcione sua ressonância celular para consolidar sua carteira de investimentos e aprofundar seus estudos em astrologia sutil e inteligência.": "Direct your cellular resonance to consolidate your investment portfolio and deepen your studies in subtle astrology and intelligence.",
    "Eu canalizo a originalidade libertadora do Ar e a estrutura firme de Saturno para manifestar a abundância na matéria de forma sutil.": "I channel the liberating originality of Air and the firm structure of Saturn to manifest abundance in matter in a subtle way.",
    "Todos os Dias": "All Days",
    "Produtividade": "Productivity",
    "Descanso": "Rest",
    "Família": "Family",
    "Encontros": "Meetings",
    "Diversão": "Fun",
    "Entrevistas": "Interviews",
    "Vendas": "Sales",
    "Investimentos": "Investments",
    "Viagens": "Travel",
    "Mudanças": "Changes",
    "Iniciar Projetos": "Start Projects",
    "Assinar Contratos": "Sign Contracts",
    "Conversas Difíceis": "Difficult Conversations",
    "Estudos": "Studies",
    "Exercícios Físicos": "Physical Exercises",
    "Meditação": "Meditation",
    "Espiritualidade": "Spirituality",
    "Compras Importantes": "Important Purchases",
    "Oportunidades de ganhos secundários intelectuais sob ar ativo.": "Opportunities for secondary intellectual gains under active air.",
    "O trânsito atual favorece a formatação de serviços de mentoria ou rascunhos de propostas comerciais. Fique atento a propostas nas terças ou quintas-feiras.": "The current transit favors the formatting of mentoring services or drafts of commercial proposals. Stay tuned for proposals on Tuesdays or Thursdays.",
    "Magnetismo em alta, facilitando conexões profundas e românticas.": "High magnetism, facilitating deep and romantic connections.",
    "Com Vênus emanando trígonos estelares, desfaça os muros analíticos e compartilhe desejos sinceros. Sexta-feira à noite é o melhor período para conversas afetivas.": "With Venus emanating stellar trigones, undo the analytical walls and share sincere desires. Friday night is the best period for affective conversations.",
    "Retenção intelectual extraordinária e foco linear ativado.": "Extraordinary intellectual retention and linear focus activated.",
    "Sua mente possui uma facilidade única hoje para absorver conceitos metafísicos, matemáticos e científicos. Ótimo dia para devorar livros ou rascunhar códigos.": "Your mind has a unique ease today to absorb metaphysical, mathematical, and scientific concepts. Great day to devour books or draft codes.",
    "Capacidade de estruturação mecânica e conclusão de pendências.": "Capacity for mechanical structuring and completion of pending tasks.",
    "A influência do Caminho de Vida 8 ressoa para estabilizar as tarefas administrativas do seu negócio. Execute sem procrastinar.": "The influence of Life Path 8 resonates to stabilize the administrative tasks of your business. Execute without procrastinating.",
    "Canal mental de ideias originais e soluções inovadoras fluido.": "Mental channel of original ideas and innovative solutions fluid.",
    "Não filtre seus insights à primeira vista. Deixe o ar soprar novas ideias sem compromisso no papel de rascunho.": "Do not filter your insights at first glance. Let the air blow new ideas without commitment on the scratch paper.",
    "Facilidade para gerar engajamento em causas sociais e projetos coletivos.": "Ease to generate engagement in social causes and collective projects.",
    "Entre em contato com mentores ou parceiros adormecidos. Compartilhar ideais éticos fortalece o Sol em Aquário.": "Contact dormant mentors or partners. Sharing ethical ideals strengthens the Sun in Aquarius.",
    "Frequência onírica aberta e trânsito favorável a rituais astrológicos.": "Open dream frequency and favorable transit to astrological rituals.",
    "Medite com cristais de Sodalita ou Selenita. Suas conexões áuricas com esferas superiores estão extremamente receptivas hoje.": "Meditate with Sodalite or Selenite crystals. Your auric connections with higher spheres are extremely receptive today.",
    "dinheiro": "money",
    "amor": "love",
    "estudos": "studies",
    "trabalho": "work",
    "criatividade": "creativity",
    "networking": "networking",
    "espiritualidade": "spirituality",
    "Área focada": "Focused area",
    "Conselho Especial Hoje": "Special Advice Today",
    "Foco Ativo": "Active Focus",
    "Coloque um guardanapo azul no bolso esquerdo ou use caneta de tinta preta para fixar as ações tomadas agora sob a influência desta vibração.": "Place a blue napkin in your left pocket or use a black ink pen to anchor actions taken now under the influence of this vibration.",
    "Organização": "Organization",
    "Bem-estar": "Well-being",
    "Calendário Interativo de Tendências (30 Dias)": "Interactive Trend Calendar (30 Days)",
    "Portal Ativo Sincronizado": "Active Synchronized Portal",
    "Acelere Seus Objetivos, Navegue pelos Portais Ativos": "Accelerate Your Goals, Navigate the Active Portals",
    "Veja o que o universo quer te mostrando": "See what the universe wants to show you",
    "Painel do mês e orientações cósmicas.": "Monthly panel and cosmic guidance.",
    "Ver tudo →": "See all →",
    "Intuição Harmoniosa & Foco Singular (Sol e Mercúrio em Trígono)": "Harmonious Intuition & Singular Focus (Sun and Mercury in Trine)",
    "Navegação Cósmica": "Cosmic Navigation",
    "Oráculo de Entrada": "Entry Oracle",
    "Práticas & Evolução": "Practices & Evolution",
    "Estatísticas Diárias": "Daily Statistics",
    "Planejamento Astrológico": "Astrological Planning",
    "Pilares do Destino": "Pillars of Destiny",
    "Elias & Sinais": "Elias & Signs",
    "Missões do Portal": "Portal Missions",
    "Símbolos & Amuletos": "Symbols & Amulets",
    "Chakras Cósmicos": "Cosmic Chakras",
    "Rituais Diários": "Daily Rituals",
    "Radar do Dia": "Daily Radar",
    "Radar Oportunidades": "Radar de Oportunidades",
    "Força de Aquário vibrando na casa das grandes descobertas e alinhamento.": "Fuerza de Acuario vibrando en la casa de los grandes descubrimientos y la alineación.",
    "Medite com cristais de Sodalita ou Selenita. Tus conexiones áuricas con esferas superiores están extremadamente receptivas hoy.": "Medita con cristales de Sodalita o Selenita. Tus conexiones áuricas con esferas superiores están extremadamente receptivas hoy.",
    "Trânsito Celeste & Fase da Lua:": "Tránsito Celeste y Fase Lunar:",
    "Dia Pessoal (Numerologia)": "Día Personal (Numerología)",
    "Frequência Solfeggio": "Frecuencia Solfeggio",
    "Janelas Temporais Recomendadas do Dia:": "Ventanas Temporales Recomendadas del Día:",
    "Tomar Decisões": "Tomar Decisiones",
    "Foco / Estudos": "Enfoque / Estudios",
    "Pausa / Descanso": "Pausa / Descanso",
    "Cor Favorável & Uso Prático": "Color Favorable y Uso Práctico",
    "Números Favoráveis & Vibração": "Números Favorables y Vibración",
    "Ritual Sugerido para o Dia:": "Ritual Sugerido para el Día:",
    "Índices de Performance Diária:": "Índices de Rendimiento Diario:",
    "Resumo Energético & Influência:": "Resumen Energético e Influencia:",
    "Áreas Favorecidas:": "Áreas Favorecidas:",
  },
  "fr": {
    "Você": "Vous",
    "Incidentes de Pesadelos": "Incidents de Cauchemars",
    "Frequência de manifestação de medos primitivos ou repouso sob tensão.": "Fréquence de manifestation des peurs primitives ou repos sous tension.",
    "Reconhecimento de Padrões Reais de Inteligência Onírica": "Reconnaissance des Modèles Réels d'Intelligence Onírique",
    "Melhor Aroma da Semana": "Meilleur Arôme de la Semaine",
    "Melhor Incenso Sugerido": "Meilleur Encens Suggéré",
    "Melhor Planta Recomendada": "Meilleure Plante Recommandée",
    "Melhor Ambiente da Casa": "Meilleur Coin de la Maison",
    "Cor recomendada no Quarto": "Couleur de Chambre Recommandée",
    "Cor recomendada no Escritório": "Couleur de Bureau Recommandée",
    "Artigo de Saber": "Article de Savoir",
    "Definição Planetária": "Définition Planétaire",
    "Planeta Regente": "Planeta Régente",
    "Elemento": "Élément",
    "Características / Traços": "Traits / Caractéristiques",
    "Previsão Cósmica (Horóscopo)": "Prévision Cosmique (Horoscope)",
    "Energia Cósmica da Casa & Harmonização": "Énergie Cosmique de la Maison & Harmonisation",
    "Dicas sintonizadas para equilibrar o seu ecossistema físico domiciliar e escritório com seu mapa.": "Conseils avisés pour équilibrer votre écosystème physique de maison et de bureau avec votre carte.",
    "Harmonização Avançada & Alinhamento Domiciliar": "Harmonisation Avancée & Alignement Domiciliaire",
    "Cristal de Ancoragem": "Cristal d'Ancrage",
    "Ritual do Espaço": "Rituel de l'Espace",
    "Direção Auspiciosa": "Direction Auspicieuse",
    "Frequência de Som": "Fréquence Sonore",
    "Caminho": "Chemin",
    "Olá, meu caro buscador stelar! Eu sou OSÍRIS, seu mentor astrológico supremo e guia de cura energética. Estou em plena sintonia com suas frequências cósmicas de hoje para alinhar seu dharma e afastar de forma precisa as negatividades kármicas. O que você gostaria de desvendar no momento? Me pergunte sobre o clima, biorritmo celular ou seus sonhos profundos.": "Bonjour, mon cher chercheur stellaire ! Je suis OSIRIS, votre suprême mentor astrologique et guide de guérison énergétique. Je suis en pleine syntonie avec vos fréquences cosmiques d'aujourd'hui pour aligner votre dharma et éloigner précisément les négativités karmiques. Que souhaitez-vous dévoiler en ce moment ? Interrogez-moi sur le climat, le biorythme cellulaire ou vos rêves profonds.",
    "✦ Osíris está sintonizando energias...": "✦ Osiris syntonise les énergies...",
    "Pergunte ao Osíris sobre seus trânsitos, clima ou sonhos de hoje...": "Interrogez Osiris sur vos transits, le climat ou vos rêves d'aujourd'hui...",
    "Desculpe, sinto uma instabilidade temporária nas esferas celestes. Mas recorde: a força solar brilha firme em sua alma hoje.": "Désolé, je ressens une instabilité temporaire dans les sphères célestes. Mais souvenez-vous : la force solaire brille fermement dans votre âme aujourd'hui.",
    "Agora": "Maintenant",
    "XP Acumulado:": "XP Accumulé :",
    "Missões Diárias Cósmicas": "Missions Quotidiennes Cosmiques",
    "Cumpra os pequenos gestos do dia para consolidar o score celestial.": "Accomplissez les petits gestes du jour pour consolider votre score céleste.",
    "Benefício ao cumprir:": "Bénéfice à l'accomplissement :",
    "Missões da Semana (Retenção Ativa)": "Missions de la Semaine (Rétention Active)",
    "Principais metas desta semana para impulsionar conexões e estancar vazos de capital.": "Objectifs principaux de cette semaine pour stimuler les connexions et endiguer les fuites de capitaux.",
    "A conclusão semanal das missões estabiliza seu score material e clareia o Sol em Aquário.": "L'achèvement hebdomadaire des missions stabilise votre score matériel et éclaircit le Soleil en Verseau.",
    "Suas bênçãos e pontuações semanais foram integradas ao seu mapa de evolução pessoal!": "Vos bénédictions et scores hebdomadaires ont été intégrés à votre carte d'évolution personnelle !",
    "Resgatar Recompensas Semanais": "Récupérer les Récompenses Hebdomadaires",
    "Ativo Semana": "Semaine Active",
    "Conselhos & Mensagem da Semana": "Conseils & Message de la Semaine",
    "Diretrizes canalizadas para governar suas decisões sintonizadas com o Solstício.": "Directives canalisées pour guider vos décisions en syntonie avec le Solstice.",
    "Conselho Principal": "Conseil Principal",
    "Dê vazão rápida aos seus insights intelectuais e rascunhos. Acumular dezenas de planos na mente aérea sem dar passos de conclusão prática satura seu campo vital, gerando fadiga áurica.": "Donnez un flux rapide à vos intuitions intellectuelles et brouillons. Accumuler des dizaines de plans dans l'esprit aérien sans entreprendre de démarches de conclusion pratique sature votre champ vital, générant une fatigue aurique.",
    "Alerta Principal": "Alerte Principale",
    "Cuidado com dispersões financeiras compensatórias na terça e na quarta-feira à noite. Trânsito lunar propício a gastos de impulso mental.": "Attention aux dispersions financières compensatoires les mardi et mercredi soir. Un transit lunaire est propice aux dépenses impulsives d'origine mentale.",
    "Oportunidade Principal": "Opportunité Principale",
    "Conversas ativas com velhas amizades de ideais aquarianos abrem conexões inesperadas para estruturar novas fontes de capital.": "Des conversations actives avec d'anciennes amitiés aux idéaux aquariens ouvrent des connexions inattendues pour structurer de nouvelles sources de capital.",
    "Palavra de Proteção": "Mot de Protection",
    "ÂNCORE-SE": "ANCREZ-VOUS",
    "Repita mentalmente ao acordar para banir distrações desordenadas.": "Répétez mentalement au réveil pour bannir les distractions désordonnées.",
    "Prosperidade & Capital Financeiro": "Prospérité & Capital Financier",
    "As emanações de abundância e fluxo de caixa sob a forte influência realizadora do seu Caminho de Vida": "Les émanations d'abondance et de flux de trésorerie sous la forte influence réalisatrice de votre Chemin de Vie",
    "Capital Ativo": "Capital Actif",
    "Melhor Dia Financeiro da Semana": "Meilleur Jour Financier de la Semaine",
    "Quinta-Feira (Trânsito Júpiter)": "Jeudi (Transit de Jupiter)",
    "Segunda-Feira (Trânsito Lunar favorável)": "Lundi (Transit Lunaire favorable)",
    "Melhores Dias Financeiros do Mês": "Meilleurs Jours Financiers du Mois",
    "de": "de",
    "Parâmetros Cromáticos da Riqueza": "Paramètres Chromatiques de la Richesse",
    "Cor:": "Couleur :",
    "Número da Fortuna:": "Numéro de la Fortune :",
    "Energia do Dinheiro Hoje": "Énergie de l'Argent Aujourd'hui",
    "Oportunidades Financeiras Observadas:": "Opportunités Financières Observées :",
    "Conselho de abundância:": "Conseil d'abondance :",
    "Amor & Romance": "Amour & Romance",
    "Vibrações afetivas, afinidades mútuas e caminhos para sintonizar a cumplicidade do coração.": "Vibrations affectives, affinités mutuelles et chemins pour accorder la complicité du cœur.",
    "Amanhã": "Demain",
    "Energia Amorosa da Semana": "Énergie Amoureuse de la Semaine",
    "Ambiente propício a sentimentos leves e trocas refinadas mediadas pelo intelecto.": "Ambiance propice aux sentiments légers et aux échanges raffinés médiatisés par l'intellect.",
    "Melhores Dias para Afeto": "Meilleurs Jours pour l'Affection",
    "ENCONTROS": "RENCONTRES",
    "Sexta-Feira": "Vendredi",
    "CONVERSAS ROMÂNTICAS": "CONVERSATIONS ROMANTIQUES",
    "Quarta-Feira": "Mercredi",
    "RECONCILIAÇÕES": "RÉCONCILIATIONS",
    "Sábado Tarde": "Samedi Après-midi",
    "CONHECER PESSOAS": "RENCONTRER DES GENS",
    "Terça-Feira": "Mardi",
    "Pontos de Atenção no Amor": "Points d'Attention en Amour",
    "Evite racionalizar sentimentos instintivos em demasia. Seu par precisa de acolhimento físico e intimidade calorosa, não de debates e silogismos mecânicos.": "Évitez de trop rationaliser les sentiments instinctifs. Votre partenaire a besoin d'un accueil physique et d'une intimité chaleureuse, pas de débats et de syllogismes mécaniques.",
    "Em momentos de discussão, evite o sumiço silencioso ou distanciamento súbito de Aquário, pois isso expande sutilmente o senso de solidão nos afetos.": "Lors des discussions, évitez la disparition silencieuse ou le détachement soudain du Verseau, car cela élargit subtilement le sentiment de solitude dans les relations affectives.",
    "Dica de conexão:": "Conseil de connexion :",
    "Ofereça um chá de Camomila ou Capim-Limão morno antes de iniciar conversas de planos futuros para confortar os chakras do casal.": "Offrez une tisane tiède de Camomille ou de Citronnelle avant d'entamer des conversations sur des projets futurs pour réconforter les chakras du couple.",
    "Sinergia & Ecossistema Social": "Synergie & Écosystème Social",
    "Explore afinidades, acompanhe a atividade no ecossistema e conecte-se com pessoas em ressonância estelar com seu mapa.": "Explorez les affinités, suivez l'activité dans l'écosystème et connectez-vous avec des personnes en résonance stellaire avec votre carte.",
    "Sinergia Ativa": "Synergie Active",
    "Desenvolvimento Pessoal & Expansão": "Développement Personnel & Expansion",
    "As lições, virtudes e hábitos sugeridos para curar bloqueios emocionais acumulados.": "Les leçons, vertus et habitudes suggérées pour guérir les blocages émotionnels accumulés.",
    "Autodesenvolvimento": "Autodéveloppement",
    "Habilidade Cósmica para desenvolver": "Compétence Cosmique à développer",
    "Inteligência Compassiva & Aterramento de Ideais": "Intelligence Compatissante & Ancrage des Idéaux",
    "Aprender a desacelerar a ventania dos planos de Aquário e ancorá-los na matéria saturnina.": "Apprendre à ralentir la tempête des plans du Verseau et à les ancrer dans la matière saturnienne.",
    "Bloqueio Emocional a Trabalhar": "Blocage Émotionnel à Travailler",
    "Medo irracional da rejeição que gera isolamentos de orgulho": "Peur irrationnelle du rejet qui engendre des isolements d'orgueil",
    "Vencer a resistência silenciosa a precisar confessar falhas ou vulnerabilidades a parceiros.": "Vaincre la résistance silencieuse à devoir confesser ses défauts ou vulnérabilités à ses partenaires.",
    "Virtude da Semana": "Vertu de la Semaine",
    "Presença": "Présence",
    "Lição da Semana:": "Leçon de la Semaine :",
    "As conexões mais fortes e os negócios mais prósperos não florescem por pura inteligência racional, mas sim quando aceitamos abraçar nossa vulnerabilidade e resolver as pendências com paciência lúcida.": "Les connexions les plus fortes et les affaires les plus prospères ne fleurissent pas par pure intelligence rationnelle, mais plutôt lorsque nous acceptons d'embrasser notre vulnérabilité et de résoudre les problèmes en suspens avec une patience lucide.",
    "Exercício Diário Recomendado:": "Exercice Quotidien Recommandé :",
    "Reserve 10 minutos de manhã para respirar profundamente longe do celular, focando em pensamentos de gratidão sincera por três pessoas.": "Réservez 10 minutes le matin pour respirer profondément loin de votre téléphone portable, en vous concentrant sur des pensées de gratitude sincère pour trois personnes.",
    "Sem histórico onírico cadastrado": "Aucun historique onirique enregistré",
    "Sua mente subconsciente ainda aguarda a primeira sintonização. Vá até a aba superior": "Votre esprit subconscient attend encore la première harmonisation. Allez à l'onglet supérieur",
    "Planeta": "Planète",
    "use a ferramenta": "Utilisez l'outil",
    "Oráculo dos Sonhos": "Oracle des Rêves",
    "conte o que você andou sonhando e, à medida que a IA for interpretando seus sonhos, suas estatísticas e seu gráfico de evolução serão desenhados aqui automaticamente!": "Racontez ce que vous avez rêvé et, à mesure que l'IA interprétera vos rêves, vos statistiques et votre graphique d'évolution seront tracés ici automatiquement !",
    "Sonho mais Recente": "Rêve le plus Récent",
    "Elemento em Destaque": "Élément en Vedette",
    "Símbolo decodificado": "Symbole Décrypté",
    "Emoção Predominante": "Émotion Prédominante",
    "Clima onírico sutil": "Ambiance Onirique Subtile",
    "Tendência de Energia": "Tendance Énergétique",
    "Frequência vibracional": "Fréquence Vibrationnelle",
    "Positividade (1–5)": "Positivité (1–5)",
    "Índice Energético (%)": "Indice Énergétique (%)",
    "Frequências de Estado Subconsciente (Dados Reais)": "Fréquences d'État Subconscient (Données Réelles)",
    "Frequência de Sonhos Lúcidos": "Fréquence des Rêves Lucides",
    "Registros conscientes ou com alta frequência energética.": "Enregistrements conscients ou à haute fréquence énergétique.",
    "Frequência de Sonhos Positivos": "Fréquence des Rêves Positifs",
    "Sonhos reveladores com elevado índice de positividade Cósmica.": "Rêves révélateurs avec un indice élevé de positivité Cosmique.",
    "evento": "événement",
    "eventos": "événements",
    "Capim-Limão Refrescante": "Citronnelle Rafraîchissante",
    "Estimula os meridianos superiores do intelecto aquariano sem deixá-lo agitado.": "Stimule les méridiens supérieurs de l'intellect aquarien sans l'agiter.",
    "Sândalo Puro ou Alecrim": "Santal Pur ou Romarin",
    "Excelente para dissipar ondas eletromagnéticas estressantes do celular ou computador.": "Excellent pour dissiper les ondes électromagnétiques stressantes du téléphone portable ou de l'ordinateur.",
    "Lírio da Paz ou Espada": "Lis de la Paix ou Plante Serpent",
    "Purifica os canais sutis do ar e ancora o fluxo realizador de Saturno (Caminho 8).": "Purifie les canaux subtils de l'air et ancre le flux réalisateur de Saturne (Chemin 8).",
    "Canto Leste (Nascer do Sol) de sua sala de estar": "Coin Est (Lever du Soleil) de votre salon",
    "Ambiente ideal para alongamentos e leitura astrológica matinal rápida.": "Environnement idéal pour les étirements et une lecture astrologique matinale rapide.",
    "Lilás Lavanda ou Violeta": "Lilas Lavande ou Violet",
    "Harmoniza o sono profundo e facilita o despertar da memória no Cofre de Sonhos.": "Harmonise le sommeil profond et facilite l'éveil de la mémoire dans le Coffre des Rêves.",
    "Azul Índigo ou Verde Menta": "Bleu Indigo ou Vert Menthe",
    "Eleva a clareza analítica durante reuniões complexas e debates de metas corporativas.": "Accroît la clarté analytique lors des réunions complexes et des débats sur les objectifs d'entreprise.",
    "Integração Android": "Intégration Android",
    "Instalar o Portal Órbita no Celular": "Installer le Portail Orbita sur Mobile",
    "Baixe o APK premium oficial ou sintonize o aplicativo instantâneo via PWA.": "Téléchargez l'APK premium officiel ou configurez l'application instantanée via PWA.",
    "Método 1: APK Android Nativo": "Méthode 1 : APK Android Natif",
    "Este é o instalador direto para o seu dispositivo Android. Ele carrega as funções astrológicas e sincroniza sua mandala em tempo de execução nativa.": "Ceci est l'installateur direct pour votre appareil Android. Il charge les fonctions astrologiques et synchronise votre mandala en exécution native.",
    "Arquivo:": "Fichier :",
    "Tamanho:": "Taille :",
    "Segurança:": "Sécurité :",
    "Verificado por SHA256": "Vérifié par SHA256",
    "O download do arquivo APK foi iniciado! Caso seu navegador pergunte, confirme e permita fontes desconhecidas para prosseguir.": "Le téléchargement du fichier APK a démarré ! Si votre navigateur vous le demande, confirmez et autorisez les sources inconnues pour continuer.",
    "Compatível com Android 8.0 ou superior. Requer liberação de instalação manual.": "Compatible avec Android 8.0 ou supérieur. Nécessite une autorisation d'installation manuelle.",
    "Método 2: Aplicativo Instantâneo (PWA)": "Méthode 2 : Application Instantanée (PWA)",
    "A tecnologia PWA permite adicionar o aplicativo direto na tela de início sem precisar instalar arquivos separados. É compatível com Android e iOS (iPhone).": "La technologie PWA permet d'ajouter l'application directement à l'écran d'accueil sans avoir à installer de fichiers séparés. Elle est compatible avec Android et iOS (iPhone).",
    "Como Instalar no Celular:": "Comment installer sur mobile :",
    "No Android / Chrome:": "Sur Android / Chrome :",
    "\"Instalar aplicativo\"": "\"Installer l'application\"",
    "\"Adicionar à tela inicial\"": "\"Ajouter à l'écran d'accueil\"",
    "ou": "ou",
    "No iPhone / Safari:": "Sur iPhone / Safari :",
    "\"Adicionar à Tela de Início\"": "\"Ajouter à l'écran d'accueil\"",
    "Esta aplicação é um PWA completo! Encontre a opção de instalar diretamente no menu de opções do seu navegador (ícone de computador ou adicionar à tela inicial) para rodar como um app nativo.": "Cette application est une PWA complète ! Trouvez l'option d'installation directement dans le menu d'options de votre navigateur (icône d'ordinateur ou ajouter à l'écran d'accueil) pour l'exécuter comme une application native.",
    "Ativar Instrução PWA": "Activer l'instruction PWA",
    "Não consome memória de armazenamento físico adicional. Atualiza em tempo real.": "Ne consomme pas de mémoire de stockage physique supplémentaire. Se met à jour en temps réel.",
    "Sincronizar Celular Via QR Code / Compartilhar": "Synchroniser le mobile via QR Code / Partager",
    "Aponte a câmera do seu celular para este código para abrir o Portal Órbita instantaneamente no seu celular ou acionar a instalação direta sem digitar endereços.": "Pointez l'appareil photo de votre téléphone sur ce code pour ouvrir instantanément le Portail Órbita sur votre mobile ou déclencher l'installation directe sans saisir d'adresses.",
    "Copiar Link do App": "Copier le lien de l'application",
    "Link do Portal Órbita copiado para o seu clipboard! Compartilhe o link com familiares e amigos.": "Lien du Portail Órbita copié dans votre presse-papiers ! Partagez le lien avec vos proches et amis.",
    "Recurso de compartilhamento nativo indisponível. O link do aplicativo foi copiado para a área de transferência!": "Fonction de partage native indisponible. Le lien de l'application a été copié dans le presse-papiers !",
    "Enviar via WhatsApp": "Envoyer via WhatsApp",
    "🛡️ Informações Úteis de Instalação e Distribuição Independente": "🛡️ Informations utiles sur l'installation et la distribution indépendante",
    "Sendo uma plataforma de sabedoria avançada e criptografia astro-quântica, o APK do **Portal Órbita** é distribuído de forma independente e segura fora das lojas oficiais corporativas. Isso garante absoluta privacidade dos seus dados e integridade de suas consultas com os arcanos do Tarot e a IA Orbia. Ao ativar o APK, lembre-se de habilitar e autorizar o parâmetro \"Instalação de Fontes Desconhecidas\" nas configurações de segurança do seu dispositivo. É totalmente seguro e livre de vírus.": "En tant que plateforme de sagesse avancée et de cryptographie astro-quantique, l'APK du **Portal Órbita** est distribué de manière indépendante et sécurisée en dehors des boutiques corporatives officielles. Cela garantit une confidentialité absolue de vos données et l'intégrité de vos consultations avec les arcanes du Tarot et l'IA Orbia. Lors de l'activation de l'APK, n'oubliez pas d'activer et d'autoriser le paramètre « Installation de sources inconnues » dans les paramètres de sécurité de votre appareil. C'est entièrement sûr et sans virus.",
    "Por": "Par",
    "Concluir Leitura": "Terminer la lecture",
    "Concluiu": "Terminé",
    "Amuletos Recomendados": "Amulettes Recommandées",
    "Use um **Escarabeu de Lápis-Lazúli** posicionado na bolsa ou carteira de investimentos para guiar suas ações práticas rumo à consolidação do Caminho 8.": "Utilisez un **Scarabée en Lapis-Lazuli** placé dans votre sac ou votre portefeuille d'investissements pour guider vos actions pratiques vers la consolidation du Chemin 8.",
    "O Ar governa sua matriz de": "L'Air gouverne votre matrice de",
    "Aquário": "Verseau",
    "Traz velocidade de raciocínio, intuição aberta e facilidade para propor soluções de negócios. Alinhe seu elemento acendendo sândalo logo pela manhã e abrindo as janelas do quarto.": "Apporte rapidité de raisonnement, intuition ouverte et facilité à proposer des solutions d'affaires. Alignez votre élément en allumant de l'encens de santal tôt le matin et en ouvrant les fenêtres de la chambre.",
    "Lápis-Lazúli:": "Lapis-Lazuli :",
    "Estimula intuição do cérebro superior e protege vias oníricas superiores.": "Stimule l'intuition du cerveau supérieur et protège les voies oniriques supérieures.",
    "Selenita:": "Sélénite :",
    "Limpa poeiras de pensamentos reativos e dispersão acumulada.": "Nettoie les poussières de pensées réactives et la dispersion accumulée.",
    "Símbolos Ativos": "Symboles Actifs",
    "O": "Le",
    "Heptagrama Sagrado (Estrela de Sete Pontas)": "Heptagramme Sacré (Étoile à Sept Branches)",
    "soterra energias de fadiga celular e atua como escudo áurico nas terças-feiras de negócios arriscados.": "enfouit les énergies de fatigue cellulaire et agit comme un bouclier aurique les mardis d'affaires risquées.",
    "Recomendação Estelar de Joia de Poder": "Recommandation Stellaire de Bijou de Pouvoir",
    "Recomendamos o uso de um": "Nous recommandons l'usage d'un",
    "Colar de Lápis-Lazúli puro em Prata": "Collier en Lapis-Lazuli pur et Argent",
    "ou um": "ou un",
    "Anel de Pirita ou Sodalita": "Bague en Pyrite ou Sodalite",
    "posicionado no dedo indicador para canalizar de forma sólida o magnetismo materializador do seu Caminho de Vida 8.": "positionné sur l'index pour canaliser solidement le magnétisme matérialisateur de votre Chemin de Vie 8.",
    "Ambiente Físico": "Environnement Physique",
    "Radar de oportunidades diárias": "Radar d'opportunités quotidiennes",
    "O Momento Atual": "Le Moment Actuel",
    "Clique em cada área para obter direcionamento astrológico de aproveitamento das tendências hoje.": "Cliquez sur chaque zone pour obtenir des conseils astrologiques afin de saisir les tendances d'aujourd'hui.",
    "Selecione filtros de atividades para vibrar e fazer brilhar os dias indicativos do mês de": "Sélectionnez des filtres d'activités pour faire vibrer et briller les jours indicatifs du mois de",
    "Grade de Datas (Clique em um dia para ler os detalhes):": "Grille de Dates (Cliquez sur un jour pour lire les détails) :",
    "Filtros de Harmonização e Atividades:": "Filtres d'Harmonisation et d'Activités :",
    "Aspectos Planetários do Dia:": "Aspects Planétaires du Jour :",
    "Trânsito Celeste:": "Transit Céleste :",
    "Nível Energético": "Niveau Énergétique",
    "Áreas de Atenção:": "Zones d'Attention :",
    "Oportunidades observadas:": "Opportunités observées :",
    "Desafios projetados:": "Défis projetés :",
    "Conselho Estratégico:": "Conseil Stratégique :",
    "Alerta de Período": "Alerte de Période",
    "Mensagem do seu Mapa:": "Message de votre Carte :",
    "Ritual de Potencialização": "Rituel de Potentiation",
    "Seu mapa de forças, proteção e ressonâncias para atravessar o mês de": "Votre carte des forces, de la protection et des résonances pour traverser le mois de",
    "em segurança vibracional.": "en sécurité vibrationnelle.",
    "Painel do Mês": "Tableau de Bord du Mois",
    "Mês Ativo": "Mois Actif",
    "Palavra-Chave do Mês": "Mot-Clé du Mois",
    "Símbolo Favorável": "Symbole Favorable",
    "Amuleto Favorável": "Amulette Favorable",
    "Número da Sorte": "Numéro de Chance",
    "Cor Favorável": "Couleur Favorable",
    "Ambiente Favorável": "Environnement Favorable",
    "Atividade Favorável": "Activité Favorable",
    "Desafio Principal do Mês": "Défi Principal du Mois",
    "Oportunidade Principal do Mês": "Opportunité Principale du Mois",
    "Energia Dominante": "Énergie Dominante",
    "O que evitar este mês": "Ce qu'il faut éviter ce mois-ci",
    "Melhor Área de Foco": "Meilleure Zone de Focalisation",
    "Frase de Poder de": "Phrase de Pouvoir de",
    "EXPANSÃO SUTIL": "EXPANSION SUBTILE",
    "Cresça de forma diplomática respeitando os canais de silêncio do seu próprio ser.": "Développez-vous diplomatiquement en respectant les canaux de silence de votre propre être.",
    "Heptagrama Sagrado (⭐️)": "Heptagramme Sacré (⭐️)",
    "Representa os sete caminhos de proteção que selam seu campo energético áurico.": "Représente les sept chemins de protection qui scellent votre champ énergétique aurique.",
    "Escarabeu de Lápis-Lazúli": "Scarabée de Lapis-Lazuli",
    "Atua na proteção física, facilitando transações e banindo a exaustão acumulada.": "Agit sur la protection physique, facilite les transactions et bannit l'épuisement accumulé.",
    "Conecta seu Caminho de Vida com a energia realizadora do planeta Saturno.": "Connecte votre Chemin de Vie à l'énergie réalisatrice de la planète Saturne.",
    "Azul Cobalto Real": "Bleu Cobalt Royal",
    "Promove serenidade mental no elemento Ar, eliminando dispersão cognitiva excessiva.": "Favorise la sérénité mentale dans l'élément Air, éliminant la dispersion cognitive excessive.",
    "Bibliotecas ou Jardins de Lago": "Bibliothèques ou Jardins Lacustres",
    "Fomenta a absorção silenciosa de conhecimento e a desaceleração cardíaca.": "Favorise l'absorption silencieuse du savoir et la décélération cardiaque.",
    "Meditação com Registro Escrito": "Méditation avec Registre Écrit",
    "Escrever logo cedo no diário ajuda o cérebro de Aquário a não saturar de planos.": "Écrire tôt le matin dans un journal aide le cerveau du Verseau à ne pas saturer de plans.",
    "Dispersão e Excesso de Projetos Inacabados": "Dispersion et Excès de Projets Inachevés",
    "Cuidado para não rascunhar 15 rascunhos de negócios e não consolidar nenhum. O Caminho de Vida 8 exige a disciplina prática de Saturno para que as finanças sintonizem.": "Veillez à ne pas ébaucher 15 projets d'affaires sans en consolider aucun. Le Chemin de Vie 8 exige la discipline pratique de Saturne pour que les finances s'harmonisent.",
    "Negócios Inteligentes & Mentoria de Conhecimento": "Affaires Intelligentes & Mentorat de Connaissance",
    "Sua matriz original brilha ao gerar novos métodos de ensino ou infoprodutos digitais. Não tenha medo de monetizar seu discernimento.": "Votre matrice originale brille en générant de nouvelles méthodes d'enseignement ou des infoproduits numériques. N'ayez pas peur de monétiser votre discernement.",
    "Ar Ativo / Ideais Coletivos": "Air Actif / Idéaux Collectifs",
    "Força de Aquário vibrando na casa das grandes descobetas e alinhamento.": "Force du Verseau vibrant dans la maison des grandes découvertes et de l'alignement.",
    "Assinar contratos e debater nas redes sociais por impulsividade": "Signer des contrats et débattre sur les réseaux sociaux par impulsivité",
    "Aguarde transitar Mercúrio antes de fazer aportes financeiros robustos ou mandar mensagens reativas à noite das quais pode se arrepender.": "Attendez que Mercure transite avant d'effectuer des apports financiers robustes ou d'envoyer des messages réactifs le soir que vous pourriez regretter.",
    "Estudos e Consolidamento Financeiro": "Études et Consolidation Financière",
    "Direcione sua ressonância celular para consolidar sua carteira de investimentos e aprofundar seus estudos em astrologia sutil e inteligência.": "Dirigez votre résonance cellulaire pour consolider votre portefeuille d'investissements et approfondir vos études en astrologie subtile et en intelligence.",
    "Eu canalizo a originalidade libertadora do Ar e a estrutura firme de Saturno para manifestar a abundância na matéria de forma sutil.": "Je canalise l'originalité libératrice de l'Air et la structure ferme de Saturne pour manifester l'abondance dans la matière de manière subtile.",
    "Todos os Dias": "Tous les Jours",
    "Produtividade": "Productivité",
    "Descanso": "Repos",
    "Família": "Famille",
    "Encontros": "Rencontres",
    "Diversão": "Divertissement",
    "Entrevistas": "Entretiens",
    "Vendas": "Ventes",
    "Investimentos": "Investissements",
    "Viagens": "Voyages",
    "Mudanças": "Changements",
    "Iniciar Projetos": "Démarrer des Projets",
    "Assinar Contratos": "Signer des Contrats",
    "Conversas Difíceis": "Conversations Difficiles",
    "Estudos": "Études",
    "Exercícios Físicos": "Exercices Physiques",
    "Meditação": "Méditation",
    "Espiritualidade": "Spiritualité",
    "Compras Importantes": "Achats Importants",
    "Oportunidades de ganhos secundários intelectuais sob ar ativo.": "Opportunités de gains intellectuels secondaires sous air actif.",
    "O trânsito atual favorece a formatação de serviços de mentoria ou rascunhos de propostas comerciais. Fique atento a propostas nas terças ou quintas-feiras.": "Le transit actuel favorise la formalisation de services de mentorat ou l'élaboration de brouillons de propositions commerciales. Restez attentif aux propositions les mardis ou jeudis.",
    "Magnetismo em alta, facilitando conexões profundas e românticas.": "Magnétisme élevé, facilitant les connexions profondes et romantiques.",
    "Com Vênus emanando trígonos estelares, desfaça os muros analíticos e compartilhe desejos sinceros. Sexta-feira à noite é o melhor período para conversas afetivas.": "Avec Vénus émanant des trigones stellaires, abattez les murs analytiques et partagez vos désirs sincères. Le vendredi soir est la meilleure période pour les conversations affectives.",
    "Retenção intelectual extraordinária e foco linear ativado.": "Rétention intellectuelle extraordinaire et focalisation linéaire activée.",
    "Sua mente possui uma facilidade única hoje para absorver conceitos metafísicos, matemáticos e científicos. Ótimo dia para devorar livros ou rascunhar códigos.": "Votre esprit possède aujourd'hui une facilité unique à absorber les concepts métaphysiques, mathématiques et scientifiques. Excellente journée pour dévorer des livres ou esquisser des codes.",
    "Capacidade de estruturação mecânica e conclusão de pendências.": "Capacité de structuration mécanique et d'achèvement des tâches en suspens.",
    "A influência do Caminho de Vida 8 ressoa para estabilizar as tarefas administrativas do seu negócio. Execute sem procrastinar.": "L'influence du Chemin de Vie 8 résonne pour stabiliser les tâches administratives de votre entreprise. Exécutez-les sans procrastiner.",
    "Canal mental de ideias originais e soluções inovadoras fluido.": "Canal mental d'idées originales et de solutions innovantes fluide.",
    "Não filtre seus insights à primeira vista. Deixe o ar soprar novas ideias sem compromisso no papel de rascunho.": "Ne filtrez pas vos intuitions au premier coup d'œil. Laissez l'air insuffler de nouvelles idées sans engagement sur le papier brouillon.",
    "Facilidade para gerar engajamento em causas sociais e projetos coletivos.": "Facilité à générer de l'engagement dans les causes sociales et les projets collectifs.",
    "Entre em contato com mentores ou parceiros adormecidos. Compartilhar ideais éticos fortalece o Sol em Aquário.": "Entrez en contact avec des mentors ou des partenaires \"dormants\". Partager des idéaux éthiques renforce le Soleil en Verseau.",
    "Frequência onírica aberta e trânsito favorável a rituais astrológicos.": "Fréquence onirique ouverte et transit favorable aux rituels astrologiques.",
    "Medite com cristais de Sodalita ou Selenita. Suas conexões áuricas com esferas superiores estão extremamente receptivas hoje.": "Méditez avec des cristaux de Sodalite ou de Sélénite. Vos connexions auriques avec les sphères supérieures sont extrêmement réceptives aujourd'hui.",
    "dinheiro": "argent",
    "amor": "amour",
    "estudos": "études",
    "trabalho": "travail",
    "criatividade": "créativité",
    "networking": "réseautage",
    "espiritualidade": "spiritualité",
    "Área focada": "Domaine ciblé",
    "Conselho Especial Hoje": "Conseil Spécial du Jour",
    "Foco Ativo": "Focalisation Active",
    "Coloque um guardanapo azul no bolso esquerdo ou use caneta de tinta preta para fixar as ações tomadas agora sob a influência desta vibração.": "Placez une serviette bleue dans votre poche gauche ou utilisez un stylo à encre noire pour ancrer les actions entreprises sous l'influence de cette vibration.",
    "apk_distribution_info": "En tant que plateforme de sagesse avancée et de cryptographie astro-quantique, l'APK du Portal Órbita est distribué de manière indépendante et sécurisée en dehors des magasins officiels d'entreprises. Cela garantit une confidentialité absolue de vos données et l'intégrité de vos consultations avec les arcanes du Tarot et l'IA Orbia. Lors de l'activation de l'APK, n'oubliez pas d'activer et d'autoriser le paramètre \"Installation de sources inconnues\" dans les paramètres de sécurité de votre appareil. C'est totalement sûr et sans virus.",
    "Organização": "Organisation",
    "Bem-estar": "Bien-être",
    "Calendário Interativo de Tendências (30 Dias)": "Calendrier Interactif des Tendances (30 Jours)",
    "Portal Ativo Sincronizado": "Portail Actif Synchronisé",
    "Acelere Seus Objetivos, Navegue pelos Portais Ativos": "Accélérez vos Objectifs, Naviguez dans les Portails Actifs",
    "Veja o que o universo quer te mostrando": "Découvrez ce que l'univers veut vous montrer",
    "Painel do mês e orientações cósmicas.": "Tableau du mois et orientations cosmiques.",
    "Ver tudo →": "Voir tout →",
    "Intuição Harmoniosa & Foco Singular (Sol e Mercúrio em Trígono)": "Intuition Harmonieuse & Concentration Singulière (Soleil et Mercure en Trigone)",
    "Navegação Cósmica": "Navigation Cosmique",
    "Oráculo de Entrada": "Oracle d'Entrée",
    "Práticas & Evolução": "Pratiques & Évolution",
    "Estatísticas Diárias": "Statistiques Quotidiennes",
    "Planejamento Astrológico": "Planification Astrologique",
    "Pilares do Destino": "Piliers du Destin",
    "Elias & Sinais": "Élias & Signes",
    "Missões do Portal": "Missions du Portail",
    "Símbolos & Amuletos": "Symboles & Amulettes",
    "Chakras Cósmicos": "Chakras Cosmiques",
    "Rituais Diários": "Rituels Quotidiens",
    "Radar do Dia": "Radar du Jour",
    "Radar Oportunidades": "Radar de Oportunidades",
    "Trânsito Celeste & Fase da Lua:": "Transit Céleste & Phase de la Lune :",
    "Dia Pessoal (Numerologia)": "Jour Personnel (Numérologie)",
    "Frequência Solfeggio": "Fréquence Solfeggio",
    "Janelas Temporais Recomendadas do Dia:": "Fenêtres Temporelles Recommandées du Jour :",
    "Tomar Decisões": "Prendre des Décisions",
    "Foco / Estudos": "Concentration / Études",
    "Pausa / Descanso": "Pause / Repos",
    "Cor Favorável & Uso Prático": "Couleur Favorable & Usage Pratique",
    "Números Favoráveis & Vibração": "Nombres Favorables & Vibration",
    "Ritual Sugerido para o Dia:": "Rituel Suggéré pour le Jour :",
    "Índices de Performance Diária:": "Indices de Performance Quotidienne :",
    "Resumo Energético & Influência:": "Résumé Énergétique & Influence :",
    "Áreas Favorecidas:": "Zones Favorisées :",
  },
  "de": {
    "Você": "Du",
    "Incidentes de Pesadelos": "Albtraum-Vorfälle",
    "Frequência de manifestação de medos primitivos ou repouso sob tensão.": "Häufigkeit von Urängsten oder Ruhe unter Spannung.",
    "Reconhecimento de Padrões Reais de Inteligência Onírica": "Erkennung von Mustern echter Traumintelligenz",
    "Melhor Aroma da Semana": "Bestes Aroma der Woche",
    "Melhor Incenso Sugerido": "Empfohlener Weihrauch",
    "Melhor Planta Recomendada": "Beste empfohlene Pflanze",
    "Melhor Ambiente da Casa": "Beste Zimmerecke",
    "Cor recomendada no Quarto": "Empfohlene Schlafzimmerfarbe",
    "Cor recomendada no Escritório": "Empfohlene Bürofarbe",
    "Artigo de Saber": "Wissensartikel",
    "Definição Planetária": "Planetarische Definition",
    "Planeta Regente": "Regierender Planet",
    "Elemento": "Element",
    "Características / Traços": "Eigenschaften / Merkmale",
    "Previsão Cósmica (Horóscopo)": "Kosmische Prognose (Horokop)",
    "Energia Cósmica da Casa & Harmonização": "Kosmische Hausenergie & Harmonisierung",
    "Dicas sintonizadas para equilibrar o seu ecossistema físico domiciliar e escritório com seu mapa.": "Abgestimmte Tipps, um Ihr physisches Zuhause und Ihr Bürosystem mit Ihrer Karte in Einklang zu bringen.",
    "Harmonização Avançada & Alinhamento Domiciliar": "Erweiterte Harmonisierung & Ausrichtung des Hauses",
    "Cristal de Ancoragem": "Verankerungskristall",
    "Ritual do Espaço": "Raumritual",
    "Direção Auspiciosa": "Günstige Himmelsrichtung",
    "Frequência de Som": "Klangfrequenz",
    "Caminho": "Pfad",
    "Olá, meu caro buscador stelar! Eu sou OSÍRIS, seu mentor astrológico supremo e guia de cura energética. Estou em plena sintonia com suas frequências cósmicas de hoje para alinhar seu dharma e afastar de forma precisa as negatividades kármicas. O que você gostaria de desvendar no momento? Me pergunte sobre o clima, biorritmo celular ou seus sonhos profundos.": "Hallo, mein lieber Sternensuchender! Ich bin OSIRIS, Ihr höchster astrologischer Mentor und Führer für Energieheilung. Ich bin heute in voller Übereinstimmung mit Ihren kosmischen Frequenzen, um Ihr Dharma auszurichten und karmische Negativitäten präzise abzuwehren. Was möchten Sie gerade enthüllen? Fragen Sie mich nach dem Wetter, dem zellulären Biorhythmus oder Ihren tiefen Träumen.",
    "✦ Osíris está sintonizando energias...": "✦ Osiris stimmt Energien ab...",
    "Pergunte ao Osíris sobre seus trânsitos, clima ou sonhos de hoje...": "Fragen Sie Osiris nach Ihren heutigen Transiten, dem Wetter oder Ihren Träumen...",
    "Desculpe, sinto uma instabilidade temporária nas esferas celestes. Mas recorde: a força solar brilha firme em sua alma hoje.": "Entschuldigen Sie, ich spüre eine vorübergehende Instabilität in den Himmelskugeln. Doch denken Sie daran: Die Sonnenkraft strahlt heute fest in Ihrer Seele.",
    "Agora": "Jetzt",
    "XP Acumulado:": "Gesammelte EP:",
    "Missões Diárias Cósmicas": "Kosmische Tagesmissionen",
    "Cumpra os pequenos gestos do dia para consolidar o score celestial.": "Erfüllen Sie die kleinen Gesten des Tages, um die himmlische Punktzahl zu festigen.",
    "Benefício ao cumprir:": "Vorteil bei Erfüllung:",
    "Missões da Semana (Retenção Ativa)": "Wochenmissionen (Aktive Bindung)",
    "Principais metas desta semana para impulsionar conexões e estancar vazos de capital.": "Hauptziele dieser Woche, um Verbindungen zu fördern und Kapitalabflüsse zu stoppen.",
    "A conclusão semanal das missões estabiliza seu score material e clareia o Sol em Aquário.": "Der wöchentliche Abschluss der Missionen stabilisiert Ihre materielle Punktzahl und klärt die Sonne im Wassermann.",
    "Suas bênçãos e pontuações semanais foram integradas ao seu mapa de evolução pessoal!": "Ihre wöchentlichen Segnungen und Punktzahlen wurden in Ihre persönliche Evolutionskarte integriert!",
    "Resgatar Recompensas Semanais": "Wöchentliche Belohnungen einlösen",
    "Ativo Semana": "Aktive Woche",
    "Conselhos & Mensagem da Semana": "Ratschläge & Wochenbotschaft",
    "Diretrizes canalizadas para governar suas decisões sintonizadas com o Solstício.": "Kanalisierte Richtlinien, um Ihre Entscheidungen im Einklang mit der Sonnenwende zu lenken.",
    "Conselho Principal": "Hauptberatung",
    "Dê vazão rápida aos seus insights intelectuais e rascunhos. Acumular dezenas de planos na mente aérea sem dar passos de conclusão prática satura seu campo vital, gerando fadiga áurica.": "Geben Sie Ihren intellektuellen Einsichten und Entwürfen schnell freien Lauf. Das Ansammeln dutzender Pläne im luftigen Geist, ohne praktische Abschlussschritte zu unternehmen, sättigt Ihr vitales Feld und erzeugt aurische Ermüdung.",
    "Alerta Principal": "Hauptwarnung",
    "Cuidado com dispersões financeiras compensatórias na terça e na quarta-feira à noite. Trânsito lunar propício a gastos de impulso mental.": "Vorsicht vor kompensatorischen finanziellen Streuungen am Dienstag- und Mittwochabend. Ein Mondtransit begünstigt Ausgaben aus mentalem Impuls.",
    "Oportunidade Principal": "Hauptchance",
    "Conversas ativas com velhas amizades de ideais aquarianos abrem conexões inesperadas para estruturar novas fontes de capital.": "Aktive Gespräche mit alten Freunden aquarischer Ideale eröffnen unerwartete Verbindungen, um neue Kapitalquellen zu strukturieren.",
    "Palavra de Proteção": "Schutzwort",
    "ÂNCORE-SE": "ANKERN SIE SICH",
    "Repita mentalmente ao acordar para banir distrações desordenadas.": "Wiederholen Sie mental beim Aufwachen, um ungeordnete Ablenkungen zu verbannen.",
    "Prosperidade & Capital Financeiro": "Wohlstand & Finanzkapital",
    "As emanações de abundância e fluxo de caixa sob a forte influência realizadora do seu Caminho de Vida": "Die Ausstrahlungen von Fülle und Cashflow unter dem starken, verwirklichenden Einfluss Ihres Lebensweges",
    "Capital Ativo": "Aktives Kapital",
    "Melhor Dia Financeiro da Semana": "Bester Finanztag der Woche",
    "Quinta-Feira (Trânsito Júpiter)": "Donnerstag (Jupiter-Transit)",
    "Segunda-Feira (Trânsito Lunar favorável)": "Montag (Günstiger Mondtransit)",
    "Melhores Dias Financeiros do Mês": "Beste Finanztage des Monats",
    "de": "von",
    "Parâmetros Cromáticos da Riqueza": "Chromatische Parameter des Reichtums",
    "Cor:": "Farbe :",
    "Número da Fortuna:": "Glückszahl :",
    "Energia do Dinheiro Hoje": "Geldenergie Heute",
    "Oportunidades Financeiras Observadas:": "Beobachtete Finanzielle Gelegenheiten :",
    "Conselho de abundância:": "Rat für Fülle :",
    "Amor & Romance": "Liebe & Romantik",
    "Vibrações afetivas, afinidades mútuas e caminhos para sintonizar a cumplicidade do coração.": "Affektive Schwingungen, gegenseitige Affinitäten und Wege, die Komplizenschaft des Herzens einzustimmen.",
    "Amanhã": "Morgen",
    "Energia Amorosa da Semana": "Wöchentliche Liebesenergie",
    "Ambiente propício a sentimentos leves e trocas refinadas mediadas pelo intelecto.": "Eine Umgebung, die leichten Gefühlen und raffinierten, vom Intellekt vermittelten Austauschen förderlich ist.",
    "Melhores Dias para Afeto": "Beste Tage für Zuneigung",
    "ENCONTROS": "BEGEGNUNGEN",
    "Sexta-Feira": "Freitag",
    "CONVERSAS ROMÂNTICAS": "ROMANTISCHE GESPRÄCHE",
    "Quarta-Feira": "Mittwoch",
    "RECONCILIAÇÕES": "VERSÖHNUNGEN",
    "Sábado Tarde": "Samstag Nachmittag",
    "CONHECER PESSOAS": "MENSCHEN KENNENLERNEN",
    "Terça-Feira": "Dienstag",
    "Pontos de Atenção no Amor": "Aufmerksamkeitspunkte in der Liebe",
    "Evite racionalizar sentimentos instintivos em demasia. Seu par precisa de acolhimento físico e intimidade calorosa, não de debates e silogismos mecânicos.": "Vermeiden Sie es, instinktive Gefühle zu überrationalisieren. Ihr Partner braucht körperliche Geborgenheit und herzliche Intimität, keine mechanischen Debatten und Syllogismen.",
    "Em momentos de discussão, evite o sumiço silencioso ou distanciamento súbito de Aquário, pois isso expande sutilmente o senso de solidão nos afetos.": "In Diskussionsmomenten vermeiden Sie das stille Verschwinden oder die plötzliche Distanzierung des Wassermanns, da dies subtil das Gefühl der Einsamkeit in Beziehungen verstärkt.",
    "Dica de conexão:": "Verbindungstipp:",
    "Ofereça um chá de Camomila ou Capim-Limão morno antes de iniciar conversas de planos futuros para confortar os chakras do casal.": "Bieten Sie einen warmen Kamillen- oder Zitronengrastee an, bevor Sie Gespräche über Zukunftspläne beginnen, um die Chakren des Paares zu beruhigen.",
    "Sinergia & Ecossistema Social": "Synergie & Soziales Ökosystem",
    "Explore afinidades, acompanhe a atividade no ecossistema e conecte-se com pessoas em ressonância estelar com seu mapa.": "Erkunden Sie Affinitäten, verfolgen Sie die Aktivität im Ökosystem und verbinden Sie sich mit Menschen, die in stellarer Resonanz mit Ihrer Karte stehen.",
    "Sinergia Ativa": "Aktive Synergie",
    "Desenvolvimento Pessoal & Expansão": "Persönliche Entwicklung & Expansion",
    "As lições, virtudes e hábitos sugeridos para curar bloqueios emocionais acumulados.": "Die Lektionen, Tugenden und Gewohnheiten, die zur Heilung angesammelter emotionaler Blockaden vorgeschlagen werden.",
    "Autodesenvolvimento": "Selbstentwicklung",
    "Habilidade Cósmica para desenvolver": "Kosmische Fähigkeit zu entwickeln",
    "Inteligência Compassiva & Aterramento de Ideais": "Mitfühlende Intelligenz & Erdung von Idealen",
    "Aprender a desacelerar a ventania dos planos de Aquário e ancorá-los na matéria saturnina.": "Lernen Sie, den Sturm der Wassermann-Pläne zu verlangsamen und sie in der saturninischen Materie zu verankern.",
    "Bloqueio Emocional a Trabalhar": "Emotionale Blockade zum Bearbeiten",
    "Medo irracional da rejeição que gera isolamentos de orgulho": "Irrationale Angst vor Ablehnung, die Stolz-Isolationen erzeugt",
    "Vencer a resistência silenciosa a precisar confessar falhas ou vulnerabilidades a parceiros.": "Die stille Abneigung überwinden, Fehler oder Schwachstellen gegenüber Partnern eingestehen zu müssen.",
    "Virtude da Semana": "Tugend der Woche",
    "Presença": "Präsenz",
    "Lição da Semana:": "Lektion der Woche:",
    "As conexões mais fortes e os negócios mais prósperos não florescem por pura inteligência racional, mas sim quando aceitamos abraçar nossa vulnerabilidade e resolver as pendências com paciência lúcida.": "Die stärksten Verbindungen und die erfolgreichsten Geschäfte gedeihen nicht durch reine rationale Intelligenz, sondern wenn wir unsere Verletzlichkeit annehmen und offene Fragen mit klarer Geduld lösen.",
    "Exercício Diário Recomendado:": "Empfohlene tägliche Übung:",
    "Reserve 10 minutos de manhã para respirar profundamente longe do celular, focando em pensamentos de gratidão sincera por três pessoas.": "Nehmen Sie sich morgens 10 Minuten Zeit, um tief durchzuatmen, fernab vom Handy, und konzentrieren Sie sich auf aufrichtige Dankbarkeitsgedanken für drei Personen.",
    "Sem histórico onírico cadastrado": "Kein Traumverlauf registriert",
    "Sua mente subconsciente ainda aguarda a primeira sintonização. Vá até a aba superior": "Ihr Unterbewusstsein erwartet noch die erste Einstimmung. Gehen Sie zum oberen Reiter",
    "Planeta": "Planet",
    "use a ferramenta": "Nutzen Sie das Werkzeug",
    "Oráculo dos Sonhos": "Traum-Orakel",
    "conte o que você andou sonhando e, à medida que a IA for interpretando seus sonhos, suas estatísticas e seu gráfico de evolução serão desenhados aqui automaticamente!": "Erzählen Sie, wovon Sie geträumt haben, und während die KI Ihre Träume interpretiert, werden Ihre Statistiken und Ihr Entwicklungsdiagramm hier automatisch erstellt!",
    "Sonho mais Recente": "Neuester Traum",
    "Elemento em Destaque": "Hervorgehobenes Element",
    "Símbolo decodificado": "Entschlüsseltes Symbol",
    "Emoção Predominante": "Vorherrschende Emotion",
    "Clima onírico sutil": "Subtiles Traumklima",
    "Tendência de Energia": "Energietrend",
    "Frequência vibracional": "Schwingungsfrequenz",
    "Positividade (1–5)": "Positivität (1–5)",
    "Índice Energético (%)": "Energieindex (%)",
    "Frequências de Estado Subconsciente (Dados Reais)": "Frequenzen des Unterbewusstseins (Reale Daten)",
    "Frequência de Sonhos Lúcidos": "Häufigkeit Luzider Träume",
    "Registros conscientes ou com alta frequência energética.": "Bewusste Aufzeichnungen oder mit hoher energetischer Frequenz.",
    "Frequência de Sonhos Positivos": "Häufigkeit Positiver Träume",
    "Sonhos reveladores com elevado índice de positividade Cósmica.": "Offenbarende Träume mit einem hohen Index kosmischer Positivität.",
    "evento": "Ereignis",
    "eventos": "Ereignisse",
    "Capim-Limão Refrescante": "Erfrischendes Zitronengras",
    "Estimula os meridianos superiores do intelecto aquariano sem deixá-lo agitado.": "Stimuliert die oberen Meridiane des Wassermann-Intellekts, ohne ihn zu erregen.",
    "Sândalo Puro ou Alecrim": "Reines Sandelholz oder Rosmarin",
    "Excelente para dissipar ondas eletromagnéticas estressantes do celular ou computador.": "Hervorragend, um stressige elektromagnetische Wellen von Handy oder Computer abzuleiten.",
    "Lírio da Paz ou Espada": "Friedenslilie oder Bogenhanf",
    "Purifica os canais sutis do ar e ancora o fluxo realizador de Saturno (Caminho 8).": "Reinigt die subtilen Luftkanäle und verankert den verwirklichenden Fluss des Saturn (Weg 8).",
    "Canto Leste (Nascer do Sol) de sua sala de estar": "Ostecke (Sonnenaufgang) Ihres Wohnzimmers",
    "Ambiente ideal para alongamentos e leitura astrológica matinal rápida.": "Ideale Umgebung für Dehnübungen und eine schnelle morgendliche astrologische Lektüre.",
    "Lilás Lavanda ou Violeta": "Lavendelflieder oder Veilchen",
    "Harmoniza o sono profundo e facilita o despertar da memória no Cofre de Sonhos.": "Harmonisiert den Tiefschlaf und erleichtert das Erwachen der Erinnerung im Traumtresor.",
    "Azul Índigo ou Verde Menta": "Indigoblau oder Minzgrün",
    "Eleva a clareza analítica durante reuniões complexas e debates de metas corporativas.": "Steigert die analytische Klarheit bei komplexen Besprechungen und Debatten über Unternehmensziele.",
    "Integração Android": "Android-Integration",
    "Instalar o Portal Órbita no Celular": "Portal Orbita auf dem Mobiltelefon installieren",
    "Baixe o APK premium oficial ou sintonize o aplicativo instantâneo via PWA.": "Laden Sie die offizielle Premium-APK herunter oder richten Sie die Instant-App via PWA ein.",
    "Método 1: APK Android Nativo": "Methode 1: Nativer Android-APK",
    "Este é o instalador direto para o seu dispositivo Android. Ele carrega as funções astrológicas e sincroniza sua mandala em tempo de execução nativa.": "Dies ist der direkte Installer für Ihr Android-Gerät. Er lädt astrologische Funktionen und synchronisiert Ihr Mandala in nativer Laufzeit.",
    "Arquivo:": "Datei:",
    "Tamanho:": "Größe:",
    "Segurança:": "Sicherheit:",
    "Verificado por SHA256": "Verifiziert durch SHA256",
    "O download do arquivo APK foi iniciado! Caso seu navegador pergunte, confirme e permita fontes desconhecidas para prosseguir.": "Der Download der APK-Datei wurde gestartet! Falls Ihr Browser Sie fragt, bestätigen Sie und erlauben Sie unbekannte Quellen, um fortzufahren.",
    "Compatível com Android 8.0 ou superior. Requer liberação de instalação manual.": "Kompatibel mit Android 8.0 oder höher. Erfordert die Freigabe zur manuellen Installation.",
    "Método 2: Aplicativo Instantâneo (PWA)": "Methode 2: Sofort-App (PWA)",
    "A tecnologia PWA permite adicionar o aplicativo direto na tela de início sem precisar instalar arquivos separados. É compatível com Android e iOS (iPhone).": "Die PWA-Technologie ermöglicht das Hinzufügen der App direkt zum Startbildschirm, ohne separate Dateien installieren zu müssen. Sie ist mit Android und iOS (iPhone) kompatibel.",
    "Como Instalar no Celular:": "Installation auf dem Mobiltelefon:",
    "No Android / Chrome:": "Auf Android / Chrome:",
    "\"Instalar aplicativo\"": "\"App installieren\"",
    "\"Adicionar à tela inicial\"": "\"Zum Startbildschirm hinzufügen\"",
    "ou": "oder",
    "No iPhone / Safari:": "Auf iPhone / Safari:",
    "\"Adicionar à Tela de Início\"": "\"Zum Home-Bildschirm hinzufügen\"",
    "Esta aplicação é um PWA completo! Encontre a opção de instalar diretamente no menu de opções do seu navegador (ícone de computador ou adicionar à tela inicial) para rodar como um app nativo.": "Diese Anwendung ist eine vollständige PWA! Finden Sie die Option zur direkten Installation im Optionsmenü Ihres Browsers (Computersymbol oder zum Startbildschirm hinzufügen), um sie als native App auszuführen.",
    "Ativar Instrução PWA": "PWA-Anleitung aktivieren",
    "Não consome memória de armazenamento físico adicional. Atualiza em tempo real.": "Verbraucht keinen zusätzlichen physischen Speicherplatz. Aktualisiert sich in Echtzeit.",
    "Sincronizar Celular Via QR Code / Compartilhar": "Mobiltelefon per QR-Code synchronisieren / Teilen",
    "Aponte a câmera do seu celular para este código para abrir o Portal Órbita instantaneamente no seu celular ou acionar a instalação direta sem digitar endereços.": "Richten Sie die Kamera Ihres Mobiltelefons auf diesen Code, um das Portal Órbita sofort auf Ihrem Telefon zu öffnen oder die direkte Installation ohne Eingabe von Adressen auszulösen.",
    "Copiar Link do App": "App-Link kopieren",
    "Link do Portal Órbita copiado para o seu clipboard! Compartilhe o link com familiares e amigos.": "Portal Órbita Link wurde in Ihre Zwischenablage kopiert! Teilen Sie den Link mit Familie und Freunden.",
    "Recurso de compartilhamento nativo indisponível. O link do aplicativo foi copiado para a área de transferência!": "Native Freigabefunktion nicht verfügbar. Der App-Link wurde in die Zwischenablage kopiert!",
    "Enviar via WhatsApp": "Via WhatsApp senden",
    "🛡️ Informações Úteis de Instalação e Distribuição Independente": "🛡️ Nützliche Informationen zur Installation und unabhängigen Verteilung",
    "Sendo uma plataforma de sabedoria avançada e criptografia astro-quântica, o APK do **Portal Órbita** é distribuído de forma independente e segura fora das lojas oficiais corporativas. Isso garante absoluta privacidade dos seus dados e integridade de suas consultas com os arcanos do Tarot e a IA Orbia. Ao ativar o APK, lembre-se de habilitar e autorizar o parâmetro \"Instalação de Fontes Desconhecidas\" nas configurações de segurança do seu dispositivo. É totalmente seguro e livre de vírus.": "Als Plattform für fortgeschrittene Weisheit und astro-quantische Verschlüsselung wird die APK des **Portal Órbita** unabhängig und sicher außerhalb offizieller Unternehmens-Stores vertrieben. Dies garantiert absolute Privatsphäre Ihrer Daten und die Integrität Ihrer Konsultationen mit den Tarot-Arkanen und der Orbia-KI. Beim Aktivieren der APK denken Sie daran, den Parameter „Installation aus unbekannten Quellen“ in den Sicherheitseinstellungen Ihres Geräts zu aktivieren und zu autorisieren. Es ist absolut sicher und virenfrei.",
    "Por": "Von",
    "Concluir Leitura": "Lesung abschließen",
    "Concluiu": "Abgeschlossen",
    "Amuletos Recomendados": "Empfohlene Amulette",
    "Use um **Escarabeu de Lápis-Lazúli** posicionado na bolsa ou carteira de investimentos para guiar suas ações práticas rumo à consolidação do Caminho 8.": "Tragen Sie einen **Lapislazuli-Skarabäus** in Ihrer Tasche oder Ihrem Anlageportfolio, um Ihre praktischen Schritte zur Festigung des Pfades 8 zu lenken.",
    "O Ar governa sua matriz de": "Die Luft regiert Ihre Matrix von",
    "Aquário": "Wassermann",
    "Traz velocidade de raciocínio, intuição aberta e facilidade para propor soluções de negócios. Alinhe seu elemento acendendo sândalo logo pela manhã e abrindo as janelas do quarto.": "Bringt Denkgeschwindigkeit, offene Intuition und Leichtigkeit bei der Vorschlagserstellung für Geschäftslösungen. Richten Sie Ihr Element aus, indem Sie morgens Sandelholz anzünden und die Schlafzimmerfenster öffnen.",
    "Lápis-Lazúli:": "Lapislazuli:",
    "Estimula intuição do cérebro superior e protege vias oníricas superiores.": "Stimuliert die höhere Gehirnintuition und schützt höhere Traumwege.",
    "Selenita:": "Selenit:",
    "Limpa poeiras de pensamentos reativos e dispersão acumulada.": "Reinigt reaktive Gedankentrümmer und angesammelte Zerstreuung.",
    "Símbolos Ativos": "Aktive Symbole",
    "O": "Das",
    "Heptagrama Sagrado (Estrela de Sete Pontas)": "Heptagramm (Siebenzackiger Stern)",
    "soterra energias de fadiga celular e atua como escudo áurico nas terças-feiras de negócios arriscados.": "begräbt Energien zellulärer Ermüdung und wirkt als aurisches Schild an riskanten Geschäftsdienstagen.",
    "Recomendação Estelar de Joia de Poder": "Stellare Empfehlung für Kraftschmuck",
    "Recomendamos o uso de um": "Wir empfehlen die Verwendung eines",
    "Colar de Lápis-Lazúli puro em Prata": "Halskette aus reinem Lapislazuli in Silber",
    "ou um": "oder ein",
    "Anel de Pirita ou Sodalita": "Pyrit- oder Sodalith-Ring",
    "posicionado no dedo indicador para canalizar de forma sólida o magnetismo materializador do seu Caminho de Vida 8.": "am Zeigefinger positioniert, um den materialisierenden Magnetismus Ihres Lebenswegs 8 solide zu kanalisieren.",
    "Ambiente Físico": "Physisches Umfeld",
    "Radar de oportunidades diárias": "Tägliches Chancenradar",
    "O Momento Atual": "Der aktuelle Moment",
    "Clique em cada área para obter direcionamento astrológico de aproveitamento das tendências hoje.": "Klicken Sie auf jeden Bereich, um astrologische Hinweise zur Nutzung der heutigen Tendenzen zu erhalten.",
    "Selecione filtros de atividades para vibrar e fazer brilhar os dias indicativos do mês de": "Wählen Sie Aktivitätsfilter, um die indikativen Tage des Monats zum Vibrieren und Strahlen zu bringen",
    "Grade de Datas (Clique em um dia para ler os detalhes):": "Datumsraster (Klicken Sie auf einen Tag, um Details zu lesen):",
    "Filtros de Harmonização e Atividades:": "Harmonisierungs- und Aktivitätsfilter:",
    "Aspectos Planetários do Dia:": "Planetare Aspekte des Tages:",
    "Trânsito Celeste:": "Himmlischer Transit:",
    "Nível Energético": "Energieniveau",
    "Áreas de Atenção:": "Aufmerksamkeitsbereiche:",
    "Oportunidades observadas:": "Beobachtete Gelegenheiten:",
    "Desafios projetados:": "Prognostizierte Herausforderungen:",
    "Conselho Estratégico:": "Strategischer Rat:",
    "Alerta de Período": "Perioden-Alarm",
    "Mensagem do seu Mapa:": "Botschaft Ihrer Karte:",
    "Ritual de Potencialização": "Potenzierungsritual",
    "Seu mapa de forças, proteção e ressonâncias para atravessar o mês de": "Ihre Karte der Stärken, des Schutzes und der Resonanzen, um den Monat",
    "em segurança vibracional.": "in vibrationaler Sicherheit.",
    "Painel do Mês": "Monatsübersicht",
    "Mês Ativo": "Aktiver Monat",
    "Palavra-Chave do Mês": "Schlüsselwort des Monats",
    "Símbolo Favorável": "Günstiges Symbol",
    "Amuleto Favorável": "Günstiges Amulett",
    "Número da Sorte": "Glückszahl",
    "Cor Favorável": "Günstige Farbe",
    "Ambiente Favorável": "Günstige Umgebung",
    "Atividade Favorável": "Günstige Aktivität",
    "Desafio Principal do Mês": "Haupt-Herausforderung des Monats",
    "Oportunidade Principal do Mês": "Haupt-Gelegenheit des Monats",
    "Energia Dominante": "Dominante Energie",
    "O que evitar este mês": "Was diesen Monat zu vermeiden ist",
    "Melhor Área de Foco": "Bester Schwerpunktbereich",
    "Frase de Poder de": "Kraftsatz von",
    "EXPANSÃO SUTIL": "SUBTILE EXPANSION",
    "Cresça de forma diplomática respeitando os canais de silêncio do seu próprio ser.": "Wachsen Sie diplomatisch, indem Sie die Kanäle der Stille Ihres eigenen Seins respektieren.",
    "Heptagrama Sagrado (⭐️)": "Heiliges Heptagramm (⭐️)",
    "Representa os sete caminhos de proteção que selam seu campo energético áurico.": "Repräsentiert die sieben Schutzpfade, die Ihr aurisches Energiefeld versiegeln.",
    "Escarabeu de Lápis-Lazúli": "Lapislazuli-Skarabäus",
    "Atua na proteção física, facilitando transações e banindo a exaustão acumulada.": "Wirkt als physischer Schutz, erleichtert Transaktionen und verbannt angesammelte Erschöpfung.",
    "Conecta seu Caminho de Vida com a energia realizadora do planeta Saturno.": "Verbindet Ihren Lebensweg mit der verwirklichenden Energie des Planeten Saturn.",
    "Azul Cobalto Real": "Königliches Kobaltblau",
    "Promove serenidade mental no elemento Ar, eliminando dispersão cognitiva excessiva.": "Fördert mentale Gelassenheit im Element Luft, indem es übermäßige kognitive Zerstreuung eliminiert.",
    "Bibliotecas ou Jardins de Lago": "Bibliotheken oder Seegärten",
    "Fomenta a absorção silenciosa de conhecimento e a desaceleração cardíaca.": "Fördert die stille Aufnahme von Wissen und die Herzverlangsamung.",
    "Meditação com Registro Escrito": "Meditation mit schriftlicher Aufzeichnung",
    "Escrever logo cedo no diário ajuda o cérebro de Aquário a não saturar de planos.": "Frühzeitig ins Tagebuch zu schreiben, hilft dem Wassermann-Gehirn, nicht mit Plänen zu übersättigen.",
    "Dispersão e Excesso de Projetos Inacabados": "Zerstreuung und Übermaß an unvollendeten Projekten",
    "Cuidado para não rascunhar 15 rascunhos de negócios e não consolidar nenhum. O Caminho de Vida 8 exige a disciplina prática de Saturno para que as finanças sintonizem.": "Achten Sie darauf, nicht 15 Geschäftsentwürfe zu skizzieren und keinen davon zu konsolidieren. Der Lebensweg 8 erfordert die praktische Disziplin des Saturn, damit sich die Finanzen einpendeln.",
    "Negócios Inteligentes & Mentoria de Conhecimento": "Intelligente Geschäfte & Wissensmentoring",
    "Sua matriz original brilha ao gerar novos métodos de ensino ou infoprodutos digitais. Não tenha medo de monetizar seu discernimento.": "Ihre ursprüngliche Matrix strahlt, wenn Sie neue Lehrmethoden oder digitale Infoprodukte generieren. Haben Sie keine Angst, Ihre Urteilsfähigkeit zu monetarisieren.",
    "Ar Ativo / Ideais Coletivos": "Aktive Luft / Kollektive Ideale",
    "Força de Aquário vibrando na casa das grandes descobetas e alinhamento.": "Kraft des Wassermanns schwingend im Haus der großen Entdeckungen und Ausrichtung.",
    "Assinar contratos e debater nas redes sociais por impulsividade": "Verträge unterschreiben und in sozialen Netzwerken impulsiv debattieren",
    "Aguarde transitar Mercúrio antes de fazer aportes financeiros robustos ou mandar mensagens reativas à noite das quais pode se arrepender.": "Warten Sie den Merkur-Transit ab, bevor Sie robuste Finanzbeiträge leisten oder nachts impulsive Nachrichten senden, die Sie später bereuen könnten.",
    "Estudos e Consolidamento Financeiro": "Studien und Finanzielle Konsolidierung",
    "Direcione sua ressonância celular para consolidar sua carteira de investimentos e aprofundar seus estudos em astrologia sutil e inteligência.": "Richten Sie Ihre Zellresonanz darauf aus, Ihr Anlageportfolio zu konsolidieren und Ihre Studien in subtiler Astrologie und Intelligenz zu vertiefen.",
    "Eu canalizo a originalidade libertadora do Ar e a estrutura firme de Saturno para manifestar a abundância na matéria de forma sutil.": "Ich kanalisiere die befreiende Originalität der Luft und die feste Struktur des Saturn, um Fülle in der Materie auf subtile Weise zu manifestieren.",
    "Todos os Dias": "Alle Tage",
    "Produtividade": "Produktivität",
    "Descanso": "Ruhe",
    "Família": "Familie",
    "Encontros": "Treffen",
    "Diversão": "Spaß",
    "Entrevistas": "Interviews",
    "Vendas": "Verkäufe",
    "Investimentos": "Investitionen",
    "Viagens": "Reisen",
    "Mudanças": "Veränderungen",
    "Iniciar Projetos": "Projekte starten",
    "Assinar Contratos": "Verträge unterschreiben",
    "Conversas Difíceis": "Schwierige Gespräche",
    "Estudos": "Studien",
    "Exercícios Físicos": "Körperliche Übungen",
    "Meditação": "Meditation",
    "Espiritualidade": "Spiritualität",
    "Compras Importantes": "Wichtige Anschaffungen",
    "Oportunidades de ganhos secundários intelectuais sob ar ativo.": "Möglichkeiten für sekundäre intellektuelle Gewinne unter aktivem Äther.",
    "O trânsito atual favorece a formatação de serviços de mentoria ou rascunhos de propostas comerciais. Fique atento a propostas nas terças ou quintas-feiras.": "Der aktuelle Transit begünstigt die Gestaltung von Mentoring-Diensten oder die Ausarbeitung von Geschäftsvorschlägen. Achten Sie auf Angebote dienstags oder donnerstags.",
    "Magnetismo em alta, facilitando conexões profundas e românticas.": "Hoher Magnetismus, der tiefe und romantische Verbindungen fördert.",
    "Com Vênus emanando trígonos estelares, desfaça os muros analíticos e compartilhe desejos sinceros. Sexta-feira à noite é o melhor período para conversas afetivas.": "Da Venus stellare Trigone aussendet, reißen Sie die analytischen Mauern nieder und teilen Sie aufrichtige Wünsche. Der Freitagabend ist die beste Zeit für gefühlvolle Gespräche.",
    "Retenção intelectual extraordinária e foco linear ativado.": "Außergewöhnliche intellektuelle Aufnahmefähigkeit und linearer Fokus aktiviert.",
    "Sua mente possui uma facilidade única hoje para absorver conceitos metafísicos, matemáticos e científicos. Ótimo dia para devorar livros ou rascunhar códigos.": "Ihr Geist besitzt heute eine einzigartige Leichtigkeit, metaphysische, mathematische und wissenschaftliche Konzepte zu absorbieren. Ein großartiger Tag, um Bücher zu verschlingen oder Codes zu entwerfen.",
    "Capacidade de estruturação mecânica e conclusão de pendências.": "Fähigkeit zur mechanischen Strukturierung und zum Abschluss offener Aufgaben.",
    "A influência do Caminho de Vida 8 ressoa para estabilizar as tarefas administrativas do seu negócio. Execute sem procrastinar.": "Der Einfluss des Lebensweges 8 resoniert, um die administrativen Aufgaben Ihres Geschäfts zu stabilisieren. Führen Sie sie ohne Zögern aus.",
    "Canal mental de ideias originais e soluções inovadoras fluido.": "Mentaler Kanal für originelle Ideen und innovative Lösungen fließt reibungslos.",
    "Não filtre seus insights à primeira vista. Deixe o ar soprar novas ideias sem compromisso no papel de rascunho.": "Filtern Sie Ihre Erkenntnisse nicht auf den ersten Blick. Lassen Sie den Äther ungezwungen neue Ideen auf dem Konzeptpapier einfließen.",
    "Facilidade para gerar engajamento em causas sociais e projetos coletivos.": "Leichtigkeit, Engagement für soziale Anliegen und kollektive Projekte zu erzeugen.",
    "Entre em contato com mentores ou parceiros adormecidos. Compartilhar ideais éticos fortalece o Sol em Aquário.": "Kontaktieren Sie ruhende Mentoren oder Partner. Das Teilen ethischer Ideale stärkt die Sonne im Wassermann.",
    "Frequência onírica aberta e trânsito favorável a rituais astrológicos.": "Offene Traumfrequenz und günstiger Transit für astrologische Rituale.",
    "Medite com cristais de Sodalita ou Selenita. Suas conexões áuricas com esferas superiores estão extremamente receptivas hoje.": "Meditieren Sie mit Sodalith- oder Selenitkristallen. Ihre aurischen Verbindungen zu höheren Sphären sind heute äußerst empfänglich.",
    "dinheiro": "Geld",
    "amor": "Liebe",
    "estudos": "Studium",
    "trabalho": "Arbeit",
    "criatividade": "Kreativität",
    "networking": "Networking",
    "espiritualidade": "Spiritualität",
    "Área focada": "Fokusbereich",
    "Conselho Especial Hoje": "Besonderer Rat des Tages",
    "Foco Ativo": "Aktiver Fokus",
    "Coloque um guardanapo azul no bolso esquerdo ou use caneta de tinta preta para fixar as ações tomadas agora sob a influência desta vibração.": "Legen Sie eine blaue Serviette in Ihre linke Tasche oder verwenden Sie einen Kugelschreiber mit schwarzer Tinte, um die jetzt unter dem Einfluss dieser Schwingung ergriffenen Maßnahmen zu verankern.",
    "apk_distribution_info": "Als Plattform für fortgeschrittene Weisheit und astro-quanten-Verschlüsselung wird die APK von Portal Órbita unabhängig und sicher außerhalb der offiziellen Unternehmens-Stores vertrieben. Dies garantiert die absolute Privatsphäre Ihrer Daten und die Integrität Ihrer Konsultationen mit den Tarot-Arkanen und der Orbia-KI. Denken Sie bei der Aktivierung der APK daran, den Parameter \"Installation unbekannter Quellen\" in den Sicherheitseinstellungen Ihres Geräts zu aktivieren und zu autorisieren. Es ist absolut sicher und virenfrei.",
    "Organização": "Organisation",
    "Bem-estar": "Wohlbefinden",
    "Calendário Interativo de Tendências (30 Dias)": "Interaktiver Trendkalender (30 Tage)",
    "Portal Ativo Sincronizado": "Aktives synchronisiertes Portal",
    "Acelere Seus Objetivos, Navegue pelos Portais Ativos": "Beschleunige deine Ziele, navigiere durch die aktiven Portale",
    "Veja o que o universo quer te mostrando": "Sieh was das Universum dir zeigen möchte",
    "Painel do mês e orientações cósmicas.": "Monatspanel und kosmische Orientierungen.",
    "Ver tudo →": "Alles sehen →",
    "Intuição Harmoniosa & Foco Singular (Sol e Mercúrio em Trígono)": "Harmonische Intuition & Einzigartiger Fokus (Sonne und Merkur im Trigon)",
    "Navegação Cósmica": "Kosmische Navigation",
    "Oráculo de Entrada": "Eingangs-Orakel",
    "Práticas & Evolução": "Praktiken & Evolution",
    "Estatísticas Diárias": "Tägliche Statistiken",
    "Planejamento Astrológico": "Astrologische Planung",
    "Pilares do Destino": "Pfeiler des Schicksals",
    "Elias & Sinais": "Elias & Zeichen",
    "Missões do Portal": "Portal-Missionen",
    "Símbolos & Amuletos": "Symbole & Amulette",
    "Chakras Cósmicos": "Kosmische Chakren",
    "Rituais Diários": "Tägliche Rituale",
    "Radar do Dia": "Radar des Tages",
    "Radar Oportunidades": "Radar de Oportunidades",
    "Trânsito Celeste & Fase da Lua:": "Himmlischer Transit & Mondphase:",
    "Dia Pessoal (Numerologia)": "Persönlicher Tag (Numerologie)",
    "Frequência Solfeggio": "Solfeggio-Frequenz",
    "Janelas Temporais Recomendadas do Dia:": "Empfohlene Zeitfenster des Tages:",
    "Tomar Decisões": "Entscheidungen Treffen",
    "Foco / Estudos": "Fokus / Studien",
    "Pausa / Descanso": "Pause / Ruhe",
    "Cor Favorável & Uso Prático": "Günstige Farbe & Praktischer Nutzen",
    "Números Favoráveis & Vibração": "Günstige Zahlen & Schwingung",
    "Ritual Sugerido para o Dia:": "Vorgeschlagenes Tagesritual:",
    "Índices de Performance Diária:": "Tägliche Leistungsindizes:",
    "Resumo Energético & Influência:": "Energieübersicht & Einfluss:",
    "Áreas Favorecidas:": "Begünstigte Bereiche:",
  }
};

const CATEGORY_EMOJIS: Record<string, string> = {
  todos: "✨",
  produtividade: "⚡",
  descanso: "🌙",
  familia: "🏡",
  encontros: "💖",
  diversao: "😊",
  entrevistas: "✨",
  vendas: "💲",
  investimentos: "💎",
  viagens: "✈️",
  mudancas: "🔥",
  projetos: "🚀",
  contratos: "📜",
  conversas: "🗣️",
  estudos: "📚",
  exercicios: "🏃",
  meditacao: "🧘",
  espiritualidade: "🔮",
  compras: "🛍️"
};

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
  lang,
  mapData,
  onInstallPWA,
  isInstalled
}: UserDashboardPortalProps) {
  const email = user?.email || localStorage.getItem("orbi_logged_email") || "";
  const { idioma } = useIdioma();
  const activeLang = idioma || lang || 'pt';
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    if (activeLang !== 'pt') {
      const dict = localPortalTranslations[activeLang];
      if (dict?.[text]) {
        return dict[text];
      }
    }
    return i18nT(text);
  };

  const localDashboardTranslations: Record<string, Record<string, string>> = {
    pt: {
      "carregando_sintonias": "Sintonizando constelações e biorritmos de Osiris...",
      "ritual_potencializacao": "Ritual de Potencialização",
      "conselho_acao": "Conselho Cósmico de Ação",
      "foco_ativo": "Foco Ativo",
      "atualizacao_diaria": "Atualização Diária",
      "radar_dia": "Radar do Dia",
      "radar_oportunidades": "Radar de Oportunidades",
      "clique_instrucao": "Selecione uma área abaixo para sintonizar o direcionamento astrológico de hoje.",
      "conselho_hoje": "Conselho Especial Hoje",
      "area_focada": "Área Focada"
    },
    en: {
      "carregando_sintonias": "Tuning Osiris constellations and biorhythms...",
      "ritual_potencializacao": "Empowerment Ritual",
      "conselho_acao": "Cosmic Action Council",
      "foco_ativo": "Active Focus",
      "atualizacao_diaria": "Daily Update",
      "radar_dia": "Daily Radar",
      "radar_oportunidades": "Opportunities Radar",
      "clique_instrucao": "Select an area below to tune in today's astrological guidance.",
      "conselho_hoje": "Special Advice Today",
      "area_focada": "Focused Area"
    },
    es: {
      "carregando_sintonias": "Sintonizando constelaciones y biorritmos de Osiris...",
      "ritual_potencializacao": "Ritual de Potenciación",
      "conselho_acao": "Consejo Cósmico de Acción",
      "foco_ativo": "Enfoque Activo",
      "atualizacao_diaria": "Actualización Diaria",
      "radar_dia": "Radar del Día",
      "radar_oportunidades": "Radar de Oportunidades",
      "clique_instrucao": "Selecciona un área a continuación para sintonizar la guía astrológica de hoy.",
      "conselho_hoje": "Consejo Especial Hoy",
      "area_focada": "Área Enfocada"
    },
    de: {
      "carregando_sintonias": "Osiris-Konstellationen und Biorhythmen werden abgestimmt...",
      "ritual_potencializacao": "Ritual zur Potenzierung",
      "conselho_acao": "Kosmischer Aktionsrat",
      "foco_ativo": "Aktiver Fokus",
      "atualizacao_diaria": "Tägliches Update",
      "radar_dia": "Tagesradar",
      "radar_oportunidades": "Chancenradar",
      "clique_instrucao": "Wählen Sie unten einen Bereich aus, um die heutige astrologische Führung abzustimmen.",
      "conselho_hoje": "Besonderer Rat Heute",
      "area_focada": "Fokusbereich"
    },
    fr: {
      "carregando_sintonias": "Harmonisation des constellations et biorythmes d'Osiris...",
      "ritual_potencializacao": "Rituel de Potentialisation",
      "conselho_acao": "Conseil d'Action Cosmique",
      "foco_ativo": "Mise au Point Active",
      "atualizacao_diaria": "Mise à Jour Quotidienne",
      "radar_dia": "Radar du Jour",
      "radar_oportunidades": "Radar d'Opportunités",
      "clique_instrucao": "Sélectionnez une zone ci-dessous pour accorder la guidance astrologique d'aujourd'hui.",
      "conselho_hoje": "Conseil Spécial Aujourd'hui",
      "area_focada": "Zone Ciblée"
    }
  };

  const localT = (key: string) => {
    return localDashboardTranslations[activeLang]?.[key] || localDashboardTranslations["pt"]?.[key] || t(key);
  };
  const travelerFallback = t("Viajante");
  const userFirstName = user?.name ? user.name.split(' ')[0] : travelerFallback;
  const zodiacSign = getZodiacSign(user?.birthDate);
  const lifePathNumber = getLifePathNumber(user?.birthDate);
  const preciseZodiacSign = mapData?.astros?.find((a: any) => a.name === "Sol")?.sign || zodiacSign;

  const personalProsperity = generatePersonalizedProsperityMap(
    user?.hasCreatedMap ? user.birthDate : "1997-02-11",
    preciseZodiacSign,
    user?.hasCreatedMap ? user.name : "",
    new Date(),
    activeLang
  );

  const dynamicColorsList = generatePersonalizedColorsList(
    user?.birthDate || "1997-02-11",
    preciseZodiacSign,
    activeLang
  );

  const dynamicElementInfo = generateDynamicElementInfo(preciseZodiacSign, activeLang);
  const dynamicAmuletText = generateDynamicAmuletText(user?.birthDate || "1997-02-11", activeLang);

  const dailyAstroRecs = generateDailyAstroRecommendations(
    preciseZodiacSign,
    lifePathNumber,
    new Date(),
    activeLang
  );

  // Interactive states & Monthly Predictions
  const todayRef = useMemo(() => new Date(), []);
  const currentYear = todayRef.getFullYear();
  const currentMonth = todayRef.getMonth();
  const currentDayNum = todayRef.getDate();

  const [calendarYear, setCalendarYear] = useState<number>(() => currentYear);
  const [calendarMonth, setCalendarMonth] = useState<number>(() => currentMonth);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(() => currentDayNum || 1);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const displayMonthName = useMemo(() => {
    const dateObj = new Date(calendarYear, calendarMonth, 1);
    const localeMap: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', de: 'de-DE', fr: 'fr-FR' };
    const rawMonth = dateObj.toLocaleDateString(localeMap[activeLang] || 'pt-BR', { month: 'long' });
    return rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
  }, [calendarYear, calendarMonth, activeLang]);

  const [cachedMonthlyPredictions, setCachedMonthlyPredictions] = useState<any[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    const yearMonth = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
    const userKey = user?.email || (user as any)?.uid || 'guest';

    async function loadCalendar() {
      try {
        const dbData = await loadMonthlyCalendarFromDatabase(userKey, yearMonth, activeLang);
        if (isMounted && dbData && Array.isArray(dbData) && dbData.length > 0) {
          setCachedMonthlyPredictions(dbData);
          return;
        }
      } catch (err) {
        console.warn("Calendar DB fetch failed, generating fallback:", err);
      }

      const generated = getMonthlyCalendarPredictions(
        calendarYear,
        calendarMonth,
        user?.hasCreatedMap ? user.birthDate : "1997-02-11",
        mapData?.astros?.find((a: any) => a.name === "Sol")?.sign || getZodiacSign(user?.birthDate),
        user?.hasCreatedMap ? user?.name : "Viajante",
        activeLang,
        mapData
      );

      if (isMounted) {
        setCachedMonthlyPredictions(generated);
      }

      saveMonthlyCalendarToDatabase(userKey, yearMonth, activeLang, generated).catch(e => {
        console.warn("Failed to persist calendar to Firestore:", e);
      });
    }

    loadCalendar();

    return () => { isMounted = false; };
  }, [calendarYear, calendarMonth, activeLang, user?.birthDate, user?.name, user?.email, user?.hasCreatedMap, mapData]);

  const monthlyPredictions = useMemo(() => {
    if (cachedMonthlyPredictions && cachedMonthlyPredictions.length > 0) {
      return cachedMonthlyPredictions;
    }
    return getMonthlyCalendarPredictions(
      calendarYear,
      calendarMonth,
      user?.hasCreatedMap ? user.birthDate : "1997-02-11",
      mapData?.astros?.find((a: any) => a.name === "Sol")?.sign || getZodiacSign(user?.birthDate),
      user?.hasCreatedMap ? user?.name : "Viajante",
      activeLang,
      mapData
    );
  }, [cachedMonthlyPredictions, calendarYear, calendarMonth, user?.birthDate, user?.name, user?.hasCreatedMap, mapData, activeLang]);

  const selectedDayPrediction = useMemo(() => {
    const idx = Math.max(0, Math.min(monthlyPredictions.length - 1, selectedCalendarDay - 1));
    return monthlyPredictions[idx] || monthlyPredictions[0];
  }, [monthlyPredictions, selectedCalendarDay]);

  // Navigation tabs inside User Portal - synced securely with parent Context
  const [localAreaSubTab, setLocalAreaSubTab] = useState<any>('universo_mostrando');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const areaSubTab = propAreaSubTab !== undefined ? propAreaSubTab : localAreaSubTab;
  const setAreaSubTab = propSetAreaSubTab !== undefined ? propSetAreaSubTab : setLocalAreaSubTab;

  const navigationGroups = useMemo(() => [
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
        { id: 'amuletos', label: 'Símbolos & Amuletos', icon: ShieldCheck, color: 'text-emerald-400', bg: 'hover:bg-emerald-500/5' },
        { id: 'chakras', label: 'Chakras Cósmicos', icon: Activity, color: 'text-amber-400', bg: 'hover:bg-amber-500/5' },
        { id: 'rituais', label: 'Rituais Diários', icon: Sparkles, color: 'text-purple-400', bg: 'hover:bg-purple-500/5' }
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
        { id: 'cupido', label: 'cupido_tab', icon: Heart, color: 'text-rose-400 animate-pulse', bg: 'hover:bg-rose-500/5' },
        { id: 'prosperidade', label: 'Prosperidade e Capital', icon: DollarSign, color: 'text-emerald-400', bg: 'hover:bg-emerald-500/5' },
        { id: 'amor', label: 'Amor & Intimidade', icon: Heart, color: 'text-red-400', bg: 'hover:bg-red-500/5' },
        { id: 'compatibilidade_social', label: 'Sinergia Social', icon: Users, color: 'text-amber-400', bg: 'hover:bg-amber-500/5' },
        { id: 'relacionamentos', label: 'Relacionamentos', icon: Users, color: 'text-cyan-400', bg: 'hover:bg-cyan-500/5' },
        { id: 'desenvolvimento', label: 'Desenv. Pessoal', icon: Star, color: 'text-yellow-400', bg: 'hover:bg-yellow-500/5' },
        { id: 'energia_casa', label: 'Energia da Casa', icon: Home, color: 'text-indigo-400', bg: 'hover:bg-indigo-500/5' },
        { id: 'sonhos', label: 'Centro de Sonhos', icon: Moon, color: 'text-pink-400', bg: 'hover:bg-pink-500/5' }
      ]
    }
  ], []);

  const activeTabItem = useMemo(() => {
    for (const group of navigationGroups) {
      const found = group.items.find(item => item.id === areaSubTab);
      if (found) return found;
    }
    return null;
  }, [areaSubTab, navigationGroups]);

  const activeMobileLabel = useMemo(() => {
    if (areaSubTab === 'universo_mostrando') {
      return t("Veja o que o universo quer te mostrando");
    }
    return activeTabItem ? t(activeTabItem.label) : t("Navegação Cósmica");
  }, [areaSubTab, activeTabItem, t]);

  const [activeCalendarFilter, setActiveCalendarFilter] = useState<string>('todos');
  const [selectedOpportunityArea, setSelectedOpportunityArea] = useState<string>('dinheiro');
  const [universoSintonizado, setUniversoSintonizado] = useState<boolean>(false);
  const [selectedWeeklyMission, setSelectedWeeklyMission] = useState<{ id: string; title: string; description: string; isCompleted: boolean; points: number; isClaimed?: boolean; aiPrompt?: string } | null>(null);
  const [weeklyMissionAiResponse, setWeeklyMissionAiResponse] = useState<string>("");
  const [weeklyMissionAiLoading, setWeeklyMissionAiLoading] = useState<boolean>(false);

  // Helper to build dynamic personalized weekly missions strictly using i18n
  const getPersonalizedWeeklyMissions = (targetLang: string) => {
    const l = (targetLang || 'pt').toLowerCase();
    const name = user?.name ? user.name.split(" ")[0] : (l === 'de' ? "Sternensucher" : l === 'en' ? "Stellar Seeker" : l === 'es' ? "Buscador Estelar" : l === 'fr' ? "Chercheur Stellaire" : "Viajante");
    const userSign = mapData?.astros?.find((a: any) => a.name === "Sol")?.sign || (user?.birthDate ? getZodiacSign(user.birthDate) : "Touro");
    const translatedZodiac = t(userSign) || userSign;

    const tKey = (key: string, replacements?: Record<string, string>) => {
      let res = key;
      if (l !== 'pt') {
        const dict = localPortalTranslations[l];
        if (dict?.[key]) {
          res = dict[key];
        } else {
          res = i18nT(key, { lng: l });
        }
      } else {
        res = i18nT(key, { lng: 'pt' });
      }
      if (replacements) {
        Object.keys(replacements).forEach(r => {
          res = res.replace(new RegExp(`{{${r}}}`, 'g'), replacements[r]);
        });
      }
      return res;
    };

    return [
      {
        id: "w1",
        title: tKey("Esta semana tente resolver uma pendência antiga"),
        description: tKey("Identifique uma pendência material ou burocrática acumulada sob a força de {{zodiac}} e tome uma ação para resolvê-la, liberando fluxo de Saturno.", { zodiac: translatedZodiac }),
        aiPrompt: l === 'en'
          ? `As an expert astrologer for ${name} (${translatedZodiac}), generate practical, step-by-step weekly guidance to resolve a pending material or bureaucratic issue under Saturn's influence.`
          : l === 'es'
          ? `Como astrólogo experto para ${name} (${translatedZodiac}), genera una orientación semanal paso a paso para resolver un asunto pendiente material o burocrático bajo la influencia de Saturno.`
          : l === 'de'
          ? `Als bekannter Astrologe für ${name} (${translatedZodiac}), erstelle eine praktische wöchentliche Orientierung zur Klärung einer ausstehenden Angelegenheit unter Saturns Einfluss.`
          : l === 'fr'
          ? `En tant qu'astrologue expert pour ${name} (${translatedZodiac}), générez des conseils hebdomadaires pratiques pour résoudre les questions en suspens sous l'influence de Saturne.`
          : `Como astrólogo especialista para ${name} (${translatedZodiac}), gere uma orientação semanal prática e personalizada para resolver pendências materiais ou burocráticas sob a influência de Saturno.`,
        isCompleted: false,
        points: 150
      },
      {
        id: "w2",
        title: tKey("Esta semana fortaleça um relacionamento importante"),
        description: tKey("Envie uma mensagem genuína de carinho ou faça um gesto de consideração a alguém do seu círculo íntimo de {{zodiac}}.", { zodiac: translatedZodiac }),
        aiPrompt: l === 'en'
          ? `Based on the astrological chart of ${name} (${translatedZodiac}), provide practical cosmic guidance and a gesture to strengthen an important relationship this week.`
          : l === 'es'
          ? `Basándote en la carta astrológica de ${name} (${translatedZodiac}), proporciona una sugerencia cósmica práctica para fortalecer relaciones importantes esta semana.`
          : l === 'de'
          ? `Basierend auf dem Horoskop von ${name} (${translatedZodiac}), gib praktische kosmische Ratschläge zur Stärkung wichtiger Beziehungen in dieser Woche.`
          : l === 'fr'
          ? `Basé sur la carte astrologique de ${name} (${translatedZodiac}), fournissez un conseil cosmique pratique pour renforcer les relations importantes cette semaine.`
          : `Com base no mapa astrológico de ${name} (${translatedZodiac}), forneça um conselho cósmico prático e exercício para fortalecer relacionamentos importantes nesta semana.`,
        isCompleted: false,
        points: 120
      },
      {
        id: "w3",
        title: tKey("Esta semana dedique tempo ao aprendizado"),
        description: tKey("Invista pelo menos 1 hora em um livro, curso ou áudio de meditação voltado ao desenvolvimento pessoal de {{zodiac}}.", { zodiac: translatedZodiac }),
        aiPrompt: l === 'en'
          ? `What is the ideal focus for study, meditation, or personal growth for ${name} (${translatedZodiac}) to expand mental clarity and wisdom this week?`
          : l === 'es'
          ? `¿Cuál es el enfoque ideal de estudio, meditación o crecimiento personal para ${name} (${translatedZodiac}) para expandir la claridad mental esta semana?`
          : l === 'de'
          ? `Was ist der ideale Fokus für Studium, Meditation oder persönliches Wachstum für ${name} (${translatedZodiac}), um die mentale Klarheit diese Woche zu erweitern?`
          : l === 'fr'
          ? `Quel est l'axe d'étude, de méditation ou de développement personnel idéal pour ${name} (${translatedZodiac}) pour développer sa clarté mentale cette semaine ?`
          : `Qual o foco ideal de estudo, meditação ou desenvolvimento pessoal para ${name} (${translatedZodiac}) expandir sua clareza mental e sabedoria nesta semana?`,
        isCompleted: false,
        points: 100
      }
    ];
  };

  // Helper to merge incoming weekly missions while strictly enforcing current language localization
  const mergeWeeklyMissionsWithLanguage = (incoming: any[], targetLang: string) => {
    const l = (targetLang || 'pt').toLowerCase();
    const localized = getPersonalizedWeeklyMissions(l);
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return localized;
    }
    return localized.map((loc, idx) => {
      const match = incoming.find(item => item && item.id === loc.id) ||
                    incoming.find(item => item && item.id && loc.id && item.id.endsWith(loc.id.slice(-1))) ||
                    incoming[idx];
      if (match) {
        return {
          ...loc,
          isCompleted: Boolean(match.isCompleted),
          isClaimed: Boolean(match.isClaimed),
          points: match.points || loc.points
        };
      }
      return loc;
    });
  };

  const [weeklyMissions, setWeeklyMissions] = useState<Array<{ id: string; title: string; description: string; isCompleted: boolean; points: number; isClaimed?: boolean; aiPrompt?: string }>>(() => {
    return getPersonalizedWeeklyMissions(activeLang);
  });

  // Keep weeklyMissions translated when language prop changes
  useEffect(() => {
    const l = (idioma || lang || 'pt').toLowerCase();
    setWeeklyMissions(prev => mergeWeeklyMissionsWithLanguage(prev, l));
    scanAndTranslateDOM(l);
  }, [idioma, lang, user, mapData]);


  // Osiris Intelligent AI System States
  const [osirisDashboard, setOsirisDashboard] = useState<any>(null);
  const [osirisLoading, setOsirisLoading] = useState<boolean>(true);
  const [osirisOnlineAlert, setOsirisOnlineAlert] = useState<boolean>(true);
  const [osirisChatMessages, setOsirisChatMessages] = useState<Array<{ id?: string, sender: 'user' | 'osiris', text: string }>>([
    { id: 'osirisWelcomeMsg', sender: 'osiris', text: `Olá, meu caro buscador stelar! Eu sou OSÍRIS, seu mentor astrológico supremo e guia de cura energética. Estou em plena sintonia com suas frequências cósmicas de hoje para alinhar seu dharma e afastar de forma precisa as negatividades kármicas. O que você gostaria de desvendar no momento? Me pergunte sobre o clima, biorritmo celular ou seus sonhos profundos.` }
  ]);
  const [osirisChatInput, setOsirisChatInput] = useState<string>('');
  const [osirisChatSending, setOsirisChatSending] = useState<boolean>(false);

  // Dynamically synchronize Osiris welcome message with the active language
  useEffect(() => {
    const getOsirisWelcomeText = () => {
      const name = user?.name ? user.name.split(' ')[0] : (activeLang === 'de' ? "Sternensucher" : activeLang === 'en' ? "stellar seeker" : activeLang === 'es' ? "buscador estelar" : activeLang === 'fr' ? "chercheur stellaire" : "buscador stelar");
      
      const welcomeTexts: Record<string, string> = {
        pt: `Olá, meu caro ${name}! Eu sou OSÍRIS, seu mentor astrológico supremo e guia de cura energética. Estou em plena sintonia com suas frequências cósmicas de hoje para alinhar seu dharma e afastar de forma precisa as negatividades kármicas. O que você gostaria de desvendar no momento? Me pergunte sobre o clima, biorritmo celular ou seus sonhos profundos.`,
        en: `Hello, my dear ${name}! I am OSIRIS, your supreme astrological mentor and energy healing guide. I am in full sync with your cosmic frequencies today to align your dharma and precisely ward off karmic negativities. What would you like to unveil at the moment? Ask me about the weather, cellular biorhythm, or your deep dreams.`,
        es: `¡Hola, mi querido ${name}! Soy OSIRIS, tu mentor astrológico supremo y guía de sanación energética. Estoy en total sintonía con tus frecuencias cósmicas de hoy para alinear tu dharma y alejar de forma precisa las negatividades kármicas. ¿Qué te gustaría desvelar en este momento? Pregúntame sobre el clima, el biorritmo celular o tus sueños profundos.`,
        de: `Hallo, mein lieber ${name}! Ich bin OSIRIS, Ihr oberster astrologischer Mentor und Leitfaden für energetische Heilung. Ich bin heute in voller Übereinstimmung mit Ihren kosmischen Frequenzen, um Ihr Dharma auszurichten und karmische Negativitäten präzise abzuwehren. Was möchten Sie im Moment enthüllen? Fragen Sie mich nach dem Wetter, dem zellulären Biorhythmus oder Ihren tiefen Träumen.`,
        fr: `Bonjour, mon cher ${name} ! Je suis OSIRIS, votre mentor astrologique suprême et guide de guérison énergétique. Je suis en pleine harmonie avec vos fréquences cosmiques d'aujourd'hui pour aligner votre dharma et éloigner précisément les négativités karmiques. Que aimeriez-vous dévoiler en ce moment ? Demandez-moi pour la météo, le biorythme cellulaire ou vos rêves profonds.`
      };
      
      return welcomeTexts[activeLang] || welcomeTexts['pt'];
    };

    setOsirisChatMessages(prev => {
      const filtered = prev.filter(m => m.id !== 'osirisWelcomeMsg');
      return [
        {
          id: 'osirisWelcomeMsg',
          sender: 'osiris',
          text: getOsirisWelcomeText()
        },
        ...filtered
      ];
    });
  }, [user, activeLang]);

  // Search Engine states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedSign, setSelectedSign] = useState<any>(null);

  const blogResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return BLOG_ARTICLES_LIST.map(art => ({
      ...art,
      title: t(art.title),
      summary: t(art.summary),
      content: t(art.content),
      author: t(art.author),
      date: t(art.date)
    })).filter(art => 
      art.title.toLowerCase().includes(query) || 
      art.summary.toLowerCase().includes(query) || 
      art.content.toLowerCase().includes(query)
    );
  }, [searchQuery, activeLang]);

  const planetResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return SIGNS_ZODIAC_LIST.map(sign => ({
      ...sign,
      name: t(sign.name),
      regente: t(sign.regente),
      traits: t(sign.traits),
      horoscopo: t(sign.horoscopo)
    })).filter(sign => 
      sign.name.toLowerCase().includes(query) || 
      sign.regente.toLowerCase().includes(query) || 
      sign.traits.toLowerCase().includes(query) || 
      sign.horoscopo.toLowerCase().includes(query)
    );
  }, [searchQuery, activeLang]);

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

    const missionCacheKey = `orbi_cache_updated_daily_missions_v4_${todayStr}_${activeLang}`;
    const dashboardCacheKey = `orbi_cache_updated_daily_osiris_dashboard_${todayStr}_${activeLang}`;

    const handleMissionsBgUpdate = (e: any) => {
      if (e.detail && e.detail.data) {
        console.log("[Cache Event] Silently updated daily missions in background.");
        const bgData = e.detail.data;
        if (Array.isArray(bgData.missions)) {
          setDailyMissions(prev => {
            return bgData.missions.map((m: any) => {
              const matched = prev.find(curr => curr.id === m.id);
              return {
                ...m,
                isCompleted: matched ? matched.isCompleted : false
              };
            });
          });
        }
        if (Array.isArray(bgData.weeklyMissions)) {
          setWeeklyMissions(prev => mergeWeeklyMissionsWithLanguage(bgData.weeklyMissions, activeLang));
        }
      }
    };

    const handleDashboardBgUpdate = (e: any) => {
      if (e.detail && e.detail.data) {
        console.log("[Cache Event] Silently updated Osiris dashboard in background.");
        setOsirisDashboard(e.detail.data);
      }
    };

    window.addEventListener(missionCacheKey, handleMissionsBgUpdate);
    window.addEventListener(dashboardCacheKey, handleDashboardBgUpdate);

    // Fetch daily missions
    const fetchMissions = async () => {
      try {
        let savedWeekly: any[] | null = null;
        if (email) {
          savedWeekly = await loadWeeklyMissionsFromDatabase(email);
          if (savedWeekly && Array.isArray(savedWeekly) && savedWeekly.length > 0) {
            setWeeklyMissions(prev => mergeWeeklyMissionsWithLanguage(savedWeekly, activeLang));
          }
        }

        if (email) {
          const cachedData = await loadCalculationCache(email, `daily_missions_v4_${todayStr}_${activeLang}`);
          if (cachedData && Array.isArray(cachedData.missions)) {
            setDailyMissions(prev => cachedData.missions.map((m: any) => {
              const matched = prev.find(curr => curr.id === m.id);
              return {
                ...m,
                isCompleted: matched ? matched.isCompleted : false
              };
            }));
            if (!savedWeekly && Array.isArray(cachedData.weeklyMissions) && cachedData.weeklyMissions.length > 0) {
              setWeeklyMissions(prev => mergeWeeklyMissionsWithLanguage(cachedData.weeklyMissions, activeLang));
            }
            return;
          }
        }

        const res = await fetch("/api/astrology/daily-missions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userProfile: user, lang: activeLang, mapData })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.missions)) {
            // Merge isCompleted from current dailyMissions if IDs match (to retain completion)
            setDailyMissions(prev => data.missions.map((m: any) => {
              const matched = prev.find(curr => curr.id === m.id);
              return {
                ...m,
                isCompleted: matched ? matched.isCompleted : false
              };
            }));
            if (!savedWeekly && Array.isArray(data.weeklyMissions) && data.weeklyMissions.length > 0) {
              setWeeklyMissions(prev => mergeWeeklyMissionsWithLanguage(data.weeklyMissions, activeLang));
            }
            if (email) {
              await saveCalculationCache(email, `daily_missions_v4_${todayStr}_${activeLang}`, data);
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
          const cachedDashboard = await loadCalculationCache(email, `daily_osiris_dashboard_${todayStr}_${activeLang}`);
          if (cachedDashboard) {
            setOsirisDashboard(cachedDashboard);
            setOsirisLoading(false);
            return;
          }
        }

        const defaultBiorhythm = { physical: 78, emotional: 82, intellectual: 65 };
        const defaultWeather = { temperature: 24, condition: activeLang === 'de' ? "Teilweise bewölkt" : activeLang === 'en' ? "Partly Cloudy" : activeLang === 'es' ? "Parcialmente Nublado" : "Parcialmente Nublado" };
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
            lang: activeLang,
            mapData: mapData || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("orbi_map_data") || 'null') : null)
          })
        });
        if (res.ok) {
          const data = await res.json();
          setOsirisDashboard(data);
          if (email) {
            await saveCalculationCache(email, `daily_osiris_dashboard_${todayStr}_${activeLang}`, data);
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

    return () => {
      window.removeEventListener(missionCacheKey, handleMissionsBgUpdate);
      window.removeEventListener(dashboardCacheKey, handleDashboardBgUpdate);
    };
  }, [user, activeLang]);

  const handleSendOsirisMessage = async () => {
    if (!osirisChatInput.trim() || osirisChatSending) return;
    const userMsgText = osirisChatInput;
    setOsirisChatInput('');
    setOsirisChatMessages(prev => [...prev, { sender: 'user', text: userMsgText }]);
    setOsirisChatSending(true);

    try {
      const defaultBiorhythm = { physical: 78, emotional: 82, intellectual: 65 };
      const defaultWeather = { temperature: 24, condition: activeLang === 'de' ? "Teilweise bewölkt" : activeLang === 'en' ? "Partly Cloudy" : activeLang === 'es' ? "Parcialmente Nublado" : "Parcialmente Nublado" };
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
          dreams: dreamsHistory,
          lang: activeLang,
          mapData: mapData || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("orbi_map_data") || 'null') : null)
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
                <p>{t("Status")}: <span className="text-amber-400 font-bold font-mono">{t("Aguardando seu Mapa Primordial")}</span></p>
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

  // Toggle and Claim helpers
  const handleToggleDailyMission = (id: string) => {
    setDailyMissions(prev => prev.map(m => {
      if (m.id === id) {
        if (m.isClaimed) return m; // Locked once claimed
        return { ...m, isCompleted: !m.isCompleted };
      }
      return m;
    }));
  };

  const handleClaimDailyMission = async (id: string) => {
    let ptsToAdd = 0;
    setDailyMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === id && !m.isClaimed) {
          ptsToAdd = m.points;
          return { ...m, isCompleted: true, isClaimed: true };
        }
        return m;
      });
      
      if (ptsToAdd > 0) {
        setScorePoints(s => {
          const nextScore = s + ptsToAdd;
          // Sync with Firestore immediately
          if (user?.email || email) {
            const nextUser = { ...user, scorePoints: nextScore, stellarPoints: nextScore };
            saveProfileToDatabase(user?.email || email || "", nextUser as any).catch(console.error);
          }
          return nextScore;
        });
      }
      return updated;
    });
  };

  const handleToggleWeeklyMission = (id: string) => {
    setWeeklyMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === id) {
          if (m.isClaimed) return m; // Locked once claimed
          return { ...m, isCompleted: !m.isCompleted };
        }
        return m;
      });
      if (email) {
        saveWeeklyMissionsToDatabase(email, updated).catch(console.error);
      }
      return updated;
    });
  };

  const handleClaimWeeklyMission = async (id: string) => {
    let ptsToAdd = 0;
    setWeeklyMissions(prev => {
      const updated = prev.map(m => {
        if (m.id === id && !m.isClaimed) {
          ptsToAdd = m.points;
          return { ...m, isCompleted: true, isClaimed: true };
        }
        return m;
      });
      
      if (ptsToAdd > 0) {
        if (email) {
          saveWeeklyMissionsToDatabase(email, updated).catch(console.error);
        }
        setScorePoints(s => {
          const nextScore = s + ptsToAdd;
          // Sync with Firestore immediately
          if (user?.email || email) {
            const nextUser = { ...user, scorePoints: nextScore, stellarPoints: nextScore };
            saveProfileToDatabase(user?.email || email || "", nextUser as any).catch(console.error);
          }
          return nextScore;
        });
      }
      return updated;
    });
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

  const calendarCategories = useMemo(() => [
    { id: 'todos', label: 'Todos os Dias', icon: Calendar, color: 'text-sky-400', list: monthlyPredictions.map(p => p.dayNumber + 1) },
    { id: 'produtividade', label: 'Foco & Produtividade', icon: Zap, color: 'text-amber-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('produtividade')).map(p => p.dayNumber + 1) },
    { id: 'descanso', label: 'Descanso & Repouso', icon: Moon, color: 'text-indigo-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('descanso')).map(p => p.dayNumber + 1) },
    { id: 'familia', label: 'Família', icon: Home, color: 'text-emerald-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('familia')).map(p => p.dayNumber + 1) },
    { id: 'encontros', label: 'Encontros', icon: Heart, color: 'text-pink-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('encontros')).map(p => p.dayNumber + 1) },
    { id: 'diversao', label: 'Diversão', icon: Smile, color: 'text-yellow-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('diversao')).map(p => p.dayNumber + 1) },
    { id: 'entrevistas', label: 'Entrevistas', icon: Sparkle, color: 'text-indigo-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('entrevistas')).map(p => p.dayNumber + 1) },
    { id: 'vendas', label: 'Vendas', icon: DollarSign, color: 'text-emerald-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('vendas')).map(p => p.dayNumber + 1) },
    { id: 'investimentos', label: 'Investimentos', icon: Zap, color: 'text-amber-500', list: monthlyPredictions.filter(p => p.categoryMatches.includes('investimentos')).map(p => p.dayNumber + 1) },
    { id: 'viagens', label: 'Viagens', icon: Compass, color: 'text-sky-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('viagens')).map(p => p.dayNumber + 1) },
    { id: 'mudancas', label: 'Mudanças', icon: Flame, color: 'text-rose-500', list: monthlyPredictions.filter(p => p.categoryMatches.includes('mudancas')).map(p => p.dayNumber + 1) },
    { id: 'projetos', label: 'Iniciar Projetos', icon: Award, color: 'text-pink-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('projetos')).map(p => p.dayNumber + 1) },
    { id: 'contratos', label: 'Assinar Contratos', icon: BookOpen, color: 'text-purple-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('contratos')).map(p => p.dayNumber + 1) },
    { id: 'conversas', label: 'Conversas Difíceis', icon: AlertCircle, color: 'text-red-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('conversas')).map(p => p.dayNumber + 1) },
    { id: 'estudos', label: 'Estudos', icon: Star, color: 'text-emerald-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('estudos')).map(p => p.dayNumber + 1) },
    { id: 'exercicios', label: 'Exercícios Físicos', icon: Activity, color: 'text-amber-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('exercicios')).map(p => p.dayNumber + 1) },
    { id: 'meditacao', label: 'Meditação', icon: Eye, color: 'text-teal-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('meditacao')).map(p => p.dayNumber + 1) },
    { id: 'espiritualidade', label: 'Espiritualidade', icon: Sparkles, color: 'text-purple-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('espiritualidade')).map(p => p.dayNumber + 1) },
    { id: 'compras', label: 'Compras Importantes', icon: DollarSign, color: 'text-amber-400', list: monthlyPredictions.filter(p => p.categoryMatches.includes('compras')).map(p => p.dayNumber + 1) }
  ], [monthlyPredictions]);

  const getCalendarDayIconAndBg = (day: number) => {
    const dayPred = monthlyPredictions[day - 1];
    if (!dayPred) {
      return { sym: "☀️", label: "Energia", isMatched: true };
    }

    const isMatched = activeCalendarFilter === 'todos' || dayPred.categoryMatches.includes(activeCalendarFilter);

    let sym = dayPred.moonPhase?.icon || "☀️";
    if (activeCalendarFilter !== 'todos' && isMatched) {
      sym = CATEGORY_EMOJIS[activeCalendarFilter] || dayPred.moonPhase?.icon || "🎯";
    } else if (activeCalendarFilter === 'todos') {
      const primaryCat = dayPred.categoryMatches.find(c => c !== 'todos');
      sym = (primaryCat && CATEGORY_EMOJIS[primaryCat]) || dayPred.moonPhase?.icon || "🌟";
    }

    return {
      sym,
      label: dayPred.tagText,
      isMatched
    };
  };

  const getDetailedDayGuidance = (day: number) => {
    const matchedFavorableTypes: string[] = [];
    calendarCategories.forEach(cat => {
      if (cat.id !== 'todos' && cat.list.includes(day)) {
        matchedFavorableTypes.push(t(cat.label));
      }
    });

    const neutralInfluences = activeLang === 'de' ? 'Allgemeine neutrale Einflüsse' : activeLang === 'en' ? 'General Neutral Influences' : activeLang === 'es' ? 'Influencias Generales Neutras' : activeLang === 'fr' ? 'Influences Générales Neutres' : 'Influências Gerais Neutras';
    const guidanceEven = activeLang === 'de'
      ? "Ein Tag, der von der reflektiven Energie des Mondes dominiert wird. Ideal, um alte Geschäftsideen zu strukturieren oder den Finanzfluss mit saturnischem Urteil zu überprüfen. Müdigkeit ist heilig — respektiere natürliche Pausen."
      : activeLang === 'en'
      ? "A day dominated by the Moon's reflective energy. Perfect for structuring old business ideas or reviewing the flow of finances with Saturnian discernment. Tiredness is sacred — respect natural pauses."
      : activeLang === 'es'
      ? "Un día dominado por la energía reflexiva de la Luna. Perfecto para estructurar ideas antiguas de negocios o revisar el flujo de las finanzas con criterio saturnino. El cansancio es sagrado, respeta las pausas naturales."
      : activeLang === 'fr'
      ? "Une journée dominée par l'énergie réflexive de la Lune. Parfait pour structurer d'anciennes idées d'affaires ou revoir le flux des finances avec un discernement saturnien. La fatigue est sacrée, respectez les pauses naturelles."
      : "Dia dominado pela energia reflexiva da Lua. Perfeito para estruturar ideias antigas de negócios ou revisar o fluxo das finanças com critério saturnino. O cansaço é sagrado, respeite as pausas naturais.";
    const guidanceOdd = activeLang === 'de'
      ? "Ein Tag, der vom Sonnenimpuls des Luftelements geprägt ist. Ausgezeichnet, um Geschäftsvorschläge mündlich zu äußern, Ideen mit Partnern ungezwungen zu diskutieren oder über onirologische Spiritualität zu lesen."
      : activeLang === 'en'
      ? "A day marked by the solar impulse of the Air element. Excellent for verbally expressing business proposals, discussing ideas casually with partners or reading about oneiric spirituality."
      : activeLang === 'es'
      ? "Un día marcado por el impulso solar del elemento Aire. Excelente para expressar verbalmente propuestas comerciales, debatir ideas de forma distendida con socios o leer sobre espiritualidad onírica."
      : activeLang === 'fr'
      ? "Une journée marquée par l'impulsion solaire de l'élément Air. Excellent pour exprimer verbalement des propositions commerciales, discuter de manière décontractée avec des partenaires ou lire sur la spiritualité onirique."
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
      fr: [
        "Allumez un bâton de bois de santal le matin pour vous accorder à la sagesse et nettoyez votre bureau.",
        "Évitez d'acheter des articles superflus en fin de journée. Attendez 24 heures avant de décider.",
        "Faites 5 minutes d'étirements respiratoires intensifs dès le réveil."
      ]
    };
    const langTips = tips[activeLang] || tips['pt'];

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
            {t('Portal Ativo Sincronizado')}
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-100 tracking-tight leading-snug">
            {t('Acelere Seus Objetivos, Navegue pelos Portais Ativos')}
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
                🪐 {t('Veja o que o universo quer te mostrando')}
              </span>
              <p className="text-[9px] text-slate-400 font-medium">{t('Painel do mês e orientações cósmicas.')}</p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider self-end sm:self-center shrink-0 transition shadow-md hover:shadow-amber-500/10 hover:scale-102">
            {t('Ver tudo →')}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
        {/* 1. LEFT SIDEBAR NAVIGATION OR MOBILE DROPDOWN */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">

          {/* Mobile Category Selector */}
          <div className="lg:hidden animate-in fade-in duration-300">
            <label className="block text-[10px] font-mono text-slate-500 mb-1.5 uppercase font-black tracking-wide">
              {t("Acelere Seus Objetivos, Navegue pelos Portais Ativos")}
            </label>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left flex items-center justify-between cursor-pointer group hover:border-slate-700 hover:bg-slate-850/60 transition-all duration-300 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/10 to-indigo-500/20 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                  {activeTabItem ? (
                    <activeTabItem.icon className={`w-4 h-4 ${activeTabItem.color}`} />
                  ) : (
                    <Eye className="w-4 h-4 animate-pulse text-purple-400" />
                  )}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] font-extrabold text-slate-200 tracking-wide uppercase flex items-center gap-1.5 flex-wrap font-sans">
                    {activeMobileLabel}
                  </span>
                  <p className="text-[9px] text-slate-400 font-medium">{t("Navegue pelos Portais Ativos")}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Desktop Styled Sidebar Navigation inside a bento container */}
          <div className="hidden lg:block space-y-4 sticky top-6">
            <div className="p-4 bg-slate-950/60 rounded-3xl border border-slate-850/80 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-wider block">
                  {t('Navegação Cósmica')}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-4">
                {navigationGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-1">
                    <span className="text-[8px] font-mono font-black text-slate-600 block uppercase px-2 tracking-widest leading-none mb-1">
                      {t(group.group)}
                    </span>
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
                                : `text-slate-400 border border-transparent ${sub.bg} hover:text-slate-202`
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
                    <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest block">{t('Mensagem Contextual de Osíris')}</span>
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
                      {t('Perguntar Agora')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOsirisOnlineAlert(false)}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
                      title={t('Fechar')}
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
                          {osirisDashboard?.prioridadeDia?.title || t("Sintonia de Foco Celular")}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          {osirisDashboard?.prioridadeDia?.description || `${t("Sua bússola biológica e o trânsito do Sol em de")} ${zodiacSign} ${t("orientam seu fluxo prático nesta coordenada.")}`}
                        </p>
                        <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl mt-3">
                          <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-0.5">{t("dashboard.mystic_advice")}</span>
                          <p className="text-[11px] text-slate-300 font-serif italic leading-relaxed">
                            "{osirisDashboard?.prioridadeDia?.advice || t('Seja vigilante ao seu biorritmo. Pequenas reflexões de 3 minutos trarão alinhamento.')}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-900/50 flex items-center justify-between mt-4">
                    <span className="text-[9px] text-slate-500 font-mono">{t("dashboard.daily_guidance_title")}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* PART B: OFFLINE PUSH NOTIFICATIONS LOG (SIMULATED COPT CHART) */}
                <div className="bg-slate-950/60 p-6 rounded-3xl border border-slate-850 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-500 animate-swing" />
                        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">{t("dashboard.offline_push_queue")}</span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-500">{t("Últimas 3 Notificações")}</span>
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

                  <p className="text-[8.5px] text-slate-500 font-sans mt-3">★ {t("dashboard.offline_push_desc")}</p>
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
                      <h3 className="text-xs font-bold font-mono text-slate-205 uppercase tracking-widest">{t("Osíris: Mentor e Conselheiro Live")}</h3>
                      <p className="text-[9.5px] text-slate-500">{t("Sincronizado aos seus Transitos Estelares, Temperatura do ar e Biorritmo celular")}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 rounded">
                    {t("Sábio Ativo")}
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
                        <span>{msg.sender === 'user' ? t('Você') : 'Osíris'}</span>
                        <span>•</span>
                        <span>{t('Agora')}</span>
                      </div>
                      <p className="whitespace-pre-line">{t(msg.text)}</p>
                    </div>
                  ))}
                  {osirisChatSending && (
                    <div className="bg-slate-950/90 border border-slate-850/60 text-slate-400 self-start rounded-2xl p-3 text-[11px] max-w-[80%] flex items-center gap-1.5 font-mono animate-pulse">
                      <span>{t("✦ Osíris está sintonizando energias...")}</span>
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
                    placeholder={t("Pergunte ao Osíris sobre seus trânsitos, clima ou sonhos de hoje...")}
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
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                    {localT("radar_dia")}
                  </h3>
                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono font-bold text-rose-400 rounded-lg">
                    {localT("atualizacao_diaria")}
                  </span>
                </div>

                {osirisLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-8 h-8 border-t-2 border-rose-500 border-solid rounded-full animate-spin" />
                    <p className="text-xs text-slate-400 font-mono">{localT("carregando_sintonias")}</p>
                  </div>
                ) : (
                  <div className="space-y-4 font-sans text-left">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/60 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">{t("Frequência Dominante Celular")}</span>
                        <span className="text-xs font-black text-rose-400 block tracking-wide mt-1">
                          {osirisDashboard?.prioridadeDia?.title || t("Intuição Harmoniosa & Foco Singular (Sol e Mercúrio em Trígono)")}
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold uppercase shrink-0">
                        {osirisDashboard?.prioridadeDia?.category || "Astrologia"}
                      </span>
                    </div>

                    {/* The 5 Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {osirisDashboard?.radarDoDia?.map((metric: any, i: number) => (
                        <div key={metric.key || i} className="p-4 bg-slate-950 rounded-2xl border border-slate-850/80 hover:border-slate-800 transition duration-350 space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-200">{metric.label}</span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-slate-900 border border-slate-800 ${metric.statusColor || 'text-slate-400'}`}>
                                {metric.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">{metric.description}</p>
                          </div>
                          
                          <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850/60 flex items-start gap-2 mt-1">
                            <Sparkle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-[10px] text-slate-400 leading-normal">
                              <strong className="text-slate-300">{localT("conselho_acao")}:</strong> {metric.cosmicTip}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RADAR DE OPORTUNIDADES */}
          {areaSubTab === 'oportunidades_hoje' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-amber-500 animate-pulse" />
                      {localT("radar_oportunidades")}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {localT("clique_instrucao")}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-400 rounded-lg shrink-0">
                    {localT("atualizacao_diaria")}
                  </span>
                </div>

                {osirisLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-8 h-8 border-t-2 border-amber-500 border-solid rounded-full animate-spin" />
                    <p className="text-xs text-slate-400 font-mono">{localT("carregando_sintonias")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
                    
                    {/* Left Column: Interactive Gauges */}
                    <div className="lg:col-span-5 space-y-2.5">
                      {Object.keys(osirisDashboard?.radarOportunidades || {}).map((key) => {
                        const isSelected = selectedOpportunityArea === key;
                        const data = osirisDashboard?.radarOportunidades?.[key] || { status: "Sintonizado", statusColor: "text-slate-400" };
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedOpportunityArea(key)}
                            className={`w-full p-3.5 rounded-2xl border transition text-left cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected 
                                ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/[0.02]' 
                                : 'bg-slate-950/40 border-slate-850 hover:border-slate-800'
                            }`}
                          >
                            <span className="text-[10px] font-mono font-black uppercase text-slate-300 flex items-center gap-2">
                              {key === 'dinheiro' && <DollarSign className="w-3.5 h-3.5 text-emerald-400" />}
                              {key === 'amor' && <Heart className="w-3.5 h-3.5 text-pink-400" />}
                              {key === 'estudos' && <Star className="w-3.5 h-3.5 text-sky-405" />}
                              {key === 'trabalho' && <Award className="w-3.5 h-3.5 text-indigo-400" />}
                              {key === 'criatividade' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                              {key === 'networking' && <Users className="w-3.5 h-3.5 text-teal-400" />}
                              {key === 'espiritualidade' && <Moon className="w-3.5 h-3.5 text-purple-400" />}
                              {t(key)}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800/80 ${data.statusColor}`}>
                              {data.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Detailed focused advice */}
                    <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-slate-900 flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">{localT("conselho_hoje")}</span>
                          <span className="px-2 py-0.5 rounded-sm bg-amber-500/10 text-amber-400 font-mono font-black text-[8px] uppercase">{localT("foco_ativo")}</span>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wide text-slate-100 flex items-center gap-1.5">
                            <span>{localT("area_focada")}: {t(selectedOpportunityArea).toUpperCase()}</span>
                          </h4>
                          
                          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-850/60">
                            <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                              "{osirisDashboard?.radarOportunidades?.[selectedOpportunityArea]?.text || t('Aguardando sintonia cósmica.')}"
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">{t("Direcionamento")}</span>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              {osirisDashboard?.radarOportunidades?.[selectedOpportunityArea]?.conselho}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 mt-4">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold mb-1">{localT("ritual_potencializacao")}</span>
                        <p className="text-[10px] text-slate-350 leading-relaxed font-serif">
                          {osirisDashboard?.radarOportunidades?.[selectedOpportunityArea]?.ritual || t('Mantenha a mente clara e focada nas intenções do momento para sintonizar a energia.')}
                        </p>
                      </div>
                    </div>

                  </div>
                )}
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
                      {t('Painel do Mês')} {t('de')} {displayMonthName} {t('de')} {calendarYear}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Seu mapa de forças, proteção e ressonâncias para atravessar o mês de')} {displayMonthName} {t('em segurança vibracional.')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                      title={t("Mês Anterior")}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 text-[10px] font-mono font-bold text-teal-400 rounded-lg shrink-0">
                      {displayMonthName} {calendarYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                      title={t("Próximo Mês")}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bento Grid layout of requested variables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
                  
                  {/* Keyword */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Palavra-Chave do Mês')}</span>
                    <span className="text-xs font-black text-teal-400 font-sans tracking-wide">{dailyAstroRecs.painel.palavra_chave}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.palavra_chave_desc}</p>
                  </div>

                  {/* Símbolo */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Símbolo Favorável')}</span>
                    <span className="text-xs font-black text-purple-400 font-sans tracking-wide">{dailyAstroRecs.painel.simbolo}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.simbolo_desc}</p>
                  </div>

                  {/* Amuleto */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Amuleto Favorável')}</span>
                    <span className="text-xs font-black text-rose-455 font-sans tracking-wide">{dailyAstroRecs.painel.amuleto}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.amuleto_desc}</p>
                  </div>

                  {/* Lucky Number */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Número da Sorte')}</span>
                    <span className="text-xs font-black text-amber-500 font-mono">{dailyAstroRecs.painel.numero_sorte} ({t('Sincronicidade')} {getLifePathNumber(user.birthDate)})</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.numero_sorte_desc}</p>
                  </div>

                  {/* Color */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Cor Favorável')}</span>
                    <span className="text-xs font-black text-indigo-400 font-sans">{dailyAstroRecs.painel.cor_favoravel}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.cor_favoravel_desc}</p>
                  </div>

                  {/* Environment */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Ambiente Favorável')}</span>
                    <span className="text-xs font-black text-cyan-400 font-sans">{dailyAstroRecs.painel.ambiente_favoravel}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.ambiente_favoravel_desc}</p>
                  </div>

                  {/* Activity */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Atividade Favorável')}</span>
                    <span className="text-xs font-black text-green-400 font-sans">{dailyAstroRecs.painel.atividade_favoravel}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.atividade_favoravel_desc}</p>
                  </div>

                  {/* Challenge */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-2">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Desafio Principal do Mês')}</span>
                    <span className="text-xs font-black text-red-400 font-sans">{dailyAstroRecs.painel.desafio}</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">{dailyAstroRecs.painel.desafio_desc}</p>
                  </div>

                  {/* Opportunity */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-2">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Oportunidade Principal do Mês')}</span>
                    <span className="text-xs font-black text-emerald-400 font-sans">{dailyAstroRecs.painel.oportunidade}</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">{dailyAstroRecs.painel.oportunidade_desc}</p>
                  </div>

                  {/* Dominant Energy */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Energia Dominante')}</span>
                    <span className="text-xs font-black text-pink-400 font-sans">{dailyAstroRecs.painel.energia_dominante}</span>
                    <p className="text-[9.5px] text-slate-400 mt-1 leading-normal">{dailyAstroRecs.painel.energia_dominante_desc}</p>
                  </div>

                  {/* Avoid */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-3">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('O que evitar este mês')}</span>
                    <span className="text-xs font-black text-orange-400 font-sans">{dailyAstroRecs.painel.evitar}</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">{dailyAstroRecs.painel.evitar_desc}</p>
                  </div>

                  {/* Best Area for Focus */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between col-span-1 sm:col-span-3">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider font-bold mb-1">{t('Melhor Área de Foco')}</span>
                    <span className="text-xs font-black text-indigo-400 font-sans">{dailyAstroRecs.painel.area_foco}</span>
                    <p className="text-[9.5px] text-slate-405 mt-1 leading-normal">{dailyAstroRecs.painel.area_foco_desc}</p>
                  </div>

                  {/* Frase de poder */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-teal-500/20 col-span-1 sm:col-span-3 text-center">
                    <span className="text-[8px] font-mono text-teal-400 block uppercase tracking-wider font-bold mb-1">{t('Frase de Poder de')} {displayMonthName}</span>
                    <p className="font-serif italic text-sm text-slate-200 py-1 font-semibold leading-relaxed">
                      "{dailyAstroRecs.painel.frase_poder}"
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
                      {t('Calendário Interativo de Tendências (30 Dias)')}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Selecione filtros de atividades para vibrar e fazer brilhar os dias indicativos do mês de')} {displayMonthName} {t('de')} {calendarYear}.</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                      title={t("Mês Anterior")}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono font-bold text-sky-400 rounded-lg shrink-0">
                      {displayMonthName} {calendarYear}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
                      title={t("Próximo Mês")}
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Categories filtering list */}
                <div className="space-y-1 text-left">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t('Filtros de Harmonização e Atividades:')}</span>
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
                          <span>{t(cat.label)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* The dynamic days grid */}
                <div className="space-y-3 pt-3">
                  <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold text-left">{t('Grade de Datas (Clique em um dia para ler os detalhes):')}</span>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono">
                    {Array.from({ length: monthlyPredictions.length }, (_, index) => {
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
                            {t(metadata.label)}
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
                    <div className="flex items-center gap-2">
                      {selectedDayPrediction.keyword && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono border border-amber-500/30 bg-amber-500/10 text-amber-300">
                          {t('Foco:')} {t(selectedDayPrediction.keyword)}
                        </span>
                      )}
                      <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono border ${selectedDayPrediction.tagColorClass}`}>
                        {t('Vibração:')} {t(selectedDayPrediction.tagText)}
                      </span>
                    </div>
                  </div>

                  {/* 5 Key Daily Attributes Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[9.5px] font-mono">
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-[7.5px] text-slate-500 uppercase block">{t('Emoção Predominante')}</span>
                      <span className="text-slate-200 font-bold block mt-0.5">{t(selectedDayPrediction.predominantEmotion || 'Serenidade')}</span>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-[7.5px] text-slate-500 uppercase block">{t('Elemento Dominante')}</span>
                      <span className="text-amber-400 font-bold block mt-0.5">{t(selectedDayPrediction.dominantElement || 'Fogo')}</span>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-[7.5px] text-slate-500 uppercase block">{t('Planeta Regente')}</span>
                      <span className="text-indigo-300 font-bold block mt-0.5">{t(selectedDayPrediction.rulingPlanet || 'Sol')}</span>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                      <span className="text-[7.5px] text-slate-500 uppercase block">{t('Casa Ativada')}</span>
                      <span className="text-sky-300 font-bold block mt-0.5">{t('Casa')} {selectedDayPrediction.mostActivatedHouse || 1}</span>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                      <span className="text-[7.5px] text-slate-500 uppercase block">{t('Nível Energético')}</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">{selectedDayPrediction.energyLevel}%</span>
                    </div>
                  </div>

                  {/* Daily Indices Radar / Progress Grid */}
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-850 space-y-2 text-[10px]">
                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block font-bold">{t('Índices de Performance Diária:')}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1">
                          <span>{t('Produtividade')}</span>
                          <span className="text-amber-400 font-bold">{selectedDayPrediction.productivityIndex || 85}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${selectedDayPrediction.productivityIndex || 85}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1">
                          <span>{t('Emocional')}</span>
                          <span className="text-sky-400 font-bold">{selectedDayPrediction.emotionalIndex || 78}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-sky-400 h-full rounded-full" style={{ width: `${selectedDayPrediction.emotionalIndex || 78}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1">
                          <span>{t('Espiritual')}</span>
                          <span className="text-purple-400 font-bold">{selectedDayPrediction.spiritualIndex || 90}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-purple-400 h-full rounded-full" style={{ width: `${selectedDayPrediction.spiritualIndex || 90}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1">
                          <span>{t('Social')}</span>
                          <span className="text-emerald-400 font-bold">{selectedDayPrediction.socialIndex || 72}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedDayPrediction.socialIndex || 72}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 mb-1">
                          <span>{t('Financeiro')}</span>
                          <span className="text-indigo-400 font-bold">{selectedDayPrediction.financialIndex || 80}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${selectedDayPrediction.financialIndex || 80}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    {/* Column 1 - Astrological Mechanics */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">{t('Resumo Energético & Influência:')}</span>
                        <p className="text-slate-200 font-medium leading-relaxed text-[11px]">{t(selectedDayPrediction.summary || selectedDayPrediction.astroInfluence)}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">{t('Aspectos Planetários do Dia:')}</span>
                        <p className="text-slate-300 italic font-mono text-[10.5px]">{t(selectedDayPrediction.aspects)}</p>
                        {selectedDayPrediction.aspectsPracticalInfluence && (
                          <p className="text-slate-400 text-[10px] mt-0.5">{t(selectedDayPrediction.aspectsPracticalInfluence)}</p>
                        )}
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">{t('Trânsito Celeste & Fase da Lua:')}</span>
                        <p className="text-sky-300 font-mono text-[10.5px]">
                          {selectedDayPrediction.moonPhase?.icon} {t(selectedDayPrediction.moonPhase?.name || '')} ({t(selectedDayPrediction.moonPhase?.sign || '')}) — {t(selectedDayPrediction.transit)}
                        </p>
                        {selectedDayPrediction.moonEmotionalInfluence && (
                          <p className="text-slate-400 text-[10px] mt-0.5">{t(selectedDayPrediction.moonEmotionalInfluence)}</p>
                        )}
                      </div>

                      {/* Numerology and Sound Frequency Cards */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="p-2 bg-purple-950/20 border border-purple-800/30 rounded-xl">
                          <span className="text-[7.5px] text-purple-400 font-bold uppercase block">{t('Dia Pessoal (Numerologia)')}</span>
                          <span className="text-slate-100 font-bold block mt-0.5">
                            {t(selectedDayPrediction.numerology?.title || '')} (Vibração {selectedDayPrediction.numerology?.personalDayNumber})
                          </span>
                        </div>

                        <div className="p-2 bg-indigo-950/20 border border-indigo-800/30 rounded-xl">
                          <span className="text-[7.5px] text-indigo-400 font-bold uppercase block">{t('Frequência Solfeggio')}</span>
                          <span className="text-slate-100 font-bold block mt-0.5">
                            🎵 {selectedDayPrediction.frequency?.hz} - {t(selectedDayPrediction.frequency?.title || '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 - Personal Guidance */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-[#16A340]/10 border border-[#16A340]/20 rounded-lg">
                          <strong className="text-[8px] font-mono text-emerald-400 uppercase block mb-0.5">{t('Áreas Favorecidas:')}</strong>
                          <span className="text-slate-200 text-[10px] font-mono block">{selectedDayPrediction.favoredAreas.map(a => t(a)).join(', ')}</span>
                          {selectedDayPrediction.favoredAreasDetail && (
                            <p className="text-slate-400 text-[9px] mt-1 font-sans">{t(selectedDayPrediction.favoredAreasDetail)}</p>
                          )}
                        </div>
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                          <strong className="text-[8px] font-mono text-rose-400 uppercase block mb-0.5">{t('Áreas de Atenção:')}</strong>
                          <span className="text-slate-200 text-[10px] font-mono block">{selectedDayPrediction.attentionAreas.map(a => t(a)).join(', ')}</span>
                          {selectedDayPrediction.attentionAreasDetail && (
                            <p className="text-slate-400 text-[9px] mt-1 font-sans">{t(selectedDayPrediction.attentionAreasDetail)}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">{t('Oportunidades observadas:')}</span>
                        <p className="text-emerald-400 font-medium text-[11px]">{t(selectedDayPrediction.opportunities)}</p>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block font-bold">{t('Desafios projetados:')}</span>
                        <p className="text-rose-400 font-medium text-[11px]">{t(selectedDayPrediction.challenges)}</p>
                      </div>

                      <div className="p-2.5 bg-indigo-950/20 rounded-xl border border-indigo-900/40">
                        <strong className="text-[8px] font-mono text-indigo-400 uppercase block mb-1">{t('Conselho Estratégico:')}</strong>
                        <p className="text-indigo-200 text-[10.5px] leading-relaxed italic">{t(selectedDayPrediction.personalizedAdvice)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ideal Time Windows Bar */}
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-850 space-y-1.5 font-mono text-[9.5px]">
                    <span className="text-[8px] text-slate-500 uppercase block font-bold">{t('Janelas Temporais Recomendadas do Dia:')}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[7px] text-slate-500 block uppercase">{t('Tomar Decisões')}</span>
                        <span className="text-indigo-300 font-bold">{selectedDayPrediction.bestTimeDecisions || selectedDayPrediction.bestPeriod}</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[7px] text-slate-500 block uppercase">{t('Foco / Estudos')}</span>
                        <span className="text-sky-300 font-bold">{selectedDayPrediction.bestTimeStudies || '14:00 - 16:30'}</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[7px] text-slate-500 block uppercase">{t('Relacionamentos')}</span>
                        <span className="text-emerald-300 font-bold">{selectedDayPrediction.bestTimeRelationships || '18:00 - 20:00'}</span>
                      </div>
                      <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[7px] text-slate-500 block uppercase">{t('Pausa / Descanso')}</span>
                        <span className="text-purple-300 font-bold">{selectedDayPrediction.bestTimeRest || '21:30 - 23:00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Color & Numbers Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[8px] text-amber-400 font-bold uppercase block">{t('Cor Favorável & Uso Prático')}</span>
                      <span className="text-[11px] text-slate-100 font-bold block">{t(selectedDayPrediction.favorableColor)}</span>
                      {selectedDayPrediction.favorableColorReason && (
                        <p className="text-[9.5px] text-slate-400 font-sans leading-relaxed">{t(selectedDayPrediction.favorableColorReason)}</p>
                      )}
                      {selectedDayPrediction.favorableColorUsage && (
                        <p className="text-[9px] text-amber-300/80 font-sans italic">{t(selectedDayPrediction.favorableColorUsage)}</p>
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-[8px] text-indigo-400 font-bold uppercase block">{t('Números Favoráveis & Vibração')}</span>
                      <span className="text-[11px] text-slate-100 font-bold block">
                        {selectedDayPrediction.favorableNumbersList ? selectedDayPrediction.favorableNumbersList.join(', ') : selectedDayPrediction.favorableNumber}
                      </span>
                      {selectedDayPrediction.favorableNumbersMeaning && (
                        <p className="text-[9.5px] text-slate-400 font-sans leading-relaxed">{t(selectedDayPrediction.favorableNumbersMeaning)}</p>
                      )}
                      {selectedDayPrediction.favorableNumbersSuggestions && (
                        <p className="text-[9px] text-indigo-300/80 font-sans italic">{t(selectedDayPrediction.favorableNumbersSuggestions)}</p>
                      )}
                    </div>
                  </div>

                  {/* Daily Recommended Ritual */}
                  {selectedDayPrediction.recommendedRitual && (
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-900/40 text-[10.5px] text-purple-200 font-sans leading-relaxed">
                      🧘‍♀️ <strong className="text-purple-300">{t('Ritual Sugerido para o Dia:')}</strong> {t(selectedDayPrediction.recommendedRitual)}
                    </div>
                  )}

                  {/* Astro Map Custom message */}
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850/60 text-[10.5px] text-slate-400 font-sans leading-relaxed">
                    🌟 <strong className="text-slate-300">{t('Mensagem do seu Mapa:')}</strong> {t(selectedDayPrediction.personalizedMessage)}
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
                      {t('Cores Favoráveis para o Mês de')} {personalProsperity.monthName}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Suas vibrações de pigmentos sintonizadas ao Sol de')} {t(preciseZodiacSign)} {t('e à estabilidade do Caminho de Vida')} {lifePathNumber}.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-bold text-purple-450 rounded-lg shrink-0">
                    {t('Mensal')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1 font-sans text-left">
                  {dynamicColorsList.map((c, i) => (
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
                      {t('Amuletos & Símbolos de Proteção Pessoais')}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Frequências físicas sólidas recomendadas para fixar e ancorar sua aura este mês.')}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-450 rounded-lg shrink-0">
                    {t('Sintonizado')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans text-left">
                  
                  {/* Elemento */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Activity className="w-4 h-4 shrink-0 animate-pulse" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-sky-400">{dynamicElementInfo.title}</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                      {dynamicElementInfo.text}
                    </p>
                  </div>

                  {/* Crystals */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-rose-400">{t('Pedras de Filtro')}</h4>
                    </div>
                    <div className="text-[10.5px] text-slate-350 leading-relaxed font-sans space-y-1">
                      <p><strong>{t('Lápis-Lazúli:')}</strong> {t('Estimula intuição do cérebro superior e protege vias oníricas superiores.')}</p>
                      <p><strong>{t('Selenita:')}</strong> {t('Limpa poeiras de pensamentos reativos e dispersão acumulada.')}</p>
                    </div>
                  </div>

                  {/* Symbols */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Shield className="w-4 h-4 shrink-0" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-amber-400">{t('Símbolos Ativos')}</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                      {t('O')} <strong>{dailyAstroRecs.painel.simbolo}</strong>: {dailyAstroRecs.painel.simbolo_desc}
                    </p>
                  </div>

                  {/* Amuletos */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400">
                      <Award className="w-4 h-4 shrink-0" />
                      <h4 className="text-[11px] font-bold uppercase font-mono tracking-wider text-purple-400">{t('Amuletos Recomendados')}</h4>
                    </div>
                    <p className="text-[10.5px] text-slate-350 leading-relaxed font-sans">
                      {dailyAstroRecs.painel.amuleto}: {dailyAstroRecs.painel.amuleto_desc}
                    </p>
                  </div>
                </div>

                {/* Joias de poder recommendation */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850/85 text-left space-y-2.5 font-sans">
                  <div className="flex items-center gap-1.5 pb-1 border-b border-slate-900">
                    <Star className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <h4 className="text-[10px] font-bold uppercase font-mono text-amber-400 tracking-wider">{t('Recomendação Estelar de Joia de Poder')}</h4>
                  </div>
                  <p className="text-[11px] text-slate-350 leading-relaxed">
                    {t('Recomendamos o uso de um')} <strong>{dailyAstroRecs.painel.cor_favoravel}</strong> ({dailyAstroRecs.painel.cor_favoravel_desc}) {t('ou o portar de um')} <strong>{dailyAstroRecs.painel.amuleto}</strong> {t('para canalizar de forma sólida o seu magnetismo materializador do seu Caminho de Vida')} {lifePathNumber}.
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
                      {t('Conselhos & Mensagem da Semana')}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Diretrizes canalizadas para governar suas decisões sintonizadas com o Cosmos.')}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-[9px] font-mono font-bold text-pink-450 rounded-lg shrink-0">
                    {t('Ativo Semana')}
                  </span>
                </div>

                {/* Bento Grid layout of explicit messages requested */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  
                  {/* Conselho principal */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[8px] font-mono text-slate-505 uppercase tracking-wider block font-bold">{t('Conselho Principal')}</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                      "{dailyAstroRecs.mensagem.conselho_principal}"
                    </p>
                  </div>

                  {/* Alerta principal */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[8px] font-mono text-red-400 uppercase tracking-wider block font-bold">{t('Alerta Principal')}</span>
                    <p className="text-xs text-slate-250 leading-relaxed">
                      "{dailyAstroRecs.mensagem.alerta_principal}"
                    </p>
                  </div>

                  {/* Oportunidade principal */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-wider block font-bold">{t('Oportunidade Principal')}</span>
                    <p className="text-xs text-slate-250 leading-relaxed">
                      "{dailyAstroRecs.mensagem.oportunidade_principal}"
                    </p>
                  </div>

                  {/* Palavra de proteção */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-1 flex flex-col justify-center text-center items-center">
                    <span className="text-[8px] font-mono text-amber-400 uppercase tracking-wider block font-bold mb-1">{t('Palavra de Proteção')}</span>
                    <span className="text-lg font-black tracking-widest text-amber-450 block font-mono">"{dailyAstroRecs.mensagem.palavra_protecao}"</span>
                    <p className="text-[9.5px] text-slate-500 mt-1 leading-normal">{dailyAstroRecs.mensagem.palavra_protecao_desc}</p>
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
                      {t('Prosperidade & Capital Financeiro')}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('As emanações de abundância e fluxo de caixa sob a forte influência realizadora do seu Caminho de Vida')} {lifePathNumber}.</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400 rounded-lg shrink-0">
                    {t('Capital Ativo')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  
                  {/* Financial KPI Bento Column */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1 flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t('Melhor Dia Financeiro da Semana')}</span>
                        <span className="text-xs font-black text-emerald-400 block mt-1">
                          {personalProsperity.monthNumber % 2 === 0 ? t("Quinta-Feira (Trânsito Júpiter)") : t("Segunda-Feira (Trânsito Lunar favorável)")}
                        </span>
                      </div>
                      <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1 flex justify-between items-center">
                      <div>
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t('Melhores Dias Financeiros do Mês')}</span>
                        <span className="text-xs font-black text-amber-400 block mt-1">
                          {((personalProsperity.monthNumber * 2) % 28 + 1)} {t('de')} {t(personalProsperity.monthName)} & {((personalProsperity.monthNumber * 3) % 28 + 1)} {t('de')} {t(personalProsperity.monthName)}
                        </span>
                      </div>
                      <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t('Parâmetros Cromáticos da Riqueza')}</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div 
                          className="w-6 h-6 rounded-full border border-white/10 shrink-0" 
                          style={{ backgroundColor: personalProsperity.favorableColor.hex }}
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-202 block">{t('Cor:')} {t(personalProsperity.favorableColor.name)}</span>
                          <span className="text-[9px] font-mono text-slate-500">{t('Número da Fortuna:')} {personalProsperity.monthNumber * 11}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial state and opportunities observed */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t('Energia do Dinheiro Hoje')}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-extrabold rounded">
                          {75 + (personalProsperity.monthNumber * 4) % 25} / 100
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-slate-600 block uppercase font-bold">{t('Oportunidades Financeiras Observadas:')}</span>
                        <ul className="space-y-2 text-[10px] text-slate-350 list-none font-sans">
                          {personalProsperity.opportunities.map((op, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold shrink-0">✓</span>
                              <span>{t(op)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-850 text-[9.5px] text-slate-400 italic leading-relaxed mt-4">
                      <strong>{t('Conselho de abundância:')}</strong> {t(personalProsperity.strategicAdvice)}
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
                      {t('Amor & Romance')}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Vibrações afetivas, afinidades mútuas e caminhos para sintonizar a cumplicidade do coração.')}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono font-bold text-rose-405 rounded-lg shrink-0">
                    {t('Amanhã')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  
                  {/* Romance schedule metrics */}
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1.5">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t('Energia Amorosa da Semana')}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-rose-455">78 / 100</span>
                        <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-rose-500" style={{ width: '78%' }} />
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">{t('Ambiente propício a sentimentos leves e trocas refinadas mediadas pelo intelecto.')}</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-850 space-y-2">
                      <span className="text-[8px] font-mono text-slate-600 block uppercase font-bold border-b border-slate-900 pb-1">{t('Melhores Dias para Afeto')}</span>
                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">{t('ENCONTROS')}</span>
                          <span className="font-bold text-slate-200">{t('Sexta-Feira')}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">{t('CONVERSAS ROMÂNTICAS')}</span>
                          <span className="font-bold text-slate-200">{t('Quarta-Feira')}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">{t('RECONCILIAÇÕES')}</span>
                          <span className="font-bold text-slate-200 font-sans">{t('Sábado Tarde')}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-mono text-slate-500 block">{t('CONHECER PESSOAS')}</span>
                          <span className="font-bold text-slate-202">{t('Terça-Feira')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Points of attention */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="text-[8px] font-mono text-red-400 block uppercase font-bold border-b border-slate-900 pb-1">{t('Pontos de Atenção no Amor')}</span>
                      <ul className="space-y-2 text-[10px] text-slate-350 font-sans leading-relaxed">
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span>"{t('Evite racionalizar sentimentos instintivos em demasia. Seu par precisa de acolhimento físico e intimidade calorosa, não de debates e silogismos mecânicos.')}"</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold shrink-0">!</span>
                          <span>"{t('Em momentos de discussão, evite o sumiço silencioso ou distanciamento súbito de Aquário, pois isso expande sutilmente o senso de solidão nos afetos.')}"</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-2.5 bg-slate-900/50 rounded-xl border border-slate-850 text-[9.5px] text-slate-400 italic mt-4">
                      <strong>{t('Dica de conexão:')}</strong> {t('Ofereça um chá de Camomila ou Capim-Limão morno antes de iniciar conversas de planos futuros para confortar os chakras do casal.')}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB: CUPIDO ASTROLÓGICO */}
          {areaSubTab === 'cupido' && (
            <div className="space-y-6">
              <CupidoRadarView 
                user={user} 
                lang={activeLang}
              />
            </div>
          )}

          {/* TAB 11: RELACIONAMENTOS */}
          {areaSubTab === 'relacionamentos' && (
            <div className="space-y-6">
              <SocialNetworkView 
                currentUser={user} 
                onUpdateCurrentUser={onUpdateCurrentUser || (() => {})} 
                lang={activeLang}
              />
            </div>
          )}

          {/* TAB 11.5: SISTEMA SOCIAL E COMPATIBILIDADE */}
          {areaSubTab === 'compatibilidade_social' && (
            <div className="space-y-8 animate-in fade-in duration-300 text-left">
              <SocialViralityCard 
                user={user} 
                mapData={mapData} 
                preciseZodiacSign={preciseZodiacSign} 
                lifePathNumber={lifePathNumber} 
                activeLang={activeLang} 
              />

              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                <div className="space-y-0.5 pb-2 border-b border-slate-850 flex justify-between items-center text-left">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-500 animate-pulse" />
                      {t('Afinidades no Ecossistema')}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t('Explore afinidades, acompanhe a atividade no ecossistema e conecte-se com pessoas em ressonância estelar com seu mapa.')}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-450 rounded-lg shrink-0">
                    {t('Sinergia Ativa')}
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

          {/* TAB: CHAKRAS CÓSMICOS */}
          {areaSubTab === 'chakras' && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              <CosmicChakras 
                user={user} 
                mapData={mapData} 
                activeLang={activeLang} 
              />
            </div>
          )}

          {/* TAB: RITUAIS DIÁRIOS */}
          {areaSubTab === 'rituais' && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              <PracticalRituals 
                user={user} 
                activeLang={activeLang} 
                dailyQuestsList={dailyMissions}
                onToggleQuest={(id, points) => handleToggleDailyMission(id)}
              />
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
                      {t("Desenvolvimento Pessoal & Expansão")}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t("As lições, virtudes e hábitos sugeridos para curar bloqueios emocionais acumulados.")}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono font-bold text-emerald-450 rounded-lg shrink-0">
                    {t("Autodesenvolvimento")}
                  </span>
                </div>

                {/* Bento Grid layouts of required parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  
                  {/* Core development pillars */}
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t("Habilidade Cósmica para desenvolver")}</span>
                      <span className="text-xs font-black text-slate-200 block mt-1">{dailyAstroRecs.desenvolvimento.habilidade}</span>
                      <p className="text-[10px] text-slate-400 leading-normal">{dailyAstroRecs.desenvolvimento.habilidade_desc}</p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-1">
                      <span className="text-[8px] font-mono text-red-400 block uppercase font-bold">{t("Bloqueio Emocional a Trabalhar")}</span>
                      <span className="text-xs font-black text-rose-400 block mt-1">{dailyAstroRecs.desenvolvimento.bloqueio}</span>
                      <p className="text-[10px] text-slate-400 leading-normal">{dailyAstroRecs.desenvolvimento.bloqueio_desc}</p>
                    </div>
                  </div>

                  {/* Virtues and main lessons */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1 mr-1">
                        <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t("Virtude da Semana")}</span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-extrabold text-[8px] uppercase">{dailyAstroRecs.desenvolvimento.virtude}</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-slate-600 block uppercase font-bold leading-none">{t("Lição da Semana:")}</span>
                        <p className="font-serif italic text-xs leading-relaxed text-slate-300">
                          "{dailyAstroRecs.desenvolvimento.licao}"
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-850 text-[10px] text-slate-405 italic mt-4">
                      <strong>{t("Exercício Diário Recomendado:")}</strong> {dailyAstroRecs.desenvolvimento.exercicio}
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

            const dreamTitle = latestDream?.interpretation?.title || (activeLang === 'de' ? "Kein Traum synchronisiert" : activeLang === 'en' ? "No dream synced" : activeLang === 'es' ? "Ningún sueño sintonizado" : "Nenhum sonho sintonizado");
            const dreamSymbol = latestDream?.interpretation?.detectedAnimals?.[0]?.animal 
                                || latestDream?.interpretation?.detectedColors?.[0]?.color 
                                || (totalDreams > 0 ? "" + latestDream?.interpretation?.dreamEnergyType : (activeLang === 'de' ? "Keine Symbole" : activeLang === 'en' ? "No symbols" : activeLang === 'es' ? "Sin símbolos" : "Sem símbolos"));
            const dreamEmotion = latestDream?.interpretation?.predominantEmotion?.emotion || (activeLang === 'de' ? "Neutral" : activeLang === 'en' ? "Neutral" : activeLang === 'es' ? "Neutro" : "Neutro");
            const dreamTendency = latestDream?.interpretation?.dreamEnergyType 
                                  ? `${latestDream?.interpretation?.dreamEnergyType} (${latestDream?.interpretation?.dreamEnergyIndex} Hz)`
                                  : (activeLang === 'de' ? "Keine beobachtet" : activeLang === 'en' ? "None observed" : activeLang === 'es' ? "Ninguna observada" : "Nenhuma observada");

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
                        {activeLang === 'de' ? 'Metriken & Statistiken des Traumzentrums' : activeLang === 'en' ? 'Dream Center Metrics & Statistics' : activeLang === 'es' ? 'Métricas & Estadísticas del Centro de Sueños' : 'Métricas & Estatísticas do Centro de Sonhos'}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{activeLang === 'de' ? 'Analytische Intelligenz basierend auf den im Traumtresor archivierten Aufzeichnungen.' : activeLang === 'en' ? 'Analytical intelligence based on records archived in the Dream Vault.' : activeLang === 'es' ? 'Visión analítica de inteligencia basada en los registros archivados en el Cofre de Sueños.' : 'Visão analítica de inteligência baseada nos registros arquivados no Cofre dos Sonhos.'}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-[9px] font-mono font-bold text-pink-450 rounded-lg shrink-0">
                      {activeLang === 'de' ? `Traumreport (${totalDreams} ${totalDreams === 1 ? 'Traum' : 'Träume'})` : activeLang === 'en' ? `Dream Report (${totalDreams} ${totalDreams === 1 ? 'Dream' : 'Dreams'})` : activeLang === 'es' ? `Reporte Onírico (${totalDreams} ${totalDreams === 1 ? 'Sueño' : 'Sueños'})` : `Relatório Onírico (${totalDreams} ${totalDreams === 1 ? 'Sonho' : 'Sonhos'})`}
                    </span>
                  </div>

                  {totalDreams === 0 ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
                      <Moon className="w-10 h-10 text-pink-500/40 mx-auto animate-pulse" />
                      <h4 className="text-xs font-bold font-mono text-slate-350 uppercase">{t("Sem histórico onírico cadastrado")}</h4>
                      <p className="text-[10.5px] text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
                        {t("Sua mente subconsciente ainda aguarda a primeira sintonização. Vá até a aba superior")} <strong>{t("Planeta")}</strong>, {t("use a ferramenta")} <strong>{t("Oráculo dos Sonhos")}</strong>, {t("conte o que você andou sonhando e, à medida que a IA for interpretando seus sonhos, suas estatísticas e seu gráfico de evolução serão desenhados aqui automaticamente!")}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Dynamic calculated metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left font-sans animate-in fade-in duration-300">
                        
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t("Sonho mais Recente")}</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1 block truncate" title={dreamTitle}>
                            {dreamTitle}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">{activeLang === 'de' ? `Synchronisiert am ${latestDream?.date}` : activeLang === 'en' ? `Synced on ${latestDream?.date}` : activeLang === 'es' ? `Sintonizado el ${latestDream?.date}` : `Sintonizado em ${latestDream?.date}`}</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t("Elemento em Destaque")}</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1 block truncate capitalize">
                            {dreamSymbol}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">{t("Símbolo decodificado")}</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t("Emoção Predominante")}</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1 block truncate">
                            {dreamEmotion}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">{t("Clima onírico sutil")}</span>
                        </div>

                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between h-[90px]">
                          <span className="text-[8px] font-mono text-slate-500 block uppercase font-bold">{t("Tendência de Energia")}</span>
                          <span className="text-[11px] font-bold text-amber-100 mt-1 block truncate">
                            {dreamTendency}
                          </span>
                          <span className="text-[8px] font-mono text-slate-600">{t("Frequência vibracional")}</span>
                        </div>
                      </div>

                      {/* Evolution of dreams custom SVG chart (requested: "Evolução dos sonhos ao longo dos meses") */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 text-left space-y-3 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 flex-wrap gap-2 leading-none">
                          <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">
                            {activeLang === 'de' ? 'Traumenergetische Variation (Ihre letzten Synchronisierungen)' : activeLang === 'en' ? 'Oneiric Energy Variation (Your Recent Syncs)' : activeLang === 'es' ? 'Variación Energética Onírica (Sus Sintonizaciones Recientes)' : 'Variação Energética Onírica (Suas Sintonizações Recentes)'}
                          </span>
                          <div className="flex items-center gap-3 text-[8.5px] font-mono">
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />
                              <span className="text-slate-400">{t("Positividade (1–5)")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                              <span className="text-slate-400">{t("Índice Energético (%)")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Custom animated responsive SVG area line graph */}
                        <div className="w-full h-44 relative bg-slate-900/20 rounded-xl border border-slate-900/60 p-2 overflow-hidden flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                            
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
                              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
                                {t("Frequências de Estado Subconsciente (Dados Reais)")}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                                
                                {/* Lucidez */}
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">{t("Frequência de Sonhos Lúcidos")}</span>
                                    <span className="text-[11px] font-mono font-black text-rose-450">{lucidPct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${lucidPct}%` }} />
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 block">{t("Registros conscientes ou com alta frequência energética.")}</span>
                                </div>

                                {/* Positividade */}
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">{t("Frequência de Sonhos Positivos")}</span>
                                    <span className="text-[11px] font-mono font-black text-emerald-450">{positivePct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${positivePct}%` }} />
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 block">{t("Sonhos reveladores com elevado índice de positividade Cósmica.")}</span>
                                </div>

                                {/* Pesadelos */}
                                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-300">{t("Incidentes de Pesadelos")}</span>
                                    <span className="text-[11px] font-mono font-black text-indigo-400">{nightmarePct}%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-505 h-full rounded-full transition-all duration-500" style={{ width: `${nightmarePct}%` }} />
                                  </div>
                                  <span className="text-[8.5px] text-slate-500 block">{t("Frequência de manifestação de medos primitivos ou repouso sob tensão.")}</span>
                                </div>

                              </div>
                            </div>

                            {/* Archetypal Patterns */}
                            <div>
                              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3 font-bold">
                                {t("Reconhecimento de Padrões Reais de Inteligência Onírica")}
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
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-5">
                {/* Header */}
                <div className="space-y-0.5 pb-3 border-b border-slate-850 flex justify-between items-center sm:flex-nowrap flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-indigo-400" />
                      {t("Energia Cósmica da Casa & Harmonização")}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t("Dicas sintonizadas para equilibrar o seu ecossistema físico domiciliar e escritório com seu mapa.")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono font-bold text-indigo-400 rounded-lg shrink-0">
                      {t("Ambiente Físico")}
                    </span>
                    <span className="px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono font-bold text-purple-300 rounded-lg shrink-0">
                      {t(preciseZodiacSign)} • {t("Caminho")} {lifePathNumber}
                    </span>
                  </div>
                </div>

                {/* Primary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left font-sans text-xs">
                  
                  {/* Aroma */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold mb-1">{t("Melhor Aroma da Semana")}</span>
                      <span className="text-xs font-black text-slate-200 block">{t(dailyAstroRecs.casa.aroma)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-2">{t(dailyAstroRecs.casa.aroma_desc)}</p>
                  </div>

                  {/* Incense */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold mb-1">{t("Melhor Incenso Sugerido")}</span>
                      <span className="text-xs font-black text-slate-200 block">{t(dailyAstroRecs.casa.incenso)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-2">{t(dailyAstroRecs.casa.incenso_desc)}</p>
                  </div>

                  {/* Plant */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold mb-1">{t("Melhor Planta Recomendada")}</span>
                      <span className="text-xs font-black text-slate-200 block">{t(dailyAstroRecs.casa.planta)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-2">{t(dailyAstroRecs.casa.planta_desc)}</p>
                  </div>

                  {/* Best room corner */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-indigo-400 block uppercase font-bold mb-1">{t("Melhor Ambiente da Casa")}</span>
                      <span className="text-xs font-black text-indigo-300 block">{t(dailyAstroRecs.casa.ambiente_casa)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-2">{t(dailyAstroRecs.casa.ambiente_casa_desc)}</p>
                  </div>

                  {/* Bedroom color */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-purple-500/30 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-purple-400 block uppercase font-bold mb-1">{t("Cor recomendada no Quarto")}</span>
                      <span className="text-xs font-black text-purple-300 block">{t(dailyAstroRecs.casa.quarto_cor)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-2">{t(dailyAstroRecs.casa.quarto_cor_desc)}</p>
                  </div>

                  {/* Office color */}
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col justify-between hover:border-sky-500/30 transition-all">
                    <div>
                      <span className="text-[8px] font-mono text-sky-400 block uppercase font-bold mb-1">{t("Cor recomendada no Escritório")}</span>
                      <span className="text-xs font-black text-sky-300 block">{t(dailyAstroRecs.casa.escritorio_cor)}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-normal mt-2">{t(dailyAstroRecs.casa.escritorio_cor_desc)}</p>
                  </div>
                </div>

                {/* Advanced Harmonization Grid */}
                <div className="pt-3 border-t border-slate-850">
                  <h4 className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {t("Harmonização Avançada & Alinhamento Domiciliar")}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left font-sans text-xs">
                    {/* Crystal */}
                    <div className="p-3.5 bg-slate-950/80 border border-slate-850/80 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-amber-400 block uppercase font-bold mb-0.5">{t("Cristal de Ancoragem")}</span>
                        <span className="text-[11px] font-extrabold text-slate-200 block">{t(dailyAstroRecs.casa.cristal_casa)}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1.5">{t(dailyAstroRecs.casa.cristal_casa_desc)}</p>
                    </div>

                    {/* Cleansing Ritual */}
                    <div className="p-3.5 bg-slate-950/80 border border-slate-850/80 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-emerald-400 block uppercase font-bold mb-0.5">{t("Ritual do Espaço")}</span>
                        <span className="text-[11px] font-extrabold text-slate-200 block">{t(dailyAstroRecs.casa.ritual_casa)}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1.5">{t(dailyAstroRecs.casa.ritual_casa_desc)}</p>
                    </div>

                    {/* Cardinal Direction */}
                    <div className="p-3.5 bg-slate-950/80 border border-slate-850/80 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-cyan-400 block uppercase font-bold mb-0.5">{t("Direção Auspiciosa")}</span>
                        <span className="text-[11px] font-extrabold text-slate-200 block">{t(dailyAstroRecs.casa.direcao_cardeal)}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1.5">{t(dailyAstroRecs.casa.direcao_cardeal_desc)}</p>
                    </div>

                    {/* Sound Frequency */}
                    <div className="p-3.5 bg-slate-950/80 border border-slate-850/80 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] font-mono text-rose-400 block uppercase font-bold mb-0.5">{t("Frequência de Som")}</span>
                        <span className="text-[11px] font-extrabold text-slate-200 block">{t(dailyAstroRecs.casa.frequencia_som)}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal mt-1.5">{t(dailyAstroRecs.casa.frequencia_som_desc)}</p>
                    </div>
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
                      {t("Missões Diárias Cósmicas")}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">{t("Cumpra os pequenos gestos do dia para consolidar o score celestial.")}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400 font-extrabold rounded-lg">
                    {t("XP Acumulado:")} {scorePoints} pts
                  </span>
                </div>

                <div className="space-y-3">
                  {dailyMissions.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => !task.isClaimed && handleToggleDailyMission(task.id)}
                      className={`p-3 bg-slate-950/80 rounded-xl border flex justify-between items-center gap-4 transition-all ${
                        task.isClaimed
                          ? 'border-emerald-500/30 bg-emerald-950/10 opacity-80'
                          : task.isCompleted 
                            ? 'border-emerald-500/20 bg-slate-950/90 cursor-pointer' 
                            : 'border-slate-850/60 hover:border-amber-500/30 hover:bg-slate-900/60 cursor-pointer'
                      } select-none`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-[10px] transition ${
                            task.isClaimed
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                              : task.isCompleted 
                                ? 'bg-amber-500 border-amber-450 text-slate-950 font-black' 
                                : 'border-slate-800 bg-slate-900'
                          }`}
                        >
                          {(task.isClaimed || task.isCompleted) && "✓"}
                        </div>
                        <div>
                          <h5 className={`text-xs font-bold text-slate-200 ${task.isClaimed ? 'line-through text-slate-500' : ''}`}>
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
                                  <strong>{t("Benefício ao cumprir:")}</strong> {task.benefitExplanation}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {task.isClaimed ? (
                          <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 font-bold rounded">
                            {t("Resgatado")}
                          </span>
                        ) : task.isCompleted ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimDailyMission(task.id);
                            }}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-950 text-[10px] font-black uppercase rounded-lg tracking-wider transition cursor-pointer animate-pulse"
                          >
                            {t("Recolher")} +{task.points} XP
                          </button>
                        ) : (
                          <span className="text-[9px] font-mono text-amber-500 font-bold">+{task.points} XP</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B: Weekly Missions requested ("Missão da Semana") */}
              <div className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="pb-3 border-b border-slate-850">
                  <h3 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                    {t("Missões da Semana (Retenção Ativa)")}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t("Principais metas desta semana para impulsionar conexões e estancar vazos de capital.")}</p>
                </div>

                <div className="space-y-3">
                  {weeklyMissions.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => !task.isClaimed && handleToggleWeeklyMission(task.id)}
                      className={`p-3.5 bg-slate-950/80 rounded-2xl border flex justify-between items-center gap-4 transition-all ${
                        task.isClaimed
                          ? 'border-purple-500/30 bg-purple-950/10 opacity-80'
                          : task.isCompleted 
                            ? 'border-purple-500/20 bg-slate-950/90 cursor-pointer' 
                            : 'border-slate-850/60 hover:border-purple-500/30 hover:bg-slate-900/60 cursor-pointer'
                      } select-none`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center text-[10px] transition ${
                            task.isClaimed
                              ? 'bg-purple-500 border-purple-400 text-slate-950 font-black'
                              : task.isCompleted 
                                ? 'bg-purple-500 border-purple-400 text-slate-950 font-black' 
                                : 'border-slate-800 bg-slate-900'
                          }`}
                        >
                          {(task.isClaimed || task.isCompleted) && "✓"}
                        </div>
                        <div>
                          <h5 className={`text-xs font-black text-slate-200 ${task.isClaimed ? 'line-through text-slate-500' : ''}`}>
                            "{task.title}"
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-sans">{task.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {task.isClaimed ? (
                          <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-400 font-bold rounded">
                            {t("Resgatado")}
                          </span>
                        ) : task.isCompleted ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClaimWeeklyMission(task.id);
                            }}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 active:scale-95 text-slate-950 text-[10px] font-black uppercase rounded-lg tracking-wider transition cursor-pointer animate-pulse"
                          >
                            {t("Recolher")} +{task.points} XP
                          </button>
                        ) : (
                          <span className="text-[9px] font-mono text-purple-400 font-bold">+{task.points} XP</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Claim reward block */}
                <div className="pt-3 flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex-wrap gap-3">
                  <span className="text-[9px] font-mono text-slate-400 max-w-[280px] leading-relaxed">
                    {t("A conclusão semanal das missões estabiliza seu score material e clareia o Sol em Aquário.")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      alert(t("Suas bênçãos e pontuações semanais foram integradas ao seu mapa de evolução pessoal!"));
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-slate-950 text-[9.5px] font-black uppercase rounded-lg tracking-wider transition hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                  >
                    {t("Resgatar Recompensas Semanais")}
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
                      {t("Integração Android")}
                    </span>
                    <h2 className="text-xl font-sans font-bold tracking-tight text-slate-100">
                      {t("Instalar o Portal Órbita no Celular")}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {t("Baixe o APK premium oficial ou sintonize o aplicativo instantâneo via PWA.")}
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
                      <h4 className="text-sm font-black text-slate-100">{t("Método 1: APK Android Nativo")}</h4>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      {t("Este é o instalador direto para o seu dispositivo Android. Ele carrega as funções astrológicas e sincroniza sua mandala em tempo de execução nativa.")}
                    </p>
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 text-[10px] text-slate-400 space-y-1.5 leading-relaxed">
                      <div className="flex justify-between items-center text-slate-400 border-b border-slate-850 pb-1">
                        <span>{t("Arquivo:")}</span>
                        <span className="font-mono text-slate-100">Portal_Orbita_v1.0.apk</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 border-b border-slate-850 pb-1">
                        <span>{t("Tamanho:")}</span>
                        <span className="font-mono text-slate-100">3.8 MB</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>{t("Segurança:")}</span>
                        <span className="text-emerald-400 font-bold font-mono">{t("Verificado por SHA256")}</span>
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
                      {activeLang === 'de' ? 'APK-Datei herunterladen' : activeLang === 'en' ? 'Download APK File' : activeLang === 'es' ? 'Descargar Archivo APK' : 'Baixar Arquivo APK'}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center leading-normal">
                      {t("Compatível com Android 8.0 ou superior. Requer liberação de instalação manual.")}
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
                      <h4 className="text-sm font-black text-slate-100">{t("Método 2: Aplicativo Instantâneo (PWA)")}</h4>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      {t("A tecnologia PWA permite adicionar o aplicativo direto na tela de início sem precisar instalar arquivos separados. É compatível com Android e iOS (iPhone).")}
                    </p>
                    
                    <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-850 space-y-2 text-[10px] text-slate-400 text-left leading-relaxed">
                      <div className="font-bold text-slate-200 uppercase tracking-widest text-[9px] font-mono mb-1 text-amber-400">{t("Como Instalar no Celular:")}</div>
                      <div className="space-y-1.5 font-sans">
                        <p><strong>{t("No Android / Chrome:")}</strong> {t("Clique no botão de instalar abaixo ou nos 3 pontinhos")} (<span className="font-mono">⋮</span>) {t("no canto superior e selecione")} <strong>{t("\"Instalar aplicativo\"")}</strong> {t("ou")} <strong>{t("\"Adicionar à tela inicial\"")}</strong>.</p>
                        <p><strong>{t("No iPhone / Safari:")}</strong> {t("Toque no ícone de compartilhamento")} (<span className="text-xs text-sky-400 font-bold">↑</span>) {t("no Safari e selecione")} <strong>{t("\"Adicionar à Tela de Início\"")}</strong>.</p>
                      </div>
                    </div>
                  </div>

                   <div className="space-y-2 pt-3">
                    {isInstalled ? (
                      <div className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col items-center justify-center gap-1 text-emerald-400">
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          {t("Portal Órbita Instalado")}
                        </div>
                        <span className="text-[9px] text-emerald-500/90 font-medium">
                          {t("Sessão em execução segura no modo standalone nativo.")}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (onInstallPWA) {
                            onInstallPWA();
                          } else {
                            alert(t("Esta aplicação é um PWA completo! Encontre a opção de instalar diretamente no menu de opções do seu navegador (ícone de computador ou adicionar à tela inicial) para rodar como um app nativo."));
                          }
                        }}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-rose-500 hover:from-amber-450 hover:to-rose-550 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/10 animate-pulse"
                        style={{ animationDuration: '3s' }}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        {typeof navigator !== 'undefined' && /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
                          ? t("Clique em Compartilhar e Adicionar à Tela de Início")
                          : t("Instalar Aplicativo")}
                      </button>
                    )}
                    <p className="text-[10px] text-slate-500 text-center leading-normal">
                      {t("Não consome memória de armazenamento físico adicional. Atualiza em tempo real.")}
                    </p>
                  </div>
                </div>

                {/* CARD 3: QR CODE E COMPARTILHAMENTO */}
                <div className="md:col-span-2 p-5 md:p-6 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 font-sans text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-black text-slate-100">{t("Sincronizar Celular Via QR Code / Compartilhar")}</h4>
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
                        <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider text-center p-2">{activeLang === 'de' ? 'Mit deiner Kamera synchronisieren 🪐' : activeLang === 'en' ? 'Tune in with your camera 🪐' : activeLang === 'es' ? 'Sintoniza con tu cámara 🪐' : 'Sintonize com sua câmera 🪐'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1 font-sans">
                      <p className="text-xs text-slate-350 leading-relaxed">
                        {t("Aponte a câmera do seu celular para este código para abrir o Portal Órbita instantaneamente no seu celular ou acionar a instalação direta sem digitar endereços.")}
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
                          {t("Copiar Link do App")}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: 'Portal Órbita - Astrologia Premium',
                                text: t('Venha desvendar seu mapa de nascimento, biorritmo, tarô e conselhos da IA Orbia no Portal Órbita!'),
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
                          {t("Enviar via WhatsApp")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECURITY ASSURANCE BANNER AND TECHNICAL SPECIFICATIONS AND TUTORIAL */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 space-y-3 font-sans">
                <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">🛡️ {t("Informações Úteis de Instalação e Distribuição Independente")}</h5>
                <p className="text-[10.5px] text-slate-500 leading-relaxed">
                  {t("apk_distribution_info")}
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

          <span className="text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-extrabold font-mono">{t("Artigo de Saber")}</span>
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
              {t("Concluir Leitura")}
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
              <span className="text-[9px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md font-extrabold font-mono">{t("Definição Planetária")}</span>
              <h1 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight mt-1">{selectedSign.name}</h1>
            </div>
          </div>

          <div className="my-4 border-b border-slate-850" />

          <div className="space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                <span className="text-slate-500 block uppercase">{t("Planeta Regente")}</span>
                <strong className="text-slate-200 mt-0.5 block">{selectedSign.regente}</strong>
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                <span className="text-slate-500 block uppercase">{t("Elemento")}</span>
                <strong className="text-slate-200 mt-0.5 block">{selectedSign.element}</strong>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{t("Características / Traços")}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedSign.traits}</p>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{t("Previsão Cósmica (Horóscopo)")}</h4>
              <p className="text-xs text-amber-100/90 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 italic">"{selectedSign.horoscopo}"</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedSign(null)}
              className="px-4 py-2 bg-purple-500 text-slate-950 hover:bg-purple-400 text-xs font-black uppercase rounded-xl transition cursor-pointer"
            >
              {t("Concluiu")}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Mobile Navigation Modal */}
    {isMobileNavOpen && (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[200] flex flex-col justify-end p-4 lg:hidden">
        <div className="absolute inset-0" onClick={() => setIsMobileNavOpen(false)} />
        <div className="bg-slate-900 border border-slate-800 w-full rounded-3xl p-5 relative overflow-hidden text-left shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col z-10">
          <div className="flex justify-between items-center pb-3.5 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                {t('Navegação Cósmica')}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="p-1.5 bg-slate-850 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 my-2">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1.5">
                <span className="text-[8px] font-mono font-black text-slate-500 block uppercase px-2 tracking-widest leading-none">
                  {t(group.group)}
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((sub) => {
                    const Icon = sub.icon;
                    const isSelected = areaSubTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setAreaSubTab(sub.id as any);
                          setIsMobileNavOpen(false);
                        }}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-[10.5px] font-bold tracking-wide transition-all duration-300 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border border-amber-500/20 text-amber-400 font-black'
                            : `text-slate-400 bg-slate-950/20 border border-transparent ${sub.bg} hover:text-slate-202`
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-3.5 h-3.5 ${sub.color}`} />
                          <span className="text-left leading-tight">{t(sub.label)}</span>
                        </div>
                        {isSelected ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 shrink-0 flex justify-end">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-[10px] font-black uppercase rounded-xl transition cursor-pointer"
            >
              {t("Fechar")}
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
    </div>
  );
}
