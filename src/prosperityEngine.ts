import { getZodiacSignInfo } from './components/astroMath';
import i18next from 'i18next';

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
  lang?: string;
}

function getActiveLanguage(overrideLang?: string): 'pt' | 'en' | 'es' | 'de' | 'fr' {
  const raw = overrideLang || i18next.language || 'pt';
  const lang = raw.toLowerCase().split('-')[0];
  if (['pt', 'en', 'es', 'de', 'fr'].includes(lang)) {
    return lang as 'pt' | 'en' | 'es' | 'de' | 'fr';
  }
  return 'pt';
}

const TRANSLATED_SIGNS: Record<string, Record<string, string>> = {
  pt: { "Áries": "Áries", "Touro": "Touro", "Gêmeos": "Gêmeos", "Câncer": "Câncer", "Leão": "Leão", "Virgem": "Virgem", "Libra": "Libra", "Escorpião": "Escorpião", "Sagitário": "Sagitário", "Capricórnio": "Capricórnio", "Aquário": "Aquário", "Peixes": "Peixes" },
  en: { "Áries": "Aries", "Touro": "Taurus", "Gêmeos": "Gemini", "Câncer": "Cancer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Scorpio", "Sagitário": "Sagittarius", "Capricórnio": "Capricorn", "Aquário": "Aquarius", "Peixes": "Pisces" },
  es: { "Áries": "Aries", "Touro": "Tauro", "Gêmeos": "Géminis", "Câncer": "Cáncer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Escorpio", "Sagitário": "Sagitario", "Capricórnio": "Capricornio", "Aquário": "Acuario", "Peixes": "Piscis" },
  de: { "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs", "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion", "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Fische" },
  fr: { "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer", "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion", "Sagitário": "Sagitaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons" }
};

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
const TRANSLATED_NUMEROLOGY_INFO: Record<string, Record<number, {
  colorName: string;
  colorText: string;
  keyword: string;
  amulet: string;
  favoredLifeArea: string;
  attentionLifeArea: string;
  strategicAdvice: string;
}>> = {
  pt: {
    1: {
      colorName: "Vermelho Rubi",
      colorText: "Ativa a coragem para dar novos inícios. Use em roupas ou joias de destaque.",
      keyword: "Soberania, Iniciativas Pioneiras e Mutação de Rumos",
      amulet: "Ponta de Quartzo Transparente ou Medalha Facetada",
      favoredLifeArea: "Projetos Pessoais & Empreendedorismo de Vanguarda",
      attentionLifeArea: "Dependências e inseguranças emocionais herdadas",
      strategicAdvice: "Foque na sua individualidade soberana. O ciclo atual favorece ações de coragem solitária e planejamentos de alta autoria."
    },
    2: {
      colorName: "Laranja Coral",
      colorText: "Facilita conexões refinadas, parcerias puras e diálogos afetivos.",
      keyword: "Conciliação, Alianças Nobres e Fluidez de Sentimentos",
      amulet: "Pedra da Lua ou Quartzo Verde de Proteção",
      favoredLifeArea: "Sociedades Estratégicas e Harmonia em Parcerias",
      attentionLifeArea: "Disputas de ego supérfluas e discussões drásticas",
      strategicAdvice: "Aprenda a ouvir os ritmos alheios antes de intervir. O momento pede diplomacia suave e união de propósitos complementares."
    },
    3: {
      colorName: "Amarelo Canário",
      colorText: "Abre o carisma social, a facilidade de oratória e a criatividade.",
      keyword: "Comunicação Magnética, Entusiasmo e Expansão Expressiva",
      amulet: "Pirita Quadrada de Atração ou Citrino Bruto",
      favoredLifeArea: "Comercialização, Mídias e Interação com Grandes Grupos",
      attentionLifeArea: "Dispersão de energia com futilidades do dia a dia",
      strategicAdvice: "Expresse sua verdade de forma artística e carismática. Evite engolir sentimentos; canais de socialização estão em pura expansão."
    },
    4: {
      colorName: "Verde Esmeralda",
      colorText: "Traz solidez mental, disciplina operacional e estabilidade material.",
      keyword: "Operacionalidade, Estruturação Civil e Bases Sólidas",
      amulet: "Hematita Lisa ou Escudo Pentagramático de Metal",
      favoredLifeArea: "Auditorias Financeiras, Imóveis e Redução de Taxas",
      attentionLifeArea: "Rigidez mental nas rotinas diárias laboriosas",
      strategicAdvice: "Coloque ordem absoluta nos pormenores práticos e planilhas de capital. A base que você constrói hoje resistirá ao tempo de Saturno."
    },
    5: {
      colorName: "Azul Turquesa",
      colorText: "Alinha as viagens intelectuais, adaptabilidade e quebra de amarras.",
      keyword: "Movimento Ousado, Liberdade Pessoal e Ajustes de Rotas",
      amulet: "Olho de Tigre Rolado ou Pingente de Turquesa Natural",
      favoredLifeArea: "Viagens Curtas, Bagagens Acadêmicas e Contatos Estrangeiros",
      attentionLifeArea: "Ansiedade generalizada e impaciência com processos lentos",
      strategicAdvice: "Abrace a mudança com flexibilidade e discernimento. Não tema libertar amarras pesadas que limitam o seu crescimento vital."
    },
    6: {
      colorName: "Azul Índigo",
      colorText: "Promove afetividade refinada, acolhimento doméstico e cura.",
      keyword: "Responsabilidade Familiar, Conciliação e Beleza de Ambiente",
      amulet: "Lápis-lazúli Oval ou Jaspe Vermelho de Vigor",
      favoredLifeArea: "Aconchego do Lar, Nutrição de Vínculos e Projetos de Design",
      attentionLifeArea: "Perfeccionismo exasperado de comportamento alheio",
      strategicAdvice: "Harmonize as vibrações do seu espaço e preste ajuda madura a quem você ama. O momento clama por gentileza e cura integrativa."
    },
    7: {
      colorName: "Violeta Transmutador",
      colorText: "Suporta meditação sutil, purificação mental e estudos herméticos.",
      keyword: "Mentalização Racional, Silêncio Sábio e Autoconhecimento",
      amulet: "Ametista Roxa de Drusa ou Símbolo do Infinito Metálico",
      favoredLifeArea: "Pesquisas Acadêmicas, Meditações Curas e Filosofias de Vida",
      attentionLifeArea: "Isolamento melancólico ou ceticismo frio restritivo",
      strategicAdvice: "Busque momentos de quietude para decifrar a voz interna da intuição. Responda aos atritos sociais com neutralidade racional total."
    },
    8: {
      colorName: "Dourado Solar",
      colorText: "Maximiza o faro executivo, resiliência de negócios e prestígio.",
      keyword: "Poder de Realização, Justiça Financeira e Alta Liderança",
      amulet: "Moeda Antiga de Cobre ou Pirita Dourada de Mesa",
      favoredLifeArea: "Contratos de Grande Porte, Promoção de Nome e Investimentos",
      attentionLifeArea: "Tendências de autoritarismo e controle obsessivo",
      strategicAdvice: "Lidere seus empreendimentos com retidão jurídica absoluta. Dê passos estratégicos sabendo que você colherá exatamente o que organizou."
    },
    9: {
      colorName: "Terracota Rosado",
      colorText: "Favorece doações fraternas, limpezas energéticas e finais felizes.",
      keyword: "Conclusões Amorosas, Desapego Intelectual e Humanitarismo",
      amulet: "Quartzo Rosa Bruto ou Turmalina Negra Protetora",
      favoredLifeArea: "Descartes de Sobras, Terapias de Perdão e Conclusão de Obras",
      attentionLifeArea: "Apego nostálgico a projetos ou pessoas obsoletas",
      strategicAdvice: "Feche os ciclos pendentes com profunda gratidão cósmica. Abra espaços limpos na sua mente e rotina para os novos milagres que virão."
    }
  },
  en: {
    1: {
      colorName: "Ruby Red",
      colorText: "Activates the courage to make new beginnings. Use in prominent clothing or jewelry.",
      keyword: "Sovereignty, Pioneering Initiatives, and Course Changes",
      amulet: "Clear Quartz Point or Faceted Medal",
      favoredLifeArea: "Personal Projects & Avant-Garde Entrepreneurship",
      attentionLifeArea: "Inherited dependencies and emotional insecurities",
      strategicAdvice: "Focus on your sovereign individuality. The current cycle favors single-handed courageous actions and highly original planning."
    },
    2: {
      colorName: "Coral Orange",
      colorText: "Facilitates refined connections, pure partnerships, and loving dialogues.",
      keyword: "Conciliation, Noble Alliances, and Fluidity of Feelings",
      amulet: "Moonstone or Protective Green Quartz",
      favoredLifeArea: "Strategic Partnerships and Harmony in Connections",
      attentionLifeArea: "Superfluous ego disputes and drastic discussions",
      strategicAdvice: "Learn to listen to others' rhythms before intervening. The moment calls for soft diplomacy and the union of complementary purposes."
    },
    3: {
      colorName: "Canary Yellow",
      colorText: "Unlocks social charisma, ease of speaking, and creativity.",
      keyword: "Magnetic Communication, Enthusiasm, and Expressive Expansion",
      amulet: "Square Attraction Pyrite or Raw Citrine",
      favoredLifeArea: "Commercialization, Media, and Interaction with Large Groups",
      attentionLifeArea: "Scattering energy on daily trivialities",
      strategicAdvice: "Express your truth in an artistic and charismatic way. Avoid swallowing feelings; socialization channels are in pure expansion."
    },
    4: {
      colorName: "Emerald Green",
      colorText: "Brings mental solidity, operational discipline, and material stability.",
      keyword: "Operationality, Civil Structuring, and Solid Foundations",
      amulet: "Smooth Hematite or Metallic Pentagram Shield",
      favoredLifeArea: "Financial Audits, Real Estate, and Fee Reduction",
      attentionLifeArea: "Mental rigidity in laborious daily routines",
      strategicAdvice: "Bring absolute order to practical details and capital spreadsheets. The foundation you build today will withstand the test of Saturn."
    },
    5: {
      colorName: "Turquoise Blue",
      colorText: "Aligns intellectual travel, adaptability, and breaking free of bonds.",
      keyword: "Bold Movement, Personal Freedom, and Route Adjustments",
      amulet: "Tumbled Tiger's Eye or Natural Turquoise Pendant",
      favoredLifeArea: "Short Trips, Academic Background, and Foreign Contacts",
      attentionLifeArea: "Generalized anxiety and impatience with slow processes",
      strategicAdvice: "Embrace change with flexibility and discernment. Do not fear freeing heavy bonds that limit your vital growth."
    },
    6: {
      colorName: "Indigo Blue",
      colorText: "Promotes refined affectivity, domestic warmth, and healing.",
      keyword: "Family Responsibility, Conciliation, and Beautiful Environment",
      amulet: "Oval Lapis Lazuli or Vigor Red Jasper",
      favoredLifeArea: "Warmth of the Home, Nurturing Connections, and Design Projects",
      attentionLifeArea: "Exasperated perfectionism regarding others' behavior",
      strategicAdvice: "Harmonize the vibrations of your space and lend mature help to those you love. The moment calls for gentleness and integrative healing."
    },
    7: {
      colorName: "Transmuting Violet",
      colorText: "Supports subtle meditation, mental purification, and hermetic studies.",
      keyword: "Rational Mentalization, Wise Silence, and Self-Knowledge",
      amulet: "Purple Amethyst Geode or Metallic Infinity Symbol",
      favoredLifeArea: "Academic Research, Healing Meditations, and Philosophies of Life",
      attentionLifeArea: "Melancholic isolation or restrictive cold skepticism",
      strategicAdvice: "Seek moments of quiet to decipher the inner voice of intuition. Respond to social friction with total rational neutrality."
    },
    8: {
      colorName: "Solar Gold",
      colorText: "Maximizes executive instincts, business resilience, and prestige.",
      keyword: "Power of Accomplishment, Financial Justice, and High Leadership",
      amulet: "Ancient Copper Coin or Table Golden Pyrite",
      favoredLifeArea: "Large Contracts, Name Promotion, and Investments",
      attentionLifeArea: "Tendencies of authoritarianism and obsessive control",
      strategicAdvice: "Lead your endeavors with absolute legal rectitude. Take strategic steps knowing that you will reap exactly what you organized."
    },
    9: {
      colorName: "Pink Terracotta",
      colorText: "Favors fraternal donations, energy cleansing, and happy endings.",
      keyword: "Loving Conclusions, Intellectual Detachment, and Humanitarianism",
      amulet: "Raw Rose Quartz or Protective Black Tourmaline",
      favoredLifeArea: "Discarding Leftovers, Forgiveness Therapies, and Work Completion",
      attentionLifeArea: "Nostalgic attachment to obsolete projects or people",
      strategicAdvice: "Close pending cycles with deep cosmic gratitude. Open clean spaces in your mind and routine for the new miracles to come."
    }
  },
  es: {
    1: {
      colorName: "Rojo Rubí",
      colorText: "Activa el coraje para emprender nuevos comienzos. Úsalo en ropa o joyas destacadas.",
      keyword: "Soberanía, Iniciativas Pioneras y Mutación de Rumbos",
      amulet: "Punta de Cuarzo Transparente o Medalla Facetada",
      favoredLifeArea: "Proyectos Personales y Emprendimiento de Vanguardia",
      attentionLifeArea: "Dependencias e inseguridades emocionales heredadas",
      strategicAdvice: "Enfócate en tu individualidad soberana. El ciclo actual favorece acciones de coraje solitario y planificaciones altamente originales."
    },
    2: {
      colorName: "Naranja Coral",
      colorText: "Facilita conexiones refinadas, asociaciones puras y diálogos afectivos.",
      keyword: "Conciliación, Alianzas Nobles y Fluidez de Sentimientos",
      amulet: "Piedra de la Luna o Cuarzo Verde de Protección",
      favoredLifeArea: "Sociedades Estratégicas y Armonía en Pareja",
      attentionLifeArea: "Disputas superfluas de ego y discusiones drásticas",
      strategicAdvice: "Aprende a escuchar los ritmos ajenos antes de intervenir. El momento pide diplomacia suave y unión de propósitos complementarios."
    },
    3: {
      colorName: "Amarillo Canario",
      colorText: "Desbloquea el carisma social, la facilidad de palabra y la creatividad.",
      keyword: "Comunicación Magnética, Entusiasmo y Expansión Expresiva",
      amulet: "Pirita Cuadrada de Atracción o Citrino Bruto",
      favoredLifeArea: "Comercialización, Medios e Interacción con Grandes Grupos",
      attentionLifeArea: "Dispersión de energía en futilidades cotidianas",
      strategicAdvice: "Expresa tu verdad de forma artística y carismática. Evita contener tus sentimientos; los canales de socialización están en pura expansión."
    },
    4: {
      colorName: "Verde Esmeralda",
      colorText: "Trae solidez mental, disciplina operativa y estabilidad material.",
      keyword: "Operatividad, Estructuración Civil y Bases Sólidas",
      amulet: "Hematita Lisa o Escudo Pentagramático de Metal",
      favoredLifeArea: "Auditorías Financieras, Inmuebles y Reducción de Tasas",
      attentionLifeArea: "Rigidez mental en las rutinas de trabajo laboriosas",
      strategicAdvice: "Pon orden absoluto en los detalles prácticos y hojas de cálculo. La base que construyes hoy resistirá el paso de Saturno."
    },
    5: {
      colorName: "Azul Turquesa",
      colorText: "Alinea los viajes intelectuales, la adaptabilidad y la liberación de ataduras.",
      keyword: "Movimiento Audaz, Libertad Personal y Ajustes de Rutas",
      amulet: "Ojo de Tigre Rodado o Colgante de Turquesa Natural",
      favoredLifeArea: "Viajes Cortos, Formación Académica y Contactos Extranjeros",
      attentionLifeArea: "Ansiedad generalizada e impaciencia con los procesos lentos",
      strategicAdvice: "Abraza el cambio con flexibilidad y discernimiento. No temas liberar ataduras pesadas que limitan tu crecimiento vital."
    },
    6: {
      colorName: "Azul Índigo",
      colorText: "Promueve la afectividad refinada, la calidez doméstica y la sanación.",
      keyword: "Responsabilidad Familiar, Conciliación y Belleza del Entorno",
      amulet: "Lapislázuli Ovalado o Jaspe Rojo de Vigor",
      favoredLifeArea: "Calidez del Hogar, Nutrición de Vínculos y Proyectos de Diseño",
      attentionLifeArea: "Perfeccionismo exasperado con el comportamiento de los demás",
      strategicAdvice: "Armoniza las vibraciones de tu espacio y brinda ayuda madura a tus seres queridos. El momento exige amabilidad y sanación integradora."
    },
    7: {
      colorName: "Violeta Transmutador",
      colorText: "Sostiene la meditación sutil, la purificación mental y los estudios herméticos.",
      keyword: "Mentalización Racional, Silencio Sabio y Autoconocimiento",
      amulet: "Geoda de Amatista Púrpura o Símbolo del Infinito Metálico",
      favoredLifeArea: "Investigaciones Académicas, Meditaciones de Sanación y Filosofías de Vida",
      attentionLifeArea: "Aislamiento melancólico o escepticismo frío y restrictivo",
      strategicAdvice: "Busca momentos de quietude para descifrar la voz interior de la intuición. Responde a la fricción social con total neutralidad racional."
    },
    8: {
      colorName: "Dorado Solar",
      colorText: "Maximiza el olfato ejecutivo, la resiliencia comercial y el prestigio.",
      keyword: "Poder de Realización, Justicia Financiera y Alto Liderazgo",
      amulet: "Moneda de Cobre Antigua o Pirita Dorada de Mesa",
      favoredLifeArea: "Contratos de Gran Envergadura, Promoción del Nombre e Inversiones",
      attentionLifeArea: "Tendencias al autoritarismo y control obsesivo",
      strategicAdvice: "Dirige tus proyectos con absoluta rectitud jurídica. Da pasos estratégicos sabiendo que cosecharás exactamente lo que organizaste."
    },
    9: {
      colorName: "Terracota Rosado",
      colorText: "Favorece las donaciones fraternales, la limpieza energética y los finales felices.",
      keyword: "Conclusiones Amorosas, Desapego Intelectual y Humanitarismo",
      amulet: "Cuarzo Rosa Bruto o Turmalina Negra Protectora",
      favoredLifeArea: "Descarte de Sobras, Terapias de Perdón y Finalización de Obras",
      attentionLifeArea: "Apego nostálgico a proyectos o personas obsoletas",
      strategicAdvice: "Cierra ciclos pendientes con profunda gratitud cósmica. Abre espacios limpios en tu mente y tu rutina para los nuevos milagros por venir."
    }
  },
  de: {
    1: {
      colorName: "Rubinrot",
      colorText: "Aktiviert den Mut zu Neuanfängen. Nutzen Sie dies bei auffälliger Kleidung oder Schmuck.",
      keyword: "Souveränität, Pionierinitiativen und Richtungswechsel",
      amulet: "Bergkristallspitze oder Facettierte Medaille",
      favoredLifeArea: "Persönliche Projekte & Avantgardistisches Unternehmertum",
      attentionLifeArea: "Vererbte Abhängigkeiten und emotionale Unsicherheiten",
      strategicAdvice: "Konzentrieren Sie sich auf Ihre souveräne Individualität. Der aktuelle Zyklus begünstigt mutige Alleingänge und originelle Planung."
    },
    2: {
      colorName: "Korallenorange",
      colorText: "Erleichtert verfeinerte Verbindungen, reine Partnerschaften und liebevolle Dialoge.",
      keyword: "Versöhnung, Edle Allianzen und Fließen der Gefühle",
      amulet: "Mondstein oder Schützender Grüner Quarz",
      favoredLifeArea: "Strategische Partnerschaften und Harmonie in Beziehungen",
      attentionLifeArea: "Überflüssige Ego-Streitigkeiten und drastische Diskussionen",
      strategicAdvice: "Lernen Sie, auf den Rhythmus anderer zu hören, bevor Sie eingreifen. Der Moment erfordert sanfte Diplomatie und die Vereinigung komplementärer Ziele."
    },
    3: {
      colorName: "Kanariengelb",
      colorText: "Schaltet soziales Charisma, Redefluss und Kreativität frei.",
      keyword: "Magnetische Kommunikation, Enthusiasmus und Expressive Expansion",
      amulet: "Quadratischer Anziehungs-Pyrit oder Roher Citrin",
      favoredLifeArea: "Kommerzialisierung, Medien und Interaktion mit großen Gruppen",
      attentionLifeArea: "Energieverschwendung für alltägliche Belanglosigkeiten",
      strategicAdvice: "Drücken Sie Ihre Wahrheit auf künstlerische und charismatische Weise aus. Vermeiden Sie es, Gefühle herunterzuschlucken; die Kanäle der Sozialisierung befinden sich in reiner Expansion."
    },
    4: {
      colorName: "Smaragdgrün",
      colorText: "Bringt mentale Solidität, operative Disziplin und materielle Stabilität.",
      keyword: "Operationalität, Zivile Strukturierung und Solide Grundlagen",
      amulet: "Glatter Hämatit oder Metallisches Pentagramm-Schild",
      favoredLifeArea: "Finanzprüfungen, Immobilien und Gebührensenkung",
      attentionLifeArea: "Mentale Starrheit im mühsamen Alltagstrott",
      strategicAdvice: "Bringen Sie absolute Ordnung in praktische Details und Tabellenkalkulationen. Das Fundament, das Sie heute bauen, wird der Prüfung des Saturns standhalten."
    },
    5: {
      colorName: "Türkisblau",
      colorText: "Richtet intellektuelle Reisen, Anpassungsfähigkeit und das Lösen von Bindungen aus.",
      keyword: "Mutige Bewegung, Persönliche Freiheit und Routenanpassungen",
      amulet: "Getrommeltes Tigerauge oder Natürlicher Türkisanhänger",
      favoredLifeArea: "Kurzreisen, Akademischer Hintergrund und Auslandskontakte",
      attentionLifeArea: "Generalisierte Angst und Ungeduld mit langsamen Prozessen",
      strategicAdvice: "Nehmen Sie Veränderungen flexibel und mit Scharfsinn an. Scheuen Sie sich nicht, schwere Bindungen zu lösen, die Ihr Wachstum behindern."
    },
    6: {
      colorName: "Indigoblau",
      colorText: "Fördert verfeinerte Affektivität, häusliche Wärme und Heilung.",
      keyword: "Familiäre Verantwortung, Versöhnung und Schöne Umgebung",
      amulet: "Ovaler Lapislazuli oder Vitalitäts-Roter Jaspis",
      favoredLifeArea: "Wärme des Zuhauses, Pflege von Bindungen und Designprojekte",
      attentionLifeArea: "Übertriebener Perfektionismus in Bezug auf das Verhalten anderer",
      strategicAdvice: "Harmonisieren Sie die Schwingungen Ihres Raumes und leisten Sie den Menschen, die Sie lieben, reife Hilfe. Der Moment verlangt nach Sanftmut und integrativer Heilung."
    },
    7: {
      colorName: "Transmutiertes Violett",
      colorText: "Unterstützt feine Meditation, mentale Reinigung und hermetische Studien.",
      keyword: "Rationales Denken, Weises Schweigen und Selbsterkenntnis",
      amulet: "Lila Amethystdruse oder Metallisches Unendlichkeitssymbol",
      favoredLifeArea: "Akademische Forschung, Heilmeditationen und Lebensphilosophien",
      attentionLifeArea: "Melancholische Isolation oder restriktiver kalter Skeptizismus",
      strategicAdvice: "Suchen Sie Momente der Ruhe, um die innere Stimme der Intuition zu entschlüsseln. Reagieren Sie auf soziale Reibung mit totaler rationaler Neutralität."
    },
    8: {
      colorName: "Sonnengold",
      colorText: "Maximiert den Führungsinstinkt, die geschäftliche Widerstandsfähigkeit und das Prestige.",
      keyword: "Realisierungskraft, Finanzielle Gerechtigkeit und Hohe Führung",
      amulet: "Alte Kupfermünze oder Goldener Tisch-Pyrit",
      favoredLifeArea: "Große Verträge, Namensförderung und Investitionen",
      attentionLifeArea: "Tendenzen zu Autoritarismus und obsessiver Kontrolle",
      strategicAdvice: "Führen Sie Ihre Unternehmungen mit absoluter rechtlicher Redlichkeit. Gehen Sie strategische Schritte im Wissen, dass Sie genau das ernten, was Sie organisiert haben."
    },
    9: {
      colorName: "Rosa Terrakotta",
      colorText: "Begünstigt geschwisterliche Spenden, energetische Reinigung und glückliche Enden.",
      keyword: "Liebevolle Abschlüsse, Intellektuelle Loslösung und Humanitarismus",
      amulet: "Roher Rosenquarz oder Schützender Schwarzer Turmalin",
      favoredLifeArea: "Ausrangieren von Resten, Vergebungstherapien und Abschluss von Arbeiten",
      attentionLifeArea: "Nostalgisches Festhalten an veralteten Projekten oder Menschen",
      strategicAdvice: "Schließen Sie offene Zyklen mit tiefer kosmischer Dankbarkeit. Schaffen Sie freien Raum in Ihrem Geist und Ihrem Alltag für die neuen Wunder, die kommen werden."
    }
  },
  fr: {
    1: {
      colorName: "Rouge Rubis",
      colorText: "Active le courage pour prendre de nouveaux départs. Utilisez-le dans des vêtements ou bijoux marquants.",
      keyword: "Souveraineté, Initiatives Pionnières et Changements de Cap",
      amulet: "Pointe de Quartz Cristal ou Médaille Facettée",
      favoredLifeArea: "Projets Personnels & Entrepreneuriat d'Avant-Garde",
      attentionLifeArea: "Dépendances héritées et insécurités émotionnelles",
      strategicAdvice: "Concentrez-vous sur votre individualité souveraine. Le cycle actuel favorise les actions courageuses solitaires et les planifications hautement originales."
    },
    2: {
      colorName: "Orange Corail",
      colorText: "Facilite les connexions raffinées, les partenariats purs et les dialogues affectifs.",
      keyword: "Conciliation, Alliances Nobles et Fluidité des Sentiments",
      amulet: "Pierre de Lune ou Quartz Vert de Protection",
      favoredLifeArea: "Partenariats Stratégiques et Harmonie dans les Relations",
      attentionLifeArea: "Disputes d'ego superflues et discussions drastiques",
      strategicAdvice: "Apprenez à écouter les rythmes d'autrui avant d'intervenir. Le moment réclame une diplomatie douce et l'union d'objectifs complémentaires."
    },
    3: {
      colorName: "Jaune Serin",
      colorText: "Débloque le charisme social, la facilité de parole et la créativité.",
      keyword: "Communication Magnétique, Enthousiasme et Expansion Expressive",
      amulet: "Pyrite Carrée d'Attraction ou Citrine Brute",
      favoredLifeArea: "Commercialisation, Médias et Interaction avec de Grands Groupes",
      attentionLifeArea: "Dispersion d'énergie dans les futilités quotidiennes",
      strategicAdvice: "Exprimez votre vérité de manière artistique et charismatique. Évitez de retenir vos sentiments ; les canaux de socialisation sont en pleine expansion."
    },
    4: {
      colorName: "Vert Émeraude",
      colorText: "Apporte solidité mentale, discipline opérationnelle et stabilité matérielle.",
      keyword: "Opérationnalité, Structuration Civile et Bases Solides",
      amulet: "Hématite Lisse ou Bouclier Pentagrammatique en Métal",
      favoredLifeArea: "Audits Financiers, Immobilier et Réduction de Frais",
      attentionLifeArea: "Rigidité mentale dans les corvées quotidiennes laborieuses",
      strategicAdvice: "Mettez un ordre absolu dans les détails pratiques et les tableurs de capital. Les fondations que vous construisez aujourd'hui résisteront à l'épreuve du temps."
    },
    5: {
      colorName: "Bleu Turquoise",
      colorText: "Aligne les voyages intellectuels, l'adaptabilité et la libération des liens.",
      keyword: "Mouvement Audacieux, Liberté Personnelle et Ajustements de Route",
      amulet: "Œil de Tigre Roulé ou Pendentif en Turquoise Naturelle",
      favoredLifeArea: "Voyages Courts, Bagages Académiques et Contacts Étrangers",
      attentionLifeArea: "Anxiété généralisée et impatience face aux processus lents",
      strategicAdvice: "Embrassez le changement avec flexibilité et discernement. Ne craignez pas de rompre les liens pesants qui limitent votre croissance vitale."
    },
    6: {
      colorName: "Bleu Indigo",
      colorText: "Favorise l'affectivité raffinée, la chaleur domestique et la guérison.",
      keyword: "Responsabilité Familiale, Conciliation et Beauté de l'Environnement",
      amulet: "Lapis-lazuli Ovale ou Jaspe Rouge de Vigueur",
      favoredLifeArea: "Chaleur du Foyer, Nutrition des Liens et Projets de Design",
      attentionLifeArea: "Perfectionnisme exaspéré concernant le comportement d'autrui",
      strategicAdvice: "Harmonisez les vibrations de votre espace et apportez une aide mûre à ceux que vous aimez. Le moment appelle à la douceur et à la guérison intégrative."
    },
    7: {
      colorName: "Violet Transmutateur",
      colorText: "Soutient la méditation subtile, la purification mentale et les études hermétiques.",
      keyword: "Mentalisation Rationnelle, Silence Sage et Connaissance de Soi",
      amulet: "Géode d'Améthyste Violette ou Symbole de l'Infini Métallique",
      favoredLifeArea: "Recherches Académiques, Méditations de Guérison et Philosophies de Vie",
      attentionLifeArea: "Isolement mélancólico ou scepticisme froid et restrictif",
      strategicAdvice: "Recherchez des moments de calme pour décrypter la voix intérieure de l'intuition. Répondez aux frictions sociales avec une neutralité rationnelle totale."
    },
    8: {
      colorName: "Or Solaire",
      colorText: "Maximise le flair exécutif, la résilience commerciale et le prestige.",
      keyword: "Pouvoir de Réalisation, Justice Financière et Haute Direction",
      amulet: "Pièce de Cuivre Ancienne ou Pyrite Dorée de Table",
      favoredLifeArea: "Grands Contrats, Promotion du Nom et Investissements",
      attentionLifeArea: "Tendances à l'autoritarisme et au contrôle obsessif",
      strategicAdvice: "Dirigez vos projets avec une rectitude juridique absolue. Prenez des décisions stratégiques en sachant que vous récolterez exactement ce que vous avez organisé."
    },
    9: {
      colorName: "Terracota Rosé",
      colorText: "Favorise les dons fraternels, le nettoyage énergétique et les fins heureuses.",
      keyword: "Conclusions Amoureuses, Détachement Intellectuel et Humanitarisme",
      amulet: "Quartz Rosa Brut ou Tourmaline Noire Protectrice",
      favoredLifeArea: "Tri des Excès, Thérapies de Pardon et Finalisation de Travaux",
      attentionLifeArea: "Attachement nostalgique à des projets ou personnes obsolètes",
      strategicAdvice: "Fermez les cycles en suspens avec une profonde gratitude cosmique. Ouvrez des espaces propres dans votre esprit et votre routine pour les nouveaux miracles à venir."
    }
  }
};

const TRANSLATED_MONTHS: Record<string, string[]> = {
  pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
};

const ELEMENTS_SIGN: Record<string, Record<string, string>> = {
  pt: { Fogo: "Fogo Creativo", Terra: "Terra Fértil Sólida", Ar: "Ar Dinâmico Fluido", Água: "Água Intuitiva Profunda" },
  en: { Fogo: "Creative Fire", Terra: "Solid Fertile Earth", Ar: "Dynamic Fluid Air", Água: "Deep Intuitive Water" },
  es: { Fogo: "Fuego Creativo", Terra: "Tierra Fértil Sólida", Ar: "Aire Dinámico Fluido", Água: "Agua Intuitiva Profunda" },
  de: { Fogo: "Kreatives Feuer", Terra: "Feste Fruchtbare Erde", Ar: "Dynamische Flussluft", Água: "Tiefes Intuitives Wasser" },
  fr: { Fogo: "Feu Créatif", Terra: "Terre Fertile Solide", Ar: "Air Dynamique Fluide", Água: "Eau Intuitive Profonde" }
};

// Generates the personalized prosperity map data for a user on a given date-time
export function generatePersonalizedProsperityMap(
  birthDate: string,
  userSunSign: string,
  userName: string,
  targetDate: Date,
  overrideLang?: string
): ProsperityMapData {
  const currentMonthIdx = targetDate.getMonth() + 1; // 1 to 12
  const currentYear = targetDate.getFullYear();
  const lang = getActiveLanguage(overrideLang);
  
  // Calculate Life Path Number
  const lifePath = calculateLifePathNumber(birthDate);
  
  // Personal Year = (Life Path + Current Year Digits Sum)
  const yearDigitsSum = String(currentYear).split('').map(Number).reduce((a, b) => a + b, 0);
  const personalYear = (lifePath + yearDigitsSum) % 9 || 9;
  
  // Personal Month = (Personal Year + Current Month) % 9
  const personalMonth = (personalYear + currentMonthIdx) % 9 || 9;
  
  const info = TRANSLATED_NUMEROLOGY_INFO[lang][personalMonth];
  const staticInfo = TRANSLATED_NUMEROLOGY_INFO['pt'][personalMonth]; // To retrieve constant hex/bgClass
  const staticProps = {
    hex: personalMonth === 1 ? "#DC2626" :
         personalMonth === 2 ? "#EA580C" :
         personalMonth === 3 ? "#CA8A04" :
         personalMonth === 4 ? "#16A34A" :
         personalMonth === 5 ? "#0D9488" :
         personalMonth === 6 ? "#4F46E5" :
         personalMonth === 7 ? "#7C3AED" :
         personalMonth === 8 ? "#EAB308" : "#DB2777",
    bgClass: personalMonth === 1 ? "bg-[#DC2626]" :
             personalMonth === 2 ? "bg-[#EA580C]" :
             personalMonth === 3 ? "bg-[#CA8A04]" :
             personalMonth === 4 ? "bg-[#16A34A]" :
             personalMonth === 5 ? "bg-[#0D9488]" :
             personalMonth === 6 ? "bg-[#4F46E5]" :
             personalMonth === 7 ? "bg-[#7C3AED]" :
             personalMonth === 8 ? "bg-[#EAB308]" : "bg-[#DB2777]"
  };
  
  const monthName = TRANSLATED_MONTHS[lang][targetDate.getMonth()];
  
  // Convert userSunSign to canonical Portuguese name to match opportunities, challenges & elements dictionaries accurately
  const canonicalSign = canonicalSignName(userSunSign);
  
  // Astro personalization using userSunSign to fetch elemental correspondences
  const sunSignZodiac = getZodiacSignInfoByString(canonicalSign);
  const elementLabel = ELEMENTS_SIGN[lang][sunSignZodiac.element] || ELEMENTS_SIGN[lang]["Terra"];
  
  // Opportunities and challenges calculated based on Life Path Number and Sun Sign details
  const zodiacOpportunities: Record<string, Record<string, string[]>> = {
    pt: {
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
    },
    en: {
      "Áries": ["Unprecedented leadership initiative in new businesses", "Active physical energy clearing mental pathways"],
      "Touro": ["Solid long-term real estate or investment agreement", "Sensitivity to enjoy stable bodily comforts"],
      "Gêmeos": ["New commercial connections generated by excellent speaking skills", "Highly productive short trips for networking"],
      "Câncer": ["Strengthening the family emotional pillar and internal balance", "Revitalizing home projects with high spiritual rewards"],
      "Leão": ["Public recognition and well-deserved praise", "Charismatic self-expression attracting new investors"],
      "Virgem": ["Meticulous organization eliminating unnecessary fees", "Methodological improvements generating high technical performance"],
      "Libra": ["Resolving misunderstandings through refined diplomacy", "Symmetrical and cooperative partnerships flowing easily"],
      "Escorpião": ["Strong intuitive scent detecting hidden market opportunities", "Emotional release and transmutation of old resentments"],
      "Sagitário": ["Expansion of horizons through new advanced studies", "Fortuitous luck in social networks of academic prestige"],
      "Capricórnio": ["Consolidation of long-lasting corporate positions", "Success in regulated conservative investments"],
      "Aquário": ["Innovative vanguard ideas that revolutionize methods", "Subscription utilities and automation of routines"],
      "Peixes": ["Restorative spiritual forgiveness releasing the flow of Saturn", "Telepathic alignment facilitating the discovery of new paths"]
    },
    es: {
      "Áries": ["Iniciativa de liderazgo sin precedentes en nuevos negocios", "Gasto calórico activo que abre canales de claridad mental"],
      "Touro": ["Acuerdo sólido de bienes raíces o inversiones a largo plazo", "Sensibilidad para disfrutar de placeres corporales estables"],
      "Gêmeos": ["Nuevas conexiones comerciales gracias a una excelente oratoria", "Viajes rápidos altamente productivos en contactos"],
      "Câncer": ["Fortalecimiento del pilar afectivo familiar y equilibrio interno", "Rescate de proyectos caseros con alto rendimiento espiritual"],
      "Leão": ["Destacada visibilidad pública y reconocimiento por mérito", "Expresión carismática que atrae nuevos inversores"],
      "Virgem": ["Organización meticulosa que elimina la fuga de tasas", "Perfeccionamiento metodológico que genera alta tracción técnica"],
      "Libra": ["Conciliación de desacuerdos a través de una refinada diplomacia", "Asociaciones simétricas y cooperativas que fluyen con facilidad"],
      "Escorpião": ["Fuerte olfato intuitivo que detecta oportunidades comerciales ocultas", "Entrega emocional y transmutación de viejos resentimientos"],
      "Sagitário": ["Expansión de horizontes mediante nuevos estudios teóricos", "Suerte fortuita en conexiones de prestigio académico"],
      "Capricórnio": ["Consolidación de cargos corporativos duraderos", "Éxito en inversiones conservadoras reguladas"],
      "Aquário": ["Ideas vanguardistas innovadoras que revolucionan métodos", "Suscripción de utilidades y automatización de rutinas"],
      "Peixes": ["Perdones espirituales restauradores que liberan el flujo de Saturno", "Sintonía telepática que facilita encontrar nuevos caminos"]
    },
    de: {
      "Áries": ["Beispiellose Führungsinitiative in neuen Geschäften", "Aktive körperliche Bewegung, die mentale Wege frei macht"],
      "Touro": ["Solider langfristiger Immobilien- oder Investitionsvertrag", "Feingefühl für stabilen körperlichen Komfort"],
      "Gêmeos": ["Neue geschäftliche Kontakte durch exzellente Redekunst", "Hochproduktive Kurzreisen zum Netzwerken"],
      "Câncer": ["Stärkung der familiären emotionalen Säule und innere Balance", "Wiederbelebung von Heimprojekten mit hohem spirituellem Nutzen"],
      "Leão": ["Öffentliche Anerkennung und wohlverdientes Lob", "Charismatischer Ausdruck, der neue Investoren anzieht"],
      "Virgem": ["Sorgfältige Organisation, die unnötige Gebühren eliminiert", "Methodische Verbesserungen für hohe technische Leistung"],
      "Libra": ["Beilegung von Missverständnissen durch feine Diplomatie", "Symmetrische und kooperative Partnerschaften fließen leicht"],
      "Escorpião": ["Starker intuitiver Instinkt, der verborgene Marktchancen erkennt", "Emotionale Befreiung und Umwandlung alter Grollgefühle"],
      "Sagitário": ["Erweiterung des Horizonts durch neue fortgeschrittene Studien", "Zufälliges Glück in sozialen Netzwerken mit akademischem Prestige"],
      "Capricórnio": ["Konsolidierung langfristiger Unternehmenspositionen", "Erfolg bei regulierten konservativen Investitionen"],
      "Aquário": ["Innovative Avantgarde-Ideen, die Methoden revolutionieren", "Abonnement-Dienste und Automatisierung von Routinen"],
      "Peixes": ["Heilsame spirituelle Vergebung, die den Fluss des Saturns freigibt", "Telepathische Ausrichtung erleichtert das Finden neuer Wege"]
    },
    fr: {
      "Áries": ["Initiative de leadership inédite dans les nouvelles affaires", "Dépense physique active libérant les canaux de clarté mentale"],
      "Touro": ["Accord solide à long terme dans l'immobilier ou les investissements", "Sensibilité pour profiter de conforts corporels stables"],
      "Gêmeos": ["Nouvelles connexions commerciales générées par une excellente prise de parole", "Voyages courts hautement productifs pour le réseautage"],
      "Câncer": ["Renforcement du pilier affectif familial et équilibre intérieur", "Relance de projets domestiques à forte récompense spirituelle"],
      "Leão": ["Reconnaissance publique et éloges bien mérités", "Expression charismatique attirant de nouveaux investisseurs"],
      "Virgem": ["Organisation méticuleuse éliminant les frais inutiles", "Améliorations méthodologiques générant de hautes performances techniques"],
      "Libra": ["Résolution des malentendus grâce à une diplomatie raffinée", "Partenariats symétriques et coopératifs s'écoulant facilement"],
      "Escorpião": ["Fort instinct intuitif détectant les opportunités commerciales cachées", "Libération émotionnelle et transmutation des anciens ressentiments"],
      "Sagitário": ["Élargissement des horizons grâce à de nouvelles études avancées", "Chance fortuite dans les réseaux sociaux de prestige académique"],
      "Capricórnio": ["Consolidation de postes d'entreprise durables", "Succès dans des investissements conservateurs réglementés"],
      "Aquário": ["Idées d'avant-garde innovantes qui révolutionnent les méthodes", "Abonnement à des services publics et automatisation des routines"],
      "Peixes": ["Pardon spirituel restaurateur libérant le flux de Saturne", "Alignement télépathique facilitant la découverte de nouveaux chemins"]
    }
  };
  
  const defaultOpps = {
    pt: [
      "Entrada extra de dividendos através de foco disciplinado no capital",
      "Melhoria nítida do vigor diário através de ajustes de dieta elemental"
    ],
    en: [
      "Extra dividend income through disciplined focus on capital",
      "Clear improvement in daily vigor through elemental diet adjustments"
    ],
    es: [
      "Ingresos extra por dividendos gracias a un enfoque disciplinado en el capital",
      "Clara mejora del vigor diario mediante ajustes en la dieta elemental"
    ],
    de: [
      "Zusätzliche Dividendenerträge durch disziplinierten Fokus auf das Kapital",
      "Deutliche Verbesserung der täglichen Vitalität durch elementare Diätanpassungen"
    ],
    fr: [
      "Revenus de dividendes supplémentaires grâce à une concentration disciplinée sur le capital",
      "Amélioration nette de la vigueur quotidienne grâce à des ajustements alimentaires élémentaires"
    ]
  };
  
  const opportunities = zodiacOpportunities[lang]?.[canonicalSign] || defaultOpps[lang];
  
  const zodiacChallenges: Record<string, Record<string, string[]>> = {
    pt: {
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
    },
    en: {
      "Áries": ["Explosive impatience facing slow market responses", "Tendency to bypass essential commercial auditing rules"],
      "Touro": ["Obsessive stubbornness with ideas that require urgent rotation", "Dietary anxiety from exaggerated self-demand"],
      "Gêmeos": ["Operational inconsistency leaving projects unfinished", "Excessive social media scrolling draining focus"],
      "Câncer": ["Sudden mood swings based on sterile criticisms", "Excessive attachment to nostalgia and past connections"],
      "Leão": ["Exaggerated pride refusing valuable mature advice", "Extreme need for applause to act structure-wise"],
      "Virgem": ["Neurotic concern over small correctable imperfections", "Bodily stress from relentless self-demand on timing"],
      "Libra": ["Indecision with financial choices that demand absolute clarity", "Yielding to others' whims at the expense of your own balance"],
      "Escorpião": ["Obsessive desire for control generating closed friction", "Hostile silence accumulating superfluous grievances"],
      "Sagitário": ["Lack of physical limits on unnecessary festive spending", "Exaggerated dogmatism in imposing personal philosophies"],
      "Capricórnio": ["Rigidity of behavior pushing away important support", "Bureaucratic pessimism judging before analyzing strengths"],
      "Aquário": ["Unnecessary rebellion ignoring useful operational routines", "Extreme coldness hurting the feelings of close people"],
      "Peixes": ["Escape from reality through fluid emotional excuses", "Energy vulnerability absorbing mental weights from the environment"]
    },
    es: {
      "Áries": ["Impaciencia explosiva ante respuestas lentas del mercado", "Tendencia a saltarse reglas esenciales de auditoría comercial"],
      "Touro": ["Terquedad obsesionada con ideas que requieren rotación urgente", "Ansiedad alimentaria por autoexigencia exagerada"],
      "Gêmeos": ["Inconsistencia operativa que deja proyectos inacabados", "Dispersión excesiva en redes sociales agotando el enfoque"],
      "Câncer": ["Fluctuaciones bruscas de humor según críticas estériles", "Apego desmedido a nostalgias y personas del pasado"],
      "Leão": ["Altivez exagerada que rechaza valiosos consejos maduros", "Necesidad extrema de aplauso para actuar de forma estructurada"],
      "Virgem": ["Preocupación neurótica por pequeñas imperfecciones corregibles", "Estrés corporal por autoexigencia implacable del tiempo"],
      "Libra": ["Indecisión ante opciones financieras que piden claridad absoluta", "Ceder ante caprichos ajenos con perjuicio del propio equilibrio"],
      "Escorpião": ["Deseo de control obsesivo que genera fricción cerrada", "Silencio hostil que acumula resentimientos superfluos"],
      "Sagitário": ["Falta de límite físico en gastos festivos innecesarios", "Dogmatismo exagerado al imponer filosofías de vida"],
      "Capricórnio": ["Rigidez de comportamiento que aleja apoyos importantes", "Pesimismo burocrático que juzga antes de analizar las fuerzas"],
      "Aquário": ["Rebeldía innecesaria ignorando rutinas operativas útiles", "Frialdad extrema que hiere los sentimientos de personas cercanas"],
      "Peixes": ["Fuga de la realidad mediante excusas emocionales fluidas", "Vulnerabilidad energética al absorber pesos mentales del entorno"]
    },
    de: {
      "Áries": ["Explosive Ungeduld bei langsamen Marktreaktionen", "Tendenz, wesentliche kommerzielle Prüfungsregeln zu umgehen"],
      "Touro": ["Besessene Sturheit bei Ideen, die eine dringende Anpassung erfordern", "Ernährungsbedingte Angst durch übertriebene Selbstanforderung"],
      "Gêmeos": ["Operative Unbeständigkeit, die Projekte unvollendet lässt", "Übermäßiges Scrollen in sozialen Medien entzieht den Fokus"],
      "Câncer": ["Plötzliche Stimmungsschwankungen aufgrund unfruchtbarer Kritik", "Übermäßige Anhänglichkeit an Nostalgie und vergangene Kontakte"],
      "Leão": ["Übertriebener Stolz, der wertvolle reife Ratschläge ablehnt", "Extremes Bedürfnis nach Applaus, um strukturiert zu handeln"],
      "Virgem": ["Neurotische Besorgnis über kleine korrigierbare Unvollkommenheiten", "Körperlicher Stress durch unerbittliche Selbstanforderung an das Timing"],
      "Libra": ["Unentschlossenheit bei finanziellen Entscheidungen, die absolute Klarheit erfordern", "Nachgeben gegenüber den Launen anderer auf Kosten des eigenen Gleichgewichts"],
      "Escorpião": ["Besessenes Kontrollbedürfnis erzeugt geschlossene Reibung", "Feindseliges Schweigen häuft überflüssigen Groll an"],
      "Sagitário": ["Mangel an physischen Grenzen bei unnötigen festlichen Ausgaben", "Übertriebener Dogmatismus bei der Aufzwingung persönlicher Philosophien"],
      "Capricórnio": ["Starrheit des Verhaltens vertreibt wichtige Unterstützung", "Bürokratischer Pessimismus urteilt, bevor er Stärken analysiert"],
      "Aquário": ["Unnötige Rebellion, die nützliche operative Routinen ignoriert", "Extreme Kälte verletzt die Gefühle nahestehender Personen"],
      "Peixes": ["Flucht vor der Realität durch fließende emotionale Ausreden", "Energetische Verwundbarkeit absorbiert mentale Gewichte aus der Umgebung"]
    },
    fr: {
      "Áries": ["Impatience explosive face aux réponses lentes du marché", "Tendance à contourner les règles essentielles de l'audit commercial"],
      "Touro": ["Obstination excessive pour des idées qui exigent une rotation urgente", "Anxiété alimentaire due à une auto-exigence exagérée"],
      "Gêmeos": ["Inconstance opérationnelle laissant les projets inachevés", "Dispersion excessive sur les réseaux sociaux drainant la concentration"],
      "Câncer": ["Fluctuations brusques de l'humeur au gré de critiques stériles", "Attachement excessif aux nostalgies et relations du passé"],
      "Leão": ["Fierté exagérée refusant de précieux conseils avisés", "Besoin extrême d'applaudissements pour agir de manière structurée"],
      "Virgem": ["Préoccupation névrotique pour de petites imperfections corrigibles", "Stress corporel dû à une auto-exigence implacable du temps"],
      "Libra": ["Indécision face à des choix financiers exigeant une clarté absolue", "Céder aux caprices d'autrui au détriment de son propre équilibre"],
      "Escorpião": ["Volonté de contrôle obsessionnel générant des frictions fermées", "Silence hostile accumulant des griefs superflus"],
      "Sagitário": ["Manque de limites physiques dans les dépenses de fête inutiles", "Dogmatisme exagéré dans l'imposition de philosophies de vie"],
      "Capricórnio": ["Rigidité de comportement éloignant des soutiens importants", "Pessimisme bureaucratique jugeant avant d'analyser les forces"],
      "Aquário": ["Rébellion inutile ignorant les routines opérationnelles utiles", "Froideur extrême blessant les sentiments des personnes proches"],
      "Peixes": ["Fuite de la réalité par des excuses émotionnelles fluides", "Vulnérabilité énergétique absorbant les poids mentaux de l'environnement"]
    }
  };
  
  const defaultChalls = {
    pt: [
      "Evitar procrastinação em atividades tributárias complexas",
      "Conter reações impulsivas diante de bloqueios administrativos temporários"
    ],
    en: [
      "Avoid procrastination in complex tax activities",
      "Contain impulsive reactions in the face of temporary administrative blocks"
    ],
    es: [
      "Evitar la procrastinación en actividades fiscales complejas",
      "Contener reacciones impulsivas ante bloqueos administrativos temporales"
    ],
    de: [
      "Prokrastination bei komplexen steuerlichen Aktivitäten vermeiden",
      "Impulsive Reaktionen angesichts vorübergehender administrativer Blockaden eindämmen"
    ],
    fr: [
      "Éviter la procrastination dans les activités fiscales complexes",
      "Contenir les réactions impulsives face aux blocages administratifs temporaires"
    ]
  };
  
  const challenges = zodiacChallenges[lang]?.[canonicalSign] || defaultChalls[lang];
  
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
      hex: staticProps.hex,
      bgClass: staticProps.bgClass,
      text: info.colorText
    },
    keyword: info.keyword,
    amulet: info.amulet,
    favoredElement: elementLabel,
    favoredLifeArea: info.favoredLifeArea,
    attentionLifeArea: info.attentionLifeArea,
    opportunities,
    challenges,
    strategicAdvice,
    lang
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

// Maps any translated sign name back to its canonical Portuguese name to ensure dictionary compatibility
function canonicalSignName(sign: string): string {
  if (!sign) return "Touro";
  const normalized = sign.toLowerCase().trim();
  
  const ptSigns = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem", "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
  
  // Try exact or substring match in Portuguese first
  for (const pts of ptSigns) {
    if (normalized.includes(pts.toLowerCase())) {
      return pts;
    }
  }

  // Check translated dictionary
  for (const lang of ['pt', 'en', 'es', 'de', 'fr'] as const) {
    const signsMap = TRANSLATED_SIGNS[lang];
    if (signsMap) {
      for (const [canonical, translated] of Object.entries(signsMap)) {
        if (normalized.includes(translated.toLowerCase()) || normalized.includes(canonical.toLowerCase())) {
          return canonical;
        }
      }
    }
  }
  return "Touro";
}

export interface FavorableColorItem {
  title: string;
  name: string;
  hex: string;
  bgClass: string;
  text: string;
}

export function generatePersonalizedColorsList(
  birthDate: string,
  userSunSign: string,
  overrideLang?: string
): FavorableColorItem[] {
  const lang = getActiveLanguage(overrideLang);
  const canonicalSign = canonicalSignName(userSunSign);
  const signInfo = getZodiacSignInfoByString(canonicalSign);
  const element = signInfo.element; // Fogo, Terra, Ar, Água

  // Translate sign for insertion
  const translatedSign = TRANSLATED_SIGNS[lang]?.[canonicalSign] || canonicalSign;
  const lifePath = calculateLifePathNumber(birthDate);

  // 1. Cor Principal do Mês
  let mainColorHex = "#1e3a8a";
  let mainColorBg = "bg-[#1e3a8a]";
  let mainColorName = "Azul Cobalto Real";

  if (element === "Fogo") {
    mainColorHex = "#b91c1c";
    mainColorBg = "bg-[#b91c1c]";
    mainColorName = lang === "en" ? "Crimson Red" : lang === "es" ? "Rojo Carmín" : lang === "de" ? "Karminrot" : lang === "fr" ? "Rouge Carmin" : "Vermelho Carmim";
  } else if (element === "Terra") {
    mainColorHex = "#059669";
    mainColorBg = "bg-[#059669]";
    mainColorName = lang === "en" ? "Emerald Green" : lang === "es" ? "Verde Esmeralda" : lang === "de" ? "Smaragdgrün" : lang === "fr" ? "Vert Émeraude" : "Verde Esmeralda";
  } else if (element === "Ar") {
    mainColorHex = "#1e3a8a";
    mainColorBg = "bg-[#1e3a8a]";
    mainColorName = lang === "en" ? "Royal Cobalt Blue" : lang === "es" ? "Azul Cobalto Real" : lang === "de" ? "Königliches Kobaltblau" : lang === "fr" ? "Bleu Cobalt Royal" : "Azul Cobalto Real";
  } else if (element === "Água") {
    mainColorHex = "#4338ca";
    mainColorBg = "bg-[#4338ca]";
    mainColorName = lang === "en" ? "Deep Indigo" : lang === "es" ? "Índigo Profundo" : lang === "de" ? "Tiefes Indigo" : lang === "fr" ? "Indigo Profond" : "Índigo Profundo";
  }

  const mainColorTitle = lang === "en" ? "Main Color of the Month" : lang === "es" ? "Color Principal del Mes" : lang === "de" ? "Hauptfarbe des Monats" : lang === "fr" ? "Couleur Principale du Mois" : "Cor Principal do Mês";
  const mainColorText = lang === "en" ? `Activates the rational mind of ${translatedSign}, eliminating the stress of cosmic Jupiter transits.` :
                        lang === "es" ? `Activa la mente racional de ${translatedSign}, eliminando el estrés de los tránsitos cósmicos de Júpiter.` :
                        lang === "de" ? `Aktiviert den rationalen Geist von ${translatedSign} und eliminiert den Stress der kosmischen Jupiter-Transite.` :
                        lang === "fr" ? `Active l'esprit rationnel de ${translatedSign}, éliminant le stress des transits cosmiques de Jupiter.` :
                        `Ativa sua mente racional de ${translatedSign}, eliminando o estresse dos trânsitos cósmicos de Júpiter.`;

  // 2. Cor de Transcendência
  const transColorHex = "#6366f1";
  const transColorBg = "bg-[#6366f1]";
  const transColorName = lang === "en" ? "Stellar Violet" : lang === "es" ? "Violeta Estelar" : lang === "de" ? "Sternenviolett" : lang === "fr" ? "Violet Stellaire" : "Violeta Estelar";
  const transColorTitle = lang === "en" ? "Transcendence Color" : lang === "es" ? "Color de Trascendencia" : lang === "de" ? "Farbe der Transzendenz" : lang === "fr" ? "Couleur de Transcendance" : "Cor de Transcendência";
  const transColorText = lang === "en" ? `Stimulates intuitive receptions in dreams and connects the mind meridians of ${translatedSign}.` :
                         lang === "es" ? `Estimula las recepciones intuitivas en los sueños y conecta los meridianos de la mente de ${translatedSign}.` :
                         lang === "de" ? `Fördert intuitive Wahrnehmungen in Träumen und verbindet die Gedankenmeridiane von ${translatedSign}.` :
                         lang === "fr" ? `Stimule les réceptions intuitives dans les rêves et connecte les méridiens de l'esprit de ${translatedSign}.` :
                         `Estimula recepções intuitivas nos sonhos e conecta os meridianos da mente de ${translatedSign}.`;

  // 3. Cor para Prosperidade
  let prosColorHex = "#eab308";
  let prosColorBg = "bg-[#eab308]";
  let prosColorName = "Dourado Solar";

  if (lifePath === 1 || lifePath === 8) {
    prosColorHex = "#eab308";
    prosColorBg = "bg-[#eab308]";
    prosColorName = lang === "en" ? "Solar Gold" : lang === "es" ? "Dorado Solar" : lang === "de" ? "Sonnengold" : lang === "fr" ? "Or Solaire" : "Dourado Solar";
  } else if (lifePath === 2 || lifePath === 6) {
    prosColorHex = "#ea580c";
    prosColorBg = "bg-[#ea580c]";
    prosColorName = lang === "en" ? "Coral Orange" : lang === "es" ? "Naranja Coral" : lang === "de" ? "Korallenorange" : lang === "fr" ? "Orange Corail" : "Laranja Coral";
  } else if (lifePath === 3 || lifePath === 5) {
    prosColorHex = "#ca8a04";
    prosColorBg = "bg-[#ca8a04]";
    prosColorName = lang === "en" ? "Bright Citrine" : lang === "es" ? "Citrino Brillante" : lang === "de" ? "Strahlendes Zitrin" : lang === "fr" ? "Citrine Éclatante" : "Citrino Brilhante";
  } else if (lifePath === 4 || lifePath === 7) {
    prosColorHex = "#16a34a";
    prosColorBg = "bg-[#16a34a]";
    prosColorName = lang === "en" ? "Malachite Green" : lang === "es" ? "Verde Malaquita" : lang === "de" ? "Malachitgrün" : lang === "fr" ? "Vert Malachite" : "Malaquita Verde";
  } else {
    prosColorHex = "#db2777";
    prosColorBg = "bg-[#db2777]";
    prosColorName = lang === "en" ? "Quartz Rose" : lang === "es" ? "Rosa Cuarzo" : lang === "de" ? "Quarzrosa" : lang === "fr" ? "Rose Quartz" : "Rosa Quartzo";
  }

  const prosColorTitle = lang === "en" ? "Color for Prosperity" : lang === "es" ? "Color para la Prosperidad" : lang === "de" ? "Farbe für Wohlstand" : lang === "fr" ? "Couleur pour la Prospérité" : "Cor para Prosperidade";
  const prosColorText = lang === "en" ? `Amplifies the material magnetism of Life Path ${lifePath}. Use in your wallet or bank accounts.` :
                        lang === "es" ? `Amplifica el magnetismo material de tu Camino de Vida ${lifePath}. Úsalo en la billetera o cuentas bancarias.` :
                        lang === "de" ? `Verstärkt die materielle Anziehungskraft des Lebenswegs ${lifePath}. In der Brieftasche oder auf Bankkonten verwenden.` :
                        lang === "fr" ? `Amplifie le magnétisme matériel de votre Chemin de Vie ${lifePath}. Utilisez-le dans votre portefeuille ou vos comptes bancaires.` :
                        `Amplifica o magnetismo material do Caminho de Vida ${lifePath}. Use na carteira ou contas bancárias.`;

  // 4. Cor para Afeto
  const loveColorHex = "#f43f5e";
  const loveColorBg = "bg-[#f43f5e]";
  const loveColorName = lang === "en" ? "Subtle Quartz Pink" : lang === "es" ? "Rosa Cuarzo Sutil" : lang === "de" ? "Sanftes Quarzrosa" : lang === "fr" ? "Rose Quartz Subtil" : "Rosa Quartzo Sutil";
  const loveColorTitle = lang === "en" ? "Color for Affection" : lang === "es" ? "Color para el Afecto" : lang === "de" ? "Farbe für Zuneigung" : lang === "fr" ? "Couleur pour l'Affection" : "Cor para Afeto";
  const loveColorText = lang === "en" ? `Softens defenses in favor of loving acceptance for ${translatedSign} through the Venus transit.` :
                        lang === "es" ? `Suaviza las defensas a favor de la acogida amorosa de ${translatedSign} a través del tránsito de Venus.` :
                        lang === "de" ? `Mildert Abwehrmechanismen zugunsten einer liebevollen Annahme für ${translatedSign} durch den Venus-Transit.` :
                        lang === "fr" ? `Adoucit les défenses au profit d'un accueil chaleureux pour ${translatedSign} grâce au transit de Vénus.` :
                        `Suaviza as defesas em prol do acolhimento amoroso de ${translatedSign} através do trânsito de Vênus.`;

  // 5. Cor para Trabalho
  const workColorHex = "#334155";
  const workColorBg = "bg-[#334155]";
  const workColorName = lang === "en" ? "Saturn Slate Gray" : lang === "es" ? "Gris Pizarra Saturno" : lang === "de" ? "Saturn-Schiefergrau" : lang === "fr" ? "Gris Ardoise Saturne" : "Cinza Slate Saturno";
  const workColorTitle = lang === "en" ? "Color for Work" : lang === "es" ? "Color para el Trabajo" : lang === "de" ? "Farbe für Arbeit" : lang === "fr" ? "Couleur pour le Travail" : "Cor para Trabalho";
  const workColorText = lang === "en" ? `Fosters operational discipline to consolidate the purposes of Life Path ${lifePath}.` :
                        lang === "es" ? `Fomenta la disciplina operativa para consolidar los propósitos del Camino de Vida ${lifePath}.` :
                        lang === "de" ? `Fördert die operative Disziplin, um die Ziele des Lebenswegs ${lifePath} zu festigen.` :
                        lang === "fr" ? `Favorise la discipline opérationnelle pour consolider les objectifs de votre Chemin de Vie ${lifePath}.` :
                        `Fomenta disciplina operacional para consolidar os propósitos do Caminho de Vida ${lifePath}.`;

  // 6. Cor de Proteção
  const protColorHex = "#f8fafc";
  const protColorBg = "bg-[#f8fafc]";
  const protColorName = lang === "en" ? "Pearl Off-White" : lang === "es" ? "Blanco Perla" : lang === "de" ? "Perlmutt-Off-White" : lang === "fr" ? "Blanc Perle" : "Off-White Pérola";
  const protColorTitle = lang === "en" ? "Protection Color" : lang === "es" ? "Color de Protección" : lang === "de" ? "Schutzfarbe" : lang === "fr" ? "Couleur de Protection" : "Cor de Proteção";
  const protColorText = lang === "en" ? `Ideal for purifying dense vibrations and shielding the energy field of ${translatedSign}.` :
                        lang === "es" ? `Ideal para purificar vibraciones densas y blindar el campo energético de ${translatedSign}.` :
                        lang === "de" ? `Ideal zur Reinigung dichter Schwingungen und zur Abschirmung des Energiefeldes von ${translatedSign}.` :
                        lang === "fr" ? `Idéal pour purifier les vibrations denses et blinder le champ énergétique de ${translatedSign}.` :
                        `Ideal para purificar vibrações densas e blindar o campo energético de ${translatedSign}.`;

  return [
    { title: mainColorTitle, name: mainColorName, hex: mainColorHex, bgClass: mainColorBg, text: mainColorText },
    { title: transColorTitle, name: transColorName, hex: transColorHex, bgClass: transColorBg, text: transColorText },
    { title: prosColorTitle, name: prosColorName, hex: prosColorHex, bgClass: prosColorBg, text: prosColorText },
    { title: loveColorTitle, name: loveColorName, hex: loveColorHex, bgClass: loveColorBg, text: loveColorText },
    { title: workColorTitle, name: workColorName, hex: workColorHex, bgClass: workColorBg, text: workColorText },
    { title: protColorTitle, name: protColorName, hex: protColorHex, bgClass: protColorBg, text: protColorText }
  ];
}

export function generateDynamicElementInfo(
  userSunSign: string,
  overrideLang?: string
): { title: string; text: string } {
  const lang = getActiveLanguage(overrideLang);
  const canonicalSign = canonicalSignName(userSunSign);
  const signInfo = getZodiacSignInfoByString(canonicalSign);
  const element = signInfo.element; // Fogo, Terra, Ar, Água
  const translatedSign = TRANSLATED_SIGNS[lang]?.[canonicalSign] || canonicalSign;

  let title = "Seu Elemento Ativo: Ar";
  let text = "";

  if (lang === "en") {
    title = `Your Active Element: ${element === "Fogo" ? "Fire" : element === "Terra" ? "Earth" : element === "Ar" ? "Air" : "Water"}`;
    if (element === "Fogo") {
      text = `Fire governs your ${translatedSign} matrix. It brings passion, active energy, and creative impulses for new initiatives and businesses. Align your element by using dynamic colors or lighting an amber candle in the morning.`;
    } else if (element === "Terra") {
      text = `Earth governs your ${translatedSign} matrix. It brings material stability, practical persistence, and determination to structure your projects. Align your element by maintaining direct contact with plants or keeping physical crystals close.`;
    } else if (element === "Ar") {
      text = `Air governs your ${translatedSign} matrix. It brings speed of reasoning, open intuition, and ease in proposing business solutions and fluid communication. Align your element by lighting sandalwood in the morning and opening windows.`;
    } else {
      text = `Water governs your ${translatedSign} matrix. It brings deep intuition, psychic sensitivity, and emotional magnetism to unlock paths and heal feelings. Align your element by keeping hydrated and taking purifying baths.`;
    }
  } else if (lang === "es") {
    title = `Tu Elemento Activo: ${element === "Fogo" ? "Fuego" : element === "Terra" ? "Tierra" : element === "Ar" ? "Aire" : "Agua"}`;
    if (element === "Fogo") {
      text = `El Fuego gobierna tu matriz de ${translatedSign}. Trae pasión, energía activa e impulsos creativos para nuevas iniciativas y negocios. Alinea tu elemento usando colores dinámicos o encendiendo una vela ámbar por la mañana.`;
    } else if (element === "Terra") {
      text = `La Tierra gobierna tu matriz de ${translatedSign}. Trae estabilidad material, persistencia práctica y determinación para estructurar tus proyectos. Alinea tu elemento manteniendo contacto directo con plantas o llevando cristales físicos.`;
    } else if (element === "Ar") {
      text = `El Aire gobierna tu matriz de ${translatedSign}. Trae velocidad de razonamiento, intuición abierta y facilidad para proponer soluciones comerciales y comunicación fluida. Alinea tu elemento encendiendo sándalo por la mañana y abriendo ventanas.`;
    } else {
      text = `El Agua gobierna tu matriz de ${translatedSign}. Trae intuición profunda, sensibilidad psíquica y magnetismo emocional para desvelar caminos y sanar sentimientos. Alinea tu elemento bebiendo suficiente agua y tomando baños purificadores.`;
    }
  } else if (lang === "de") {
    title = `Dein aktives Element: ${element === "Fogo" ? "Feuer" : element === "Terra" ? "Erde" : element === "Ar" ? "Luft" : "Wasser"}`;
    if (element === "Fogo") {
      text = `Feuer regiert deine ${translatedSign}-Matrix. Es bringt Leidenschaft, aktive Energie und kreative Impulse für neue Initiativen und Unternehmen. Richte dein Element aus, indem du dynamische Farben trägst oder morgens eine bernsteinfarbene Kerze anzündest.`;
    } else if (element === "Terra") {
      text = `Erde regiert deine ${translatedSign}-Matrix. Sie bringt materielle Stabilität, praktische Beharrlichkeit und Entschlossenheit, deine Projekte zu strukturieren. Richte dein Element aus, indem du direkten Kontakt mit Pflanzen pflegst oder physische Kristalle aufbewahrst.`;
    } else if (element === "Ar") {
      text = `Luft regiert deine ${translatedSign}-Matrix. Sie bringt Schnelligkeit im Denken, offene Intuition und Leichtigkeit bei der Formulierung von Geschäftslösungen und flüssiger Kommunikation. Richte dein Element aus, indem du morgens Sandelholz anzündest und Fenster öffnest.`;
    } else {
      text = `Wasser regiert deine ${translatedSign}-Matrix. Es bringt tiefe Intuition, psychische Sensibilität und emotionalen Magnetismus, um Wege zu ebnen und Gefühle zu heilen. Richte dein Element aus, indem du ausreichend Wasser trinkst und reinigende Bäder nimmst.`;
    }
  } else if (lang === "fr") {
    title = `Votre Élément Actif: ${element === "Fogo" ? "Feu" : element === "Terra" ? "Terre" : element === "Ar" ? "Air" : "Eau"}`;
    if (element === "Fogo") {
      text = `Le Feu régit votre matrice de ${translatedSign}. Il apporte passion, énergie active et impulsions créatrices pour de nouvelles initiatives et entreprises. Alignez votre élément en utilisant des couleurs dynamiques ou en allumant une bougie d'ambre le matin.`;
    } else if (element === "Terra") {
      text = `La Terre régit votre matrice de ${translatedSign}. Elle apporte stabilité matérielle, persistance pratique et détermination pour structurer vos projets. Alignez votre élément en gardant un contact direct avec les plantes ou en portant des cristaux.`;
    } else if (element === "Ar") {
      text = `L'Air régit votre matrice de ${translatedSign}. Il apporte rapidité de raisonnement, intuition ouverte et facilité à proposer des solutions commerciales et une communication fluide. Alignez votre élément en faisant brûler du santal le matin et en ouvrant les fenêtres.`;
    } else {
      text = `L'Eau régit votre matrice de ${translatedSign}. Elle apporte une intuition profonde, une sensibilité psychique et un magnétisme émotionnel pour ouvrir des voies et guérir les sentiments. Alignez votre élément en restant hydraté et en prenant des bains purificateurs.`;
    }
  } else {
    title = `Seu Elemento Ativo: ${element === "Fogo" ? "Fogo" : element === "Terra" ? "Terra" : element === "Ar" ? "Ar" : "Água"}`;
    if (element === "Fogo") {
      text = `O Fogo governa sua matriz de ${translatedSign}. Traz paixão, energia ativa e impulsos criativos para novas iniciativas e negócios. Alinhe seu elemento utilizando cores dinâmicas ou acendendo uma vela âmbar pela manhã.`;
    } else if (element === "Terra") {
      text = `A Terra governa sua matriz de ${translatedSign}. Traz estabilidade material, persistência prática e determinação para estruturar seus projetos. Alinhe seu elemento mantendo contato direto com plantas ou portando cristais físicos próximos.`;
    } else if (element === "Ar") {
      text = `O Ar governa sua matriz de ${translatedSign}. Traz velocidade de raciocínio, intuição aberta e facilidade para propor soluções de negócios e comunicação fluida. Alinhe seu elemento acendendo sândalo logo pela manhã e abrindo as janelas do quarto.`;
    } else {
      text = `A Água governa sua matriz de ${translatedSign}. Traz intuição profunda, sensibilidade psíquica e magnetismo emocional para desvendar caminhos e curar sentimentos. Alinhe seu elemento mantendo-se sempre bem hidratado e fazendo banhos purificadores.`;
    }
  }

  return { title, text };
}

export function generateDynamicAmuletText(
  birthDate: string,
  overrideLang?: string
): string {
  const lang = getActiveLanguage(overrideLang);
  const lifePath = calculateLifePathNumber(birthDate);

  if (lang === "en") {
    return `Use a tuning stone or amulet (such as a Citrine or Tiger's Eye) placed in your wallet or investment purse to guide your practical actions toward consolidating Life Path ${lifePath}.`;
  } else if (lang === "es") {
    return `Usa una piedra de sintonización o amuleto (como un Citrino o de Ojo de Tigre) colocado en tu billetera o bolso de inversión para guiar tus acciones prácticas hacia la consolidación del Camino ${lifePath}.`;
  } else if (lang === "de") {
    return `Verwende einen Stimmstein oder ein Amulett (wie einen Citrin oder Tigerauge) in deiner Brieftasche oder Anlagetasche, um deine praktischen Handlungen auf die Konsolidierung des Lebenswegs ${lifePath} auszurichten.`;
  } else if (lang === "fr") {
    return `Utilisez une pierre d'accordage ou un amulette (tel qu'une Citrine ou un Œil de Tigre) placé dans votre portefeuille ou sac d'investissement pour guider vos actions pratiques vers la consolidation de votre Chemin de Vie ${lifePath}.`;
  } else {
    return `Use uma pedra de sintonização ou amuleto (como Citrino ou Olho de Tigre) posicionado na bolsa ou carteira de investimentos para guiar suas ações práticas rumo à consolidação do Caminho de Vida ${lifePath}.`;
  }
}

export interface DailyAstroRecommendations {
  casa: {
    aroma: string;
    aroma_desc: string;
    incenso: string;
    incenso_desc: string;
    planta: string;
    planta_desc: string;
    ambiente_casa: string;
    ambiente_casa_desc: string;
    quarto_cor: string;
    quarto_cor_desc: string;
    escritorio_cor: string;
    escritorio_cor_desc: string;
    cristal_casa: string;
    cristal_casa_desc: string;
    ritual_casa: string;
    ritual_casa_desc: string;
    direcao_cardeal: string;
    direcao_cardeal_desc: string;
    frequencia_som: string;
    frequencia_som_desc: string;
  };
  desenvolvimento: {
    habilidade: string;
    habilidade_desc: string;
    bloqueio: string;
    bloqueio_desc: string;
    virtude: string;
    licao: string;
    exercicio: string;
  };
  mensagem: {
    conselho_principal: string;
    alerta_principal: string;
    oportunidade_principal: string;
    palavra_protecao: string;
    palavra_protecao_desc: string;
  };
  painel: {
    palavra_chave: string;
    palavra_chave_desc: string;
    simbolo: string;
    simbolo_desc: string;
    amuleto: string;
    amuleto_desc: string;
    numero_sorte: string;
    numero_sorte_desc: string;
    cor_favoravel: string;
    cor_favoravel_desc: string;
    ambiente_favoravel: string;
    ambiente_favoravel_desc: string;
    atividade_favoravel: string;
    atividade_favoravel_desc: string;
    desafio: string;
    desafio_desc: string;
    oportunidade: string;
    oportunidade_desc: string;
    energia_dominante: string;
    energia_dominante_desc: string;
    evitar: string;
    evitar_desc: string;
    area_foco: string;
    area_foco_desc: string;
    frase_poder: string;
  };
}

export function generateDailyAstroRecommendations(
  userSunSign: string,
  lifePathNumber: number,
  targetDate: Date,
  overrideLang?: string
): DailyAstroRecommendations {
  const lang = getActiveLanguage(overrideLang);
  const canonicalSign = canonicalSignName(userSunSign);
  const signInfo = getZodiacSignInfoByString(canonicalSign);
  const element = signInfo.element; // Fogo, Terra, Ar, Água

  const day = targetDate.getDate();
  const monthIdx = targetDate.getMonth() + 1;
  const seed = day + monthIdx * 7 + lifePathNumber * 3;

  // Dictionary variations
  const recommendationsData: Record<string, {
    aromas: { name: string; desc: string }[];
    incenses: { name: string; desc: string }[];
    plants: { name: string; desc: string }[];
    rooms: { name: string; desc: string }[];
    bedroomColors: { name: string; desc: string }[];
    officeColors: { name: string; desc: string }[];
    crystals: { name: string; desc: string }[];
    rituals: { title: string; desc: string }[];
    directions: { name: string; desc: string }[];
    frequencies: { name: string; desc: string }[];
    skills: { name: string; desc: string }[];
    blocks: { name: string; desc: string }[];
    virtues: string[];
    lessons: string[];
    exercises: string[];
    advices: string[];
    alerts: string[];
    opportunities: string[];
    protectWords: { word: string; desc: string }[];
    keywords: { word: string; desc: string }[];
    symbols: { name: string; desc: string }[];
    amulets: { name: string; desc: string }[];
    environments: { name: string; desc: string }[];
    activities: { name: string; desc: string }[];
    challenges: { name: string; desc: string }[];
    opps: { name: string; desc: string }[];
    energies: { name: string; desc: string }[];
    evitars: { name: string; desc: string }[];
    foci: { name: string; desc: string }[];
    phrases: string[];
  }> = {
    pt: {
      aromas: [
        { name: "Alecrim Concentrado", desc: "Purifica canais intelectuais e estimula decisões rápidas e lógicas na rotina." },
        { name: "Capim-Limão Refrescante", desc: "Dissolve agitações e sintoniza a mente superior com vibrações de paz." },
        { name: "Lavanda Francesa Sutil", desc: "Acalma o chakra cardíaco e regenera vias de sono profundo no quarto." },
        { name: "Sândalo Amadeirado", desc: "Aterra ideais, ligando metas espirituais com a estrutura material prática." }
      ],
      incenses: [
        { name: "Sândalo ou Alecrim", desc: "Excelente para banir exaustão de telas digitais e cansaço mental acumulado." },
        { name: "Mirra ou Breu Branco", desc: "Sela as coordenadas do ambiente de intrusões ou energias densas externas." },
        { name: "Palo Santo Natural", desc: "Atrai o fluxo de prosperidade e limpa poeiras psíquicas das terças-feiras." },
        { name: "Cânfora ou Hortelã", desc: "Renova o ar celular e ativa a clareza e o foco durante reuniões críticas." }
      ],
      plants: [
        { name: "Lírio da Paz Sagrado", desc: "Purifica os canais áuricos do ar doméstico e traz serenidade emocional." },
        { name: "Espada de São Jorge", desc: "Cria um escudo impenetrável contra dispersões e invejas na mesa de trabalho." },
        { name: "Zamioculca da Fortuna", desc: "Ancora o magnetismo de dinheiro e prosperidade no elemento Terra." },
        { name: "Manjericão de Proteção", desc: "Irradia vitalidade e cura canais de cansaço molecular na cozinha ou sala." }
      ],
      rooms: [
        { name: "Canto Leste (Nascer do Sol)", desc: "Espaço de alta recepção prânica. Ideal para alongamentos, meditação ativa e clareza matinal." },
        { name: "Canto Norte da sala de estar", desc: "Ancoragem do elemento Terra para estabilização de conversas familiares e acolhimento." },
        { name: "Proximidade de janelas arejadas", desc: "Fluxo direto do elemento Ar que dissipa estagnação mental e estimula novas ideias." },
        { name: "Centro geométrico do lar", desc: "Ponto focal de equilíbrio dos 4 elementos, harmonizando o campo biomagnético da casa." }
      ],
      bedroomColors: [
        { name: "Azul Lavanda", desc: "Acalma o sistema nervoso central, harmonizando o sono profundo e despertando memórias lúcidas." },
        { name: "Lilás Sutil", desc: "Eleva a vibração transmutadora do quarto, purificando resíduos emocionais acumulados." },
        { name: "Verde Menta Claro", desc: "Regenera a vitalidade celular durante o repouso noturno e desacelera o ritmo cardíaco." },
        { name: "Cinza Cósmico Suave", desc: "Proporciona neutralidade psíquica, ideal para filtrar interferências externas no descanso." }
      ],
      officeColors: [
        { name: "Azul Índigo Real", desc: "Ativa os centros intelectuais superiores, elevando a clareza mental, foco e concentração profissional." },
        { name: "Verde Esmeralda", desc: "Ancora a frequência de prosperidade e estabilidade em tomadas de decisões financeiras." },
        { name: "Cinza Grafite Puro", desc: "Favorece a disciplina linear, minimizando distrações e organizando rotinas complexas." },
        { name: "Âmbar Claro", desc: "Irradia entusiasmo solar e dinamismo criativo para negociações e projetos inovadores." }
      ],
      crystals: [
        { name: "Selenita Branca de Purificação", desc: "Posicione na entrada principal ou perto de telas para criar um portal contínuo de limpeza áurica." },
        { name: "Turmalina Negra de Proteção", desc: "Mantenha nos cantos da casa para repelir cargas pesadas e neutralizar radiações eletromagnéticas." },
        { name: "Quartzo Rosa do Amor Incondicional", desc: "Coloque na mesa central ou quarto para suavizar tensões relacionais e irradiar harmonia." },
        { name: "Pirita Dourada da Abundância", desc: "Deixe no escritório ou espaço de trabalho para magnetizar oportunidades de prosperidade e riqueza." }
      ],
      rituals: [
        { title: "Limpeza de Fumaça Sagrada", desc: "Acenda um bastão de Palo Santo ou Incenso de Alecrim e percorra os cantos do lar no sentido horário." },
        { title: "Renovação do Ar e Iluminação", desc: "Abra todas as janelas por 15 minutos ao amanhecer para substituir o ar estagnado pela luz solar." },
        { title: "Organização do Fluxo de Entrada", desc: "Desobstrua a porta de entrada e remova objetos quebrados para permitir a livre circulação de chi." },
        { title: "Harmonização com Elemento Água", desc: "Borrife água com gotas de óleo essencial de lavanda nos cortinados para suavizar o ambiente." }
      ],
      directions: [
        { name: "Direção Leste", desc: "Alinhamento com o elemento Fogo e o nascer do Sol para impulsionar novos começos e vigor." },
        { name: "Direção Norte", desc: "Sintonia com o elemento Terra para fortalecer a estabilidade material e a segurança do lar." },
        { name: "Direção Oeste", desc: "Conexão com o elemento Água para promover o acolhimento afetivo e a paz nos relacionamentos." },
        { name: "Direção Sul", desc: "Inspirado pelo elemento Ar para expandir a comunicação, criatividade e visão de futuro." }
      ],
      frequencies: [
        { name: "Frequência de 528 Hz (Milagres)", desc: "Sintonize ao fundo no ambiente para harmonizar os átomos do espaço e promover cura celular." },
        { name: "Frequência de 432 Hz (Sintonia Natural)", desc: "Toque durante momentos de descanso para alinhar o lar com a ressonância harmônica da Terra." },
        { name: "Frequência de 639 Hz (Relacionamentos)", desc: "Ideal para a sala de estar para dissolver atritos e promover empatia no convívio diário." },
        { name: "Frequência de 741 Hz (Intuição & Limpeza)", desc: "Utilize durante limpezas e arrumações para eliminar toxinas psíquicas do lar." }
      ],
      skills: [
        { name: "Inteligência Compassiva & Aterramento", desc: "Aprender a canalizar ideais abstratos para ações práticas imediatas de manifestação." },
        { name: "Foco Singular Descomplicado", desc: "A capacidade de se isolar de distrações virtuais e terminar uma única tarefa robusta." },
        { name: "Escuta Ativa Afetiva", desc: "Ouvir o outro com o coração livre de respostas mecânicas ou silogismos lógicos." },
        { name: "Discernimento Kármico Prático", desc: "Reconhecer padrões cíclicos de exaustão e cortar despesas ou hábitos redundantes." }
      ],
      blocks: [
        { name: "Medo do julgamento alheio", desc: "Gera distanciamentos ou orgulhos frios que impedem a verdadeira intimidade." },
        { name: "Compulsão de planejar sem agir", desc: "Acumular dezenas de rascunhos sem dar o primeiro passo prático por receio do erro." },
        { name: "Racionalização de afetos", desc: "Tentar debater sentimentos puros com lógica fria e regras rígidas." },
        { name: "Desperdiço de energia celular", desc: "Gastar horas defendendo ideais ou debatendo nas redes sociais por impulsividade." }
      ],
      virtues: ["Presença", "Estrutura", "Paciência", "Humildade", "Vulnerabilidade", "Coragem", "Silêncio"],
      lessons: [
        "A abundância real e as conexões sinceras não florescem por inteligência matemática, mas sim quando aceitamos abraçar nossa vulnerabilidade.",
        "A verdadeira sabedoria reside em calar os planos e deixar que as obras sintonizadas falem sozinhas na matéria.",
        "Nenhum trânsito astral de sorte compensa a falta de disciplina diária. O Caminho de Vida exige consistência firme.",
        "Perdoar desentendimentos antigos do passado é o único atalho real para desbloquear o fluxo das finanças hoje."
      ],
      exercises: [
        "Reserve 10 minutos longe de qualquer tela, respire profundamente pelo nariz e visualize uma luz dourada limpando seu cérebro.",
        "Escreva três metas simples em um papel com tinta preta e execute a primeira delas sem adiar por análises excessivas.",
        "Faça uma caminhada de 15 minutos descalço na grama ou sinta o sol da manhã no rosto para alinhar seu biorritmo vital.",
        "Envie uma mensagem curta e sincera de gratidão a alguém de sua história que raramente recebe seu contato."
      ],
      advices: [
        "Dê vazão rápida aos seus insights práticos hoje. Acumular planos sem agir satura seu campo sutil.",
        "Mantenha o silêncio estratégico sobre seus planos de negócios nesta lunação. Evite conselhos de terceiros céticos.",
        "Sua matriz astral hoje favorece o foco na saúde e purificação molecular. Reduza a ingestão de alimentos densos.",
        "O dia pede a harmonização de antigas pendências afetivas. Um gesto simples de carinho desarmará antigos muros."
      ],
      alerts: [
        "Cuidado com dispersões financeiras de compensação afetiva. Trânsito lunar propício a gastos de impulso hoje.",
        "Evite debates calorosos em redes sociais ou canais de chat. Não desgaste sua preciosa energia vital com opiniões alheias.",
        "Atenção a dores musculares por má postura física diante do computador. Faça pausas frequentes a cada 50 minutos.",
        "Evite assinar contratos de longo prazo de forma apressada. Leia todas as entrelinhas e consulte mentores experientes."
      ],
      opportunities: [
        "Conversas com velhas amizades sintonizadas abrem canais inesperados para novos negócios ou projetos cooperativos.",
        "Um insight original surgirá durante momentos de silêncio e repouso. Anote imediatamente em seu caderno físico.",
        "O trânsito atual abre portais para renegociar pendências ou assinaturas e estancar vazamentos de capital.",
        "Novos aprendizados em estudos sutis ou de inteligência trarão clareza incomum para decisões de carreira."
      ],
      protectWords: [
        { word: "ÂNCORE-SE", desc: "Repita mentalmente ao acordar para banir distrações e dispersões cognitivas." },
        { word: "FLUA EM PAZ", desc: "Lembre-se de respirar fundo quando encontrar atritos ou atrasos mecânicos na rotina." },
        { word: "ESTRUTURA FIRME", desc: "Mentalize para ancorar seus propósitos na matéria com determinação e persistência." },
        { word: "CLAREZA INTERIOR", desc: "Use para banir névoas mentais ou dúvidas sutis geradas por opiniões alheias." }
      ],
      keywords: [
        { word: "EXPANSÃO SUTIL", desc: "Cresça de forma diplomática respeitando os canais de silêncio do seu próprio ser." },
        { word: "ESTRUTURAÇÃO", desc: "Organize as fundações físicas antes de lançar novos projetos rumo aos céus." },
        { word: "ALINHAMENTO", desc: "Sintonize suas ações de rotina com o trânsito planetário dominante de hoje." },
        { word: "MANIFESTAÇÃO", desc: "Traga os insights metafísicos para a matéria através de pequenas tarefas consistentes." }
      ],
      symbols: [
        { name: "Heptagrama Sagrado (⭐️)", desc: "Representa os sete caminhos de proteção que selam seu campo energético áurico." },
        { name: "Ankh (Chave da Vida)", desc: "Simboliza a união das forças celestes e terrestres regulando sua vitalidade física." },
        { name: "Olho de Hórus (𓂀)", desc: "Traz percepção aguçada e proteção contra desvios ou névoas intelectuais." },
        { name: "Espiral Áurea Cósmica", desc: "Sinaliza crescimento contínuo, harmônico e focado na evolução milenar." }
      ],
      amulets: [
        { name: "Escarabeu de Lápis-Lazúli", desc: "Atua na proteção física, facilitando transações e banindo a exaustão acumulada." },
        { name: "Pirita Cubo de Ouro", desc: "Irradia a frequência solar de riqueza, merecimento e foco realizador material." },
        { name: "Quartzo Rosa Bruto", desc: "Filtra sentimentos de tensão cardíaca e abre canais de diálogo compreensivo em casa." },
        { name: "Sodalita de Foco", desc: "Estrutura as vias cerebrais para a absorção técnica de ensinamentos complexos." }
      ],
      environments: [
        { name: "Bibliotecas ou Jardins de Lago", desc: "Fomentam a absorção silenciosa de conhecimento e a desaceleração cardíaca." },
        { name: "Espaços com Luz Solar Direta", desc: "Recarregam o plexo solar e aumentam o ânimo molecular para novos começos." },
        { name: "Cantos Silenciosos de Templos", desc: "Facilitam a conexão telepática com esferas sutis superiores e mentores cósmicos." },
        { name: "Ambientes Organizados e Limpos", desc: "Reduzem drasticamente a ansiedade visual de Aquário, liberando fluxo pragmático." }
      ],
      activities: [
        { name: "Meditação com Registro Escrito", desc: "Escrever logo cedo no diário ajuda o cérebro a não saturar de planos e ideias." },
        { name: "Alongamentos de Coluna e Respiração", desc: "Desbloqueia os meridianos de energia física e flui oxigênio celular para o cérebro." },
        { name: "Estudos de Astrologia Metafísica", desc: "Conecta seus interesses intelectuais com a bússola universal das estrelas." },
        { name: "Organização Física de Arquivos", desc: "Materializa a ordem mental organizando sua mesa, gavetas e pastas digitais." }
      ],
      challenges: [
        { name: "Dispersão e Excesso de Projetos Inacabados", desc: "Cuidado para não rascunhar 15 rascunhos de negócios e não consolidar nenhum." },
        { name: "Isolamento Emocional por Orgulho Sutil", desc: "Vencer a tentação de se afastar silenciosamente quando atritos afetivos surgirem." },
        { name: "Falta de Consistência Prática Diária", desc: "Evitar depender apenas de picos de inspiração; o Caminho exige disciplina constante." },
        { name: "Saturação Cognitiva por Telas Virtuais", desc: "A ansiedade de absorver notícias e informações sem tempo para descanso celular." }
      ],
      opps: [
        { name: "Negócios Inteligentes & Mentoria", desc: "Sua matriz original brilha ao gerar novos métodos de ensino ou infoprodutos digitais." },
        { name: "Parcerias Simétricas com Velhos Amigos", desc: "Sintonizar propósitos com pessoas que partilham de sua ética e visão humanitária." },
        { name: "Automação de Rotinas de Trabalho", desc: "Implementar sistemas e ferramentas para reduzir o tempo gasto em burocracias mecânicas." },
        { name: "Consolidação de Investimentos Seguros", desc: "Oportunidade ideal para reorganizar aportes e focar em carteiras com rendimento consistente." }
      ],
      energies: [
        { name: "Ar Ativo / Ideais Coletivos", desc: "Força mental e originalidade vibrando na casa das grandes descobertas e alinhamentos." },
        { name: "Fogo de Impulso Pragmático", desc: "Vontade firme e entusiasmo solar para colocar de pé ideias antes estagnadas no rascunho." },
        { name: "Terra de Estruturação Sólida", desc: "Capacidade de dar raízes firmes e durabilidade a seus acordos, parcerias e finanças." },
        { name: "Água de Intuição Magnética", desc: "Ressonância fluida que facilita a leitura de intenções alheias e a atração de caminhos." }
      ],
      evitars: [
        { name: "Assinar contratos ou compras por puro impulso", desc: "Aguarde transitar a lunação antes de fazer investimentos robustos." },
        { name: "Debates calorosos nas redes virtuais", desc: "Não troque sua paz áurica e valioso foco diário por conflitos estéreis de opiniões." },
        { name: "Sumiços repentinos e distanciamento frio", desc: "Dialogar com clareza evita que pequenas dúvidas se transformem em barreiras afetivas." },
        { name: "Ignorar o biorritmo e acumular exaustão", desc: "Pequenas pausas de 3 minutos trarão o alinhamento celular que você necessita hoje." }
      ],
      foci: [
        { name: "Estudos e Consolidamento Financeiro", desc: "Direcione sua ressonância celular para organizar sua carteira e expandir seus conhecimentos." },
        { name: "Saúde Vital e Fortalecimento Corporal", desc: "Focar em melhorar a imunidade através de alimentação pura, repouso e exercícios regulares." },
        { name: "Harmonização do Lar e Conforto Íntimo", desc: "Purificar a energia dos ambientes da casa para gerar um refúgio seguro de paz e recarga." },
        { name: "Comunicação Clara e Parcerias Comerciais", desc: "Fazer pontes, contatos profissionais sinceros e apresentar propostas comerciais sintonizadas." }
      ],
      phrases: [
        "Eu canalizo a originalidade libertadora do Ar e a estrutura firme de Saturno para manifestar a abundância de forma sutil.",
        "Minha intuição é bússola soberana; eu dou passos firmes na matéria para materializar a paz e a abundância hoje.",
        "Eu desfaço os muros da mente, acolho minha vulnerabilidade com coragem e sintonizo o fluxo da verdadeira prosperidade.",
        "Com disciplina diária e fé nos planos universais, dou forma aos meus ideais e sinto a proteção ativa em meu caminhar."
      ]
    },
    en: {
      aromas: [
        { name: "Concentrated Rosemary", desc: "Purifies intellectual pathways and stimulates quick, logical decisions in your routine." },
        { name: "Refreshing Lemongrass", desc: "Dissolves restlessness and tunes the higher mind with peaceful vibrations." },
        { name: "Subtle French Lavender", desc: "Calms the heart chakra and regenerates deep sleep pathways in the bedroom." },
        { name: "Woody Sandalwood", desc: "Grounds ideas, linking spiritual goals with practical material structure." }
      ],
      incenses: [
        { name: "Sandalwood or Rosemary", desc: "Excellent for banishing digital screen strain and accumulated mental fatigue." },
        { name: "Myrrh or White Frankincense", desc: "Seals the environment coordinate from external intrusions or dense energies." },
        { name: "Natural Palo Santo", desc: "Attracts the flow of prosperity and cleanses psychic dust from business Tuesdays." },
        { name: "Camphor or Mint", desc: "Renews cellular air and activates clarity and focus during critical meetings." }
      ],
      plants: [
        { name: "Sacred Peace Lily", desc: "Purifies the auric channels of domestic air and brings emotional serenity." },
        { name: "Sword of Saint George", desc: "Creates an impenetrable shield against distractions and envies on your work desk." },
        { name: "Fortuna Zamioculca", desc: "Anchors the magnetism of money and prosperity in the Earth element." },
        { name: "Protective Basil", desc: "Radiates vitality and heals molecular fatigue channels in the kitchen or living room." }
      ],
      rooms: [
        { name: "East Corner (Sunrise)", desc: "Space of high pranic reception. Ideal for stretching, active meditation, and morning clarity." },
        { name: "North Corner of the living room", desc: "Anchoring of the Earth element for stabilizing family conversations and warmth." },
        { name: "Proximity to well-ventilated windows", desc: "Direct flow of the Air element dissipating mental stagnation and inspiring new ideas." },
        { name: "Geometric center of the home", desc: "Focal point of balance for the 4 elements, harmonizing the home's biomagnetic field." }
      ],
      bedroomColors: [
        { name: "Lavender Blue", desc: "Calms the central nervous system, harmonizing deep sleep and awakening lucid memories." },
        { name: "Subtle Lilac", desc: "Elevates the bedroom's transmuting vibration, purifying accumulated emotional residue." },
        { name: "Light Mint Green", desc: "Regenerates cellular vitality during night rest and slows down the heart rate." },
        { name: "Soft Cosmic Gray", desc: "Provides psychic neutrality, ideal for filtering external interferences during rest." }
      ],
      officeColors: [
        { name: "Royal Indigo Blue", desc: "Activates higher intellectual centers, elevating mental clarity, focus, and professional concentration." },
        { name: "Emerald Green", desc: "Anchors the frequency of prosperity and stability in financial decision making." },
        { name: "Pure Graphite Gray", desc: "Favors linear discipline, minimizing distractions and organizing complex routines." },
        { name: "Light Amber", desc: "Radiates solar enthusiasm and creative dynamism for negotiations and innovative projects." }
      ],
      crystals: [
        { name: "White Selenite of Purification", desc: "Place at the main entrance or near screens to create a continuous portal of auric cleansing." },
        { name: "Black Tourmaline of Protection", desc: "Keep in house corners to repel heavy energy and neutralize electromagnetic radiation." },
        { name: "Rose Quartz of Unconditional Love", desc: "Place on the central table or bedroom to soften relational tension and radiate harmony." },
        { name: "Golden Pyrite of Abundance", desc: "Keep in the office or workspace to magnetize opportunities for prosperity and wealth." }
      ],
      rituals: [
        { title: "Sacred Smoke Cleansing", desc: "Light a Palo Santo or Rosemary incense stick and walk clockwise around house corners." },
        { title: "Air Renewal & Lighting", desc: "Open all windows for 15 minutes at dawn to replace stale air with natural sunlight." },
        { title: "Entrance Flow Organization", desc: "Clear the front door area and remove broken objects to allow the free circulation of chi." },
        { title: "Water Element Harmonization", desc: "Mist water mixed with lavender essential oil on curtains to soften the room environment." }
      ],
      directions: [
        { name: "East Direction", desc: "Alignment with the Fire element and sunrise to propel new beginnings and vigor." },
        { name: "North Direction", desc: "Tuning with the Earth element to strengthen material stability and home security." },
        { name: "West Direction", desc: "Connection with the Water element to promote affective warmth and peace in relationships." },
        { name: "South Direction", desc: "Inspired by the Air element to expand communication, creativity, and future vision." }
      ],
      frequencies: [
        { name: "528 Hz Frequency (Miracles)", desc: "Play softly in the background to harmonize space atoms and promote cellular healing." },
        { name: "432 Hz Frequency (Natural Tuning)", desc: "Play during rest moments to align the home with Earth's harmonic resonance." },
        { name: "639 Hz Frequency (Relationships)", desc: "Ideal for the living room to dissolve friction and foster empathy in daily living." },
        { name: "741 Hz Frequency (Intuition & Cleansing)", desc: "Use during cleaning and organizing to eliminate psychic toxins from the home." }
      ],
      skills: [
        { name: "Compassionate Intelligence & Grounding", desc: "Learning to channel abstract ideas into immediate practical steps of manifestation." },
        { name: "Uncomplicated Singular Focus", desc: "The ability to isolate yourself from virtual distractions and finish a single robust task." },
        { name: "Active Affective Listening", desc: "Listening to others with a heart free of mechanical answers or logical syllogisms." },
        { name: "Practical Karmic Discernment", desc: "Recognizing cyclic patterns of fatigue and cutting redundant expenses or habits." }
      ],
      blocks: [
        { name: "Fear of others' judgment", desc: "Generates cold pride or distance that prevents true intimacy." },
        { name: "Compulsion to plan without acting", desc: "Accumulating dozens of drafts without taking the first practical step out of fear of error." },
        { name: "Rationalization of affects", desc: "Trying to debate pure feelings with cold logic and rigid rules." },
        { name: "Waste of cellular energy", desc: "Spending hours defending ideals or debating on virtual social networks out of impulsivity." }
      ],
      virtues: ["Presence", "Structure", "Patience", "Humility", "Vulnerability", "Courage", "Silence"],
      lessons: [
        "Real abundance and sincere connections do not flourish through mathematical intelligence, but when we accept embracing our vulnerability.",
        "True wisdom lies in silencing plans and letting sintonized works speak for themselves in matter.",
        "No lucky astral transit compensates for a lack of daily discipline. Your Life Path requires firm consistency.",
        "Forgiving old misunderstandings from the past is the only real shortcut to unlocking the flow of finance today."
      ],
      exercises: [
        "Take 10 minutes away from any screen, breathe deeply through your nose, and visualize a golden light clearing your brain.",
        "Write three simple goals on paper with black ink and execute the first one without postponing due to over-analysis.",
        "Take a 15-minute walk barefoot on the grass or feel the morning sun on your face to align your vital biorhythm.",
        "Send a short, sincere message of gratitude to someone from your history who rarely hears from you."
      ],
      advices: [
        "Give quick release to your practical insights today. Accumulating plans without acting saturates your subtle field.",
        "Maintain strategic silence about your business plans in this lunation. Avoid advice from skeptical third parties.",
        "Your astral matrix today favors focusing on health and molecular purification. Reduce dense food intake.",
        "The day calls for the harmonization of old emotional issues. A simple gesture of affection will disarm old walls."
      ],
      alerts: [
        "Beware of financial leakages from emotional compensation. Lunar transit propitious to impulsive spending today.",
        "Avoid heated debates in social networks or chat channels. Do not waste your precious vital energy on others' opinions.",
        "Pay attention to muscle pain from poor physical posture in front of the computer. Take frequent breaks every 50 minutes.",
        "Avoid signing long-term contracts hastily. Read all the small print and consult experienced mentors."
      ],
      opportunities: [
        "Conversas with sintonized old friendships open unexpected channels for new businesses or cooperative projects.",
        "An original insight will arise during moments of silence and rest. Write it down immediately in your physical notebook.",
        "The current transit opens gateways to renegotiate pending items or subscriptions and stop capital leaks.",
        "New learnings in subtle studies or intelligence will bring unusual clarity to career decisions."
      ],
      protectWords: [
        { word: "GROUND YOURSELF", desc: "Repeat mentally when waking up to banish distractions and cognitive dispersions." },
        { word: "FLOW IN PEACE", desc: "Remember to breathe deeply when encountering mechanical friction or delays in the routine." },
        { word: "FIRM STRUCTURE", desc: "Mentalize to anchor your purposes in matter with determination and persistence." },
        { word: "INNER CLARITY", desc: "Use to banish mental mists or subtle doubts generated by others' opinions." }
      ],
      keywords: [
        { word: "SUBTLE EXPANSION", desc: "Grow in a diplomatic way respecting the silent channels of your own being." },
        { word: "STRUCTURING", desc: "Organize the physical foundations before launching new projects towards the skies." },
        { word: "ALIGNMENT", desc: "Sintonize your routine actions with the dominant planetary transit of today." },
        { word: "MANIFESTATION", desc: "Bring metaphysical insights to matter through small, consistent tasks." }
      ],
      symbols: [
        { name: "Sacred Heptagram (⭐️)", desc: "Represents the seven paths of protection that seal your auric energy field." },
        { name: "Ankh (Key of Life)", desc: "Symbolizes the union of celestial and terrestrial forces regulating your physical vitality." },
        { name: "Eye of Horus (𓂀)", desc: "Brings sharp perception and protection against intellectual deviations or mists." },
        { name: "Cosmic Golden Spiral", desc: "Signals continuous growth, harmonious and focused on millennial evolution." }
      ],
      amulets: [
        { name: "Lapis Lazuli Scarab", desc: "Acts on physical protection, facilitating transactions and banishing accumulated fatigue." },
        { name: "Pyrite Gold Cube", desc: "Radiates the solar frequency of wealth, merit, and materializing focus." },
        { name: "Rough Rose Quartz", desc: "Filters feelings of cardiac tension and opens channels of comprehensive dialogue at home." },
        { name: "Focus Sodalite", desc: "Structures brain pathways for technical absorption of complex teachings." }
      ],
      environments: [
        { name: "Libraries or Lake Gardens", desc: "Foster silent absorption of knowledge and cardiac deceleration." },
        { name: "Spaces with Direct Sunlight", desc: "Recharge the solar plexus and increase molecular mood for new beginnings." },
        { name: "Silent Corners of Temples", desc: "Facilitate telepathic connection with higher subtle spheres and cosmic mentors." },
        { name: "Organized and Clean Environments", desc: "Drastically reduce visual anxiety, freeing up pragmatic workflow." }
      ],
      activities: [
        { name: "Meditation with Written Log", desc: "Writing early in the diary helps the brain not to saturate with plans and ideas." },
        { name: "Spinal Stretches & Breathing", desc: "Unblocks physical energy meridians and flows cellular oxygen to the brain." },
        { name: "Metaphysical Astrology Studies", desc: "Connects your intellectual interests with the universal compass of the stars." },
        { name: "Physical File Organization", desc: "Materializes mental order by organizing your desk, drawers, and digital folders." }
      ],
      challenges: [
        { name: "Dispersion and Excess of Unfinished Projects", desc: "Be careful not to draft 15 business drafts and consolidate none." },
        { name: "Emotional Isolation from Subtle Pride", desc: "Overcoming the temptation to pull away silently when affective friction arises." },
        { name: "Lack of Daily Practical Consistency", desc: "Avoid depending only on peaks of inspiration; the Path requires constant discipline." },
        { name: "Cognitive Saturation from Virtual Screens", desc: "The anxiety of absorbing news and information without time for cellular rest." }
      ],
      opps: [
        { name: "Intelligent Business & Mentoring", desc: "Your original matrix shines when generating new teaching methods or digital products." },
        { name: "Symmetrical Partnerships with Old Friends", desc: "Sintonizing purposes with people who share your ethics and humanitarian vision." },
        { name: "Work Routine Automation", desc: "Implementing systems and tools to reduce time spent on mechanical bureaucracies." },
        { name: "Consolidation of Secure Investments", desc: "Ideal opportunity to reorganize contributions and focus on portfolios with consistent yield." }
      ],
      energies: [
        { name: "Active Air / Collective Ideals", desc: "Mental strength and originality vibrating in the house of great discoveries and alignments." },
        { name: "Fire of Pragmatic Impulse", desc: "Firm will and solar enthusiasm to put on feet ideas previously stagnant in the draft." },
        { name: "Earth of Solid Structuring", desc: "Ability to give firm roots and durability to your agreements, partnerships, and finances." },
        { name: "Water of Magnetic Intuition", desc: "Fluid resonance that facilitates reading others' intentions and attracting paths." }
      ],
      evitars: [
        { name: "Signing contracts or shopping out of pure impulse", desc: "Wait for the lunation to pass before making robust investments." },
        { name: "Heated debates on virtual networks", desc: "Do not trade your auric peace and valuable daily focus for sterile opinion conflicts." },
        { name: "Sudden disappearances and cold distance", desc: "Dialogue with clarity prevents small doubts from turning into affective barriers." },
        { name: "Ignoring your biorhythm and accumulating fatigue", desc: "Small 3-minute pauses will bring the cellular alignment you need today." }
      ],
      foci: [
        { name: "Studies and Financial Consolidation", desc: "Direct your cellular resonance to organize your portfolio and expand your knowledge." },
        { name: "Vital Health & Body Strengthening", desc: "Focus on improving immunity through pure nutrition, rest, and regular exercise." },
        { name: "Home Harmonization & Intimate Comfort", desc: "Purify room energies to generate a secure refuge of peace and recharging." },
        { name: "Clear Communication & Business Partnerships", desc: "Make bridges, sincere professional contacts, and present sintonized business proposals." }
      ],
      phrases: [
        "I channel the liberating originality of Air and the firm structure of Saturn to manifest abundance in a subtle way.",
        "My intuition is a sovereign compass; I take firm steps in matter to materialize peace and abundance today.",
        "I undo the walls of the mind, embrace my vulnerability with courage, and sintonize the flow of true prosperity.",
        "With daily discipline and faith in universal plans, I give shape to my ideals and feel active protection in my walk."
      ]
    },
    es: {
      aromas: [
        { name: "Romero Concentrado", desc: "Purifica los canales intelectuales y estimula las decisiones rápidas y lógicas en la rutina." },
        { name: "Limoncillo Refrescante", desc: "Disuelve las agitaciones y sintoniza la mente superior con vibraciones de paz." },
        { name: "Lavanda Francesa Sutil", desc: "Calma el chakra del corazón y regenera los canales de sueño profundo en el dormitorio." },
        { name: "Sándalo Amaderado", desc: "Aterriza los ideales, uniendo las metas espirituales con la estructura material práctica." }
      ],
      incenses: [
        { name: "Sándalo o Romero", desc: "Excelente para desterrar el cansancio de las pantallas digitales y la fatiga mental acumulada." },
        { name: "Mirra o Incienso Blanco", desc: "Sella las coordenadas del entorno frente a intrusiones o energías densas externas." },
        { name: "Palo Santo Natural", desc: "Atrae el flujo de prosperidad y limpia el polvo psíquico de los martes de negocios." },
        { name: "Alcanfor o Menta", desc: "Renueva el aire celular y activa la claridad y el enfoque durante las reuniones críticas." }
      ],
      plants: [
        { name: "Lirio de la Paz Sagrado", desc: "Purifica los canales áuricos del aire doméstico y trae serenidad emocional." },
        { name: "Espada de San Jorge", desc: "Crea un escudo impenetrable contra distracciones y envidias en el escritorio de trabajo." },
        { name: "Zamioculca de la Fortuna", desc: "Ancla el magnetismo del dinero y la prosperidad en el elemento Tierra." },
        { name: "Albahaca Protectora", desc: "Irradia vitalidad y sana los canales de fatiga molecular en la cocina o sala." }
      ],
      rooms: [
        { name: "Rincón Este (Amanecer)", desc: "Espacio de alta recepción pránica. Ideal para estiramientos, meditación activa y claridad matutina." },
        { name: "Rincón Norte de la sala de estar", desc: "Anclaje del elemento Tierra para estabilizar conversaciones familiares y acogimiento." },
        { name: "Proximidad de ventanas bien ventiladas", desc: "Flujo directo del elemento Aire que disipa la estancación mental e inspira nuevas ideas." },
        { name: "Centro geométrico de la casa", desc: "Punto focal de equilibrio de los 4 elementos, armonizando el campo biomagnético de la casa." }
      ],
      bedroomColors: [
        { name: "Azul Lavanda", desc: "Calma el sistema nervioso central, armonizando el sueño profundo y despertando memorias lúcidas." },
        { name: "Lila Sutil", desc: "Eleva la vibración transmutadora del dormitorio, purificando residuos emocionales acumulados." },
        { name: "Verde Menta Claro", desc: "Regenera la vitalidad celular durante el descanso nocturno y desacelera el ritmo cardíaco." },
        { name: "Gris Cósmico Suave", desc: "Proporciona neutralidad psíquica, ideal para filtrar interferencias externas en el descanso." }
      ],
      officeColors: [
        { name: "Azul Índigo Real", desc: "Activa los centros intelectuales superiores, elevando la claridad mental, enfoque y concentración profesional." },
        { name: "Verde Esmeralda", desc: "Ancla la frecuencia de prosperidad y estabilidad en la toma de decisiones financieras." },
        { name: "Gris Grafito Puro", desc: "Favorece la disciplina linear, minimizando distracciones y organizando rutinas complejas." },
        { name: "Ámbar Claro", desc: "Irradia entusiasmo solar y dinamismo creativo para negociaciones y proyectos innovadores." }
      ],
      crystals: [
        { name: "Selenita Blanca de Purificación", desc: "Colócala en la entrada principal o cerca de pantallas para crear un portal continuo de limpieza áurica." },
        { name: "Turmalina Negra de Protección", desc: "Mantén en las esquinas de la casa para repeler cargas pesadas y neutralizar radiaciones electromagnéticas." },
        { name: "Cuarzo Rosa de Amor Incondicional", desc: "Colócalo en la mesa central o dormitorio para suavizar tensiones relacionales e irradiar armonía." },
        { name: "Pirita Dorada de la Abundancia", desc: "Déjala en la oficina o espacio de trabajo para magnetizar oportunidades de prosperidad y riqueza." }
      ],
      rituals: [
        { title: "Limpieza de Humo Sagrado", desc: "Enciende un bastón de Palo Santo o Incienso de Romero y recorre las esquinas de la casa en sentido horario." },
        { title: "Renovación del Aire e Iluminación", desc: "Abre todas las ventanas por 15 minutos al amanecer para reemplazar el aire estancado por luz solar." },
        { title: "Organización del Flujo de Entrada", desc: "Despeja el área de la puerta de entrada y remueve objetos rotos para permitir la libre circulación de chi." },
        { title: "Armonización con Elemento Agua", desc: "Rocía agua con gotas de aceite esencial de lavanda en las cortinas para suavizar el ambiente." }
      ],
      directions: [
        { name: "Dirección Este", desc: "Alineación con el elemento Fuego y el amanecer para impulsar nuevos comienzos y vigor." },
        { name: "Dirección Norte", desc: "Sintonía con el elemento Tierra para fortalecer la estabilidad material y la seguridad del hogar." },
        { name: "Dirección Oeste", desc: "Conexión con el elemento Agua para promover el acogimiento afectivo y la paz en relaciones." },
        { name: "Dirección Sur", desc: "Inspirado por el elemento Aire para expandir la comunicación, creatividad y visión de futuro." }
      ],
      frequencies: [
        { name: "Frecuencia de 528 Hz (Milagros)", desc: "Sintoniza de fondo en el ambiente para armonizar los átomos del espacio y promover la curación celular." },
        { name: "Frecuencia de 432 Hz (Sintonía Natural)", desc: "Suena durante momentos de descanso para alinear el hogar con la resonancia armónica de la Tierra." },
        { name: "Frecuencia de 639 Hz (Relaciones)", desc: "Ideal para la sala de estar para disolver roces y promover empatía en la convivencia diaria." },
        { name: "Frecuencia de 741 Hz (Intuición y Limpieza)", desc: "Utilízala durante limpiezas para eliminar toxinas psíquicas del hogar." }
      ],
      skills: [
        { name: "Inteligencia Compasiva y Aterrizaje", desc: "Aprender a canalizar ideas abstractas en pasos prácticos inmediatos de manifestación." },
        { name: "Enfoque Singular Sencillo", desc: "La capacidad de aislarse de distracciones virtuales y terminar una sola tarea robusta." },
        { name: "Escucha Activa Afectiva", desc: "Escuchar a los demás con un corazón libre de respuestas mecánicas o silogismos lógicos." },
        { name: "Discernimiento Kármico Práctico", desc: "Reconocer patrones cíclicos de fatiga y cortar gastos o hábitos redundantes." }
      ],
      blocks: [
        { name: "Miedo al juicio de los demás", desc: "Genera distancias u orgullos fríos que impiden la verdadera intimidad." },
        { name: "Compulsión de planificar sin actuar", desc: "Acumular decenas de borradores sin dar el primer paso práctico por miedo al error." },
        { name: "Racionalización de los afectos", desc: "Intentar debatir sentimientos puros con lógica fría y reglas rígidas." },
        { name: "Desperdicio de energía celular", desc: "Pasar horas defendiendo ideales o debatiendo en redes sociales por impulsividad." }
      ],
      virtues: ["Presencia", "Estructura", "Paciencia", "Humildad", "Vulnerabilidad", "Coraje", "Silencio"],
      lessons: [
        "La abundancia real y las conexiones sinceras no florecen por inteligencia matemática, sino cuando aceptamos abrazar nuestra vulnerabilidad.",
        "La verdadera sabiduría reside en silenciar los planes y dejar que las obras sintonizadas hablen por sí mismas en la materia.",
        "Ningún tránsito astral de suerte compensa la falta de disciplina diaria. Tu Camino exige una consistencia firme.",
        "Perdonar viejos malentendidos del pasado es el único atajo real para desbloquear el flujo de las finanzas hoy."
      ],
      exercises: [
        "Tómate 10 minutos lejos de cualquier pantalla, respira profundamente por la nariz y visualiza una luz dorada limpiando tu cerebro.",
        "Escribe tres metas simples en un papel con tinta negra y ejecuta la primera de ellas sin posponer por exceso de análisis.",
        "Camina 15 minutos descalzo sobre el césped o siente el sol de la mañana en tu rostro para alinear tu biorritmo vital.",
        "Envía un mensaje corto y sincero de gratitud a alguien de tu historia con quien rara vez hables."
      ],
      advices: [
        "Da una salida rápida a tus ideas prácticas hoy. Acumular planes sin actuar satura tu campo sutil.",
        "Mantén un silencio estratégico sobre tus planes de negocios en esta lunación. Evita consejos de terceros escépticos.",
        "Tu matriz astral hoy favorece el enfoque en la salud y la purificación molecular. Reduce alimentos pesados.",
        "El día pide la armonización de antiguos temas afectivos. Un simple gesto de cariño desarmará viejos muros."
      ],
      alerts: [
        "Cuidado con las fugas financieras por compensación afectiva. Tránsito lunar propicio a gastos de impulso hoy.",
        "Evita debates acalorados en redes sociales o canales de chat. No desgastes tu preciosa energía con opiniones ajenas.",
        "Atención a dolores musculares por mala postura física frente al ordenador. Haz pausas cada 50 minutos.",
        "Evita firmar contratos a largo plazo de forma apresurada. Lee toda la letra pequeña y consulta a mentores."
      ],
      opportunities: [
        "Las conversaciones con viejas amistades sintonizadas abren canales inesperados para nuevos negocios o proyectos cooperativos.",
        "Un insight original surgirá durante momentos de silencio y descanso. Anótalo de inmediato en tu cuaderno físico.",
        "El tránsito actual abre portales para renegociar temas pendientes o suscripciones y detener fugas de capital.",
        "Nuevos aprendizajes en estudios sutiles o de inteligencia traerán una claridad inusual a las decisiones de carrera."
      ],
      protectWords: [
        { word: "ATERRIZA", desc: "Repítelo mentalmente al despertar para desterrar distracciones y dispersiones cognitivas." },
        { word: "FLUYE EN PAZ", desc: "Recuerda respirar profundamente al encontrar fricciones mecánicas o retrasos en la rutina." },
        { word: "ESTRUCTURA FIRME", desc: "Mentaliza para anclar tus propósitos en la materia con determinación y persistencia." },
        { word: "CLARIDAD INTERIOR", desc: "Úsalo para desterrar nieblas mentales o dudas sutiles generadas por opiniones ajenas." }
      ],
      keywords: [
        { word: "EXPANSION SUTIL", desc: "Crece de forma diplomática respetando los canales de silencio de tu propio ser." },
        { word: "ESTRUCTURACION", desc: "Organiza las bases físicas antes de lanzar nuevos proyectos hacia el cielo." },
        { word: "ALINEACION", desc: "Sintoniza tus acciones rutinarias con el tránsito planetario dominante de hoy." },
        { word: "MANIFESTACION", desc: "Trae las ideas metafísicas a la materia a través de pequeñas tareas consistentes." }
      ],
      symbols: [
        { name: "Heptagrama Sagrado (⭐️)", desc: "Representa los siete caminos de protección que sellan tu campo energético áurico." },
        { name: "Ankh (Clave de la Vida)", desc: "Simboliza la unión de fuerzas celestes y terrestres regulando tu vitalidad física." },
        { name: "Ojo de Horus (𓂀)", desc: "Trae percepción aguda y protección contra desviaciones o nieblas intelectuales." },
        { name: "Espiral Áurea Cósmica", desc: "Señala un crecimiento continuo, armónico y enfocado en la evolución milenaria." }
      ],
      amulets: [
        { name: "Escarabajo de Lapis-Lázuli", desc: "Actúa en la protección física, facilitando transacciones y desterrando la fatiga acumulada." },
        { name: "Pirita Cubo de Oro", desc: "Irradia la frecuencia solar de riqueza, merecimiento y enfoque realizador material." },
        { name: "Cuarzo Rosa Bruto", desc: "Filtra tensiones cardíacas y abre canales de diálogo comprensivo en casa." },
        { name: "Sodalita de Enfoque", desc: "Estructura las vías cerebrales para la absorción técnica de enseñanzas complejas." }
      ],
      environments: [
        { name: "Bibliotecas o Jardines con Lago", desc: "Fomentan la absorción silenciosa de conocimiento y la desaceleración cardíaca." },
        { name: "Espacios con Luz Solar Directa", desc: "Recargan el plexo solar y aumentan el ánimo molecular para nuevos comienzos." },
        { name: "Rincones Silenciosos de Templos", desc: "Facilitan la conexión telepática con esferas sutiles superiores y mentores." },
        { name: "Ambientes Organizados y Limpios", desc: "Reducen drásticamente la ansiedad visual, liberando un flujo de trabajo pragmático." }
      ],
      activities: [
        { name: "Meditación con Registro Escrito", desc: "Escribir temprano en el diario ayuda al cerebro a no saturarse de planes e ideas." },
        { name: "Estiramientos de Columna & Respiración", desc: "Desbloquea los meridianos de energía física y fluye oxígeno celular al cerebro." },
        { name: "Estudios de Astrología Metafísica", desc: "Conecta tus intereses intelectuales con la brújula universal de las estrellas." },
        { name: "Organización Física de Archivos", desc: "Materializa el orden mental organizando tu mesa, cajones y carpetas digitales." }
      ],
      challenges: [
        { name: "Dispersión y Exceso de Proyectos Inacabados", desc: "Cuidado con redactar 15 borradores de negocios y no consolidar ninguno." },
        { name: "Aislamiento Emocional por Orgullo Sutil", desc: "Vencer la tentación de alejarse silenciosamente cuando surgen roces afectivos." },
        { name: "Falta de Consistencia Práctica Diaria", desc: "Evitar depender solo de picos de inspiración; el Camino exige disciplina constante." },
        { name: "Saturación Cognitiva por Pantallas Virtuales", desc: "La ansiedad de absorber noticias e información sin tiempo para el descanso celular." }
      ],
      opps: [
        { name: "Negocios Inteligentes & Mentoría", desc: "Tu matriz original brilla al generar nuevos métodos de enseñanza o infoproductos." },
        { name: "Alianzas Simétricas con Viejos Amigos", desc: "Sintonizar propósitos con personas que comparten tu ética y visión humanitaria." },
        { name: "Automatización de Rutinas de Trabajo", desc: "Implementar sistemas y herramientas para reducir el tiempo en tareas mecánicas." },
        { name: "Consolidación de Inversiones Seguras", desc: "Oportunidad ideal para reorganizar aportes y enfocarse en carteras de rendimiento consistente." }
      ],
      energies: [
        { name: "Aire Activo / Ideales Colectivos", desc: "Fuerza mental y originalidad vibrando en la casa de grandes descubrimientos y alineaciones." },
        { name: "Fuego de Impulso Pragmático", desc: "Voluntad firme y entusiasmo solar para poner de pie ideas antes estancadas." },
        { name: "Tierra de Estructuración Sólida", desc: "Capacidad de dar raíces firmes y durabilidad a tus acuerdos, sociedades y finanzas." },
        { name: "Agua de Intuición Magnética", desc: "Resonancia fluida que facilita leer intenciones ajenas y atraer caminos favorables." }
      ],
      evitars: [
        { name: "Firmar contratos o comprar por puro impulso", desc: "Aguarda a que pase la lunación antes de realizar inversiones importantes." },
        { name: "Debates acalorados en redes virtuales", desc: "No cambies tu paz áurica y valioso enfoque diario por conflictos estériles de opiniones." },
        { name: "Desapariciones repentinas y distanciamiento frío", desc: "Dialogar con claridad evita que pequeñas dudas se conviertan en barreras afectivas." },
        { name: "Ignorar el biorritmo y acumular fatiga", desc: "Pequeñas pausas de 3 minutos traerán el alinhamento celular que necesitas hoy." }
      ],
      foci: [
        { name: "Estudios y Consolidación Financiera", desc: "Direcciona tu resonancia celular para organizar tu cartera y expandir conocimientos." },
        { name: "Salud Vital y Fortalecimiento Corporal", desc: "Enfocarse en mejorar la inmunidad mediante nutrición pura, descanso y ejercicio." },
        { name: "Armonización del Hogar & Confort Íntimo", desc: "Purificar la energía de las habitaciones para generar un refugio seguro de recarga." },
        { name: "Comunicación Clara & Alianzas Comerciales", desc: "Crear puentes, contactos sinceros y presentar propuestas comerciales sintonizadas." }
      ],
      phrases: [
        "Canalizo la originalidad liberadora del Aire y la estructura firme de Saturno para manifestar la abundancia de forma sutil.",
        "Mi intuición es mi brújula soberana; doy pasos firmes en la materia para materializar la paz y la abundancia hoy.",
        "Deshago los muros de la mente, acojo mi vulnerabilidad con valentía y sintonizo el flujo de la verdadera prosperidad.",
        "Con disciplina diaria y fe en los planes universales, doy forma a mis ideales y siento protección activa en mi caminar."
      ]
    },
    de: {
      aromas: [
        { name: "Konzentrierter Rosmarin", desc: "Reinigt die intellektuellen Kanäle und fördert schnelle, logische Entscheidungen im Alltag." },
        { name: "Erfrischendes Zitronengras", desc: "Löst Unruhe auf und stimmt den höheren Geist auf Schwingungen des Friedens ein." },
        { name: "Feiner französischer Lavendel", desc: "Beruhigt das Herzchakra und regeneriert die Wege für tiefen Schlaf im Schlafzimmer." },
        { name: "Holziges Sandelholz", desc: "Erdet Ideale und verbindet spirituelle Ziele mit praktischer materieller Struktur." }
      ],
      incenses: [
        { name: "Sandelholz oder Rosmarin", desc: "Hervorragend geeignet, um die Erschöpfung durch digitale Bildschirme und mentale Müdigkeit zu vertreiben." },
        { name: "Myrrhe oder Weihrauch", desc: "Versiegelt die Raumkoordinaten vor äußeren Störungen oder dichten Fremdenergien." },
        { name: "Natürliches Palo Santo", desc: "Zieht den Fluss des Wohlstands an und reinigt den feinstofflichen Staub von geschäftlichen Dienstagen." },
        { name: "Kampfer oder Minze", desc: "Erneuert die zelluläre Luft und aktiviert Klarheit und Fokus während kritischer Besprechungen." }
      ],
      plants: [
        { name: "Heilige Friedenslilie", desc: "Reinigt die aurischen Kanäle der Raumluft und schenkt emotionale Gelassenheit." },
        { name: "Bogenhanf der Abwehr", desc: "Schafft einen undurchdringlichen Schutzschild gegen Ablenkungen auf dem Schreibtisch." },
        { name: "Glücksfeder (Zamioculca)", desc: "Verankert die Magnetkraft von Geld und Fülle fest im Element Erde." },
        { name: "Schützendes Basilikum", desc: "Strahlt Vitalität aus und heilt molekulare Erschöpfungskanäle in Küche oder Wohnzimmer." }
      ],
      rooms: [
        { name: "Ost-Ecke (Sonnenaufgang)", desc: "Raum hoher pranischer Aufnahme. Ideal für Dehnübungen, aktive Meditation und morgendliche Klarheit." },
        { name: "Nord-Ecke des Wohnzimmers", desc: "Verankerung des Erdelements zur Stabilisierung von Familiengesprächen und Geborgenheit." },
        { name: "Nähe von gut belüfteten Fenstern", desc: "Direkter Fluss des Luftelements, der mentale Stagnation auflöst und neue Ideen anregt." },
        { name: "Geometrisches Zentrum des Hauses", desc: "Fokuspunkt des Gleichgewichts der 4 Elemente, der das biomagnetische Feld des Hauses harmonisiert." }
      ],
      bedroomColors: [
        { name: "Lavendelblau", desc: "Beruhigt das zentrale Nervensystem, harmonisiert tiefen Schlaf und weckt luzide Erinnerungen." },
        { name: "Zartes Lila", desc: "Erhöht die umwandelnde Schwingung des Schlafzimmers und reinigt angesammelte emotionale Rückstände." },
        { name: "Helles Minzgrün", desc: "Regeneriert die zelluläre Vitalität während der Nachtruhe und verlangsamt die Herzfrequenz." },
        { name: "Weiches Kosmisches Grau", desc: "Bietet psychische Neutralität, ideal zum Filtern äußerer Störungen in der Ruhephase." }
      ],
      officeColors: [
        { name: "Königliches Indigoblau", desc: "Aktiviert höhere intellektuelle Zentren und steigert mentale Klarheit, Fokus und berufliche Konzentration." },
        { name: "Smaragdgrün", desc: "Verankert die Frequenz von Wohlstand und Stabilität bei finanziellen Entscheidungen." },
        { name: "Reines Graphitgrau", desc: "Fördert lineare Disziplin, minimiert Ablenkungen und organisiert komplexe Routinen." },
        { name: "Helles Bernstein", desc: "Strahlt solaren Enthusiasmus und kreative Dynamik für Verhandlungen und innovative Projekte aus." }
      ],
      crystals: [
        { name: "Weißer Selenit der Reinigung", desc: "Plazieren Sie ihn am Haupteingang oder in der Nähe von Bildschirmen für ein Portal kontinuierlicher aurischer Reinigung." },
        { name: "Schwarzer Turmalin des Schutzes", desc: "In den Ecken des Hauses aufbewahren, um schwere Energien abzuwehren und elektromagnetische Strahlung zu neutralisieren." },
        { name: "Rosenquarz bedingungsloser Liebe", desc: "Auf den zentralen Tisch oder ins Schlafzimmer stellen, um Beziehungspannungen zu mildern und Harmonie auszustrahlen." },
        { name: "Goldener Pyrit der Fülle", desc: "Im Büro oder Arbeitsbereich aufbewahren, um Möglichkeiten für Wohlstand und Reichtum zu magnetisieren." }
      ],
      rituals: [
        { title: "Heilige Rauchreinigung", desc: "Zünden Sie ein Palo Santo- oder Rosmarin-Räucherstäbchen an und gehen Sie im Uhrzeigersinn durch die Ecken des Hauses." },
        { title: "Lufterneuerung & Beleuchtung", desc: "Öffnen Sie im Morgengrauen 15 Minuten lang alle Fenster, um abgestandene Luft durch Sonnenlicht zu ersetzen." },
        { title: "Eingangsfluss-Organisation", desc: "Räumen Sie den Eingangsbereich auf und entfernen Sie kaputte Gegenstände, um die freie Chi-Zirkulation zu ermöglichen." },
        { title: "Harmonisierung mit dem Wasserelement", desc: "Sprühen Sie mit Lavendelöl versetztes Wasser auf Vorhänge, um das Raumklima zu besänftigen." }
      ],
      directions: [
        { name: "Richtung Osten", desc: "Ausrichtung auf das Feuerelement und den Sonnenaufgang, um Neuanfänge und Vitalität anzutreiben." },
        { name: "Richtung Norden", desc: "Einstimmung auf das Erdelement zur Stärkung der materiellen Stabilität und der Sicherheit des Hauses." },
        { name: "Richtung Westen", desc: "Verbindung mit dem Wasserelement zur Förderung gefühlvoller Wärme und Frieden in Beziehungen." },
        { name: "Richtung Süden", desc: "Inspiriert vom Luftelement zur Erweiterung von Kommunikation, Kreativität und Zukunftsvision." }
      ],
      frequencies: [
        { name: "528 Hz Frequenz (Wunder)", desc: "Im Hintergrund abspielen, um Raumatome zu harmonisieren und zelluläre Heilung zu fördern." },
        { name: "432 Hz Frequenz (Natürliche Stimmung)", desc: "In Ruhephasen abspielen, um das Haus auf die harmonische Resonanz der Erde auszurichten." },
        { name: "639 Hz Frequenz (Beziehungen)", desc: "Ideal für das Wohnzimmer, um Reibungen aufzulösen und Empathie im Alltag zu fördern." },
        { name: "741 Hz Frequenz (Intuition & Reinigung)", desc: "Beim Reinigen und Aufräumen verwenden, um psychische Toxine aus dem Haus zu eliminieren." }
      ],
      skills: [
        { name: "Mitfühlende Intelligenz & Erdung", desc: "Lernen, abstrakte Ideale in unmittelbare praktische Schritte der Manifestation umzusetzen." },
        { name: "Einfacher, einzigartiger Fokus", desc: "Die Fähigkeit, sich von virtuellen Ablenkungen zu isolieren und eine einzige Aufgabe abzuschließen." },
        { name: "Aktives emotionales Zuhören", desc: "Anderen mit einem Herzen zuhören, das frei von mechanischen Antworten oder Logik ist." },
        { name: "Praktisches karmisches Urteilsvermögen", desc: "Karmische Erschöpfungsmuster erkennen und unnötige Ausgaben oder Gewohnheiten abbauen." }
      ],
      blocks: [
        { name: "Angst vor dem Urteil anderer", desc: "Erzeugt kalten Stolz oder Distanz, die wahre Intimität verhindern." },
        { name: "Zwang zu planen, ohne zu handeln", desc: "Dutzende Entwürfe anhäufen, ohne aus Angst vor Fehlern den ersten Schritt zu tun." },
        { name: "Rationalisierung von Gefühlen", desc: "Versuchen, reine Gefühle mit kalter Logik und starren Regeln zu debattieren." },
        { name: "Verschwendung zellulärer Energie", desc: "Stundenlanges Verteidigen von Idealen oder Debattieren in sozialen Netzwerken aus Impulsivität." }
      ],
      virtues: ["Präsenz", "Struktur", "Geduld", "Demut", "Verletzlichkeit", "Mut", "Stille"],
      lessons: [
        "Wahre Fülle und aufrichtige Verbindungen gedeihen nicht durch mathematische Intelligenz, sondern wenn wir lernen, unsere Verletzlichkeit zuzulassen.",
        "Wahre Weisheit liegt darin, Pläne schweigen zu lassen und die Werke für sich selbst sprechen zu lassen.",
        "Kein glücklicher Astratransit gleicht mangelnde tägliche Disziplin aus. Ihr Lebensweg erfordert feste Beständigkeit.",
        "Das Vergeben alter Missverständnisse aus der Vergangenheit ist die einzige reale Abkürzung, um den Finanzfluss heute freizusetzen."
      ],
      exercises: [
        "Nehmen Sie sich 10 Minuten Abstand von jedem Bildschirm, atmen Sie tief ein und stellen Sie sich ein goldenes Licht vor, das Ihren Geist klärt.",
        "Schreiben Sie drei einfache Ziele mit schwarzer Tinte auf Papier und setzen Sie das erste ohne Zögern um.",
        "Gehen Sie 15 Minuten barfuß auf dem Rasen oder spüren Sie die Morgensonne auf Ihrem Gesicht, um Ihren Biorhythmus auszurichten.",
        "Senden Sie eine kurze, ehrliche Dankesnachricht an jemanden aus Ihrer Vergangenheit, von dem Sie selten hören."
      ],
      advices: [
        "Setzen Sie Ihre praktischen Erkenntnisse heute schnell um. Das Anhäufen von Plänen ohne Handeln übersättigt Ihr feinstoffliches Feld.",
        "Bewahren Sie bei dieser Lunation strategisches Schweigen über Ihre Geschäftspläne. Meiden Sie Ratschläge von Skeptikern.",
        "Ihre heutige Astralmatrix begünstigt den Fokus auf Gesundheit und zelluläre Reinigung. Meiden Sie schwere Kost.",
        "Der Tag ruft zur Harmonisierung alter emotionaler Themen auf. Eine einfache Geste der Zuneigung wird Mauern brechen."
      ],
      alerts: [
        "Vorsicht vor finanziellen Verlusten durch emotionale Kompensation. Mondtransit begünstigt heute Impulskäufe.",
        "Meiden Sie hitzige Debatten in sozialen Netzwerken oder Chats. Verschwenden Sie Ihre wertvolle Lebensenergie nicht.",
        "Achten Sie auf Muskelschmerzen durch schlechte Haltung vor dem PC. Machen Sie alle 50 Minuten eine Pause.",
        "Vermeiden Sie es, langfristige Verträge voreilig zu unterschreiben. Lesen Sie das Kleingedruckte und fragen Sie Mentoren."
      ],
      opportunities: [
        "Gespräche mit gleichgesinnten alten Freunden eröffnen unerwartete Wege für neue Geschäfte oder Gemeinschaftsprojekte.",
        "Eine originelle Erkenntnis wird in Momenten der Stille und Ruhe auftauchen. Schreiben Sie sie sofort in Ihr Notizbuch.",
        "Der aktuelle Transit öffnet Portale, um offene Verträge neu zu verhandeln und finanzielle Lecks zu schließen.",
        "Neue Erkenntnisse in feinstofflichen Studien oder Intelligenz bringen ungewöhnliche Klarheit für Karriereentscheidungen."
      ],
      protectWords: [
        { word: "ERDE DICH", desc: "Nach dem Aufwachen mental wiederholen, um Ablenkungen und kognitive Zerstreuung zu vertreiben." },
        { word: "FLIESSE IN FRIEDEN", desc: "Tief durchatmen, wenn Sie auf mechanische Reibungen oder Verzögerungen im Alltag stoßen." },
        { word: "FESTE STRUKTUR", desc: "Visualisieren, um Ihre Ziele mit Entschlossenheit und Ausdauer in der Materie zu verankern." },
        { word: "INNERE KLARHEIT", desc: "Nutzen, um mentalen Nebel oder Zweifel zu vertreiben, die durch andere entstehen." }
      ],
      keywords: [
        { word: "FEINE EXPANSION", desc: "Wachsen Sie auf diplomatische Weise, indem Sie die stillen Kanäle Ihres eigenen Wesens achten." },
        { word: "STRUKTURIERUNG", desc: "Organisieren Sie die physischen Fundamente, bevor Sie neue Projekte in den Himmel starten." },
        { word: "AUSRICHTUNG", desc: "Stimmen Sie Ihre täglichen Handlungen auf den dominanten planetarischen Transit von heute ab." },
        { word: "MANIFESTATION", desc: "Bringen Sie metaphysische Erkenntnisse durch kleine, beständige Aufgaben in die Materie." }
      ],
      symbols: [
        { name: "Heiliges Heptagramm (⭐️)", desc: "Repräsentiert die sieben Pfade des Schutzes, die Ihr feinstoffliches Energiefeld versiegeln." },
        { name: "Ankh (Schlüssel des Lebens)", desc: "Symbolisiert die Vereinigung himmlischer und irdischer Kräfte, die Ihre Vitalität regulieren." },
        { name: "Auge des Horus (𓂀)", desc: "Schenkt scharfe Wahrnehmung und Schutz vor intellektuellen Abweichungen oder Nebeln." },
        { name: "Kosmische goldene Spirale", desc: "Signalisiert kontinuierliches, harmonisches Wachstum, das auf die Evolution fokussiert ist." }
      ],
      amulets: [
        { name: "Lapislazuli-Skarabäus", desc: "Schützt auf physischer Ebene, erleichtert Transaktionen und vertreibt Müdigkeit." },
        { name: "Pyrit-Goldwürfel", desc: "Strahlt die solare Frequenz von Wohlstand, Verdienst und materiellem Fokus aus." },
        { name: "Roher Rosenquarz", desc: "Filtert Herzspannungen und öffnet Wege für verständnisvolle Gespräche zu Hause." },
        { name: "Sodalith des Fokus", desc: "Strukturiert Gehirnbahnen für die technische Aufnahme komplexer Lehren." }
      ],
      environments: [
        { name: "Bibliotheken oder Seengärten", desc: "Fördern die stille Aufnahme von Wissen und die Verlangsamung der Herzfrequenz." },
        { name: "Räume mit direktem Sonnenlicht", desc: "Laden den Solarplexus auf und steigern die molekulare Stimmung für Neuanfänge." },
        { name: "Stille Ecken in Tempeln", desc: "Erleichtern die telepathische Verbindung mit höheren feinstofflichen Sphären und Mentoren." },
        { name: "Organisierte und saubere Umgebungen", desc: "Reduzieren visuelle Ängste drastisch und setzen einen pragmatischen Arbeitsfluss frei." }
      ],
      activities: [
        { name: "Meditation mit Tagebucheintrag", desc: "Frühzeitiges Schreiben hilft dem Gehirn, sich nicht mit Plänen und Ideen zu überlasten." },
        { name: "Dehnen der Wirbelsäule & Atmung", desc: "Entblockt die physischen Energie-Meridiane und leitet zellulären Sauerstoff ins Gehirn." },
        { name: "Metaphysische Astrologiestudien", desc: "Verbindet Ihre intellektuellen Interessen mit dem universellen Kompass der Sterne." },
        { name: "Physische Dateiorganisation", desc: "Materialisiert die mentale Ordnung durch das Aufräumen von Schreibtisch und Ordnern." }
      ],
      challenges: [
        { name: "Zerstreuung und unvollendete Projekte", desc: "Achten Sie darauf, nicht 15 Entwürfe zu zeichnen und keinen einzigen zu festigen." },
        { name: "Emotionale Isolation aus Stolz", desc: "Der Versuchung widerstehen, sich schweigend zurückzuziehen, wenn Beziehungsreibungen auftreten." },
        { name: "Mangel an täglicher praktischer Beständigkeit", desc: "Nicht nur von Inspirationsspitzen abhängen; der Weg erfordert ständige Disziplin." },
        { name: "Kognitive Sättigung durch Bildschirme", desc: "Die Angst, Nachrichten aufzunehmen, ohne Zeit für zelluläre Erholung zu lassen." }
      ],
      opps: [
        { name: "Intelligentes Business & Mentoring", desc: "Ihre Matrix glänzt, wenn Sie neue Lehrmethoden oder digitale Infoprodukte erschaffen." },
        { name: "Symmetrische Partnerschaften mit Freunden", desc: "Ziele mit Menschen abstimmen, die Ihre Ethik und humanitäre Vision teilen." },
        { name: "Automatisierung von Arbeitsabläufen", desc: "Systeme implementieren, um Zeit für mechanische Büroarbeiten zu reduzieren." },
        { name: "Konsolidierung sicherer Investitionen", desc: "Ideale Gelegenheit, Beiträge neu zu ordnen und sich auf beständige Portfolios zu fokussieren." }
      ],
      energies: [
        { name: "Aktive Luft / Kollektive Ideale", desc: "Mentale Stärke und Originalität vibrieren im Haus großer Entdeckungen und Ausrichtungen." },
        { name: "Feuer des pragmatischen Impulses", desc: "Fester Wille und solarer Enthusiasmus, um zuvor stagnierende Ideen umzusetzen." },
        { name: "Erde der soliden Strukturierung", desc: "Fähigkeit, Ihren Vereinbarungen, Partnerschaften und Finanzen feste Wurzeln zu geben." },
        { name: "Wasser der magnetischen Intuition", desc: "Fließende Resonanz, die das Lesen der Absichten anderer erleichtert und Wege anzieht." }
      ],
      evitars: [
        { name: "Verträge oder Käufe aus reinem Impuls", desc: "Warten Sie, bis die Lunation vorüber ist, bevor Sie größere Investitionen tätigen." },
        { name: "Hitzige Debatten in virtuellen Netzwerken", desc: "Tauschen Sie Ihren aurischen Frieden nicht gegen unfruchtbare Meinungskonflikte ein." },
        { name: "Plötzliches Verschwinden und kalte Distanz", desc: "Klarer Dialog verhindert, dass kleine Zweifel zu emotionalen Barrieren werden." },
        { name: "Ignorieren des Biorhythmus", desc: "Kleine 3-minütige Pausen bringen heute die zelluläre Ausrichtung, die Sie benötigen." }
      ],
      foci: [
        { name: "Studien und finanzielle Konsolidierung", desc: "Richten Sie Ihre zelluläre Resonanz darauf aus, Ihr Portfolio zu ordnen und Ihr Wissen zu erweitern." },
        { name: "Vitale Gesundheit & Körperstärkung", desc: "Fokus auf die Verbesserung der Immunität durch reine Ernährung, Ruhe und Bewegung." },
        { name: "Harmonisierung des Hauses", desc: "Reinigen Sie die Energie der Räume, um einen sicheren Zufluchtsort des Friedens zu schaffen." },
        { name: "Klare Kommunikation & Partnerschaften", desc: "Brücken bauen, aufrichtige Kontakte knüpfen und abgestimmte Vorschläge präsentieren." }
      ],
      phrases: [
        "Ich kanalisiere die befreiende Originalität der Luft und die feste Struktur des Saturns, um Fülle auf feine Weise zu manifestieren.",
        "Meine Intuition ist ein souveräner Kompass; ich gehe feste Schritte, um heute Frieden und Fülle zu materialisieren.",
        "Ich löse die Mauern des Geistes auf, nehme meine Verletzlichkeit mutig an und stimme mich auf den Fluss wahrer Fülle ein.",
        "Mit täglicher Disziplin und Vertrauen in universelle Pläne gebe ich meinen Idealen Form und spüre aktiven Schutz."
      ]
    },
    fr: {
      aromas: [
        { name: "Romarin Concentré", desc: "Purifie les canaux intellectuels et stimule des décisions rapides et logiques au quotidien." },
        { name: "Citronnelle Rafraîchissante", desc: "Dissout l'agitation et syntonise l'esprit supérieur avec des vibrations de paix." },
        { name: "Lavande Française Subtile", desc: "Calme le chakra du cœur et régénère les voies du sommeil profond dans la chambre." },
        { name: "Santal Boisé", desc: "Ancre les idéaux, reliant les objectifs spirituels à la structure matérielle pratique." }
      ],
      incenses: [
        { name: "Santal ou Romarin", desc: "Excellent pour bannir l'épuisement des écrans numériques et la fatigue mentale accumulée." },
        { name: "Myrrhe ou Benjoin Blanc", desc: "Scelle les coordonnées de l'environnement contre les intrusions ou énergies denses externes." },
        { name: "Palo Santo Naturel", desc: "Attire le flux de prospérité et nettoie la poussière psychique des mardis d'affaires." },
        { name: "Camphre ou Menthe", desc: "Renouvelle l'air cellulaire et active la clarté et la concentration lors des réunions critiques." }
      ],
      plants: [
        { name: "Lis de la Paix Sacré", desc: "Purifie les canaux auriques de l'air domestique et apporte la sérénité émotionnelle." },
        { name: "Sansevieria de Protection", desc: "Crée un bouclier impénétrable contre les distractions et la jalousie sur votre bureau." },
        { name: "Zamioculca de la Fortune", desc: "Ancre le magnétisme de l'argent et de la prospérité dans l'élément Terre." },
        { name: "Basilic Protecteur", desc: "Irradie la vitalité et guérit les canaux de fatigue moléculaire dans la cuisine ou le salon." }
      ],
      rooms: [
        { name: "Coin Est (Lever du Soleil)", desc: "Espace de haute réception pranique. Idéal pour les étirements, la méditation active et la clarté matinale." },
        { name: "Coin Nord du salon de séjour", desc: "Ancrage de l'élément Terre pour stabiliser les conversations familiales et le réconfort." },
        { name: "Proximité de fenêtres bien ventilées", desc: "Flux direct de l'élément Air qui dissipe la stagnation mentale et inspire de nouvelles idées." },
        { name: "Centre géométrique de la maison", desc: "Point focal d'équilibre des 4 éléments, harmonisant le champ biomagnétique du foyer." }
      ],
      bedroomColors: [
        { name: "Bleu Lavande", desc: "Calme le système nerveux central, harmonisant le sommeil profond et éveillant des souvenirs lucides." },
        { name: "Violet Subtil", desc: "Élève la vibration transmutatrice de la chambre, purifiant les résidus émotionnels accumulés." },
        { name: "Vert Menthe Clair", desc: "Régénère la vitalité cellulaire pendant le repos nocturne et ralentit le rythme cardiaque." },
        { name: "Gris Cosmique Doux", desc: "Procurant une neutralité psychique, idéale pour filtrer les interférences extérieures pendant le repos." }
      ],
      officeColors: [
        { name: "Bleu Indigo Royal", desc: "Active les centres intellectuels supérieurs, élevant la clarté mentale, le focus et la concentration." },
        { name: "Vert Émeraude", desc: "Ancre la fréquence de prospérité et de stabilité dans la prise de décisions financières." },
        { name: "Gris Graphite Pur", desc: "Favorise la discipline linéaire, minimisant les distractions et organisant des routines complexes." },
        { name: "Ambre Clair", desc: "Rayonne l'enthousiasme solaire et le dynamisme créatif pour les négociations et projets innovants." }
      ],
      crystals: [
        { name: "Sélénite Blanche de Purification", desc: "Placez à l'entrée principale ou près des écrans pour créer un portail continu de nettoyage aurique." },
        { name: "Tourmaline Noire de Protection", desc: "Gardez dans les coins de la maison pour repousser les énergies lourdes et neutraliser les radiations." },
        { name: "Quartz Rose d'Amour Inconditionnel", desc: "Placez sur la table centrale ou dans la chambre pour adoucir les tensions relationnelles." },
        { name: "Pyrite Dorée de l'Abundandance", desc: "Laissez dans le bureau pour magnétiser les opportunités de prospérité et de richesse." }
      ],
      rituals: [
        { title: "Purification par Fumée Sacrée", desc: "Allumez un bâton de Palo Santo ou d'encens de Romarin et parcourez les coins de la maison dans le sens horaire." },
        { title: "Renouvellement de l'Air & Éclairage", desc: "Ouvrez toutes les fenêtres pendant 15 minutes à l'aube pour remplacer l'air vicié par la lumière du soleil." },
        { title: "Organisation du Flux d'Entrée", desc: "Dégagez la porte d'entrée et retirez les objets cassés pour permettre la libre circulation du chi." },
        { title: "Harmonisation avec l'Élément Eau", desc: "Vaporisez de l'eau avec quelques gouttes d'huile essentielle de lavande sur les rideaux." }
      ],
      directions: [
        { name: "Direction Est", desc: "Alignement avec l'élément Feu et le lever du Soleil pour impulser de nouveaux départs et du tonus." },
        { name: "Direction Nord", desc: "Harmonie avec l'élément Terre pour renforcer la stabilité matérielle et la sécurité du foyer." },
        { name: "Direction Ouest", desc: "Connexion avec l'élément Eau pour promouvoir la chaleur affective et la paix relationnelle." },
        { name: "Direction Sud", desc: "Inspiré par l'élément Air pour étendre la communication, la créativité et la vision du futur." }
      ],
      frequencies: [
        { name: "Fréquence 528 Hz (Miracles)", desc: "Diffusez en fond sonore pour harmoniser les atomes de l'espace et favoriser la guérison cellulaire." },
        { name: "Fréquence 432 Hz (Syntonie Naturelle)", desc: "Jouez pendant les moments de repos pour aligner la maison avec la résonance harmonique de la Terre." },
        { name: "Fréquence 639 Hz (Relations)", desc: "Idéal pour le salon pour dissoudre les frictions et promouvoir l'empathie au quotidien." },
        { name: "Fréquence 741 Hz (Intuition & Nettoyage)", desc: "Utilisez pendant le nettoyage pour éliminer les toxines psychiques du foyer." }
      ],
      skills: [
        { name: "Intelligence Compassionnelle & Ancrage", desc: "Apprendre à canaliser les idées abstraites vers des actions pratiques immédiates de manifestation." },
        { name: "Focalisation Singulière Simple", desc: "La capacité de s'isoler des distractions virtuelles et de terminer une seule tâche robuste." },
        { name: "Écoute Active Affective", desc: "Écouter l'autre avec un cœur libre de réponses mécaniques ou de syllogismes logiques." },
        { name: "Discernement Karmique Pratique", desc: "Reconnaître les schémas cycliques de fatigue et couper les dépenses ou habitudes redondantes." }
      ],
      blocks: [
        { name: "Peur du jugement d'autrui", desc: "Génère de la distance ou un orgueil froid qui empêche la véritable intimité." },
        { name: "Compulsion à planifier sans agir", desc: "Accumuler des dizaines de brouillons sans faire le premier pas pratique par peur de l'erreur." },
        { name: "Rationalisation des affects", desc: "Tenter de débattre des sentiments purs avec une logique froide et des règles rigides." },
        { name: "Gaspillage d'énergie cellulaire", desc: "Passer des heures à défendre des idéaux ou à débattre sur les réseaux sociaux par impulsivité." }
      ],
      virtues: ["Présence", "Structure", "Patience", "Humilité", "Vulnérabilité", "Courage", "Silence"],
      lessons: [
        "L'abondance réelle et les connexions sincères ne fleurissent pas par l'intelligence mathématique, mais lorsque nous acceptons d'embrasser notre vulnérabilité.",
        "La véritable sagesse réside dans le fait de taire les projets et de laisser les œuvres s'exprimer d'elles-mêmes dans la matière.",
        "Aucun transit astral de chance ne compense le manque de discipline quotidienne. Votre Chemin exige une cohérence ferme.",
        "Pardonner les anciens malentendus du passé est le seul raccourci réel pour débloquer le flux des finances aujourd'hui."
      ],
      exercises: [
        "Prenez 10 minutes loin de tout écran, respirez profondément par le nez et visualisez une lumière dorée purifiant votre esprit.",
        "Écrivez trois objectifs simples sur papier à l'encre noire et exécutez le premier d'entre eux sans tarder.",
        "Faites une marche de 15 minutes pieds nus sur l'herbe ou sentez le soleil du matin sur votre visage pour aligner votre biorythme.",
        "Envoyez un message court et sincère de gratitude à quelqu'un de votre passé avec qui vous parlez rarement."
      ],
      advices: [
        "Donnez une issue rapide à vos intuitions pratiques aujourd'hui. Accumuler des projets sans agir sature votre champ subtil.",
        "Maintenez un silence stratégique sur vos plans d'affaires lors de cette lunaison. Évitez les conseils des tiers sceptiques.",
        "Votre matrice astrale favorise aujourd'hui la santé et la purification moléculaire. Réduisez les aliments lourds.",
        "La journée appelle à l'harmonisation d'anciens dossiers affectifs. Un simple geste d'affection désarmera les vieux murs."
      ],
      alerts: [
        "Attention aux fuites financières par compensation affective. Transit lunaire propice aux achats impulsifs aujourd'hui.",
        "Évitez les débats houleux sur les réseaux sociaux ou les chats. Ne gaspillez pas votre précieuse énergie pour des opinions.",
        "Attention aux douleurs musculaires dues à une mauvaise posture devant l'ordinateur. Faites des pauses toutes les 50 minutes.",
        "Évitez de signer des contrats à long terme à la hâte. Lisez toutes les lignes et consultez des mentors expérimentés."
      ],
      opportunities: [
        "Les conversations avec de vieilles amitiés connectées ouvrent des canaux inattendus pour de nouvelles affaires ou projets.",
        "Une idée originale émergera lors de moments de silence et de repos. Notez-la immédiatement dans votre carnet physique.",
        "Le transit actuel ouvre des voies pour renégocier des dossiers en attente ou abonnements et arrêter les fuites de capitaux.",
        "De nouveaux apprentissages dans les études subtiles ou l'intelligence apporteront une clarté inhabituelle aux décisions."
      ],
      protectWords: [
        { word: "ANCREZ-VOUS", desc: "Répétez mentalement au réveil pour bannir les distractions et dispersions cognitives." },
        { word: "COULEZ EN PAIX", desc: "Rappelez-vous de respirer profondément face aux frictions mécaniques ou retards de la routine." },
        { word: "STRUCTURE FERME", desc: "Mentalisez pour ancrer vos projets dans la matière avec détermination et persévérance." },
        { word: "CLARTÉ INTÉRIEURE", desc: "Utilisez pour chasser les brumes mentales ou doutes subtils générés par l'opinion des autres." }
      ],
      keywords: [
        { word: "EXPANSION SUBTILE", desc: "Grandissez de manière diplomatique en respectant les canaux de silence de votre propre être." },
        { word: "STRUCTURATION", desc: "Organisez les fondations physiques avant de lancer de nouveaux projets vers les cieux." },
        { word: "ALIGNEMENT", desc: "Syntonisez vos actions quotidiennes avec le transit planétaire dominant d'aujourd'hui." },
        { word: "MANIFESTATION", desc: "Amenez les intuitions métaphysiques dans la matière par de petites tâches cohérentes." }
      ],
      symbols: [
        { name: "Heptagramme Sacré (⭐️)", desc: "Représente les sept chemins de protection qui scellent votre champ d'énergie aurique." },
        { name: "Ankh (Clé de la Vie)", desc: "Symbolise l'union des forces célestes et terrestres régulant votre vitalité physique." },
        { name: "Œil d'Horus (𓂀)", desc: "Apporte une perception aiguë et une protection contre les déviations ou brumes intellectuelles." },
        { name: "Spirale d'Or Cosmique", desc: "Signale une croissance continue, harmonieuse et centrée sur l'évolution millénaire." }
      ],
      amulets: [
        { name: "Scarabée de Lapis-Lazuli", desc: "Agit sur la protection physique, facilitant les transactions et bannissant la fatigue." },
        { name: "Pyrite Cube d'Or", desc: "Irradie la fréquence solaire de richesse, de mérite et de focalisation matérielle." },
        { name: "Quartz Rose Brut", desc: "Filtre les tensions cardiaques et ouvre des voies de dialogue compréhensif à la maison." },
        { name: "Sodalite de Concentration", desc: "Structure les voies cérébrales pour l'absorption technique d'enseignements complexes." }
      ],
      environments: [
        { name: "Bibliothèques ou Jardins de Lac", desc: "Favorisent l'absorption silencieuse des connaissances et la décélération cardiaque." },
        { name: "Espaces avec Lumière Solaire Directe", desc: "Rechargent le plexus solaire et augmentent l'humeur moléculaire pour de nouveaux départs." },
        { name: "Coins Silencieux de Temples", desc: "Facilitent la connexion télépathique avec les sphères subtiles et les mentors." },
        { name: "Environnements Organisés et Propres", desc: "Réduisent considérablement l'anxiété visuelle, libérant un flux de travail pragmatique." }
      ],
      activities: [
        { name: "Méditation avec Journal Intime", desc: "Écrire tôt dans le journal aide le cerveau à ne pas se saturer de plans et d'idées." },
        { name: "Étirements du Dos & Respiration", desc: "Débloque les méridiens d'énergie physique et fait circuler l'oxygène cellulaire." },
        { name: "Études d'Astrologie Métaphysique", desc: "Connecte vos intérêts intellectuels avec la boussole universelle des étoiles." },
        { name: "Organisation Physique de Fichiers", desc: "Matérialise l'ordre mental en organisant votre bureau, tiroirs et dossiers." }
      ],
      challenges: [
        { name: "Dispersion et Excès de Projets Inachevés", desc: "Attention à ne pas ébaucher 15 brouillons d'affaires sans en consolider aucun." },
        { name: "Isolement Émotionnel par Orgueil", desc: "Surmonter la tentation de s'éloigner silencieusement lorsque des frictions affectives surgissent." },
        { name: "Manque de Cohérence Pratique Quotidienne", desc: "Éviter de dépendre uniquement des pics d'inspiration ; le Chemin exige une discipline constante." },
        { name: "Saturation Cognitive par Écrans Virtuels", desc: "L'anxiété d'absorber des nouvelles et informations sans temps de repos cellulaire." }
      ],
      opps: [
        { name: "Affaires Intelligentes & Mentorat", desc: "Votre matrice originale brille lors de la création de nouvelles méthodes ou infoproduits." },
        { name: "Partenariats Symétriques avec de Vieux Amis", desc: "Syntoniser les objectifs avec des personnes partageant votre éthique et vision humanitaire." },
        { name: "Automatisation de la Routine de Travail", desc: "Mettre en œuvre des systèmes et des outils pour réduire le temps consacré à la bureaucratie." },
        { name: "Consolidation d'Investissements Sûrs", desc: "Opportunité idéale pour réorganiser les apports et se concentrer sur des portefeuilles stables." }
      ],
      energies: [
        { name: "Air Actif / Idéaux Collectifs", desc: "Force mentale et originalité vibrant dans la maison des grandes découvertes et alignements." },
        { name: "Feu de l'Impulsion Pragmatique", desc: "Volonté ferme et enthousiasme solaire pour mettre sur pied des idées auparavant stagnantes." },
        { name: "Terre de Structuration Solide", desc: "Capacité à donner des racines fermes et de la durabilité à vos accords, partenariats et finances." },
        { name: "Eau d'Intuition Magnétique", desc: "Résonance fluide qui facilite la lecture des intentions d'autrui et attire les opportunités." }
      ],
      evitars: [
        { name: "Signer des contrats ou acheter sous l'impulsion", desc: "Attendez que la lunation passe avant de faire des investissements importants." },
        { name: "Débats houleux sur les réseaux virtuels", desc: "Ne troquez pas votre paix aurique et votre concentration précieuse pour des conflits stériles." },
        { name: "Disparitions soudaines et distance froide", desc: "Dialoguer avec clarté évite que de petits doutes ne se transforment en barrières." },
        { name: "Ignorer le biorythme et accumuler la fatigue", desc: "De petites pauses de 3 minutes apporteront l'alignement cellulaire dont vous avez besoin." }
      ],
      foci: [
        { name: "Études et Consolidation Financière", desc: "Orientez votre résonance cellulaire pour organiser votre portefeuille et enrichir vos connaissances." },
        { name: "Santé Vitale & Renforcement Corporel", desc: "Se concentrer sur l'immunité par une alimentation pure, le repos et de l'exercice régulier." },
        { name: "Harmonisation du Foyer & Confort Intime", desc: "Purifier l'énergie des pièces pour générer un refuge sûr de paix et de recharge." },
        { name: "Communication Claire & Partenariats", desc: "Créer des ponts, des contacts professionnels sincères et présenter des propositions sintonisées." }
      ],
      phrases: [
        "Je canalise l'originalité libératrice de l'Air et la structure ferme de Saturne pour manifester l'abondance subtilement.",
        "Mon intuition est une boussole souveraine ; je pose des gestes fermes pour matérialiser la paix et l'abondance aujourd'hui.",
        "Je brise les murs de l'esprit, j'embrasse ma vulnérabilité avec courage et je syntonise le flux de la vraie prospérité.",
        "Avec une discipline quotidienne et la foi dans les plans universels, je donne forme à mes idéaux et ressens la protection."
      ]
    }
  };

  const activeDict = recommendationsData[lang] || recommendationsData["pt"];

  // Seed-based selection
  const aromaObj = activeDict.aromas[seed % activeDict.aromas.length];
  const incenseObj = activeDict.incenses[(seed + 1) % activeDict.incenses.length];
  const plantObj = activeDict.plants[(seed + 2) % activeDict.plants.length];
  const roomObj = activeDict.rooms[(seed + 3) % activeDict.rooms.length];
  const bedColorObj = activeDict.bedroomColors[(seed + 4) % activeDict.bedroomColors.length];
  const offColorObj = activeDict.officeColors[(seed + 5) % activeDict.officeColors.length];
  const crystalObj = activeDict.crystals ? activeDict.crystals[(seed + 6) % activeDict.crystals.length] : { name: "Selenita", desc: "Purificação contínua" };
  const ritualObj = activeDict.rituals ? activeDict.rituals[(seed + 7) % activeDict.rituals.length] : { title: "Limpeza de Fumaça", desc: "Purificação dos cantos" };
  const directionObj = activeDict.directions ? activeDict.directions[(seed + 8) % activeDict.directions.length] : { name: "Direção Leste", desc: "Alinhamento com o nascer do Sol" };
  const frequencyObj = activeDict.frequencies ? activeDict.frequencies[(seed + 9) % activeDict.frequencies.length] : { name: "Frequência 528 Hz", desc: "Harmonização do ambiente" };

  const skillObj = activeDict.skills[(seed + 1) % activeDict.skills.length];
  const blockObj = activeDict.blocks[(seed + 2) % activeDict.blocks.length];
  const virtueStr = activeDict.virtues[(seed + 3) % activeDict.virtues.length];
  const lessonStr = activeDict.lessons[(seed + 4) % activeDict.lessons.length];
  const exerciseStr = activeDict.exercises[(seed + 5) % activeDict.exercises.length];

  const adviceStr = activeDict.advices[(seed + 2) % activeDict.advices.length];
  const alertStr = activeDict.alerts[(seed + 3) % activeDict.alerts.length];
  const opportunityStr = activeDict.opportunities[(seed + 4) % activeDict.opportunities.length];
  const protectWordObj = activeDict.protectWords[(seed + 5) % activeDict.protectWords.length];

  const keywordObj = activeDict.keywords[(seed + 1) % activeDict.keywords.length];
  const symbolObj = activeDict.symbols[(seed + 2) % activeDict.symbols.length];
  const amuletObj = activeDict.amulets[(seed + 3) % activeDict.amulets.length];
  const envObj = activeDict.environments[(seed + 4) % activeDict.environments.length];
  const actObj = activeDict.activities[(seed + 5) % activeDict.activities.length];
  const challengeObj = activeDict.challenges[(seed + 6) % activeDict.challenges.length];
  const oppObj = activeDict.opps[(seed + 7) % activeDict.opps.length];
  const energyObj = activeDict.energies[(seed + 8) % activeDict.energies.length];
  const evitarObj = activeDict.evitars[(seed + 9) % activeDict.evitars.length];
  const focusObj = activeDict.foci[(seed + 10) % activeDict.foci.length];
  const phraseStr = activeDict.phrases[(seed + 11) % activeDict.phrases.length];

  const luckyNum = (seed * 11) % 99 + 1;

  return {
    casa: {
      aroma: aromaObj.name,
      aroma_desc: aromaObj.desc,
      incenso: incenseObj.name,
      incenso_desc: incenseObj.desc,
      planta: plantObj.name,
      planta_desc: plantObj.desc,
      ambiente_casa: roomObj.name,
      ambiente_casa_desc: roomObj.desc,
      quarto_cor: bedColorObj.name,
      quarto_cor_desc: bedColorObj.desc,
      escritorio_cor: offColorObj.name,
      escritorio_cor_desc: offColorObj.desc,
      cristal_casa: crystalObj.name,
      cristal_casa_desc: crystalObj.desc,
      ritual_casa: ritualObj.title,
      ritual_casa_desc: ritualObj.desc,
      direcao_cardeal: directionObj.name,
      direcao_cardeal_desc: directionObj.desc,
      frequencia_som: frequencyObj.name,
      frequencia_som_desc: frequencyObj.desc
    },
    desenvolvimento: {
      habilidade: skillObj.name,
      habilidade_desc: skillObj.desc,
      bloqueio: blockObj.name,
      bloqueio_desc: blockObj.desc,
      virtude: virtueStr,
      licao: lessonStr,
      exercicio: exerciseStr
    },
    mensagem: {
      conselho_principal: adviceStr,
      alerta_principal: alertStr,
      oportunidade_principal: opportunityStr,
      palavra_protecao: protectWordObj.word,
      palavra_protecao_desc: protectWordObj.desc
    },
    painel: {
      palavra_chave: keywordObj.word,
      palavra_chave_desc: keywordObj.desc,
      simbolo: symbolObj.name,
      simbolo_desc: symbolObj.desc,
      amuleto: amuletObj.name,
      amuleto_desc: amuletObj.desc,
      numero_sorte: String(luckyNum),
      numero_sorte_desc: lang === "pt" ? `Conecta seu Caminho de Vida com a energia realizadora cósmica.` : `Connects your Life Path with cosmic manifesting energy.`,
      cor_favoravel: amuletObj.name === "Escarabeu de Lápis-Lazúli" ? (lang === "pt" ? "Azul Cobalto Real" : "Royal Cobalt Blue") : (lang === "pt" ? "Verde Menta" : "Mint Green"),
      cor_favoravel_desc: lang === "pt" ? "Promove a harmonização sutil dos meridianos celulares." : "Promotes the subtle harmonization of cellular meridians.",
      ambiente_favoravel: envObj.name,
      ambiente_favoravel_desc: envObj.desc,
      atividade_favoravel: actObj.name,
      atividade_favoravel_desc: actObj.desc,
      desafio: challengeObj.name,
      desafio_desc: challengeObj.desc,
      oportunidade: oppObj.name,
      oportunidade_desc: oppObj.desc,
      energia_dominante: energyObj.name,
      energia_dominante_desc: energyObj.desc,
      evitar: evitarObj.name,
      evitar_desc: evitarObj.desc,
      area_foco: focusObj.name,
      area_foco_desc: focusObj.desc,
      frase_poder: phraseStr
    }
  };
}

