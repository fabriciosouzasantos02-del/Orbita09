import { Language } from './translations';

export interface LunarPhaseTranslation {
  name: string;
  desc: string;
  energy: string;
}

export const LUNAR_PHASES_TRANSLATIONS: Record<string, Record<Language, LunarPhaseTranslation>> = {
  nova: {
    pt: { name: 'Lua Nova', desc: 'Início de ciclo, ideal para intenções, novos rumos e plantar sementes internas.', energy: 'Momento de recolhimento, inspiração e planejamento secreto silencioso.' },
    en: { name: 'New Moon', desc: 'Beginning of cycle, ideal for setting intentions, new directions, and planting inner seeds.', energy: 'Moment of introspection, inspiration, and silent secret planning.' },
    es: { name: 'Luna Nueva', desc: 'Inicio de ciclo, ideal para intenciones, nuevos rumbos y sembrar semillas internas.', energy: 'Momento de recogimiento, inspiración y planificación secreta y silenciosa.' },
    de: { name: 'Neumond', desc: 'Beginn des Zyklus, ideal für Absichten, neue Richtungen und das Pflanzen innerer Samen.', energy: 'Moment des Rückzugs, der Inspiration und der stillen geheimen Planung.' },
    fr: { name: 'Nouvelle Lune', desc: 'Début de cycle, idéal pour les intentions, les nouvelles directions et planter des graines intérieures.', energy: 'Moment de recueillement, d\'inspiration et de planification secrète et silencieuse.' }
  },
  crescente: {
    pt: { name: 'Lua Crescente', desc: 'Acúmulo de energia física, tração inicial, superabilidade diante de incertezas.', energy: 'Estímulo de ação para sair da inércia, investir esforço consciente de ação.' },
    en: { name: 'Waxing Crescent', desc: 'Accumulation of physical energy, initial traction, overcoming uncertainties.', energy: 'Stimulus for action to break inertia and invest conscious effort in action.' },
    es: { name: 'Luna Creciente', desc: 'Acumulación de energía física, tracción inicial, superación ante incertidumbres.', energy: 'Estímulo de acción para salir de la inercia, invertir un esfuerzo consciente de acción.' },
    de: { name: 'Zunehmende Sichel', desc: 'Ansammlung von körperlicher Energie, anfänglicher Zugkraft, Überwindung von Unsicherheiten.', energy: 'Aktionsreiz, um die Trägheit zu überwinden und bewusste Anstrengung in Handeln zu investieren.' },
    fr: { name: 'Lune Croissante', desc: 'Accumulation d\'énergie physique, traction initiale, surmontabilité face aux incertitudes.', energy: 'Stimulus d\'action pour sortir de l\'inertie, investir un effort conscient d\'action.' }
  },
  quarto_crescente: {
    pt: { name: 'Lua Quarto Crescente', desc: 'Força realizadora, teste tático e determinação para desafiar barreiras.', energy: 'Período de superação de obstáculos iniciais com foco e resiliência total.' },
    en: { name: 'First Quarter Moon', desc: 'Creative power, tactical test, and determination to challenge barriers.', energy: 'Period of overcoming initial obstacles with focus and total resilience.' },
    es: { name: 'Luna Cuarto Creciente', desc: 'Fuerza realizadora, prueba táctica y determinación para desafiar barreras.', energy: 'Período de superación de obstáculos iniciales con enfoque y resiliencia total.' },
    de: { name: 'Erstes Viertel', desc: 'Realisierende Kraft, taktischer Test und Entschlossenheit, Barrieren herauszufordern.', energy: 'Zeitraum der Überwindung anfänglicher Hindernisse mit Fokus und totaler Resilienz.' },
    fr: { name: 'Premier Quartier de Lune', desc: 'Force réalisatrice, test tactique et détermination à défier les barrières.', energy: 'Période de dépassement des obstacles initiaux avec concentration et résilience totale.' }
  },
  gibosa: {
    pt: { name: 'Lua Gibosa', desc: 'Ajustes finos minuciosos, amadurecimento e análise detalhada laboriosa.', energy: 'Dia de aperfeiçoar processos e ajustar as metas diante do clímax iminente.' },
    en: { name: 'Waxing Gibbous', desc: 'Detailed fine-tuning, maturation, and laborious detailed analysis.', energy: 'Day to perfect processes and adjust goals before the impending climax.' },
    es: { name: 'Luna Gibosa Creciente', desc: 'Ajustes finos minuciosos, maduración y análisis detallado laborioso.', energy: 'Día de perfeccionar procesos y ajustar metas ante el clímax inminente.' },
    de: { name: 'Dreiviertelmond', desc: 'Detaillierte Feinabstimmung, Reifung und mühsame Detailanalyse.', energy: 'Tag, um Prozesse zu perfektionieren und Ziele vor dem bevorstehenden Höhepunkt anzupassen.' },
    fr: { name: 'Lune Gibbeuse Croissante', desc: 'Ajustements fins minutieux, mûrissement et analyse détaillée laborieuse.', energy: 'Jour pour perfectionner les processus et ajuster les objectifs face au climax imminent.' }
  },
  cheia: {
    pt: { name: 'Lua Cheia', desc: 'Clímax magnético, transbordo de águas sentimentais e colheita abundante.', energy: 'Alta sensibilidade social, intuição reveladora e emoções à flor da pele.' },
    en: { name: 'Full Moon', desc: 'Magnetic climax, overflow of sentimental waters, and abundant harvest.', energy: 'High social sensitivity, revealing intuition, and raw emotions.' },
    es: { name: 'Luna Llena', desc: 'Clímax magnético, desbordamiento de aguas sentimentales y cosecha abundante.', energy: 'Alta sensibilidad social, intuición reveladora y emociones a flor de piel.' },
    de: { name: 'Vollmond', desc: 'Magnetischer Höhepunkt, Überlaufen emotionaler Gewässer und reiche Ernte.', energy: 'Hohe soziale Sensibilität, offenbarende Intuition und intensive Emotionen.' },
    fr: { name: 'Pleine Lune', desc: 'Climax magnétique, débordement des eaux sentimentales et récolte abondante.', energy: 'Haute sensibilité sociale, intuition révélatrice et émotions à fleur de peau.' }
  },
  disseminadora: {
    pt: { name: 'Lua Disseminadora', desc: 'Partilha de saberes, expressividade carinhosa, gratidão e ensino fluido.', energy: 'Excelente momento para ensinar, distribuir conselhos generosos e socializar.' },
    en: { name: 'Waning Gibbous / Disseminating', desc: 'Sharing of knowledge, warm expressiveness, gratitude, and fluid teaching.', energy: 'Excellent moment to teach, distribute generous advice, and socialize.' },
    es: { name: 'Luna Diseminadora', desc: 'Intercambio de saberes, expresividad cariñosa, gratitud y enseñanza fluida.', energy: 'Excelente momento para enseñar, distribuir consejos generosos y socializar.' },
    de: { name: 'Aussaatmond', desc: 'Teilen von Wissen, herzliche Ausdruckskraft, Dankbarkeit und fließende Lehre.', energy: 'Hervorragende Zeit, um zu lehren, großzügige Ratschläge zu erteilen und Kontakte zu knüpfen.' },
    fr: { name: 'Lune Disséminatrice', desc: 'Partage des savoirs, expressivité affectueuse, gratitude et enseignement fluide.', energy: 'Excellent moment pour enseigner, distribuer des conseils généreux et socialiser.' }
  },
  quarto_minguante: {
    pt: { name: 'Lua Quarto Minguante', desc: 'Eliminação consciente de pendências, divórcio de amarras e depuração do ser.', energy: 'Sugerem depuração, encerramentos práticos, triagem e limpezas profundas.' },
    en: { name: 'Third Quarter Moon', desc: 'Conscious elimination of pending issues, detaching from ties, and self-purification.', energy: 'Suggests purification, practical closures, sorting, and deep cleansing.' },
    es: { name: 'Luna Cuarto Menguante', desc: 'Eliminación consciente de pendientes, divorcio de ataduras y depuración del ser.', energy: 'Sugiere depuración, cierres prácticos, clasificación y limpiezas profundas.' },
    de: { name: 'Letztes Viertel', desc: 'Bewusstes Beseitigen offener Fragen, Lösen von Bindungen und Selbstreinigung.', energy: 'Legt Reinigung, praktische Abschlüsse, Sortierung und gründliche Säuberungen nahe.' },
    fr: { name: 'Dernier Quartier de Lune', desc: 'Élimination consciente des affaires en cours, rupture des liens et épuration de l\'être.', energy: 'Suggère l\'épuration, des clôtures pratiques, du tri et des nettoyages profonds.' }
  },
  balsamica: {
    pt: { name: 'Lua Balsâmica', desc: 'Reflexão mística profunda, transmutação silenciosa e sossego restaurador.', energy: 'Fase de quietude, transmutação de pesos mentais e descanso preparatório.' },
    en: { name: 'Balsamic Moon', desc: 'Deep mystical reflection, silent transmutation, and restorative rest.', energy: 'Phase of quietude, transmutation of mental burdens, and preparatory rest.' },
    es: { name: 'Luna Balsámica', desc: 'Reflexión mística profunda, transmutación silenciosa y sosiego restaurador.', energy: 'Fase de quietud, transmutación de cargas mentales y descanso preparatorio.' },
    de: { name: 'Balsamischer Mond', desc: 'Tiefe mystische Reflexion, stille Transmutation und erholsame Ruhe.', energy: 'Phase der Ruhe, Umwandlung mentaler Lasten und vorbereitende Erholung.' },
    fr: { name: 'Lune Balsamique', desc: 'Réflexion mystique profonde, transmutation silencieuse et repos restaurateur.', energy: 'Phase de quiétude, transmutation des fardeaux mentaux et repos préparatoire.' }
  }
};

export interface MedicalTranslation {
  element: string;
  organs: string[];
  finances: string;
  relationships: string;
  health: string;
  beauty: string;
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
}

export const SIGN_MEDICAL_TRANSLATED: Record<string, Record<Language, MedicalTranslation>> = {
  "Áries": {
    pt: {
      element: "Fogo", modality: "Cardinal",
      organs: ["Cabeça", "Cérebro", "Olhos", "Crânio"],
      finances: "Desejo de inícios comerciais rápidos. Evite compras imediatas por impulso ou por pressões momentâneas.",
      relationships: "Clima de paixão ardente e diálogo direto. Cuidado com discussões ácidas ou reações impacientes.",
      health: "Atenção com dores de cabeça e cansaço visual. Hidrate-se e evite tensões mentais na mandíbula.",
      beauty: "Favorece cortes de cabelo modernos e práticos. Evite cirurgias faciais invasivas neste momento."
    },
    en: {
      element: "Fire", modality: "Cardinal",
      organs: ["Head", "Brain", "Eyes", "Skull"],
      finances: "Desire for quick business beginnings. Avoid immediate impulse buys or temporary pressure purchases.",
      relationships: "Climate of burning passion and direct dialogue. Beware of bitter arguments or impatient reactions.",
      health: "Attention to headaches and eye strain. Stay hydrated and avoid mental tension in the jaw.",
      beauty: "Favors modern and practical haircuts. Avoid invasive facial surgeries at this time."
    },
    es: {
      element: "Fuego", modality: "Cardinal",
      organs: ["Cabeza", "Cerebro", "Ojos", "Cráneo"],
      finances: "Deseo de inicios comerciales rápidos. Evite compras impulsivas inmediatas o por presiones momentáneas.",
      relationships: "Clima de pasión ardiente y diálogo directo. Cuidado con discusiones ácidas o reacciones impacientes.",
      health: "Atención con dolores de cabeza y cansancio visual. Hidrátese y evite tensiones mentales en la mandíbula.",
      beauty: "Favorece cortes de cabello modernos y prácticos. Evite cirugías faciales invasivas en este momento."
    },
    de: {
      element: "Feuer", modality: "Cardinal",
      organs: ["Kopf", "Gehirn", "Augen", "Schädel"],
      finances: "Wunsch nach schnellem Geschäftsstart. Vermeiden Sie spontane Impulskäufe oder Käufe unter vorübergehendem Druck.",
      relationships: "Klima brennender Leidenschaft und des direkten Dialogs. Vorsicht vor bitteren Streits oder ungeduldigen Reaktionen.",
      health: "Achten Sie auf Kopfschmerzen und Überanstrengung der Augen. Bleiben Sie hydratisiert und vermeiden Sie mentale Spannungen im Kiefer.",
      beauty: "Begünstigt moderne und praktische Haarschnitte. Vermeiden Sie in dieser Zeit invasive Gesichtschirurgie."
    },
    fr: {
      element: "Feu", modality: "Cardinal",
      organs: ["Tête", "Cerveau", "Yeux", "Crâne"],
      finances: "Désir de démarrages commerciaux rapides. Évitez les achats compulsifs immédiats ou sous pression temporaire.",
      relationships: "Climat de passion brûlante et de dialogue direct. Attention aux disputes acerbes ou aux réactions impatientes.",
      health: "Attention aux maux de tête et à la fatigue oculaire. Hydratez-vous et évitez les tensions mentales dans la mâchoire.",
      beauty: "Favorise les coupes de cheveux modernes et pratiques. Évitez les chirurgies faciales invasives en ce moment."
    }
  },
  "Touro": {
    pt: {
      element: "Terra", modality: "Fixed",
      organs: ["Pescoço", "Garganta", "Cordas Vocais", "Tireoide"],
      finances: "Propício para organizar orçamentos de segurança. Momento fértil para compras duradouras de alto valor residual.",
      relationships: "Foco em carinho seguro, estabilidade de convívio e fidelidade. Cuidado com o fantasma do ciúme persistente.",
      health: "Garganta e cordas vocais sensíveis. Vista proteções quentes e consuma chás mornos de ervas melíferas.",
      beauty: "Excelente para hidratações corporais suntuosas, massagens com óleos essenciais e banhos aromáticos."
    },
    en: {
      element: "Earth", modality: "Fixed",
      organs: ["Neck", "Throat", "Vocal Cords", "Thyroid"],
      finances: "Propitious for organizing safety budgets. Fertile moment for long-lasting high residual value purchases.",
      relationships: "Focus on secure affection, living stability, and fidelity. Watch out for the ghost of persistent jealousy.",
      health: "Sensitive throat and vocal cords. Wear warm protections and consume warm honey-infused herbal teas.",
      beauty: "Excellent for sumptuous body hydrations, massages with essential oils, and aromatic baths."
    },
    es: {
      element: "Tierra", modality: "Fixed",
      organs: ["Cuello", "Garganta", "Cuerdas Vocales", "Tiroides"],
      finances: "Propicio para organizar presupuestos de seguridad. Momento fértil para compras duraderas de alto valor residual.",
      relationships: "Enfoque en cariño seguro, estabilidad de convivencia y fidelidad. Cuidado con el fantasma de los celos persistentes.",
      health: "Garganta y cuerdas vocales sensibles. Vista protecciones cálidas y consuma tés tibios de hierbas melíferas.",
      beauty: "Excelente para hidrataciones corporales suntuosas, masajes con aceites esenciales y baños aromáticos."
    },
    de: {
      element: "Erde", modality: "Fixed",
      organs: ["Hals", "Rachen", "Stimmbänder", "Schilddrüse"],
      finances: "Günstig für die Organisation von Sicherheitsbudgets. Fruchtbarer Moment für langlebige Anschaffungen mit hohem Restwert.",
      relationships: "Fokus auf sichere Zuneigung, Lebensstabilität und Treue. Achten Sie auf das Gespenst anhaltender Eifersucht.",
      health: "Empfindlicher Hals und Stimmbänder. Tragen Sie warmen Schutz und trinken Sie warme Kräutertees mit Honig.",
      beauty: "Hervorragend geeignet für luxuriöse Körperfeuchtigkeitspflege, Massagen mit ätherischen Ölen und aromatische Bäder."
    },
    fr: {
      element: "Terre", modality: "Fixed",
      organs: ["Cou", "Gorge", "Cordes Vocales", "Thyroïde"],
      finances: "Propice à l'organisation de budgets de sécurité. Moment fertile pour des achats durables à haute valeur résiduelle.",
      relationships: "Focus sur l'affection sécurisante, la stabilité de vie et la fidélité. Attention au fantôme de la jalousie persistante.",
      health: "Gorge et cordes vocales sensibles. Portez des protections chaudes et consommez des tisanes tièdes de plantes mellifères.",
      beauty: "Excellent pour des hydratations corporelles somptueuses, des massages aux huiles essentielles et des bains aromatiques."
    }
  },
  "Gêmeos": {
    pt: {
      element: "Ar", modality: "Mutable",
      organs: ["Ombros", "Braços", "Mãos", "Laringe", "Sistema Nervoso"],
      finances: "Fluidez na comunicação de negócios e trocas de ideias comerciais. Bom para prospectar clientes novos de forma leve.",
      relationships: "Sintonia de diálogos mentais jocosos, compartilhamento de leituras e passeios curtos divertidos.",
      health: "A respiração e o sistema nervoso pedem atenção. Pratique meditações pausadas para acalmar os fluxos mentais.",
      beauty: "Dia perfeito para manicure, pedicure, esfoliação de mãos e uso de fragrâncias cítricas leves e solares."
    },
    en: {
      element: "Air", modality: "Mutable",
      organs: ["Shoulders", "Arms", "Hands", "Larynx", "Nervous System"],
      finances: "Fluidity in business communication and commercial exchanges of ideas. Good for prospecting new clients lightly.",
      relationships: "Harmony of playful mental dialogues, sharing readings, and fun short outings.",
      health: "Breathing and nervous system demand attention. Practice slow meditations to calm mental flows.",
      beauty: "Perfect day for manicure, pedicure, hand exfoliation, and use of light, solar citrus fragrances."
    },
    es: {
      element: "Aire", modality: "Mutable",
      organs: ["Hombros", "Brazos", "Manos", "Laringe", "Sistema Nervioso"],
      finances: "Fluidez en la comunicación de negocios e intercambio de ideas comerciales. Bueno para prospectar nuevos clientes de forma ligera.",
      relationships: "Sintonía de diálogos mentales jocosos, compartir lecturas y paseos cortos divertidos.",
      health: "La respiración y el sistema nervioso piden atención. Practique meditaciones pausadas para calmar los flujos mentales.",
      beauty: "Día perfecto para manicura, pedicura, exfoliación de manos y uso de fragancias cítricas ligeras y solares."
    },
    de: {
      element: "Luft", modality: "Mutable",
      organs: ["Schultern", "Arme", "Hände", "Kehlkopf", "Nervensystem"],
      finances: "Leichtigkeit in der Geschäftskommunikation und beim Austausch von Geschäftsideen. Gut, um spielerisch neue Kunden zu gewinnen.",
      relationships: "Harmonie aus verspielten mentalen Dialogen, dem Teilen von Lektüre und lustigen kurzen Ausflügen.",
      health: "Atmung und Nervensystem verlangen Aufmerksamkeit. Praktizieren Sie langsame Meditationen, um mentale Ströme zu beruhigen.",
      beauty: "Perfekter Tag für Maniküre, Pediküre, Handpeeling und die Verwendung von leichten, sonnigen Zitrusdüften."
    },
    fr: {
      element: "Air", modality: "Mutable",
      organs: ["Épaules", "Bras", "Mains", "Larynx", "Système Nerveux"],
      finances: "Fluidité dans la communication d'affaires et échanges d'idées commerciales. Bon pour prospecter de nouveaux clients en toute légèreté.",
      relationships: "Harmonie de dialogues mentaux ludiques, partage de lectures et courtes sorties amusantes.",
      health: "La respiration et le système nerveux demandent de l'attention. Pratiquez des méditations calmes pour apaiser les flux mentaux.",
      beauty: "Journée parfaite pour la manucure, pédicure, gommage des mains et l'utilisation de parfums d'agrumes légers et solaires."
    }
  },
  "Câncer": {
    pt: {
      element: "Água", modality: "Cardinal",
      organs: ["Estômago", "Diafragma", "Seios", "Útero"],
      finances: "Decisões que flutuam ao sabor do bem-estar doméstico. Bom para compras que nutrem o lar e agregam valor familiar.",
      relationships: "Vontade de aconchego íntimo de almas, trocas de afeto sincero e sensibilidade carismática profunda.",
      health: "O estômago e a digestão ficam sensíveis. Escolha comidas cozidas leves de fácil digestão e evite frituras.",
      beauty: "Bom para máscaras capilares calmantes de aloe vera e terapias aquáticas regeneradoras no chuveiro ou ofurô."
    },
    en: {
      element: "Water", modality: "Cardinal",
      organs: ["Stomach", "Diaphragm", "Breasts", "Uterus"],
      finances: "Decisions floating at the whim of domestic well-being. Good for purchases that nurture home and add family value.",
      relationships: "Desire for intimate soul coziness, exchanges of sincere affection, and deep charismatic sensitivity.",
      health: "Stomach and digestion become sensitive. Choose light cooked foods of easy digestion and avoid fried items.",
      beauty: "Good for soothing aloe vera hair masks and regenerating aquatic therapies in the shower or hot tub."
    },
    es: {
      element: "Agua", modality: "Cardinal",
      organs: ["Estómago", "Diafragma", "Senos", "Útero"],
      finances: "Decisiones que flotan al son del bienestar doméstico. Bueno para compras que nutren el hogar y agregan valor familiar.",
      relationships: "Deseo de acogida íntima de almas, intercambios de afecto sincero y sensibilidad carismática profunda.",
      health: "El estómago y la digestión se vuelven sensibles. Elija alimentos cocinados ligeros de fácil digestión y evite frituras.",
      beauty: "Bueno para mascarillas capilares calmantes de aloe vera y terapias acuáticas regeneradoras en la ducha o el jacuzzi."
    },
    de: {
      element: "Wasser", modality: "Cardinal",
      organs: ["Magen", "Zwerchfell", "Brüste", "Gebärmutter"],
      finances: "Entscheidungen, die von häuslichem Wohlbefinden geprägt sind. Gut für Einkäufe, die das Heim nähren und den Familienwert steigern.",
      relationships: "Wunsch nach intimer Seelenwärme, Austausch von aufrichtiger Zuneigung und tiefer charismatischer Sensibilität.",
      health: "Magen und Verdauung werden empfindlich. Wählen Sie leicht gekochte, leicht verdauliche Speisen und vermeiden Sie Frittiertes.",
      beauty: "Gut für beruhigende Aloe-Vera-Haarmasken und regenerierende Wassertherapien in der Dusche oder im Whirlpool."
    },
    fr: {
      element: "Eau", modality: "Cardinal",
      organs: ["Estomac", "Diaphragme", "Seins", "Utérus"],
      finances: "Décisions fluctuant au gré du bien-être domestique. Bon pour les achats qui nourrissent le foyer et ajoutent de la valeur familiale.",
      relationships: "Désir d'intimité d'âmes, échanges d'affection sincère et sensibilité charismatique profonde.",
      health: "L'estomac et la digestion deviennent sensibles. Choisissez des aliments cuits légers et digestes et évitez les fritures.",
      beauty: "Idéal pour les masques capillaires apaisants à l'aloe vera et les thérapies aquatiques régénératrices sous la douche ou au bain à remous."
    }
  },
  "Leão": {
    pt: {
      element: "Fogo", modality: "Fixed",
      organs: ["Coração", "Coluna Vertebral", "Região Dorsal", "Aorta"],
      finances: "Atração por produtos estéticos de luxo e marcas exclusivas. Excelente para promover seu próprio nome corporativo.",
      relationships: "Amor expressivo, leal e fervoroso. Bom para jantares festivos e demonstrações mútuas de prestígio.",
      health: "Cuide da postura vertebral. Evite carregar pesos excessivos ou fazer torções bruscas nas costas.",
      beauty: "O momento ápice para cortes de cabelo visando volume, força dos fios, tratamentos capilares profundos e renovações radicais."
    },
    en: {
      element: "Fire", modality: "Fixed",
      organs: ["Heart", "Spine", "Dorsal Region", "Aorta"],
      finances: "Attraction to luxury aesthetic products and exclusive brands. Excellent for promoting your own corporate name.",
      relationships: "Expressive, loyal, and fervent love. Good for festive dinners and mutual demonstrations of prestige.",
      health: "Take care of your spinal posture. Avoid carrying excessive weights or making sudden back twists.",
      beauty: "Peak moment for haircuts aiming for volume, hair strand strength, deep hair treatments, and radical renewals."
    },
    es: {
      element: "Fuego", modality: "Fixed",
      organs: ["Corazón", "Columna Vertebral", "Región Dorsal", "Aorta"],
      finances: "Atracción por productos estéticos de lujo y marcas exclusivas. Excelente para promover su propio nombre corporativo.",
      relationships: "Amor expresivo, leal y fervoroso. Bueno para cenas festivas y demostraciones mutuas de prestigio.",
      health: "Cuide la postura vertebral. Evite cargar pesos excesivos o realizar giros bruscos en la espalda.",
      beauty: "Momento cumbre para cortes de cabello buscando volumen, fuerza de las hebras, tratamientos capilares profundos y renovaciones radicales."
    },
    de: {
      element: "Feuer", modality: "Fixed",
      organs: ["Herz", "Wirbelsäule", "Rückenbereich", "Aorta"],
      finances: "Anziehungskraft von luxuriösen Kosmetikprodukten und exklusiven Marken. Hervorragend geeignet, um Ihren eigenen Firmennamen zu bewerben.",
      relationships: "Ausdrucksstarke, loyale und glühende Liebe. Gut für festliche Abendessen und gegenseitige Wertschätzung.",
      health: "Achten Sie auf Ihre Haltung. Vermeiden Sie das Tragen schwerer Lasten oder plötzliche Verdrehungen des Rückens.",
      beauty: "Höhepunkt für Haarschnitte, die auf Volumen und Stärke abzielen, sowie Tiefenhaarbehandlungen und radikale Veränderungen."
    },
    fr: {
      element: "Feu", modality: "Fixed",
      organs: ["Cœur", "Colonne Vertébrale", "Région Dorsale", "Aorte"],
      finances: "Attrait pour les produits esthétiques de luxe et les marques exclusives. Excellent pour promouvoir votre propre image professionnelle.",
      relationships: "Amour expressif, loyal et ardent. Idéal pour les dîners festifs et les démonstrations mutuelles de prestige.",
      health: "Prenez soin de votre posture. Évitez de porter des charges excessives ou de faire des torsions brusques du dos.",
      beauty: "Le moment idéal pour des coupes de cheveux visant le volume, la force de la fibre, les soins capillaires profonds et les relookings."
    }
  },
  "Virgem": {
    pt: {
      element: "Terra", modality: "Mutable",
      organs: ["Abdômen", "Intestinos", "Válvula Ileocecal", "Baço"],
      finances: "Excelente para auditar contas milímetro a milímetro. Organize suas planilhas de gastos e corte taxas inúteis.",
      relationships: "Demonstração de amor por serviços práticos, organização mútua do dia a dia e diálogos racionais sinceros.",
      health: "A microbiota intestinal e o abdômen demandam cuidado. Dietas de fibras puras, probióticos naturais e hidratação intensa.",
      beauty: "Favorece limpezas de pele detalhadas, depilações limpas, cuidados com cutículas e detox capilar purificador."
    },
    en: {
      element: "Earth", modality: "Mutable",
      organs: ["Abdomen", "Intestines", "Ileocecal Valve", "Spleen"],
      finances: "Excellent for auditing bills millimeter by millimeter. Organize your expense sheets and cut useless fees.",
      relationships: "Demonstration of love through practical services, mutual organization of daily life, and sincere rational dialogues.",
      health: "Gut microbiota and abdomen demand care. Diets of pure fibers, natural probiotics, and intense hydration.",
      beauty: "Favors detailed skin cleanings, clean hair removals, cuticle care, and purifying hair detox."
    },
    es: {
      element: "Tierra", modality: "Mutable",
      organs: ["Abdomen", "Intestinos", "Válvula Ileocecal", "Bazo"],
      finances: "Excelente para auditar cuentas milímetro a milímetro. Organice sus hojas de gastos y elimine tarifas inútiles.",
      relationships: "Demostración de amor mediante servicios prácticos, organización mutua del día a día y diálogos racionales sinceros.",
      health: "La microbiota intestinal y el abdomen demandan cuidado. Dieta de fibras puras, probióticos naturales e hidratación intensa.",
      beauty: "Favorece limpiezas de piel detalladas, depilaciones limpias, cuidado de cutículas y detox capilar purificador."
    },
    de: {
      element: "Erde", modality: "Mutable",
      organs: ["Bauch", "Darm", "Ileozökalklappe", "Milz"],
      finances: "Hervorragend geeignet, um Rechnungen Millimeter für Millimeter zu prüfen. Organisieren Sie Ihre Spesenblätter und streichen Sie unnötige Gebühren.",
      relationships: "Liebesbeweis durch praktische Dienste, gegenseitige Organisation des Alltags und aufrichtige, rationale Dialoge.",
      health: "Darmmikrobiom und Bauch verlangen Pflege. Ballaststoffreiche Ernährung, natürliche Probiotika und reichlich Flüssigkeitszufuhr.",
      beauty: "Begünstigt gründliche Hautreinigungen, saubere Haarentfernungen, Nagelhautpflege und reinigendes Haardetox."
    },
    fr: {
      element: "Terre", modality: "Mutable",
      organs: ["Abdomen", "Intestins", "Valvule Iléo-cæcale", "Rate"],
      finances: "Excellent pour auditer les factures au millimètre près. Organisez vos tableaux de dépenses et supprimez les frais inutiles.",
      relationships: "Démonstration d'amour par des services pratiques, organisation commune du quotidien et dialogues rationnels et sincères.",
      health: "Le microbiote intestinal et l'abdomen demandent du soin. Privilégiez les fibres pures, les probiotiques naturels et une hydratation intense.",
      beauty: "Favorise les nettoyages de peau détaillés, les épilations nettes, le soin des cuticules et les détox capillaires purifiantes."
    }
  },
  "Libra": {
    pt: {
      element: "Ar", modality: "Cardinal",
      organs: ["Rins", "Lombar", "Glândulas Suprarrenais", "Ureteres"],
      finances: "Favorece acordos equilibrados, parcerias financeiras conjuntas e compras de adornos de alto design requintado.",
      relationships: "Sintonia elegante, cortesia mútua e conciliação sutil de pequenos desentendimentos prévios.",
      health: "Beba bastante água fresca para purificar a filtragem dos rins. Alongue a lombar com suavidade.",
      beauty: "Momento espetacular para harmonizações de traços, cortes simétricos, design de sobrancelhas e tratamentos de viço facial."
    },
    en: {
      element: "Air", modality: "Cardinal",
      organs: ["Kidneys", "Lower Back", "Adrenal Glands", "Ureters"],
      finances: "Favors balanced agreements, joint financial partnerships, and purchases of high exquisite design ornaments.",
      relationships: "Elegant harmony, mutual courtesy, and subtle reconciliation of prior minor misunderstandings.",
      health: "Drink plenty of fresh water to purify kidney filtration. Stretch your lower back gently.",
      beauty: "Spectacular moment for feature harmonization, symmetrical cuts, eyebrow design, and facial glow treatments."
    },
    es: {
      element: "Aire", modality: "Cardinal",
      organs: ["Riñones", "Lumbar", "Glándulas Suprarrenales", "Uréteres"],
      finances: "Favorece acuerdos equilibrados, alianzas financieras conjuntas y compras de adornos de alto diseño exquisito.",
      relationships: "Sintonía elegante, cortesía mutua y conciliación sutil de pequeños malentendidos previos.",
      health: "Beba bastante agua fresca para purificar la filtración de los riñones. Estire la zona lumbar con suavidad.",
      beauty: "Momento espectacular para armonizaciones de rasgos, cortes simétricos, diseño de cejas y tratamientos de luminosidad facial."
    },
    de: {
      element: "Luft", modality: "Cardinal",
      organs: ["Nieren", "Lendenbereich", "Nebennieren", "Harnleiter"],
      finances: "Begünstigt ausgewogene Vereinbarungen, gemeinsame Finanzpartnerschaften und den Kauf von erlesenen Designornamenten.",
      relationships: "Elegante Harmonie, gegenseitige Höflichkeit und subtile Beilegung früherer kleinerer Missverständnisse.",
      health: "Trinken Sie viel frisches Wasser, um die Nierenfiltration zu reinigen. Dehnen Sie Ihren Lendenbereich sanft.",
      beauty: "Spektakulärer Moment für Gesichtsharmonisierung, symmetrische Schnitte, Augenbrauendesign und Gesichtsbehandlungen für gesunden Glanz."
    },
    fr: {
      element: "Air", modality: "Cardinal",
      organs: ["Reins", "Lombaire", "Glandes Surrénales", "Uretères"],
      finances: "Favorise les accords équilibrés, les partenariats financiers conjoints et les achats d'objets d'art de design exquis.",
      relationships: "Harmonie élégante, courtoisie mutuelle et réconciliation subtile de légers malentendus préalables.",
      health: "Buvez beaucoup d'eau fraîche pour purifier les reins. Étirez la région lombaire avec douceur.",
      beauty: "Moment exceptionnel pour l'harmonisation des traits, les coupes symétriques, le design des sourcils et les soins éclat du visage."
    }
  },
  "Escorpião": {
    pt: {
      element: "Água", modality: "Fixed",
      organs: ["Órgãos Sexuais", "Próstata", "Bexiga", "Cólon"],
      finances: "Forte faro intuitivo para lucrar ou detectar transações ocultas vantajosas. Guarde seus planos financeiros em segredo.",
      relationships: "Clima de entrega total mística, lealdade profunda e confidências íntimas vigorosas entre quatro paredes.",
      health: "A região pélvica e a bexiga merecem atenção preventiva. Pratique meditações de transmutação de mágoas kármicas.",
      beauty: "Excelente para depilações prolongadas, maquiagens de olhar marcante ou aplicação de tinturas capilares de cor intensa."
    },
    en: {
      element: "Water", modality: "Fixed",
      organs: ["Sexual Organs", "Prostate", "Bladder", "Colon"],
      finances: "Strong intuitive sense to profit or detect hidden advantageous transactions. Keep your financial plans secret.",
      relationships: "Climate of complete mystical surrender, deep loyalty, and vigorous intimate secrets behind closed doors.",
      health: "Pelvic region and bladder deserve preventive care. Practice meditation to transmute karmic grief.",
      beauty: "Excellent for prolonged hair removals, bold eye makeup, or application of intense hair color dyes."
    },
    es: {
      element: "Agua", modality: "Fixed",
      organs: ["Órganos Sexuales", "Próstata", "Vejiga", "Colon"],
      finances: "Fuerte olfato intuitivo para lucrar o detectar transacciones ocultas ventajosas. Guarde sus planes financieros en secreto.",
      relationships: "Clima de entrega total mística, lealtad profunda y confidencias íntimas vigorosas entre cuatro paredes.",
      health: "La región pélvica y la vejiga merecen atención preventiva. Practique meditaciones de transmutación de heridas kármicas.",
      beauty: "Excelente para depilaciones prolongadas, maquillajes de mirada marcada o aplicación de tintes capilares de color intenso."
    },
    de: {
      element: "Wasser", modality: "Fixed",
      organs: ["Geschlechtsorgane", "Prostata", "Blase", "Dickdarm"],
      finances: "Starkes intuitives Gespür, um Gewinne zu erzielen oder versteckte vorteilhafte Transaktionen zu erkennen. Halten Sie Ihre Finanzpläne geheim.",
      relationships: "Klima vollständiger mystischer Hingabe, tiefer Loyalität und leidenschaftlicher intimer Geheimnisse hinter verschlossenen Türen.",
      health: "Beckenregion und Blase verlangen vorbeugende Pflege. Praktizieren Sie Meditationen, um karmischen Kummer umzuwandeln.",
      beauty: "Hervorragend geeignet für langanhaltende Haarentfernung, ausdrucksstarkes Augen-Make-up oder das Färben von Haaren in intensiven Tönen."
    },
    fr: {
      element: "Eau", modality: "Fixed",
      organs: ["Organes Sexuels", "Prostate", "Vessie", "Côlon"],
      finances: "Fort instinct intuitif pour réaliser des profits ou détecter des transactions cachées avantageuses. Gardez vos projets financiers secrets.",
      relationships: "Climat d'abandon mystique total, de loyauté profonde et de confidences intimes intenses à l'abri des regards.",
      health: "La région pelvienne et la vessie méritent une attention préventive. Pratiquez des méditations de libération des blessures karmiques.",
      beauty: "Excellent pour les épilations de longue durée, les maquillages du regard intenses ou l'application de teintures capillaires profondes."
    }
  },
  "Sagitário": {
    pt: {
      element: "Fogo", modality: "Mutable",
      organs: ["Quadril", "Coxas", "Nervo Ciático", "Fígado", "Fêmur"],
      finances: "Desejo amplo de expansão de negócios ou apostas ousadas. Bom para investir em treinamentos e bagagens acadêmicas.",
      relationships: "Conexão baseada em filosofia de vida, gargalhadas, passeios livres e respeito à liberdade pessoal mútua.",
      health: "Evite alimentos excessivamente gordurosos ou bebidas doces para suavizar a sobrecarga sobre o fígado.",
      beauty: "Favorece cortes de cabelo para crescimento rápido e tratamentos relaxantes tônicos para coxas e panturrilhas."
    },
    en: {
      element: "Fire", modality: "Mutable",
      organs: ["Hips", "Thighs", "Sciatic Nerve", "Liver", "Femur"],
      finances: "Broad desire for business expansion or bold bets. Good for investing in training and academic backgrounds.",
      relationships: "Connection based on philosophy of life, laughter, free walks, and respect for mutual personal freedom.",
      health: "Avoid excessively fatty foods or sweet drinks to ease the overload on the liver.",
      beauty: "Favors haircuts for rapid growth and tónicos relaxing treatments for thighs and calves."
    },
    es: {
      element: "Fuego", modality: "Mutable",
      organs: ["Cadera", "Muslos", "Nervio Ciático", "Hígado", "Fémur"],
      finances: "Deseo amplio de expansión de negocios o apuestas audaces. Bueno para invertir en formación y bagaje académico.",
      relationships: "Conexión basada en filosofía de vida, carcajadas, paseos libres y respeto a la libertad personal mutua.",
      health: "Evite alimentos excesivamente grasosos o bebidas dulces para suavizar la sobrecarga sobre el hígado.",
      beauty: "Favorece cortes de cabello para crecimiento rápido y tratamientos relajantes tónicos para muslos y pantorrillas."
    },
    de: {
      element: "Feuer", modality: "Mutable",
      organs: ["Hüften", "Oberschenkel", "Ischiasnerv", "Leber", "Oberschenkelknochen"],
      finances: "Großes Verlangen nach Geschäftsexpansion oder mutigen Wetten. Gut für Investitionen in Weiterbildung und akademischen Hintergrund.",
      relationships: "Verbindung basierend auf Lebensphilosophie, Lachen, gemeinsamen Ausflügen und Respekt vor gegenseitiger persönlicher Freiheit.",
      health: "Vermeiden Sie übermäßig fettige Speisen oder süße Getränke, um die Leber zu entlasten.",
      beauty: "Begünstigt Haarschnitte für schnelles Wachstum und entspannende, tonisierende Behandlungen für Oberschenkel und Waden."
    },
    fr: {
      element: "Feu", modality: "Mutable",
      organs: ["Hanches", "Cuisses", "Nerf Sciatique", "Foie", "Fémur"],
      finances: "Grand désir d'expansion d'affaires ou de paris audacieux. Idéal pour investir dans les formations et bagages académiques.",
      relationships: "Connexion basée sur la philosophie de vie, les rires, les balades libres et le respect de la liberté personnelle mutuelle.",
      health: "Évitez les aliments trop gras ou les boissons sucrées pour alléger la surcharge sur le foie.",
      beauty: "Favorise les coupes de cheveux pour une repousse rapide et les soins tonifiants et relaxants pour les cuisses et mollets."
    }
  },
  "Capricórnio": {
    pt: {
      element: "Terra", modality: "Cardinal",
      organs: ["Esqueleto", "Articulações", "Joelhos", "Dentes", "Pele"],
      finances: "Foco pragmático na estabilização de longo prazo. Bom para investimentos perfeitamente conservadores regulados.",
      relationships: "Relações seguras pautadas no dever e na fidelidade duradoura. Pouca tolerância a melodramas e infantilidades.",
      health: "Suplemente cálcio, colágeno e cuide bem das articulações e dentes. Faça caminhadas de sola firme.",
      beauty: "Favorece cortes de cabelo sóbrios, clássicos, elegantes e profissionais. Ótimo para tonificar a derme corporal."
    },
    en: {
      element: "Earth", modality: "Cardinal",
      organs: ["Skeleton", "Joints", "Knies", "Teeth", "Skin"],
      finances: "Pragmatic focus on long-term stabilization. Good for perfectly conservative regulated investments.",
      relationships: "Secure relations ruled by duty and lasting fidelity. Low tolerance for melodramas and childishness.",
      health: "Supplement calcium, collagen, and take good care of joints and teeth. Take walks with firm soles.",
      beauty: "Favors sober, classic, elegant, and professional haircuts. Great for toning the body dermis."
    },
    es: {
      element: "Tierra", modality: "Cardinal",
      organs: ["Esqueleto", "Articulaciones", "Rodillas", "Dientes", "Piel"],
      finances: "Enfoque pragmático en la estabilización a largo plazo. Bueno para inversiones perfectamente conservadoras y reguladas.",
      relationships: "Relaciones seguras basadas en el deber y la fidelidad duradera. Poca tolerancia a melodramas e infantilidades.",
      health: "Suplemente calcio, colágeno y cuide bien las articulaciones y dientes. Realice caminatas de suela firme.",
      beauty: "Favorece cortes de cabello sobrios, clásicos, elegantes y profesionales. Excelente para tonificar la dermis corporal."
    },
    de: {
      element: "Erde", modality: "Cardinal",
      organs: ["Skelett", "Gelenke", "Knie", "Zähne", "Haut"],
      finances: "Pragmatischer Fokus auf langfristige Stabilisierung. Gut für absolut konservative, regulierte Anlagen.",
      relationships: "Sichere Beziehungen, geprägt von Pflichtbewusstsein und dauerhafter Treue. Geringe Toleranz für Melodramen und Kindereien.",
      health: "Ergänzen Sie Kalzium und Kollagen und pflegen Sie Gelenke und Zähne gut. Machen Sie Spaziergänge mit festen Sohlen.",
      beauty: "Begünstigt schlichte, klassische, elegante und professionelle Haarschnitte. Großartig zur Straffung der Körperhaut."
    },
    fr: {
      element: "Terre", modality: "Cardinal",
      organs: ["Squelette", "Articulations", "Genoux", "Dents", "Peau"],
      finances: "Focus pragmatique sur la stabilisation à long terme. Idéal pour des investissements parfaitement conservateurs et réglementés.",
      relationships: "Relations sécurisantes fondées sur le devoir et la fidélité durable. Peu de tolérance pour les mélodrames et les enfantillages.",
      health: "Supplémenez en calcium, collagène et prenez soin des articulations et des dents. Faites des marches d'un pas ferme.",
      beauty: "Favorise les coupes de cheveux sobres, classiques, élégantes et professionnelles. Excellent pour tonifier le derme."
    }
  },
  "Aquário": {
    pt: {
      element: "Ar", modality: "Fixed",
      organs: ["Panturrilhas", "Canelas", "Tornozelos", "Sistema Vascular"],
      finances: "Vanguarda de ideias. Ótimo para adquirir sistemas de software úteis, novas tecnologias e subscrever utilidades.",
      relationships: "Sintonia de amizade madura, mútuo respeito pelos espaços individuais e conversas livres sem cobranças.",
      health: "A circulação nas pernas pede atenção. Faça escalda-pés e eleve as pernas ao fim do dia.",
      beauty: "Fase espetacular para ousar em cortes futuristas, colorações exóticas originais e franjas expressivas."
    },
    en: {
      element: "Air", modality: "Fixed",
      organs: ["Calves", "Shins", "Ankles", "Vascular System"],
      finances: "Vanguard of ideas. Great for acquiring useful software systems, new technologies, and subscribing to utilities.",
      relationships: "Harmony of mature friendship, mutual respect for individual spaces, and free talk without demands.",
      health: "Leg circulation demands attention. Take foot baths and elevate legs at the end of the day.",
      beauty: "Spectacular phase for daring futuristic cuts, original exotic colorings, and expressive bangs."
    },
    es: {
      element: "Aire", modality: "Fixed",
      organs: ["Pantorrillas", "Espinillas", "Tobillos", "Sistema Vascular"],
      finances: "Vanguardia de ideas. Excelente para adquirir sistemas de software útiles, nuevas tecnologías y suscribir utilidades.",
      relationships: "Sintonía de amistad madura, mutuo respeto por los espacios individuales y conversaciones libres sin exigencias.",
      health: "La circulación en las piernas pide atención. Realice baños de pies y eleve las piernas al final del día.",
      beauty: "Fase espectacular para atreverse con cortes futuristas, coloraciones exóticas originales y flequillos expresivos."
    },
    de: {
      element: "Luft", modality: "Fixed",
      organs: ["Waden", "Schienbeine", "Knöchel", "Gefäßsystem"],
      finances: "Vorreiterrolle bei Ideen. Großartig für den Erwerb nützlicher Softwaresysteme, neuer Technologien und den Bezug von Dienstleistungen.",
      relationships: "Harmonie reifer Freundschaft, gegenseitiger Respekt für individuelle Freiräume und freie Gespräche ohne Forderungen.",
      health: "Die Durchblutung der Beine verlangt Aufmerksamkeit. Machen Sie Fußbäder und legen Sie am Ende des Tages die Beine hoch.",
      beauty: "Spektakuläre Phase für gewagte futuristische Schnitte, originelle exotische Farben und ausdrucksstarke Ponys."
    },
    fr: {
      element: "Air", modality: "Fixed",
      organs: ["Mollets", "Tibias", "Chevilles", "Système Vasculaire"],
      finances: "Avant-garde d'idées. Idéal pour acquérir des logiciels utiles, des nouvelles technologies et s'abonner à des services.",
      relationships: "Harmonie d'amitié mûre, respect mutuel des espaces individuels et conversations libres sans exigences.",
      health: "La circulation dans les jambes demande de l'attention. Faites des bains de pieds et surélevez les jambes en fin de journée.",
      beauty: "Phase spectaculaire pour oser des coupes futuristes, des colorations exotiques originales et des franges expressives."
    }
  },
  "Peixes": {
    pt: {
      element: "Água", modality: "Mutable",
      organs: ["Pés", "Dedos dos Pés", "Sistema Linfático", "Gânglios"],
      finances: "Dia de guiar-se por vozes internas de intuição comercial. Período próspero para caridade, doações e resgates.",
      relationships: "Sintonia poética e sentimentos espirituais sublimes. Forte ligação telepática e perdões restauradores.",
      health: "A imunidade e o labirinto linfático demandam cuidado. Pratique escalda-pés curativos com sal grosso e ervas.",
      beauty: "Dia ideal para massagens relaxantes podais (reflexologia), hidratações suaves com óleos essenciais de lavanda."
    },
    en: {
      element: "Water", modality: "Mutable",
      organs: ["Feet", "Toes", "Lymphatic System", "Lymph Nodes"],
      finances: "Day to guide yourself by inner commercial intuition voices. Prosperous period for charity, donations, and rescues.",
      relationships: "Poetic harmony and sublime spiritual feelings. Strong telepathic connection and restoring forgiveness.",
      health: "Immunity and lymphatic system demand care. Practice healing foot baths with coarse salt and herbs.",
      beauty: "Ideal day for relaxing foot massages (reflexology), gentle hydration with lavender essential oils."
    },
    es: {
      element: "Agua", modality: "Mutable",
      organs: ["Pies", "Dedos de los Pies", "Sistema Linfático", "Ganglios"],
      finances: "Día para guiarse por voces internas de intuición comercial. Período próspero para caridad, donaciones y rescates.",
      relationships: "Sintonía poética y sentimientos espirituales sublimes. Fuerte conexión telepática y perdones restauradores.",
      health: "La inmunidad y el laberinto linfático demandan cuidado. Practique baños de pies curativos con sal gruesa y hierbas.",
      beauty: "Día ideal para masajes relajantes de pies (reflexología), hidrataciones suaves con aceites esenciales de lavanda."
    },
    de: {
      element: "Wasser", modality: "Mutable",
      organs: ["Füße", "Zehen", "Lymphsystem", "Lymphknoten"],
      finances: "Tag, um sich von der inneren geschäftlichen Intuition leiten zu lassen. Wohlhabende Zeit für wohltätige Zwecke, Spenden und Hilfe.",
      relationships: "Poetische Harmonie und erhabene spirituelle Gefühle. Starke telepathische Verbindung und erholsame Vergebung.",
      health: "Immunsystem und Lymphsystem verlangen Aufmerksamkeit. Praktizieren Sie heilende Fußbäder mit grobem Salz und Kräutern.",
      beauty: "Idealer Tag für entspannende Fußmassagen (Reflexzonenmassage), sanfte Feuchtigkeitspflege mit ätherischen Lavendelölen."
    },
    fr: {
      element: "Eau", modality: "Mutable",
      organs: ["Pieds", "Orteils", "Système Lymphatique", "Ganglions"],
      finances: "Journée pour se laisser guider par l'instinct commercial intérieur. Période propice à la charité, aux dons et au réconfort.",
      relationships: "Harmonie poétique et sentiments spirituels sublimes. Forte connexion télépathique et pardons réparateurs.",
      health: "L'immunité et le système lymphatique demandent du soin. Pratiquez des bains de pieds thérapeutiques au gros sel et aux herbes.",
      beauty: "Jour idéal pour les massages podaux relaxants (réflexologie), les hydratations douces aux huiles essentielles de lavande."
    }
  }
};

export const LOCAL_UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  "Sintonização Gravitacional Universal": {
    pt: "Sintonização Gravitacional Universal",
    en: "Universal Gravitational Tuning",
    es: "Sintonización Gravitacional Universal",
    de: "Universelle Gravitationsabstimmung",
    fr: "Harmonisation Gravitationnelle Universelle"
  },
  "Ciclo Lunar em Tempo Real": {
    pt: "Ciclo Lunar em Tempo Real",
    en: "Real-Time Lunar Cycle",
    es: "Ciclo Lunar en Tiempo Real",
    de: "Mondzyklus in Echtzeit",
    fr: "Cycle Lunaire en Temps Réel"
  },
  "★ Livre - Acesso Ilimitado": {
    pt: "★ Livre - Acesso Ilimitado",
    en: "★ Free - Unlimited Access",
    es: "★ Gratis - Acceso Ilimitado",
    de: "★ Kostenlos - Unbegrenzter Zugriff",
    fr: "★ Gratuit - Accès Illimité"
  },
  "Olá,": {
    pt: "Olá,",
    en: "Hello,",
    es: "Hola,",
    de: "Hallo,",
    fr: "Bonjour,"
  },
  "Sol em": {
    pt: "Sol em",
    en: "Sun in",
    es: "Sol en",
    de: "Sonne in",
    fr: "Soleil en"
  },
  "Ascendente em": {
    pt: "Ascendente em",
    en: "Ascendant in",
    es: "Ascendente en",
    de: "Aszendent in",
    fr: "Ascendant en"
  },
  "O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu para o seu mapa pessoal.": {
    pt: "O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu para o seu mapa pessoal.",
    en: "The lunar gravitational rhythm dictates the movement of tides and governs short-term biological biorhythms. This module calculates in real-time, through integrated geocentric ephemerides, the exact position of the Moon in the sky for your personal chart.",
    es: "El ritmo gravitacional lunar dicta el movimiento de las mareas y rige los biorritmos biológicos a corto plazo. Este módulo calcula en tiempo real, mediante efemérides geocéntricas integradas, la posición exacta de la Luna en el cielo para tu carta personal.",
    de: "Der gravitative Rhythmus des Mondes bestimmt die Bewegung der Gezeiten und steuert kurzfristige biologische Biorhythmen. Dieses Modul berechnet in Echtzeit über integrierte geozentrische Ephemeriden die genaue Position des Mondes am Himmel für Ihr persönliches Horoskop.",
    fr: "Le rythme gravitationnel lunaire dicte le mouvement des marées et régit les biorythmes biologiques à court terme. Ce module calcule en temps réel, grâce à des éphémérides géocentriques intégrées, la position exacte de la Lune dans le ciel pour votre carte personnelle."
  },
  "O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu.": {
    pt: "O ritmo gravitacional lunar dita o movimento das marés e rege os biorritmos biológicos de curto curso. Este módulo calcula em tempo real, através de efemérides geocêntricas integradas, a exata posição da Lua no céu.",
    en: "The lunar gravitational rhythm dictates the movement of tides and governs short-term biological biorhythms. This module calculates in real-time, through integrated geocentric ephemerides, the exact position of the Moon in the sky.",
    es: "El ritmo gravitacional lunar dicta el movimiento de las mareas y rige los biorritmos biológicos a corto plazo. Este módulo calcula en tiempo real, mediante efemérides geocéntricas integradas, la posición exacta de la Luna en el cielo.",
    de: "Der gravitative Rhythmus des Mondes bestimmt die Bewegung der Gezeiten und steuert kurzfristige biologische Biorhythmen. Dieses Modul berechnet in Echtzeit über integrierte geozentrische Ephemeriden die genaue Position des Mondes am Himmel.",
    fr: "Le rythme gravitationnel lunaire dicte le mouvement des marées et régit les biorythmes biologiques à court terme. Ce module calcule en temps réel, grâce à des éphémérides géocentriques intégrées, la position exacte de la Lune dans le ciel."
  },
  "Crie seu mapa astral para desbloquear análises personalizadas e preencha seus dados para iniciar sua jornada.": {
    pt: "Crie seu mapa astral para desbloquear análises personalizadas e preencha seus dados para iniciar sua jornada.",
    en: "Create your birth chart to unlock personalized analyses and fill in your details to start your journey.",
    es: "Crea tu carta natal para desbloquear análisis personalizados y completa tus datos para iniciar tu viaje.",
    de: "Erstellen Sie Ihr Geburtshoroskop, um personalisierte Analysen freizuschalten, und geben Sie Ihre Daten ein, um Ihre Reise zu beginnen.",
    fr: "Créez votre carte du ciel pour débloquer des analyses personnalisées et renseignez vos informations pour commencer votre voyage."
  },
  "HOJE CORRENTE": {
    pt: "HOJE CORRENTE",
    en: "CURRENT TODAY",
    es: "HOY CORRIENTE",
    de: "AKTUELLER HEUTE",
    fr: "AUJOURD'HUI COURANT"
  },
  "FUTUROS CÍCLICOS": {
    pt: "FUTUROS CÍCLICOS",
    en: "CYCLICAL FUTURES",
    es: "FUTUROS CÍCLICOS",
    de: "ZYKLISCHE ZUKUNFT",
    fr: "FUTURS CYCLIQUES"
  },
  "➔ Tempo Real Ativo": {
    pt: "➔ Tempo Real Ativo",
    en: "➔ Active Real-Time",
    es: "➔ Tiempo Real Activo",
    de: "➔ Echtzeit Aktiv",
    fr: "➔ Temps Réel Actif"
  },
  "⊙ Sincronizar Tempo Real": {
    pt: "⊙ Sincronizar Tempo Real",
    en: "⊙ Sync Real-Time",
    es: "⊙ Sincronizar Tempo Real",
    de: "⊙ Echtzeit Synchronisieren",
    fr: "⊙ Synchroniser Temps Réel"
  },
  "Painel de Sintonização de Coordenadas": {
    pt: "Painel de Sintonização de Coordenadas",
    en: "Coordinate Tuning Panel",
    es: "Panel de Sintonización de Coordenadas",
    de: "Koordinatenabstimmungs-Panel",
    fr: "Panneau d'Harmonisation des Coordonnées"
  },
  "Hora atual:": {
    pt: "Hora atual:",
    en: "Current time:",
    es: "Hora actual:",
    de: "Aktuelle Uhrzeit:",
    fr: "Heure actuelle :"
  },
  "Resetar P/ Agora": {
    pt: "Resetar P/ Agora",
    en: "Reset to Now",
    es: "Restablecer a Ahora",
    de: "Auf Jetzt Zurücksetzen",
    fr: "Réinitialiser à Maintenant"
  },
  "Fase Astronomia Real": {
    pt: "Fase Astronomia Real",
    en: "Real Astronomy Phase",
    es: "Fase de Astronomía Real",
    de: "Echte Astronomiephase",
    fr: "Phase d'Astronomie Réelle"
  },
  "iluminada": {
    pt: "iluminada",
    en: "illuminated",
    es: "iluminada",
    de: "beleuchtet",
    fr: "illuminée"
  },
  "Duração Real": {
    pt: "Duração Real",
    en: "Real Duration",
    es: "Duración Real",
    de: "Echte Dauer",
    fr: "Durée Réelle"
  },
  "A Lua está posicionada nos exatos": {
    pt: "A Lua está posicionada nos exatos",
    en: "The Moon is positioned at the exact",
    es: "La Luna está posicionada en los exactos",
    de: "Der Mond befindet sich in den exakten",
    fr: "La Lune est positionnée à l'exact"
  },
  "de": {
    pt: "de",
    en: "of",
    es: "de",
    de: "von",
    fr: "de"
  },
  "em": {
    pt: "em",
    en: "in",
    es: "en",
    de: "in",
    fr: "en"
  },
  "Elemento de": {
    pt: "Elemento de",
    en: "Element of",
    es: "Elemento de",
    de: "Element von",
    fr: "Élément de"
  },
  "Vetores de Impacto Diário: Lua em": {
    pt: "Vetores de Impacto Diário: Lua em",
    en: "Daily Impact Vectors: Moon in",
    es: "Vectores de Impacto Diario: Luna en",
    de: "Tägliche Einflussvektoren: Mond in",
    fr: "Vecteurs d'Impact Quotidien : Lune en"
  },
  "$ Finanças": {
    pt: "$ Finanças",
    en: "$ Finances",
    es: "$ Finanzas",
    de: "$ Finanzen",
    fr: "$ Finances"
  },
  "♥ Relacionamentos": {
    pt: "♥ Relacionamentos",
    en: "♥ Relationships",
    es: "♥ Relaciones",
    de: "♥ Beziehungen",
    fr: "♥ Relations"
  },
  "✚ Saúde e Bem-estar": {
    pt: "✚ Saúde e Bem-estar",
    en: "✚ Health & Well-being",
    es: "✚ Salud y Bienestar",
    de: "✚ Gesundheit & Wohlbefinden",
    fr: "✚ Santé et Bien-être"
  },
  "✦ Beleza e Autocuidado": {
    pt: "✦ Beleza e Autocuidado",
    en: "✦ Beauty & Self-care",
    es: "✦ Belleza y Autocuidado",
    de: "✦ Schönheit & Selbstpflege",
    fr: "✦ Beauté et Soin de Soi"
  },
  "Calendário de Transições Celestiais Próximas": {
    pt: "Calendário de Transições Celestiais Próximas",
    en: "Upcoming Celestial Transitions Calendar",
    es: "Calendario de Próximas Transiciones Celestiales",
    de: "Kalender der Bevorstehenden Himmlischen Übergänge",
    fr: "Calendrier des Prochaines Transitions Célestes"
  },
  "Próximos cruzamentos astronômicos de fases (com precisão de 15 minutos):": {
    pt: "Próximos cruzamentos astronômicos de fases (com precisão de 15 minutos):",
    en: "Next astronomical phase crossings (with 15-minute precision):",
    es: "Próximos cruces astronómicos de fases (con precisión de 15 minutos):",
    de: "Nächste astronomische Phasenübergänge (mit einer Präzision von 15 Minuten):",
    fr: "Prochains croisements de phases astronomiques (avec une précision de 15 minutes) :"
  },
  "às": {
    pt: "às",
    en: "at",
    es: "a las",
    de: "um",
    fr: "à"
  },
  "Sintonizar": {
    pt: "Sintonizar",
    en: "Tune",
    es: "Sintonizar",
    de: "Einstellen",
    fr: "Harmoniser"
  },
  "Órgãos Mais Sensíveis Hoje": {
    pt: "Órgãos Mais Sensíveis Hoje",
    en: "Most Sensitive Organs Today",
    es: "Órganos Más Sensibles Hoy",
    de: "Empfindlichste Organe Heute",
    fr: "Organes les Plus Sensibles Aujourd'hui"
  },
  "Suscetibilidade anatômica regida pela Lua em": {
    pt: "Suscetibilidade anatômica regida pela Lua em",
    en: "Anatomical susceptibility governed by the Moon in",
    es: "Susceptibilidad anatómica regida por la Luna en",
    de: "Anatomische Anfälligkeit, geregelt durch den Mond in",
    fr: "Sensibilité anatomique régie par la Lune en"
  },
  "regência": {
    pt: "regência",
    en: "rulership",
    es: "regencia",
    de: "Herrschaft",
    fr: "maîtrise"
  },
  "Alerta Clínico:": {
    pt: "Alerta Clínico:",
    en: "Clinical Alert:",
    es: "Alerta Clínico:",
    de: "Klinischer Warnhinweis:",
    fr: "Alerte Clinique :"
  },
  "Segundo as regras clássicas de astrologia médica, evite marcações de cirurgias pesadas e invasões diretas nos órgãos sensíveis do signo transitado hoje para evitar desgastes prolongados.": {
    pt: "Segundo as regras clássicas de astrologia médica, evite marcações de cirurgias pesadas e invasões diretas nos órgãos sensíveis do signo transitado hoje para evitar desgastes prolongados.",
    en: "According to classic rules of medical astrology, avoid scheduling major surgeries and direct invasions of the sensitive organs of today's transited sign to prevent prolonged wear and tear.",
    es: "Según las reglas clásicas de la astrología médica, evite programar cirugías mayores e invasiones directas en los órganos sensibles del signo transitado hoy para prevenir un desgaste prolongado.",
    de: "Nach den klassischen Regeln der medizinischen Astrologie sollten Sie die Planung größerer Operationen und direkter Eingriffe in die empfindlichen Organe des heute durchwanderten Zeichens vermeiden, um einen längeren Verschleiß zu verhindern.",
    fr: "Selon les règles classiques de l'astrologie médicale, évitez de planifier des chirurgies lourdes et des interventions directes sur les organes sensibles du signe transité aujourd'hui afin d'éviter une fatigue prolongée."
  },
  "Interações de Trânsitos Com Seus Astros": {
    pt: "Interações de Trânsitos Com Seus Astros",
    en: "Transit Interactions With Your Stars",
    es: "Interacciones de Tránsitos Con Sus Astros",
    de: "Transit-Interaktionen Mit Ihren Sternen",
    fr: "Interactions des Transits Avec Vos Astres"
  },
  "Cotejo Natal:": {
    pt: "Cotejo Natal:",
    en: "Natal Comparison:",
    es: "Comparación Natal:",
    de: "Geburtsvergleich:",
    fr: "Comparaison Natale :"
  },
  "✓ Oportunidades": {
    pt: "✓ Oportunidades",
    en: "✓ Opportunities",
    es: "✓ Oportunidades",
    de: "✓ Chancen",
    fr: "✓ Opportunités"
  },
  "✗ Desafios / Evitar": {
    pt: "✗ Desafios / Evitar",
    en: "✗ Challenges / Avoid",
    es: "✗ Desafíos / Evitar",
    de: "✗ Herausforderungen / Vermeiden",
    fr: "✗ Défis / Éviter"
  },
  "Calendário Lunar Interativo Projetado": {
    pt: "Calendário Lunar Interativo Projetado",
    en: "Projected Interactive Lunar Calendar",
    es: "Calendario Lunar Interactivo Proyectado",
    de: "Projizierter Interaktiver Mondkalender",
    fr: "Calendrier Lunaire Interactif Projeté"
  },
  "Role ou transite os dias para antecipar trânsitos, marés emocionais e favorabilidades celestes.": {
    pt: "Role ou transite os dias para antecipar trânsitos, marés emocionais e favorabilidades celestes.",
    en: "Scroll or transit days to anticipate transits, emotional tides, and celestial favorability.",
    es: "Desplácese o transite los días para anticipar tránsitos, mareas emocionales y favorabilidad celestial.",
    de: "Scrollen oder wechseln Sie die Tage, um Transite, emotionale Gezeiten und himmlische Begünstigungen vorherzusehen.",
    fr: "Faites défiler ou naviguez parmi les jours pour anticiper les transits, les marées émotionnelles et les faveurs célestes."
  },
  "7 Dias": {
    pt: "7 Dias",
    en: "7 Days",
    es: "7 Días",
    de: "7 Tage",
    fr: "7 Jours"
  },
  "30 Dias": {
    pt: "30 Dias",
    en: "30 Days",
    es: "30 Días",
    de: "30 Tage",
    fr: "30 Jours"
  },
  "3 Meses": {
    pt: "3 Meses",
    en: "3 Months",
    es: "3 Meses",
    de: "3 Monate",
    fr: "3 Mois"
  },
  "Filiamento Harmônico (Trítono/Elemento)": {
    pt: "Filiamento Harmônico (Trítono/Elemento)",
    en: "Harmonic Affiliation (Trine/Element)",
    es: "Afiliación Armónica (Trígono/Elemento)",
    de: "Harmonische Zugehörigkeit (Trigon/Element)",
    fr: "Affiliation Harmonique (Trigone/Élément)"
  },
  "Dia de Atenção (Fricção Modabilidade)": {
    pt: "Dia de Atenção (Fricção Modabilidade)",
    en: "Attention Day (Modality Friction)",
    es: "Día de Atención (Fricción de Modalidad)",
    de: "Aufmerksamkeitstag (Modalitätsreibung)",
    fr: "Jour de Vigilance (Friction de Modalité)"
  },
  "Dia Ativamente Selecionado": {
    pt: "Dia Ativamente Selecionado",
    en: "Actively Selected Day",
    es: "Día Activamente Seleccionado",
    de: "Aktiv Ausgewählter Tag",
    fr: "Jour Activement Sélectionné"
  },
  "Símbolos e Ciências das 8 Lunações Clássicas": {
    pt: "Símbolos e Ciências das 8 Lunações Clássicas",
    en: "Symbols and Sciences of the 8 Classic Lunations",
    es: "Símbolos y Ciencias de las 8 Lunaciones Clásicas",
    de: "Symbole und Wissenschaften der 8 Klassischen Lunationen",
    fr: "Symboles et Sciences des 8 Lunaisons Classiques"
  },
  "OCULTAR ▲": {
    pt: "OCULTAR ▲",
    en: "HIDE ▲",
    es: "OCULTAR ▲",
    de: "AUSBLENDEN ▲",
    fr: "MASQUER ▲"
  },
  "DETALHES ▼": {
    pt: "DETALHES ▼",
    en: "DETAILS ▼",
    es: "DETALLES ▼",
    de: "DETAILS ▼",
    fr: "DÉTAILS ▼"
  },
  "Relógio Sincro": {
    pt: "Relógio Sincro",
    en: "Synced Clock",
    es: "Reloj Sincronizado",
    de: "Synchrone Uhr",
    fr: "Horloge Synchronisée"
  }
};
