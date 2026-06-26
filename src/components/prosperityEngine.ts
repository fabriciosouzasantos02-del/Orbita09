import { getZodiacSignInfo } from './astroMath';
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
  targetDate: Date
): ProsperityMapData {
  const currentMonthIdx = targetDate.getMonth() + 1; // 1 to 12
  const currentYear = targetDate.getFullYear();
  const lang = getActiveLanguage();
  
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
  
  // Astro personalization using userSunSign to fetch elemental correspondences
  const sunSignZodiac = getZodiacSignInfoByString(userSunSign);
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
  
  const opportunities = zodiacOpportunities[lang]?.[userSunSign] || defaultOpps[lang];
  
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
  
  const challenges = zodiacChallenges[lang]?.[userSunSign] || defaultChalls[lang];
  
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
