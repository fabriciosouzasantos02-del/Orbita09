import { TarotCard } from "./types";
import i18next from "i18next";

function getActiveLanguage(): 'pt' | 'en' | 'es' | 'de' | 'fr' {
  const lang = (i18next.language || 'pt').toLowerCase().split('-')[0];
  if (['pt', 'en', 'es', 'de', 'fr'].includes(lang)) {
    return lang as 'pt' | 'en' | 'es' | 'de' | 'fr';
  }
  return 'pt';
}

const TAROT_PORTUGUESE_BASE: TarotCard[] = [
  {
    id: "fool",
    name: "O Louco (The Fool)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Novos começos, liberdade, espontaneidade, fé no caminho místico.",
    reversedMeaning: "Irresponsabilidade, riscos desnecessários, imprudência ou hesitação.",
    imageSym: "🃏",
    description: "Um jovem caminhando animadamente rumo ao abismo com um cão ao seu lado, representando o salto de fé cósmico."
  },
  {
    id: "magician",
    name: "O Mago (The Magician)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Poder de manifestação, foco, força de vontade, engenhosidade cósmica.",
    reversedMeaning: "Ilusões, manipulação, potencial desperdiçado ou planos insustentáveis.",
    imageSym: "🪄",
    description: "O Mago com as quatro ferramentas elementares, canalizando o infinito celestial para plasmar a realidade."
  },
  {
    id: "high_priestess",
    name: "A Sacerdotisa (The High Priestess)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Intuição, subconsciente, mistério sagrado, sabedoria oculta.",
    reversedMeaning: "Falta de escuta interna, segredos revelados, intuição bloqueada.",
    imageSym: "🌙",
    description: "Sentada entre pilares de luz e sombra, lendo um pergaminho sagrado sob a proteção da lua crescente."
  },
  {
    id: "empress",
    name: "A Imperatriz (The Empress)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Abundância, criatividade, natureza divina, maternidade cósmica.",
    reversedMeaning: "Dependência, bloqueio criativo, sentimentos de escassez.",
    imageSym: "👑",
    description: "Cercada por campos de trigo fértil e florestas exuberantes, coroada de estrelas no trono da criação."
  },
  {
    id: "emperor",
    name: "O Imperador (The Emperor)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Estrutura, autoridade justa, estabilidade mundana, liderança.",
    reversedMeaning: "Rigidez excessiva, tirania, desorganização ou falta de controle.",
    imageSym: "⚔️",
    description: "Sentado em um trono de pedra lavrada com cabeças de carneiro, definindo as leis e as fronteiras do reino."
  },
  {
    id: "hierophant",
    name: "O Hierofante (The Hierophant)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Tradição mística, sabedoria espiritual reconhecida, educação mística.",
    reversedMeaning: "Dogmatismo, rebeldia mística, novas visões alternativas de mundo.",
    imageSym: "⛪",
    description: "O pontífice abençoando seus seguidores com chaves de ouro ao peito, ensinando as leis invisíveis e eternas."
  },
  {
    id: "lovers",
    name: "Os Enamorados (The Lovers)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Escolhas sagradas, alinhamento de values, relacionamentos harmoniosos.",
    reversedMeaning: "Desarmonia, conflito interno, más escolhas afetivas.",
    imageSym: "❤️",
    description: "Um casal sob a bênção de um arcanjo celeste, simbolizando o despertar da dualidade rumo à união cósmica."
  },
  {
    id: "chariot",
    name: "O Carro (The Chariot)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Direção focada, determinação vitoriosa, autocontrole e superação.",
    reversedMeaning: "Falta de rumo, perda de rédeas, agressividade impulsiva.",
    imageSym: "🏹",
    description: "O comandante heróico guiando duas esfinges de polaridades opostas, unificando as energias para avançar rapidamente."
  },
  {
    id: "strength",
    name: "A Força (Strength)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Compaixão, coragem interior, domínio gentil dos instintos ferozes.",
    reversedMeaning: "Fraqueza emocional, autossabotagem, descontrole orgulhoso.",
    imageSym: "🦁",
    description: "Uma mulher coroada de flores domando suavemente a boca de um leão majestoso com determinação e amor puro."
  },
  {
    id: "hermit",
    name: "O Eremita (The Hermit)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Autoconhecimento, interiorização, busca espiritual solitária, farol de sabedoria.",
    reversedMeaning: "Isolamento doentio, solidão forçada, recusa em refletir.",
    imageSym: "🏮",
    description: "O sábio solitário no topo da montanha segurando uma lanterna iluminada por uma estrela hexagonal brilhante."
  },
  {
    id: "wheel_of_fortune",
    name: "Roda da Fortuna (Wheel of Fortune)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Mudança cíclica, destino inevitável, golpes de sorte, carma dinâmico.",
    reversedMeaning: "Má sorte, resistência ao fluxo natural, imprevistos repetitivos.",
    imageSym: "☸️",
    description: "Uma roda giratória entalhada com símbolos alquímicos, rodeada por criaturas esotéricas flutuando no vazio."
  },
  {
    id: "justice",
    name: "A Justiça (Justice)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Verdade nua, equilíbrio kármico, decisões honestas e integridade.",
    reversedMeaning: "Injustiças, desequilíbrio legal, mentiras ou autopiedade injusta.",
    imageSym: "⚖️",
    description: "A deusa mantendo a espada erguida em uma das mãos e a balança de pratos equilibrada na outra."
  },
  {
    id: "hanged_man",
    name: "O Pendurado (The Hanged Man)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Nova perspectiva, sacrifício voluntário, pausa sagrada e iluminação.",
    reversedMeaning: "Estagnação egoísta, vitimização inútil ou recusa em aceitar mudanças.",
    imageSym: "🧘",
    description: "Um homem suspenso de ponta-cabeça com uma auréola radiante na cabeça, reinterpretando o mundo ao redor."
  },
  {
    id: "death",
    name: "A Morte (Death)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Transmutação profunda, conclusão de ciclos, desapego místico, renascimento.",
    reversedMeaning: "Resistência à mudança, apego doentio ao passado, estagnação forçada.",
    imageSym: "💀",
    description: "O cavaleiro esquelético com armadura negra desfilando sobre reis e mendigos, limpando o terreno para florir."
  },
  {
    id: "temperance",
    name: "A Temperança (Temperance)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Equilíbrio alquímico, harmonia de energias, cura emocional e paciência.",
    reversedMeaning: "Excessos descontrolados, desalinhamento energético, conflito estressante.",
    imageSym: "🏺",
    description: "O anjo da harmonia vertendo água pura entre dois cálices dourados em fluxo perfeito e contínuo."
  },
  {
    id: "devil",
    name: "O Diabo (The Devil)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Apegos materiais excessivos, prazeres carnais intensos, ilusões e sombra interna.",
    reversedMeaning: "Libertação de vícios, despertar sagrado do apego, cura de traumas cósmicos.",
    imageSym: "🔥",
    description: "A criatura cornuda segurando correntes em volta dos pescoços de um casal, alertando sobre apegos mundanos."
  },
  {
    id: "tower",
    name: "A Torre (The Tower)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Ruptura repentina, verdade revelada de forma abrupta, choque libertador de estruturas falsas.",
    reversedMeaning: "Evitar o desmoronamento necessário, temor ao colapso inevitável.",
    imageSym: "⚡",
    description: "Uma torre de pedra sendo atingida por um relâmpago azul ardente, quebrando conceitos rígidos de segurança."
  },
  {
    id: "star",
    name: "A Estrela (The Star)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Esperança cósmica, cura integral, paz inspiradora e fé nos céus.",
    reversedMeaning: "Desânimo temporário, ceticismo amargo, falta de brilho intuitivo.",
    imageSym: "⭐",
    description: "Uma mulher derramando águas na terra e no oceano sob uma grande estrela de oito pontas radiante."
  },
  {
    id: "moon",
    name: "A Lua (The Moon)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Pesadelos revelados, intuição profunda, mistérios de ilusões e segredos profundos do subconsciente.",
    reversedMeaning: "O despertar do pânico, liberação de medos vagos, mistérios se tornando claros.",
    imageSym: "🔮",
    description: "Dois cães uivando para a lua prateada na beira de uma piscina onde um crustáceo emerge lentamente."
  },
  {
    id: "sun",
    name: "O Sol (The Sun)",
    type: "major",
    arcana: "Maior",
    uprightMeaning: "Sucesso, brilho contagiante, vitalidade, clareza absoluta da verdade.",
    reversedMeaning: "Aro do ego inchado, vitórias parciais, nuvens temporárias no caminho solar.",
    imageSym: "☀️",
    description: "Uma criança radiante montando um cavalo branco sob os raios dourados de um sol sorridente e majestoso."
  }
];

export const TRANSLATIONS_WORLD: Record<string, Record<string, Partial<TarotCard>>> = {
  en: {
    fool: { name: "The Fool", arcana: "Major", uprightMeaning: "New beginnings, freedom, spontaneity, faith in the mystical path.", reversedMeaning: "Irresponsibility, unnecessary risks, recklessness, or hesitation.", description: "A young person walking excitedly towards the abyss with a dog at their side, representing the cosmic leap of faith." },
    magician: { name: "The Magician", arcana: "Major", uprightMeaning: "Power of manifestation, focus, willpower, cosmic resourcefulness.", reversedMeaning: "Illusions, manipulation, wasted potential, or unsustainable plans.", description: "The Magician with the four elemental tools, channeling the celestial infinite to shape reality." },
    high_priestess: { name: "The High Priestess", arcana: "Major", uprightMeaning: "Intuition, subconscious, sacred mystery, occult wisdom.", reversedMeaning: "Lack of inner listening, secrets revealed, blocked intuition.", description: "Sitting between pillars of light and shadow, reading a sacred scroll under the protection of the crescent moon." },
    empress: { name: "The Empress", arcana: "Major", uprightMeaning: "Abundance, creativity, divine nature, cosmic motherhood.", reversedMeaning: "Dependency, creative block, feelings of scarcity.", description: "Surrounded by fertile wheat fields and forests, crowned with stars on the throne of creation." },
    emperor: { name: "The Emperor", arcana: "Major", uprightMeaning: "Structure, just authority, worldly stability, leadership.", reversedMeaning: "Excessive rigidity, tyranny, disorganization, or lack of control.", description: "Sitting on a carved stone throne with ram heads, defining the laws and boundaries of the kingdom." },
    hierophant: { name: "The Hierophant", arcana: "Major", uprightMeaning: "Mystic tradition, recognized spiritual wisdom, mystical education.", reversedMeaning: "Dogmatismo, mystical rebellion, new alternative worldviews.", description: "The pontiff blessing his followers with golden keys on his chest, teaching the invisible laws." },
    lovers: { name: "The Lovers", arcana: "Major", uprightMeaning: "Sacred choices, alignment of values, harmonious relationships.", reversedMeaning: "Disharmony, internal conflict, poor emotional choices.", description: "A couple under the blessing of a celestial archangel, symbolizing the awakening of duality." },
    chariot: { name: "The Chariot", arcana: "Major", uprightMeaning: "Focused direction, victorious determination, self-control, and overcoming.", reversedMeaning: "Lack of direction, losing control, impulsive aggressiveness.", description: "The heroic commander steering two sphinxes of opposite polarities, unifying energies." },
    strength: { name: "Strength", arcana: "Major", uprightMeaning: "Compassion, inner courage, gentle mastery of fierce instincts.", reversedMeaning: "Emotional weakness, self-sabotage, proud lack of control.", description: "A woman crowned with flowers gently taming the mouth of a majestic lion with determination." },
    hermit: { name: "The Hermit", arcana: "Major", uprightMeaning: "Self-knowledge, introspection, solitary spiritual quest, beacon of wisdom.", reversedMeaning: "Unhealthy isolation, forced solitude, refusal to reflect.", description: "The solitary sage at the mountain top holding a lantern lit by a bright star." },
    wheel_of_fortune: { name: "Wheel of Fortune", arcana: "Major", uprightMeaning: "Cyclic change, inevitable destiny, strokes of luck, dynamic karma.", reversedMeaning: "Bad luck, resistance to the natural flow, repetitive setbacks.", description: "A spinning wheel carved with alchemical symbols, surrounded by esoteric creatures." },
    justice: { name: "Justice", arcana: "Major", uprightMeaning: "Naked truth, karmic balance, honest decisions, and integrity.", reversedMeaning: "Injustices, legal imbalance, lies, or unfair self-pity.", description: "The goddess holding the sword high in one hand and the balanced scale in the other." },
    hanged_man: { name: "The Hanged Man", arcana: "Major", uprightMeaning: "New perspective, voluntary sacrifice, sacred pause, and enlightenment.", reversedMeaning: "Selfish stagnation, useless victimization, or refusal to accept change.", description: "A man suspended upside down with a radiant halo on his head, reinterpreting the world." },
    death: { name: "Death", arcana: "Major", uprightMeaning: "Profound transmutation, completion of cycles, mystical detachment, rebirth.", reversedMeaning: "Resistance to change, unhealthy attachment to the past, forced stagnation.", description: "The skeletal knight in black armor marching over kings and beggars, clearing the ground." },
    temperance: { name: "Temperance", arcana: "Major", uprightMeaning: "Alchemical balance, harmony of energies, emotional healing, and patience.", reversedMeaning: "Uncontrolled excesses, energetic misalignment, stressful conflict.", description: "The angel of harmony pouring pure water between two golden chalices." },
    devil: { name: "The Devil", arcana: "Major", uprightMeaning: "Excessive material attachments, intense carnal pleasures, illusions, and inner shadow.", reversedMeaning: "Liberation from vices, sacred awakening of attachment, healing of cosmic traumas.", description: "The horned creature holding chains around a couple's necks, warning about worldly attachments." },
    tower: { name: "The Tower", arcana: "Major", uprightMeaning: "Sudden rupture, truth abruptly revealed, liberating shock of false structures.", reversedMeaning: "Avoiding necessary crumbling, fear of inevitable collapse.", description: "A stone tower being struck by fiery blue lightning, breaking rigid concepts." },
    star: { name: "The Star", arcana: "Major", uprightMeaning: "Cosmic hope, integral healing, inspiring peace, and faith in the heavens.", reversedMeaning: "Temporary discouragement, bitter skepticism, lack of intuitive brightness.", description: "A woman pouring water on land and ocean under a large radiant eight-pointed star." },
    moon: { name: "The Moon", arcana: "Major", uprightMeaning: "Revealed nightmares, deep intuition, mystery of illusions, and deep secrets of the subconscious.", reversedMeaning: "Awakening of panic, release of vague fears, mysteries becoming clear.", description: "Two dogs howling at the silvery moon at the edge of a pool where a crustacean slowly emerges." },
    sun: { name: "The Sun", arcana: "Major", uprightMeaning: "Success, contagious brightness, vitality, absolute clarity of truth.", reversedMeaning: "Inflatated ego, partial victories, temporary clouds on the solar path.", description: "A radiant child riding a white horse under the golden rays of a smiling, majestic sun." }
  },
  es: {
    fool: { name: "El Loco", arcana: "Mayor", uprightMeaning: "Nuevos comienzos, libertad, espontaneidad, fe en el camino místico.", reversedMeaning: "Irresponsabilidad, riesgos innecesarios, imprudencia o vacilación.", description: "Un joven que camina con entusiasmo hacia el abismo con un perro a su lado." },
    magician: { name: "El Mago", arcana: "Mayor", uprightMeaning: "Poder de manifestación, enfoque, fuerza de voluntad, ingenio cósmico.", reversedMeaning: "Ilusiones, manipulación, potencial desperdiciado o planes insostenibles.", description: "El Mago con las cuatro herramientas elementales, canalizando el infinito celestial." },
    high_priestess: { name: "La Sacerdotisa", arcana: "Mayor", uprightMeaning: "Intuición, subconsciente, misterio sagrado, sabiduría oculta.", reversedMeaning: "Falta de escucha interna, secretos revelados, intuición bloqueada.", description: "Sentada entre pilares de luz y sombra, leyendo un pergamino sagrado." },
    empress: { name: "La Emperatriz", arcana: "Mayor", uprightMeaning: "Abundancia, creatividad, naturaleza divina, maternidad cósmica.", reversedMeaning: "Dependencia, bloqueo creativo, sentimientos de escasez.", description: "Rodeada de fértiles campos de trigo y bosques, coronada de estrellas." },
    emperor: { name: "El Emperador", arcana: "Mayor", uprightMeaning: "Estructura, autoridad justa, estabilidad mundana, liderazgo.", reversedMeaning: "Rigidez excesiva, tiranía, desorganización o falta de control.", description: "Sentado en un trono de piedra tallada con cabezas de carnero." },
    hierophant: { name: "El Hierofante", arcana: "Mayor", uprightMeaning: "Tradición mística, sabiduría espiritual reconocida, educación mística.", reversedMeaning: "Dogmatismo, rebeldía mística, nuevas visiones alternativas.", description: "El pontífice bendiciendo a sus seguidores con llaves de oro en el pecho." },
    lovers: { name: "Los Enamorados", arcana: "Mayor", uprightMeaning: "Elecciones sagradas, alineación de valores, relaciones armoniosas.", reversedMeaning: "Desarmonía, conflicto interno, malas elecciones afectivas.", description: "Una pareja bajo la bendición de un arcángel celestial, simbolizando la dualidad." },
    chariot: { name: "El Carro", arcana: "Mayor", uprightMeaning: "Dirección enfocada, determinación victoriosa, autocontrol y superación.", reversedMeaning: "Falta de rumbo, pérdida de control, agresividad impulsiva.", description: "El comandante heroico guiando a dos esfinges de polaridades opuestas." },
    strength: { name: "La Fuerza", arcana: "Mayor", uprightMeaning: "Compasión, coraje interior, dominio gentil de los instintos feroces.", reversedMeaning: "Debilidad emocional, autossabotaje, descontrol orgulloso.", description: "Una mujer coronada de flores domando suavemente la boca de un león." },
    hermit: { name: "El Ermitaño", arcana: "Mayor", uprightMeaning: "Autoconhecimento, interiorização, busca espiritual solitaria.", reversedMeaning: "Aislamiento enfermizo, soledad forzada, rechazo a reflexionar.", description: "El sabio solitario en la cima de la montaña sosteniendo una linterna." },
    wheel_of_fortune: { name: "La Rueda de la Fortuna", arcana: "Mayor", uprightMeaning: "Cambio cíclico, destino inevitable, golpes de suerte, karma dinámico.", reversedMeaning: "Mala suerte, resistencia al flujo natural, imprevistos repetitivos.", description: "Una rueda giratoria tallada con símbolos alquímicos flutuando en el vacío." },
    justice: { name: "La Justicia", arcana: "Mayor", uprightMeaning: "Verdad desnuda, equilibrio kármico, decisiones honestas e integridad.", reversedMeaning: "Injusticias, desequilibrio legal, mentiras o autopiedad injusta.", description: "La diosa manteniendo la espada erguida en una mano y la balanza de platos." },
    hanged_man: { name: "El Colgado", arcana: "Mayor", uprightMeaning: "Nueva perspectiva, sacrificio voluntario, pausa sagrada e iluminación.", reversedMeaning: "Estancamiento egoísta, victimización inútil o rechazo a aceptar cambios.", description: "Un hombre suspendido boca abajo con una aureola radiante en la cabeza." },
    death: { name: "La Muerte", arcana: "Mayor", uprightMeaning: "Transmutación profunda, conclusión de ciclos, desapego místico, renacimiento.", reversedMeaning: "Resistencia al cambio, apego enfermizo al pasado, estancamiento forzado.", description: "El caballero esquelético con armadura negra desfilando sobre reyes." },
    temperance: { name: "La Templanza", arcana: "Mayor", uprightMeaning: "Equilibrio alquímico, armonía de energías, curación emocional y paciencia.", reversedMeaning: "Excesos descontrolados, desalineación energética, conflicto estresante.", description: "El ángel de la armonía vertiendo agua pura entre dos cálices dorados." },
    devil: { name: "El Diablo", arcana: "Mayor", uprightMeaning: "Apegos materiales excesivos, placeres carnales intensos, ilusiones.", reversedMeaning: "Liberación de vicios, despertar sagrado del apego.", description: "La criatura con cuernos sosteniendo cadenas alrededor de los cuellos de una pareja." },
    tower: { name: "La Torre", arcana: "Mayor", uprightMeaning: "Ruptura repentina, verdad revelada de forma abrupta, choque liberador.", reversedMeaning: "Evitar el desmoronamento necesario, temor al colapso inevitable.", description: "Una torre de piedra siendo alcanzada por un rayo azul ardiente." },
    star: { name: "La Estrella", arcana: "Mayor", uprightMeaning: "Esperanza cósmica, curación integral, paz inspiradora y fe.", reversedMeaning: "Desaliento temporal, escepticismo amargo, falta de brillo intuitivo.", description: "Una mujer derramando agua en la tierra y el océano." },
    moon: { name: "La Luna", arcana: "Mayor", uprightMeaning: "Pesadillas reveladas, intuición profunda, misterios de ilusiones.", reversedMeaning: "El despertar del pánico, liberación de miedos vagos.", description: "Dos perros aullando a la luna plateada en el borde de un estanque." },
    sun: { name: "El Sol", arcana: "Mayor", uprightMeaning: "Éxito, brillo contagioso, vitalidad, claridad absoluta de la verdad.", reversedMeaning: "Orgullo del ego inflado, victorias parciales, nubes temporales.", description: "Un niño radiante montando un caballo blanco bajo los rayos dorados." }
  },
  de: {
    fool: { name: "Der Narr", arcana: "Große", uprightMeaning: "Neuanfänge, Freiheit, Spontaneität, Vertrauen in den mystischen Weg.", reversedMeaning: "Verantwortungslosigkeit, unnötige Risiken, Leichtsinn oder Zögern." },
    magician: { name: "Der Magier", arcana: "Große", uprightMeaning: "Manifestationskraft, Fokus, Willenskraft, kosmischer Einfallsreichtum.", reversedMeaning: "Illusionen, Manipulation, verschwendetes Potenzial." },
    high_priestess: { name: "Die Hohepriesterin", arcana: "Große", uprightMeaning: "Intuition, Unterbewusstsein, heiliges Geheimnis, verborgenes Wissen.", reversedMeaning: "Mangelndes inneres Zuhören, enthüllte Geheimnisse." },
    empress: { name: "Die Herrscherin", arcana: "Große", uprightMeaning: "Fülle, Kreativität, göttliche Natur, kosmische Mutterschaft.", reversedMeaning: "Abhängigkeit, kreative Blockade, Mangelgefühle." },
    emperor: { name: "Der Herrscher", arcana: "Große", uprightMeaning: "Struktur, gerechte Autorität, weltliche Stabilität, Führung.", reversedMeaning: "Übermäßige Starrheit, Tyrannei, Desorganisation." },
    lovers: { name: "Die Liebenden", arcana: "Große", uprightMeaning: "Heilige Entscheidungen, Werteausrichtung, harmonische Beziehungen.", reversedMeaning: "Disziplinlosigkeit, innerer Konflikt." },
    chariot: { name: "Der Wagen", arcana: "Große", uprightMeaning: "Gezielte Richtung, siegreiche Entschlossenheit, Selbstkontrolle.", reversedMeaning: "Orientierungslosigkeit, Kontrollverlust." },
    strength: { name: "Die Kraft", arcana: "Große", uprightMeaning: "Mitgefühl, innerer Mut, sanfte Beherrschung wilder Instinkte.", reversedMeaning: "Emotionale Schwäche, Selbstsabotage." },
    hermit: { name: "Der Eremit", arcana: "Große", uprightMeaning: "Selbsterkenntnis, Verinnerlichung, einsame spirituelle Suche.", reversedMeaning: "Ungesunde Isolation, erzwungene Einsamkeit." },
    wheel_of_fortune: { name: "Das Rad des Schicksals", arcana: "Große", uprightMeaning: "Zyklischer Wandel, unvermeidliches Schicksal, Glückstreffer.", reversedMeaning: "Pech, Widerstand gegen den natürlichen Fluss." },
    justice: { name: "Die Gerechtigkeit", arcana: "Große", uprightMeaning: "Nackte Wahrheit, karmisches Gleichgewicht, ehrliche Entscheidungen.", reversedMeaning: "Ungerechtigkeiten, rechtliches Ungleichgewicht." },
    hanged_man: { name: "Der Gehängte", arcana: "Große", uprightMeaning: "Neue Perspektive, freiwilliges Opfer, heilige Pause und Erleuchtung.", reversedMeaning: "Egoistische Stagnation, nutzlose Opferrolle." },
    death: { name: "Der Tod", arcana: "Große", uprightMeaning: "Tiefgreifende Transformation, Abschluss von Zyklen, Wiedergeburt.", reversedMeaning: "Widerstand gegen Veränderungen, ungesundes Festhalten." },
    temperance: { name: "Die Mäßigkeit", arcana: "Große", uprightMeaning: "Alchemistisches Gleichgewicht, Harmonie der Energien, Heilung.", reversedMeaning: "Unkontrollierte Exzesse, energetische Fehlstellung." },
    devil: { name: "Der Teufel", arcana: "Große", uprightMeaning: "Übermäßige materielle Bindungen, intensive fleischliche Freuden.", reversedMeaning: "Befreiung von Lastern, heiliges Erwachen." },
    tower: { name: "Der Turm", arcana: "Große", uprightMeaning: "Plötzlicher Bruch, abrupt enthüllte Wahrheit, befreiender Schock.", reversedMeaning: "Vermeidung des notwendigen Zusammenbruchs." },
    star: { name: "Der Stern", arcana: "Große", uprightMeaning: "Kosmische Hoffnung, ganzheitliche Heilung, inspirierender Frieden.", reversedMeaning: "Vorübergehende Entmutigung, bitterer Skeptizismus." },
    moon: { name: "Der Mond", arcana: "Große", uprightMeaning: "Enthüllte Alpträume, tiefe Intuition, Geheimnisse des Unterbewusstseins.", reversedMeaning: "Erwachen der Panik, Befreiung von vagen Ängsten." },
    sun: { name: "Die Sonne", arcana: "Große", uprightMeaning: "Erfolg, ansteckende Helligkeit, Vitalität, absolute Klarheit der Wahrheit.", reversedMeaning: "Aufgeblähtes Ego, Teilsiege, vorübergehende Wolken." }
  },
  fr: {
    fool: { name: "Le Fou", arcana: "Majeur", uprightMeaning: "Nouveaux commencements, liberté, spontanéité, foi en la voie mystique.", reversedMeaning: "Irresponsabilité, risques inutiles, imprudence ou hésitation." },
    magician: { name: "Le Bateleur", arcana: "Majeur", uprightMeaning: "Pouvoir de manifestation, concentration, volonté, ingéniosité cosmique.", reversedMeaning: "Illusions, manipulation, potentiel gaspillé." },
    high_priestess: { name: "La Papesse", arcana: "Majeur", uprightMeaning: "Intuition, subconscient, mystère sacré, sagesse occulte.", reversedMeaning: "Manque d'écoute intérieure, secrets révélés." },
    empress: { name: "L'Impératrice", arcana: "Majeur", uprightMeaning: "Abondance, créativité, nature divine, maternité cosmique.", reversedMeaning: "Dépendance, blocage créatif, sentiments de pénurie." },
    emperor: { name: "L'Empereur", arcana: "Majeur", uprightMeaning: "Structure, juste autorité, stabilité terrestre, leadership.", reversedMeaning: "Rigidité excessive, tyrannie, désorganisation." },
    lovers: { name: "L'Amoureux", arcana: "Majeur", uprightMeaning: "Choix sacrés, alignement des valeurs, relations harmonieuses.", reversedMeaning: "Désaccord, conflit interne, mauvais choix affectifs." },
    chariot: { name: "Le Chariot", arcana: "Majeur", uprightMeaning: "Direction ciblée, détermination victorieuse, maîtrise de soi.", reversedMeaning: "Manque de direction, perte de contrôle, agressivité." },
    strength: { name: "La Force", arcana: "Majeur", uprightMeaning: "Compassion, courage intérieur, maîtrise douce des instincts féroces.", reversedMeaning: "Faiblesse émotionnelle, autosabotage." },
    hermit: { name: "L'Ermite", arcana: "Majeur", uprightMeaning: "Connaissance de soi, intériorisation, quête spirituelle solitaire.", reversedMeaning: "Isolement malsain, solitude forcée, refus de réfléchir." },
    wheel_of_fortune: { name: "La Roue de la Fortune", arcana: "Majeur", uprightMeaning: "Changement cyclique, destin inévitable, coups de chance.", reversedMeaning: "Malchance, résistance au flux naturel, revers répétitifs." },
    justice: { name: "La Justice", arcana: "Majeur", uprightMeaning: "Vérité nue, équilibre karmique, décisions honnêtes et intégrité.", reversedMeaning: "Injustices, déséquilibre juridique, mensonges." },
    hanged_man: { name: "Le Pendu", arcana: "Majeur", uprightMeaning: "Nouvelle perspective, sacrifice volontaire, pause sacrée.", reversedMeaning: "Stagnation égoïste, victimisation inutile." },
    death: { name: "La Mort", arcana: "Majeur", uprightMeaning: "Transmutation profonde, fin des cycles, détachement mystique, renaissance.", reversedMeaning: "Résistance au changement, attachement malsain au passé." },
    temperance: { name: "La Tempérance", arcana: "Majeur", uprightMeaning: "Équilibre alchimique, harmonie des énergies, guérison émotionnelle.", reversedMeaning: "Excès incontrôlés, désalignement énergétique." },
    devil: { name: "Le Diable", arcana: "Majeur", uprightMeaning: "Attachements matériels excessifs, plaisirs charnels intenses, illusions.", reversedMeaning: "Libération des vices, éveil sacré de l'attachement." },
    tower: { name: "La Maison Dieu", arcana: "Majeur", uprightMeaning: "Rupture soudaine, vérité révélée de manière abrupte, choc libérateur.", reversedMeaning: "Éviter l'effondrement nécessaire, peur du naufrage." },
    star: { name: "L'Étoile", arcana: "Majeur", uprightMeaning: "Espoir cosmique, guérison intégrale, paix inspirante et foi.", reversedMeaning: "Découragement temporaire, scepticisme amer." },
    moon: { name: "La Lune", arcana: "Majeur", uprightMeaning: "Cauchemars révélés, intuition profonde, secrets du subconscient.", reversedMeaning: "Éveil de la panique, libération des peurs vagues." },
    sun: { name: "Le Soleil", arcana: "Majeur", uprightMeaning: "Succès, éclat contagieux, vitalité, clarté absolue de la vérité.", reversedMeaning: "Orgueil de l'égo gonflé, victoires partielles." }
  }
};

export const TAROT_DECK: TarotCard[] = TAROT_PORTUGUESE_BASE;

export function getTranslatedDeck(): TarotCard[] {
  const lang = getActiveLanguage();
  if (lang === 'pt') return TAROT_PORTUGUESE_BASE;

  return TAROT_PORTUGUESE_BASE.map(card => {
    const translation = TRANSLATIONS_WORLD[lang]?.[card.id] || {};
    return {
      ...card,
      name: translation.name || card.name,
      arcana: translation.arcana || (lang === 'es' ? 'Mayor' : 'Major'),
      uprightMeaning: translation.uprightMeaning || card.uprightMeaning,
      reversedMeaning: translation.reversedMeaning || card.reversedMeaning,
      description: translation.description || card.description
    };
  });
}

export function performTarotReading(question: string): { card: TarotCard; isReversed: boolean; position: 'passado' | 'presente' | 'futuro' | string }[] {
  const deck = getTranslatedDeck();
  
  // Shuffle deck and pick 3 cards
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  
  const lang = getActiveLanguage();
  const positionMap: Record<string, string[]> = {
    pt: ['passado', 'presente', 'futuro'],
    en: ['past', 'present', 'future'],
    es: ['pasado', 'presente', 'futuro'],
    de: ['vergangenheit', 'gegenwart', 'zukunft'],
    fr: ['passé', 'présent', 'futur']
  };

  const positions = positionMap[lang] || positionMap['pt'];
  
  return selected.map((card, idx) => ({
    card,
    isReversed: Math.random() < 0.25, // 25% chance of card reversal
    position: positions[idx]
  }));
}
