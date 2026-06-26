import { Language } from './translations';

export interface LocalizedNodeSign {
  southNode: string;
  description: string;
  lesson: string;
  avoid: string;
  embrace: string;
}

export const NODE_SIGNS_LOCALIZED: Record<Language, Record<string, LocalizedNodeSign>> = {
  pt: {
    'Áries': {
      southNode: 'Libra',
      description: 'Caminho de autoafirmação e coragem pessoal, saindo da dependência absoluta e da necessidade constante de agradar os outros.',
      lesson: 'Aprender a dizer não e defender sua individualidade, sem medo do conflito construtivo.',
      avoid: 'Indecisão, anulação pessoal para manter a paz vazia e codependência.',
      embrace: 'Iniciativa pessoal, autonomia mental e a coragem de ser pioneiro.'
    },
    'Touro': {
      southNode: 'Escorpião',
      description: 'Caminho de autossuficiência, estabilidade e pacificação material, saindo das crises emocionais cíclicas e do apego ao caos alheio.',
      lesson: 'Desenvolver valores sólidos e paz de espírito nas coisas simples da vida.',
      avoid: 'Paranoia, obsessão por transformações dramáticas, vinganças sutis e pânico do abandono.',
      embrace: 'Construção constante, serenidade interior, gratidão física e tranquilidade.'
    },
    'Gêmeos': {
      southNode: 'Sagitário',
      description: 'Caminho do aprendizado prático, da mente aberta e do diálogo cotidiano, saindo do dogmatismo intelectual e de verdades absolutas.',
      lesson: 'Escutar o ambiente ao redor e comunicar-se de forma leve e humilde.',
      avoid: 'Soberba intelectual, fanatismo ideológico e dispersão irresponsável no estrangeiro.',
      embrace: 'Curiosidade infantil, trocas de ideias locais, flexibilidade e leitura atenta.'
    },
    'Câncer': {
      southNode: 'Capricórnio',
      description: 'Caminho de acolhimento emocional, nutrição íntima e sensibilidade, saindo da frieza rígida do status ou cobranças profissionais.',
      lesson: 'Reconhecer suas fragilidades, amar o seu lar e cultivar seu mundo interior.',
      avoid: 'Controlar tudo pela via financeira, repressão do choro e ambição fria desumanizante.',
      embrace: 'Vulnerabilidade sincera, acolhimento dos sentimentos e proteção à família.'
    },
    'Leão': {
      southNode: 'Aquário',
      description: 'Caminho da expressão criativa individual, brilho nos palcos e liderança expressiva, saindo do anonimato dos grupos e friezas coletivas.',
      lesson: 'Assumir o centro de sua própria vida com generosidade e calor humano.',
      avoid: 'Se esconder no meio de multidões, alienação emocional e rebeldia sem propósito real.',
      embrace: 'Confiança na própria arte, carisma alegre e aplauso sincero aos outros.'
    },
    'Virgem': {
      southNode: 'Peixes',
      description: 'Caminho da praticidade diária, organização consciente e serviço útil, saindo do escapismo, da fantasia caótica e de sacrifícios vagos.',
      lesson: 'Ancorar-se na rotina, cuidar da saúde biológica e organizar suas frentes de vida.',
      avoid: 'Vitimizar-se, ilusão mística desregrada e procrastinação por medo de falhar.',
      embrace: 'Atenção aos detalhes práticos, disciplina diária sadia e discernimento racional.'
    },
    'Libra': {
      southNode: 'Áries',
      description: 'Caminho da diplomacia, parcerias justas e convivência pacífica, saindo do individualismo agressivo e da impulsividade impaciente.',
      lesson: 'Enxergar o ponto de vista do outro e cooperar com harmonia e elegância artística.',
      avoid: 'Competitividade amarga, irritação com as necessidades alheias e egoísmo bruto.',
      embrace: 'Escuta ativa, mediação de conflitos, justiça social e relações harmoniosas.'
    },
    'Escorpião': {
      southNode: 'Touro',
      description: 'Caminho de regeneração inconsciente, desapego material e intimidade sagrada, saindo do acúmulo possessivo e da inércia material.',
      lesson: 'Encarar crises como renovações cósmicas de alma e confiar na intuição oculta.',
      avoid: 'Preguiça de lidar com a sombra própria, teimosia material e possessividade extrema.',
      embrace: 'Psicologia sutil, espiritualidade corajosa, magnetismo íntimo e entrega.'
    },
    'Sagitário': {
      southNode: 'Gêmeos',
      description: 'Caminho da sabedoria superior, filosofia expandida e fé inspiradora, saindo do excesso de detalhes informativos vazios e fofocas locais.',
      lesson: 'Buscar o sentido maior das coisas e confiar em um propósito de vida integrado.',
      avoid: 'Meticulosidade excessiva, superficialidade, tagarelice fútil e dualidades mentais.',
      embrace: 'Estudos superiores, espiritualidade expansiva, voos altos e otimismo real.'
    },
    'Capricórnio': {
      southNode: 'Câncer',
      description: 'Caminho da autoridade pessoal, responsabilidade social e maturidade prática, saindo da infantilidade, chantagens de afeto e dependência emocional.',
      lesson: 'Edificar sua carreira com base no esforço próprio e estabilizar as bases reais de vida.',
      avoid: 'Chantagens emocionais, vitimização do passado e medo de assumir compromissos adultos.',
      embrace: 'Liderança firme, paciência de longo prazo, mérito pessoal e solidez.'
    },
    'Aquário': {
      southNode: 'Leão',
      description: 'Caminho de cooperação humanitária, visão de vanguarda e partilha social, saindo do orgulho egocêntrico e da ânsia constante de atenção pessoal.',
      lesson: 'Colocar sua inteligência sutil a serviço das transformações coletivas.',
      avoid: 'Orgulho ferido por falta de curtidas ou aplausos, arrogância e individualismo cego.',
      embrace: 'Amizades libertadoras, causas humanitárias, ideais de futuro e fraternidade.'
    },
    'Peixes': {
      southNode: 'Virgem',
      description: 'Caminho de entrega espiritual, amor universal e compaixão cósmica, saindo do ceticismo excessivo, estresse por controle de detalhes e perfeccionismo autodestrutivo.',
      lesson: 'Saber fluir no mistério espiritual e confiar no plano sutil divino.',
      avoid: 'Julgamento neurótico de pequenas falhas, hipocondria, crítica ácida e apego excessivo a regras rígidas.',
      embrace: 'Intuição, artes místicas, meditação, perdão absoluto e flexibilidade amorosa.'
    }
  },
  en: {
    'Áries': {
      southNode: 'Libra',
      description: 'Path of self-assertion and personal courage, moving away from absolute dependency and the constant need to please others.',
      lesson: 'Learn to say no and stand up for your individuality, without fear of constructive conflict.',
      avoid: 'Indecision, self-annihilation to keep empty peace, and codependency.',
      embrace: 'Personal initiative, mental autonomy, and the courage to be a pioneer.'
    },
    'Touro': {
      southNode: 'Scorpio',
      description: 'Path of self-sufficiency, stability, and material peace, moving out of cyclical emotional crises and attachment to others\' chaos.',
      lesson: 'Develop solid values and peace of mind in the simple things of life.',
      avoid: 'Paranoia, obsession with dramatic transformations, subtle revenges, and panic of abandonment.',
      embrace: 'Steady building, inner serenity, physical gratitude, and tranquility.'
    },
    'Gêmeos': {
      southNode: 'Sagittarius',
      description: 'Path of practical learning, open mind, and everyday dialogue, leaving intellectual dogmatism and absolute truths.',
      lesson: 'Listen to the environment around you and communicate in a light, humble way.',
      avoid: 'Intellectual arrogance, ideological fanaticism, and irresponsible dispersion abroad.',
      embrace: 'Childlike curiosity, local exchange of ideas, flexibility, and attentive reading.'
    },
    'Câncer': {
      southNode: 'Capricorn',
      description: 'Path of emotional welcoming, intimate nurturing, and sensitivity, moving away from the cold rigidity of status or professional demands.',
      lesson: 'Recognize your frailties, love your home, and cultivate your inner world.',
      avoid: 'Controlling everything through money, suppressing tears, and dehumanizing cold ambition.',
      embrace: 'Sincere vulnerability, welcoming feelings, and protecting the family.'
    },
    'Leão': {
      southNode: 'Aquarius',
      description: 'Path of individual creative expression, shining on stage, and expressive leadership, leaving behind the anonymity of groups and collective coldness.',
      lesson: 'Take center stage in your own life with generosity and human warmth.',
      avoid: 'Hiding in crowds, emotional alienation, and rebellion without a real purpose.',
      embrace: 'Confidence in your own art, joyful charisma, and sincere applause for others.'
    },
    'Virgem': {
      southNode: 'Pisces',
      description: 'Path of daily practicality, conscious organization, and useful service, leaving behind escapism, chaotic fantasy, and vague sacrifices.',
      lesson: 'Anchor yourself in the routine, care for biological health, and organize your areas of life.',
      avoid: 'Playing the victim, uncontrolled mystical illusion, and procrastination for fear of failing.',
      embrace: 'Attention to practical details, healthy daily discipline, and rational discernment.'
    },
    'Libra': {
      southNode: 'Aries',
      description: 'Path of diplomacy, fair partnerships, and peaceful coexistence, moving away from aggressive individualism and impatient impulsiveness.',
      lesson: 'See the other\'s point of view and cooperate with harmony and artistic elegance.',
      avoid: 'Bitter competitiveness, irritation with others\' needs, and raw selfishness.',
      embrace: 'Active listening, conflict mediation, social justice, and harmonious relationships.'
    },
    'Escorpião': {
      southNode: 'Taurus',
      description: 'Path of deep subconscious regeneration, material detachment, and sacred intimacy, moving out of possessive accumulation and material inertia.',
      lesson: 'Face crises as cosmic renewals of the soul and trust your hidden intuition.',
      avoid: 'Laziness in dealing with one\'s own shadow, material stubbornness, and extreme possessiveness.',
      embrace: 'Subtle psychology, brave spirituality, intimate magnetism, and surrender.'
    },
    'Sagitário': {
      southNode: 'Gemini',
      description: 'Path of higher wisdom, expanded philosophy, and inspiring faith, leaving behind excess of empty information details and local gossip.',
      lesson: 'Seek the greater meaning of things and trust in an integrated life purpose.',
      avoid: 'Excessive meticulousness, superficiality, futile chatter, and mental dualities.',
      embrace: 'Higher studies, expansive spirituality, high flights, and real optimism.'
    },
    'Capricórnio': {
      southNode: 'Cancer',
      description: 'Path of personal authority, social responsibility, and practical maturity, moving away from childishness, emotional blackmail, and dependency.',
      lesson: 'Build your career on your own effort and stabilize the real foundations of life.',
      avoid: 'Emotional blackmail, past victimization, and fear of assuming adult commitments.',
      embrace: 'Firm leadership, long-term patience, personal merit, and solidity.'
    },
    'Aquário': {
      southNode: 'Leo',
      description: 'Path of humanitarian cooperation, avant-garde vision, and social sharing, leaving behind egocentric pride and the constant craving for attention.',
      lesson: 'Put your subtle intelligence at the service of collective transformation.',
      avoid: 'Hurt pride from lack of likes or applause, arrogance, and blind individualism.',
      embrace: 'Liberating friendships, humanitarian causes, future ideals, and fraternity.'
    },
    'Peixes': {
      southNode: 'Virgo',
      description: 'Path of spiritual surrender, universal love, and cosmic compassion, leaving behind excessive skepticism, detail-control stress, and self-destructive perfectionism.',
      lesson: 'Know how to flow in the spiritual mystery and trust the divine subtle plan.',
      avoid: 'Neurotic judgment of minor flaws, hypochondria, sharp criticism, and rigid rules.',
      embrace: 'Intuition, mystical arts, meditation, absolute forgiveness, and loving flexibility.'
    }
  },
  es: {
    'Áries': {
      southNode: 'Libra',
      description: 'Camino de autoafirmación y coraje personal, alejándose de la dependencia absoluta y de la necesidad constante de agradar a los demás.',
      lesson: 'Aprender a decir no y defender tu individualidad, sin temor al conflicto constructivo.',
      avoid: 'Indecisión, anulación personal para mantener una paz vacía y codependencia.',
      embrace: 'Iniciativa personal, autonomía mental y el coraje de ser pionero.'
    },
    'Touro': {
      southNode: 'Escorpio',
      description: 'Camino de autosuficiencia, estabilidad y pacificación material, saliendo de las crisis emocionales cíclicas y del apego al caos ajeno.',
      lesson: 'Desarrollar valores sólidos y paz de espíritu en las cosas simples de la vida.',
      avoid: 'Paranoia, obsesión por transformaciones dramáticas, venganzas sutiles y pánico al abandono.',
      embrace: 'Construcción constante, serenidad interior, gratitud física y tranquilidad.'
    },
    'Gêmeos': {
      southNode: 'Sagitario',
      description: 'Camino del aprendizaje práctico, de la mente abierta y del diálogo cotidiano, saliendo del dogmatismo intelectual y de las verdades absolutas.',
      lesson: 'Escuchar el entorno que te rodea y comunicarte de forma ligera y humilde.',
      avoid: 'Soberbia intelectual, fanatismo ideológico y dispersión irresponsable en el extranjero.',
      embrace: 'Curiosidad infantil, intercambios locales de ideas, flexibilidad y lectura atenta.'
    },
    'Câncer': {
      southNode: 'Capricornio',
      description: 'Camino de acogida emocional, nutrición íntima y sensibilidad, alejándose de la frialdad rígida del estatus o las exigencias profesionales.',
      lesson: 'Reconocer tus fragilidades, amar tu hogar y cultivar tu mundo interior.',
      avoid: 'Controlarlo todo por la vía financiera, represión del llanto y ambición fría deshumanizante.',
      embrace: 'Vulnerabilidad sincera, acogida de los sentimientos y protección a la familia.'
    },
    'Leão': {
      southNode: 'Acuario',
      description: 'Camino de expresión creativa individual, brillo en los escenarios y liderazgo expresivo, saliendo del anonimato de los grupos y la frialdad colectiva.',
      lesson: 'Asumir el centro de tu propia vida con generosidad y calor humano.',
      avoid: 'Esconderse en multitudes, alienación emocional y rebeldía sin un propósito real.',
      embrace: 'Confianza en el propio arte, carisma alegre y aplauso sincero a los demás.'
    },
    'Virgem': {
      southNode: 'Piscis',
      description: 'Camino de la practicidad diaria, organización consciente y servicio útil, saliendo del escapismo, la fantasía caótica y los sacrificios vagos.',
      lesson: 'Anclarse en la rutina, cuidar la salud biológica y organizar tus áreas de vida.',
      avoid: 'Victimizarse, ilusión mística desordenada y procrastinación por miedo a fallar.',
      embrace: 'Atención a los detalles prácticos, disciplina diaria sana y discernimiento racional.'
    },
    'Libra': {
      southNode: 'Aries',
      description: 'Camino de la diplomacia, asociaciones justas y convivencia pacífica, alejándose del individualismo agresivo y la impulsividad impaciente.',
      lesson: 'Ver el punto de vista del otro y cooperar con armonía y elegancia artística.',
      avoid: 'Competitividad amarga, irritación con las necesidades ajenas y egoísmo bruto.',
      embrace: 'Escucha activa, mediación de conflictos, justicia social y relaciones armoniosas.'
    },
    'Escorpião': {
      southNode: 'Tauro',
      description: 'Camino de regeneración inconsciente profunda, desapego material e intimidad sagrada, saliendo de la acumulación posesiva y la inercia material.',
      lesson: 'Encarar las crisis como renovaciones cósmicas de alma y confiar en la intuición oculta.',
      avoid: 'Pereza de lidiar con la propia sombra, terquedad material y posesividad extrema.',
      embrace: 'Psicología sutil, espiritualidad valiente, magnetismo íntimo y entrega.'
    },
    'Sagitário': {
      southNode: 'Géminis',
      description: 'Camino de la sabiduría superior, filosofía expandida y fe inspiradora, saliendo del exceso de detalles informativos vacíos y chismes locales.',
      lesson: 'Buscar el sentido mayor de las cosas y confiar en un propósito de vida integrado.',
      avoid: 'Meticulosidad excesiva, superficialidad, palabrería fútil y dualidades mentales.',
      embrace: 'Estudios superiores, espiritualidad expansiva, vuelos altos y optimismo real.'
    },
    'Capricórnio': {
      southNode: 'Cáncer',
      description: 'Camino de la autoridad personal, responsabilidad social y madurez práctica, saliendo de la infantilización, chantajes afectivos y dependencia emocional.',
      lesson: 'Edificar tu carrera en base al esfuerzo propio y estabilizar las bases reales de vida.',
      avoid: 'Chantajes emocionales, victimización del pasado y miedo a asumir compromisos adultos.',
      embrace: 'Liderazgo firme, paciencia a largo plazo, mérito personal y solidez.'
    },
    'Aquário': {
      southNode: 'Leo',
      description: 'Camino de cooperación humanitaria, visión de vanguardia y participación social, saliendo del orgullo egocéntrico y la constante ansia de atención personal.',
      lesson: 'Colocar tu inteligencia sutil al servicio de las transformaciones colectivas.',
      avoid: 'Orgullo herido por falta de me gusta o aplausos, arrogancia e individualismo ciego.',
      embrace: 'Amistades liberadoras, causas humanitarias, ideales de futuro y fraternidad.'
    },
    'Peixes': {
      southNode: 'Virgo',
      description: 'Camino de entrega espiritual, amor universal y compasión cósmica, saliendo del escepticismo excesivo, estrés por control de detalles y perfeccionismo autodestructivo.',
      lesson: 'Saber fluir en el misterio espiritual y confiar en el plano sutil divino.',
      avoid: 'Juicio neurótico de pequeñas fallas, hipocondría, crítica ácida y apego excesivo a reglas rígidas.',
      embrace: 'Intuición, artes místicas, meditación, perdón absoluto y flexibilidad amorosa.'
    }
  },
  de: {
    'Áries': {
      southNode: 'Libra',
      description: 'Weg der Selbstbehauptung und des persönlichen Mutes, weg von absoluter Abhängigkeit und dem ständigen Bedürfnis, es anderen recht zu machen.',
      lesson: 'Lernen Sie, Nein zu sagen und Ihre Individualität zu verteidigen, ohne Angst vor konstruktivem Konflikt.',
      avoid: 'Unentschlossenheit, Selbstaufgabe zur Aufrechterhaltung eines leeren Friedens und Co-Abhängigkeit.',
      embrace: 'Persönliche Initiative, mentale Autonomie und der Mut, ein Pionier zu sein.'
    },
    'Touro': {
      southNode: 'Skorpion',
      description: 'Weg der Selbstgenügsamkeit, Stabilität und materiellen Befriedung, heraus aus zyklischen emotionalen Krisen und dem Anhaften am Chaos anderer.',
      lesson: 'Entwickeln Sie solide Werte und Seelenfrieden in den einfachen Dingen des Lebens.',
      avoid: 'Paranoia, Besessenheit von dramatischen Transformationen, subtile Rache und Panik vor Verlassenwerden.',
      embrace: 'Ständiger Aufbau, innere Gelassenheit, körperliche Dankbarkeit und Ruhe.'
    },
    'Gêmeos': {
      southNode: 'Schütze',
      description: 'Weg des praktischen Lernens, des offenen Geistes und des alltäglichen Dialogs, weg von intellektuellem Dogmatismus und absoluten Wahrheiten.',
      lesson: 'Hören Sie auf die Umgebung um sich herum und kommunizieren Sie auf leichte, bescheidene Weise.',
      avoid: 'Intellektuelle Arroganz, ideologischer Fanatismus und unverantwortliche Zerstreuung im Ausland.',
      embrace: 'Kindliche Neugier, lokaler Gedankenaustausch, Flexibilität und aufmerksames Lesen.'
    },
    'Câncer': {
      southNode: 'Steinbock',
      description: 'Weg des emotionalen Willkommenseins, der intimen Pflege und der Sensibilität, weg von der kalten Starrheit des Status oder der beruflichen Anforderungen.',
      lesson: 'Erkennen Sie Ihre Schwächen an, lieben Sie Ihr Zuhause und pflegen Sie Ihre innere Welt.',
      avoid: 'Alles über Finanzen kontrollieren, Tränen unterdrücken und entmenschlichender, kalter Ehrgeiz.',
      embrace: 'Aufrichtige Verwundbarkeit, emotionale Aufnahme und Schutz der Familie.'
    },
    'Leão': {
      southNode: 'Wassermann',
      description: 'Weg des individuellen kreativen Ausdrucks, des Glänzens auf Bühnen und ausdrucksstarker Führung, weg von der Anonymität der Gruppen und kollektiver Kälte.',
      lesson: 'Übernehmen Sie die Mitte Ihres eigenen Lebens mit Großzügigkeit und menschlicher Wärme.',
      avoid: 'Sich in Menschenmengen verstecken, emotionale Entfremdung und Rebellion ohne wirklichen Zweck.',
      embrace: 'Vertrauen in die eigene Kunst, fröhliches Charisma und aufrichtiger Applaus für andere.'
    },
    'Virgem': {
      southNode: 'Fische',
      description: 'Weg der täglichen Praktikabilität, bewussten Organisation und nützlichen Dienste, weg von Realitätsflucht, chaotischer Fantasie und vagen Opfern.',
      lesson: 'Verankern Sie sich im Alltag, pflegen Sie die biologische Gesundheit und organisieren Sie Ihre Lebensbereiche.',
      avoid: 'Sich als Opfer stilisieren, unkontrollierte mystische Illusionen und Aufschieberitis aus Angst vor dem Scheitern.',
      embrace: 'Aufmerksamkeit für praktische Details, gesunde tägliche Disziplin und rationales Unterscheidungsvermögen.'
    },
    'Libra': {
      southNode: 'Widder',
      description: 'Weg der Diplomatie, fairer Partnerschaften und des friedlichen Zusammenlebens, weg von aggressivem Individualismus und ungeduldiger Impulsivität.',
      lesson: 'Den Standpunkt des anderen sehen und mit Harmonie und künstlerischer Eleganz kooperieren.',
      avoid: 'Bittere Wettbewerbsorientierung, Irritation über die Bedürfnisse anderer und roher Egoismus.',
      embrace: 'Aktives Zuhören, Konfliktvermittlung, soziale Gerechtigkeit und harmonische Beziehungen.'
    },
    'Escorpião': {
      southNode: 'Stier',
      description: 'Weg der tiefen unbewussten Regeneration, der materiellen Loslösung und der heiligen Intimität, weg von besitzergreifender Anhäufung und materieller Trägheit.',
      lesson: 'Betrachten Sie Krisen als kosmische Seelenerneuerungen und vertrauen Sie Ihrer verborgenen Intuition.',
      avoid: 'Trägheit bei der Bewältigung des eigenen Schattens, materielle Sturheit und extreme Besitzgier.',
      embrace: 'Subtile Psychologie, mutige Spiritualität, intimer Magnetismus und Hingabe.'
    },
    'Sagitário': {
      southNode: 'Zwillinge',
      description: 'Weg der höheren Weisheit, erweiterten Philosophie und inspirierenden Glaubens, weg von übermäßigen leeren Informationsdetails und lokalem Klatsch.',
      lesson: 'Suchen Sie nach dem tieferen Sinn der Dinge und vertrauen Sie auf einen integrierten Lebenszweck.',
      avoid: 'Übermäßige Akribie, Oberflächlichkeit, futiles Geschwätz und mentale Dualitäten.',
      embrace: 'Höhere Studien, expansive Spiritualität, hohe Flüge und realer Optimismus.'
    },
    'Capricórnio': {
      southNode: 'Krebs',
      description: 'Weg der persönlichen Autorität, sozialen Verantwortung und praktischen Reife, weg von Kindlichkeit, emotionaler Erpressung und emotionaler Abhängigkeit.',
      lesson: 'Bauen Sie Ihre Karriere auf eigenen Anstrengungen auf und stabilisieren Sie die realen Grundlagen des Lebens.',
      avoid: 'Emotionale Erpressung, Opferrolle der Vergangenheit und Angst vor erwachsenen Verpflichtungen.',
      embrace: 'Feste Führung, langfristige Geduld, persönliches Verdienst und Solidität.'
    },
    'Aquário': {
      southNode: 'Löwe',
      description: 'Weg der humanitären Zusammenarbeit, der Avantgarde-Vision und des sozialen Teilens, weg von egozentrischem Stolz und dem ständigen Verlangen nach persönlicher Aufmerksamkeit.',
      lesson: 'Stellen Sie Ihre feine Intelligenz in den Dienst des kollektiven Wandels.',
      avoid: 'Verletzter Stolz durch mangelnde Likes oder Applaus, Arroganz und blinder Individualismus.',
      embrace: 'Befreiende Freundschaften, humanitäre Anliegen, Zukunftsideale und Brüderlichkeit.'
    },
    'Peixes': {
      southNode: 'Jungfrau',
      description: 'Weg der spirituellen Hingabe, universellen Liebe und kosmischen Mitgefühls, weg von übermäßigem Skeptizismus, Detailkontrollstress und selbstzerstörerischem Perfektionismus.',
      lesson: 'Verstehen Sie es, im spirituellen Geheimnis zu fließen, und vertrauen Sie auf den göttlichen subtilen Plan.',
      avoid: 'Neurotische Verurteilung kleiner Fehler, Hypochondrie, scharfe Kritik und starre Regeln.',
      embrace: 'Intuition, mystische Künste, Meditation, absolute Vergebung und liebevolle Flexibilität.'
    }
  },
  fr: {
    'Áries': {
      southNode: 'Balance',
      description: 'Chemin d\'affirmation de soi et de courage personnel, s\'éloignant de la dépendance absolue et du besoin constant de plaire aux autres.',
      lesson: 'Apprendre à dire non et défendre son individualité, sans crainte du conflit constructif.',
      avoid: 'Indécision, effacement de soi pour maintenir une paix vide, et codépendance.',
      embrace: 'Initiative personnelle, autonomie mentale et le courage d\'être un pionnier.'
    },
    'Touro': {
      southNode: 'Scorpion',
      description: 'Chemin d\'autosuffisance, de stabilité et de pacification matérielle, sortant des crises émotionnelles cycliques et de l\'attachement au chaos d\'autrui.',
      lesson: 'Développer des valeurs solides et la paix de l\'esprit dans les choses simples de la vie.',
      avoid: 'Paranoïa, obsession des transformations dramatiques, vengeances subtiles et panique de l\'abandon.',
      embrace: 'Construction constante, sérénité intérieure, gratitude physique et tranquillité.'
    },
    'Gêmeos': {
      southNode: 'Sagittaire',
      description: 'Chemin d\'apprentissage pratique, d\'ouverture d\'esprit et de dialogue quotidien, sortant du dogmatisme intellectuel et des vérités absolues.',
      lesson: 'Écouter l\'environnement qui vous entoure et communiquer de manière légère et humble.',
      avoid: 'Arrogance intellectuelle, fanatisme idéologique et dispersion irresponsable à l\'étranger.',
      embrace: 'Curiosité enfantine, échanges d\'idées locaux, flexibilité et lecture attentive.'
    },
    'Câncer': {
      southNode: 'Capricorne',
      description: 'Chemin d\'accueil émotionnel, de ressourcement intime et de sensibilité, s\'éloignant de la froide rigidité du statut ou des exigences professionnelles.',
      lesson: 'Reconnaître ses fragilités, aimer son foyer et cultiver son monde intérieur.',
      avoid: 'Tout contrôler par la voie financière, répression des larmes et ambition froide déshumanisante.',
      embrace: 'Vulnérabilité sincère, accueil des sentiments et protection de la famille.'
    },
    'Leão': {
      southNode: 'Verseau',
      description: 'Chemin d\'expression créative individuelle, de rayonnement sur scène et de leadership expressif, sortant de l\'anonymat des groupes et des froideurs collectives.',
      lesson: 'Assumer le centre de sa propre vie avec générosité et chaleur humaine.',
      avoid: 'Se cacher dans la foule, aliénation émotionnelle et rébellion sans but réel.',
      embrace: 'Confiance dans son propre art, charisme joyeux et applaudissements sincères pour les autres.'
    },
    'Virgem': {
      southNode: 'Poissons',
      description: 'Chemin de la praticité quotidienne, de l\'organisation consciente et du service utile, sortant de l\'escapisme, de la fantaisie chaotique et des sacrifices vagues.',
      lesson: 'S\'ancrer dans la routine, prendre soin de la santé biologique et organiser ses domaines de vie.',
      avoid: 'Se victimiser, illusion mystique désordonnée et procrastination par peur de l\'échec.',
      embrace: 'Attention aux détails pratiques, discipline quotidienne saine et discernement rationnel.'
    },
    'Libra': {
      southNode: 'Bélier',
      description: 'Chemin de la diplomatie, des partenariats justes et de la coexistence pacifique, s\'éloignant de l\'individualisme agressif et de l\'impulsivité impatiente.',
      lesson: 'Voir le point de vue de l\'autre et coopérer avec harmonie et élégance artistique.',
      avoid: 'Compétitivité amère, irritation face aux besoins des autres et égoïsme brut.',
      embrace: 'Écoute active, médiation des conflits, justice sociale et relations harmonieuses.'
    },
    'Escorpião': {
      southNode: 'Taureau',
      description: 'Chemin de régénération inconsciente profonde, de détachement matériel et d\'intimité sacrée, sortant de l\'accumulation possessive et de l\'inertie matérielle.',
      lesson: 'Faire face aux crises comme à des renouvellements cosmiques de l\'âme et faire confiance à son intuition cachée.',
      avoid: 'Paresse à affronter sa propre ombre, entêtement matériel et possessivité extrême.',
      embrace: 'Psychologie subtile, spiritualité courageuse, magnétisme intime et abandon.'
    },
    'Sagitário': {
      southNode: 'Gémeaux',
      description: 'Chemin de la sagesse supérieure, de la philosophie élargie et de la foi inspirante, sortant de l\'excès de détails informatifs vides et des potins locaux.',
      lesson: 'Chercher le sens profond des choses et faire confiance à un but de vie intégré.',
      avoid: 'Méticulosité excessive, superficialité, bavardages futiles et dualités mentales.',
      embrace: 'Études supérieures, spiritualité expansive, hauts vols et optimisme réel.'
    },
    'Capricórnio': {
      southNode: 'Cancer',
      description: 'Chemin de l\'autorité personnelle, de la responsabilité sociale et de la maturité pratique, s\'éloignant de l\'infantilisme, du chantage affectif et de la dépendance émotionnelle.',
      lesson: 'Bâtir sa carrière sur ses propres efforts et stabiliser les bases réelles de la vie.',
      avoid: 'Chantages émotionnels, victimisation du passé et peur de s\'engager dans des engagements d\'adulte.',
      embrace: 'Leadership ferme, patience à long terme, mérite personnel et solidité.'
    },
    'Aquário': {
      southNode: 'Lion',
      description: 'Chemin de coopération humanitaire, de vision d\'avant-garde et de partage social, sortant de l\'orgueil égocentrique et du besoin constant d\'attention personnelle.',
      lesson: 'Mettre son intelligence subtile au service des transformations collectives.',
      avoid: 'Orgueil blessé par manque de mentions j\'aime ou d\'applaudissements, arrogance et individualisme aveugle.',
      embrace: 'Amitiés libératrices, causes humanitaires, idéaux de futur et fraternité.'
    },
    'Peixes': {
      southNode: 'Vierge',
      description: 'Chemin d\'abandon spirituel, d\'amour universel et de compassion cosmique, sortant du scepticisme excessif, du stress lié au contrôle des détails et du perfectionnisme autodestructeur.',
      lesson: 'Savoir couler dans le mystère spirituel et faire confiance au plan subtil divin.',
      avoid: 'Jugement névrotique des petits défauts, hypocondrie, critique acerbe et attachement excessif à des règles rigides.',
      embrace: 'Intuition, arts mystiques, méditation, pardon absolu et flexibilité amoureuse.'
    }
  }
};

export interface LocalizedNodeHouse {
  southHouse: number;
  description: string;
  lesson: string;
  avoid: string;
  embrace: string;
}

export const NODE_HOUSES_LOCALIZED: Record<Language, Record<number, LocalizedNodeHouse>> = {
  pt: {
    1: {
      southHouse: 7,
      description: 'Sua evolução foca no autoconhecimento profundo e tomada de decisões autônomas, saindo do hábito de delegar ao parceiro(a) as rédeas de sua própria vida.',
      lesson: 'Aprender quem você realmente é despido de rótulos sociais ou expectativas alheias.',
      avoid: 'Anular sua vontade própria em casamentos ou sociedades para evitar o descontentamento.',
      embrace: 'Liderança pessoal autêntica, investir em si próprio e agir com ousadia.'
    },
    2: {
      southHouse: 8,
      description: 'Sua evolução direciona-se para a sua própria independência financeira e autoestima física, saindo da dependência dos recursos de outrem ou crises existenciais e sexuais cíclicas.',
      lesson: 'Aprender o valor real dos seus talentos materiais e garantir sua própria estabilidade de vida.',
      avoid: 'Herdar dependências ou submeter-se a jogos de poder em troca de apoio material ou heranças.',
      embrace: 'Trabalhar focado em seus próprios propósitos, poupança prudente e valorização física.'
    },
    3: {
      southHouse: 9,
      description: 'Sua evolução reside em aplicar o conhecimento prático em sua comunidade local, dialogando com as pessoas reais à sua volta, saindo de dogmas acadêmicos ou sonhos distantes flutuantes.',
      lesson: 'Comunicar-se de modo simples, dar aulas, escrever e escutar com empatia o vizinho.',
      avoid: 'Viver em uma torre de marfim espiritual/filosófica arrogante que não se conecta ao cotidiano.',
      embrace: 'Escrita, mídias locais, cursos rápidos, curiosidade com o que está à mão.'
    },
    4: {
      southHouse: 10,
      description: 'Sua evolução chama você para recolher-se no aconchego do lar e na intimidade familiar, nutrindo suas fundações emocionais de alma, saindo do foco obsessivo em status público e carreiras corporativas vazias.',
      lesson: 'Integrar os sentimentos profundos do seu clã familiar primário e dar sustentabilidade íntima a si.',
      avoid: 'Fugir das mágoas do lar trabalhando em excesso apenas para angariar aplausos de estranhos.',
      embrace: 'Cuidado com a sua casa, conexões com pais ou filhos e recolhimento regenerador.'
    },
    5: {
      southHouse: 11,
      description: 'Sua evolução convida à sua expressão lúdica, aos romances sadios, diversões criativas e conexão íntima com crianças/projetos próprios, saindo do distanciamento impessoal de amizades platônicas ou grupos virtuais frios.',
      lesson: 'Permitir-se brilhar livremente no amor e descobrir hobbies de profunda paixão.',
      avoid: 'Diluir seu magnetismo pessoal em causas coletivas para não enfrentar suas inseguranças afetivas.',
      embrace: 'Teatro, hobbies artísticos, paixão declarada, atenção especial a quem você ama de perto.'
    },
    6: {
      southHouse: 12,
      description: 'Sua evolução demanda manter a atenção no plano físico diário, no cuidado do seu corpo de carne, nos animais, na alimentação e disciplinas estruturadas, saindo do escapismo fantasioso e da reclusão de alma.',
      lesson: 'Cultivar hábitos regeneradores visíveis e praticar a caridade útil organizada.',
      avoid: 'Culpa inconsciente inexplicável, autoengano em fantasias espirituais e bagunças biológicas.',
      embrace: 'Ginástica sadia, arrumação doméstica contínua, check-ups e assistência no mundo real.'
    },
    7: {
      southHouse: 1,
      description: 'Sua evolução aponta firmemente para parcerias conscientes, tolerância e cooperação ativa, saindo do egoísmo impulsivo, impaciência e agressividade contra quem divide a jornada com você.',
      lesson: 'Aprender que dividir as conquistas e entender as dores do outro é o grande motor da felicidade.',
      avoid: 'Competir sem necessidade íntima com parceiros e agir com autossuficiência rude.',
      embrace: 'Diálogos de conciliação, casamento ético sadio, sociedades sinceras e escuta.'
    },
    8: {
      southHouse: 2,
      description: 'Sua evolução é psicológica e mística profunda: trata-se de desapegar do controle de bens acumulados para regenerar seus valores através da fusão profunda com o outro de forma autêntica.',
      lesson: 'Encontrar a estabilidade invisível na confiança e na sabedoria do renascimento material.',
      avoid: 'Apegar-se neuroticamente a posses materiais ou reprimir a energia íntima de fusão.',
      embrace: 'Terapia de alma, investimento conjunto ético, investigação do ocultismo e cura espiritual.'
    },
    9: {
      southHouse: 3,
      description: 'Sua evolução pede vôos mais altos da mente: buscar o sentido maior das coisas, viajar a horizontes amplos, sintonizar-se com ideais éticos superiores, saindo das distrações passageiras ou discussões fúteis do dia a dia.',
      lesson: 'Expandir a consciência integrando um otimismo espiritual luminoso na sua visão.',
      avoid: 'Vício em fofocas e superficialidades que dividem a atenção sem construir sabedoria real.',
      embrace: 'Turismo de alma, estudos superiores, publicação de livros, filosofia expansiva viva.'
    },
    10: {
      southHouse: 4,
      description: 'Sua evolução clama pela independência madura, pela fundação de sua autoridade profissional pública e liderança reconhecida, saindo das chantagens emocionais ou aconchegos infantis do lar de ontem.',
      lesson: 'Tomar posse de seu papel como o mestre de seu destino público e zelar por seu merecido status.',
      avoid: 'Esconder-se em coitadismos do passado ou culpar a família por não arriscar-se na carreira.',
      embrace: 'Liderança firme, paciência de longo prazo, mérito pessoal e solidez.'
    },
    11: {
      southHouse: 5,
      description: 'Sua evolução pede fraternidade ativa: conectar-se a grupos que pensam inovação, trabalhar em prol de causas libertadoras do futuro humano, saindo do anseio dramático de o seu ego ser idolatrado.',
      lesson: 'Compartilhar conquistas, amparar minorias e desenhar pontes de progresso coletivo.',
      avoid: 'Arrogância infantil, vaidade exacerbada e dependência exagerada de elogios alheios.',
      embrace: 'Engajamento comunitário, cooperativas, projetos inovadores e amizades diversas.'
    },
    12: {
      southHouse: 6,
      description: 'Sua evolução convida à conexão mística absoluta, meditações silenciosas, retiro artístico regenerador e entrega humilde ao plano divino, saindo da escravidão das listas mentais, estressores corporais ou hipocondrias.',
      lesson: 'Compreender que há uma ordem maior e que o controle pessoal absoluto é uma mera ilusão sutil.',
      avoid: 'Pânico neurótico com micróbios ou pequenas desorganizações da mesa corporal cotidiana.',
      embrace: 'Artes terapêuticas, retiros espirituais, silêncio mental e compaixão cósmica profunda.'
    }
  },
  en: {
    1: {
      southHouse: 7,
      description: 'Your evolution focuses on deep self-knowledge and autonomous decision-making, moving away from the habit of delegating the reins of your own life to your partner.',
      lesson: 'Learn who you really are stripped of social labels or others\' expectations.',
      avoid: 'Annulling your own self-will in marriages or partnerships to avoid discontent.',
      embrace: 'Authentic personal leadership, investing in yourself, and acting with boldness.'
    },
    2: {
      southHouse: 8,
      description: 'Your evolution directs itself towards your own financial independence and physical self-esteem, moving away from dependency on others\' resources or cyclical existential and sexual crises.',
      lesson: 'Learn the real value of your material talents and ensure your own stability of life.',
      avoid: 'Inheriting dependencies or submitting to power games in exchange for material support or inheritances.',
      embrace: 'Work focused on your own purposes, prudent savings, and physical valuation.'
    },
    3: {
      southHouse: 9,
      description: 'Your evolution lies in applying practical knowledge in your local community, dialoguing with real people around you, leaving behind academic dogmas or distant floating dreams.',
      lesson: 'Communicate in a simple way, teach, write, and listen with empathy to your neighbor.',
      avoid: 'Living in an arrogant spiritual/philosophical ivory tower that doesn\'t connect to everyday life.',
      embrace: 'Writing, local media, quick courses, curiosity with what is at hand.'
    },
    4: {
      southHouse: 10,
      description: 'Your evolution calls you to retreat into the comfort of home and family intimacy, nurturing your deep emotional foundations of soul, leaving behind obsessive focus on public status and empty corporate careers.',
      lesson: 'Integrate the deep feelings of your primary family clan and give intimate support to yourself.',
      avoid: 'Fleeing home pain by working in excess just to win applause from strangers.',
      embrace: 'Caring for your house, connections with parents or children, and restorative retreat.'
    },
    5: {
      southHouse: 11,
      description: 'Your evolution invites your playful expression, healthy romance, creative fun, and intimate connection with children/your own projects, leaving behind the impersonal detachment of platonic friendships or cold virtual groups.',
      lesson: 'Allow yourself to shine freely in love and discover hobbies of deep passion.',
      avoid: 'Diluting your personal magnetism in collective causes so as not to face your emotional insecurities.',
      embrace: 'Theater, artistic hobbies, declared passion, special attention to those you love closely.'
    },
    6: {
      southHouse: 12,
      description: 'Your evolution demands maintaining attention on the daily physical plane, caring for your biological body, animals, diet, and structured disciplines, leaving behind fantasy escapism and reclusion of soul.',
      lesson: 'Cultivate visible regenerative habits and practice organized useful charity.',
      avoid: 'Inexplicable subconscious guilt, self-deception in spiritual fantasies, and biological mess.',
      embrace: 'Healthy exercise, continuous household tidying, check-ups, and assistance in the real world.'
    },
    7: {
      southHouse: 1,
      description: 'Your evolution points firmly to conscious partnerships, tolerance, and active cooperation, moving away from impulsive selfishness, impatience, and aggressiveness against those who share the journey with you.',
      lesson: 'Learn that sharing achievements and understanding the other\'s pain is the great engine of happiness.',
      avoid: 'Competing unnecessarily with partners and acting with rude self-sufficiency.',
      embrace: 'Reconciliation dialogues, healthy ethical marriage, sincere partnerships, and listening.'
    },
    8: {
      southHouse: 2,
      description: 'Your evolution is deep psychological and mystical: it is about detaching from control of accumulated assets to regenerate your values through deep, authentic fusion with the other.',
      lesson: 'Find invisible stability in trust and wisdom of material rebirth.',
      avoid: 'Neurotically clinging to material possessions or repressing intimate energy of fusion.',
      embrace: 'Soul therapy, ethical joint investment, occult investigation, and spiritual healing.'
    },
    9: {
      southHouse: 3,
      description: 'Your evolution asks for higher flights of the mind: seeking the greater meaning of things, traveling to broad horizons, tuning in to higher ethical ideals, leaving behind temporary distractions or futile everyday discussions.',
      lesson: 'Expand consciousness by integrating a luminous spiritual optimism into your vision.',
      avoid: 'Addiction to gossip and superficialities that divide attention without building real wisdom.',
      embrace: 'Soul tourism, higher studies, publishing books, expansive living philosophy.'
    },
    10: {
      southHouse: 4,
      description: 'Your evolution calls for mature independence, foundation of your public professional authority and recognized leadership, leaving behind emotional blackmail or childhood comforts of yesterday.',
      lesson: 'Take possession of your role as master of your public destiny and guard your deserved status.',
      avoid: 'Hiding in past victimhood or blaming the family for not risking career advancement.',
      embrace: 'Firm leadership, long-term patience, personal merit, and solidity.'
    },
    11: {
      southHouse: 5,
      description: 'Your evolution asks for active fraternity: connecting to groups that think innovation, working for future human liberating causes, leaving behind the dramatic craving of your ego to be idolized.',
      lesson: 'Share achievements, support minorities, and design bridges of collective progress.',
      avoid: 'Childish arrogance, exacerbated vanity, and exaggerated dependence on others\' praise.',
      embrace: 'Community engagement, cooperatives, innovative projects, and diverse friendships.'
    },
    12: {
      southHouse: 6,
      description: 'Your evolution invites absolute mystical connection, silent meditation, restorative artistic retreat, and humble surrender to the divine plan, leaving behind slavery of mental lists, bodily stressors, or hypochondrias.',
      lesson: 'Understand that there is a greater order and that absolute personal control is a mere subtle illusion.',
      avoid: 'Neurotic panic with microbes or minor disorganization of the daily physical desk.',
      embrace: 'Therapeutic arts, spiritual retreats, mental silence, and deep cosmic compassion.'
    }
  },
  es: {
    1: {
      southHouse: 7,
      description: 'Tu evolución se enfoca en el autoconocimiento profundo y la toma de decisiones autónomas, saliendo de la costumbre de delegar en tu pareja las riendas de tu propia vida.',
      lesson: 'Aprender quién eres realmente despojado de etiquetas sociales o expectativas ajenas.',
      avoid: 'Anular tu voluntad propia en matrimonios o sociedades para evitar el descontentamento.',
      embrace: 'Liderazgo personal auténtico, invertir en uno mismo y actuar con audacia.'
    },
    2: {
      southHouse: 8,
      description: 'Tu evolución se dirige hacia tu propia independencia financiera y autoestima física, saliendo de la dependencia de recursos ajenos o crisis existenciales y sexuales cíclicas.',
      lesson: 'Aprender el valor real de tus talentos materiales y garantizar tu propia estabilidad de vida.',
      avoid: 'Heredar dependencias o someterse a juegos de poder a cambio de apoyo material o herencias.',
      embrace: 'Trabajar enfocado en tus propios propósitos, ahorro prudente y valoración física.'
    },
    3: {
      southHouse: 9,
      description: 'Tu evolución reside en aplicar el conocimiento práctico en tu comunidad local, dialogando con las personas reales a tu alrededor, dejando atrás dogmas académicos o sueños distantes flotantes.',
      lesson: 'Comunicarse de manera sencilla, dar clases, escribir y escuchar con empatía al vecino.',
      avoid: 'Vivir en una torre de marfil espiritual/filosófica arrogante que no se conecta con lo cotidiano.',
      embrace: 'Escritura, medios locales, cursos rápidos, curiosidad por lo que está al alcance de la mano.'
    },
    4: {
      southHouse: 10,
      description: 'Tu evolución te llama a refugiarte en el calor del hogar y la intimidad familiar, nutriendo tus cimientos emocionales de alma, saliendo del enfoque obsesivo en el estatus público y carreras corporativas vacías.',
      lesson: 'Integrar los sentimientos profundos de tu clan familiar primario y brindarte estabilidad íntima.',
      avoid: 'Huir de los dolores del hogar trabajando en exceso solo para ganar aplausos de extraños.',
      embrace: 'Cuidado de tu casa, conexiones con padres o hijos y retiro regenerador.'
    },
    5: {
      southHouse: 11,
      description: 'Tu evolución invita a tu expresión lúdica, romances sanos, diversiones creativas y conexión íntima con niños/proyectos propios, saliendo del distanciamiento impersonal de amistades platónicas o grupos virtuales fríos.',
      lesson: 'Permitirte brillar libremente en el amor y descubrir pasiones profundas.',
      avoid: 'Diluir tu magnetismo personal en causas colectivas para no enfrentar tus inseguridades afectivas.',
      embrace: 'Teatro, pasatiempos artísticos, pasión declarada, atención especial a quienes amas de cerca.'
    },
    6: {
      southHouse: 12,
      description: 'Tu evolución exige mantener la atención en el plano físico diario, en el cuidado de tu cuerpo físico, animales, alimentación y disciplinas estructuradas, dejando atrás el escapismo fantasioso y la reclusión del alma.',
      lesson: 'Cultivar hábitos regeneradores visibles y practicar la caridad útil organizada.',
      avoid: 'Culpa inconsciente inexplicable, autoengaño en fantasías espirituales y desorden biológico.',
      embrace: 'Gimnasia sana, orden doméstico continuo, chequeos médicos y asistencia en el mundo real.'
    },
    7: {
      southHouse: 1,
      description: 'Tu evolución apunta firmemente hacia asociaciones conscientes, tolerancia y cooperación activa, dejando atrás el egoísmo impulsivo, impaciencia y agresividad contra quien comparte el viaje contigo.',
      lesson: 'Aprender que compartir los logros y entender el dolor del otro es el gran motor de la felicidad.',
      avoid: 'Competir sin necesidad íntima con parejas y actuar con brusca autosuficiencia.',
      embrace: 'Diálogos de conciliación, matrimonio ético sano, sociedades sinceras y escucha activa.'
    },
    8: {
      southHouse: 2,
      description: 'Tu evolución es psicológica y mística profunda: se trata de desapegarse del control de bienes acumulados para regenerar tus valores mediante la fusión profunda y auténtica con el otro.',
      lesson: 'Encontrar la estabilidad invisible en la confianza y sabiduría del renacimiento material.',
      avoid: 'Aferrarse neuróticamente a posesiones materiales o reprimir la energía íntima de fusión.',
      embrace: 'Terapia del alma, inversión conjunta ética, investigación del ocultismo y sanación espiritual.'
    },
    9: {
      southHouse: 3,
      description: 'Tu evolución pide vuelos más altos de la mente: buscar el sentido mayor de las cosas, viajar a horizontes amplios, sintonizar con ideales éticos superiores, saliendo de distracciones pasajeras o discusiones cotidianas inútiles.',
      lesson: 'Expandir la conciencia integrando un optimismo espiritual luminoso en tu visión.',
      avoid: 'Adicción a los chismes y superficialidades que dividen la atención sin construir sabiduría real.',
      embrace: 'Turismo del alma, estudios superiores, publicación de libros, filosofía expansiva viva.'
    },
    10: {
      southHouse: 4,
      description: 'Tu evolución clama por una independencia madura, por la fundación de tu autoridad profesional pública y liderazgo reconocido, saliendo de los chantajes emocionales o comodidades infantiles del hogar de ayer.',
      lesson: 'Tomar posesión de tu rol como dueño de tu destino público y velar por tu merecido estatus.',
      avoid: 'Esconderse en victimismos del pasado o culpar a la familia por no arriesgarse en la carrera.',
      embrace: 'Liderazgo firme, paciencia a largo plazo, mérito personal y solidez.'
    },
    11: {
      southHouse: 5,
      description: 'Tu evolución pide fraternidad activa: conectarse con grupos que piensen en la innovación, trabajar en pro de causas liberadoras del futuro humano, saliendo del anhelo dramático de que tu ego sea idolatrado.',
      lesson: 'Compartir logros, apoyar a minorías y diseñar puentes de progreso colectivo.',
      avoid: 'Arrogancia infantil, vanidad exacerbada y dependencia exagerada de elogios ajenos.',
      embrace: 'Compromiso comunitario, cooperativas, proyectos innovadores y amistades diversas.'
    },
    12: {
      southHouse: 6,
      description: 'Tu evolución invita a la conexión mística absoluta, meditaciones silenciosas, retiro artístico regenerador y entrega humilde al plano divino, dejando la esclavitud de listas mentales, estresores corporales o hipocondrías.',
      lesson: 'Comprender que hay un orden mayor y que el control personal absoluto es una mera ilusión sutil.',
      avoid: 'Pánico neurótico a los microbios o pequeña desorganización del escritorio físico diario.',
      embrace: 'Artes terapéuticas, retiros espirituales, silencio mental y compasión cósmica profunda.'
    }
  },
  de: {
    1: {
      southHouse: 7,
      description: 'Ihre Entwicklung konzentriert sich auf tiefe Selbsterkenntnis und autonome Entscheidungsfindung, weg von der Gewohnheit, die Zügel des eigenen Lebens an den Partner zu delegieren.',
      lesson: 'Lernen Sie, wer Sie wirklich sind, befreit von gesellschaftlichen Etiketten oder Erwartungen anderer.',
      avoid: 'Aufgabe des eigenen Willens in Ehen oder Partnerschaften, um Unzufriedenheit zu vermeiden.',
      embrace: 'Authentische persönliche Führung, in sich selbst investieren und mutig handeln.'
    },
    2: {
      southHouse: 8,
      description: 'Ihre Entwicklung richtet sich auf Ihre eigene finanzielle Unabhängigkeit und Ihr körperliches Selbstwertgefühl, weg von der Abhängigkeit von den Ressourcen anderer oder zyklischen existenziellen und sexuellen Krisen.',
      lesson: 'Lernen Sie den realen Wert Ihrer materiellen Talente kennen und sorgen Sie für Ihre eigene Lebensstabilität.',
      avoid: 'Abhängigkeiten erben oder sich Machtspielen im Austausch für materielle Unterstützung oder Erbschaften unterwerfen.',
      embrace: 'Arbeit, die auf Ihre eigenen Ziele ausgerichtet ist, umsichtiges Sparen und körperliche Wertschätzung.'
    },
    3: {
      southHouse: 9,
      description: 'Ihre Entwicklung liegt darin, praktisches Wissen in Ihrer lokalen Gemeinschaft anzuwenden, mit echten Menschen um Sie herum zu dialogisieren, weg von akademischen Dogmen oder fernen schwebenden Träumen.',
      lesson: 'Kommunizieren Sie auf einfache Weise, lehren Sie, schreiben Sie und hören Sie Ihrem Nächsten mit Empathie zu.',
      avoid: 'Leben in einem arroganten spirituellen/philosophischen Elfenbeinturm, der sich nicht mit dem Alltag verbindet.',
      embrace: 'Schreiben, lokale Medien, Schnellkurse, Neugier auf das, was greifbar ist.'
    },
    4: {
      southHouse: 10,
      description: 'Ihre Entwicklung ruft Sie dazu auf, sich in die Gemütlichkeit Ihres Zuhauses und die familiäre Intimität zurückzuziehen, Ihre tiefen emotionalen Grundlagen der Seele zu nähren, weg vom obsessiven Fokus auf öffentlichen Status und leere Karrieren.',
      lesson: 'Integrieren Sie die tiefen Gefühle Ihres primären Familienclans und geben Sie sich selbst intimen Halt.',
      avoid: 'Flucht vor häuslichem Schmerz durch übermäßige Arbeit, nur um Applaus von Fremden zu gewinnen.',
      embrace: 'Sorge für Ihr Haus, Verbindungen zu Eltern oder Kindern und erholsamer Rückzug.'
    },
    5: {
      southHouse: 11,
      description: 'Ihre Entwicklung lädt zu Ihrem spielerischen Ausdruck, gesunden Romanzen, kreativem Spaß und einer intimen Verbindung mit Kindern/eigenen Projekten ein, weg von der unpersönlichen Distanz platonischer Freundschaften oder kalter virtueller Gruppen.',
      lesson: 'Erlauben Sie sich, in der Liebe frei zu strahlen und Hobbys von tiefer Leidenschaft zu entdecken.',
      avoid: 'Verdünnung Ihres persönlichen Magnetismus in kollektiven Angelegenheiten, um sich nicht Ihren emotionalen Unsicherheiten stellen zu müssen.',
      embrace: 'Theater, künstlerische Hobbys, erklärte Leidenschaft, besondere Aufmerksamkeit für diejenigen, die Sie nahe lieben.'
    },
    6: {
      southHouse: 12,
      description: 'Ihre Entwicklung erfordert es, die Aufmerksamkeit auf den täglichen physischen Bereich zu richten, auf die Pflege Ihres physischen Körpers, der Tiere, der Ernährung und strukturierter Disziplinen, weg von Realitätsflucht und seelischer Isolation.',
      lesson: 'Kultivieren Sie sichtbare regenerative Gewohnheiten und praktizieren Sie organisierte, nützliche Nächstenliebe.',
      avoid: 'Unerklärliche unbewusste Schuldgefühle, Selbstbetrug in spirituellen Fantasien und biologisches Durcheinander.',
      embrace: 'Gesunde Gymnastik, ständige Haushaltsordnung, Kontrolluntersuchungen und Hilfe in der realen Welt.'
    },
    7: {
      southHouse: 1,
      description: 'Ihre Entwicklung weist fest auf bewusste Partnerschaften, Toleranz und aktive Zusammenarbeit hin, weg von impulsivem Egoismus, Ungeduld und Aggressivität gegenüber denjenigen, die die Reise mit Ihnen teilen.',
      lesson: 'Lernen Sie, dass das Teilen von Erfolgen und das Verstehen des Schmerzes des anderen der große Motor des Glücks ist.',
      avoid: 'Unnötiger Wettbewerb mit Partnern und Handeln mit unhöflicher Selbstgenügsamkeit.',
      embrace: 'Versöhnungsdialoge, gesunde ethische Ehe, aufrichtige Partnerschaften und Zuhören.'
    },
    8: {
      southHouse: 2,
      description: 'Ihre Entwicklung ist tiefenpsychologisch und mystisch: Es geht darum, sich von der Kontrolle angesammelter Besitztümer zu lösen, um Ihre Werte durch tiefe, authentische Verschmelzung mit dem anderen zu regenerieren.',
      lesson: 'Finden Sie unsichtbare Stabilität im Vertrauen und der Weisheit materieller Wiedergeburt.',
      avoid: 'Neurotisches Festhalten an materiellen Besitztümern oder Unterdrückung der intimen Verschmelzungsenergie.',
      embrace: 'Seelentherapie, ethische gemeinsame Investition, okkulte Forschung und spirituelle Heilung.'
    },
    9: {
      southHouse: 3,
      description: 'Ihre Entwicklung bittet um höhere Flüge des Geistes: Suchen Sie nach dem tieferen Sinn der Dinge, reisen Sie zu weiten Horizonten, stimmen Sie sich auf höhere ethische Ideale ein, weg von vorübergehenden Ablenkungen oder futilen Alltagsdiskussionen.',
      lesson: 'Erweitern Sie das Bewusstsein, indem Sie einen leuchtenden spirituellen Optimismus in Ihre Vision integrieren.',
      avoid: 'Sucht nach Klatsch und Oberflächlichkeiten, die die Aufmerksamkeit teilen, ohne echte Weisheit aufzubauen.',
      embrace: 'Seelenreisen, höhere Studien, Veröffentlichung von Büchern, expansive Lebensphilosophie.'
    },
    10: {
      southHouse: 4,
      description: 'Ihre Entwicklung ruft nach reifer Unabhängigkeit, dem Aufbau Ihrer öffentlichen beruflichen Autorität und anerkannten Führung, weg von emotionaler Erpressung oder kindlicher Bequemlichkeit von gestern.',
      lesson: 'Nehmen Sie Ihre Rolle als Meister Ihres öffentlichen Schicksals an und wahren Sie Ihren verdienten Status.',
      avoid: 'Sich in der Opferrolle der Vergangenheit verstecken oder der Familie die Schuld geben, dass man keine Karriere riskiert.',
      embrace: 'Feste Führung, langfristige Geduld, persönliches Verdienst und Solidität.'
    },
    11: {
      southHouse: 5,
      description: 'Ihre Entwicklung bittet um aktive Brüderlichkeit: Verbinden Sie sich mit Gruppen, die an Innovation denken, arbeiten Sie für zukünftige menschliche Befreiungsursachen, weg von dem dramatischen Verlangen Ihres Egos, idolisiert zu werden.',
      lesson: 'Teilen Sie Erfolge, unterstützen Sie Minderheiten und entwerfen Sie Brücken des kollektiven Fortschritts.',
      avoid: 'Kindliche Arroganz, übertriebene Eitelkeit und übertriebene Abhängigkeit vom Lob anderer.',
      embrace: 'Gemeinschaftliches Engagement, Genossenschaften, innovative Projekte und vielfältige Freundschaften.'
    },
    12: {
      southHouse: 6,
      description: 'Ihre Entwicklung lädt zu absoluter mystischer Verbindung, stiller Meditation, erholsamem künstlerischen Rückzug und demütiger Hingabe an den göttlichen Plan ein, weg von der Sklaverei mentaler Listen, körperlicher Stressoren oder Hypochondrien.',
      lesson: 'Verstehen Sie, dass es eine größere Ordnung gibt und dass absolute persönliche Kontrolle eine bloße subtile Illusion ist.',
      avoid: 'Neurotische Panik vor Keimen oder geringfügiger Unordnung des täglichen physischen Arbeitsplatzes.',
      embrace: 'Therapeutische Künste, spirituelle Rückzüge, mentale Stille und tiefes kosmisches Mitgefühl.'
    }
  },
  fr: {
    1: {
      southHouse: 7,
      description: 'Votre évolution se concentre sur une connaissance approfondie de soi et une prise de décision autonome, en vous éloignant de l\'habitude de déléguer les rênes de votre propre vie à votre partenaire.',
      lesson: 'Apprendre qui vous êtes vraiment, dépouillé des étiquettes sociales ou des attentes des autres.',
      avoid: 'Annuler votre propre volonté dans les mariages ou les partenariats pour éviter le mécontentement.',
      embrace: 'Un leadership personnel authentique, investir en soi-même et agir avec audace.'
    },
    2: {
      southHouse: 8,
      description: 'Votre évolution s\'oriente vers votre propre indépendance financière et votre estime physique de soi, en vous éloignant de la dépendance aux ressources d\'autrui ou des crises existentielles et sexuelles cycliques.',
      lesson: 'Apprendre la valeur réelle de vos talents matériels et garantir votre propre stabilité de vie.',
      avoid: 'Hériter de dépendances ou se soumettre à des jeux de pouvoir en échange d\'un soutien matériel ou de successions.',
      embrace: 'Travailler centré sur vos propres objectifs, épargne prudente et valorisation physique.'
    },
    3: {
      southHouse: 9,
      description: 'Votre évolution réside dans l\'application des connaissances pratiques au sein de votre communauté locale, en dialoguant avec de vraies personnes autour de vous, sortant des dogmes académiques ou des rêves lointains flottants.',
      lesson: 'Communiquer de manière simple, enseigner, écrire et écouter son voisin avec empathie.',
      avoid: 'Vivre dans une tour d\'ivoire spirituelle/philosophique arrogante qui ne se connecte pas au quotidien.',
      embrace: 'Écriture, médias locaux, cours rapides, curiosité pour ce qui est à portée de main.'
    },
    4: {
      southHouse: 10,
      description: 'Votre évolution vous appelle à vous retirer dans le confort du foyer et de l\'intimité familiale, en nourrissant les fondations émotionnelles profondes de votre âme, s\'éloignant de la focalisation obsessive sur le statut public et les carrières d\'entreprise vides.',
      lesson: 'Intégrer les sentiments profonds de votre clan familial primaire et s\'apporter un soutien intime.',
      avoid: 'Fuir la douleur du foyer en travaillant à l\'excès simplement pour obtenir les applaudissements d\'inconnus.',
      embrace: 'Prendre soin de votre maison, connexions avec les parents ou les enfants, et retraite réparatrice.'
    },
    5: {
      southHouse: 11,
      description: 'Votre évolution invite à votre expression ludique, à des relations amoureuses saines, à des divertissements créatifs et à une connexion intime avec les enfants/vos propres projets, s\'éloignant du détachement impersonnel des amitiés platoniques ou des groupes virtuels froids.',
      lesson: 'S\'autoriser à briller librement en amour et découvrir des passions profondes.',
      avoid: 'Diluer votre magnétisme personnel dans des causes collectives pour ne pas affronter vos insécurités émotionnelles.',
      embrace: 'Théâtre, loisirs artistiques, passion déclarée, attention particulière à ceux que vous aimez de près.'
    },
    6: {
      southHouse: 12,
      description: 'Votre évolution exige de maintenir l\'attention sur le plan physique quotidien, de prendre soin de votre corps biologique, des animaux, de votre alimentation et de vos disciplines structurées, laissant de côté l\'escapisme fantaisiste et le repli de l\'âme.',
      lesson: 'Cultiver des habitudes régénératrices visibles et pratiquer une charité utile et organisée.',
      avoid: 'Culpabilité inconsciente inexplicable, auto-illusion dans les fantasmes spirituels et désordre biologique.',
      embrace: 'Exercice sain, rangement continu de la maison, examens médicaux et assistance dans le monde réel.'
    },
    7: {
      southHouse: 1,
      description: 'Votre évolution pointe fermement vers des partenariats conscients, la tolérance et une coopération active, s\'éloignant de l\'égoïsme impulsif, de l\'impatience et de l\'agressivité envers ceux qui partagent le voyage avec vous.',
      lesson: 'Apprendre que le partage des réalisations et la compréhension de la douleur de l\'autre sont les grands moteurs du bonheur.',
      avoid: 'Entrer en compétition inutilement avec vos partenaires et agir avec une rude autosuffisance.',
      embrace: 'Dialogues de réconciliation, mariage éthique sain, partenariats sincères et écoute active.'
    },
    8: {
      southHouse: 2,
      description: 'Votre évolution est psychologique et mystique profonde : il s\'agit de se détacher du contrôle des biens accumulés pour régénérer vos valeurs à travers une fusion profonde et authentique avec l\'autre.',
      lesson: 'Trouver une stabilité invisible dans la confiance et la sagesse de la renaissance matérielle.',
      avoid: 'S\'accrocher névrotiquement à des possessions matérielles ou réprimer l\'énergie intime de fusion.',
      embrace: 'Thérapie de l\'âme, investissement conjoint éthique, recherche occulte et guérison spirituelle.'
    },
    9: {
      southHouse: 3,
      description: 'Votre évolution demande des vols de l\'esprit plus élevés : chercher le sens profond des choses, voyager vers de larges horizons, s\'accorder à des idéaux éthiques supérieurs, laissant derrière soi les distractions passagères ou les discussions quotidiennes futiles.',
      lesson: 'Élargir la conscience en intégrant un optimisme spirituel lumineux dans votre vision.',
      avoid: 'Dépendance aux potins et aux superficialités qui divisent l\'attention sans construire une véritable sagesse.',
      embrace: 'Tourisme de l\'âme, études supérieures, publication de livres, philosophie de vie expansive.'
    },
    10: {
      southHouse: 4,
      description: 'Votre évolution appelle à une indépendance mûre, à la fondation de votre autorité professionnelle publique et à un leadership reconnu, laissant derrière soi les chantages émotionnels ou les conforts enfantins du foyer d\'hier.',
      lesson: 'Prendre possession de votre rôle en tant que maître de votre destin public et veiller sur votre statut mérité.',
      avoid: 'Se cacher dans la victimisation passée ou blâmer la famille pour ne pas risquer l\'avancement professionnel.',
      embrace: 'Leadership ferme, patience à long terme, mérite personnel et solidité.'
    },
    11: {
      southHouse: 5,
      description: 'Votre évolution demande une fraternité active : se connecter à des groupes qui pensent à l\'innovation, travailler pour de futures causes libératrices humaines, laissant de côté le désir dramatique de voir votre ego idolâtré.',
      lesson: 'Partager les réalisations, soutenir les minorités et concevoir des pontes de progrès collectif.',
      avoid: 'Arrogance enfantine, vanité exacerbée et dépendance exagérée aux éloges des autres.',
      embrace: 'Engagement communautaire, coopératives, projets innovants et amitiés diverses.'
    },
    12: {
      southHouse: 6,
      description: 'Votre évolution invite à une connexion mystique absolue, une méditation silencieuse, une retraite artistique réparatrice et un humble abandon au plan divin, sortant de l\'esclavage des listes mentales, des stresseurs corporels ou des hypocondries.',
      lesson: 'Comprendre qu\'il existe un ordre supérieur et que le contrôle personnel absolu n\'est qu\'une simple illusion subtile.',
      avoid: 'Panique névrotique face aux microbes ou à une désorganisation mineure du bureau physique quotidien.',
      embrace: 'Arts thérapeutiques, retraites spirituelles, silence mental et profonde compassion cosmique.'
    }
  }
};
