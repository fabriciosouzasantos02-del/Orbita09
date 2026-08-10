import { calculateLifePathNumber } from '../prosperityEngine';
import i18next from 'i18next';
// @ts-ignore
import ephemeris from 'ephemeris';

export interface MoonPhaseInfo {
  name: string;
  icon: string;
  sign: string;
  desc: string;
}

export interface NumerologyDayInfo {
  personalDayNumber: number;
  title: string;
  vibration: string;
}

export interface SoundFrequencyInfo {
  hz: string;
  title: string;
  benefit: string;
}

export interface DailyPrediction {
  dayNumber: number;
  date: Date | string;
  dateFormatted: string;
  tagText: string;
  tagColorClass: string;
  lunarTransitAndSectors: string;
  dailyPlanetaryAspects: string[];

  // 1. Resumo Energético do Dia
  summary: string;
  astroInfluence: string;

  // 2. Cor Favorável
  favorableColor: string;
  favorableColorReason: string;
  favorableColorUsage: string;
  favorableColorExamples: string;

  // 3. Números Favoráveis
  favorableNumber: number;
  favorableNumbersList: number[];
  favorableNumbersMeaning: string;
  favorableNumbersSuggestions: string;

  // 4 & 16. Melhor Horário / Período do Dia
  bestPeriod: string;
  bestPeriodReason: string;
  bestPeriodActivities: string[];

  // 5 & 17. Horário / Período de Atenção (Alerta)
  attentionPeriod: string;
  attentionPeriodChallenges: string;
  attentionPeriodStrategies: string;

  // 6. Influência Astrológica
  astroIntensity: string;
  personalImpact: string;

  // 7. Aspectos Planetários do Dia
  aspects: string;
  aspectsPracticalInfluence: string;
  aspectsInterpretation: string;

  // 8. Trânsitos Celestes
  transit: string;
  transitNatalImpact: string;
  transitOpportunities: string;

  // 9. Lua
  moonPhase: MoonPhaseInfo;
  moonEmotionalInfluence: string;
  moonPracticalApplications: string;

  // 10. Energia Predominante
  predominantEnergy: string;
  energyDetails: {
    emotional: string;
    spiritual: string;
    mental: string;
    physical: string;
  };

  // 11. Oportunidades do Dia
  opportunities: string;
  sectorOpportunities: {
    work: string;
    studies: string;
    love: string;
    money: string;
    family: string;
    creativity: string;
    spirituality: string;
  };

  // 12. Áreas Favorecidas
  favoredAreas: string[];
  favoredAreasDetail: string;

  // 13. Áreas de Atenção
  attentionAreas: string[];
  attentionAreasDetail: string;
  riskMitigation: string;

  // 14. Desafios Projetados
  challenges: string;
  challengeOrigin: string;
  challengeStrategy: string;

  // 15 & 18. Conselho Estratégico & Conselho Personalizado
  personalizedAdvice: string;

  // 19. Mensagem Exclusiva
  personalizedMessage: string;

  // Novos Atributos e Métricas Solicitados
  keyword: string;
  predominantEmotion: string;
  dominantElement: string;
  rulingPlanet: string;
  mostActivatedHouse: number;
  mostActivatedHouseDetails: string;

  energyLevel: number;
  productivityIndex: number;
  emotionalIndex: number;
  spiritualIndex: number;
  socialIndex: number;
  financialIndex: number;

  bestTimeDecisions: string;
  bestTimeRest: string;
  bestTimeStudies: string;
  bestTimeRelationships: string;
  recommendedRitual: string;

  categoryMatches: string[];
  houseDetails?: string;
  numerology: NumerologyDayInfo;
  frequency: SoundFrequencyInfo;
}

function getActiveLanguage(): 'pt' | 'en' | 'es' | 'de' | 'fr' {
  const lang = (i18next.language || 'pt').toLowerCase().split('-')[0];
  if (['pt', 'en', 'es', 'de', 'fr'].includes(lang)) {
    return lang as 'pt' | 'en' | 'es' | 'de' | 'fr';
  }
  return 'pt';
}

const TRANSLATED_SIGNS: Record<string, Record<string, string>> = {
  pt: { "Áries": "Áries", "Touro": "Touro", "Gêmeos": "Gêmeos", "Câncer": "Câncer", "Leão": "Leão", "Virgem": "Virgem", "Libra": "Libra", "Escorpião": "Escorpião", "Sagitário": "Sagitário", "Capricórnio": "Capricórnio", "Aquário": "Aquário", "Peixes": "Peixes" },
  en: { "Áries": "Aries", "Touro": "Taurus", "Gêmeos": "Gemini", "Câncer": "Cancer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Scorpio", "Sagitário": "Sagittarius", "Capricórnio": "Capricorn", "Aquário": "Aquarius", "Peixes": "Pisces" },
  es: { "Áries": "Aries", "Touro": "Tauro", "Gêmeos": "Géminis", "Câncer": "Cáncer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Escorpio", "Sagitário": "Sagitario", "Capricórnio": "Capricornio", "Aquário": "Acuario", "Peixes": "Piscis" },
  de: { "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs", "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion", "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Peixes" },
  fr: { "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer", "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion", "Sagitário": "Sagitaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons" }
};

const PLANET_TRANSLATIONS: Record<string, Record<string, string>> = {
  pt: { "Sol": "Sol", "Lua": "Lua", "Mercúrio": "Mercúrio", "Vênus": "Vênus", "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano", "Netuno": "Netuno", "Plutão": "Plutão", "Quíron": "Quíron", "Ascendente": "Ascendente", "Meio do Céu": "Meio do Céu" },
  en: { "Sol": "Sun", "Lua": "Moon", "Mercúrio": "Mercury", "Vênus": "Venus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptune", "Plutão": "Pluto", "Quíron": "Chiron", "Ascendente": "Ascendant", "Meio do Céu": "Midheaven" },
  es: { "Sol": "Sol", "Lua": "Luna", "Mercúrio": "Mercurio", "Vênus": "Venus", "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano", "Netuno": "Neptuno", "Plutão": "Plutón", "Quíron": "Quirón", "Ascendente": "Ascendente", "Meio do Céu": "Medio Cielo" },
  de: { "Sol": "Sonne", "Lua": "Mond", "Mercúrio": "Merkur", "Vênus": "Venus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptun", "Plutão": "Pluto", "Quíron": "Chiron", "Ascendente": "Aszendent", "Meio do Céu": "Himmelsmitte" },
  fr: { "Sol": "Soleil", "Lua": "Lune", "Mercúrio": "Mercure", "Vênus": "Vénus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturne", "Urano": "Uranus", "Netuno": "Neptune", "Plutão": "Pluton", "Quíron": "Chiron", "Ascendente": "Ascendant", "Meio do Céu": "Milieu du Ciel" }
};

const ASPECT_TRANSLATIONS: Record<string, Record<string, string>> = {
  pt: { "Conjunção": "Conjunção", "Oposição": "Oposição", "Trígono": "Trígono", "Quadratura": "Quadratura", "Sextil": "Sextil" },
  en: { "Conjunção": "Conjunction", "Oposição": "Opposition", "Trígono": "Trine", "Quadratura": "Square", "Sextil": "Sextile" },
  es: { "Conjunção": "Conjunción", "Oposição": "Oposición", "Trígono": "Trígono", "Quadratura": "Cuadratura", "Sextil": "Sextil" },
  de: { "Conjunção": "Konjunktion", "Oposição": "Opposition", "Trígono": "Trigon", "Quadratura": "Quadrat", "Sextil": "Sextil" },
  fr: { "Conjunção": "Conjonction", "Oposição": "Opposition", "Trígono": "Trigone", "Quadratura": "Carré", "Sextil": "Sextile" }
};

const TRANSLATED_TAGS: Record<string, string[]> = {
  pt: ["Favorável", "Atenção", "Produtivo", "Descanso", "Foco"],
  en: ["Favorable", "Attention", "Productive", "Rest", "Focus"],
  es: ["Favorable", "Atención", "Productivo", "Descanso", "Enfoque"],
  de: ["Günstig", "Achtung", "Produktiv", "Ruhe", "Fokus"],
  fr: ["Favorable", "Attention", "Productif", "Repos", "Focus"]
};

const TRANSLATED_TRANSITS: Record<string, string[]> = {
  pt: [
    "Lua transitando pela sua Casa 2 (Recursos Materiais & Valores)",
    "Lua em trânsito pela sua Casa 5 (Criatividade, Autoexpressão e Romances)",
    "Saturno retrógrado tocando em aspecto favorável ao seu Meio do Céu",
    "Sol iluminando sua Casa 9 (Estudos Avançados e Caminhos de Destino)",
    "Mercúrio em conjunção harmoniosa com seus planetas de Ar na Casa 11",
    "Júpiter expandindo as oportunidades de networking na sua Casa 7",
    "Vênus sintonizando energias de beleza e requinte na sua Casa 1",
    "Marte dando vigor físico no seu setor de saúde e bem-estar (Casa 6)"
  ],
  en: [
    "Moon transiting through your 2nd House (Material Resources & Values)",
    "Moon in transit through your 5th House (Creativity, Self-expression, and Romance)",
    "Saturn retrograde making a favorable aspect to your Midheaven",
    "Sun illuminating your 9th House (Advanced Studies and Paths of Destiny)",
    "Mercury in harmonious conjunction with your Air planets in the 11th House",
    "Jupiter expanding networking opportunities in your 7th House",
    "Venus tuning energies of beauty and refinement in your 1st House",
    "Mars bringing physical vigor to your health and wellness sector (6th House)"
  ],
  es: [
    "Luna transitando por tu Casa 2 (Recursos Materiales y Valores)",
    "Luna en tránsito por tu Casa 5 (Creatividad, Autoexpresión y Romances)",
    "Saturno retrógrado tocando en aspecto favorable a tu Medio Cielo",
    "Sol iluminando tu Casa 9 (Estudios Avanzados y Caminos de Destino)",
    "Mercurio en conjunción armoniosa con tus planetas de Aire en la Casa 11",
    "Júpiter expandiendo las oportunidades de networking en tu Casa 7",
    "Venus sintonizando energías de belleza y refinamiento en tu Casa 1",
    "Marte dando vigor físico en tu sector de salud y bienestar (Casa 6)"
  ],
  de: [
    "Mond transitiert durch Ihr 2. Haus (Materielle Ressourcen & Werte)",
    "Mond im Transit durch Ihr 5. Haus (Kreativität, Selbstausdruck und Romanzen)",
    "Saturn rückläufig berührt in günstigem Aspekt Ihre Himmelsmitte",
    "Sonne erleuchtet Ihr 9. Haus (Fortgeschrittene Studien und Wege des Schicksals)",
    "Merkur in harmonischer Konjunktion mit Ihren Luftplaneten im 11. Haus",
    "Jupiter erweitert die Networking-Möglichkeiten in Ihrem 7. Haus",
    "Venus stimmt Energien von Schönheit und Raffinesse in Ihrem 1. Haus ein",
    "Mars verleiht körperliche Kraft in Ihrem Gesundheits- und Wellnessbereich (6. Haus)"
  ],
  fr: [
    "Lune transitant par votre Maison 2 (Ressources Matérielles & Valeurs)",
    "Lune en transit par votre Maison 5 (Créativité, Auto-expression et Romances)",
    "Saturne rétrograde formant un aspect favorable avec votre Milieu du Ciel",
    "Soleil illuminant votre Maison 9 (Études Avancées et Chemins de Destinée)",
    "Mercure en conjonction harmonieuse avec vos planètes d'Air en Maison 11",
    "Jupiter élargissant les opportunités de réseautage dans votre Maison 7",
    "Vénus accordant des énergies de beauté et de raffinement dans votre Maison 1",
    "Mars apportant de la vigueur physique dans votre secteur de santé et bien-être (Maison 6)"
  ]
};

const TRANSLATED_PERSONALIZED_MESSAGES = (lang: string, userSunSign: string): string[] => {
  const translatedSign = TRANSLATED_SIGNS[lang]?.[userSunSign] || userSunSign;

  switch (lang) {
    case "en":
      return [
        `With your Sun in ${translatedSign}, the planetary alignment of the day accelerates your mental faculties of rapid analysis, favoring cutting out noisy expenses.`,
        `The astrological vibration invites you to find lucid silence in the middle of the daily news whirlwind, tuning into peaceful solutions.`,
        `The orbit of Venus supports your intimate relationships. It is an excellent day to emit loving words and plan wellness goals with the one you love.`,
        `The strength of your celestial tuning points towards consolidating the physical foundations of your routine, allowing you to materialize ideas without stress.`,
        `A day of fluid energy, ideal for settling mental dust in the fertile ground of clarity and self-knowledge.`
      ];
    case "es":
      return [
        `Con tu Sol en ${translatedSign}, la alineación planetaria del día acelera tus facultades mentales de análisis rápido, favoreciendo el recorte de gastos ruidosos.`,
        `La vibración astrológica te invita a encontrar un silencio lúcido en medio del torbellino de noticias diarias, sintonizando soluciones pacíficas.`,
        `La órbita de Venus apoya tus relaciones íntimas. Es un excelente día para emitir palabras afectuosas y planificar metas de bienestar con quien amas.`,
        `La fuerza de tu sintonización celeste apunta a consolidar las bases físicas de tu rutina, permitiéndote concretar ideas sin estrés.`,
        `Un día de energía floja, ideal para asentar el polvo mental en el suelo fértil de la claridad y el autoconocimiento.`
      ];
    case "de":
      return [
        `Mit Ihrer Sonne in ${translatedSign} beschleunigt die planetare Ausrichtung des Tages Ihre mentalen Fähigkeiten zur schnellen Analyse und begünstigt die Reduzierung störender Ausgaben.`,
        `Die astrologische Schwingung lädt Sie ein, inmitten des täglichen Nachrichtenwirbels eine klare Stille zu finden und friedliche Lösungen abzustimmen.`,
        `Die Umlaufbahn der Venus unterstützt Ihre intimen Beziehungen. Es ist ein hervorragender Tag, um liebevolle Worte zu sprechen und mit der Person, die Sie lieben, Wellnessziele zu planen.`,
        `Die Stärke Ihrer himmlischen Einstimmung weist darauf hin, die physischen Grundlagen Ihrer Routine zu festigen, sodass Sie Ideen stressfrei verwirklichen können.`,
        `Ein Tag fließender Energie, ideal, um den mentalen Staub auf dem fruchtbaren Boden von Klarheit und Selbsterkenntnis zu legen.`
      ];
    case "fr":
      return [
        `Avec votre Soleil en ${translatedSign}, l'alignement planétaire du jour accélère vos facultés mentales d'analyse rapide, favorisant la réduction des dépenses superflues.`,
        `La vibration astrologique vous invite à trouver un silence lucide au milieu du tourbillon des actualités quotidiennes, en s'accordant à des solutions pacifiques.`,
        `L'orbite de Vénus soutient vos relations intimes. C'est une excellente journée pour prononcer des paroles affectueuses et planifier des objectifs de bien-être avec la personne que vous aimez.`,
        `La force de votre accord céleste vise à consolider les bases physiques de votre routine, vous permettant de concrétiser vos idées sans stress.`,
        `Une journée d'énergie fluide, idéale pour déposer la poussière mentale sur le sol fertile de la clarté et de la connaissance de soi.`
      ];
    default:
      return [
        `Com seu Sol em ${translatedSign}, o alinhamento planetário do dia acelera suas faculdades mentais de análise rápida, favorecendo cortes de gastos ruidosos.`,
        `A vibração astrológica convida você a encontrar silêncio lúcido no meio do turbilhão de notícias diárias, sintonizando soluções pacíficas.`,
        `A órbita de Vênus apoia as suas relações íntimas. É um dia excelente para emitir oratórias carinhosas e planejar metas de bem-estar com quem você ama.`,
        `A força da sua sintonização celeste aponta para consolidar as bases físicas da sua rotina, permitindo a você concretizar ideias sem estresse.`,
        `Um dia de energia fluida, ideal para assentar as poeiras mentais no solo fértil da clareza e autoconhecimento.`
      ];
  }
};

function getSignIndex(signName: string): number {
  const signsPT = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
  const signsEN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const signsES = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
  const signsDE = ["Widder", "Stier", "Zwillinge", "Krebs", "Löwe", "Jungfrau", "Waage", "Skorpion", "Schütze", "Steinbock", "Wassermann", "Fische"];
  const signsFR = ["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagitaire", "Capricorne", "Verseau", "Poissons"];
  
  const clean = signName.trim();
  let idx = signsPT.indexOf(clean);
  if (idx !== -1) return idx;
  idx = signsEN.indexOf(clean);
  if (idx !== -1) return idx;
  idx = signsES.indexOf(clean);
  if (idx !== -1) return idx;
  idx = signsDE.indexOf(clean);
  if (idx !== -1) return idx;
  idx = signsFR.indexOf(clean);
  if (idx !== -1) return idx;
  
  const lower = clean.toLowerCase();
  const lists = [signsPT, signsEN, signsES, signsDE, signsFR];
  for (const list of lists) {
    const found = list.findIndex(s => s.toLowerCase() === lower);
    if (found !== -1) return found;
  }
  return 0;
}

function getAngularDistance(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2) % 360;
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

interface FoundAspect {
  transitPlanet: string;
  natalPlanet: string;
  aspectType: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil";
  diff: number;
}

function findAspects(
  transitPositions: Record<string, number>,
  natalPositions: Record<string, number>,
  isWider: boolean = false
): FoundAspect[] {
  const found: FoundAspect[] = [];
  const transitPlanets = Object.keys(transitPositions);
  const natalPlanets = Object.keys(natalPositions);
  
  const mult = isWider ? 2 : 1;
  const conjOrb = 8 * mult;
  const oppOrb = 8 * mult;
  const triOrb = 8 * mult;
  const quadOrb = 8 * mult;
  const sextOrb = 6 * mult;

  for (const tp of transitPlanets) {
    const tLon = transitPositions[tp];
    if (tLon === undefined) continue;
    
    for (const np of natalPlanets) {
      const nLon = natalPositions[np];
      if (nLon === undefined) continue;
      
      const dist = getAngularDistance(tLon, nLon);
      
      if (dist <= conjOrb) {
        found.push({ transitPlanet: tp, natalPlanet: np, aspectType: "Conjunção", diff: dist });
      } else if (Math.abs(dist - 180) <= oppOrb) {
        found.push({ transitPlanet: tp, natalPlanet: np, aspectType: "Oposição", diff: Math.abs(dist - 180) });
      } else if (Math.abs(dist - 120) <= triOrb) {
        found.push({ transitPlanet: tp, natalPlanet: np, aspectType: "Trígono", diff: Math.abs(dist - 120) });
      } else if (Math.abs(dist - 90) <= quadOrb) {
        found.push({ transitPlanet: tp, natalPlanet: np, aspectType: "Quadratura", diff: Math.abs(dist - 90) });
      } else if (Math.abs(dist - 60) <= sextOrb) {
        found.push({ transitPlanet: tp, natalPlanet: np, aspectType: "Sextil", diff: Math.abs(dist - 60) });
      }
    }
  }
  return found;
}

function findClosestAspectRegardlessOfOrb(
  transitPositions: Record<string, number>,
  natalPositions: Record<string, number>
): FoundAspect | null {
  const transitPlanets = Object.keys(transitPositions);
  const natalPlanets = Object.keys(natalPositions);
  let bestAspect: FoundAspect | null = null;
  let minDiff = 360;

  for (const tp of transitPlanets) {
    const tLon = transitPositions[tp];
    if (tLon === undefined) continue;
    
    for (const np of natalPlanets) {
      const nLon = natalPositions[np];
      if (nLon === undefined) continue;
      
      const dist = getAngularDistance(tLon, nLon);
      
      const aspects = [
        { type: "Conjunção" as const, diff: dist },
        { type: "Oposição" as const, diff: Math.abs(dist - 180) },
        { type: "Trígono" as const, diff: Math.abs(dist - 120) },
        { type: "Quadratura" as const, diff: Math.abs(dist - 90) },
        { type: "Sextil" as const, diff: Math.abs(dist - 60) }
      ];
      
      for (const asp of aspects) {
        if (asp.diff < minDiff) {
          minDiff = asp.diff;
          bestAspect = {
            transitPlanet: tp,
            natalPlanet: np,
            aspectType: asp.type,
            diff: asp.diff
          };
        }
      }
    }
  }
  return bestAspect;
}

const transitPositionsCache = new Map<string, Record<string, number> | null>();

function getTransitPositions(date: Date, latitude: number, longitude: number): Record<string, number> | null {
  const cacheKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
  if (transitPositionsCache.has(cacheKey)) {
    return transitPositionsCache.get(cacheKey)!;
  }
  try {
    const ephemResult = ephemeris.getAllPlanets(date, longitude, latitude);
    if (ephemResult && ephemResult.observed) {
      const mapping: Record<string, string> = {
        sun: "Sol",
        moon: "Lua",
        mercury: "Mercúrio",
        venus: "Vênus",
        mars: "Marte",
        jupiter: "Júpiter",
        saturn: "Saturno",
        uranus: "Urano",
        neptune: "Netuno",
        pluto: "Plutão",
        chiron: "Quíron"
      };
      
      const positions: Record<string, number> = {};
      for (const [key, planetName] of Object.entries(mapping)) {
        if (ephemResult.observed[key]) {
          positions[planetName] = ephemResult.observed[key].apparentLongitudeDd;
        }
      }
      transitPositionsCache.set(cacheKey, positions);
      return positions;
    }
  } catch (e) {
    console.error("Error calculating transit positions in engine:", e);
  }
  transitPositionsCache.set(cacheKey, null);
  return null;
}

// Localized mapping database for aspect interpretations
const ASPECT_MEANINGS: Record<string, Record<string, Record<string, string>>> = {
  pt: {
    "Conjunção": {
      general: "Funde energias de forma intensa, focando todo o poder criativo.",
      Sol: "Sua identidade está iluminada. Excelente dia para focar em objetivos pessoais.",
      Lua: "Eixo emocional ativo. Busque acolhimento interno e evite reações impulsivas.",
      Mercúrio: "Dia com mente ágil e ótima capacidade comunicativa.",
      Vênus: "Energia de beleza e amor fluindo intensamente. Conecte-se com carinho.",
      Marte: "Foco, ação e forte vigor físico para superar desafios.",
      Júpiter: "Expansão de horizontes e otimismo vibrante em alta.",
      Saturno: "Momento de estruturação e disciplina prática exemplar.",
      Urano: "Surgimento de insights revolucionários e novas perspectivas.",
      Netuno: "Elevada sensibilidade, conexão espiritual e inspiração.",
      Plutão: "Forte poder de regeneração interna e cura emocional profunda."
    },
    "Trígono": {
      general: "Sincronia fluida de dons e talentos naturais em ação.",
      Sol: "Vitalidade plena e sorte facilitada no dia a dia.",
      Lua: "Paz de espírito, harmonia emocional e relacionamentos felizes.",
      Mercúrio: "Diálogos excelentes, escrita criativa e facilidade de estudos.",
      Vênus: "Atração afetiva fluida, harmonia e sorte material espontânea.",
      Marte: "Ação vigorosa equilibrada, assertividade elegante e conquistas rápidas.",
      Júpiter: "Abundância espiritual e caminhos abertos de sorte e sabedoria.",
      Saturno: "Progresso seguro e apoio prático consistente em sua rotina.",
      Urano: "Soluções criativas que surgem com extrema espontaneidade.",
      Netuno: "Intuição sutil aguçada e sonhos altamente inspiradores.",
      Plutão: "Força de vontade inabalável para promover mudanças saudáveis."
    },
    "Sextil": {
      general: "Oportunidades criativas práticas que florescem com facilidade.",
      Sol: "Vitalidade plena e sorte facilitada no dia a dia.",
      Lua: "Paz de espírito, harmonia emocional e relacionamentos felizes.",
      Mercúrio: "Diálogos excelentes, escrita criativa e facilidade de estudos.",
      Vênus: "Atração afetiva fluida, harmonia e sorte material espontânea.",
      Marte: "Ação vigorosa equilibrada, assertividade elegante e conquistas rápidas.",
      Júpiter: "Abundância espiritual e caminhos abertos de sorte e sabedoria.",
      Saturno: "Progresso seguro e apoio prático consistente em sua rotina.",
      Urano: "Soluções criativas que surgem com extrema espontaneidade.",
      Netuno: "Intuição sutil aguçada e sonhos altamente inspiradores.",
      Plutão: "Força de vontade inabalável para promover mudanças saudáveis."
    },
    "Quadratura": {
      general: "Fricção produtiva que exige tomadas de decisão firmes e pacientes.",
      Sol: "Desafios de ego ou vitalidade baixa. Busque equilíbrio e paciência.",
      Lua: "Flutuação de humor e fricção interna. Evite compras e discussões.",
      Mercúrio: "Dispersão mental ou falhas de comunicação. Revise contratos.",
      Vênus: "Insegurança afetiva ou vaidade. Evite gastos impulsivos.",
      Marte: "Tensão acumulada e pressa. Canalize a energia em esportes.",
      Júpiter: "Otimismo exagerado que pode gerar excessos. Pondere decisões.",
      Saturno: "Sensação de cobrança ou obstáculos na rotina. Seja persistente.",
      Urano: "Impaciência e desejo rebelde de mudanças bruscas. Vá com calma.",
      Netuno: "Confusão ou ilusões temporárias. Busque clareza objetiva.",
      Plutão: "Disputas de controle ou obsessões. Pratique o desapego saudável."
    },
    "Oposição": {
      general: "Polarização produtiva que convida a conciliar pontos de vista.",
      Sol: "Necessidade de conciliar seu brilho próprio com o espaço alheio.",
      Lua: "Busca de estabilidade entre suas necessidades e as do outro.",
      Mercúrio: "Negociações que exigem flexibilidade mental e escuta ativa.",
      Vênus: "Ajustes necessários em parcerias e acordos financeiros de valor.",
      Marte: "Pondere o ritmo alheio antes de agir de forma impetuosa.",
      Júpiter: "Evite promessas exageradas e foque em metas reais.",
      Saturno: "Responsabilidades externas exigindo estruturação madura.",
      Urano: "Equilibre seu anseio por novidade com compromissos assumidos.",
      Netuno: "Pratique o realismo sem perder sua sensibilidade inspiradora.",
      Plutão: "Excelente momento para superar antigos ressentimentos kármicos."
    }
  },
  en: {
    "Conjunção": {
      general: "Intensely fuses energies, focusing all creative power.",
      Sol: "Your identity is illuminated. Excellent day to focus on personal goals.",
      Lua: "Emotional axis active. Seek internal comfort and avoid impulsive reactions.",
      Mercúrio: "Day with an agile mind and great communicative ability.",
      Vênus: "Energy of beauty and love flowing intensely. Connect with affection.",
      Marte: "Focus, action, and strong physical vigor to overcome challenges.",
      Júpiter: "Expansion of horizons and vibrant optimism on the rise.",
      Saturno: "Moment of structuring and exemplary practical discipline.",
      Urano: "Emergence of revolutionary insights and new perspectives.",
      Netuno: "High sensitivity, spiritual connection, and inspiration.",
      Plutão: "Strong power of internal regeneration and deep emotional healing."
    },
    "Trígono": {
      general: "Fluid synchrony of natural gifts and talents in action.",
      Sol: "Full vitality and facilitated luck in daily life.",
      Lua: "Peace of mind, emotional harmony, and happy relationships.",
      Mercúrio: "Excellent dialogues, creative writing, and ease of study.",
      Vênus: "Fluid affective attraction, harmony, and spontaneous material luck.",
      Marte: "Balanced vigorous action, elegant assertiveness, and quick achievements.",
      Júpiter: "Spiritual abundance and open paths of luck and wisdom.",
      Saturno: "Secure progress and consistent practical support in your routine.",
      Urano: "Creative solutions that arise with extreme spontaneity.",
      Netuno: "Sharpened subtle intuition and highly inspiring dreams.",
      Plutão: "Unshakeable willpower to promote healthy changes."
    },
    "Sextil": {
      general: "Practical creative opportunities that flourish easily.",
      Sol: "Full vitality and facilitated luck in daily life.",
      Lua: "Peace of mind, emotional harmony, and happy relationships.",
      Mercúrio: "Excellent dialogues, creative writing, and ease of study.",
      Vênus: "Fluid affective attraction, harmony, and spontaneous material luck.",
      Marte: "Balanced vigorous action, elegant assertiveness, and quick achievements.",
      Júpiter: "Spiritual abundance and open paths of luck and wisdom.",
      Saturno: "Secure progress and consistent practical support in your routine.",
      Urano: "Creative solutions that arise with extreme spontaneity.",
      Netuno: "Sharpened subtle intuition and highly inspiring dreams.",
      Plutão: "Unshakeable willpower to promote healthy changes."
    },
    "Quadratura": {
      general: "Productive friction that demands firm and patient decisions.",
      Sol: "Ego challenges or low vitality. Seek balance and patience.",
      Lua: "Mood swings and internal friction. Avoid shopping and arguments.",
      Mercúrio: "Mental dispersion or communication failures. Review contracts.",
      Vênus: "Emotional insecurity or vanity. Avoid impulse spending.",
      Marte: "Accumulated tension and rush. Channel energy in sports.",
      Júpiter: "Exaggerated optimism that can generate excess. Ponder decisions.",
      Saturno: "Feeling of demand or obstacles in the routine. Be persistent.",
      Urano: "Impatience and rebellious desire for sudden changes. Take it easy.",
      Netuno: "Confusion or temporary illusions. Seek objective clarity.",
      Plutão: "Control disputes or obsessions. Practice healthy letting go."
    },
    "Oposição": {
      general: "Productive polarization that invites reconciling points of view.",
      Sol: "Need to reconcile your own shine with others' space.",
      Lua: "Search for stability between your needs and the other's.",
      Mercúrio: "Negotiations that require mental flexibility and active listening.",
      Vênus: "Necessary adjustments in partnerships and financial agreements.",
      Marte: "Ponder others' rhythm before acting impetuously.",
      Júpiter: "Avoid exaggerated promises and focus on real goals.",
      Saturno: "External responsibilities demanding mature structuring.",
      Urano: "Balance your yearning for novelty with committed engagements.",
      Netuno: "Practice realism without losing your inspiring sensitivity.",
      Plutão: "Excellent time to overcome old karmic resentments."
    }
  },
  es: {
    "Conjunção": {
      general: "Fusiona intensamente energías, enfocando todo el poder creativo.",
      Sol: "Tu identidad está iluminada. Excelente día para enfocarte en metas personales.",
      Lua: "Eje emocional activo. Busca refugio interno y evita reacciones impulsivas.",
      Mercúrio: "Día con mente ágil y gran capacidad comunicativa.",
      Vênus: "Energía de belleza y amor fluyendo intensamente. Conéctate con cariño.",
      Marte: "Enfoque, acción y fuerte vigor físico para superar desafíos.",
      Júpiter: "Expansión de horizontes y optimismo vibrante en alza.",
      Saturno: "Momento de estructuración y disciplina práctica ejemplar.",
      Urano: "Surgimiento de ideas revolucionarias y nuevas perspectivas.",
      Netuno: "Elevada sensibilidad, conexión espiritual e inspiración.",
      Plutão: "Fuerte poder de regeneración interna y curación emocional profunda."
    },
    "Trígono": {
      general: "Sincronía fluida de dones y talentos naturales en acción.",
      Sol: "Vitalidad plena y suerte facilitada en el día a día.",
      Lua: "Paz mental, armonía emocional y relaciones felices.",
      Mercúrio: "Diálogos excelentes, escritura creativa y facilidad de estudios.",
      Vênus: "Atracción afectiva fluida, armonía y suerte material espontánea.",
      Marte: "Acción vigorosa equilibrada, asertividad elegante y logros rápidos.",
      Júpiter: "Abundancia espiritual y caminos abiertos de suerte y sabiduría.",
      Saturno: "Progreso seguro y apoyo práctico consistente en tu rutina.",
      Urano: "Soluciones creativas que surgen con extrema espontaneidad.",
      Netuno: "Intuición sutil aguzada y sueños altamente inspiradores.",
      Plutão: "Fuerza de voluntad inquebrantable para promover cambios saludables."
    },
    "Sextil": {
      general: "Oportunidades creativas prácticas que florecen con facilidad.",
      Sol: "Vitalidad plena y suerte facilitada en el día a día.",
      Lua: "Paz de espíritu, armonía emocional y relaciones felices.",
      Mercúrio: "Diálogos excelentes, escritura creativa y facilidad de estudios.",
      Vênus: "Atracción afectiva fluida, armonía y suerte material espontánea.",
      Marte: "Acción vigorosa equilibrada, asertividad elegante y logros rápidos.",
      Júpiter: "Abundancia espiritual y caminos abiertos de suerte y sabiduría.",
      Saturno: "Progreso seguro y apoyo práctico consistente en tu rutina.",
      Urano: "Soluciones creativas que surgen con extrema espontaneidad.",
      Netuno: "Intuición sutil aguzada y sueños altamente inspiradores.",
      Plutão: "Fuerza de voluntad inquebrantable para promover cambios saludables."
    },
    "Quadratura": {
      general: "Fricción productiva que exige toma de decisiones firmes y pacientes.",
      Sol: "Desafíos de ego o vitalidad baja. Busca equilibrio y paciencia.",
      Lua: "Fluctuaciones de humor y fricción interna. Evita compras y discusiones.",
      Mercúrio: "Dispersión mental o fallas de comunicación. Revisa contratos.",
      Vênus: "Inseguridad afectiva o vanidad. Evita gastos impulsivos.",
      Marte: "Tensión acumulada y prisa. Canaliza la energía en deportes.",
      Júpiter: "Optimismo exagerado que puede generar excesos. Pondera decisiones.",
      Saturno: "Sensación de exigencia o impedimentos en la rutina. Sé persistente.",
      Urano: "Impaciencia y deseo rebelde de cambios bruscos. Ve con calma.",
      Netuno: "Confusión o ilusiones temporales. Busca claridad objetiva.",
      Plutão: "Disputas de control o obsesiones. Practica el desapego saludable."
    },
    "Oposição": {
      general: "Polarización productiva que invita a conciliar puntos de vista.",
      Sol: "Necesidad de conciliar tu propio brillo con el espacio ajeno.",
      Lua: "Búsqueda de estabilidad entre tus necesidades y las del otro.",
      Mercúrio: "Negociaciones que exigen flexibilidad mental y escucha activa.",
      Vênus: "Ajustes necesarios en asociaciones y acuerdos financieros de valor.",
      Marte: "Pondera el ritmo ajeno antes de actuar de forma impetuosa.",
      Júpiter: "Evita promesas exageradas y enfócate en metas reales.",
      Saturno: "Responsabilidades externas exigiendo estructuración madura.",
      Urano: "Equilibra tu ansia de novedad con compromisos asumidos.",
      Netuno: "Practica el realismo sin perder tu sensibilidad inspiradora.",
      Plutão: "Excelente momento para superar antiguos resentimientos kármicos."
    }
  },
  de: {
    "Conjunção": {
      general: "Verschmilzt Energien intensiv und fokussiert die gesamte kreative Kraft.",
      Sol: "Ihre Identität ist erleuchtet. Hervorragender Tag, um sich auf persönliche Ziele zu konzentrieren.",
      Lua: "Emotionales Zentrum aktiv. Suchen Sie innere Ruhe und vermeiden Sie impulsive Reaktionen.",
      Mercúrio: "Tag mit flinkem Verstand und hervorragenden Kommunikationsfähigkeiten.",
      Vênus: "Schönheit und Liebe fließen intensiv. Verbinden Sie sich mit Zuneigung.",
      Marte: "Fokus, Aktion und starke körperliche Kraft, um Herausforderungen zu meistern.",
      Júpiter: "Horizonterweiterung und aufstrebender lebendiger Optimismus.",
      Saturno: "Moment der Strukturierung und vorbildlichen praktischen Disziplin.",
      Urano: "Entstehung revolutionärer Einsichten und neuer Perspektiven.",
      Netuno: "Hohe Sensibilität, spirituelle Verbindung und Inspiration.",
      Plutão: "Starke Kraft zur inneren Regeneration und tiefen emotionalen Heilung."
    },
    "Trígono": {
      general: "Fließende Synchronität natürlicher Gaben und Talente in Aktion.",
      Sol: "Volle Vitalität und erleichtertes Glück im Alltag.",
      Lua: "Seelenfrieden, emotionale Harmonie und glückliche Beziehungen.",
      Mercúrio: "Hervorragende Dialoge, kreatives Schreiben und einfaches Lernen.",
      Vênus: "Fließende emotionale Anziehung, Harmonie und spontanes materielles Glück.",
      Marte: "Ausgewogene kraftvolle Aktion, elegante Durchsetzungsfähigkeit und schnelle Erfolge.",
      Júpiter: "Spirituelle Fülle und offene Wege des Glücks und der Weisheit.",
      Saturno: "Sicherer Fortschritt und konsistente praktische Unterstützung im Alltag.",
      Urano: "Kreative Lösungen, die mit extremer Spontaneität entstehen.",
      Netuno: "Geschärfte feine Intuition und hochgradig inspirierende Träume.",
      Plutão: "Unerschütterliche Willenskraft zur Förderung gesunder Veränderungen."
    },
    "Sextil": {
      general: "Praktische kreative Möglichkeiten, die leicht aufblühen.",
      Sol: "Volle Vitalität und erleichtertes Glück im Alltag.",
      Lua: "Seelenfrieden, emotionale Harmonie und glückliche Beziehungen.",
      Mercúrio: "Hervorragende Dialoge, kreatives Schreiben und einfaches Lernen.",
      Vênus: "Fließende emotionale Anziehung, Harmonie und spontanes materielles Glück.",
      Marte: "Ausgewogene kraftvolle Aktion, elegante Durchsetzungsfähigkeit und schnelle Erfolge.",
      Júpiter: "Spirituelle Fülle und offene Wege des Glücks und der Weisheit.",
      Saturno: "Sicherer Fortschritt und konsistente praktische Unterstützung im Alltag.",
      Urano: "Kreative Lösungen, die mit extremer Spontaneität entstehen.",
      Netuno: "Geschärfte feine Intuition und hochgradig inspirierende Träume.",
      Plutão: "Unerschütterliche Willenskraft zur Förderung gesunder Veränderungen."
    },
    "Quadratura": {
      general: "Produktive Reibung, die feste und geduldige Entscheidungen erfordert.",
      Sol: "Herausforderungen des Egos oder geringe Vitalität. Suchen Sie Gleichgewicht und Geduld.",
      Lua: "Stimmungsschwankungen und innere Reibung. Vermeiden Sie Einkäufe und Streitigkeiten.",
      Mercúrio: "Mentale Zerstreuung oder Kommunikationsfehler. Verträge überprüfen.",
      Vênus: "Emotionale Unsicherheit oder Eitelkeit. Impulskäufe vermeiden.",
      Marte: "Angestaute Spannung und Eile. Energie beim Sport kanalisieren.",
      Júpiter: "Übertriebener Optimismus, der zu Exzessen führen kann. Entscheidungen abwägen.",
      Saturno: "Gefühl der Überforderung oder Hindernisse im Alltag. Seien Sie beharrlich.",
      Urano: "Ungeduld und rebellischer Wunsch nach plötzlichen Veränderungen. Gehen Sie es ruhig an.",
      Netuno: "Verwirrung oder vorübergehende Illusionen. Suchen Sie objektive Klarheit.",
      Plutão: "Machtkämpfe oder Obsessionen. Üben Sie sich in gesundem Loslassen."
    },
    "Oposição": {
      general: "Produktive Polarisierung, die dazu einlädt, Standpunkte auszugleichen.",
      Sol: "Notwendigkeit, Ihren eigenen Glanz mit dem Raum anderer in Einklang zu bringen.",
      Lua: "Suche nach Stabilität zwischen Ihren Bedürfnissen und denen des anderen.",
      Mercúrio: "Verhandlungen, die mentale Flexibilität und aktives Zuhören erfordern.",
      Vênus: "Notwendige Anpassungen in Partnerschaften und wertvollen Finanzabkommen.",
      Marte: "Wägen Sie das Tempo anderer ab, bevor Sie ungestüm handeln.",
      Júpiter: "Vermeiden Sie übertriebene Versprechungen und konzentrieren Sie sich auf reale Ziele.",
      Saturno: "Externe Verantwortlichkeiten, die eine reife Strukturierung erfordern.",
      Urano: "Bringen Sie Ihre Sehnsucht nach Neuem mit eingegangenen Verpflichtungen in Einklang.",
      Netuno: "Üben Sie Realismus, ohne Ihre inspirierende Sensibilität zu verlieren.",
      Plutão: "Hervorragende Zeit, um alte karmische Grollgefühle zu überwinden."
    }
  },
  fr: {
    "Conjunção": {
      general: "Fusionne intensément les énergies, concentrant tout le pouvoir créatif.",
      Sol: "Votre identité est illuminée. Excellente journée pour vous concentrer sur des objectifs personnels.",
      Lua: "Axe émotionnel actif. Cherchez le réconfort interne et évitez les réactions impulsives.",
      Mercúrio: "Journée d'esprit agile et de grande capacité de communication.",
      Vênus: "Énergie de beauté et d'amour coulant intensément. Connectez-vous avec affection.",
      Marte: "Concentration, action et forte vigueur physique pour surmonter les défis.",
      Júpiter: "Expansion des horizons et optimisme vibrant à la hausse.",
      Saturno: "Moment de structuration et discipline pratique exemplaire.",
      Urano: "Émergence d'idées révolutionnaires et de nouvelles perspectives.",
      Netuno: "Sensibilité élevée, connexion spirituelle et inspiration.",
      Plutão: "Fort pouvoir de régénération interne et de guérison émotionnelle profonde."
    },
    "Trígono": {
      general: "Synchronisme fluide des dons et talents naturels en action.",
      Sol: "Pleine vitalité et chance facilitée au quotidien.",
      Lua: "Tranquillité d'esprit, harmonie émotionnelle et relations heureuses.",
      Mercúrio: "Discussions excellentes, écriture créative et facilité d'étude.",
      Vênus: "Attraction affective fluide, harmonie et chance matérielle spontanée.",
      Marte: "Action vigoureuse équilibrée, assertivité élégante et réussites rapides.",
      Júpiter: "Abondance spirituelle et voies ouvertes de chance et de sagesse.",
      Saturno: "Progrès sûr et soutien pratique cohérent dans votre routine.",
      Urano: "Solutions créatives qui surgissent avec une extrême spontanéité.",
      Netuno: "Intuition subtile aiguisée et rêves hautement inspirants.",
      Plutão: "Volonté inébranlable de promouvoir des changements sains."
    },
    "Sextil": {
      general: "Opportunités créatives pratiques qui s'épanouissent facilement.",
      Sol: "Pleine vitalité et chance facilitée au quotidien.",
      Lua: "Tranquillité d'esprit, harmonie émotionnelle et relations heureuses.",
      Mercúrio: "Discussions excellentes, écriture créative et facilité d'étude.",
      Vênus: "Attraction affective fluide, harmonie et chance matérielle spontanée.",
      Marte: "Action vigoureuse équilibrée, assertivité élégante et réussites rapides.",
      Júpiter: "Abondance spirituelle et voies ouvertes de chance et de sagesse.",
      Saturno: "Progrès sûr et soutien pratique cohérent dans votre routine.",
      Urano: "Solutions créatives qui surgissent avec une extrême spontanéité.",
      Netuno: "Intuition subtile aiguisée et rêves hautement inspirants.",
      Plutão: "Volonté inébranlable de promouvoir des changements sains."
    },
    "Quadratura": {
      general: "Friction productive qui exige de prendre des décisions fermes et patientes.",
      Sol: "Défis d'ego ou vitalité basse. Cherchez l'équilibre et la patience.",
      Lua: "Fluctuations de l'humeur et friction interne. Évitez les achats et disputes.",
      Mercúrio: "Dispersion mentale ou échecs de communication. Révisez les contrats.",
      Vênus: "Insécurité affective ou vanité. Évitez les dépenses impulsives.",
      Marte: "Tension accumulée et précipitation. Canalisez l'énergie dans le sport.",
      Júpiter: "Optimisme exagéré pouvant générer des excès. Pesez les décisions.",
      Saturno: "Sensation d'exigence ou d'obstacles dans la routine. Soyez persévérant.",
      Urano: "Impatience et désir rebelle de changements brusques. Allez-y doucement.",
      Netuno: "Confusion ou illusions temporaires. Cherchez la clarté objective.",
      Plutão: "Disputes de pouvoir ou obsessions. Pratiquez le lâcher-prise sain."
    },
    "Oposição": {
      general: "Polarisation productive invitant à concilier les points de vue.",
      Sol: "Besoin de concilier votre propre éclat avec l'espace d'autrui.",
      Lua: "Recherche de stabilité entre vos besoins et ceux de l'autre.",
      Mercúrio: "Négociations qui exigent de la flexibilité mentale et une écoute active.",
      Vênus: "Ajustements nécessaires dans les partenariats et les accords financiers.",
      Marte: "Pesez le rythme d'autrui avant d'agir de manière impétueuse.",
      Júpiter: "Évitez les promesses exagérées et concentrez-vous sur des objectifs réels.",
      Saturno: "Responsabilités externes exigeant une structuration mature.",
      Urano: "Équilibrez votre désir de nouveauté avec les engagements pris.",
      Netuno: "Pratiquez le réalisme sans perdre votre sensibilité inspirante.",
      Plutão: "Excellent moment pour surmonter d'anciens ressentiments karmiques."
    }
  }
};

const PLANET_ENERGY_TEMPLATES: Record<string, Record<string, any>> = {
  pt: {
    "Sol": { energy: "Vitalidade e Brilho Pessoal", opp: "Oportunidade de liderar e expressar sua verdade com clareza.", chal: "Cuidado para não deixar o orgulho ou o ego atrapalharem diálogos.", adv: "use sua energia criativa para iniciar novos projetos." },
    "Lua": { energy: "Intuição e Conexão Emocional", opp: "Momento ideal para acolher seus sentimentos e cuidar da sua paz.", chal: "Evite reagir impulsivamente a estímulos emocionais externos.", adv: "reserve 10 minutos para respirar fundo e meditar em silêncio." },
    "Mercúrio": { energy: "Agilidade Mental e Comunicação", opp: "Perfeito para negociar, escrever e resolver pendências burocráticas.", chal: "Evite dispersão de pensamentos e mal-entendidos nas mensagens.", adv: "escreva suas ideias prioritárias no papel antes de agir." },
    "Vênus": { energy: "Harmonia e Atração Afetiva", opp: "Sincronia de amor e beleza. Ótimo dia para se cuidar e se conectar com carinho.", chal: "Evite compras excessivas por impulso emocional ou vaidade.", adv: "expresse gratidão sincera a alguém especial hoje." },
    "Marte": { energy: "Foco, Ação e Vigor Físico", opp: "Coragem extra para enfrentar desafios e tomar decisões firmes.", chal: "Cuidado com a impaciência ou reações agressivas com os outros.", adv: "canalize sua energia através de exercícios físicos ou caminhadas." },
    "Júpiter": { energy: "Expansão, Sabedoria e Oportunidades", opp: "Abertura de caminhos, sorte em parcerias e otimismo renovador.", chal: "Atenção ao excesso de confiança ou extravagância financeira.", adv: "estude algo novo ou compartilhe seu conhecimento com generosidade." },
    "Saturno": { energy: "Disciplina, Estrutura e Maturidade", opp: "Excelente para consolidar planos de longo prazo e organizar rotinas.", chal: "Não se deixe abater por sentimentos de cobrança ou cobranças externas.", adv: "resolva pendências de forma prática e realista." },
    "Urano": { energy: "Inovação, Liberdade e Insights", opp: "Ideias revolucionárias e quebra benéfica de hábitos limitantes.", chal: "Evite impulsividade rebelde ou impaciência com métodos tradicionais.", adv: "experimente fazer algo rotineiro de uma forma totalmente nova hoje." },
    "Netuno": { energy: "Sensibilidade e Inspiração Cósmica", opp: "Conexão espiritual profunda, sonhos reveladores e inspiração artística.", chal: "Cuidado com ilusões, idealismo excessivo ou falta de realismo.", adv: "dedique um tempo para escrever seus sonhos ou ouvir música relaxante." },
    "Plutão": { energy: "Poder de Cura e Renovação Profunda", opp: "Oportunidade para desapegar do que não serve mais e se fortalecer intimamente.", chal: "Evite disputas de controle ou obsessões com pequenos detalhes.", adv: "elimine uma pendência antiga ou limpe seu espaço físico." }
  },
  en: {
    "Sol": { energy: "Vitality and Personal Radiance", opp: "Opportunity to lead and express your truth clearly.", chal: "Be careful not to let pride or ego get in the way of dialogues.", adv: "use your creative energy to start new projects." },
    "Lua": { energy: "Intuition and Emotional Connection", opp: "Ideal moment to embrace your feelings and care for your peace.", chal: "Avoid reacting impulsively to external emotional stimuli.", adv: "set aside 10 minutes to breathe deeply and meditate in silence." },
    "Mercúrio": { energy: "Mental Agility and Communication", opp: "Perfect for negotiating, writing, and resolving bureaucratic tasks.", chal: "Avoid scattered thoughts and misunderstandings in messages.", adv: "write down your priority ideas on paper before acting." },
    "Vênus": { energy: "Harmony and Emotional Attraction", opp: "Synchronicity of love and beauty. Great day to self-care and connect lovingly.", chal: "Avoid excessive purchases due to emotional impulse or vanity.", adv: "express sincere gratitude to someone special today." },
    "Marte": { energy: "Focus, Action, and Physical Vigor", opp: "Extra courage to face challenges and make firm decisions.", chal: "Be careful with impatience or aggressive reactions with others.", adv: "channel your energy through physical exercise or walks." },
    "Júpiter": { energy: "Expansion, Wisdom, and Opportunities", opp: "Opening of paths, luck in partnerships, and renewing optimism.", chal: "Watch out for overconfidence or financial extravagance.", adv: "study something new or share your knowledge generously." },
    "Saturno": { energy: "Discipline, Structure, and Maturity", opp: "Excellent for consolidating long-term plans and organizing routines.", chal: "Do not let yourself be discouraged by feelings of demand or external pressure.", adv: "resolve pending tasks in a practical and realistic way." },
    "Urano": { energy: "Innovation, Freedom, and Insights", opp: "Revolutionary ideas and beneficial breaking of limiting habits.", chal: "Avoid rebellious impulsiveness or impatience with traditional methods.", adv: "try doing something routine in a completely new way today." },
    "Netuno": { energy: "Sensitivity and Cosmic Inspiration", opp: "Deep spiritual connection, revealing dreams, and artistic inspiration.", chal: "Beware of illusions, excessive idealism, or lack of realism.", adv: "dedicate some time to write down your dreams or listen to relaxing music." },
    "Plutão": { energy: "Healing Power and Deep Renewal", opp: "Opportunity to let go of what no longer serves and strengthen yourself intimately.", chal: "Avoid control disputes or obsessions with minor details.", adv: "clear an old pending task or clean your physical space." }
  },
  es: {
    "Sol": { energy: "Vitalidad y Brillo Personal", opp: "Oportunidad de liderar y expresar tu verdad con claridad.", chal: "Cuidado de no dejar que el orgullo o el ego entorpezcan los diálogos.", adv: "usa tu energía creativa para iniciar nuevos proyectos." },
    "Lua": { energy: "Intuición y Conexión Emocional", opp: "Momento ideal para acoger tus sentimientos y cuidar tu paz.", chal: "Evita reaccionar impulsivamente a estímulos emocionales externos.", adv: "reserva 10 minutos para respirar hondo y meditar en silencio." },
    "Mercúrio": { energy: "Agilidad Mental y Comunicación", opp: "Perfecto para negociar, escribir y resolver pendientes burocráticos.", chal: "Evita la dispersión de pensamientos y malentendidos en los mensajes.", adv: "escribe tus ideas prioritarias en papel antes de actuar." },
    "Vênus": { energy: "Armonía y Atracción Afectiva", opp: "Sincronía de amor y belleza. Gran día para cuidarse y conectarse con cariño.", chal: "Evita compras excesivas por impulso emocional o vanidad.", adv: "expresa gratitud sincera a alguien especial hoy." },
    "Marte": { energy: "Enfoque, Acción y Vigor Físico", opp: "Coraje extra para enfrentar desafíos y tomar decisiones firmes.", chal: "Cuidado con la impaciencia o reacciones agresivas con los demás.", adv: "canaliza tu energía a través de ejercicios físicos o caminatas." },
    "Júpiter": { energy: "Expansión, Sabiduría y Oportunidades", opp: "Apertura de caminos, suerte en asociaciones y optimismo renovador.", chal: "Atención al exceso de confianza o extravagancia financiera.", adv: "estudia algo nuevo o comparte tu conocimiento con generosidad." },
    "Saturno": { energy: "Disciplina, Estructura y Madurez", opp: "Excelente para consolidar planes a largo plazo y organizar rutinas.", chal: "No te dejes abatir por sentimientos de autoexigencia o presiones externas.", adv: "resuelve pendientes de forma práctica y realista." },
    "Urano": { energy: "Innovación, Libertad e Insights", opp: "Ideas revolucionarias y ruptura beneficiosa de hábitos limitantes.", chal: "Evita la impulsividad rebelde o la impaciencia con métodos tradicionales.", adv: "intenta hacer algo rutinario de una forma totalmente nueva hoy." },
    "Netuno": { energy: "Sensibilidad e Inspiración Cósmica", opp: "Conexión espiritual profunda, sueños reveladores e inspiración artística.", chal: "Cuidado con ilusiones, idealismo excesivo o falta de realismo.", adv: "dedica un tiempo a escribir tus sueños o escuchar música relajante." },
    "Plutão": { energy: "Poder de Sanación y Renovación Profunda", opp: "Oportunidad para soltar lo que ya no sirve y fortalecerse íntimamente.", chal: "Evita disputas de control o obsesiones con pequeños detalles.", adv: "elimina un pendiente antiguo o limpia tu espacio físico." }
  },
  de: {
    "Sol": { energy: "Vitalität und Persönlicher Glanz", opp: "Gelegenheit, Ihre Wahrheit klar zu führen und auszudrücken.", chal: "Achten Sie darauf, dass Stolz oder Ego Dialogen nicht im Weg stehen.", adv: "nutzen Sie Ihre kreative Energie, um neue Projekte zu starten." },
    "Lua": { energy: "Intuition und Emotionale Verbindung", opp: "Idealer Moment, um Ihre Gefühle anzunehmen und für Ihren Frieden zu sorgen.", chal: "Vermeiden Sie es, impulsiv auf externe emotionale Reize zu reagieren.", adv: "nehmen Sie sich 10 Minuten Zeit, um tief durchzuatmen und in Stille zu meditieren." },
    "Mercúrio": { energy: "Mentale Beweglichkeit und Kommunikation", opp: "Perfekt zum Verhandeln, Schreiben und Klären bürokratischer Aufgaben.", chal: "Vermeiden Sie Gedankenzerstreuung und Missverständnisse in Nachrichten.", adv: "schreiben Sie Ihre vorrangigen Ideen auf Papier auf, bevor Sie handeln." },
    "Vênus": { energy: "Harmonie und Emotionale Anziehung", opp: "Synchronizität von Liebe und Schönheit. Ein großartiger Tag zur Selbstfürsorge und liebevollen Verbindung.", chal: "Vermeiden Sie übermäßige Einkäufe aus emotionalem Impuls oder Eitelkeit.", adv: "drücken Sie heute jemandem, der Ihnen wichtig ist, aufrichtige Dankbarkeit aus." },
    "Marte": { energy: "Fokus, Aktion und Körperliche Kraft", opp: "Zusätzlicher Mut, sich Herausforderungen zu stellen und feste Entscheidungen zu treffen.", chal: "Achten Sie auf Ungeduld oder aggressive Reaktionen gegenüber anderen.", adv: "kanalisieren Sie Ihre Energie durch körperliche Bewegung oder Spaziergänge." },
    "Júpiter": { energy: "Expansion, Weisheit und Gelegenheiten", opp: "Wegöffnung, Glück in Partnerschaften und erneuernder Optimismus.", chal: "Achten Sie auf übermäßiges Vertrauen oder finanzielle Extravaganz.", adv: "lernen Sie etwas Neues oder teilen Sie Ihr Wissen großzügig." },
    "Saturno": { energy: "Disziplin, Struktur und Reife", opp: "Hervorragend geeignet, um langfristige Pläne zu festigen und Routinen zu organisieren.", chal: "Lassen Sie sich nicht von Gefühlen der Überforderung oder externem Druck entmutigen.", adv: "lösen Sie offene Aufgaben praktisch und realistisch." },
    "Urano": { energy: "Innovation, Freiheit und Erkenntnisse", opp: "Revolutionäre Ideen und vorteilhafter Ausbruch aus einschränkenden Gewohnheiten.", chal: "Vermeiden Sie rebellische Impulsivität oder Ungeduld mit traditionellen Methoden.", adv: "versuchen Sie heute, etwas Alltägliches auf eine völlig neue Art und Weise zu tun." },
    "Netuno": { energy: "Sensibilität und Kosmische Inspiration", opp: "Tiefe spirituelle Verbindung, enthüllende Träume und künstlerische Inspiration.", chal: "Achten Sie auf Illusionen, übermäßigen Idealismus oder mangelnden Realismus.", adv: "nehmen Sie sich Zeit, um Ihre Träume aufzuschreiben oder entspannende Musik zu hören." },
    "Plutão": { energy: "Heilkraft und Tiefe Erneuerung", opp: "Gelegenheit, loszulassen, was nicht mehr dient, und sich innerlich zu stärken.", chal: "Vermeiden Sie Kontrollstreitigkeiten oder Besessenheit mit kleinen Details.", adv: "erledigen Sie eine alte offene Aufgabe oder reinigen Sie Ihren physischen Raum." }
  },
  fr: {
    "Sol": { energy: "Vitalité et Éclat Personnel", opp: "Opportunité de diriger et d'exprimer votre vérité avec clarté.", chal: "Attention à ne pas laisser la fierté ou l'ego entraver les dialogues.", adv: "utilisez votre énergie créative pour lancer de nouveaux projets." },
    "Lua": { energy: "Intuition et Connexion Émotionnelle", opp: "Moment idéal pour accueillir vos sentiments et veiller sur votre paix.", chal: "Évitez de réagir impulsivement aux stimuli émotionnels externes.", adv: "réservez 10 minutes pour respirer profondément et méditer en silence." },
    "Mercúrio": { energy: "Agilité Mentale et Communication", opp: "Parfait pour négocier, écrire et résoudre les tâches bureaucratiques.", chal: "Évitiez la dispersion des pensées et les malentendus dans les messages.", adv: "écrivez vos idées prioritaires sur papier avant d'agir." },
    "Vênus": { energy: "Harmonie et Attraction Affective", opp: "Synchronisme d'amour et de beauté. Excellente journée pour prendre soin de soi et se connecter affectueusement.", chal: "Évitez les achats excessifs par impulsion émotionnelle ou vanité.", adv: "exprimez une gratitude sincère à quelqu'un de spécial aujourd'hui." },
    "Marte": { energy: "Focus, Action et Vigueur Physique", opp: "Courage supplémentaire pour relever les défis et prendre des décisions fermes.", chal: "Attention à l'impatience ou aux réactions agressives envers les autres.", adv: "canalisez votre énergie par des exercices physiques ou de la marche." },
    "Júpiter": { energy: "Expansion, Sagesse et Opportunités", opp: "Ouverture de voies, chance dans les partenariats et optimisme renouvelé.", chal: "Attention à l'excès de confiance ou à l'extravagance financière.", adv: "étudiez quelque chose de nouveau ou partagez vos connaissances avec générosité." },
    "Saturno": { energy: "Discipline, Structure et Maturité", opp: "Excellent pour consolider les plans à long terme et organiser les routines.", chal: "Ne vous laissez pas décourager par des sentiments d'exigence ou de pressions externes.", adv: "résolvez les tâches en attente de manière pratique et réaliste." },
    "Urano": { energy: "Innovation, Liberté et Intuitions", opp: "Idées révolutionnaires et rupture bénéfique avec les habitudes limitantes.", chal: "Évitez l'impulsivité rebelle ou l'impatience envers les méthodes traditionnelles.", adv: "essayez de faire quelque chose de routine d'une manière totalement nouvelle aujourd'hui." },
    "Netuno": { energy: "Sensibilité et Inspiration Cosmique", opp: "Connexion spirituelle profonde, rêves révélateurs et inspiration artistique.", chal: "Attention aux illusions, à l'idéalisme excessif ou au manque de réalisme.", adv: "consacrez du temps à écrire vos rêves ou à écouter de la musique relaxante." },
    "Plutão": { energy: "Pouvoir de Guérison et Renouveau Profond", opp: "Opportunité de se détacher de ce qui ne sert plus et de se renforcer intimement.", chal: "Évitez les conflits de pouvoir ou les obsessions pour des détails mineurs.", adv: "éliminez une ancienne tâche en attente ou nettoyez votre espace physique." }
  }
};

const PLANET_COLORS_NUMBERS: Record<string, { color: string[]; number: number }> = {
  "Sol": { color: ["Dourado Sol", "Sun Gold", "Dorado Sol", "Sonnengold", "Or Soleil"], number: 1 },
  "Lua": { color: ["Azul Celeste", "Sky Blue", "Azul Celeste", "Himmelblau", "Bleu Céleste"], number: 2 },
  "Mercúrio": { color: ["Turquesa Fluido", "Fluid Turquoise", "Turquesa Fluido", "Flüssiges Türkis", "Turquoise Fluide"], number: 5 },
  "Vênus": { color: ["Violeta Púrpura", "Purple Violet", "Violeta Púrpura", "Purpurviolett", "Violet Pourpre"], number: 6 },
  "Marte": { color: ["Vermelho Rubi", "Ruby Red", "Rojo Rubí", "Rubinrot", "Rouge Rubis"], number: 9 },
  "Júpiter": { color: ["Dourado Sol", "Sun Gold", "Dorado Sol", "Sonnengold", "Or Soleil"], number: 3 },
  "Saturno": { color: ["Verde Esmeralda", "Emerald Green", "Verde Esmeralda", "Smaragdgrün", "Vert Émeraude"], number: 4 },
  "Urano": { color: ["Turquesa Fluido", "Fluid Turquoise", "Turquesa Fluido", "Flüssiges Türkis", "Turquoise Fluide"], number: 7 },
  "Netuno": { color: ["Azul Celeste", "Sky Blue", "Azul Celeste", "Himmelblau", "Bleu Céleste"], number: 8 },
  "Plutão": { color: ["Violeta Púrpura", "Purple Violet", "Violeta Púrpura", "Purpurviolett", "Violet Pourpre"], number: 9 }
};

// Helpers for Moon Phase, Numerology Personal Day, Sound Frequency and Categories

export function computeMoonPhaseForDate(date: Date, lang: 'pt' | 'en' | 'es' | 'de' | 'fr' = 'pt'): MoonPhaseInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Approximate Julian Date calculation for Moon elongation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const daysSinceNew = (jdn - 2451549.5) % 29.53058770576;
  const elongation = ((daysSinceNew < 0 ? daysSinceNew + 29.53058770576 : daysSinceNew) / 29.53058770576) * 360;

  const phases = [
    {
      icon: "🌑",
      names: { pt: "Lua Nova", en: "New Moon", es: "Luna Nueva", de: "Neumond", fr: "Nouvelle Lune" },
      descs: { pt: "Semear intenções, novos começos e introspecção.", en: "Sow intentions, new beginnings and introspection.", es: "Sembrar intenciones, nuevos comienzos e introspección.", de: "Absichten säen, Neuanfänge und Introspektion.", fr: "Semer des intentions, nouveaux départs et introspection." }
    },
    {
      icon: "🌒",
      names: { pt: "Lua Crescente Inicial", en: "Waxing Crescent", es: "Luna Creciente", de: "Zunehmender Sichelmond", fr: "Premier Croissant" },
      descs: { pt: "Impulso inicial, planejamento e superação de dúvidas.", en: "Initial momentum, planning and overcoming doubt.", es: "Impulso inicial, planificación y superación de dudas.", de: "Erster Schwung, Planung und Überwindung von Zweifeln.", fr: "Élan initial, planification et dépassement des doutes." }
    },
    {
      icon: "🌓",
      names: { pt: "Quarto Crescente", en: "First Quarter", es: "Cuarto Creciente", de: "Erstes Viertel", fr: "Premier Quartier" },
      descs: { pt: "Ação firme, decisões e superação de obstáculos.", en: "Firm action, decisions and overcoming obstacles.", es: "Acción firme, decisiones y superación de obstáculos.", de: "Entschlossenes Handeln, Entscheidungen und Hindernisse.", fr: "Action ferme, décisions et dépassement des obstacles." }
    },
    {
      icon: "🌔",
      names: { pt: "Crescente Gibosa", en: "Waxing Gibbous", es: "Creciente Gibosa", de: "Zunehmender Dreiviertelmond", fr: "Lune Gibbeuse Croissante" },
      descs: { pt: "Ajuste fino, paciência e refinamento de metas.", en: "Fine tuning, patience and refining goals.", es: "Ajuste fino, paciencia y refinamiento de metas.", de: "Feineinstellung, Geduld und Verfeinerung von Zielen.", fr: "Ajustement minutieux, patience et peaufinage." }
    },
    {
      icon: "🌕",
      names: { pt: "Lua Cheia", en: "Full Moon", es: "Luna Llena", de: "Vollmond", fr: "Pleine Lune" },
      descs: { pt: "Clareza máxima, ápice de energia e transbordamento.", en: "Maximum clarity, energy peak and fulfillment.", es: "Máxima claridad, ápice de energía y plenitud.", de: "Maximale Klarheit, Energiehöhepunkt und Fülle.", fr: "Clarté maximale, apogée d'énergie et plénitude." }
    },
    {
      icon: "🌖",
      names: { pt: "Minguante Gibosa", en: "Waning Gibbous", es: "Minguante Gibosa", de: "Abnehmender Dreiviertelmond", fr: "Lune Gibbeuse Décroissante" },
      descs: { pt: "Gratidão, compartilhamento e avaliação de resultados.", en: "Gratitude, sharing and evaluating results.", es: "Gratitud, compartir y evaluación de resultados.", de: "Dankbarkeit, Teilen und Auswertung der Ergebnisse.", fr: "Gratitude, partage et évaluation des résultats." }
    },
    {
      icon: "🌗",
      names: { pt: "Quarto Minguante", en: "Third Quarter", es: "Cuarto Menguante", de: "Letztes Viertel", fr: "Dernier Quartier" },
      descs: { pt: "Desapego, limpeza de pendências e perdão.", en: "Letting go, clearing pending tasks and forgiveness.", es: "Desapego, limpieza de pendientes y perdón.", de: "Loslassen, Klärung von Ausstehendem und Vergebung.", fr: "Lâcher-prise, nettoyage des tâches en attente et pardon." }
    },
    {
      icon: "🌘",
      names: { pt: "Lua Minguante Balsâmica", en: "Waning Crescent", es: "Luna Menguante", de: "Abnehmende Sichel", fr: "Dernier Croissant" },
      descs: { pt: "Recolhimento, descanso e restauração vital.", en: "Retreat, rest and vital restoration.", es: "Recogimiento, descanso y restauración vital.", de: "Rückzug, Ruhe und vitale Wiederherstellung.", fr: "Recueillement, repos et restauration vitale." }
    }
  ];

  const idx = Math.floor((elongation / 360) * 8) % 8;
  const phase = phases[idx];

  // Moon Zodiac Sign approximation based on date
  const signsList = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
  const moonSignIdx = Math.floor(((jdn - 2451549.5) * 13.176396 + 280) / 30) % 12;
  const rawSign = signsList[(moonSignIdx + 12) % 12];
  const translatedSign = TRANSLATED_SIGNS[lang]?.[rawSign] || rawSign;

  return {
    name: phase.names[lang] || phase.names.pt,
    icon: phase.icon,
    sign: translatedSign,
    desc: phase.descs[lang] || phase.descs.pt
  };
}

export function calculatePersonalNumerologyForDate(birthDateStr: string, date: Date, lang: 'pt' | 'en' | 'es' | 'de' | 'fr' = 'pt'): NumerologyDayInfo {
  let dayNum = 1;
  if (birthDateStr) {
    try {
      const parts = birthDateStr.split('-').map(Number);
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        const bDay = parts[2];
        const bMonth = parts[1];
        const tYear = date.getFullYear();
        const tMonth = date.getMonth() + 1;
        const tDay = date.getDate();

        const reduce = (n: number): number => {
          while (n > 9 && n !== 11 && n !== 22) {
            n = String(n).split('').map(Number).reduce((a, b) => a + b, 0);
          }
          return n;
        };

        const rBDay = reduce(bDay);
        const rBMonth = reduce(bMonth);
        const rYear = reduce(tYear);

        const personalYear = reduce(rBDay + rBMonth + rYear);
        const personalMonth = reduce(personalYear + tMonth);
        dayNum = reduce(personalMonth + tDay);
      }
    } catch (e) {
      dayNum = 1;
    }
  }

  const numerologyDict: Record<number, Record<string, { title: string; vib: string }>> = {
    1: {
      pt: { title: "Dia Pessoal 1: Liderança & Início", vib: "Poder de ação, independência e impulso para abrir novos caminhos." },
      en: { title: "Personal Day 1: Leadership & Beginnings", vib: "Power of action, independence, and drive to open new paths." },
      es: { title: "Día Personal 1: Liderazgo e Inicio", vib: "Poder de acción, independencia e impulso para abrir nuevos caminos." },
      de: { title: "Persönlicher Tag 1: Führung & Beginn", vib: "Handlungskraft, Unabhängigkeit und Antrieb für neue Wege." },
      fr: { title: "Jour Personnel 1: Leadership & Début", vib: "Pouvoir d'action, indépendance et élan pour ouvrir de nouvelles voies." }
    },
    2: {
      pt: { title: "Dia Pessoal 2: Parcerias & Harmonia", vib: "Sensibilidade, diplomacia e facilidade para pactos e escuta." },
      en: { title: "Personal Day 2: Partnerships & Harmony", vib: "Sensitivity, diplomacy, and ease for agreements and active listening." },
      es: { title: "Día Personal 2: Alianzas y Armonía", vib: "Sensibilidad, diplomacia y facilidad para acuerdos y escucha." },
      de: { title: "Persönlicher Tag 2: Partnerschaft & Harmonie", vib: "Feingefühl, Diplomatie und Leichtigkeit in Vereinbarungen." },
      fr: { title: "Jour Personnel 2: Partenariats & Harmonie", vib: "Sensibilité, diplomatie et facilité pour les accords et l'écoute." }
    },
    3: {
      pt: { title: "Dia Pessoal 3: Comunicação & Criatividade", vib: "Alegria, expressão artística e expansão de contatos sociais." },
      en: { title: "Personal Day 3: Communication & Creativity", vib: "Joy, artistic expression, and expansion of social contacts." },
      es: { title: "Día Personal 3: Comunicación y Creatividad", vib: "Alegría, expresión artística y expansión de contactos sociales." },
      de: { title: "Persönlicher Tag 3: Kommunikation & Kreativität", vib: "Freude, künstlerischer Ausdruck und soziale Kontakte." },
      fr: { title: "Jour Personnel 3: Communication & Créativité", vib: "Joie, expression artistique et expansion des contacts sociaux." }
    },
    4: {
      pt: { title: "Dia Pessoal 4: Estrutura & Organização", vib: "Trabalho prático, disciplina financeira e consolidação de bases." },
      en: { title: "Personal Day 4: Structure & Organization", vib: "Practical work, financial discipline, and solid foundation building." },
      es: { title: "Día Personal 4: Estructura y Organización", vib: "Trabajo práctico, disciplina financiera y consolidación de bases." },
      de: { title: "Persönlicher Tag 4: Struktur & Organisation", vib: "Praktische Arbeit, Finanzdisziplin und Fundamentbau." },
      fr: { title: "Jour Personnel 4: Structure & Organisation", vib: "Travail pratique, discipline financière et consolidation de bases." }
    },
    5: {
      pt: { title: "Dia Pessoal 5: Liberdade & Movimento", vib: "Adaptação a mudanças, dinamismo e quebra de rotinas rígidas." },
      en: { title: "Personal Day 5: Freedom & Movement", vib: "Adaptation to change, dynamism, and breaking rigid routines." },
      es: { title: "Día Personal 5: Libertad y Movimiento", vib: "Adaptación a cambios, dinamismo y ruptura de rutinas rígidas." },
      de: { title: "Persönlicher Tag 5: Freiheit & Bewegung", vib: "Anpassung an Veränderungen, Dynamik und Durchbrechen von Routinen." },
      fr: { title: "Jour Personnel 5: Liberté & Mouvement", vib: "Adaptation aux changements, dynamisme et rupture des routines." }
    },
    6: {
      pt: { title: "Dia Pessoal 6: Afeto & Responsabilidade", vib: "Harmonia familiar, cuidado com o lar e resolução de divergências." },
      en: { title: "Personal Day 6: Affection & Responsibility", vib: "Family harmony, home care, and resolution of emotional conflicts." },
      es: { title: "Día Personal 6: Afecto y Responsabilidad", vib: "Armonía familiar, cuidado del hogar y resolución de divergencias." },
      de: { title: "Persönlicher Tag 6: Zuneigung & Verantwortung", vib: "Familiäre Harmonie, Pflege des Heims und Konfliktlösung." },
      fr: { title: "Jour Personnel 6: Affection & Responsabilité", vib: "Harmonie familiale, soin du foyer et résolution de conflits." }
    },
    7: {
      pt: { title: "Dia Pessoal 7: Sabedoria & Introspecção", vib: "Estudos profundos, meditação e busca de respostas interiores." },
      en: { title: "Personal Day 7: Wisdom & Introspection", vib: "Deep studies, meditation, and seeking inner answers." },
      es: { title: "Día Personal 7: Sabiduría e Introspección", vib: "Estudios profundos, meditación y búsqueda de respuestas internas." },
      de: { title: "Persönlicher Tag 7: Weisheit & Introspektion", vib: "Tiefe Studien, Meditation und Suche nach inneren Antworten." },
      fr: { title: "Jour Personnel 7: Sagesse & Introspection", vib: "Études profondes, méditation et recherche de réponses intérieures." }
    },
    8: {
      pt: { title: "Dia Pessoal 8: Conquista Material & Poder", vib: "Foco financeiro, ambição executiva e colheita de resultados práticos." },
      en: { title: "Personal Day 8: Material Achievement & Power", vib: "Financial focus, executive ambition, and reaping practical results." },
      es: { title: "Día Personal 8: Logro Material y Poder", vib: "Enfoque financiero, ambición ejecutiva y cosecha de resultados prácticos." },
      de: { title: "Persönlicher Tag 8: Materielle Leistung & Macht", vib: "Finanzieller Fokus, exekutiver Ehrgeiz und praktische Ergebnisse." },
      fr: { title: "Jour Personnel 8: Réussite Matérielle & Pouvoir", vib: "Focus financier, ambition exécutive et récolte de résultats pratiques." }
    },
    9: {
      pt: { title: "Dia Pessoal 9: Finalização & Compaixão", vib: "Encerramento de ciclos, limpeza mental e altruísmo elevado." },
      en: { title: "Personal Day 9: Completion & Compassion", vib: "Closing cycles, mental decluttering, and elevated altruism." },
      es: { title: "Día Personal 9: Finalización y Compasión", vib: "Cierre de ciclos, limpieza mental y altruismo elevado." },
      de: { title: "Persönlicher Tag 9: Vollendung & Mitgefühl", vib: "Abschluss von Zyklen, mentale Reinigung und Altruismus." },
      fr: { title: "Jour Personnel 9: Fin de Cycle & Compassion", vib: "Clôture de cycles, nettoyage mental et altruisme élevé." }
    },
    11: {
      pt: { title: "Dia Pessoal 11: Iluminação & Intuição Elevada", vib: "Conexão espiritual intensa, inspiração súbita e poder de visão." },
      en: { title: "Personal Day 11: Illumination & High Intuition", vib: "Intense spiritual connection, sudden inspiration, and vision power." },
      es: { title: "Día Personal 11: Iluminación e Intuición Elevada", vib: "Conexión espiritual intensa, inspiración súbita y poder de visión." },
      de: { title: "Persönlicher Tag 11: Erleuchtung & Hohe Intuition", vib: "Intensive spirituelle Verbindung und plötzliche Inspiration." },
      fr: { title: "Jour Personnel 11: Illumination & Haute Intuition", vib: "Connexion spirituelle intense, inspiration soudaine et vision." }
    },
    22: {
      pt: { title: "Dia Pessoal 22: Mestre Construtor", vib: "Capacidade de transformar grandes ideais em estruturas físicas duradouras." },
      en: { title: "Personal Day 22: Master Builder", vib: "Ability to turn grand ideals into lasting physical structures." },
      es: { title: "Día Personal 22: Maestro Constructor", vib: "Capacidad de transformar grandes ideales en estructuras físicas duraderas." },
      de: { title: "Persönlicher Tag 22: Baumeister", vib: "Fähigkeit, große Ideale in dauerhafte Physis zu verwandeln." },
      fr: { title: "Jour Personnel 22: Maître Bâtisseur", vib: "Capacité a transformer de grands idéaux en structures durables." }
    }
  };

  const dayInfo = numerologyDict[dayNum] || numerologyDict[1];
  const localized = dayInfo[lang] || dayInfo.pt;

  return {
    personalDayNumber: dayNum,
    title: localized.title,
    vibration: localized.vib
  };
}

export function getSoundFrequencyForDate(tp: string, aspectType: string, date: Date, lang: 'pt' | 'en' | 'es' | 'de' | 'fr' = 'pt'): SoundFrequencyInfo {
  const seed = (date.getDate() + date.getMonth() + tp.length) % 7;
  
  const freqMap: Record<number, { hz: string; titles: Record<string, string>; benefits: Record<string, string> }> = {
    0: {
      hz: "528 Hz",
      titles: { pt: "Frequência de Milagres & Regeneração", en: "Miracle & DNA Regeneration Frequency", es: "Frecuencia de Milagros y Regeneración", de: "Wunder & DNA-Regenerationsfrequenz", fr: "Fréquence de Miracles et Régénération" },
      benefits: { pt: "Estimula clareza mental, paz profunda e restauração celular.", en: "Promotes mental clarity, deep peace, and cellular restoration.", es: "Promueve claridad mental, paz profunda y restauración celular.", de: "Fördert mentale Klarheit, tiefen Frieden und Zellregeneration.", fr: "Favorise la clarté mentale, la paix profonde et la régénération." }
    },
    1: {
      hz: "432 Hz",
      titles: { pt: "Ressonância Harmônica da Terra", en: "Harmonic Earth Resonance", es: "Resonancia Harmónica de la Tierra", de: "Harmonische Erdresonanz", fr: "Résonance Harmonique de la Terre" },
      benefits: { pt: "Alivia a ansiedade, desacelera o sistema nervoso e ancora vitalidade.", en: "Relieves anxiety, slows the nervous system, and grounds vitality.", es: "Alivia la ansiedad, desacelera el sistema nervioso y ancla vitalidad.", de: "Lindert Angstzustände und beruhigt das Nervensystem.", fr: "Soulage l'anxiété, ralentit le système nerveux et ancre la vitalité." }
    },
    2: {
      hz: "639 Hz",
      titles: { pt: "Conexão Celestial & Harmonia Afetiva", en: "Celestial Connection & Relationship Harmony", es: "Conexión Celestial y Armonía Afectiva", de: "Beziehungsharmonie & Himmlische Verbindung", fr: "Connexion Céleste & Harmonie Affective" },
      benefits: { pt: "Facilita a comunicação amorosa, cura mágoas e atrai relacionamentos elevados.", en: "Facilitates loving communication, heals wounds, and attracts high-vibe bonds.", es: "Facilita la comunicación amorosa, sana heridas y atrae relaciones elevadas.", de: "Erleichtert liebevolle Kommunikation und heilt Verletzungen.", fr: "Facilite la communication amoureuse et guérit les blessures." }
    },
    3: {
      hz: "741 Hz",
      titles: { pt: "Despertar da Intuição & Limpeza Psíquica", en: "Intuition Awakening & Psychic Cleansing", es: "Despertar de la Intuición y Limpieza Psíquica", de: "Intuitionserweckung & Psychische Reinigung", fr: "Éveil de l'Intuition & Nettoyage Psychique" },
      benefits: { pt: "Elimina bloqueios criativos, limpa energias densas e expande a percepção.", en: "Removes creative blocks, clears dense energy, and expands perception.", es: "Elimina bloqueos creativos, limpia energías densas y expande la percepción.", de: "Beseitigt kreative Blockaden und reinigt dichte Energien.", fr: "Élimine les blocages créatifs et nettoie les énergies denses." }
    },
    4: {
      hz: "852 Hz",
      titles: { pt: "Retorno à Ordem Espiritual & Terceiro Olho", en: "Return to Spiritual Order & Third Eye", es: "Retorno al Orden Espiritual y Tercer Ojo", de: "Rückkehr zur Geistigen Ordnung", fr: "Retour à l'Ordre Spirituel & Troisième Œil" },
      benefits: { pt: "Abre canais de sabedoria interior e favorece meditações de alta precisão.", en: "Opens inner wisdom channels and favors high-precision meditation.", es: "Abre canales de sabiduría interior y favorece meditaciones precisas.", de: "Öffnet Kanäle innerer Weisheit und fördert Meditation.", fr: "Ouvre les canaux de sagesse intérieure et favorise la méditation." }
    },
    5: {
      hz: "396 Hz",
      titles: { pt: "Liberação de Medos & Ancoragem Prática", en: "Liberation from Fear & Practical Grounding", es: "Liberación de Miedos y Anclaje Práctico", de: "Befreiung von Angst & Praktische Erdung", fr: "Libération des Peurs & Ancrage Pratique" },
      benefits: { pt: "Transforma a insegurança em determinação sólida e estabilidade financeira.", en: "Transforms insecurity into solid determination and financial stability.", es: "Transforma la inseguridad en determinación sólida y estabilidad.", de: "Wandelt Unsicherheit in solide Entschlossenheit um.", fr: "Transforme l'insécurité en détermination solide et stabilité." }
    },
    6: {
      hz: "963 Hz",
      titles: { pt: "Frequência da Consciência Cósmica", en: "Cosmic Consciousness Frequency", es: "Frecuencia de la Conciencia Cósmica", de: "Frequenz des Kosmischen Bewusstseins", fr: "Fréquence de la Conscience Cosmique" },
      benefits: { pt: "Ativa a glândula pineal, conecta com a unidade do universo e paz espiritual.", en: "Activates pineal gland, connects with universal unity and spiritual peace.", es: "Activa la glándula pineal, conecta con la unidad del universo y paz.", de: "Aktiviert die Zirbeldrüse und verbindet mit universeller Einheit.", fr: "Active la glande pinéale, connecte à l'unité de l'univers." }
    }
  };

  const f = freqMap[seed] || freqMap[0];
  return {
    hz: f.hz,
    title: f.titles[lang] || f.titles.pt,
    benefit: f.benefits[lang] || f.benefits.pt
  };
}

function getCategoryMatches(tp: string, aspectType: string, personalDay: number, houseNum: number, dayNumber: number): string[] {
  const matches = new Set<string>(['todos']);

  if (['Marte', 'Sol', 'Mercúrio', 'Saturno'].includes(tp) || [1, 4, 8].includes(personalDay) || [1, 6, 10].includes(houseNum)) {
    matches.add('produtividade');
  }
  if (['Lua', 'Netuno'].includes(tp) || [2, 7, 9].includes(personalDay) || [4, 12].includes(houseNum) || aspectType === 'Quadratura' || aspectType === 'Oposição') {
    matches.add('descanso');
  }
  if (['Lua', 'Vênus'].includes(tp) || [2, 6].includes(personalDay) || houseNum === 4) {
    matches.add('familia');
  }
  if (['Vênus', 'Sol', 'Júpiter'].includes(tp) || [2, 3, 6].includes(personalDay) || [5, 7].includes(houseNum)) {
    matches.add('encontros');
  }
  if (['Vênus', 'Sol', 'Júpiter'].includes(tp) || [3, 5].includes(personalDay) || houseNum === 5) {
    matches.add('diversao');
  }
  if (['Mercúrio', 'Sol', 'Júpiter'].includes(tp) || [1, 3, 5].includes(personalDay) || [3, 10].includes(houseNum)) {
    matches.add('entrevistas');
  }
  if (['Mercúrio', 'Vênus', 'Júpiter'].includes(tp) || [3, 5, 8].includes(personalDay) || [2, 3, 8].includes(houseNum)) {
    matches.add('vendas');
  }
  if (['Saturno', 'Júpiter', 'Plutão', 'Vênus'].includes(tp) || [4, 8, 22].includes(personalDay) || [2, 8].includes(houseNum)) {
    matches.add('investimentos');
  }
  if (['Júpiter', 'Mercúrio', 'Urano'].includes(tp) || [3, 5, 9].includes(personalDay) || houseNum === 9) {
    matches.add('viagens');
  }
  if (['Urano', 'Plutão', 'Marte'].includes(tp) || [5, 9, 11].includes(personalDay) || [4, 8, 11].includes(houseNum)) {
    matches.add('mudancas');
  }
  if (['Sol', 'Marte', 'Urano'].includes(tp) || [1, 5, 11, 22].includes(personalDay) || [1, 10].includes(houseNum)) {
    matches.add('projetos');
  }
  if (['Mercúrio', 'Saturno', 'Vênus'].includes(tp) || [4, 8, 22].includes(personalDay) || [3, 7].includes(houseNum)) {
    matches.add('contratos');
  }
  if (['Mercúrio', 'Plutão', 'Saturno'].includes(tp) || [2, 7].includes(personalDay) || [3, 7].includes(houseNum)) {
    matches.add('conversas');
  }
  if (['Mercúrio', 'Júpiter'].includes(tp) || [3, 7].includes(personalDay) || [3, 9].includes(houseNum)) {
    matches.add('estudos');
  }
  if (['Marte', 'Sol'].includes(tp) || [1, 5, 8].includes(personalDay) || [1, 6].includes(houseNum)) {
    matches.add('exercicios');
  }
  if (['Netuno', 'Lua'].includes(tp) || [7, 11].includes(personalDay) || [8, 12].includes(houseNum)) {
    matches.add('meditacao');
  }
  if (['Netuno', 'Júpiter', 'Plutão', 'Lua'].includes(tp) || [7, 11, 22].includes(personalDay) || [9, 12].includes(houseNum)) {
    matches.add('espiritualidade');
  }
  if (['Vênus', 'Mercúrio', 'Saturno'].includes(tp) || [3, 6, 8].includes(personalDay) || houseNum === 2) {
    matches.add('compras');
  }

  const categoryKeys = [
    'produtividade', 'descanso', 'familia', 'encontros', 'diversao',
    'entrevistas', 'vendas', 'investimentos', 'viagens', 'mudancas',
    'projetos', 'contratos', 'conversas', 'estudos', 'exercicios',
    'meditacao', 'espiritualidade', 'compras'
  ];
  matches.add(categoryKeys[dayNumber % categoryKeys.length]);
  matches.add(categoryKeys[(dayNumber + 5) % categoryKeys.length]);

  return Array.from(matches);
}

export function generateDailyPrediction(
  userBirthDate: string,
  userSunSign: string,
  userName: string,
  selectedDayIndex: number,
  currentDate: Date,
  langParam?: string,
  mapData?: any,
  userCoordinates?: { latitude: number; longitude: number },
  explicitTargetDate?: Date
): DailyPrediction {
  const lang = (langParam || getActiveLanguage()) as 'pt' | 'en' | 'es' | 'de' | 'fr';

  // Determine targetDate carefully for current or target month
  let targetDate: Date;
  if (explicitTargetDate) {
    targetDate = new Date(explicitTargetDate);
  } else {
    // If selectedDayIndex is 0..30, map to Day 1..31 of the currentDate's Year and Month
    const targetYear = currentDate.getFullYear();
    const targetMonth = currentDate.getMonth();
    targetDate = new Date(targetYear, targetMonth, selectedDayIndex + 1, 12, 0, 0);
  }

  const dayNumber = targetDate.getDate();

  // Coordinates fallback
  const lat = userCoordinates?.latitude || -23.5505;
  const lon = userCoordinates?.longitude || -46.6333;

  // Calculate transit positions
  const transitPositions = getTransitPositions(targetDate, lat, lon) || {};

  // Resolve natal positions
  const natalPositions: Record<string, number> = {};
  if (mapData && mapData.astros) {
    for (const ast of mapData.astros) {
      const sIdx = getSignIndex(ast.sign);
      if (sIdx !== -1) {
        const degStr = String(ast.degree).replace(/[^\d]/g, '');
        const deg = parseInt(degStr, 10) || 0;
        natalPositions[ast.name] = (sIdx * 30) + deg;
      }
    }
  }

  // Fallback to calculation if natal chart positions are missing
  if (Object.keys(natalPositions).length === 0 && userBirthDate) {
    try {
      const [byear, bmonth, bday] = userBirthDate.split("-").map(Number);
      const bdate = new Date(Date.UTC(byear, bmonth - 1, bday, 12, 0, 0));
      const calculatedNatal = getTransitPositions(bdate, lat, lon);
      if (calculatedNatal) {
        Object.assign(natalPositions, calculatedNatal);
      }
    } catch (e) {
      console.error("Error calculating fallback natal in engine:", e);
    }
  }

  // Find real-time aspects
  let foundAspects = findAspects(transitPositions, natalPositions, false);
  if (foundAspects.length === 0) {
    foundAspects = findAspects(transitPositions, natalPositions, true);
  }

  const activeAspects = foundAspects.sort((a, b) => a.diff - b.diff);
  const primaryAspect = activeAspects[0];

  let tp = "Sol";
  let np = "Sol";
  let aspectType: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil" = "Trígono";
  let diff = 0;

  if (primaryAspect) {
    tp = primaryAspect.transitPlanet;
    np = primaryAspect.natalPlanet;
    aspectType = primaryAspect.aspectType;
    diff = primaryAspect.diff;
  } else {
    const closest = findClosestAspectRegardlessOfOrb(transitPositions, natalPositions);
    if (closest) {
      tp = closest.transitPlanet;
      np = closest.natalPlanet;
      aspectType = closest.aspectType;
      diff = closest.diff;
    }
  }

  // Create translated aspect text
  const translatedTp = PLANET_TRANSLATIONS[lang]?.[tp] || tp;
  const translatedNp = PLANET_TRANSLATIONS[lang]?.[np] || np;
  const translatedAspect = ASPECT_TRANSLATIONS[lang]?.[aspectType] || aspectType;

  let aspectText = "";
  if (lang === "pt") {
    aspectText = `Aspecto real de ${translatedAspect} entre ${translatedTp} transitando e seu ${translatedNp} Natal (orb ${diff.toFixed(1)}°).`;
  } else if (lang === "en") {
    aspectText = `Real aspect of ${translatedAspect} between transiting ${translatedTp} and your Natal ${translatedNp} (orb ${diff.toFixed(1)}°).`;
  } else if (lang === "es") {
    aspectText = `Aspecto real de ${translatedAspect} entre ${translatedTp} transitando y tu ${translatedNp} Natal (orb ${diff.toFixed(1)}°).`;
  } else if (lang === "de") {
    aspectText = `Echter Aspekt des ${translatedAspect}s zwischen transitierendem ${translatedTp} und Ihrem Geburts-${translatedNp} (orb ${diff.toFixed(1)}°).`;
  } else {
    aspectText = `Aspect réel de ${translatedAspect} entre ${translatedTp} en transit et votre ${translatedNp} Natal (orb ${diff.toFixed(1)}°).`;
  }

  // Tag styles
  let tagText = "";
  let tagColorClass = "bg-slate-950 border-slate-800 text-slate-350";

  if (aspectType === "Trígono" || aspectType === "Sextil") {
    tagText = TRANSLATED_TAGS[lang][0]; // Favorável
    tagColorClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold";
  } else if (aspectType === "Quadratura") {
    tagText = TRANSLATED_TAGS[lang][1]; // Atenção
    tagColorClass = "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold";
  } else if (aspectType === "Oposição") {
    tagText = TRANSLATED_TAGS[lang][1]; // Atenção
    tagColorClass = "bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold";
  } else if (aspectType === "Conjunção") {
    tagText = TRANSLATED_TAGS[lang][4]; // Foco
    tagColorClass = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold";
  } else {
    tagText = TRANSLATED_TAGS[lang][2]; // Produtivo
    tagColorClass = "bg-sky-500/10 border-sky-500/20 text-sky-450 font-bold";
  }

  // Detailed interpretation
  const aspectMeanings = ASPECT_MEANINGS[lang]?.[aspectType] || ASPECT_MEANINGS["pt"]["Trígono"];
  const detailedInfluence = aspectMeanings[tp] || aspectMeanings["general"] || "";

  // Resolve transit & House details
  const lonVal = transitPositions[tp];
  let transit = "";
  let houseDetails = "";
  let houseNum = 1;

  const houseNames: Record<number, Record<string, string>> = {
    1: { pt: "Casa 1 (Vitalidade & Identidade)", en: "1st House (Vitality & Identity)", es: "Casa 1 (Vitalidad e Identidad)", de: "1. Haus (Vitalität & Identität)", fr: "Maison 1 (Vitalité & Identité)" },
    2: { pt: "Casa 2 (Finanças & Recursos)", en: "2nd House (Finances & Resources)", es: "Casa 2 (Finanzas y Recursos)", de: "2. Haus (Finanzen & Recursos)", fr: "Maison 2 (Finances & Ressources)" },
    3: { pt: "Casa 3 (Comunicação & Estudos)", en: "3rd House (Communication & Studies)", es: "Casa 3 (Comunicación y Estudios)", de: "3. Haus (Kommunikation & Studien)", fr: "Maison 3 (Communication & Études)" },
    4: { pt: "Casa 4 (Lar & Bases Emocionais)", en: "4th House (Home & Emotional Foundations)", es: "Casa 4 (Hogar y Bases Emocionales)", de: "4. Haus (Heim & Emotionale Grundlagen)", fr: "Maison 4 (Foyer & Bases Émotionnelles)" },
    5: { pt: "Casa 5 (Criatividade & Romances)", en: "5th House (Creativity & Romance)", es: "Casa 5 (Creatividad y Romances)", de: "5. Haus (Kreativität & Romantik)", fr: "Maison 5 (Créativité & Romances)" },
    6: { pt: "Casa 6 (Saúde & Trabalho Prático)", en: "6th House (Health & Practical Work)", es: "Casa 6 (Salud y Trabajo Práctico)", de: "6. Haus (Gesundheit & Praktische Arbeit)", fr: "Maison 6 (Santé & Travail Pratique)" },
    7: { pt: "Casa 7 (Relacionamentos & Parcerias)", en: "7th House (Relationships & Partnerships)", es: "Casa 7 (Relaciones y Alianzas)", de: "7. Haus (Beziehungen & Partnerschaften)", fr: "Maison 7 (Relations & Partenariats)" },
    8: { pt: "Casa 8 (Transformação & Finanças Compartilhadas)", en: "8th House (Transformation & Shared Finances)", es: "Casa 8 (Transformación y Finanzas Compartidas)", de: "8. Haus (Transformation & Gemeinsame Finanzen)", fr: "Maison 8 (Transformation & Finances Partagées)" },
    9: { pt: "Casa 9 (Sabedoria & Caminhos Elevados)", en: "9th House (Wisdom & Higher Paths)", es: "Casa 9 (Sabiduría y Caminos Elevados)", de: "9. Haus (Weisheit & Höhere Wege)", fr: "Maison 9 (Sagesse & Chemins Élevés)" },
    10: { pt: "Casa 10 (Carreira & Visibilidade Social)", en: "10th House (Career & Social Visibility)", es: "Casa 10 (Carrera y Visibilidad Social)", de: "10. Haus (Karriere & Soziale Sichtbarkeit)", fr: "Maison 10 (Carrière & Visibilité Sociale)" },
    11: { pt: "Casa 11 (Redes, Amigos & Sonhos)", en: "11th House (Networks, Friends & Dreams)", es: "Casa 11 (Redes, Amigos y Sueños)", de: "11. Haus (Netzwerke, Freunde & Träume)", fr: "Maison 11 (Réseaux, Amis & Rêves)" },
    12: { pt: "Casa 12 (Espiritualidade & Renovação Interior)", en: "12th House (Spirituality & Inner Renewal)", es: "Casa 12 (Espiritualidad y Renovación Interior)", de: "12. Haus (Spiritualität & Innere Erneuerung)", fr: "Maison 12 (Spiritualité & Renouveau Intérieur)" }
  };

  const translatedTpName = PLANET_TRANSLATIONS[lang]?.[tp] || tp;

  if (lonVal !== undefined) {
    const signsList = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
    const signIdx = Math.floor(lonVal / 30) % 12;
    const sName = signsList[signIdx];
    const translatedSName = TRANSLATED_SIGNS[lang]?.[sName] || sName;
    const translatedTpName = PLANET_TRANSLATIONS[lang]?.[tp] || tp;

    // Estimate astrological house based on Ascendant if available
    let ascDegree = 0;
    if (mapData && mapData.astros) {
      const ascObj = mapData.astros.find((a: any) => a.name === "Ascendente");
      if (ascObj) {
        const ascSIdx = getSignIndex(ascObj.sign);
        if (ascSIdx !== -1) {
          const d = parseInt(String(ascObj.degree).replace(/[^\d]/g, ''), 10) || 0;
          ascDegree = (ascSIdx * 30) + d;
        }
      }
    }
    houseNum = Math.floor(((lonVal - ascDegree + 360) % 360) / 30) + 1;

    houseDetails = houseNames[houseNum]?.[lang] || houseNames[houseNum]?.pt || "";

    if (lang === "pt") {
      transit = `${translatedTpName} transitando em ${translatedSName} na sua ${houseDetails}.`;
    } else if (lang === "en") {
      transit = `${translatedTpName} transiting in ${translatedSName} in your ${houseDetails}.`;
    } else if (lang === "es") {
      transit = `${translatedTpName} transitando en ${translatedSName} en tu ${houseDetails}.`;
    } else if (lang === "de") {
      transit = `${translatedTpName} transitiert in ${translatedSName} in Ihrem ${houseDetails}.`;
    } else {
      transit = `${translatedTpName} transitant en ${translatedSName} dans votre ${houseDetails}.`;
    }
  } else {
    houseNum = (dayNumber % 12) + 1;
    transit = TRANSLATED_TRANSITS[lang][(dayNumber - 1) % TRANSLATED_TRANSITS[lang].length];
    houseDetails = houseNames[houseNum]?.[lang] || houseNames[houseNum]?.pt || "";
  }

  // Compute Moon phase, numerology, sound frequency
  const moonPhase = computeMoonPhaseForDate(targetDate, lang);
  const numerology = calculatePersonalNumerologyForDate(userBirthDate, targetDate, lang);
  const frequency = getSoundFrequencyForDate(tp, aspectType, targetDate, lang);
  const personalDayNum = numerology.personalDayNumber;

  // DYNAMIC PREDOMINANT ENERGY

  const energyTitles: Record<string, Record<number, string>> = {
    pt: {
      1: "Vitalidade & Alinhamento de Identidade",
      2: "Estabilidade Financeira & Gestão de Recursos",
      3: "Fluidez na Comunicação & Ideias Ágeis",
      4: "Ancoragem Doméstica & Harmonia Familiar",
      5: "Criatividade Efervescente & Paixão Expressiva",
      6: "Vigor Físico & Eficiência na Rotina",
      7: "Sinergia em Parcerias & Acordos Elevados",
      8: "Poder de Transformação & Intuição Financeira",
      9: "Expansão de Horizontes & Visão Estratégica",
      10: "Ambição Executiva & Foco Profissional",
      11: "Conexões Estratégicas & Networking Ativo",
      12: "Renovação Espiritual & Silêncio Revelador"
    },
    en: {
      1: "Vitality & Identity Alignment",
      2: "Financial Stability & Resource Management",
      3: "Communication Flow & Agile Ideas",
      4: "Domestic Grounding & Family Harmony",
      5: "Effervescent Creativity & Expressive Passion",
      6: "Physical Vigor & Routine Efficiency",
      7: "Partnership Synergy & Elevated Agreements",
      8: "Transformative Power & Financial Intuition",
      9: "Horizon Expansion & Strategic Vision",
      10: "Executive Ambition & Professional Focus",
      11: "Strategic Connections & Active Networking",
      12: "Spiritual Renewal & Revealing Silence"
    },
    es: {
      1: "Vitalidad y Alineación de Identidad",
      2: "Estabilidad Financiera y Gestión de Recursos",
      3: "Fluidez en la Comunicación e Ideas Ágiles",
      4: "Anclaje Doméstico y Armonía Familiar",
      5: "Creatividad Efervescente y Pasión Expresiva",
      6: "Vigor Físico y Eficiencia en la Rutina",
      7: "Sinergia en Alianzas y Acuerdos Elevados",
      8: "Poder de Transformación e Intuición Financiera",
      9: "Expansión de Horizontes y Visión Estratégica",
      10: "Ambición Ejecutiva y Enfoque Profesional",
      11: "Conexiones Estratégicas y Networking Activo",
      12: "Renovación Espiritual y Silencio Revelador"
    },
    de: {
      1: "Vitalität & Identitätsausrichtung",
      2: "Finanzielle Stabilität & Ressourcenmanagement",
      3: "Kommunikationsfluss & Agile Ideen",
      4: "Häusliche Erdung & Familiäre Harmonie",
      5: "Kreativität & Ausdrucksstarke Leidenschaft",
      6: "Körperliche Kraft & Routineeffizienz",
      7: "Partnerschaftssynergie & Erhabene Vereinbarungen",
      8: "Transformationskraft & Finanzielle Intuition",
      9: "Horizonterweiterung & Strategische Vision",
      10: "Exekutiver Ehrgeiz & Professioneller Fokus",
      11: "Strategische Verbindungen & Aktives Networking",
      12: "Geistige Erneuerung & Enthüllende Stille"
    },
    fr: {
      1: "Vitalité & Alignement de l'Identité",
      2: "Stabilité Financière & Gestion des Ressources",
      3: "Fluidité de Communication & Idées Agiles",
      4: "Ancrage Domestique & Harmonie Familiale",
      5: "Créativité Effervescente & Passion Expressive",
      6: "Vigueur Physique & Efficacité de Routine",
      7: "Synergie de Partenariat & Accords Élevés",
      8: "Pouvoir de Transformation & Intuition Financière",
      9: "Expansion des Horizons & Vision Stratégique",
      10: "Ambition Exécutive & Focus Professionnel",
      11: "Connexions Stratégiques & Réseautage Actif",
      12: "Renouveau Spirituel & Silence Révélateur"
    }
  };

  const translatedNpName = PLANET_TRANSLATIONS[lang]?.[np] || np;
  const translatedAspectName = ASPECT_TRANSLATIONS[lang]?.[aspectType] || aspectType;
  const translatedSunSign = TRANSLATED_SIGNS[lang]?.[userSunSign] || userSunSign;

  const baseTitle = energyTitles[lang]?.[houseNum] || energyTitles["pt"][houseNum];
  const inWord = lang === 'en' ? 'in' : lang === 'es' ? 'en' : lang === 'de' ? 'in' : lang === 'fr' ? 'en' : 'em';
  const dayWord = lang === 'en' ? 'Day' : lang === 'es' ? 'Día' : lang === 'de' ? 'Tag' : lang === 'fr' ? 'Jour' : 'Dia';
  const predominantEnergy = `${baseTitle} (${translatedTpName} ${inWord} ${translatedAspectName} — ${dayWord} ${personalDayNum})`;

  // DYNAMIC ENERGY LEVEL CALCULATION
  let baseEnergy = 72;
  if (aspectType === "Trígono") baseEnergy += 18;
  else if (aspectType === "Sextil") baseEnergy += 14;
  else if (aspectType === "Conjunção") baseEnergy += 10;
  else if (aspectType === "Quadratura") baseEnergy -= 12;
  else if (aspectType === "Oposição") baseEnergy -= 8;

  const daySeed = (dayNumber * 7 + targetDate.getMonth() * 13 + houseNum * 3) % 15;
  const energyLevel = Math.min(98, Math.max(48, baseEnergy + daySeed - 7));

  // 1. Dynamic Astro Influence
  const generateDynamicAstroInfluenceText = (): string => {
    const daySeed = (dayNumber * 13 + targetDate.getMonth() * 17) % 5;
    if (lang === "en") {
      const variants = [
        `Transiting ${translatedTpName} forms a powerful ${translatedAspectName} with your Natal ${translatedNpName}, activating your ${houseDetails}. This alignment highlights your ${translatedSunSign} essence, prompting sharp decision-making and creative clarity.`,
        `Your celestial landscape is shaped today by ${translatedTpName} in ${translatedAspectName} to your Natal ${translatedNpName}. Operating directly in your ${houseDetails}, it channels renewed focus and heightened strategic perception.`,
        `With ${translatedTpName} making a ${translatedAspectName} aspect to your Natal ${translatedNpName}, your energy in the ${houseDetails} undergoes an active integration with your core ${translatedSunSign} strengths.`,
        `An auspicious planetary frequency arises as transiting ${translatedTpName} aligns via ${translatedAspectName} with your Natal ${translatedNpName}. This directly energizes the themes of your ${houseDetails}.`,
        `The cosmic pulse of the day connects ${translatedTpName} and your Natal ${translatedNpName} through a ${translatedAspectName}. This resonance brings tangible momentum to your ${houseDetails}.`
      ];
      return variants[daySeed];
    } else if (lang === "es") {
      const variants = [
        `${translatedTpName} en tránsito forma un poderoso aspecto de ${translatedAspectName} con tu ${translatedNpName} Natal, activando tu ${houseDetails}. Esta alineación potencia tu esencia de ${translatedSunSign}, impulsando la toma de decisiones con claridad.`,
        `Tu panorama celeste se moldea hoy por ${translatedTpName} en ${translatedAspectName} con tu ${translatedNpName} Natal. Operando directamente en tu ${houseDetails}, canaliza un enfoque renovado y una percepción estratégica elevada.`,
        `Con ${translatedTpName} haciendo un aspecto de ${translatedAspectName} con tu ${translatedNpName} Natal, tu energía en la ${houseDetails} se integra activamente con las fortalezas de tu Sol en ${translatedSunSign}.`,
        `Surge una frecuencia planetaria inspiradora mientras ${translatedTpName} en tránsito se alinea vía ${translatedAspectName} con tu ${translatedNpName} Natal, energizando directamente los temas de tu ${houseDetails}.`,
        `El pulso cósmico del día conecta ${translatedTpName} y tu ${translatedNpName} Natal mediante una ${translatedAspectName}. Esta resonancia aporta un impulso tangible a tu ${houseDetails}.`
      ];
      return variants[daySeed];
    } else if (lang === "de") {
      const variants = [
        `Transitierender ${translatedTpName} bildet einen kraftvollen Aspekt (${translatedAspectName}) mit Ihrem Geburts-${translatedNpName} und aktiviert Ihr ${houseDetails}. Diese Ausrichtung stärkt Ihre Essenz in ${translatedSunSign}.`,
        `Ihre himmlische Landschaft wird heute durch ${translatedTpName} im Aspekt ${translatedAspectName} zu Ihrem Geburts-${translatedNpName} geprägt. Dies bringt erneuerten Fokus in Ihr ${houseDetails}.`,
        `Mit ${translatedTpName} im Aspekt ${translatedAspectName} zu Ihrem Geburts-${translatedNpName} verbindet sich Ihre Energie im ${houseDetails} mit den Stärken Ihres Sonnenzeichens ${translatedSunSign}.`,
        `Eine inspirierende planetare Frequenz entsteht, wenn ${translatedTpName} über ${translatedAspectName} mit Ihrem Geburts-${translatedNpName} harmoniert und Ihr ${houseDetails} belebt.`,
        `Der kosmische Puls des Tages verbindet ${translatedTpName} und Ihren Geburts-${translatedNpName} durch ${translatedAspectName} und bringt spürbare Dynamik in Ihr ${houseDetails}.`
      ];
      return variants[daySeed];
    } else if (lang === "fr") {
      const variants = [
        `${translatedTpName} en transit forme un puissant aspect de ${translatedAspectName} avec votre ${translatedNpName} Natal, activant votre ${houseDetails}. Cet alignement valorise votre essence en ${translatedSunSign}.`,
        `Votre paysage céleste est façonnée aujourd'hui par ${translatedTpName} en ${translatedAspectName} avec votre ${translatedNpName} Natal, insufflant une clarté stratégique dans votre ${houseDetails}.`,
        `Avec ${translatedTpName} formant un aspect de ${translatedAspectName} avec votre ${translatedNpName} Natal, votre énergie dans la ${houseDetails} s'intègre activement avec votre Soleil en ${translatedSunSign}.`,
        `Une fréquence planétaire s'élève alors que ${translatedTpName} s'aligne via ${translatedAspectName} avec votre ${translatedNpName} Natal, dynamisant votre ${houseDetails}.`,
        `Le pouls cosmique du jour résonne entre ${translatedTpName} et votre ${translatedNpName} Natal à travers un ${translatedAspectName}, apportant un élan concret à votre ${houseDetails}.`
      ];
      return variants[daySeed];
    } else {
      const variants = [
        `${translatedTpName} transitando forma um poderoso aspecto de ${translatedAspectName} com o seu ${translatedNpName} Natal, ativando a sua ${houseDetails}. Este alinhamento projeta sua essência de ${translatedSunSign}, estimulando decisões lúcidas e clareza criativa.`,
        `O seu panorama celeste do dia é moldado por ${translatedTpName} em ${translatedAspectName} ao seu ${translatedNpName} Natal. Atuando diretamente na sua ${houseDetails}, canaliza foco renovado e percepção estratégica elevada.`,
        `Com ${translatedTpName} fazendo aspecto de ${translatedAspectName} com o seu ${translatedNpName} Natal, sua energia na ${houseDetails} entra em integração ativa com a força do seu Sol em ${translatedSunSign}.`,
        `Uma frequência planetária inspiradora emerge com o trânsito de ${translatedTpName} alinhado via ${translatedAspectName} ao seu ${translatedNpName} Natal, energizando diretamente os temas da sua ${houseDetails}.`,
        `O pulso cósmico deste dia conecta ${translatedTpName} e o seu ${translatedNpName} Natal através de uma ${translatedAspectName}. Essa ressonância traz um impulso tangível para a sua ${houseDetails}.`
      ];
      return variants[daySeed];
    }
  };

  const astroInfluence = generateDynamicAstroInfluenceText();

  // DYNAMIC FAVORED & ATTENTION AREAS PER HOUSE & PLANET
  const houseFavoredAttention: Record<number, { fav: Record<string, string[]>; att: Record<string, string[]> }> = {
    1: {
      fav: { pt: ["Autocuidado", "Liderança", "Projetos Pessoais"], en: ["Self-care", "Leadership", "Personal Projects"], es: ["Autocuidado", "Liderazgo", "Proyectos Personales"], de: ["Selbstfürsorge", "Führung", "Persönliche Projekte"], fr: ["Auto-soin", "Leadership", "Projets Personnels"] },
      att: { pt: ["Impulsividade", "Ego", "Ansiedade"], en: ["Impulsiveness", "Ego", "Anxiety"], es: ["Impulsividad", "Ego", "Ansiedad"], de: ["Impulsivität", "Ego", "Angst"], fr: ["Impulsivité", "Égo", "Anxiété"] }
    },
    2: {
      fav: { pt: ["Finanças", "Investimentos", "Organização Material"], en: ["Finances", "Investments", "Material Organization"], es: ["Finanzas", "Inversiones", "Organización Material"], de: ["Finanzen", "Investitionen", "Materialorganisation"], fr: ["Finances", "Investissements", "Organisation Matérielle"] },
      att: { pt: ["Gastos por Impulso", "Vaidade", "Compras Supérfluas"], en: ["Impulse Spending", "Vanity", "Superfluous Purchases"], es: ["Gastos por Impulso", "Vanidad", "Compras Superfluas"], de: ["Spontankäufe", "Eitelkeit", "Überflüssige Käufe"], fr: ["Dépenses Impulsives", "Vanité", "Achats Superflus"] }
    },
    3: {
      fav: { pt: ["Estudos", "Comunicação", "Negociações"], en: ["Studies", "Communication", "Negotiations"], es: ["Estudios", "Comunicación", "Negociaciones"], de: ["Studien", "Kommunikation", "Verhandlungen"], fr: ["Études", "Communication", "Négociations"] },
      att: { pt: ["Ansiedade Mental", "Diálogos Tensos", "Falta de Foco"], en: ["Mental Anxiety", "Tense Dialogues", "Lack of Focus"], es: ["Ansiedad Mental", "Diálogos Tensos", "Falta de Enfoque"], de: ["Mentale Unruhe", "Angespannte Dialoge", "Mangelnder Fokus"], fr: ["Anxiété Mentale", "Dialogues Tendus", "Manque de Focus"] }
    },
    4: {
      fav: { pt: ["Lar", "Harmonia Familiar", "Estabilidade Emocional"], en: ["Home", "Family Harmony", "Emotional Stability"], es: ["Hogar", "Armonía Familiar", "Estabilidad Emocional"], de: ["Heim", "Familiäre Harmonie", "Emotionale Stabilität"], fr: ["Foyer", "Harmonie Familiale", "Stabilité Émotionnelle"] },
      att: { pt: ["Fricção Doméstica", "Cansaço", "Apego ao Passado"], en: ["Domestic Friction", "Tiredness", "Past Attachment"], es: ["Fricción Doméstica", "Cansancio", "Apego al Pasado"], de: ["Reibung im Haushalt", "Müdigkeit", "Anhaftung an die Vergangenheit"], fr: ["Friction Domestique", "Fatigue", "Attachement au Passé"] }
    },
    5: {
      fav: { pt: ["Criatividade", "Romances", "Expressão Artística"], en: ["Creativity", "Romance", "Artistic Expression"], es: ["Creatividad", "Romances", "Expresión Artística"], de: ["Kreativität", "Romantik", "Künstlerischer Ausdruck"], fr: ["Créativité", "Romance", "Expression Artistique"] },
      att: { pt: ["Riscos Financeiros", "Impaciência", "Excesso de Orgulho"], en: ["Financial Risks", "Impatience", "Excess Pride"], es: ["Riesgos Financieros", "Impaciencia", "Exceso de Orgullo"], de: ["Finanzielle Risiken", "Ungeduld", "Übertriebener Stolz"], fr: ["Risques Financiers", "Impatience", "Excès d'Orgueil"] }
    },
    6: {
      fav: { pt: ["Saúde", "Rotina Prática", "Organização do Trabalho"], en: ["Health", "Practical Routine", "Work Organization"], es: ["Salud", "Rutina Práctica", "Organización del Trabajo"], de: ["Gesundheit", "Praktische Routine", "Arbeitsorganisation"], fr: ["Santé", "Routine Pratique", "Organisation du Travail"] },
      att: { pt: ["Sobrecarga", "Estresse Físico", "Auto-cobrança"], en: ["Overload", "Physical Stress", "Self-pressure"], es: ["Sobrecarga", "Estrés Físico", "Autoexigencia"], de: ["Überlastung", "Körperlicher Stress", "Selbstdruck"], fr: ["Surcharge", "Stress Physique", "Pression Personnelle"] }
    },
    7: {
      fav: { pt: ["Parcerias", "Contratos", "Relacionamentos"], en: ["Partnerships", "Contracts", "Relationships"], es: ["Alianzas", "Contratos", "Relaciones"], de: ["Partnerschaften", "Verträge", "Beziehungen"], fr: ["Partenariats", "Contrats", "Relations"] },
      att: { pt: ["Cobranças Afetivas", "Disputas de Controle", "Insegurança"], en: ["Emotional Demands", "Control Disputes", "Insecurity"], es: ["Exigencias Afectivas", "Disputas de Control", "Inseguridad"], de: ["Emotionale Ansprüche", "Machtkämpfe", "Unsicherheit"], fr: ["Exigences Affectives", "Luttes de Contrôle", "Insécurité"] }
    },
    8: {
      fav: { pt: ["Planejamento", "Intuição", "Transformação Pessoal"], en: ["Planning", "Intuition", "Personal Transformation"], es: ["Planificación", "Intuición", "Transformación Personal"], de: ["Planung", "Intuition", "Persönliche Transformation"], fr: ["Planification", "Intuition", "Transformation Personnelle"] },
      att: { pt: ["Disputas de Poder", "Ansiedade Acumulada", "Teimosia"], en: ["Power Struggles", "Accumulated Anxiety", "Stubbornness"], es: ["Disputas de Poder", "Ansiedad Acumulada", "Terquedad"], de: ["Machtkämpfe", "Angestauter Stress", "Sturheit"], fr: ["Luttes de Pouvoir", "Anxiété Accumulée", "Entêtement"] }
    },
    9: {
      fav: { pt: ["Estudos Avançados", "Viagens", "Visão Estratégica"], en: ["Advanced Studies", "Travel", "Strategic Vision"], es: ["Estudios Avanzados", "Viajes", "Visión Estratégica"], de: ["Fortgeschrittene Studien", "Reisen", "Strategische Vision"], fr: ["Études Avancées", "Voyages", "Vision Stratégique"] },
      att: { pt: ["Falta de Foco", "Excessos", "Desatenção aos Detalhes"], en: ["Lack of Focus", "Excesses", "Inattention to Details"], es: ["Falta de Enfoque", "Excesos", "Falta de Atención a Detalles"], de: ["Mangelnder Fokus", "Exzesse", "Unachtsamkeit bei Details"], fr: ["Manque de Focus", "Excès", "Inattention aux Détails"] }
    },
    10: {
      fav: { pt: ["Carreira", "Ambição Executiva", "Reconhecimento"], en: ["Career", "Executive Ambition", "Recognition"], es: ["Carrera", "Ambición Ejecutiva", "Reconocimiento"], de: ["Karriere", "Exekutiver Ehrgeiz", "Anerkennung"], fr: ["Carrière", "Ambition Ejecutiva", "Reconnaissance"] },
      att: { pt: ["Pressão Profissional", "Excesso de Carga", "Impaciência Social"], en: ["Professional Pressure", "Work Overload", "Social Impatience"], es: ["Presión Profesional", "Exceso de Carga", "Impaciencia Social"], de: ["Beruflicher Druck", "Arbeitsüberlastung", "Soziale Ungeduld"], fr: ["Pression Professionnelle", "Surcharge de Travail", "Impatience Sociale"] }
    },
    11: {
      fav: { pt: ["Networking", "Amigos", "Projetos Coletivos"], en: ["Networking", "Friends", "Collective Projects"], es: ["Networking", "Amigos", "Proyectos Colectivos"], de: ["Networking", "Freunde", "Kollektive Projekte"], fr: ["Réseautage", "Amis", "Projets Collectifs"] },
      att: { pt: ["Ideias Dispersas", "Expectativas Irreais", "Impulso Social"], en: ["Dispersed Ideas", "Unrealistic Expectations", "Social Impulse"], es: ["Ideas Dispersas", "Expectativas Irreales", "Impulso Social"], de: ["Zerstreute Ideen", "Unrealistische Erwartungen", "Sozialer Impuls"], fr: ["Idées Dispersées", "Attentes Irréalistes", "Impulsion Sociale"] }
    },
    12: {
      fav: { pt: ["Espiritualidade", "Meditação", "Restauração Interior"], en: ["Spirituality", "Meditation", "Inner Restoration"], es: ["Espiritualidad", "Meditación", "Restauración Interior"], de: ["Spiritualität", "Meditation", "Innere Wiederherstellung"], fr: ["Spiritualité", "Méditation", "Restauration Intérieure"] },
      att: { pt: ["Desânimo", "Burocracia", "Confusão Mental"], en: ["Discouragement", "Bureaucracy", "Mental Confusion"], es: ["Desánimo", "Burocracia", "Confusión Mental"], de: ["Entmutigung", "Bürokratie", "Mentale Verwirrung"], fr: ["Découragement", "Bureaucratie", "Confusion Mentale"] }
    }
  };

  const houseData = houseFavoredAttention[houseNum] || houseFavoredAttention[1];
  const favoredAreas = houseData.fav[lang] || houseData.fav.pt;
  const attentionAreas = houseData.att[lang] || houseData.att.pt;

  // DYNAMIC OPPORTUNITIES & CHALLENGES
  const oppTemplates: Record<string, string> = {
    pt: `Excelente dia para direcionar seus esforços a ${favoredAreas[0].toLowerCase()} e ${favoredAreas[1].toLowerCase()}, aproveitando o fluxo de ${translatedTpName} ativando a sua ${houseDetails} e a regência do seu Sol em ${translatedSunSign}.`,
    en: `Great day to direct your efforts toward ${favoredAreas[0].toLowerCase()} and ${favoredAreas[1].toLowerCase()}, capitalizing on ${translatedTpName}'s flow in your ${houseDetails} aligned with your ${translatedSunSign} Sun.`,
    es: `Excelente día para orientar tus esfuerzos hacia ${favoredAreas[0].toLowerCase()} y ${favoredAreas[1].toLowerCase()}, aprovechando el flujo de ${translatedTpName} activando tu ${houseDetails} y tu Sol en ${translatedSunSign}.`,
    de: `Hervorragender Tag, um Ihre Anstrengungen auf ${favoredAreas[0].toLowerCase()} und ${favoredAreas[1].toLowerCase()} zu richten, gestützt vom Transit von ${translatedTpName} in Ihrem ${houseDetails}.`,
    fr: `Excellente journée pour orienter vos efforts vers ${favoredAreas[0].toLowerCase()} et ${favoredAreas[1].toLowerCase()}, en profitant du flux de ${translatedTpName} activant votre ${houseDetails}.`
  };

  const chalTemplates: Record<string, string> = {
    pt: `Evite atritos ou decisões precipitadas sobre ${attentionAreas[0].toLowerCase()} e ${attentionAreas[1].toLowerCase()}. O aspecto de ${translatedAspectName} exige paciência e escuta estratégica.`,
    en: `Avoid friction or hasty decisions regarding ${attentionAreas[0].toLowerCase()} and ${attentionAreas[1].toLowerCase()}. The ${translatedAspectName} aspect requires patience and strategic listening.`,
    es: `Evita fricciones o decisiones apresuradas sobre ${attentionAreas[0].toLowerCase()} y ${attentionAreas[1].toLowerCase()}. El aspecto de ${translatedAspectName} exige paciencia y escucha estratégica.`,
    de: `Vermeiden Sie Reibungen oder voreilige Entscheidungen bezüglich ${attentionAreas[0].toLowerCase()} und ${attentionAreas[1].toLowerCase()}. Der Aspekt ${translatedAspectName} erfordert Geduld.`,
    fr: `Évitez les frictions ou décisions précipitées concernant ${attentionAreas[0].toLowerCase()} et ${attentionAreas[1].toLowerCase()}. L'aspect ${translatedAspectName} exige de la patience.`
  };

  const opportunities = oppTemplates[lang] || oppTemplates.pt;
  const challenges = chalTemplates[lang] || chalTemplates.pt;

  // DYNAMIC PERSONALIZED ADVICE
  const firstName = userName ? userName.split(' ')[0] : (lang === 'de' ? 'Reisender' : lang === 'fr' ? 'Voyageur' : lang === 'es' ? 'Viajero' : lang === 'en' ? 'Traveler' : 'Viajante');
  const adviceTemplates: Record<string, string> = {
    pt: `${firstName}, sob a vibração do seu Dia Pessoal ${personalDayNum} e a influência de ${translatedTpName} na sua ${houseDetails}, concentre sua mente naquilo que realmente gera valor a longo prazo.`,
    en: `${firstName}, under the vibration of Personal Day ${personalDayNum} and ${translatedTpName}'s presence in your ${houseDetails}, focus your mind on what genuinely builds long-term value.`,
    es: `${firstName}, bajo la vibración de tu Día Personal ${personalDayNum} y la influencia de ${translatedTpName} en tu ${houseDetails}, concentra tu mente en lo que realmente genera valor a largo plazo.`,
    de: `${firstName}, unter der Schwingung Ihres persönlichen Tages ${personalDayNum} und dem Einfluss von ${translatedTpName} in Ihrem ${houseDetails}, richten Sie Ihren Fokus auf echten Langzeitwert.`,
    fr: `${firstName}, sous la vibration de votre Jour Personnel ${personalDayNum} et l'influence de ${translatedTpName} dans votre ${houseDetails}, concentrez votre esprit sur ce qui crée de la valeur durable.`
  };
  const personalizedAdvice = adviceTemplates[lang] || adviceTemplates.pt;

  // DYNAMIC UNIQUE PERSONALIZED MESSAGE FOR EVERY SINGLE DAY OF THE MONTH
  const generateDynamicPersonalizedMessage = (): string => {
    const formattedDate = targetDate.toLocaleDateString(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : 'fr-FR', {
      day: 'numeric',
      month: 'long'
    });

    if (lang === "en") {
      return `For ${formattedDate}, with your Sun in ${translatedSunSign}, the cosmic current of ${translatedTpName} forming a ${translatedAspectName} with your Natal ${translatedNpName} directly powers your ${houseDetails}. Combined with your Personal Day ${personalDayNum} (${numerology.title}) and the ${moonPhase.name} in ${moonPhase.sign}, today offers a unique frequency to refine your priorities and ground your ambitions without unnecessary noise.`;
    } else if (lang === "es") {
      return `Para el ${formattedDate}, con tu Sol en ${translatedSunSign}, la corriente cósmica de ${translatedTpName} en ${translatedAspectName} con tu ${translatedNpName} Natal impulsa directamente tu ${houseDetails}. Sumado a tu Día Personal ${personalDayNum} (${numerology.title}) y la ${moonPhase.name} en ${moonPhase.sign}, hoy se presenta una frecuencia única para refinar tus prioridades y concretar tus metas sin estréso ni dispersión.`;
    } else if (lang === "de") {
      return `Für den ${formattedDate}, mit Ihrer Sonne in ${translatedSunSign}, aktiviert die kosmische Strömung von ${translatedTpName} im Aspekt ${translatedAspectName} zu Ihrem Geburts-${translatedNpName} direkt Ihr ${houseDetails}. In Kombination mit Ihrem persönlichen Tag ${personalDayNum} (${numerology.title}) und dem ${moonPhase.name} im ${moonPhase.sign} bietet dieser Tag eine einzigartige Gelegenheit, Ihre Ziele klar auszurichten.`;
    } else if (lang === "fr") {
      return `Pour le ${formattedDate}, avec votre Soleil en ${translatedSunSign}, le courant cosmique de ${translatedTpName} formant un ${translatedAspectName} avec votre ${translatedNpName} Natal active directement votre ${houseDetails}. Associé à votre Jour Personnel ${personalDayNum} (${numerology.title}) et la ${moonPhase.name} en ${moonPhase.sign}, cette journée offre une fréquence unique pour clarifier vos priorités et concrétiser vos aspirations.`;
    } else {
      return `Para o dia ${formattedDate}, com o seu Sol iluminando a essência de ${translatedSunSign}, o fluxo celeste de ${translatedTpName} fazendo ${translatedAspectName} com o seu ${translatedNpName} Natal movimenta com precisão a sua ${houseDetails}. Em sintonia com o seu Dia Pessoal ${personalDayNum} (${numerology.title}) e a ${moonPhase.name} em ${moonPhase.sign}, este dia reserva uma vibração singular para alinhar suas intenções e consolidar decisões com clareza e sabedoria.`;
    }
  };

  const personalizedMessage = generateDynamicPersonalizedMessage();

  const planetColors: Record<string, Record<string, string>> = {
    "Sol": { pt: "Dourado Solar", en: "Solar Gold", es: "Dorado Solar", de: "Sonnengold", fr: "Or Solaire" },
    "Lua": { pt: "Prata Lunar", en: "Lunar Silver", es: "Plata Lunar", de: "Mondsilber", fr: "Argent Lunaire" },
    "Mercúrio": { pt: "Azul Safira", en: "Sapphire Blue", es: "Azul Zafiro", de: "Saphirblau", fr: "Bleu Saphir" },
    "Vênus": { pt: "Verde Esmeralda", en: "Emerald Green", es: "Verde Esmeralda", de: "Smaragdgrün", fr: "Vert Émeraude" },
    "Marte": { pt: "Vermelho Rubi", en: "Ruby Red", es: "Rojo Rubí", de: "Rubinrot", fr: "Rouge Rubis" },
    "Júpiter": { pt: "Roxo Ametista", en: "Amethyst Purple", es: "Púrpura Amatista", de: "Amethystviolett", fr: "Pourpre Améthyste" },
    "Saturno": { pt: "Âmbar Dourado", en: "Golden Amber", es: "Ámbar Dorado", de: "Goldbernstein", fr: "Ambre Doré" },
    "Urano": { pt: "Turquesa Elétrico", en: "Electric Turquoise", es: "Turquesa Eléctrico", de: "Elektrotürkis", fr: "Turquoise Électrique" },
    "Netuno": { pt: "Azul Marinho Celestial", en: "Celestial Navy Blue", es: "Azul Marino Celestial", de: "Himmlisches Marineblau", fr: "Bleu Marine Céleste" },
    "Plutão": { pt: "Rosa Quartzo Profundo", en: "Deep Quartz Pink", es: "Rosa Cuarzo Profundo", de: "Tiefquarzrosa", fr: "Rose Quartz Profond" }
  };
  const favorableColor = planetColors[tp]?.[lang] || planetColors[tp]?.pt || (lang === 'en' ? 'Emerald Green' : 'Verde Esmeralda');

  const favorableNumber = ((dayNumber * 3 + houseNum * 5 + targetDate.getMonth() + 1) % 9) + 1;

  const startHour = 8 + (daySeed % 5);
  const endHour = startHour + 3;
  const bestPeriod = `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:30`;

  const alertStartHour = 14 + (daySeed % 4);
  const alertEndHour = alertStartHour + 2;
  const attentionPeriod = `${String(alertStartHour).padStart(2, '0')}:00 - ${String(alertEndHour).padStart(2, '0')}:30`;

  const localeMap: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', de: 'de-DE', fr: 'fr-FR' };
  const dateFormatted = targetDate.toLocaleDateString(localeMap[lang] || 'pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const categoryMatches = getCategoryMatches(tp, aspectType, personalDayNum, houseNum, dayNumber);

  // 1. Resumo Energético do Dia
  const summary = astroInfluence;

  // 2. Cor Favorável
  const colorReasons: Record<string, string> = {
    pt: `A vibração de ${translatedTpName} ativando sua ${houseDetails} sintoniza a frequência luminosa de ${favorableColor}.`,
    en: `The vibration of transiting ${translatedTpName} in your ${houseDetails} aligns with the luminous frequency of ${favorableColor}.`,
    es: `La vibración de ${translatedTpName} activando tu ${houseDetails} sintoniza la frecuencia luminosa de ${favorableColor}.`,
    de: `Die Schwingung von ${translatedTpName} in Ihrem ${houseDetails} stimmt sich mit der Lichtfrequenz von ${favorableColor} ein.`,
    fr: `La vibration de ${translatedTpName} activant votre ${houseDetails} s'harmonise avec la fréquence lumineuse de ${favorableColor}.`
  };
  const favorableColorReason = colorReasons[lang] || colorReasons.pt;

  const colorUsages: Record<string, string> = {
    pt: `Vista roupas ou utilize acessórios na tonalidade ${favorableColor} durante compromissos importantes para ancorar foco e proteção.`,
    en: `Wear clothing or accessories in ${favorableColor} during key meetings to anchor focus and protection.`,
    es: `Usa prendas o accesorios en tono ${favorableColor} durante compromisos clave para anclar enfoque y protección.`,
    de: `Tragen Sie Kleidung oder Accessoires in ${favorableColor} bei wichtigen Terminen zur Stärkung von Fokus und Schutz.`,
    fr: `Portez des vêtements ou accessoires en teinte ${favorableColor} lors de vos rendez-vous clés pour ancrer votre protection.`
  };
  const favorableColorUsage = colorUsages[lang] || colorUsages.pt;

  const colorExamplesDict: Record<string, string> = {
    pt: `${favorableColor}, Velas ${favorableColor}, Pedras e Acessórios Sintonizados`,
    en: `${favorableColor}, ${favorableColor} Candles, Tuned Stones & Accessories`,
    es: `${favorableColor}, Velas ${favorableColor}, Piedras y Accesorios Sintonizados`,
    de: `${favorableColor}, ${favorableColor} Kerzen, Abgestimmte Steine & Accessoires`,
    fr: `${favorableColor}, Bougies ${favorableColor}, Pierres & Accessoires Harmonisés`
  };
  const favorableColorExamples = colorExamplesDict[lang] || colorExamplesDict.pt;

  // 3. Números Favoráveis
  const num2 = ((favorableNumber + 3) % 9) + 1;
  const num3 = ((favorableNumber + 6) % 9) + 1;
  const favorableNumbersList = [favorableNumber, num2, num3];

  const favorableNumbersMeaningDict: Record<string, string> = {
    pt: `O número ${favorableNumber} conecta-se com o seu Dia Pessoal ${personalDayNum} (${numerology.title}), favorecendo escolhas de alto impacto.`,
    en: `Number ${favorableNumber} aligns with Personal Day ${personalDayNum} (${numerology.title}), favoring strategic alignment.`,
    es: `El número ${favorableNumber} se conecta con tu Día Personal ${personalDayNum} (${numerology.title}), favoreciendo decisiones certeras.`,
    de: `Die Zahl ${favorableNumber} verbindet sich mit Ihrem persönlichen Tag ${personalDayNum} (${numerology.title}) und begünstigt strategische Ausrichtung.`,
    fr: `Le nombre ${favorableNumber} s'aligne avec votre Jour Personnel ${personalDayNum} (${numerology.title}), favorisant un alignement stratégique.`
  };
  const favorableNumbersMeaning = favorableNumbersMeaningDict[lang] || favorableNumbersMeaningDict.pt;

  const favorableNumbersSuggestionsDict: Record<string, string> = {
    pt: `Utilize os números ${favorableNumbersList.join(', ')} para horários de reuniões, decisões ou planejamentos estratégicos.`,
    en: `Use numbers ${favorableNumbersList.join(', ')} for key time slots, scheduling, or financial decisions.`,
    es: `Utiliza los números ${favorableNumbersList.join(', ')} para horarios de reuniones, decisiones o planificaciones estratégicas.`,
    de: `Nutzen Sie die Zahlen ${favorableNumbersList.join(', ')} für Besprechungszeiten, Entscheidungen oder strategische Planungen.`,
    fr: `Utilisez les nombres ${favorableNumbersList.join(', ')} pour les créneaux de réunion, les décisions ou la planification stratégique.`
  };
  const favorableNumbersSuggestions = favorableNumbersSuggestionsDict[lang] || favorableNumbersSuggestionsDict.pt;

  // 4 & 16. Melhor Horário
  const bestPeriodReasonDict: Record<string, string> = {
    pt: `Pico de harmonização planetária entre ${translatedTpName} transitando e seu ${translatedNpName} natal.`,
    en: `Peak alignment between transiting ${translatedTpName} and your natal ${translatedNpName}.`,
    es: `Pico de armonización planetaria entre ${translatedTpName} en tránsito y tu ${translatedNpName} natal.`,
    de: `Höchste planetare Harmonie zwischen dem transitierenden ${translatedTpName} und Ihrem gebürtigen ${translatedNpName}.`,
    fr: `Pics d'harmonisation planétaire entre ${translatedTpName} en transit et votre ${translatedNpName} natal.`
  };
  const bestPeriodReason = bestPeriodReasonDict[lang] || bestPeriodReasonDict.pt;

  const bestPeriodActivitiesDict: Record<string, string[]> = {
    pt: ["Planejamento estratégico", "Diálogos importantes", "Tomada de decisões"],
    en: ["Strategic planning", "Important dialogues", "Decision making"],
    es: ["Planificación estratégica", "Diálogos importantes", "Toma de decisiones"],
    de: ["Strategische Planung", "Wichtige Dialoge", "Entscheidungsfindung"],
    fr: ["Planification stratégique", "Dialogues importants", "Prise de décision"]
  };
  const bestPeriodActivities = bestPeriodActivitiesDict[lang] || bestPeriodActivitiesDict.pt;

  // 5 & 17. Horário de Atenção
  const attentionPeriodChallengesDict: Record<string, string> = {
    pt: `Possível fricção mental ou dispersão externa em relação a ${attentionAreas[0]}.`,
    en: `Potential mental friction or external pressure related to ${attentionAreas[0]}.`,
    es: `Posible fricción mental o dispersión externa relacionada con ${attentionAreas[0]}.`,
    de: `Mögliche mentale Reibung oder externe Zerstreuung in Bezug auf ${attentionAreas[0]}.`,
    fr: `Friction mentale potentielle ou dispersion externe concernant ${attentionAreas[0]}.`
  };
  const attentionPeriodChallenges = attentionPeriodChallengesDict[lang] || attentionPeriodChallengesDict.pt;

  const attentionPeriodStrategiesDict: Record<string, string> = {
    pt: `Mantenha a serenidade emocional, evite compras por impulso e pratique respiração consciente.`,
    en: `Maintain emotional stillness, postpone impulse purchases, and practice conscious breathing.`,
    es: `Mantén la serenidad emocional, evita compras por impulso y practica respiración consciente.`,
    de: `Bewahren Sie emotionale Gelassenheit, vermeiden Sie Impulskäufe und üben Sie bewusstes Atmen.`,
    fr: `Maintenez la sérénité émotionnelle, évitez les achats impulsifs et pratiquez la respiration consciente.`
  };
  const attentionPeriodStrategies = attentionPeriodStrategiesDict[lang] || attentionPeriodStrategiesDict.pt;

  // 6. Influência Astrológica e Intensidade
  const intensityMap: Record<string, { high: string; mod: string; int: string }> = {
    pt: { high: "Alta / Expansiva", mod: "Moderada / Fluida", int: "Intensa / Reflexiva" },
    en: { high: "High / Expansive", mod: "Moderate / Fluid", int: "Intense / Reflective" },
    es: { high: "Alta / Expansiva", mod: "Moderada / Fluida", int: "Intensa / Reflexiva" },
    de: { high: "Hoch / Expansiv", mod: "Moderat / Fließend", int: "Intensiv / Reflektiert" },
    fr: { high: "Élevée / Expansive", mod: "Modérée / Fluide", int: "Intense / Réfléchie" }
  };
  const currentIntensity = intensityMap[lang] || intensityMap.pt;
  const astroIntensity = (energyLevel > 80) ? currentIntensity.high : (energyLevel > 65) ? currentIntensity.mod : currentIntensity.int;

  const personalImpactDict: Record<string, string> = {
    pt: `Ativa diretamente o seu Sol em ${translatedSunSign}, fortalecendo a essência do seu propósito.`,
    en: `Directly activates your Sun in ${translatedSunSign}, strengthening core identity and purpose.`,
    es: `Activa directamente tu Sol en ${translatedSunSign}, fortaleciendo la esencia de tu propósito.`,
    de: `Aktiviert direkt Ihre Sonne in ${translatedSunSign} und stärkt den Kern Ihres Zwecks.`,
    fr: `Active directement votre Soleil en ${translatedSunSign}, renforçant l'essence de votre objectif.`
  };
  const personalImpact = personalImpactDict[lang] || personalImpactDict.pt;

  // 7. Aspectos Planetários do Dia
  const aspectsPracticalInfluenceDict: Record<string, string> = {
    pt: `Aspecto de ${translatedAspectName} gera um impulso dinâmico nos assuntos da sua ${houseDetails}.`,
    en: `Aspect of ${translatedAspectName} generates dynamic momentum in ${houseDetails}.`,
    es: `Aspecto de ${translatedAspectName} genera un impulso dinámico en los asuntos de tu ${houseDetails}.`,
    de: `Der Aspekt ${translatedAspectName} erzeugt einen dynamischen Impuls in Ihrem ${houseDetails}.`,
    fr: `L'aspect ${translatedAspectName} génère un élan dynamique dans votre ${houseDetails}.`
  };
  const aspectsPracticalInfluence = aspectsPracticalInfluenceDict[lang] || aspectsPracticalInfluenceDict.pt;

  const aspectsInterpretationDict: Record<string, string> = {
    pt: `Harmoniza a passagem de ${translatedTpName} pelo seu mapa natal com foco em progresso consciente.`,
    en: `Harmonizes transiting ${translatedTpName} with natal ${translatedNpName} for constructive progress.`,
    es: `Armoniza el paso de ${translatedTpName} por tu mapa natal enfocado en el progreso consciente.`,
    de: `Harmonisiert den Transit von ${translatedTpName} mit Ihrem gebürtigen ${translatedNpName} für bewussten Fortschritt.`,
    fr: `Harmonise le passage de ${translatedTpName} sur votre thème natal avec un accent sur le progrès conscient.`
  };
  const aspectsInterpretation = aspectsInterpretationDict[lang] || aspectsInterpretationDict.pt;

  // 8. Trânsitos Celestes
  const transitNatalImpactDict: Record<string, string> = {
    pt: `${translatedTpName} em trânsito movimenta a sua ${houseDetails}, abrindo espaço para desenvolvimento.`,
    en: `Transiting ${translatedTpName} activates your ${houseDetails}, opening space for development.`,
    es: `${translatedTpName} en tránsito mueve tu ${houseDetails}, abriendo espacio para el desarrollo.`,
    de: `Der transitierende ${translatedTpName} bewegt Ihr ${houseDetails} und eröffnet Raum für Entwicklung.`,
    fr: `${translatedTpName} en transit active votre ${houseDetails}, ouvrant de l'espace pour le développement.`
  };
  const transitNatalImpact = transitNatalImpactDict[lang] || transitNatalImpactDict.pt;

  const transitOpportunitiesDict: Record<string, string> = {
    pt: `Direcione esforços para ${favoredAreas.join(', ')}.`,
    en: `Focus efforts on ${favoredAreas.join(', ')}.`,
    es: `Dirige esfuerzos hacia ${favoredAreas.join(', ')}.`,
    de: `Richten Sie Ihre Anstrengungen auf ${favoredAreas.join(', ')}.`,
    fr: `Orientez vos efforts vers ${favoredAreas.join(', ')}.`
  };
  const transitOpportunities = transitOpportunitiesDict[lang] || transitOpportunitiesDict.pt;

  // 9. Lua
  const moonEmotionalInfluenceDict: Record<string, string> = {
    pt: `A ${moonPhase.name} em ${moonPhase.sign} estabiliza as reações emocionais e eleva a percepção intuitiva.`,
    en: `${moonPhase.name} in ${moonPhase.sign} stabilizes emotional reactions and heightens intuitive clarity.`,
    es: `La ${moonPhase.name} en ${moonPhase.sign} estabiliza las reacciones emocionales y eleva la percepción intuitiva.`,
    de: `Der ${moonPhase.name} im ${moonPhase.sign} stabilisiert emotionale Reaktionen und erhöht die intuitive Klarheit.`,
    fr: `La ${moonPhase.name} en ${moonPhase.sign} stabilise les réactions émotionnelles et élève la clarté intuitive.`
  };
  const moonEmotionalInfluence = moonEmotionalInfluenceDict[lang] || moonEmotionalInfluenceDict.pt;

  const moonPracticalApplicationsDict: Record<string, string> = {
    pt: `Fase ideal para alinhar prioridades, organizar compromissos e eliminar ruídos desnecessários.`,
    en: `Ideal phase to align priorities, organize commitments, and clear clutter.`,
    es: `Fase ideal para alinear prioridades, organizar compromisos y eliminar ruidos innecesarios.`,
    de: `Ideale Phase, um Prioritäten auszurichten, Verpflichtungen zu organisieren und Störungen zu beseitigen.`,
    fr: `Phase idéale pour aligner les priorités, organiser les engagements et éliminer le bruit inutile.`
  };
  const moonPracticalApplications = moonPracticalApplicationsDict[lang] || moonPracticalApplicationsDict.pt;

  // 10. Energia Predominante
  const energyDetailsDict: Record<string, { emotional: string; spiritual: string; mental: string; physical: string }> = {
    pt: { emotional: "Equilibrada & Consciente", spiritual: "Elevada & Sintonizada", mental: "Estratégica & Ágil", physical: "Vigorosa & Ancorada" },
    en: { emotional: "Balanced & Conscious", spiritual: "Elevated & Connected", mental: "Strategic & Agile", physical: "Vigorous & Grounded" },
    es: { emotional: "Equilibrada y Consciente", spiritual: "Elevada y Sintonizada", mental: "Estratégica y Ágil", physical: "Vigorosa y Anclada" },
    de: { emotional: "Ausgeglichen & Bewusst", spiritual: "Erhöht & Einstimmt", mental: "Strategisch & Agil", physical: "Kraftvoll & Verankert" },
    fr: { emotional: "Équilibrée & Consciente", spiritual: "Élevée & Connectée", mental: "Stratégique & Agile", physical: "Vigoureuse & Ancrée" }
  };
  const energyDetails = energyDetailsDict[lang] || energyDetailsDict.pt;

  // 11. Oportunidades por Setor
  type SectorOpps = {
    work: string;
    studies: string;
    love: string;
    money: string;
    family: string;
    creativity: string;
    spirituality: string;
  };
  const sectorOpportunitiesDict: Record<string, SectorOpps> = {
    pt: {
      work: `Foco elevado para execução em ${favoredAreas[0]}`,
      studies: `Excelente clareza mental e absorção de conhecimentos`,
      love: `Diálogos harmoniosos e expressão autêntica`,
      money: `Consciência na gestão de recursos e despesas`,
      family: `Acolhimento e estabilidade no ambiente familiar`,
      creativity: `Solução fluida de problemas e surgimento de ideias`,
      spirituality: `Frequência receptiva para meditação e intuição`
    },
    en: {
      work: `High focus on execution in ${favoredAreas[0]}`,
      studies: `Excellent mental clarity and absorption`,
      love: `Harmonious dialogues and authentic expression`,
      money: `Awareness in resource management`,
      family: `Warmth and stability in domestic circle`,
      creativity: `Fluid problem solving and ideas`,
      spirituality: `Receptive frequency for meditation`
    },
    es: {
      work: `Gran enfoque de ejecución en ${favoredAreas[0]}`,
      studies: `Excelente claridad mental y absorción de conocimientos`,
      love: `Diálogos armoniosos y expresión auténtica`,
      money: `Conciencia en la gestión de recursos y gastos`,
      family: `Acogida y estabilidad en el entorno familiar`,
      creativity: `Solución fluida de problemas y surgimiento de ideas`,
      spirituality: `Frecuencia receptiva para meditación e intuición`
    },
    de: {
      work: `Hoher Ausführungsfokus bei ${favoredAreas[0]}`,
      studies: `Hervorragende mentale Klarheit und Aufnahme von Wissen`,
      love: `Harmonische Dialoge und authentischer Ausdruck`,
      money: `Bewusstsein bei der Verwaltung von Ressourcen`,
      family: `Wärme und Stabilität im familiären Umfeld`,
      creativity: `Flüssige Problemlösung und Entstehen von Ideen`,
      spirituality: `Empfängliche Frequenz für Meditation und Intuition`
    },
    fr: {
      work: `Fort accent sur l'exécution dans ${favoredAreas[0]}`,
      studies: `Excellente clarté mentale et absorption des connaissances`,
      love: `Dialogues harmonieux et expression authentique`,
      money: `Prise de conscience dans la gestion des ressources`,
      family: `Chaleur et stabilité dans le cercle familial`,
      creativity: `Résolution fluide des problèmes et émergence d'idées`,
      spirituality: `Fréquence réceptive pour la méditation et l'intuition`
    }
  };
  const sectorOpportunities = sectorOpportunitiesDict[lang] || sectorOpportunitiesDict.pt;

  // 12 & 13. Áreas Favorecidas & Atenção Detalhadas
  const favoredAreasDetailDict: Record<string, string> = {
    pt: `Sua geometria planetária do dia favorece expressivamente avanços em ${favoredAreas.join(', ')}.`,
    en: `Your planetary geometry strongly supports progress in ${favoredAreas.join(', ')}.`,
    es: `Tu geometría planetaria del día favorece expresivamente avances en ${favoredAreas.join(', ')}.`,
    de: `Ihre tägliche planetare Geometrie unterstützt Fortschritte in ${favoredAreas.join(', ')} stark.`,
    fr: `Votre géométrie planétaire du jour favorise fortement les progrès dans ${favoredAreas.join(', ')}.`
  };
  const favoredAreasDetail = favoredAreasDetailDict[lang] || favoredAreasDetailDict.pt;

  const attentionAreasDetailDict: Record<string, string> = {
    pt: `Exercite prudência com ${attentionAreas.join(', ')} para evitar desgastes desnecessários.`,
    en: `Exercise caution around ${attentionAreas.join(', ')} to prevent unnecessary friction.`,
    es: `Ejercita prudencia con ${attentionAreas.join(', ')} para evitar desgastes innecesarios.`,
    de: `Üben Sie Vorsicht bei ${attentionAreas.join(', ')}, um unnötige Reibungen zu vermeiden.`,
    fr: `Faites preuve de prudence concernant ${attentionAreas.join(', ')} pour éviter les frictions inutiles.`
  };
  const attentionAreasDetail = attentionAreasDetailDict[lang] || attentionAreasDetailDict.pt;

  const riskMitigationDict: Record<string, string> = {
    pt: `Pause antes de responder, confira detalhes e evite ações precipitadas.`,
    en: `Pause before reacting, verify details, and avoid impulse actions.`,
    es: `Pausa antes de responder, verifica detalles y evita acciones precipitadas.`,
    de: `Halten Sie inne, bevor Sie reagieren, überprüfen Sie Details und vermeiden Sie Impulshandlungen.`,
    fr: `Faites une pause avant de réagir, vérifiez les détails et évitez les actions impulsives.`
  };
  const riskMitigation = riskMitigationDict[lang] || riskMitigationDict.pt;

  // 14. Desafios Projetados
  const challengeOriginDict: Record<string, string> = {
    pt: `Tensão ou exigência decorrente do trânsito de ${translatedTpName} sobre o ${translatedNpName} natal.`,
    en: `Tension or demand arising from transiting ${translatedTpName} relative to natal ${translatedNpName}.`,
    es: `Tensión o exigencia derivada del tránsito de ${translatedTpName} sobre tu ${translatedNpName} natal.`,
    de: `Spannung oder Anforderung aus dem Transit von ${translatedTpName} in Bezug auf Ihren gebürtigen ${translatedNpName}.`,
    fr: `Tension ou exigence découlant du transit de ${translatedTpName} par rapport à votre ${translatedNpName} natal.`
  };
  const challengeOrigin = challengeOriginDict[lang] || challengeOriginDict.pt;

  const challengeStrategyDict: Record<string, string> = {
    pt: `Aplique observação paciente e pautando decisões estritamente em fatos.`,
    en: `Apply patient observation and ground decisions strictly in facts.`,
    es: `Aplica observación paciente y basa decisiones strictly en hechos.`,
    de: `Wenden Sie geduldige Beobachtung an und stützen Sie Entscheidungen streng auf Fakten.`,
    fr: `Appliquez une observation patiente et basez vos décisions strictement sur les faits.`
  };
  const challengeStrategy = challengeStrategyDict[lang] || challengeStrategyDict.pt;

  // Novos Atributos
  const keywordsListDict: Record<string, string[]> = {
    pt: ["Clareza", "Foco", "Expansão", "Ancoragem", "Liderança", "Harmonia", "Visão", "Domínio"],
    en: ["Clarity", "Focus", "Expansion", "Grounding", "Leadership", "Harmony", "Vision", "Mastery"],
    es: ["Claridad", "Enfoque", "Expansión", "Anclaje", "Liderazgo", "Armonía", "Visión", "Dominio"],
    de: ["Klarheit", "Fokus", "Expansion", "Verankerung", "Führung", "Harmonie", "Vision", "Meisterschaft"],
    fr: ["Clarté", "Focus", "Expansion", "Ancrage", "Leadership", "Harmonie", "Vision", "Maîtrise"]
  };
  const keywordsList = keywordsListDict[lang] || keywordsListDict.pt;
  const keyword = keywordsList[daySeed % keywordsList.length];

  const emotionsListDict: Record<string, string[]> = {
    pt: ["Entusiasmo Construtivo", "Serenidade Focada", "Calma Confiante", "Determinação Inspirada"],
    en: ["Constructive Enthusiasm", "Focused Serenity", "Confident Calm", "Inspired Determination"],
    es: ["Entusiasmo Constructivo", "Serenidad Enfocada", "Calma Confiante", "Determinación Inspirada"],
    de: ["Konstruktiver Enthusiasmus", "Fokussierte Gelassenheit", "Zuversichtliche Ruhe", "Inspirierte Entschlossenheit"],
    fr: ["Enthousiasme Constructif", "Sérénité Focalisée", "Calme Confiant", "Détermination Inspirée"]
  };
  const emotionsList = emotionsListDict[lang] || emotionsListDict.pt;
  const predominantEmotion = emotionsList[daySeed % emotionsList.length];

  const elementsByHouseDict: Record<string, Record<number, string>> = {
    pt: { 1: "Fogo", 2: "Terra", 3: "Ar", 4: "Água", 5: "Fogo", 6: "Terra", 7: "Ar", 8: "Água", 9: "Fogo", 10: "Terra", 11: "Ar", 12: "Água" },
    en: { 1: "Fire", 2: "Earth", 3: "Air", 4: "Water", 5: "Fire", 6: "Earth", 7: "Air", 8: "Water", 9: "Fire", 10: "Earth", 11: "Air", 12: "Water" },
    es: { 1: "Fuego", 2: "Tierra", 3: "Aire", 4: "Agua", 5: "Fuego", 6: "Tierra", 7: "Aire", 8: "Agua", 9: "Fuego", 10: "Tierra", 11: "Aire", 12: "Agua" },
    de: { 1: "Feuer", 2: "Erde", 3: "Luft", 4: "Wasser", 5: "Feuer", 6: "Erde", 7: "Luft", 8: "Wasser", 9: "Feuer", 10: "Erde", 11: "Luft", 12: "Wasser" },
    fr: { 1: "Feu", 2: "Terre", 3: "Air", 4: "Eau", 5: "Feu", 6: "Terre", 7: "Air", 8: "Eau", 9: "Feu", 10: "Terre", 11: "Air", 12: "Eau" }
  };
  const elementsByHouse = elementsByHouseDict[lang] || elementsByHouseDict.pt;
  const dominantElement = elementsByHouse[houseNum] || elementsByHouse[1];

  const rulingPlanet = translatedTpName;
  const mostActivatedHouse = houseNum;
  const mostActivatedHouseDetails = houseDetails;

  const productivityIndex = Math.min(99, Math.max(50, energyLevel + 2));
  const emotionalIndex = Math.min(98, Math.max(45, energyLevel - 3));
  const spiritualIndex = Math.min(99, Math.max(52, 100 - Math.abs(energyLevel - 80)));
  const socialIndex = Math.min(98, Math.max(42, energyLevel + (houseNum % 4) * 3 - 5));
  const financialIndex = Math.min(98, Math.max(48, energyLevel - (houseNum % 3) * 2));

  const bestTimeDecisions = bestPeriod;
  const bestTimeRest = `${String((alertStartHour + 6) % 24).padStart(2, '0')}:30 - 23:00`;
  const bestTimeStudies = `${String((startHour + 5) % 24).padStart(2, '0')}:00 - ${String((startHour + 7) % 24).padStart(2, '0')}:30`;
  const bestTimeRelationships = `${String((startHour + 10) % 24).padStart(2, '0')}:00 - ${String((startHour + 12) % 24).padStart(2, '0')}:30`;

  const ritualsByPlanet: Record<string, string> = {
    pt: `Pratique 5 minutos de respiração diafragmática ao acordar e anote sua meta principal do dia em papel com a cor ${favorableColor}.`,
    en: `Practice 5 minutes of deep breathing upon waking and write your primary goal on a paper using ${favorableColor} tones.`,
    es: `Práctica 5 minutos de respiración profunda al despertar e instruye tu meta principal en papel con la luz de ${favorableColor}.`,
    de: `Atemübung für 5 Minuten nach dem Aufstehen und Notieren des Hauptziels des Tages.`,
    fr: `Pratiquez 5 minutes de respiration profonde au réveil et notez votre objectif principal de la journée.`
  };
  const recommendedRitual = ritualsByPlanet[lang] || ritualsByPlanet.pt;

  // Dynamic Lunar Transit and Sectors
  let lunarTransitAndSectors = "";
  if (lang === "en") {
    lunarTransitAndSectors = `${moonPhase.name} in ${moonPhase.sign} activating your ${houseDetails}`;
  } else if (lang === "es") {
    lunarTransitAndSectors = `${moonPhase.name} en ${moonPhase.sign} activando tu ${houseDetails}`;
  } else if (lang === "de") {
    lunarTransitAndSectors = `${moonPhase.name} im ${moonPhase.sign} aktiviert Ihr ${houseDetails}`;
  } else if (lang === "fr") {
    lunarTransitAndSectors = `${moonPhase.name} en ${moonPhase.sign} activant votre ${houseDetails}`;
  } else {
    lunarTransitAndSectors = `${moonPhase.name} em ${moonPhase.sign} ativando a sua ${houseDetails}`;
  }

  // Dynamic Planetary Aspects array
  const secondaryPlanetList = ["Vênus", "Marte", "Júpiter", "Saturno", "Mercúrio", "Sol"];
  const secondaryAspectTypes = ["Trígono", "Sextil", "Conjunção", "Quadratura"];
  
  const secP1 = secondaryPlanetList[daySeed % secondaryPlanetList.length];
  const secP2 = secondaryPlanetList[(daySeed + 2) % secondaryPlanetList.length];
  const secAsp1 = secondaryAspectTypes[daySeed % secondaryAspectTypes.length];
  const secAsp2 = secondaryAspectTypes[(daySeed + 1) % secondaryAspectTypes.length];

  const translatedP1 = PLANET_TRANSLATIONS[lang]?.[secP1] || secP1;
  const translatedP2 = PLANET_TRANSLATIONS[lang]?.[secP2] || secP2;
  const translatedAsp1 = ASPECT_TRANSLATIONS[lang]?.[secAsp1] || secAsp1;
  const translatedAsp2 = ASPECT_TRANSLATIONS[lang]?.[secAsp2] || secAsp2;

  const dailyPlanetaryAspects: string[] = [
    `${translatedTpName} ${translatedAspectName.toLowerCase()} ${translatedNpName}`,
    `${translatedP1} ${translatedAsp1.toLowerCase()} ${translatedP2}`,
    `${translatedTpName} — ${houseDetails}`
  ];

  return {
    dayNumber,
    date: targetDate,
    dateFormatted,
    tagText,
    tagColorClass,
    lunarTransitAndSectors,
    dailyPlanetaryAspects,

    // 1
    summary,
    astroInfluence,

    // 2
    favorableColor,
    favorableColorReason,
    favorableColorUsage,
    favorableColorExamples,

    // 3
    favorableNumber,
    favorableNumbersList,
    favorableNumbersMeaning,
    favorableNumbersSuggestions,

    // 4 & 16
    bestPeriod,
    bestPeriodReason,
    bestPeriodActivities,

    // 5 & 17
    attentionPeriod,
    attentionPeriodChallenges,
    attentionPeriodStrategies,

    // 6
    astroIntensity,
    personalImpact,

    // 7
    aspects: aspectText,
    aspectsPracticalInfluence,
    aspectsInterpretation,

    // 8
    transit,
    transitNatalImpact,
    transitOpportunities,

    // 9
    moonPhase,
    moonEmotionalInfluence,
    moonPracticalApplications,

    // 10
    predominantEnergy,
    energyDetails,

    // 11
    opportunities,
    sectorOpportunities,

    // 12
    favoredAreas,
    favoredAreasDetail,

    // 13
    attentionAreas,
    attentionAreasDetail,
    riskMitigation,

    // 14
    challenges,
    challengeOrigin,
    challengeStrategy,

    // 15 & 18
    personalizedAdvice,

    // 19
    personalizedMessage,

    // Novos Atributos
    keyword,
    predominantEmotion,
    dominantElement,
    rulingPlanet,
    mostActivatedHouse,
    mostActivatedHouseDetails,

    energyLevel,
    productivityIndex,
    emotionalIndex,
    spiritualIndex,
    socialIndex,
    financialIndex,

    bestTimeDecisions,
    bestTimeRest,
    bestTimeStudies,
    bestTimeRelationships,
    recommendedRitual,

    categoryMatches,
    houseDetails,
    numerology,
    frequency
  };
}

// Master function to compute all days of any given Month
export function getMonthlyCalendarPredictions(
  year: number,
  month: number, // 0-indexed (0 = Jan, 11 = Dec)
  userBirthDate: string,
  userSunSign: string,
  userName: string,
  langParam?: string,
  mapData?: any,
  userCoordinates?: { latitude: number; longitude: number }
): DailyPrediction[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const predictions: DailyPrediction[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const targetDate = new Date(year, month, day, 12, 0, 0);
    const prediction = generateDailyPrediction(
      userBirthDate,
      userSunSign,
      userName,
      day - 1,
      targetDate,
      langParam,
      mapData,
      userCoordinates,
      targetDate
    );
    predictions.push(prediction);
  }

  return predictions;
}

