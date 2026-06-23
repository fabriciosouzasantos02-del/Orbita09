import { calculateLifePathNumber } from './prosperityEngine';

export interface DailyPrediction {
  date: Date;
  dateFormatted: string;
  tagText: "Favorável" | "Atenção" | "Produtivo" | "Descanso" | "Foco";
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

const COLORS_FOR_DAYS = [
  "Verde Esmeralda", "Azul Celeste", "Violeta Púrpura", "Dourado Sol",
  "Tons Pastel", "Turquesa Fluido", "Vermelho Rubi", "Laranja Suave"
];

const ENERGIES_PREDOMINANT = [
  "Clareza Concreta & Intuição Ativa",
  "Foco Estruturado & Razão Sutil",
  "Reflexão Pacífica & Limpezas Físicas",
  "Estímulo Comercial & Expansão de Idéias",
  "Magnetismo Pessoal & Atração Fiel",
  "Sensibilidade Doméstica & Conforto",
  "Disciplina de Saturno & Oratórias Práticas",
  "Ousadia Rebelde & Renovação Criativa"
];

const TRANSITS_HOUSES = [
  "Lua transitando pela sua Casa 2 (Recursos Materiais & Valores)",
  "Lua em trânsito pela sua Casa 5 (Criatividade, Autoexpressão e Romances)",
  "Saturno retrógrado tocando em aspecto favorável ao seu Meio do Céu",
  "Sol iluminando sua Casa 9 (Estudos Avançados e Caminhos de Destino)",
  "Mercúrio em conjunção harmoniosa com seus planetas de Ar na Casa 11",
  "Júpiter expandindo as oportunidades de networking na sua Casa 7",
  "Vênus sintonizando energias de beleza e requinte na sua Casa 1",
  "Marte dando vigor físico no seu setor de saúde e bem-estar (Casa 6)"
];

const ASTRO_INFLUENCES = [
  "Lua em sextil harmônico com seu Sol Natal, clareando o discernimento emocional.",
  "Lua em conjunção com seu Ascendente, expandindo o magnetismo pessoal frente a grupos.",
  "Sol em trígono harmónico de elemento com seus astros de Fogo pessoais.",
  "Aspectos de quadratura construtiva exigindo tomadas de decisão firmes na área comercial.",
  "Sextil de Mercúrio com Saturno favorecendo a redação de contratos e auditorias de planilhas.",
  "Trânsito místico favorável canalizando insights profundos em sonhos revelados.",
  "Trígono elemental fortalecendo a união de propósitos entre você e quem ama.",
  "Oposição planetária sob o eixo de destino estimulando você a ponderar vontades alheias."
];

export function generateDailyPrediction(
  userBirthDate: string,
  userSunSign: string,
  userName: string,
  selectedDayIndex: number,
  currentDate: Date
): DailyPrediction {
  const targetDate = new Date(currentDate.getTime() + selectedDayIndex * 24 * 60 * 60 * 1000);
  
  // Deterministic seed generation based on name, birth date, selected index and month/year
  const birthNum = calculateLifePathNumber(userBirthDate);
  const nameLength = userName.length;
  const hashSeed = (birthNum + nameLength + selectedDayIndex + targetDate.getMonth() + targetDate.getFullYear()) % 100;
  
  // Determine energy tag using hashSeed and index
  const tagIndex = (hashSeed + selectedDayIndex) % 5;
  let tagText: "Favorável" | "Atenção" | "Produtivo" | "Descanso" | "Foco" = "Foco";
  let tagColorClass = "bg-slate-950 border-slate-800 text-slate-350";
  
  if (tagIndex === 0) {
    tagText = "Favorável";
    tagColorClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold";
  } else if (tagIndex === 1) {
    tagText = "Atenção";
    tagColorClass = "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold";
  } else if (tagIndex === 2) {
    tagText = "Produtivo";
    tagColorClass = "bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold";
  } else if (tagIndex === 3) {
    tagText = "Descanso";
    tagColorClass = "bg-sky-500/10 border-sky-500/20 text-sky-450 font-bold";
  } else {
    tagText = "Foco";
    tagColorClass = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold";
  }

  // Generate dynamic, real-looking predictions from array indices seeded by hashSeed
  const energyLevel = 60 + ((hashSeed * 7) % 39); // 60 to 98%
  const predominantEnergy = ENERGIES_PREDOMINANT[(hashSeed + 2) % ENERGIES_PREDOMINANT.length];
  const astroInfluence = ASTRO_INFLUENCES[(hashSeed + 5) % ASTRO_INFLUENCES.length];
  const aspectText = `Aspecto de ${(hashSeed % 2 === 0 ? "Sextil" : "Trígono")} de ${(hashSeed % 3 === 0 ? "Vênus" : "Júpiter")} com seus planetas natais, propiciando ${(hashSeed % 2 === 0 ? "suporte prático" : "fluidez total")}.`;
  const transit = TRANSITS_HOUSES[(hashSeed + 8) % TRANSITS_HOUSES.length];
  
  // Custom Areas
  const allAreas = [
    ["Finanças", "Carreira", "Negociações"],
    ["Saúde", "Meditação", "Autocuidado"],
    ["Amor", "Conversas familiares", "Reconciliação"],
    ["Estudos", "Leituras", "Foco operacional"],
    ["Organização", "Planejamento", "Descarte de pendências"]
  ];
  
  const favoredAreas = allAreas[hashSeed % allAreas.length];
  const attentionAreas = allAreas[(hashSeed + 3) % allAreas.length];
  
  const opportunitiesList = [
    "Descobrir um gargalo administrativo que poupa dinheiro",
    "Sintonia mental abrindo as portas de um contato importante",
    "Sentimento de paz profunda curando cansaço residual",
    "Oportunidade de apresentar propostas de vanguarda e ser elogiado",
    "Receber ajuda generosa ou presente sincero sem cobranças"
  ];
  const challengesList = [
    "Controlar o desejo de resolver tudo ao mesmo tempo causando pressa",
    "Evitar envolver-se em conflitos de opinião supérfluos no ambiente",
    "Manter a calma diante de atrasos em correspondências virtuais",
    "Superar o desânimo inicial provocado por intromissões alheias",
    "Evitar compras impulsivas geradas por ansiedade acumulada"
  ];
  
  const opportunities = opportunitiesList[(hashSeed + 1) % opportunitiesList.length];
  const challenges = challengesList[(hashSeed + 4) % challengesList.length];
  
  const advices = [
    `silencie a mente por 5 minutos antes de tomar decisões financeiras.`,
    `dedique tempo para alongar a coluna e descansar seus olhos de telas.`,
    `evite expor seus sonhos primordiais a mentes ruidosas hoje.`,
    `mantenha a retidão jurídica e organize as contas com minúcia.`,
    `faça caminhadas de sola firme e beba bastante água para ajudar os rins.`
  ];
  const selectedAdvice = advices[hashSeed % advices.length];
  const personalizedAdvice = userName 
    ? `${userName.split(' ')[0]}, ${selectedAdvice}`
    : `${selectedAdvice.charAt(0).toUpperCase()}${selectedAdvice.slice(1)}`;
  
  const favorableColor = COLORS_FOR_DAYS[hashSeed % COLORS_FOR_DAYS.length];
  const favorableNumber = (hashSeed % 9) + 1;
  const bestPeriod = `${String(8 + (hashSeed % 6)).padStart(2, '0')}:00 - ${String(12 + (hashSeed % 4)).padStart(2, '0')}:30`;
  const attentionPeriod = `${String(14 + (hashSeed % 4)).padStart(2, '0')}:00 - ${String(18 + (hashSeed % 3)).padStart(2, '0')}:30`;

  const personalizedMessages = [
    `Com seu Sol em ${userSunSign}, o alinhamento planetário do dia acelera suas faculdades mentais de análise rápida, favorecendo cortes de gastos ruidosos.`,
    `A vibração astrológica convida você a encontrar silêncio lúcido no meio do turbilhão de notícias diárias, sintonizando soluções pacíficas.`,
    `A órbita de Vênus apoia as suas relações íntimas. É um dia excelente para emitir oratórias carinhosas e planejar metas de bem-estar com quem você ama.`,
    `A força da sua sintonização celeste aponta para consolidar as bases físicas da sua rotina, permitindo a você concretizar ideias sem estresse.`,
    `Um dia de energia fluida, ideal para assentar as poeiras mentais no solo fértil da clareza e autoconhecimento.`
  ];
  const personalizedMessage = personalizedMessages[hashSeed % personalizedMessages.length];

  const dateFormatted = targetDate.toLocaleDateString('pt-BR', {
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
