import { calculateLifePathNumber } from '../prosperityEngine';
import i18next from 'i18next';
// @ts-ignore
import ephemeris from 'ephemeris';

export interface DailyPrediction {
  date: Date;
  dateFormatted: string;
  tagText: string;
  tagColorClass: string;
  astroInfluence: string;
  aspects: string;
  transit: string;
  predominantEnergy: string;
  energyLevel: number;
  favoredAreas: string[];
  attentionAreas: string[];
  opportunities: string;
  challenges: string;
  personalizedAdvice: string;
  favorableColor: string;
  favorableNumber: number;
  bestPeriod: string;
  attentionPeriod: string;
  personalizedMessage: string;
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

function getTransitPositions(date: Date, latitude: number, longitude: number): Record<string, number> | null {
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
      return positions;
    }
  } catch (e) {
    console.error("Error calculating transit positions in engine:", e);
  }
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

export function generateDailyPrediction(
  userBirthDate: string,
  userSunSign: string,
  userName: string,
  selectedDayIndex: number,
  currentDate: Date,
  langParam?: string,
  mapData?: any,
  userCoordinates?: { latitude: number; longitude: number }
): DailyPrediction {
  const targetDate = new Date(currentDate.getTime() + selectedDayIndex * 24 * 60 * 60 * 1000);
  const lang = (langParam || getActiveLanguage()) as 'pt' | 'en' | 'es' | 'de' | 'fr';
  
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
    // Widen orbs if none found
    foundAspects = findAspects(transitPositions, natalPositions, true);
  }
  
  // Sort aspects by tightest orb
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
    // 100% real calculation regardless of orb limits
    const closest = findClosestAspectRegardlessOfOrb(transitPositions, natalPositions);
    if (closest) {
      tp = closest.transitPlanet;
      np = closest.natalPlanet;
      aspectType = closest.aspectType;
      diff = closest.diff;
    } else {
      // absolute safety fallback (extremely theoretical)
      tp = "Sol";
      np = "Sol";
      aspectType = "Trígono";
      diff = 0;
    }
  }
  
  // Create beautiful translated text for the real aspect
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
  
  // Tag and tag styles
  let tagText = "";
  let tagColorClass = "bg-slate-950 border-slate-800 text-slate-350";
  
  if (aspectType === "Trígono" || aspectType === "Sextil") {
    tagText = TRANSLATED_TAGS[lang][0]; // Favorable
    tagColorClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold";
  } else if (aspectType === "Quadratura") {
    tagText = TRANSLATED_TAGS[lang][1]; // Attention
    tagColorClass = "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold";
  } else if (aspectType === "Oposição") {
    tagText = TRANSLATED_TAGS[lang][1]; // Attention / Rest
    tagColorClass = "bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold";
  } else if (aspectType === "Conjunção") {
    tagText = TRANSLATED_TAGS[lang][4]; // Focus
    tagColorClass = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold";
  } else {
    tagText = TRANSLATED_TAGS[lang][2]; // Productive
    tagColorClass = "bg-sky-500/10 border-sky-500/20 text-sky-450 font-bold";
  }
  
  // Custom interpretation
  const aspectMeanings = ASPECT_MEANINGS[lang]?.[aspectType] || ASPECT_MEANINGS["pt"]["Trígono"];
  const detailedInfluence = aspectMeanings[tp] || aspectMeanings["general"] || "";
  const astroInfluence = `${detailedInfluence} ${ASPECT_MEANINGS[lang]?.[aspectType]?.general || ""}`;
  
  // Resolve transit position text
  const lonVal = transitPositions[tp];
  let transit = "";
  if (lonVal !== undefined) {
    const signsList = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
    const signIdx = Math.floor(lonVal / 30) % 12;
    const sName = signsList[signIdx];
    const translatedSName = TRANSLATED_SIGNS[lang]?.[sName] || sName;
    const translatedTpName = PLANET_TRANSLATIONS[lang]?.[tp] || tp;
    
    if (lang === "pt") {
      transit = `${translatedTpName} transitando em ${translatedSName}.`;
    } else if (lang === "en") {
      transit = `${translatedTpName} transiting in ${translatedSName}.`;
    } else if (lang === "es") {
      transit = `${translatedTpName} transitando en ${translatedSName}.`;
    } else if (lang === "de") {
      transit = `${translatedTpName} transitiert in ${translatedSName}.`;
    } else {
      transit = `${translatedTpName} transitant en ${translatedSName}.`;
    }
  } else {
    transit = TRANSLATED_TRANSITS[lang][selectedDayIndex % TRANSLATED_TRANSITS[lang].length];
  }
  
  // Predominant energy
  const planetTemplates = PLANET_ENERGY_TEMPLATES[lang]?.[tp] || PLANET_ENERGY_TEMPLATES["pt"]["Sol"];
  const predominantEnergy = planetTemplates.energy;
  const opportunities = planetTemplates.opp;
  const challenges = planetTemplates.chal;
  
  // Energy level (Trine/Sextile: high, Square/Opp: medium/low, Conj: variable)
  let energyLevel = 75;
  if (aspectType === "Trígono" || aspectType === "Sextil") {
    energyLevel = 88 + (selectedDayIndex % 11);
  } else if (aspectType === "Quadratura") {
    energyLevel = 58 + (selectedDayIndex % 13);
  } else if (aspectType === "Oposição") {
    energyLevel = 65 + (selectedDayIndex % 12);
  } else {
    energyLevel = 78 + (selectedDayIndex % 15);
  }
  
  // Favored and attention areas based on transit planet
  const planetAreas: Record<string, string[][]> = {
    "Sol": [["Carreira", "Liderança", "Projetos Pessoais"], ["Descanso", "Impulsividade", "Ego"]],
    "Lua": [["Autocuidado", "Meditação", "Intuição"], ["Trabalho sob pressão", "Finanças", "Ansiedade"]],
    "Mercúrio": [["Estudos", "Leituras", "Negociações"], ["Foco prolongado", "Rotina rígida", "Ansiedade mental"]],
    "Vênus": [["Amor", "Socialização", "Finanças"], ["Cobranças afetivas", "Gastos por impulso", "Vaidade"]],
    "Marte": [["Exercícios", "Iniciativas", "Vigor Físico"], ["Diálogos tensos", "Paciência", "Rotina lenta"]],
    "Júpiter": [["Expansão", "Estudos Avançados", "Viagens"], ["Detalhes pequenos", "Excessos", "Gastos"]],
    "Saturno": [["Planejamento", "Organização", "Finanças"], ["Auto-cobrança", "Desânimo", "Improvissos"]],
    "Urano": [["Criatividade", "Inovação", "Ideias"], ["Atividades monótonas", "Paciência", "Ansiedade"]],
    "Netuno": [["Inspiração", "Sonhos", "Espiritualidade"], ["Clareza objetiva", "Burocracia", "Contratos"]],
    "Plutão": [["Renovação", "Desapego", "Cura"], ["Disputas de poder", "Teimosia", "Ansiedade acumulada"]]
  };

  const TRANSLATED_AREAS_LOCAL: Record<string, Record<string, string>> = {
    pt: {
      "Carreira": "Carreira", "Liderança": "Liderança", "Projetos Pessoais": "Projetos Pessoais", "Descanso": "Descanso", "Impulsividade": "Impulsividade", "Ego": "Ego",
      "Autocuidado": "Autocuidado", "Meditação": "Meditação", "Intuição": "Intuição", "Trabalho sob pressão": "Trabalho sob pressão", "Finanças": "Finanças", "Ansiedade": "Ansiedade",
      "Estudos": "Estudos", "Leituras": "Leituras", "Negociações": "Negociações", "Foco prolongado": "Foco prolongado", "Rotina rígida": "Rotina rígida", "Ansiedade mental": "Ansiedade mental",
      "Amor": "Amor", "Socialização": "Socialização", "Cobranças afetivas": "Cobranças afetivas", "Gastos por impulso": "Gastos por impulso", "Vaidade": "Vaidade",
      "Exercícios": "Exercícios", "Iniciativas": "Iniciativas", "Vigor Físico": "Vigor Físico", "Diálogos tensos": "Diálogos tensos", "Paciência": "Paciência", "Rotina lenta": "Rotina lenta",
      "Expansão": "Expansão", "Estudos Avançados": "Estudos Avançados", "Viagens": "Viagens", "Detalhes pequenos": "Detalhes pequenos", "Excessos": "Excessos", "Gastos": "Gastos",
      "Planejamento": "Planejamento", "Organização": "Organização", "Auto-cobrança": "Auto-cobrança", "Desânimo": "Desânimo", "Improvissos": "Improvissos",
      "Criatividade": "Criatividade", "Inovação": "Inovação", "Ideias": "Ideias", "Atividades monótonas": "Atividades monótonas",
      "Inspiração": "Inspiração", "Sonhos": "Sonhos", "Espiritualidade": "Espiritualidade", "Clareza objetiva": "Clareza objetiva", "Burocracia": "Burocracia", "Contratos": "Contratos",
      "Renovação": "Renovação", "Desapego": "Desapego", "Cura": "Cura", "Disputas de poder": "Disputas de poder", "Teimosia": "Teimosia", "Ansiedade acumulada": "Ansiedade acumulada"
    },
    en: {
      "Carreira": "Career", "Liderança": "Leadership", "Projetos Pessoais": "Personal Projects", "Descanso": "Rest", "Impulsividade": "Impulsivity", "Ego": "Ego",
      "Autocuidado": "Self-care", "Meditação": "Meditation", "Intuição": "Intuition", "Trabalho sob pressão": "Work under pressure", "Finanças": "Finances", "Ansiedade": "Anxiety",
      "Estudos": "Studies", "Leituras": "Readings", "Negociações": "Negotiations", "Foco prolongado": "Prolonged focus", "Rotina rígida": "Rigid routine", "Ansiedade mental": "Mental anxiety",
      "Amor": "Love", "Socialização": "Socializing", "Cobranças afetivas": "Affective demands", "Gastos por impulso": "Impulse spending", "Vaidade": "Vanity",
      "Exercícios": "Exercises", "Iniciativas": "Initiatives", "Vigor Físico": "Physical Vigor", "Diálogos tensos": "Tense dialogues", "Paciência": "Patience", "Rotina lenta": "Slow routine",
      "Expansão": "Expansion", "Estudos Avançados": "Advanced Studies", "Viagens": "Travel", "Detalhes pequenos": "Small details", "Excessos": "Excesses", "Gastos": "Spending",
      "Planejamento": "Planning", "Organização": "Organization", "Auto-cobrança": "Self-demands", "Desânimo": "Discouragement", "Improvissos": "Unforeseen events",
      "Criatividade": "Creativity", "Inovação": "Innovation", "Ideias": "Ideas", "Atividades monótonas": "Monotonous activities",
      "Inspiração": "Inspiration", "Sonhos": "Dreams", "Espiritualidade": "Spirituality", "Clareza objetiva": "Objective clarity", "Burocracia": "Bureaucracy", "Contratos": "Contracts",
      "Renovação": "Renovation", "Desapego": "Letting go", "Cura": "Healing", "Disputas de poder": "Power disputes", "Teimosia": "Stubbornness", "Ansiedade acumulada": "Accumulated anxiety"
    },
    es: {
      "Carreira": "Carrera", "Liderança": "Liderazgo", "Projetos Pessoais": "Proyectos Personales", "Descanso": "Descanso", "Impulsividade": "Impulsividad", "Ego": "Ego",
      "Autocuidado": "Autocuidado", "Meditação": "Meditación", "Intuição": "Intuición", "Trabalho sob pressão": "Trabajo bajo presión", "Finanças": "Finanzas", "Ansiedade": "Ansiedad",
      "Estudos": "Estudios", "Leituras": "Lecturas", "Negociações": "Negociaciones", "Foco prolongado": "Enfoque prolongado", "Rotina rígida": "Rutina rígida", "Ansiedade mental": "Ansiedad mental",
      "Amor": "Amor", "Socialização": "Socialización", "Cobranças afetivas": "Demandas afectivas", "Gastos por impulso": "Gastos impulsivos", "Vaidade": "Vanidad",
      "Exercícios": "Ejercicios", "Iniciativas": "Iniciativas", "Vigor Físico": "Vigor Físico", "Diálogos tensos": "Diálogos tensos", "Paciência": "Paciencia", "Rotina lenta": "Rutina lenta",
      "Expansão": "Expansión", "Estudos Avançados": "Estudios Avanzados", "Viagens": "Viajes", "Detalhes pequenos": "Detalles pequeños", "Excessos": "Excesos", "Gastos": "Gastos",
      "Planejamento": "Planificación", "Organização": "Organización", "Auto-cobrança": "Autoexigencia", "Desânimo": "Desánimo", "Improvissos": "Imprevistos",
      "Criatividade": "Creatividad", "Inovação": "Innovación", "Ideias": "Ideas", "Atividades monótonas": "Actividades monótonas",
      "Inspiração": "Inspiración", "Sonhos": "Sueños", "Espiritualidade": "Espiritualidad", "Clareza objetiva": "Claridad objetiva", "Burocracia": "Burocracia", "Contratos": "Contratos",
      "Renovação": "Renovación", "Desapego": "Desapego", "Cura": "Sanación", "Disputas de poder": "Disputas de poder", "Teimosia": "Obstinación", "Ansiedade acumulada": "Ansiedad acumulada"
    },
    de: {
      "Carreira": "Karriere", "Liderança": "Führung", "Projetos Pessoais": "Persönliche Projekte", "Descanso": "Ruhe", "Impulsividade": "Impulsivität", "Ego": "Ego",
      "Autocuidado": "Selbstfürsorge", "Meditação": "Meditation", "Intuição": "Intuition", "Trabalho sob pressão": "Arbeit unter Druck", "Finanças": "Finanzen", "Ansiedade": "Angst",
      "Estudos": "Studium", "Leituras": "Lesen", "Negociações": "Verhandlungen", "Foco prolongado": "Anhaltender Fokus", "Rotina rígida": "Starre Routine", "Ansiedade mental": "Mentale Angst",
      "Amor": "Liebe", "Socialização": "Sozialisation", "Cobranças afetivas": "Affektive Anforderungen", "Gastos por impulso": "Impulskäufe", "Vaidade": "Eitelkeit",
      "Exercícios": "Übungen", "Iniciativas": "Initiativen", "Vigor Físico": "Körperliche Kraft", "Diálogos tensos": "Angespannte Dialoge", "Paciência": "Geduld", "Rotina lenta": "Langsame Routine",
      "Expansão": "Expansion", "Estudos Avançados": "Fortgeschrittene Studien", "Viagens": "Reisen", "Detalhes pequenos": "Kleine Details", "Excessos": "Exzesse", "Gastos": "Ausgaben",
      "Planejamento": "Planung", "Organização": "Organisation", "Auto-cobrança": "Selbstanforderung", "Desânimo": "Entmutigung", "Improvissos": "Unvorhergesehenes",
      "Criatividade": "Kreativität", "Inovação": "Innovation", "Ideias": "Ideen", "Atividades monótonas": "Monotone Aktivitäten",
      "Inspiração": "Inspiration", "Sonhos": "Träume", "Espiritualidade": "Spiritualität", "Clareza objetiva": "Objektive Klarheit", "Burocracia": "Bürokratie", "Contratos": "Verträge",
      "Renovação": "Erneuerung", "Desapego": "Loslassen", "Cura": "Heilung", "Disputas de poder": "Machtkämpfe", "Teimosia": "Sturheit", "Ansiedade acumulada": "Angestaute Angst"
    },
    fr: {
      "Carreira": "Carrière", "Liderança": "Leadership", "Projetos Pessoais": "Projets Personnels", "Descanso": "Repos", "Impulsividade": "Impulsivité", "Ego": "Ego",
      "Autocuidado": "Soin de soi", "Meditação": "Méditation", "Intuição": "Intuition", "Trabalho sob pressão": "Travail sous pression", "Finanças": "Finances", "Ansiedade": "Anxiété",
      "Estudos": "Études", "Leituras": "Lectures", "Negociações": "Négociations", "Foco prolongado": "Concentration prolongée", "Rotina rígida": "Routine rigide", "Ansiedade mental": "Anxiété mentale",
      "Amor": "Amour", "Socialização": "Socialisation", "Cobranças afetivas": "Exigences affectives", "Gastos por impulso": "Dépenses impulsives", "Vaidade": "Vanité",
      "Exercícios": "Exercices", "Iniciativas": "Initiatives", "Vigor Físico": "Vigueur Physique", "Diálogos tensos": "Dialogues tendus", "Paciência": "Patience", "Routine lente": "Routine lente",
      "Expansão": "Expansion", "Estudos Avançados": "Études Avancées", "Viagens": "Voyages", "Detalhes pequenos": "Petits détails", "Excessos": "Excès", "Gastos": "Dépenses",
      "Planejamento": "Planification", "Organização": "Organisation", "Auto-cobrança": "Exigence de soi", "Desânimo": "Découragement", "Improvissos": "Imprévus",
      "Criatividade": "Créativité", "Inovação": "Innovation", "Ideias": "Idées", "Atividades monótonas": "Activités monotones",
      "Inspiração": "Inspiration", "Sonhos": "Rêves", "Espiritualidade": "Spiritualité", "Clareza objetiva": "Clarté objective", "Burocracia": "Bureaucracy", "Contratos": "Contrats",
      "Renovação": "Renouveau", "Desapego": "Lâcher-prise", "Cura": "Guérison", "Disputas de poder": "Disputes de pouvoir", "Teimosia": "Entêtement", "Ansiedade acumulada": "Anxiété accumulée"
    }
  };

  const currentAreas = planetAreas[tp] || [["Criatividade", "Inovação", "Ideias"], ["Clareza objetiva", "Burocracia", "Contratos"]];
  const favoredAreas = currentAreas[0].map(a => TRANSLATED_AREAS_LOCAL[lang]?.[a] || a);
  const attentionAreas = currentAreas[1].map(a => TRANSLATED_AREAS_LOCAL[lang]?.[a] || a);
  
  // Personalized Advice
  const selectedAdvice = planetTemplates.adv;
  const personalizedAdvice = userName 
    ? `${userName.split(' ')[0]}, ${selectedAdvice}`
    : `${selectedAdvice.charAt(0).toUpperCase()}${selectedAdvice.slice(1)}`;
  
  // Favorable Color & Number
  const pColNum = PLANET_COLORS_NUMBERS[tp] || { color: ["Verde Esmeralda", "Emerald Green", "Verde Esmeralda", "Smaragdgrün", "Vert Émeraude"], number: 5 };
  const favorableColorIdx = { pt: 0, en: 1, es: 2, de: 3, fr: 4 }[lang] || 0;
  const favorableColor = pColNum.color[favorableColorIdx] || pColNum.color[0];
  const favorableNumber = pColNum.number;
  
  // Periods
  const hashSeed = selectedDayIndex + targetDate.getMonth() + targetDate.getDate();
  const bestPeriod = `${String(8 + (hashSeed % 6)).padStart(2, '0')}:00 - ${String(12 + (hashSeed % 4)).padStart(2, '0')}:30`;
  const attentionPeriod = `${String(14 + (hashSeed % 4)).padStart(2, '0')}:00 - ${String(18 + (hashSeed % 3)).padStart(2, '0')}:30`;
  
  const personalizedMessage = TRANSLATED_PERSONALIZED_MESSAGES(lang, userSunSign)[hashSeed % 5];
  
  const localeMap: Record<string, string> = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
    de: 'de-DE',
    fr: 'fr-FR'
  };
  const dateFormatted = targetDate.toLocaleDateString(localeMap[lang] || 'pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return {
    date: targetDate,
    dateFormatted,
    tagText,
    tagColorClass,
    astroInfluence,
    aspects: aspectText,
    transit,
    predominantEnergy,
    energyLevel,
    favoredAreas,
    attentionAreas,
    opportunities,
    challenges,
    personalizedAdvice,
    favorableColor,
    favorableNumber,
    bestPeriod,
    attentionPeriod,
    personalizedMessage
  };
}
