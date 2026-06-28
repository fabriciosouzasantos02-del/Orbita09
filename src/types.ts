export interface BirthDetails {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
}

export interface UserProfile {
  userId?: string;
  uid?: string;
  name: string;
  email: string;
  photoURL?: string;
  provider?: string;
  emailVerified?: boolean;
  isEmailVerified?: boolean; // Retro-compatibility
  displayName?: string;
  birthName?: string;
  profileName?: string;
  avatarId?: string;
  preferredLanguage?: string;
  trialUsed?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  deviceFingerprint?: string;
  deviceId?: string;
  lastLoginAt?: string;
  // Existing fields
  birthDate?: string;
  birthTime?: string;
  birthCity?: string;
  birthRegion?: string;
  birthDetails?: BirthDetails;
  isUnknownTime?: boolean;
  isPremium?: boolean;
  gender?: string;
  profilePhoto?: string;
  hasCreatedMap?: boolean;
  scorePoints?: number;
  stellarPoints?: number;
  latitude?: number;
  longitude?: number;
  mainMapChangesCount?: number;
  currentChartId?: string;
  extraMapsCreatedCount?: number;
  createdAt?: string;
  isSubscribed?: boolean;
  subscriptionEndDate?: string;
  verificationCode?: string;
  verificationCodeCreatedAt?: string;
}

export interface AstroElementDistribution {
  fire: number;   // e.g. 16
  earth: number;  // e.g. 21
  air: number;    // e.g. 30
  water: number;  // e.g. 33
}

export interface AstroQualityDistribution {
  cardinal: number; // e.g. 24
  fixed: number;    // e.g. 47
  mutable: number;  // e.g. 29
}

export interface AstroPolarityDistribution {
  yang: number; // e.g. 46 (Active)
  yin: number;  // e.g. 54 (Reative)
}

export interface AstroAstroPosition {
  name: string;      // e.g. "Sol", "Lua"
  sign: string;      // e.g. "Aquário"
  degree: string;    // e.g. "22°"
  extraInfo?: string; // e.g. "3º decanato", "exílio", "combustão"
  description: string;
}

export interface AstroHouse {
  number: number;      // 1 to 12
  sign: string;        // e.g. "Sagitário"
  planet?: string;     // e.g. "Urano"
  interpretation: string;
}

export interface AstroAspect {
  planet1: string;     // e.g. "Sol"
  aspectType: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil";
  planet2: string;     // e.g. "Lua"
  orb: string;         // e.g. "1.53"
  interpretation: string;
}

export interface AstrologyMap {
  welcomeMessage: string;
  is_dst?: boolean;
  timezone?: string;
  originalTime?: string;
  adjustedTime?: string;
  lang?: string;
  distribution: {
    elements: AstroElementDistribution;
    qualities: AstroQualityDistribution;
    polarization: AstroPolarityDistribution;
  };
  personalityTraits: {
    harmonious: string[];
    disharmonious: string[];
  };
  astros: AstroAstroPosition[];
  houses: AstroHouse[];
  aspects: AstroAspect[];
}

export interface NumerologyCycle {
  caminhoDeVida: number;
  expressao: number;
  motivacao: number;
  personalidade: number;
  ciclos: string[];
  description: string;
}

export interface DreamInterpretation {
  summary: string;           // 1. Resumo geral
  mainMeanings: string[];    // 2. Significados principais
  symbols: string[];         // 3. Simbolismos
  emotionalAspects: string;  // 4. Aspectos emocionais
  reflections: string[];     // 5. Possíveis reflexões
  positivePoints: string[];  // 6. Pontos positivos
  attentionPoints: string[]; // 7. Pontos de atenção
  advice: string;            // 8. Conselhos
  finalMessage: string;      // 9. Mensagem final
}

export interface DreamEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  description?: string;
  mood: "peaceful" | "neutral" | "lucid" | "intense" | "nightmare";
  symbols: string[];
  emotions?: string[];
  tags?: string[];
  aiAnalysis?: string;
  interpretation?: DreamInterpretation | null;
}

export interface OracleDreamInterpretation {
  title: string;
  mainMeaning: string;
  psychological: string;
  spiritual?: string | null;
  attention?: string | null;
  opportunities?: string | null;
  protection?: string | null;
  loveArea?: string | null;
  financeArea?: string | null;
  careerArea?: string | null;
  luckyNumbers: string[];
  favorableColors: string[];
  positivityLevel: number;
  oracleAdvice: string;
  detectedAnimals?: { animal: string; meaning: string }[] | null;
  detectedColors?: { color: string; meaning: string }[] | null;
  detectedNumbers?: { number: string; meaning: string }[] | null;
  predominantEmotion?: { emotion: string; explanation: string } | null;
  dreamEnergyIndex: number;
  dreamEnergyType: string;
  universeMessage: string;
}

export interface OracleDreamEntry {
  id: string;
  date: string;
  time?: string;
  title?: string;
  language?: string;
  description: string;
  interpretation?: OracleDreamInterpretation | null;
}

export interface CompatibilityResult {
  partnerName: string;
  partnerBirthDate: string;
  lovePercent: number;
  friendshipPercent: number;
  businessPercent: number;
  communicationPercent: number;
  emotionalAffinityPercent: number;
  strengthPoints: string[];
  conflicts: string[];
  opportunities: string[];
}

export interface ProsperityMap {
  monthNumber: number;
  favoredColor: string;
  favoredColorHex: string;
  favoredDay: string;
  keyword: string;
  symbol: string;
  recommendations: string[];
}

export interface DailyRadar {
  date: string;
  energyOfDay: string;              // e.g. "Intuição Harmoniosa"
  dispositionLevel: number;         // percentage
  bestTimeProductivity: string;     // e.g. "10:00 - 12:00"
  bestTimeRelationships: string;    // e.g. "18:00 - 21:00"
  bestTimeStudies: string;          // e.g. "14:00 - 16:30"
  bestTimeOrganization: string;     // e.g. "08:00 - 09:30"
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  points: number;
  benefit?: string;
  benefitExplanation?: string;
}

export interface DayTrend {
  day: number;
  type: 'favorable' | 'warning' | 'productivity' | 'rest';
  title: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface DailyOracleResponse {
  reflection: string;
  inspiringMessage: string;
  counsel: string;
}

export interface TarotDrawResult {
  id: string;
  nome: string;
  imagem: string;
  significado: string;
  
  cardName: string;
  arcanaType: 'major' | 'minor';
  number: number;
  imageUrl: string;
  uprightMeaning: string;
  advice: string;
  weeklyForecast: string;
  drawingDate: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
}

export interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: "Conjunção" | "Sextil" | "Quadratura" | "Trígono" | "Oposição";
  angle: number;
  orb: number;
}

export interface NatalChartData {
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
}

export interface NumerologyData {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  destiny: number;
}

export interface TarotCard {
  id: string;
  name: string;
  type: "major" | "minor";
  arcana: string;
  uprightMeaning: string;
  reversedMeaning: string;
  imageSym: string;
  description: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Assistant {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
}
