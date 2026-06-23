import { getZodiacSignInfo } from './astroMath';

export interface ProsperityMapData {
  monthName: string;
  year: number;
  monthNumber: number;
  favorableColor: {
    name: string;
    hex: string;
    bgClass: string;
    text: string;
  };
  keyword: string;
  amulet: string;
  favoredElement: string;
  favoredLifeArea: string;
  attentionLifeArea: string;
  opportunities: string[];
  challenges: string[];
  strategicAdvice: string;
}

// Helper to compute Life Path Number (Número do Caminho de Vida)
export function calculateLifePathNumber(birthDate: string): number {
  if (!birthDate) return 8; // fallback
  const digits = birthDate.replace(/[^0-9]/g, '');
  let sum = digits.split('').map(Number).reduce((a, b) => a + b, 0);
  while (sum > 9) {
    sum = String(sum).split('').map(Number).reduce((a, b) => a + b, 0);
  }
  return sum;
}

// Map of 9 numerology numbers for colors, keywords, amulets, and fields
const NUMEROLOGY_INFO: Record<number, {
  colorName: string;
  hex: string;
  bgClass: string;
  colorText: string;
  keyword: string;
  amulet: string;
  favoredLifeArea: string;
  attentionLifeArea: string;
  strategicAdvice: string;
}> = {
  1: {
    colorName: "Vermelho Rubi",
    hex: "#DC2626",
    bgClass: "bg-[#DC2626]",
    colorText: "Ativa a coragem para dar novos inícios. Use em roupas ou joias de destaque.",
    keyword: "Soberania, Iniciativas Pioneiras e Mutação de Rumos",
    amulet: "Ponta de Quartzo Transparente ou Medalha Facetada",
    favoredLifeArea: "Projetos Pessoais & Empreendedorismo de Vanguarda",
    attentionLifeArea: "Dependências e inseguranças emocionais herdadas",
    strategicAdvice: "Foque na sua individualidade soberana. O ciclo atual favorece ações de coragem solitária e planejamentos de alta autoria."
  },
  2: {
    colorName: "Laranja Coral",
    hex: "#EA580C",
    bgClass: "bg-[#EA580C]",
    colorText: "Facilita conexões refinadas, parcerias puras e diálogos afetivos.",
    keyword: "Conciliação, Alianças Nobres e Fluidez de Sentimentos",
    amulet: "Pedra da Lua ou Quartzo Verde de Proteção",
    favoredLifeArea: "Sociedades Estratégicas e Harmonia em Parcerias",
    attentionLifeArea: "Disputas de ego supérfluas e discussões drásticas",
    strategicAdvice: "Aprenda a ouvir os ritmos alheios antes de intervir. O momento pede diplomacia suave e união de propósitos complementares."
  },
  3: {
    colorName: "Amarelo Canário",
    hex: "#CA8A04",
    bgClass: "bg-[#CA8A04]",
    colorText: "Abre o carisma social, a facilidade de oratória e a criatividade.",
    keyword: "Comunicação Magnética, Entusiasmo e Expansão Expressiva",
    amulet: "Pirita Quadrada de Atração ou Citrino Bruto",
    favoredLifeArea: "Comercialização, Mídias e Interação com Grandes Grupos",
    attentionLifeArea: "Dispersão de energia com futilidades do dia a dia",
    strategicAdvice: "Expresse sua verdade de forma artística e carismática. Evite engolir sentimentos; canais de socialização estão em pura expansão."
  },
  4: {
    colorName: "Verde Esmeralda",
    hex: "#16A34A",
    bgClass: "bg-[#16A34A]",
    colorText: "Traz solidez mental, disciplina operacional e estabilidade material.",
    keyword: "Operacionalidade, Estruturação Civil e Bases Sólidas",
    amulet: "Hematita Lisa ou Escudo Pentagramático de Metal",
    favoredLifeArea: "Auditorias Financeiras, Imóveis e Redução de Taxas",
    attentionLifeArea: "Rigidez mental nas rotinas diárias laboriosas",
    strategicAdvice: "Coloque ordem absoluta nos pormenores práticos e planilhas de capital. A base que você constrói hoje resistirá ao tempo de Saturno."
  },
  5: {
    colorName: "Azul Turquesa",
    hex: "#0D9488",
    bgClass: "bg-[#0D9488]",
    colorText: "Alinha as viagens intelectuais, adaptabilidade e quebra de amarras.",
    keyword: "Movimento Ousado, Liberdade Pessoal e Ajustes de Rotas",
    amulet: "Olho de Tigre Rolado ou Pingente de Turquesa Natural",
    favoredLifeArea: "Viagens Curtas, Bagagens Acadêmicas e Contatos Estrangeiros",
    attentionLifeArea: "Ansiedade generalizada e impaciência com processos lentos",
    strategicAdvice: "Abrace a mudança com flexibilidade e discernimento. Não tema libertar amarras pesadas que limitam o seu crescimento vital."
  },
  6: {
    colorName: "Azul Índigo",
    hex: "#4F46E5",
    bgClass: "bg-[#4F46E5]",
    colorText: "Promove afetividade refinada, acolhimento doméstico e cura.",
    keyword: "Responsabilidade Familiar, Conciliação e Beleza de Ambiente",
    amulet: "Lápis-lazúli Oval ou Jaspe Vermelho de Vigor",
    favoredLifeArea: "Aconchego do Lar, Nutrição de Vínculos e Projetos de Design",
    attentionLifeArea: "Perfeccionismo exasperado de comportamento alheio",
    strategicAdvice: "Harmonize as vibrações do seu espaço e preste ajuda madura a quem você ama. O momento clama por gentileza e cura integrativa."
  },
  7: {
    colorName: "Violeta Transmutador",
    hex: "#7C3AED",
    bgClass: "bg-[#7C3AED]",
    colorText: "Suporta meditação sutil, purificação mental e estudos herméticos.",
    keyword: "Mentalização Racional, Silêncio Sábio e Autoconhecimento",
    amulet: "Ametista Roxa de Drusa ou Símbolo do Infinito Metálico",
    favoredLifeArea: "Pesquisas Acadêmicas, Meditações Curas e Filosofias de Vida",
    attentionLifeArea: "Isolamento melancólico ou ceticismo frio restritivo",
    strategicAdvice: "Busque momentos de quietude para decifrar a voz interna da intuição. Responda aos atritos sociais com neutralidade racional total."
  },
  8: {
    colorName: "Dourado Solar",
    hex: "#EAB308",
    bgClass: "bg-[#EAB308]",
    colorText: "Maximiza o faro executivo, resiliência de negócios e prestígio.",
    keyword: "Poder de Realização, Justiça Financeira e Alta Liderança",
    amulet: "Moeda Antiga de Cobre ou Pirita Dourada de Mesa",
    favoredLifeArea: "Contratos de Grande Porte, Promoção de Nome e Investimentos",
    attentionLifeArea: "Tendências de autoritarismo e controle obsessivo",
    strategicAdvice: "Lidere seus empreendimentos com retidão jurídica absoluta. Dê passos estratégicos sabendo que você colherá exatamente o que organizou."
  },
  9: {
    colorName: "Terracota Rosado",
    hex: "#DB2777",
    bgClass: "bg-[#DB2777]",
    colorText: "Favorece doações fraternas, limpezas energéticas e finais felizes.",
    keyword: "Conclusões Amorosas, Desapego Intelectual e Humanitarismo",
    amulet: "Quartzo Rosa Bruto ou Turmalina Negra Protetora",
    favoredLifeArea: "Descartes de Sobras, Terapias de Perdão e Conclusão de Obras",
    attentionLifeArea: "Apego nostálgico a projetos ou pessoas obsoletas",
    strategicAdvice: "Feche os ciclos pendentes com profunda gratidão cósmica. Abra espaços limpos na sua mente e rotina para os novos milagres que virão."
  }
};

const ELEMENTS_SIGN: Record<string, string> = {
  Fogo: "Fogo Creativo",
  Terra: "Terra Fértil Sólida",
  Ar: "Ar Dinâmico Fluido",
  Água: "Água Intuitiva Profunda"
};

// Generates the personalized prosperity map data for a user on a given date-time
export function generatePersonalizedProsperityMap(
  birthDate: string,
  userSunSign: string,
  userName: string,
  targetDate: Date
): ProsperityMapData {
  const currentMonthIdx = targetDate.getMonth() + 1; // 1 to 12
  const currentYear = targetDate.getFullYear();
  
  // Calculate Life Path Number
  const lifePath = calculateLifePathNumber(birthDate);
  
  // Personal Year = (Life Path + Current Year Digits Sum)
  const yearDigitsSum = String(currentYear).split('').map(Number).reduce((a, b) => a + b, 0);
  const personalYear = (lifePath + yearDigitsSum) % 9 || 9;
  
  // Personal Month = (Personal Year + Current Month) % 9
  const personalMonth = (personalYear + currentMonthIdx) % 9 || 9;
  
  const info = NUMEROLOGY_INFO[personalMonth];
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  const monthName = monthNames[targetDate.getMonth()];
  
  // Astro personalization using userSunSign to fetch elemental correspondences
  const sunSignZodiac = getZodiacSignInfoByString(userSunSign);
  const elementLabel = ELEMENTS_SIGN[sunSignZodiac.element] || "Terra Fértil Sólida";
  
  // Opportunities and challenges calculated based on Life Path Number and Sun Sign details
  const zodiacOpportunities: Record<string, string[]> = {
    "Áries": ["Iniciativa inédita de liderança nos novos negócios", "Gasto calórico ativo abrindo canais de clareza mental"],
    "Touro": ["Acordo sólido de longo curso imobiliário ou investimentos", "Sensibilidade para desfrutar de prazeres corporais estáveis"],
    "Gêmeos": ["Novas conexões comerciais geradas por excelente oratória", "Viagens rápidas altamente produtivas em contatos"],
    "Câncer": ["Fortalecimento do pilar afetivo familiar e equilíbrio interno", "Resgate de projetos caseiros de alto rendimento espiritual"],
    "Leão": ["Destaque público e reconhecimento por merecimento", "Expressividade carismática atraindo novos investidores"],
    "Virgem": ["Organização meticulosa eliminando dreno de taxas", "Aperfeiçoamento metodológico gerando alta tração técnica"],
    "Libra": ["Conciliação de desentendimentos através de refinada diplomacia", "Parcerias simétricas e cooperativas fluindo com facilidade"],
    "Escorpião": ["Forte faro intuitivo detectando oportunidades comerciais ocultas", "Entrega emocional e transmutação de velhos ressentimentos"],
    "Sagitário": ["Expansão de horizontes através de novos estudos teóricos", "Sorte fortuita em conexões sociais de prestígio acadêmico"],
    "Capricórnio": ["Consolidação de cargos duradouros corporativos", "Sucesso em investimentos regulados conservadores"],
    "Aquário": ["Idéias inovadoras de vanguarda que revolucionam métodos", "Subscrição de utilidades e automação de rotinas"],
    "Peixes": ["Perdões espirituais restauradores liberando o fluxo de Saturno", "Sintonia telepática facilitando o encontro de novos caminhos"]
  };
  
  const defaultOpps = [
    "Entrada extra de dividendos através de foco disciplinado no capital",
    "Melhoria nítida do vigor diário através de ajustes de dieta elemental"
  ];
  
  const opportunities = zodiacOpportunities[userSunSign] || defaultOpps;
  
  const zodiacChallenges: Record<string, string[]> = {
    "Áries": ["Impaciência explosiva diante de respostas lentas do mercado", "Tendência a atropelar regras essenciais de auditoria comercial"],
    "Touro": ["Teimosia obsecada por ideias que exigem rotação urgente", "Ansiedade alimentar por autocobrança exagerada"],
    "Gêmeos": ["Inconstância operacional deixando projetos inacabados", "Dispersão excessiva nas redes sociais drenando o foco"],
    "Câncer": ["Flutuações bruscas de humor ao sabor de críticas estéreis", "Apego desmedido a nostalgias e mentes do passado"],
    "Leão": ["Altivez exagerada recusando conselhos maduros valiosos", "Necessidade extrema de aplauso para agir estruturadamente"],
    "Virgem": ["Preocupação neurotizante com pequenas imperfeições corrigíveis", "Estresse corporal por autocobrança implacável do tempo"],
    "Libra": ["Indecisão diante de escolhas financeiras que pedem clareza absoluta", "Cedência a caprichos alheios com prejuízo do próprio equilíbrio"],
    "Escorpião": ["Vontade de controle obsessivo gerando atritos fechados", "Silêncio hostil acumulando mágoas supérfluas"],
    "Sagitário": ["Falta de limite físico em gastos festivos desnecessários", "Dogmatismo exagerado na imposição de filosofias de vida"],
    "Capricórnio": ["Rigidez de comportamento afastando apoios importantes", "Pessimismo burocrático julgando antes de analisar as forças"],
    "Aquário": ["Rebeldia desnecessária ignorando rotinas operacionais úteis", "Frieza extrema ferindo sentimentos de pessoas próximas"],
    "Peixes": ["Fuga da realidade através de desculpas emocionais fluidas", "Vulnerabilidade energética absorvendo pesos mentais do ambiente"]
  };
  
  const defaultChalls = [
    "Evitar procrastinação em atividades tributárias complexas",
    "Conter reações impulsivas diante de bloqueios administrativos temporários"
  ];
  
  const challenges = zodiacChallenges[userSunSign] || defaultChalls;
  
  // Personalize strategic advice to inject name if present
  const baseAdvice = info.strategicAdvice;
  const strategicAdvice = userName 
    ? `${userName.split(' ')[0]}, ${baseAdvice.charAt(0).toLowerCase()}${baseAdvice.slice(1)}`
    : `${baseAdvice.charAt(0).toUpperCase()}${baseAdvice.slice(1)}`;

  return {
    monthName,
    year: currentYear,
    monthNumber: personalMonth,
    favorableColor: {
      name: info.colorName,
      hex: info.hex,
      bgClass: info.bgClass,
      text: info.colorText
    },
    keyword: info.keyword,
    amulet: info.amulet,
    favoredElement: elementLabel,
    favoredLifeArea: info.favoredLifeArea,
    attentionLifeArea: info.attentionLifeArea,
    opportunities,
    challenges,
    strategicAdvice
  };
}

// Compact sign info tool inside prosperityEngine to avoid missing bindings
function getZodiacSignInfoByString(sign: string) {
  const elementsMap: Record<string, "Fogo" | "Terra" | "Ar" | "Água"> = {
    "Áries": "Fogo", "Leão": "Fogo", "Sagitário": "Fogo",
    "Touro": "Terra", "Virgem": "Terra", "Capricórnio": "Terra",
    "Gêmeos": "Ar", "Libra": "Ar", "Aquário": "Ar",
    "Câncer": "Água", "Escorpião": "Água", "Peixes": "Água"
  };
  return {
    element: elementsMap[sign] || "Terra",
    sign
  };
}
