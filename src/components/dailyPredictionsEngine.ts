import { calculateLifePathNumber } from './prosperityEngine';
import i18next from 'i18next';

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
  de: { "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs", "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion", "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Fische" },
  fr: { "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer", "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion", "Sagitário": "Sagitaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons" }
};

const TRANSLATED_COLORS: Record<string, string[]> = {
  pt: ["Verde Esmeralda", "Azul Celeste", "Violeta Púrpura", "Dourado Sol", "Tons Pastel", "Turquesa Fluido", "Vermelho Rubi", "Laranja Suave"],
  en: ["Emerald Green", "Sky Blue", "Purple Violet", "Sun Gold", "Pastel Shades", "Fluid Turquoise", "Ruby Red", "Soft Orange"],
  es: ["Verde Esmeralda", "Azul Celeste", "Violeta Púrpura", "Dorado Sol", "Tonos Pastel", "Turquesa Fluido", "Rojo Rubí", "Naranja Suave"],
  de: ["Smaragdgrün", "Himmelblau", "Purpurviolett", "Sonnengold", "Pastelltöne", "Flüssiges Türkis", "Rubinrot", "Sanftes Orange"],
  fr: ["Vert Émeraude", "Bleu Céleste", "Violet Pourpre", "Or Soleil", "Tons Pastel", "Turquoise Fluide", "Rouge Rubis", "Orange Doux"]
};

const TRANSLATED_ENERGIES: Record<string, string[]> = {
  pt: [
    "Clareza Concreta & Intuição Ativa",
    "Foco Estruturado & Razão Sutil",
    "Reflexão Pacífica & Limpezas Físicas",
    "Estímulo Comercial & Expansão de Idéias",
    "Magnetismo Pessoal & Atração Fiel",
    "Sensibilidade Doméstica & Conforto",
    "Disciplina de Saturno & Oratórias Práticas",
    "Ousadia Rebelde & Renovação Criativa"
  ],
  en: [
    "Concrete Clarity & Active Intuition",
    "Structured Focus & Subtle Reason",
    "Peaceful Reflection & Physical Cleansing",
    "Commercial Stimulus & Expansion of Ideas",
    "Personal Magnetism & Faithful Attraction",
    "Domestic Sensitivity & Comfort",
    "Discipline of Saturn & Practical Oratories",
    "Rebellious Boldness & Creative Renewal"
  ],
  es: [
    "Claridad Concreta e Intuición Activa",
    "Enfoque Estructurado y Razón Sutil",
    "Reflexión Pacífica y Limpieza Física",
    "Estímulo Comercial y Expansión de Ideas",
    "Magnetismo Personal y Atracción Fiel",
    "Sensibilidad Doméstica y Confort",
    "Disciplina de Saturno y Oratoria Práctica",
    "Audacia Rebelde y Renovación Creativa"
  ],
  de: [
    "Konkrete Klarheit & Aktive Intuition",
    "Strukturierter Fokus & Subtile Vernunft",
    "Friedliche Reflexion & Körperliche Reinigung",
    "Kommerzieller Stimulus & Ideenausdehnung",
    "Persönlicher Magnetismus & Treue Anziehung",
    "Häusliche Sensibilität & Komfort",
    "Disziplin des Saturns & Praktische Reden",
    "Rebellische Kühnheit & Kreative Erneuerung"
  ],
  fr: [
    "Clarté Concrète & Intuition Active",
    "Focus Structuré & Raison Subtile",
    "Réflexion Paisible & Purifications Physiques",
    "Stimulation Commerciale & Expansion des Idées",
    "Magnétisme Personnel & Attraction Fidèle",
    "Sensibilité Domestique & Confort",
    "Discipline de Saturne & Discours Pratiques",
    "Audace Rebelle & Renouveau Créatif"
  ]
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

const TRANSLATED_INFLUENCES: Record<string, string[]> = {
  pt: [
    "Lua em sextil harmônico com seu Sol Natal, clareando o discernimento emocional.",
    "Lua em conjunção com seu Ascendente, expandindo o magnetismo pessoal frente a grupos.",
    "Sol em trígono harmónico de elemento com seus astros de Fogo pessoais.",
    "Aspectos de quadratura construtiva exigindo tomadas de decisão firmes na área comercial.",
    "Sextil de Mercúrio com Saturno favorecendo a redação de contratos e auditorias de planilhas.",
    "Trânsito místico favorável canalizando insights profundos em sonhos revelados.",
    "Trígono elemental fortalecendo a união de propósitos entre você e quem ama.",
    "Oposição planetária sob o eixo de destino estimulando você a ponderar vontades alheias."
  ],
  en: [
    "Moon in harmonious sextile with your Natal Sun, clearing emotional discernment.",
    "Moon in conjunction with your Ascendant, expanding personal magnetism in front of groups.",
    "Sun in elemental harmonious trine with your personal Fire celestial bodies.",
    "Constructive square aspects demanding firm decision-making in the commercial area.",
    "Mercury sextile Saturn favoring the drafting of contracts and audits of spreadsheets.",
    "Favorable mystical transit channeling deep insights in revealed dreams.",
    "Elemental trine strengthening the union of purposes between you and the one you love.",
    "Planetary opposition under the axis of destiny stimulating you to ponder others' wishes."
  ],
  es: [
    "Luna en sextil armónico con tu Sol Natal, aclarando el discernimiento emocional.",
    "Luna en conjunción con tu Ascendente, expandiendo el magnetismo personal frente a grupos.",
    "Sol en trígono armónico de elemento con tus astros de Fuego personales.",
    "Aspectos de cuadratura constructiva exigiendo tomas de decisión firmes en el área comercial.",
    "Sextil de Mercurio con Saturno favoreciendo la redacción de contratos y auditorías de planillas.",
    "Tránsito místico favorable canalizando percepciones profundas en sueños revelados.",
    "Trígono elemental fortaleciendo la unión de propósitos entre tú y quien amas.",
    "Oposición planetaria bajo el eje de destino estimulándote a ponderar voluntades ajenas."
  ],
  de: [
    "Mond im harmonischen Sextil mit Ihrer Geburtssonne, klärt das emotionale Unterscheidungsvermögen.",
    "Mond in Konjunktion mit Ihrem Aszendenten, erweitert das persönliche Magnetismus vor Gruppen.",
    "Sonne im harmonischen Element-Trigon mit Ihren persönlichen Feuer-Himmelskörpern.",
    "Konstruktive Quadrataspekte, die feste Entscheidungen im geschäftlichen Bereich erfordern.",
    "Merkur-Sextil zu Saturn begünstigt das Aufsetzen von Verträgen und Tabellenprüfungen.",
    "Günstiger mystischer Transit kanalisiert tiefe Einblicke in enthüllte Träume.",
    "Elementares Trigon stärkt die Vereinigung der Absichten zwischen Ihnen und dem geliebten Menschen.",
    "Planetare Opposition unter der Achse des Schicksals regt Sie an, die Wünsche anderer abzuwägen."
  ],
  fr: [
    "Lune en sextile harmonieux avec votre Soleil Natal, éclairant le discernement émotionnel.",
    "Lune en conjonction avec votre Ascendant, élargissant le magnétisme personnel face aux groupes.",
    "Soleil en trigone harmonieux d'élément avec vos astres de Feu personnels.",
    "Aspects de carré constructif exigeant des prises de décision fermes dans le domaine commercial.",
    "Sextile de Mercure avec Saturne favorisant la rédaction de contrats et les audits de tableurs.",
    "Transit mystique favorable canalisant des intuitions profondes dans des rêves révélés.",
    "Trigone élémentaire renforçant l'union des objectifs entre vous et la personne que vous aimez.",
    "Opposition planétaire sous l'axe du destin vous incitant à peser les volontés d'autrui."
  ]
};

const TRANSLATED_TAGS: Record<string, string[]> = {
  pt: ["Favorável", "Atenção", "Produtivo", "Descanso", "Foco"],
  en: ["Favorable", "Attention", "Productive", "Rest", "Focus"],
  es: ["Favorable", "Atención", "Productivo", "Descanso", "Enfoque"],
  de: ["Günstig", "Achtung", "Produktiv", "Ruhe", "Fokus"],
  fr: ["Favorable", "Attention", "Productif", "Repos", "Focus"]
};

const TRANSLATED_AREAS: Record<string, string[][]> = {
  pt: [
    ["Finanças", "Carreira", "Negociações"],
    ["Saúde", "Meditação", "Autocuidado"],
    ["Amor", "Conversas familiares", "Reconciliação"],
    ["Estudos", "Leituras", "Foco operacional"],
    ["Organização", "Planejamento", "Descarte de pendências"]
  ],
  en: [
    ["Finances", "Career", "Negotiations"],
    ["Health", "Meditation", "Self-care"],
    ["Love", "Family conversations", "Reconciliation"],
    ["Studies", "Reading", "Operational focus"],
    ["Organization", "Planning", "Clearing pending tasks"]
  ],
  es: [
    ["Finanzas", "Carrera", "Negociaciones"],
    ["Salud", "Meditación", "Autocuidado"],
    ["Amor", "Conversaciones familiares", "Reconciliación"],
    ["Estudios", "Lecturas", "Enfoque operativo"],
    ["Organización", "Planificación", "Descarte de pendientes"]
  ],
  de: [
    ["Finanzen", "Karriere", "Verhandlungen"],
    ["Gesundheit", "Meditation", "Selbstfürsorge"],
    ["Liebe", "Familiengespräche", "Versöhnung"],
    ["Studium", "Lesen", "Operativer Fokus"],
    ["Organisation", "Planung", "Erledigung offener Aufgaben"]
  ],
  fr: [
    ["Finances", "Carrière", "Négociations"],
    ["Santé", "Méditation", "Prendre soin de soi"],
    ["Amour", "Discussions familiales", "Réconciliation"],
    ["Études", "Lectures", "Focus opérationnel"],
    ["Organisation", "Planification", "Élimination des tâches en attente"]
  ]
};

const TRANSLATED_OPPORTUNITIES: Record<string, string[]> = {
  pt: [
    "Descobrir um gargalo administrativo que poupa dinheiro",
    "Sintonia mental abrindo as portas de um contato importante",
    "Sentimento de paz profunda curando cansaço residual",
    "Oportunidade de apresentar propostas de vanguarda e ser elogiado",
    "Receber ajuda generosa ou presente sincero sem cobranças"
  ],
  en: [
    "Discovering an administrative bottleneck that saves money",
    "Mental alignment opening the doors to an important contact",
    "Feeling of deep peace healing residual fatigue",
    "Opportunity to present avant-garde proposals and be praised",
    "Receiving generous help or a sincere gift with no strings attached"
  ],
  es: [
    "Descubrir un cuello de botella administrativo que ahorra dinero",
    "Sintonía mental abriendo las puertas de un contacto importante",
    "Sentimiento de paz profunda sanando el cansancio residual",
    "Oportunidad de presentar propuestas de vanguardia y ser elogiado",
    "Recibir ayuda generosa o un regalo sincero sin condiciones"
  ],
  de: [
    "Einen administrativen Engpass entdecken, der Geld spart",
    "Mentale Ausrichtung, die die Türen zu einem wichtigen Kontakt öffnet",
    "Gefühl des tiefen Friedens, das Restmüdigkeit heilt",
    "Gelegenheit, avantgardistische Vorschläge zu präsentieren und gelobt zu werden",
    "Großzügige Hilfe oder ein aufrichtiges Geschenk ohne Gegenleistung erhalten"
  ],
  fr: [
    "Découvrir un goulot d'étranglement administratif qui permet d'économiser de l'argent",
    "Harmonie mentale ouvrant les portes d'un contact important",
    "Sentiment de paix profonde guérissant la fatigue résiduelle",
    "Opportunité de présenter des propositions d'avant-garde et d'être félicité",
    "Recevoir une aide généreuse ou un cadeau sincère sans contrepartie"
  ]
};

const TRANSLATED_CHALLENGES: Record<string, string[]> = {
  pt: [
    "Controlar o desejo de resolver tudo ao mesmo tempo causando pressa",
    "Evitar envolver-se em conflitos de opinião supérfluos no ambiente",
    "Manter a calma diante de atrasos em correspondências virtuais",
    "Superar o desânimo inicial provocado por intromissões alheias",
    "Evitar compras impulsivas geradas por ansiedade acumulada"
  ],
  en: [
    "Controlling the desire to solve everything at once, causing rush",
    "Avoiding getting involved in superfluous conflicts of opinion in the environment",
    "Staying calm in the face of delays in virtual correspondences",
    "Overcoming initial discouragement caused by others' interference",
    "Avoiding impulsive purchases generated by accumulated anxiety"
  ],
  es: [
    "Controlar el deseo de resolver todo al mismo tiempo causando prisa",
    "Evitar involucrarse en conflictos de opinión superfluos en el entorno",
    "Mantener la calma ante retrasos en correspondencia virtual",
    "Superar el desánimo inicial provocado por entrometidos ajenos",
    "Evitar compras impulsivas generadas por la ansiedad acumulada"
  ],
  de: [
    "Den Wunsch kontrollieren, alles auf einmal zu lösen, was Eile verursacht",
    "Sich nicht in überflüssige Meinungsverschiedenheiten im Umfeld verwickeln lassen",
    "Ruhe bewahren bei Verzögerungen im virtuellen Briefwechsel",
    "Anfängliche Entmutigung überwinden, die durch Einmischung anderer verursacht wurde",
    "Impulsive Käufe vermeiden, die durch aufgestaute Angst entstehen"
  ],
  fr: [
    "Contrôler le désir de tout résoudre en même temps, ce qui provoque de la précipitation",
    "Éviter de s'impliquer dans des conflits d'opinion superflus dans l'environnement",
    "Rester calme face aux retards de correspondances virtuelles",
    "Surmonter le découragement initial provoqué par l'ingérence d'autrui",
    "Éviter les achats impulsifs générés par l'anxiété accumulée"
  ]
};

const TRANSLATED_ADVICES: Record<string, string[]> = {
  pt: [
    "silencie a mente por 5 minutos antes de tomar decisões financeiras.",
    "dedique tempo para alongar a coluna e descansar seus olhos de telas.",
    "evite expor seus sonhos primordiais a mentes ruidosas hoje.",
    "mantenha a retidão jurídica e organize as contas com minúcia.",
    "faça caminhadas de sola firme e beba bastante água para ajudar os rins."
  ],
  en: [
    "quiet your mind for 5 minutes before making financial decisions.",
    "take time to stretch your spine and rest your eyes from screens.",
    "avoid exposing your fundamental dreams to noisy minds today.",
    "maintain legal rectitude and organize accounts with detail.",
    "take firm-soled walks and drink plenty of water to support your kidneys."
  ],
  es: [
    "silencia la mente por 5 minutos antes de tomar decisiones financieras.",
    "dedica tiempo para estirar la columna y descansar tus ojos de las pantallas.",
    "evita exponer tus sueños primordiales a mentes ruidosas hoy.",
    "mantén la rectitud jurídica y organiza las cuentas con minucia.",
    "haz caminatas con paso firme y bebe bastante agua para ayudar a los riñones."
  ],
  de: [
    "beruhigen Sie Ihren Geist für 5 Minuten, bevor Sie finanzielle Entscheidungen treffen.",
    "nehmen Sie sich Zeit, um Ihre Wirbelsäule zu dehnen und Ihre Augen von Bildschirmen auszuruhen.",
    "vermeiden Sie es, Ihre grundlegenden Träume heute unruhigen Geistern auszusetzen.",
    "wahren Sie die rechtliche Redlichkeit und organisieren Sie Konten akribisch.",
    "machen Sie Spaziergänge mit festen Sohlen und trinken Sie viel Wasser, um die Nieren zu unterstützen."
  ],
  fr: [
    "calmez votre esprit pendant 5 minutes avant de prendre des décisions financières.",
    "prenez le temps d'étirer votre colonne vertébrale et de reposer vos yeux des écrans.",
    "évitez d'exposer vos rêves fondamentaux à des esprits bruyants aujourd'hui.",
    "maintenez la droiture juridique et organisez les comptes avec minutie.",
    "faites des marches fermes et buvez beaucoup d'eau pour aider vos reins."
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
        `Un día de energía fluida, ideal para asentar el polvo mental en el suelo fértil de la claridad y el autoconocimiento.`
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

export function generateDailyPrediction(
  userBirthDate: string,
  userSunSign: string,
  userName: string,
  selectedDayIndex: number,
  currentDate: Date
): DailyPrediction {
  const targetDate = new Date(currentDate.getTime() + selectedDayIndex * 24 * 60 * 60 * 1000);
  const lang = getActiveLanguage();
  
  // Deterministic seed generation based on name, birth date, selected index and month/year
  const birthNum = calculateLifePathNumber(userBirthDate);
  const nameLength = userName.length;
  const hashSeed = (birthNum + nameLength + selectedDayIndex + targetDate.getMonth() + targetDate.getFullYear()) % 100;
  
  // Determine energy tag using hashSeed and index
  const tagIndex = (hashSeed + selectedDayIndex) % 5;
  const tagText = TRANSLATED_TAGS[lang][tagIndex];
  let tagColorClass = "bg-slate-950 border-slate-800 text-slate-350";
  
  if (tagIndex === 0) {
    tagColorClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold";
  } else if (tagIndex === 1) {
    tagColorClass = "bg-rose-500/10 border-rose-500/20 text-rose-400 font-bold";
  } else if (tagIndex === 2) {
    tagColorClass = "bg-amber-500/10 border-amber-500/20 text-amber-500 font-bold";
  } else if (tagIndex === 3) {
    tagColorClass = "bg-sky-500/10 border-sky-500/20 text-sky-450 font-bold";
  } else {
    tagColorClass = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-bold";
  }

  // Generate dynamic, real-looking predictions from array indices seeded by hashSeed
  const energyLevel = 60 + ((hashSeed * 7) % 39); // 60 to 98%
  const predominantEnergy = TRANSLATED_ENERGIES[lang][(hashSeed + 2) % TRANSLATED_ENERGIES[lang].length];
  const astroInfluence = TRANSLATED_INFLUENCES[lang][(hashSeed + 5) % TRANSLATED_INFLUENCES[lang].length];
  
  const aspectText = {
    pt: `Aspecto de ${(hashSeed % 2 === 0 ? "Sextil" : "Trígono")} de ${(hashSeed % 3 === 0 ? "Vênus" : "Júpiter")} com seus planetas natais, propiciando ${(hashSeed % 2 === 0 ? "suporte prático" : "fluidez total")}.`,
    en: `Aspect of ${(hashSeed % 2 === 0 ? "Sextile" : "Trine")} of ${(hashSeed % 3 === 0 ? "Venus" : "Jupiter")} with your natal planets, providing ${(hashSeed % 2 === 0 ? "practical support" : "total fluidity")}.`,
    es: `Aspecto de ${(hashSeed % 2 === 0 ? "Sextil" : "Trígono")} de ${(hashSeed % 3 === 0 ? "Venus" : "Júpiter")} con tus planetas natales, propiciando ${(hashSeed % 2 === 0 ? "soporte práctico" : "fluidez total")}.`,
    de: `Aspekt des ${(hashSeed % 2 === 0 ? "Sextils" : "Trigons")} von ${(hashSeed % 3 === 0 ? "Venus" : "Jupiter")} mit Ihren Geburtsplaneten, was ${(hashSeed % 2 === 0 ? "praktische Unterstützung" : "totale Fluidität")} bringt.`,
    fr: `Aspect de ${(hashSeed % 2 === 0 ? "Sextile" : "Trigone")} de ${(hashSeed % 3 === 0 ? "Vénus" : "Jupiter")} avec vos planètes natales, offrant ${(hashSeed % 2 === 0 ? "un soutien pratique" : "une fluidité totale")}.`
  }[lang];

  const transit = TRANSLATED_TRANSITS[lang][(hashSeed + 8) % TRANSLATED_TRANSITS[lang].length];
  
  // Custom Areas
  const favoredAreas = TRANSLATED_AREAS[lang][hashSeed % TRANSLATED_AREAS[lang].length];
  const attentionAreas = TRANSLATED_AREAS[lang][(hashSeed + 3) % TRANSLATED_AREAS[lang].length];
  
  const opportunities = TRANSLATED_OPPORTUNITIES[lang][(hashSeed + 1) % TRANSLATED_OPPORTUNITIES[lang].length];
  const challenges = TRANSLATED_CHALLENGES[lang][(hashSeed + 4) % TRANSLATED_CHALLENGES[lang].length];
  
  const selectedAdvice = TRANSLATED_ADVICES[lang][hashSeed % TRANSLATED_ADVICES[lang].length];
  const personalizedAdvice = userName 
    ? `${userName.split(' ')[0]}, ${selectedAdvice}`
    : `${selectedAdvice.charAt(0).toUpperCase()}${selectedAdvice.slice(1)}`;
  
  const favorableColor = TRANSLATED_COLORS[lang][hashSeed % TRANSLATED_COLORS[lang].length];
  const favorableNumber = (hashSeed % 9) + 1;
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
