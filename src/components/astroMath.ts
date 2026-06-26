// Math-based astronomical/astrological calculation engine for high-precision placements
// Using J2000 epoch Keplerian elements, obliquity of ecliptic, sidereal calculations, and lunar perturbations.

import i18next from "i18next";

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

const TRANSLATED_PLANETS: Record<string, Record<string, string>> = {
  pt: { "Sol": "Sol", "Lua": "Lua", "Mercúrio": "Mercúrio", "Vênus": "Vênus", "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano", "Netuno": "Netuno", "Plutão": "Plutão", "Quíron": "Quíron", "Nodo Norte": "Nodo Norte", "Nodo Sul": "Nodo Sul", "Lilith": "Lilith", "Ascendente": "Ascendente", "Descendente": "Descendente", "Meio do Céu": "Meio do Céu", "Fundo do Céu": "Fundo do Céu" },
  en: { "Sol": "Sun", "Lua": "Moon", "Mercúrio": "Mercury", "Vênus": "Venus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptune", "Plutão": "Pluto", "Quíron": "Chiron", "Nodo Norte": "North Node", "Nodo Sul": "South Node", "Lilith": "Lilith", "Ascendente": "Ascendant", "Descendente": "Descendant", "Meio do Céu": "Midheaven", "Fundo do Céu": "Imum Coeli" },
  es: { "Sol": "Sol", "Lua": "Luna", "Mercúrio": "Mercurio", "Vênus": "Venus", "Marte": "Marte", "Júpiter": "Júpiter", "Saturno": "Saturno", "Urano": "Urano", "Netuno": "Neptuno", "Plutão": "Plutón", "Quíron": "Quirón", "Nodo Norte": "Nodo Norte", "Nodo Sul": "Nodo Sul", "Lilith": "Lilith", "Ascendente": "Ascendente", "Descendente": "Descendente", "Meio do Céu": "Medio Cielo", "Fundo do Céu": "Bajo Cielo" },
  de: { "Sol": "Sonne", "Lua": "Mond", "Mercúrio": "Merkur", "Vênus": "Venus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptun", "Plutão": "Pluto", "Quíron": "Chiron", "Nodo Norte": "Nordknoten", "Nodo Sul": "Südknoten", "Lilith": "Lilith", "Ascendente": "Aszendent", "Descendente": "Deszendent", "Meio do Céu": "Himmelsmitte", "Fundo do Céu": "Himmelstiefe" },
  fr: { "Sol": "Soleil", "Lua": "Lune", "Mercúrio": "Mercure", "Vênus": "Vénus", "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn", "Urano": "Uranus", "Netuno": "Neptune", "Plutão": "Pluto", "Quíron": "Chiron", "Nodo Norte": "Nœud Nord", "Nodo Sul": "Nœud Sud", "Lilith": "Lilith", "Ascendente": "Ascendant", "Descendente": "Descendant", "Meio do Céu": "Milieu du Ciel", "Fundo do Céu": "Fond du Ciel" }
};

const TRANSLATED_ASPECTS: Record<string, Record<string, string>> = {
  pt: { "Conjunção": "Conjunção", "Oposição": "Oposição", "Trígono": "Trígono", "Quadratura": "Quadratura", "Sextil": "Sextil", "Quincúncio": "Quincúncio", "Semisextil": "Semisextil", "Semicuadratura": "Semicuadratura", "Sesquiquadratura": "Sesquiquadratura", "Biquintil": "Biquintil" },
  en: { "Conjunção": "Conjunction", "Oposição": "Opposition", "Trígono": "Trine", "Quadratura": "Square", "Sextil": "Sextile", "Quincúncio": "Quincunx", "Semisextil": "Semisextile", "Semicuadratura": "Semi-square", "Sesquiquadratura": "Sesquiquadrate", "Biquintil": "Biquintile" },
  es: { "Conjunção": "Conjunción", "Oposição": "Oposición", "Trígono": "Trígono", "Quadratura": "Cuadratura", "Sextil": "Sextil", "Quincúncio": "Quincuncio", "Semisextil": "Semisextil", "Semicuadratura": "Semicuadratura", "Sesquiquadratura": "Sesquicuadratura", "Biquintil": "Biquintil" },
  de: { "Conjunção": "Konjunktion", "Oposição": "Opposition", "Trígono": "Trigon", "Quadratura": "Quadrat", "Sextil": "Sextil", "Quincúncio": "Quincunx", "Semisextil": "Semisextil", "Semicuadratura": "Halbquadrat", "Sesquiquadratura": "Anderthalbquadrat", "Biquintil": "Biquintil" },
  fr: { "Conjunção": "Conjonction", "Oposição": "Opposition", "Trígono": "Trigone", "Quadratura": "Carré", "Sextil": "Sextile", "Quincúncio": "Quinconce", "Semisextil": "Semi-sextile", "Semicuadratura": "Semi-carré", "Sesquiquadratura": "Sesqui-carré", "Biquintil": "Biquintile" }
};

const TRANSLATED_PLANET_DESCS: Record<string, Record<string, string>> = {
  pt: {
    "Sol": "O SOL rege sua essência divina, seu brilho exterior e seu ego vital.",
    "Lua": "A LUA coordena suas marés afetivas, reações subconscientes e memórias profundas.",
    "Mercúrio": "MERCÚRIO rege sua inteligência tática, seu raciocínio matemático e comunicação cotidiana.",
    "Vênus": "VÊNUS espelha sua capacidade de partilha amorosa, estética refinada e abundância financeira.",
    "Marte": "MARTE direciona toda a sua energia impulsionadora, sua coragem e combatividade instintiva.",
    "Júpiter": "JÚPITER governa sua expansão pessoal, estudos avançados de sabedoria e golpes de sorte.",
    "Saturno": "SATURNO estabelece seus limites construtores, testes cármicos de maturidade e autoridade de tempo.",
    "Urano": "URANO evoca os seus relâmpagos de intuição idealizadora, rebeldia de vanguarda e inovações.",
    "Netuno": "NETUNO expande sua sensibilidade espiritual mística, criatividade sublime e empatia psíquica.",
    "Plutão": "PLUTÃO regenera seus poderes ocultos por meio de transmutação psicológica silenciosa.",
    "Quíron": "QUÍRON pontua suas feridas de alma em cura contínua e sua maestria de terapeuta interno.",
    "Nodo Norte": "O NODO NORTE magnetiza sua bússola de evolução cármica futura nesta existência.",
    "Nodo Sul": "O NODO SUL abriga as suas facilidades inatas e bagagens de vidas passadas confortáveis.",
    "Lilith": "LILITH (Lua Negra) revela seus desejos tabus indomados, repressões e forças brutas sagradas.",
    "Ascendente": "O ASCENDENTE molda sua máscara de personalidade visível, sua vitalidade corporal e começos.",
    "Descendente": "O DESCENDENTE espelha o perfil de parcerias e conexões amorosas que curam sua alma.",
    "Meio do Céu": "O MEIO DO CÉU direciona o ápice de sua vocação madura, reputação profissional e legado público.",
    "Fundo do Céu": "O FUNDO DO CÉU sintoniza com as raízes de seu clã familiar, privacidade emocional e infância."
  },
  en: {
    "Sol": "The SUN rules your divine essence, your outer radiance, and your vital ego.",
    "Lua": "The MOON coordinates your emotional tides, subconscious reactions, and deep memories.",
    "Mercúrio": "MERCURY rules your tactical intelligence, your mathematical reasoning, and daily communication.",
    "Vênus": "VENUS mirrors your capacity for loving sharing, refined aesthetics, and financial abundance.",
    "Marte": "MARS directs all your driving energy, your courage, and instinctive combativeness.",
    "Júpiter": "JUPITER governs your personal expansion, advanced wisdom studies, and lucky breaks.",
    "Saturno": "SATURN establishes your building boundaries, karmic tests of maturity, and time authority.",
    "Urano": "URANUS evokes your lightning bolts of idealizing intuition, avant-garde rebellion, and innovations.",
    "Netuno": "NEPTUNE expands your mystical spiritual sensitivity, sublime creativity, and psychic empathy.",
    "Plutão": "PLUTO regenerates your hidden powers through silent psychological transmutation.",
    "Quíron": "CHIRON marks your soul wounds in continuous healing and your inner therapist mastery.",
    "Nodo Norte": "The NORTH NODE magnetizes your compass of future karmic evolution in this existence.",
    "Nodo Sul": "The SOUTH NODE houses your innate facilities and comfortable past life baggage.",
    "Lilith": "LILITH (Black Moon) reveals your untamed taboo desires, repressions, and sacred brute forces.",
    "Ascendente": "The ASCENDANT shapes your mask of visible personality, your bodily vitality, and beginnings.",
    "Descendente": "The DESCENDANT mirrors the profile of partnerships and loving connections that heal your soul.",
    "Meio do Céu": "The MIDHEAVEN directs the pinnacle of your mature vocation, professional reputation, and public legacy.",
    "Fundo do Céu": "The IMUM COELI (Lower Heaven) tunes in to the roots of your family clan, emotional privacy, and childhood."
  },
  es: {
    "Sol": "El SOL rige tu esencia divina, tu brillo exterior y tu ego vital.",
    "Lua": "La LUNA coordina tus mareas afectivas, reacciones subconscientes y memorias profundas.",
    "Mercúrio": "MERCURIO rige tu inteligencia táctica, tu razonamiento matemático y tu comunicación cotidiana.",
    "Vênus": "VENUS refleja tu capacidad de compartir amorosamente, tu estética refinada y tu abundancia financiera.",
    "Marte": "MARTE dirige toda tu energía impulsora, tu coraje y tu combatividad instintiva.",
    "Júpiter": "JÚPITER gobierna tu expansión personal, estudios avanzados de sabiduría y golpes de suerte.",
    "Saturno": "SATURNO establece tus límites constructores, pruebas kármicas de madurez y autoridad del tiempo.",
    "Urano": "URANO evoca tus relámpagos de intuición idealizadora, rebeldía de vanguardia e innovaciones.",
    "Netuno": "NEPTUNO expande tu sensibilidad espiritual mística, creatividad sublime y empatía psíquica.",
    "Plutão": "PLUTÓN regenera tus poderes ocultos a través de una transmutación psicológica silenciosa.",
    "Quíron": "QUIRÓN marca las heridas de tu alma en curación continua y tu maestría de terapeuta interno.",
    "Nodo Norte": "El NODO NORTE imanta tu brújula de evolución kármica futura en esta existencia.",
    "Nodo Sul": "El NODO SUR alberga tus facilidades innatas y cómodo equipaje de vidas pasadas.",
    "Lilith": "LILITH (Luna Negra) revela tus deseos tabú indómitos, represiones y fuerzas brutas sagradas.",
    "Ascendente": "El ASCENDENTE da forma a tu máscara de personalidad visible, tu vitalidade corporal y tus comienzos.",
    "Descendente": "El DESCENDENTE refleja el perfil de asociaciones y conexiones amorosas que curan tu alma.",
    "Meio do Céu": "El MEDIO CIELO dirige la cúspide de tu vocación madura, reputación profesional y legado público.",
    "Fundo do Céu": "El BAJO CIELO sintoniza con las raíces de tu clan familiar, privacidad emocional e infancia."
  },
  de: {
    "Sol": "Die SONNE regiert Ihre göttliche Essenz, Ihre äußere Ausstrahlung und Ihr vitales Ego.",
    "Lua": "Der MOND koordiniert Ihre emotionalen Gezeiten, unterbewussten Reaktionen und tiefen Erinnerungen.",
    "Mercúrio": "MERKUR regiert Ihre taktische Intelligenz, Ihr mathematisches Denken und Ihre tägliche Kommunikation.",
    "Vênus": "VENUS spiegelt Ihre Fähigkeit zum liebevollen Teilen, Ihre verfeinerte Ästhetik und Ihren finanziellen Überfluss wider.",
    "Marte": "MARS lenkt all Ihre treibende Energie, Ihren Mut und Ihre instinktive Kampfbereitschaft.",
    "Júpiter": "JUPITER regiert Ihre persönliche Expansion, fortgeschrittene Weisheitsstudien und Glücksfälle.",
    "Saturno": "SATURN setzt Ihre baulichen Grenzen, karmischen Reifeprüfungen und Zeitautorität.",
    "Urano": "URANUS ruft Ihre Blitze der idealisierenden Intuition, der Avantgarde-Rebellion und der Innovationen hervor.",
    "Netuno": "NEPTUN erweitert Ihre mystische spirituelle Sensibilität, erhabene Kreativität und psychische Empathie.",
    "Plutão": "PLUTO regeneriert Ihre verborgenen Kräfte durch stille psychologische Transmutation.",
    "Quíron": "CHIRON markiert Ihre Seelenwunden in kontinuierlicher Heilung und Ihre innere Therapeutenmeisterschaft.",
    "Nodo Norte": "Der NORDKNOTEN magnetisiert Ihren Kompass der zukünftigen karmischen Evolution in dieser Existenz.",
    "Nodo Sul": "Der SÜDKNOTEN beherbergt Ihre angeborenen Fähigkeiten und bequemes Gepäck aus früheren Leben.",
    "Lilith": "LILITH (Schwarzer Mond) enthüllt Ihre ungezähmten Tabuwünsche, Verdrängungen und heiligen rohen Kräfte.",
    "Ascendente": "Der ASZENDENT formt Ihre Maske der sichtbaren Persönlichkeit, Ihre körperliche Vitalität und Ihre Anfänge.",
    "Descendente": "Der DESZENDENT spiegelt das Profil von Partnerschaften und liebevollen Verbindungen wider, die Ihre Seele heilen.",
    "Meio do Céu": "Das MEDIUM COELI (Himmelsmitte) lenkt den Höhepunkt Ihrer reifen Berufung, Ihres beruflichen Rufs und Ihres öffentlichen Erbes.",
    "Fundo do Céu": "Das IMUM COELI (Himmelstiefe) stimmt sich auf die Wurzeln Ihres Familienclans, Ihre emotionale Privatsphäre und Ihre Kindheit ein."
  },
  fr: {
    "Sol": "Le SOLEIL régit votre essence divine, votre éclat extérieur et votre ego vital.",
    "Lua": "La LUNE coordonne vos marées affectives, réactions subconscientes et souvenirs profonds.",
    "Mercúrio": "MERCURE régit votre intelligence tactique, votre raisonnement mathématique et votre communication quotidienne.",
    "Vênus": "VÉNUS reflète votre capacité de partage amoureux, votre esthétique raffinée et votre abondance financière.",
    "Marte": "MARS dirige toute votre énergie motrice, votre courage et votre combativité instinctive.",
    "Júpiter": "JUPITER régit votre expansion personnelle, vos études de sagesse avancées et vos coups de chance.",
    "Saturno": "SATURNE établit vos limites constructrices, vos tests karmiques de maturité et l'autorité du temps.",
    "Urano": "URANUS évoque vos éclairs d'intuition idéalisatrice, votre rébellion d'avant-garde et vos innovations.",
    "Netuno": "NEPTUNE développe votre sensibilité spirituelle mystique, votre créativité sublime et votre empathie psychique.",
    "Plutão": "PLUTON régénère vos pouvoirs cachés grâce à une transmutation psychologique silencieuse.",
    "Quíron": "CHIRON marque les blessures de votre âme en guérison continue et votre maîtrise de thérapeute intérieur.",
    "Nodo Norte": "Le NŒUD NORD magnétise votre boussole d'évolution karmique future dans cette existence.",
    "Nodo Sul": "Le NŒUD SUD abrite vos facilités innées et vos bagages confortables de vies antérieures.",
    "Lilith": "LILITH (Lune Noire) révèle vos désirs tabous indomptés, vos répressions et vos forces brutes sacrées.",
    "Ascendente": "L'ASCENDANT façonne votre masque de personnalité visible, votre vitalité corporelle et vos débuts.",
    "Descendente": "Le DESCENDANT reflète le profil des partenariats et des relations amoureuses qui guérissent votre âme.",
    "Meio do Céu": "Le MILIEU DU CIEL dirige le summum de votre vocation mature, de votre réputation professionnelle et de votre héritage public.",
    "Fundo do Céu": "Le FOND DU CIEL s'accorde aux racines de votre clan familial, à votre intimité émotionnelle et à votre enfance."
  }
};

const TRANSLATED_HOUSE_LABELS: Record<string, string[]> = {
  pt: [
    "",
    "Casa do Eu Sou: Personalidade, corpo e impacto inicial no mundo.",
    "Casa das Finanças: Recursos materiais, talentos utilitários e valores de vida.",
    "Casa da Mente: Pequenas viagens, comunicação, irmãos e ambiente local.",
    "Casa do Clã: Lar primordial, memórias profundas, base familiar e privacidade.",
    "Casa da Paixão: Criatividade brilhante, conquistas românticas, lazer e filhos.",
    "Casa da Rotina: Trabalho diário, vitalidade da saúde física e presteza organizada.",
    "Casa do Outro: Relações oficiais, amor espelhado, sociedades e contratos.",
    "Cass das Sombras: Grandes mistérios psíquicos, transmutação, heranças e intimidade.",
    "Casa do Saber: Filosofia de vida, viagens de longa distância e sabedorias excelsas.",
    "Casa da Carreira: Posição social máxima, prestígio laboral e o seu grande legado.",
    "Casa dos Ideais: Amigos sinceros, planejamentos coletivos e ativismo social amplo.",
    "Casa do Inconsciente: Limitações carmáticas, doação altruísta e santuário psíquico."
  ],
  en: [
    "",
    "House of Self: Personality, body and initial impact on the world.",
    "House of Finances: Material resources, utilitarian talents and life values.",
    "House of Mind: Short trips, communication, siblings and local environment.",
    "House of Clan: Primordial home, deep memories, family base and privacy.",
    "House of Passion: Brilliant creativity, romantic achievements, leisure and children.",
    "House of Routine: Daily work, physical health vitality and organized helpfulness.",
    "House of the Other: Official relations, mirrored love, partnerships and contracts.",
    "House of Shadows: Great psychic mysteries, transmutation, inheritances and intimacy.",
    "House of Knowledge: Philosophy of life, long-distance travel and sublime wisdom.",
    "House of Career: Maximum social standing, labor prestige and your great legacy.",
    "House of Ideals: Sincere friends, collective planning and broad social activism.",
    "House of the Unconscious: Karmic limitations, altruistic giving and psychic sanctuary."
  ],
  es: [
    "",
    "Casa del Yo Soy: Personalidad, cuerpo e impacto inicial en el mundo.",
    "Casa de las Finanzas: Recursos materiales, talentos utilitarios y valores de vida.",
    "Casa de la Mente: Viajes cortos, comunicación, hermanos y entorno local.",
    "Casa del Clan: Hogar primordial, memorias profundas, base familiar y privacidad.",
    "Casa de la Pasión: Creatividad brillante, logros románticos, ocio e hijos.",
    "Casa de la Rutina: Trabajo diario, vitalidad de la salud física y presteza organizada.",
    "Casa del Outro: Relaciones oficiales, amor reflejado, sociedades y contratos.",
    "Casa de las Sombras: Grandes misterios psíquicos, transmutación, herencias e intimidad.",
    "Casa del Saber: Filosofía de vida, viajes de larga distancia y sabidurías excelsas.",
    "Casa de la Carrera: Máxima posición social, prestigio laboral y tu gran legado.",
    "Casa de los Ideales: Amigos sinceros, planes colectivos y amplio activismo social.",
    "Casa del Inconsciente: Limitaciones kármicas, donación altruista y santuario psíquico."
  ],
  de: [
    "",
    "Haus des Selbst: Persönlichkeit, Körper und erster Einfluss auf die Welt.",
    "Haus der Finanzen: Materielle Ressourcen, nützliche Talente und Lebenswerte.",
    "Haus des Geistes: Kurze Reisen, Kommunikation, Geschwister und lokales Umfeld.",
    "Haus des Clans: Ur-Heimat, tiefe Erinnerungen, familiäre Basis und Privatsphäre.",
    "Haus der Leidenschaft: Brillante Kreativität, romantische Erfolge, Freizeit und Kinder.",
    "Haus der Routine: Tägliche Arbeit, Vitalität der körperlichen Gesundheit und organisierte Hilfsbereitschaft.",
    "Haus des Anderen: Offizielle Beziehungen, gespiegelte Liebe, Partnerschaften und Verträge.",
    "Haus der Schatten: Große psychische Geheimnisse, Transmutation, Erbschaften und Intimität.",
    "Haus des Wissens: Lebensphilosophie, Fernreisen und erhabene Weisheit.",
    "Haus der Karriere: Höchste soziale Stellung, Arbeitsruhm und Ihr großes Vermächtnis.",
    "Haus der Ideale: Aufrichtige Freunde, kollektive Planungen und breiter sozialer Aktivismus.",
    "Haus des Unbewussten: Karmische Einschränkungen, uneigennütziges Geben und psychisches Heiligtum."
  ],
  fr: [
    "",
    "Maison de Soi : Personnalité, corps et impact initial dans le monde.",
    "Maison des Finances : Ressources matérielles, talents utilitaires et valeurs de vie.",
    "Maison de l'Esprit : Courts trajets, communication, frères et sœurs et environnement local.",
    "Maison du Clan : Foyer primordial, mémoires profondes, base familiale et intimité.",
    "Maison de la Passion : Créativité brillante, réussites romantiques, loisirs et enfants.",
    "Maison de la Routine : Travail quotidien, vitalité de la santé physique et entraide organisée.",
    "Maison de l'Autre : Relations officielles, amour miroir, partenariats et contrats.",
    "Maison des Ombres : Grands mystères psychiques, transmutation, héritages et intimité.",
    "Maison du Savoir : Philosophie de vie, voyages lointains et sagesses sublimes.",
    "Maison de la Carrière : Statut social maximal, prestige professionnel et votre grand héritage.",
    "Maison des Idéaux : Amis sincères, planifications collectives et militantisme social large.",
    "Maison de l'Inconscient : Limitations karmiques, don altruiste et sanctuaire psychique."
  ]
};

const TRANSLATED_ASPECT_INTERPS: Record<string, Record<string, string>> = {
  pt: {
    "Conjunção": "Funde energias planetárias de forma impetuosa e focada.",
    "Oposição": "Gera polarização dinâmica, conflito ou projeções no espelho dos relacionamentos.",
    "Trígono": "Facilidades fluidas, talentos inatos e sincronia pacífica de dons.",
    "Quadratura": "Tensão motivadora, lições kármicas ricas e impulsos extraordinários de amadurecimento.",
    "Sextil": "Oportunidades de colaboração prática que florescem quando há engajamento criativo.",
    "Quincúncio": "Necessidade latente de ajustes minuciosos de rumo para conciliar impulsos discordantes.",
    "Semisextil": "Sutil magnetismo de transição rápida que conecta aprendizados adjacentes.",
    "Semicuadratura": "Pequenos ruídos de rotina que forçam tomadas de decisões organizadoras.",
    "Sesquiquadratura": "Frustrações recorrentes que conduzem à autoanálise corretiva detalhada.",
    "Biquintil": "Talento mental criativo refinado e autêntica habilidade estética singular."
  },
  en: {
    "Conjunção": "Fuses planetary energies in an impetuous and focused manner.",
    "Oposição": "Generates dynamic polarization, conflict or projections in the mirror of relationships.",
    "Trígono": "Fluid facilities, innate talents, and peaceful synchrony of gifts.",
    "Quadratura": "Motivating tension, rich karmic lessons, and extraordinary maturation impulses.",
    "Sextil": "Opportunities for practical collaboration that flourish when there is creative engagement.",
    "Quincúncio": "Latent need for detailed steering adjustments to reconcile discordant impulses.",
    "Semisextil": "Subtle magnetism of rapid transition that connects adjacent learnings.",
    "Semicuadratura": "Small routine noises that force organizing decisions.",
    "Sesquiquadratura": "Recurring frustrations that lead to detailed corrective self-analysis.",
    "Biquintil": "Refined creative mental talent and authentic singular aesthetic ability."
  },
  es: {
    "Conjunção": "Fusiona las energías planetarias de manera impetuosa y enfocada.",
    "Oposição": "Gera polarização dinâmica, conflito ou projeções no espelho dos relacionamentos.",
    "Trígono": "Facilidades fluidas, talentos innatos y sincronía pacífica de dones.",
    "Quadratura": "Tensión motivadora, ricas lecciones kármicas e impulsos extraordinarios de maduración.",
    "Sextil": "Oportunidades de colaboración práctica que florecen cuando hay compromiso creativo.",
    "Quincúncio": "Necesidad latente de ajustes minuciosos de rumbo para conciliar impulsos discordantes.",
    "Semisextil": "Sutil magnetismo de transición rápida que conecta aprendizajes adyacentes.",
    "Semicuadratura": "Pequeños ruidos de rutina que obligan a tomar decisiones organizadoras.",
    "Sesquiquadratura": "Frustraciones recurrentes que conducen a un autoanálisis correctivo detallado.",
    "Biquintil": "Refinado talento mental creativo y auténtica habilidad estética singular."
  },
  de: {
    "Conjunção": "Verschmilzt planetarische Energien auf ungestüme und fokussierte Weise.",
    "Oposição": "Erzeugt dynamische Polarisation, Konflikte oder Projektionen im Spiegel von Beziehungen.",
    "Trígono": "Fließende Erleichterungen, angeborene Talente und friedliche Synchronität der Gaben.",
    "Quadratura": "Motivierende Spannung, reiche karmische Lektionen und außergewöhnliche Reifungsimpulse.",
    "Sextil": "Möglichkeiten der praktischen Zusammenarbeit, die bei kreativem Engagement aufblühen.",
    "Quincúncio": "Latentes Bedürfnis nach detaillierten Steuerungsanpassungen zur Abstimmung diskordanter Impulse.",
    "Semisextil": "Subtiler Magnetismus des schnellen Übergangs, der benachbarte Lerneffekte verbindet.",
    "Semicuadratura": "Kleine Routinegeräusche, die zu organisatorischen Entscheidungen zwingen.",
    "Sesquiquadratura": "Wiederkehrende Frustrationen, die zu einer detaillierten korrigierenden Selbstanalyse führen.",
    "Biquintil": "Verfeinertes kreatives mentales Talent und authentische, einzigartige ästhetische Fähigkeiten."
  },
  fr: {
    "Conjunção": "Fusionne les énergies planétaires de manière impétueuse et ciblée.",
    "Oposição": "Génère une polarisation dynamique, des conflits ou des projections dans le miroir des relations.",
    "Trígono": "Facilités fluides, talents innés et synchronisation pacifique des dons.",
    "Quadratura": "Tension motivante, riches leçons karmiques et extraordinaires impulsions de maturation.",
    "Sextil": "Opportunités de collaboration pratique qui s'épanouissent lorsqu'il y a un engagement créatif.",
    "Quincúncio": "Besoin latent d'ajustements de trajectoire minutieux pour concilier des impulsions discordantes.",
    "Semisextil": "Magnétisme subtil de transition rapide qui relie les apprentissages adjacents.",
    "Semicuadratura": "Petits bruits de routine qui imposent des prises de décisions organisatrices.",
    "Sesquiquadratura": "Frustrations récurrentes qui conduisent à une auto-analyse corrective détaillée.",
    "Biquintil": "Talent mental créatif raffiné et compétence esthétique singulière authentique."
  }
};

export interface AstroPlacement {
  name: string;
  sign: string;
  degree: number;
  minute: number;
  longitude: number;
  extraInfo?: string;
  description: string;
}

export interface AstroHouseCusp {
  number: number;
  sign: string;
  longitude: number;
  planets: string[];
  interpretation: string;
}

export interface AstroAspectDetails {
  planet1: string;
  planet2: string;
  aspectType: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil" | "Quincúncio" | "Semisextil" | "Semicuadratura" | "Sesquiquadratura" | "Biquintil";
  angle: number;
  orb: string;
  intensity: number;
  interpretation: string;
}

export interface CalculatedChart {
  astros: AstroPlacement[];
  houses: AstroHouseCusp[];
  aspects: AstroAspectDetails[];
  distribution: {
    elements: { fire: number; earth: number; air: number; water: number };
    qualities: { cardinal: number; fixed: number; mutable: number };
    polarization: { yang: number; yin: number };
  };
}

const SIGNS = [
  "Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
  "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"
];

const SIGN_ELEMENTS: Record<string, "fire" | "earth" | "air" | "water"> = {
  "Áries": "fire", "Leão": "fire", "Sagitário": "fire",
  "Touro": "earth", "Virgem": "earth", "Capricórnio": "earth",
  "Gêmeos": "air", "Libra": "air", "Aquário": "air",
  "Câncer": "water", "Escorpião": "water", "Peixes": "water"
};

const SIGN_QUALITIES: Record<string, "cardinal" | "fixed" | "mutable"> = {
  "Áries": "cardinal", "Câncer": "cardinal", "Libra": "cardinal", "Capricórnio": "cardinal",
  "Touro": "fixed", "Leão": "fixed", "Escorpião": "fixed", "Aquário": "fixed",
  "Gêmeos": "mutable", "Virgem": "mutable", "Sagitário": "mutable", "Peixes": "mutable"
};

const SIGN_POLARITIES: Record<string, "yang" | "yin"> = {
  "Áries": "yang", "Gêmeos": "yang", "Leão": "yang", "Libra": "yang", "Sagitário": "yang", "Aquário": "yang",
  "Touro": "yin", "Câncer": "yin", "Virgem": "yin", "Escorpião": "yin", "Capricórnio": "yin", "Peixes": "yin"
};

// Standard Keplerian elements at J2000 for heliocentric solar system
interface KeplerianElements {
  a: number; // semi-major axis (AU)
  e: number; // eccentricity
  i: number; // inclination (degrees)
  L: number; // mean longitude (degrees)
  longPeri: number; // longitude of perihelion (degrees)
  longNode: number; // longitude of ascending node (degrees)
  
  // Rates of change per Julian century
  eRate?: number;
  iRate?: number;
  LRate?: number;
  longPeriRate?: number;
  longNodeRate?: number;
}

const PLANETS_ELEMENTS: Record<string, KeplerianElements> = {
  Mercury: {
    a: 0.387098,
    e: 0.205630, eRate: 0.000020,
    i: 7.0049, iRate: 0.0050,
    L: 252.2508, LRate: 149472.6741,
    longPeri: 77.4564, longPeriRate: 0.1590,
    longNode: 48.3317, longNodeRate: -0.1253
  },
  Venus: {
    a: 0.723332,
    e: 0.006773, eRate: -0.000048,
    i: 3.3947, iRate: 0.0008,
    L: 181.9797, LRate: 58517.8153,
    longPeri: 131.5329, longPeriRate: 0.0020,
    longNode: 76.6807, longNodeRate: -0.2777
  },
  Earth: {
    a: 1.000001,
    e: 0.016708, eRate: -0.000042,
    i: 0.0, iRate: 0.0,
    L: 100.4643, LRate: 36000.7698,
    longPeri: 102.9471, longPeriRate: 0.3232,
    longNode: 0.0, longNodeRate: 0.0
  },
  Mars: {
    a: 1.523662,
    e: 0.093412, eRate: 0.000119,
    i: 1.8506, iRate: -0.0008,
    L: 355.4533, LRate: 19140.3026,
    longPeri: 336.0408, longPeriRate: 0.4439,
    longNode: 49.5785, longNodeRate: -0.2926
  },
  Jupiter: {
    a: 5.203363,
    e: 0.048393, eRate: -0.000129,
    i: 1.3053, iRate: -0.0041,
    L: 34.4044, LRate: 3034.7461,
    longPeri: 14.7538, longPeriRate: 0.1911,
    longNode: 100.5561, longNodeRate: 0.2040
  },
  Saturn: {
    a: 9.537070,
    e: 0.054150, eRate: -0.000368,
    i: 2.4845, iRate: 0.0019,
    L: 49.9443, LRate: 1222.4944,
    longPeri: 92.4319, longPeriRate: -0.4189,
    longNode: 113.7150, longNodeRate: -0.3623
  },
  Uranus: {
    a: 19.19126,
    e: 0.047168, eRate: -0.000191,
    i: 0.7697, iRate: 0.0003,
    L: 313.2322, LRate: 428.4820,
    longPeri: 170.9642, longPeriRate: 1.4080,
    longNode: 74.2299, longNodeRate: -0.0903
  },
  Neptune: {
    a: 30.06896,
    e: 0.008586, eRate: 0.000025,
    i: 1.7692, iRate: 0.0008,
    L: 304.8800, LRate: 218.4595,
    longPeri: 44.9713, longPeriRate: -0.3224,
    longNode: 131.7217, longNodeRate: -0.0059
  },
  Pluto: {
    a: 39.48,
    e: 0.2488,
    i: 17.14,
    L: 238.9288, LRate: 145.2078,
    longPeri: 224.06,
    longNode: 110.30
  },
  Chiron: {
    a: 13.71,
    e: 0.380,
    i: 6.93,
    L: 200.0, LRate: 7.07,
    longPeri: 339.3,
    longNode: 209.4
  }
};

export function getJulianDate(year: number, month: number, day: number, hour: number, minute: number): number {
  let Y = year;
  let M = month;
  let D = day + (hour + minute / 60.0) / 24.0;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  return JD;
}

function solveKepler(M: number, e: number): number {
  const M_rad = M * Math.PI / 180;
  let E = M_rad;
  for (let i = 0; i < 6; i++) {
    E = E - (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
  }
  return E;
}

function getHeliocentricCoordinates(planet: string, T: number) {
  const elem = PLANETS_ELEMENTS[planet] || PLANETS_ELEMENTS.Earth;
  
  const a = elem.a;
  const e = elem.e + (elem.eRate || 0) * T;
  const i = (elem.i + (elem.iRate || 0) * T) * Math.PI / 180;
  const L = (elem.L + (elem.LRate || 0) * T) % 360;
  const longPeri = (elem.longPeri + (elem.longPeriRate || 0) * T) % 360;
  const longNode = (elem.longNode + (elem.longNodeRate || 0) * T) % 360;
  
  const w = (longPeri - longNode + 360) % 360; // Argument of perihelion
  const M = (L - longPeri + 360) % 360; // Mean anomaly
  
  const E = solveKepler(M, e);
  
  // Coordinates in orbital plane
  const x_plane = a * (Math.cos(E) - e);
  const y_plane = a * Math.sqrt(1 - e * e) * Math.sin(E);
  
  // Angle definitions
  const o_rad = longNode * Math.PI / 180;
  const w_rad = w * Math.PI / 180;
  
  // 3D Heliocentric ecliptic coordinates
  const x = x_plane * (Math.cos(w_rad) * Math.cos(o_rad) - Math.sin(w_rad) * Math.sin(o_rad) * Math.cos(i)) - y_plane * (Math.sin(w_rad) * Math.cos(o_rad) + Math.cos(w_rad) * Math.sin(o_rad) * Math.cos(i));
  const y = x_plane * (Math.cos(w_rad) * Math.sin(o_rad) + Math.sin(w_rad) * Math.cos(o_rad) * Math.cos(i)) - y_plane * (Math.sin(w_rad) * Math.sin(o_rad) - Math.cos(w_rad) * Math.cos(o_rad) * Math.cos(i));
  const z = x_plane * (Math.sin(w_rad) * Math.sin(i)) + y_plane * (Math.cos(w_rad) * Math.sin(i));
  
  return { x, y, z };
}

export function calculateGeocentricLongitude(planetName: string, T: number, earthCoords: { x: number; y: number; z: number }): number {
  if (planetName === "Sol") {
    // Geocentric Sun is opposite coordinates of Heliocentric Earth
    const x = -earthCoords.x;
    const y = -earthCoords.y;
    let long = Math.atan2(y, x) * 180 / Math.PI;
    return (long + 360) % 360;
  }
  
  const pCoords = getHeliocentricCoordinates(planetName, T);
  const x_g = pCoords.x - earthCoords.x;
  const y_g = pCoords.y - earthCoords.y;
  let long = Math.atan2(y_g, x_g) * 180 / Math.PI;
  return (long + 360) % 360;
}

export function calculateMoonLongitude(T: number): number {
  // Analytical perturbation formula for Moon geocentric longitude
  const L_prime = (218.316 + 481267.881 * T) % 360;
  const M_prime = (134.963 + 477198.868 * T) % 360; // Lunar Mean Anomaly
  const M_sun = (357.529 + 35999.050 * T) % 360; // Solar Mean Anomaly
  const D = (297.850 + 445267.111 * T) % 360; // Lunar Mean Elongation
  const F = (93.272 + 483202.018 * T) % 360; // Lunar Argument of Latitude
  
  const L_prime_rad = L_prime * Math.PI / 180;
  const M_prime_rad = M_prime * Math.PI / 180;
  const M_sun_rad = M_sun * Math.PI / 180;
  const D_rad = D * Math.PI / 180;
  const F_rad = F * Math.PI / 180;
  
  let moonLong = L_prime;
  moonLong += 6.2887 * Math.sin(M_prime_rad);
  moonLong += -1.2740 * Math.sin(M_prime_rad - 2 * D_rad);
  moonLong += 0.6583 * Math.sin(2 * D_rad);
  moonLong += 0.2136 * Math.sin(2 * M_prime_rad);
  moonLong += -0.1851 * Math.sin(M_sun_rad);
  moonLong += -0.1143 * Math.sin(2 * F_rad);
  moonLong += 0.0587 * Math.sin(2 * D_rad - M_prime_rad);
  moonLong += 0.0572 * Math.sin(2 * D_rad - M_sun_rad - M_prime_rad);
  moonLong += 0.0533 * Math.sin(M_prime_rad + 2 * D_rad);
  
  return (moonLong + 360) % 360;
}

export function getZodiacSignInfo(longitude: number) {
  const norm = (longitude + 360) % 360;
  const idx = Math.floor(norm / 30) % 12;
  const sign = SIGNS[idx];
  const totalMin = (norm % 30) * 60;
  const degree = Math.floor(norm % 30);
  const minute = Math.floor(totalMin % 60);
  return { sign, degree, minute, index: idx };
}

// Check if an angle lies in a sector
function isLongBetween(target: number, start: number, end: number): boolean {
  const nTarget = (target - start + 360) % 360;
  const nEnd = (end - start + 360) % 360;
  return nTarget < nEnd;
}

export function performAstroCalculation(
  birthDate: string,
  birthTime: string,
  latitude: number = -23.5505, // SP Default
  longitude: number = -46.6333, // SP Default
  timezoneOffset?: number
): CalculatedChart {
  // Parse birth details
  const [year, month, day] = birthDate.split("-").map(v => parseInt(v, 10));
  let hour = 12;
  let minute = 0;
  if (birthTime && birthTime.includes(":")) {
    const [h, m] = birthTime.split(":").map(v => parseInt(v, 10));
    hour = isNaN(h) ? 12 : h;
    minute = isNaN(m) ? 0 : m;
  }
  
  // Determine standard timezone offset (in hours) if not provided
  const tzOffset = (timezoneOffset !== undefined) ? timezoneOffset : Math.round(longitude / 15);

  // Convert local standard / DST time to UTC precisely, handling day/month/year overflows & underflows
  const utcHour = hour - tzOffset;
  const localJsDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHour), Math.round((utcHour % 1) * 60) + minute, 0));
  
  const finalYear = localJsDate.getUTCFullYear();
  const finalMonth = localJsDate.getUTCMonth() + 1;
  const finalDay = localJsDate.getUTCDate();
  const finalHour = localJsDate.getUTCHours();
  const finalMinute = localJsDate.getUTCMinutes();

  // Compute Julian Dates in UTC
  const JD = getJulianDate(finalYear, finalMonth, finalDay, finalHour, finalMinute);
  const T = (JD - 2451545.0) / 36525.0; // Julian centuries since J2000
  
  // obliquity of ecliptic
  const epsilon = 23.439291 - 0.0130042 * T;
  const eps_rad = epsilon * Math.PI / 180;
  
  // Sidereal Time Calculations
  const gmst = (280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T) % 360;
  const lst = (gmst + longitude + 360) % 360;
  const lst_rad = lst * Math.PI / 180;
  const lat_rad = latitude * Math.PI / 180;
  
  // Midheaven (Meio do Céu - MC) Formula
  let MC = Math.atan2(Math.sin(lst_rad), Math.cos(lst_rad) * Math.cos(eps_rad)) * 180 / Math.PI;
  MC = (MC + 360) % 360;
  const IC = (MC + 180) % 360;
  
  // Ascendente (Asc) Formula
  let Asc = Math.atan2(Math.cos(lst_rad), -Math.sin(lst_rad) * Math.cos(eps_rad) - Math.tan(lat_rad) * Math.sin(eps_rad)) * 180 / Math.PI;
  Asc = (Asc + 360) % 360;
  const Desc = (Asc + 180) % 360;
  
  // Earth coordinates
  const earthCoords = getHeliocentricCoordinates("Earth", T);
  
  // Core planetary geocentric positions
  const rawPlacementsList = [
    { name: "Sol", long: calculateGeocentricLongitude("Sol", T, earthCoords), desc: "O SOL rege sua essência divina, seu brilho exterior e seu ego vital." },
    { name: "Lua", long: calculateMoonLongitude(T), desc: "A LUA coordena suas marés afetivas, reações subconscientes e memórias profundas." },
    { name: "Mercúrio", long: calculateGeocentricLongitude("Mercury", T, earthCoords), desc: "MERCÚRIO rege sua inteligência tática, seu raciocínio matemático e comunicação cotidiana." },
    { name: "Vênus", long: calculateGeocentricLongitude("Venus", T, earthCoords), desc: "VÊNUS espelha sua capacidade de partilha amorosa, estética refinada e abundância financeira." },
    { name: "Marte", long: calculateGeocentricLongitude("Mars", T, earthCoords), desc: "MARTE direciona toda a sua energia impulsionadora, sua coragem e combatividade instintiva." },
    { name: "Júpiter", long: calculateGeocentricLongitude("Jupiter", T, earthCoords), desc: "JÚPITER governa sua expansão pessoal, estudos avançados de sabedoria e golpes de sorte." },
    { name: "Saturno", long: calculateGeocentricLongitude("Saturn", T, earthCoords), desc: "SATURNO estabelece seus limites construtores, testes cármicos de maturidade e autoridade de tempo." },
    { name: "Urano", long: calculateGeocentricLongitude("Uranus", T, earthCoords), desc: "URANO evoca os seus relâmpagos de intuição idealizadora, rebeldia de vanguarda e inovações." },
    { name: "Netuno", long: calculateGeocentricLongitude("Neptune", T, earthCoords), desc: "NETUNO expande sua sensibilidade espiritual mística, criatividade sublime e empatia psíquica." },
    { name: "Plutão", long: calculateGeocentricLongitude("Pluto", T, earthCoords), desc: "PLUTÃO regenera seus poderes ocultos por meio de transmutação psicológica silenciosa." },
    { name: "Quíron", long: calculateGeocentricLongitude("Chiron", T, earthCoords), desc: "QUÍRON pontua suas feridas de alma em cura contínua e sua maestria de terapeuta interno." }
  ];
  
  // Calculated Mean Nodes and Lilith
  const northNodeLong = (125.0445 - 1934.1363 * T + 360) % 360;
  const southNodeLong = (northNodeLong + 180) % 360;
  const lilithLong = (176.6900 + 4069.0137 * T + 360) % 360;
  
  rawPlacementsList.push(
    { name: "Nodo Norte", long: northNodeLong, desc: "O NODO NORTE magnetiza sua bússola de evolução cármica futura nesta existência." },
    { name: "Nodo Sul", long: southNodeLong, desc: "O NODO SUL abriga as suas facilidades inatas e bagagens de vidas passadas confortáveis." },
    { name: "Lilith", long: lilithLong, desc: "LILITH (Lua Negra) revela seus desejos tabus indomados, repressões e forças brutas sagradas." }
  );
  
  // Structural points
  rawPlacementsList.push(
    { name: "Ascendente", long: Asc, desc: "O ASCENDENTE molda sua máscara de personalidade visível, sua vitalidade corporal e começos." },
    { name: "Descendente", long: Desc, desc: "O DESCENDENTE espelha o perfil de parcerias e conexões amorosas que curam sua alma." },
    { name: "Meio do Céu", long: MC, desc: "O MEIO DO CÉU direciona o ápice de sua vocação madura, reputação profissional e legado público." },
    { name: "Fundo do Céu", long: IC, desc: "O FUNDO DO CÉU sintoniza com as raízes de seu clã familiar, privacidade emocional e infância." }
  );
  
  const lang = getActiveLanguage();

  // Mapping to final placements
  const astros: AstroPlacement[] = rawPlacementsList.map(item => {
    const info = getZodiacSignInfo(item.long);
    const minStr = info.minute.toString().padStart(2, "0");
    const dStr = `${info.degree}°${minStr}'`;
    
    const translatedName = TRANSLATED_PLANETS[lang][item.name] || item.name;
    const translatedSign = TRANSLATED_SIGNS[lang][info.sign] || info.sign;
    const decWord = { pt: "decanato", en: "decanate", es: "decanato", de: "Dekanat", fr: "décanat" }[lang];
    const itemDesc = TRANSLATED_PLANET_DESCS[lang][item.name] || item.desc;
    
    const posText = {
      pt: `Posicionado perfeitamente em ${translatedSign} a uns exatos ${dStr} de arco celestial.`,
      en: `Perfectly positioned in ${translatedSign} at an exact ${dStr} of celestial arc.`,
      es: `Posicionado perfectamente en ${translatedSign} a unos exactos ${dStr} de arco celestial.`,
      de: `Perfekt positioniert in ${translatedSign} bei exakt ${dStr} des Himmelsbogens.`,
      fr: `Parfaitement positionné en ${translatedSign} à un degré exact de ${dStr} d'arc céleste.`
    }[lang];

    return {
      name: translatedName,
      sign: translatedSign,
      degree: info.degree,
      minute: info.minute,
      longitude: item.long,
      extraInfo: `${dStr}, ${decWord} ${Math.floor(info.degree / 10) + 1}º`,
      description: `${itemDesc} ${posText}`
    };
  });
  
  // Calculate Porphyry Quadrant Houses cusps
  // Quadrant 1 (MC H10 -> Asc H1): width is (Asc - MC) / 3
  const diffQ1 = (Asc - MC + 360) % 360;
  const stepQ1 = diffQ1 / 3;
  
  // Quadrant 2 (Asc H1 -> IC H4): width is (IC - Asc) / 3
  const diffQ2 = (IC - Asc + 360) % 360;
  const stepQ2 = diffQ2 / 3;
  
  const houseCusps: number[] = new Array(13); // 1-indexed for houses
  houseCusps[1] = Asc;
  houseCusps[2] = (Asc + stepQ2) % 360;
  houseCusps[3] = (Asc + 2 * stepQ2) % 360;
  houseCusps[4] = IC;
  houseCusps[5] = (IC + stepQ1) % 360;
  houseCusps[6] = (IC + 2 * stepQ1) % 360;
  houseCusps[7] = Desc;
  houseCusps[8] = (Desc + stepQ2) % 360;
  houseCusps[9] = (Desc + 2 * stepQ2) % 360;
  houseCusps[10] = MC;
  houseCusps[11] = (MC + stepQ1) % 360;
  houseCusps[12] = (MC + 2 * stepQ1) % 360;
  
  const houses: AstroHouseCusp[] = [];
  const houseLabelsLang = TRANSLATED_HOUSE_LABELS[lang];
  
  for (let num = 1; num <= 12; num++) {
    const cusp = houseCusps[num];
    const nextCusp = houseCusps[num === 12 ? 1 : num + 1];
    const cuspInfo = getZodiacSignInfo(cusp);
    
    // Find planets present in this house
    const planetsInHouse: string[] = [];
    rawPlacementsList.forEach(ast => {
      // Avoid adding geometric points like Asc, Desc, MC, IC as planets inside houses
      if (["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(ast.name)) return;
      if (isLongBetween(ast.long, cusp, nextCusp)) {
        planetsInHouse.push(ast.name);
      }
    });
    
    const translatedSign = TRANSLATED_SIGNS[lang][cuspInfo.sign] || cuspInfo.sign;
    const translatedPlanetsInHouse = planetsInHouse.map(p => TRANSLATED_PLANETS[lang][p] || p);
    
    const cuspText = {
      pt: `Cúspide posicionada em ${translatedSign} (${cuspInfo.degree}°${cuspInfo.minute.toString().padStart(2, "0")}')`,
      en: `Cusp positioned in ${translatedSign} (${cuspInfo.degree}°${cuspInfo.minute.toString().padStart(2, "0")}')`,
      es: `Cúspide posicionada en ${translatedSign} (${cuspInfo.degree}°${cuspInfo.minute.toString().padStart(2, "0")}')`,
      de: `Spitze positioniert in ${translatedSign} (${cuspInfo.degree}°${cuspInfo.minute.toString().padStart(2, "0")}')`,
      fr: `Cuspide positionnée en ${translatedSign} (${cuspInfo.degree}°${cuspInfo.minute.toString().padStart(2, "0")}')`
    }[lang];
    
    const planetsText = planetsInHouse.length > 0
      ? {
          pt: ` Planetas presentes ativando esta área: ${translatedPlanetsInHouse.join(", ")}.`,
          en: ` Planets present activating this area: ${translatedPlanetsInHouse.join(", ")}.`,
          es: ` Planetas presentes activando esta área: ${translatedPlanetsInHouse.join(", ")}.`,
          de: ` Präsente Planeten, die diesen Bereich aktivieren: ${translatedPlanetsInHouse.join(", ")}.`,
          fr: ` Planètes présentes activant cette zone : ${translatedPlanetsInHouse.join(", ")}.`
        }[lang]
      : {
          pt: " Nossos astros celestes não ocupam esta casa diretamente, sendo regida de longe por seu respectivo regente planetário.",
          en: " Our celestial bodies do not occupy this house directly, being governed from afar by their respective planetary ruler.",
          es: " Nuestros astros celestes no ocupan esta casa directamente, sendo regida de lejos por su respectivo regente planetario.",
          de: " Unsere Himmelskörper besetzen dieses Haus nicht direkt, sondern werden von weitem von ihrem jeweiligen planetarischen Herrscher regiert.",
          fr: " Nos astres célestes n'occupent pas cette maison directement, étant régie de loin par son régent planétaire respectif."
        }[lang];

    houses.push({
      number: num,
      sign: translatedSign,
      longitude: cusp,
      planets: translatedPlanetsInHouse,
      interpretation: `${houseLabelsLang[num]} ${cuspText}${planetsText}`
    });
  }
  
  // Aspect calculations
  interface AspectType {
    name: "Conjunção" | "Oposição" | "Trígono" | "Quadratura" | "Sextil" | "Quincúncio" | "Semisextil" | "Semicuadratura" | "Sesquiquadratura" | "Biquintil";
    angle: number;
    orb: number;
    interpretation: string;
  }
  
  const aspectConfig: AspectType[] = [
    { name: "Conjunção", angle: 0, orb: 8, interpretation: "Funde energias planetárias de forma impetuosa e focada." },
    { name: "Oposição", angle: 180, orb: 8, interpretation: "Gera polarização dinâmica, conflito ou projeções no espelho dos relacionamentos." },
    { name: "Trígono", angle: 120, orb: 8, interpretation: "Facilidades fluidas, talentos inatos e sincronia pacífica de dons." },
    { name: "Quadratura", angle: 90, orb: 8, interpretation: "Tensão motivadora, lições kármicas ricas e impulsos extraordinários de amadurecimento." },
    { name: "Sextil", angle: 60, orb: 6, interpretation: "Oportunidades de colaboração prática que florescem quando há engajamento criativo." },
    { name: "Quincúncio", angle: 150, orb: 5, interpretation: "Necessidade latente de ajustes minuciosos de rumo para conciliar impulsos discordantes." },
    { name: "Semisextil", angle: 30, orb: 2, interpretation: "Sutil magnetismo de transição rápida que conecta aprendizados adjacentes." },
    { name: "Semicuadratura", angle: 45, orb: 2, interpretation: "Pequenos ruídos de rotina que forçam tomadas de decisões organizadoras." },
    { name: "Sesquiquadratura", angle: 135, orb: 3, interpretation: "Frustrações recorrentes que conduzem à autoanálise corretiva detalhada." },
    { name: "Biquintil", angle: 144, orb: 2, interpretation: "Talento mental criativo refinado e autêntica habilidade estética singular." }
  ];
  
  const aspects: AstroAspectDetails[] = [];
  
  for (let i = 0; i < rawPlacementsList.length; i++) {
    for (let j = i + 1; j < rawPlacementsList.length; j++) {
      const p1 = rawPlacementsList[i];
      const p2 = rawPlacementsList[j];
      
      // Skip aspecting structures with structures
      const p1IsStruct = ["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(p1.name);
      const p2IsStruct = ["Ascendente", "Descendente", "Meio do Céu", "Fundo do Céu"].includes(p2.name);
      if (p1IsStruct && p2IsStruct) continue;
      
      const diff = Math.abs(p1.long - p2.long);
      const shortestDist = Math.min(diff, 360 - diff);
      
      for (const asp of aspectConfig) {
        const currentOrb = Math.abs(shortestDist - asp.angle);
        if (currentOrb <= asp.orb) {
          const intensity = Math.floor((1 - currentOrb / asp.orb) * 100);
          
          const aspName = TRANSLATED_ASPECTS[lang][asp.name] || asp.name;
          const aspInterp = TRANSLATED_ASPECT_INTERPS[lang][asp.name] || asp.interpretation;
          const p1Name = TRANSLATED_PLANETS[lang][p1.name] || p1.name;
          const p2Name = TRANSLATED_PLANETS[lang][p2.name] || p2.name;
          
          const interpText = {
            pt: `${p1Name} em ${aspName} com ${p2Name}: ${aspInterp} Operando com intensidade magnética de ${intensity}% e orbe exata de ${currentOrb.toFixed(2)} graus.`,
            en: `${p1Name} in ${aspName} with ${p2Name}: ${aspInterp} Operating with magnetic intensity of ${intensity}% and exact orb of ${currentOrb.toFixed(2)} degrees.`,
            es: `${p1Name} en ${aspName} con ${p2Name}: ${aspInterp} Operando con intensidad magnética del ${intensity}% y orbe exacto de ${currentOrb.toFixed(2)} grados.`,
            de: `${p1Name} in ${aspName} mit ${p2Name}: ${aspInterp} Wirkt mit einer magnetischen Intensität von ${intensity}% und einer exakten Orbe von ${currentOrb.toFixed(2)} Grad.`,
            fr: `${p1Name} en ${aspName} avec ${p2Name} : ${aspInterp} Opérant avec une intensité magnétique de ${intensity}% et une orbe exacte de ${currentOrb.toFixed(2)} degrés.`
          }[lang];

          aspects.push({
            planet1: p1Name,
            planet2: p2Name,
            aspectType: aspName as any,
            angle: asp.angle,
            orb: `${currentOrb.toFixed(2)}°`,
            intensity,
            interpretation: interpText
          });
        }
      }
    }
  }
  
  // Elements, Qualities, Polarization Distributions
  let fire = 0, earth = 0, air = 0, water = 0;
  let cardinal = 0, fixed = 0, mutable = 0;
  let yang = 0, yin = 0;
  
  // Calculate distribution based on Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto and Ascendant (the main 11 chart anchors)
  const chartAnchors = ["Sol", "Lua", "Mercúrio", "Vênus", "Marte", "Júpiter", "Saturno", "Urano", "Netuno", "Plutão", "Ascendente"];
  rawPlacementsList.forEach(ast => {
    if (!chartAnchors.includes(ast.name)) return;
    const info = getZodiacSignInfo(ast.long);
    const element = SIGN_ELEMENTS[info.sign];
    const quality = SIGN_QUALITIES[info.sign];
    const polarity = SIGN_POLARITIES[info.sign];
    
    // Weigh Sun, Moon, Ascendant double (weight 2), other planets (weight 1)
    const weight = ["Sol", "Lua", "Ascendente"].includes(ast.name) ? 2 : 1;
    
    if (element === "fire") fire += weight;
    if (element === "earth") earth += weight;
    if (element === "air") air += weight;
    if (element === "water") water += weight;
    
    if (quality === "cardinal") cardinal += weight;
    if (quality === "fixed") fixed += weight;
    if (quality === "mutable") mutable += weight;
    
    if (polarity === "yang") yang += weight;
    if (polarity === "yin") yin += weight;
  });
  
  const totalElements = fire + earth + air + water || 1;
  const totalQualities = cardinal + fixed + mutable || 1;
  const totalPolarities = yang + yin || 1;
  
  return {
    astros,
    houses,
    aspects,
    distribution: {
      elements: {
        fire: Math.round(fire / totalElements * 100),
        earth: Math.round(earth / totalElements * 100),
        air: Math.round(air / totalElements * 100),
        water: Math.round(water / totalElements * 100)
      },
      qualities: {
        cardinal: Math.round(cardinal / totalQualities * 100),
        fixed: Math.round(fixed / totalQualities * 100),
        mutable: Math.round(mutable / totalQualities * 100)
      },
      polarization: {
        yang: Math.round(yang / totalPolarities * 100),
        yin: Math.round(yin / totalPolarities * 100)
      }
    }
  };
}
