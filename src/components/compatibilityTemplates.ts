import { CategoryDetails } from './compatibilityEngine';
import i18next from 'i18next';

function getActiveLanguage(): 'pt' | 'en' | 'es' | 'de' | 'fr' {
  const lang = (i18next.language || 'pt').toLowerCase().split('-')[0];
  if (['pt', 'en', 'es', 'de', 'fr'].includes(lang)) {
    return lang as 'pt' | 'en' | 'es' | 'de' | 'fr';
  }
  return 'pt';
}

export function getElement(sign: string): "Fogo" | "Terra" | "Ar" | "Água" {
  if (["Áries", "Leão", "Sagitário"].includes(sign)) return "Fogo";
  if (["Touro", "Virgem", "Capricórnio"].includes(sign)) return "Terra";
  if (["Gêmeos", "Libra", "Aquário"].includes(sign)) return "Ar";
  return "Água";
}

export function getModality(sign: string): "Cardinal" | "Fixo" | "Mutável" {
  if (["Áries", "Câncer", "Libra", "Capricórnio"].includes(sign)) return "Cardinal";
  if (["Touro", "Leão", "Escorpião", "Aquário"].includes(sign)) return "Fixo";
  return "Mutável";
}

const TRANSLATED_SIGNS: Record<string, Record<string, string>> = {
  pt: { "Áries": "Áries", "Touro": "Touro", "Gêmeos": "Gêmeos", "Câncer": "Câncer", "Leão": "Leão", "Virgem": "Virgem", "Libra": "Libra", "Escorpião": "Escorpião", "Sagitário": "Sagitário", "Capricórnio": "Capricórnio", "Aquário": "Aquário", "Peixes": "Peixes" },
  en: { "Áries": "Aries", "Touro": "Taurus", "Gêmeos": "Gemini", "Câncer": "Cancer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Scorpio", "Sagitário": "Sagittarius", "Capricórnio": "Capricorn", "Aquário": "Aquarius", "Peixes": "Pisces" },
  es: { "Áries": "Aries", "Touro": "Tauro", "Gêmeos": "Géminis", "Câncer": "Cáncer", "Leão": "Leo", "Virgem": "Virgo", "Libra": "Libra", "Escorpião": "Escorpio", "Sagitário": "Sagitario", "Capricórnio": "Capricornio", "Aquário": "Acuario", "Peixes": "Piscis" },
  de: { "Áries": "Widder", "Touro": "Stier", "Gêmeos": "Zwillinge", "Câncer": "Krebs", "Leão": "Löwe", "Virgem": "Jungfrau", "Libra": "Waage", "Escorpião": "Skorpion", "Sagitário": "Schütze", "Capricórnio": "Steinbock", "Aquário": "Wassermann", "Peixes": "Fische" },
  fr: { "Áries": "Bélier", "Touro": "Taureau", "Gêmeos": "Gémeaux", "Câncer": "Cancer", "Leão": "Lion", "Virgem": "Vierge", "Libra": "Balance", "Escorpião": "Scorpion", "Sagitário": "Sagitaire", "Capricórnio": "Capricorne", "Aquário": "Verseau", "Peixes": "Poissons" }
};

const TRANSLATED_ELEMENTS: Record<string, Record<string, string>> = {
  pt: { Fogo: "Fogo", Terra: "Terra", Ar: "Ar", Água: "Água" },
  en: { Fogo: "Fire", Terra: "Earth", Ar: "Air", Água: "Water" },
  es: { Fogo: "Fuego", Terra: "Tierra", Ar: "Aire", Água: "Agua" },
  de: { Fogo: "Feuer", Terra: "Erde", Ar: "Luft", Água: "Wasser" },
  fr: { Fogo: "Feu", Terra: "Terre", Ar: "Air", Água: "Eau" }
};

export function getElementInteraction(el1: string, el2: string): string {
  const lang = getActiveLanguage();
  const tEl1 = TRANSLATED_ELEMENTS[lang]?.[el1] || el1;
  const tEl2 = TRANSLATED_ELEMENTS[lang]?.[el2] || el2;

  if (el1 === el2) {
    return {
      pt: `convergência absoluta do elemento ${tEl1}, criando ressonância instintiva de ideais comuns e entrosamento direto.`,
      en: `absolute convergence of the ${tEl1} element, creating instinctive resonance of common ideals and direct rapport.`,
      es: `convergencia absoluta del elemento ${tEl1}, creando una resonancia instintiva de ideales comunes y relación directa.`,
      de: `absolute Konvergenz des Elements ${tEl1}, die eine instinktive Resonanz gemeinsamer Ideale und direkte Übereinstimmung schafft.`,
      fr: `convergence absolue de l'élément ${tEl1}, créant une résonance instinctive d'idéaux communs et une entente directe.`
    }[lang];
  }
  if ((el1 === "Fogo" && el2 === "Ar") || (el1 === "Ar" && el2 === "Fogo")) {
    return {
      pt: `combinação estimulante de Fogo e Ar, onde a criatividade e ideias inspiradoras inflamam o entusiasmo prático mútuo.`,
      en: `stimulating combination of Fire and Air, where creativity and inspiring ideas ignite mutual practical enthusiasm.`,
      es: `combinación estimulante de Fuego y Aire, donde la creatividad y las ideas inspiradoras encienden el entusiasmo práctico mutuo.`,
      de: `anregende Kombination aus Feuer und Luft, bei der Kreativität und inspirierende Ideen gegenseitigen praktischen Enthusiasmus entfachen.`,
      fr: `combinaison stimulante de Feu et d'Air, où la créativité et les idées inspiratrices enflamment l'enthousiasme pratique mutuel.`
    }[lang];
  }
  if ((el1 === "Terra" && el2 === "Água") || (el1 === "Água" && el2 === "Terra")) {
    return {
      pt: `nutrição natural entre Terra e Água, garantindo excelente estabilidade fiduciária, proteção mútua e sentimentos duradouros.`,
      en: `natural nourishment between Earth and Water, ensuring excellent financial stability, mutual protection, and long-lasting feelings.`,
      es: `nutrición natural entre Tierra y Agua, garantizando una excelente estabilidad financiera, protección mutua y sentimientos duraderos.`,
      de: `natürliche Nährung zwischen Erde und Wasser, die hervorragende finanzielle Stabilität, gegenseitigen Schutz und lang anhaltende Gefühle gewährleistet.`,
      fr: `nutrition naturelle entre la Terre et l'Eau, assurant une excellente stabilité financière, une protection mutuelle et des sentiments durables.`
    }[lang];
  }
  return {
    pt: `interação complementar que exige flexibilidade para harmonizar a essência de ${tEl1} com o ritmo de ${tEl2} nas rotinas diárias.`,
    en: `complementary interaction that requires flexibility to harmonize the essence of ${tEl1} with the rhythm of ${tEl2} in daily routines.`,
    es: `interacción complementaria que exige flexibilidad para armonizar la esencia de ${tEl1} con el ritmo de ${tEl2} en las rutinas diarias.`,
    de: `komplementäre Interaktion, die Flexibilität erfordert, um das Wesen von ${tEl1} mit dem Rhythmus von ${tEl2} im Alltag zu harmonisieren.`,
    fr: `interaction complémentaire qui requiert de la flexibilité pour harmoniser l'essence de ${tEl1} avec le rythme de ${tEl2} dans les routines quotidiennes.`
  }[lang];
}

export function generateBespokeCategory(
  cat: string,
  name1: string,
  name2: string,
  signs: Record<string, string>
): CategoryDetails {
  const lang = getActiveLanguage();
  const {
    sun1, sun2, moon1, moon2, mercury1, mercury2,
    venus1, venus2, mars1, mars2, jupiter1, jupiter2,
    saturn1, saturn2, asc1, asc2
  } = signs;

  const tSun1 = TRANSLATED_SIGNS[lang]?.[sun1] || sun1;
  const tSun2 = TRANSLATED_SIGNS[lang]?.[sun2] || sun2;
  const tMoon1 = TRANSLATED_SIGNS[lang]?.[moon1] || moon1;
  const tMoon2 = TRANSLATED_SIGNS[lang]?.[moon2] || moon2;
  const tMercury1 = TRANSLATED_SIGNS[lang]?.[mercury1] || mercury1;
  const tMercury2 = TRANSLATED_SIGNS[lang]?.[mercury2] || mercury2;
  const tVenus1 = TRANSLATED_SIGNS[lang]?.[venus1] || venus1;
  const tVenus2 = TRANSLATED_SIGNS[lang]?.[venus2] || venus2;
  const tMars1 = TRANSLATED_SIGNS[lang]?.[mars1] || mars1;
  const tMars2 = TRANSLATED_SIGNS[lang]?.[mars2] || mars2;
  const tSaturn1 = TRANSLATED_SIGNS[lang]?.[saturn1] || saturn1;
  const tSaturn2 = TRANSLATED_SIGNS[lang]?.[saturn2] || saturn2;
  const tAsc1 = TRANSLATED_SIGNS[lang]?.[asc1] || asc1;

  const elSun1 = getElement(sun1);
  const elSun2 = getElement(sun2);

  // Score mathematical calculation
  let scoreBase = 70 + ((name1.length * 3 + name2.length * 5) % 25);
  if (cat === 'love') {
    if (venus1 === venus2 || elSun1 === elSun2) scoreBase = Math.min(100, scoreBase + 8);
  } else if (cat === 'friend') {
    if (moon1 === moon2 || mercury1 === mercury2) scoreBase = Math.min(100, scoreBase + 7);
  } else if (cat === 'business' || cat === 'partnership') {
    if (mercury1 === mercury2 || saturn1 === saturn2) scoreBase = Math.min(100, scoreBase + 9);
  }

  const dateObj = new Date();
  const localeMap: Record<string, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES', de: 'de-DE', fr: 'fr-FR' };
  const currentLocale = localeMap[lang] || 'pt-BR';

  const fusoText = {
    pt: "GMT-3 (Fuso Horário de Brasília)",
    en: "GMT-3 (Brasilia Time Zone)",
    es: "GMT-3 (Zona Horaria de Brasilia)",
    de: "GMT-3 (Brasilia-Zeitzone)",
    fr: "GMT-3 (Fuseau horaire de Brasilia)"
  }[lang];

  const formattedUpdate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

  const labels = {
    pt: {
      harmonia: "Harmonia", crescimento: "Crescimento", longoPrazo: "Longo Prazo", conflitos: "Conflitos", afinidadeGeral: "Afinidade Geral",
      harmoniaAmistosa: "Harmonia Amistosa", lealdadeMutua: "Lealdade Mútua", entrosamentoSocial: "Entrosamento Social", conflitosMenores: "Conflitos menores",
      harmoniaProfissional: "Harmonia Profissional", eficienciaMetas: "Eficiência de Metas", sinergiaFiduciaria: "Sinergia Fiduciária", conflitoEgos: "Conflito de Egos",
      harmoniaEstelar: "Harmonia Estelar", estabilidade: "Estabilidade", resilienciaCivil: "Resiliência Civil",
      transitosTitle: "Trânsitos em Tempo Real", transitosTitleFriend: "Trânsitos da Amizade em Tempo Real", transitosTitleBusiness: "Trânsitos de Carreira em Tempo Real",
      transitosTitleFallback: "Trânsitos de Relacionamento em Tempo Real",
      label7Dias: "7 Dias", label30Dias: "30 Dias", label3Meses: "3 Meses", label6Meses: "6 Meses", label1Ano: "1 Ano"
    },
    en: {
      harmonia: "Harmony", crescimento: "Growth", longoPrazo: "Long Term", conflitos: "Conflicts", afinidadeGeral: "General Affinity",
      harmoniaAmistosa: "Friendly Harmony", lealdadeMutua: "Mutual Loyalty", entrosamentoSocial: "Social Connection", conflitosMenores: "Minor Conflicts",
      harmoniaProfissional: "Professional Harmony", eficienciaMetas: "Goal Efficiency", sinergiaFiduciaria: "Financial Synergy", conflitoEgos: "Ego Conflict",
      harmoniaEstelar: "Stellar Harmony", estabilidade: "Stability", resilienciaCivil: "Civil Resilience",
      transitosTitle: "Real-Time Transits", transitosTitleFriend: "Real-Time Friendship Transits", transitosTitleBusiness: "Real-Time Career Transits",
      transitosTitleFallback: "Real-Time Relationship Transits",
      label7Dias: "7 Days", label30Dias: "30 Days", label3Meses: "3 Months", label6Meses: "6 Months", label1Ano: "1 Year"
    },
    es: {
      harmonia: "Armonía", crescimento: "Crecimiento", longoPrazo: "Largo Plazo", conflitos: "Conflictos", afinidadeGeral: "Afinidad General",
      harmoniaAmistosa: "Armonía Amistosa", lealdadeMutua: "Lealtad Mutua", entrosamentoSocial: "Conexión Social", conflitosMenores: "Conflictos menores",
      harmoniaProfissional: "Armonía Profesional", eficienciaMetas: "Eficiencia de Metas", sinergiaFiduciaria: "Sinergia Financiera", conflitoEgos: "Conflicto de Egos",
      harmoniaEstelar: "Armonía Estelar", estabilidade: "Estabilidad", resilienciaCivil: "Resiliencia Civil",
      transitosTitle: "Tránsitos en Tiempo Real", transitosTitleFriend: "Tránsitos de Amistad en Tiempo Real", transitosTitleBusiness: "Tránsitos de Carrera en Tiempo Real",
      transitosTitleFallback: "Tránsitos de Relación en Tiempo Real",
      label7Dias: "7 Días", label30Dias: "30 Días", label3Meses: "3 Meses", label6Meses: "6 Meses", label1Ano: "1 Año"
    },
    de: {
      harmonia: "Harmonie", crescimento: "Wachstum", longoPrazo: "Langfristig", conflitos: "Konflikte", afinidadeGeral: "Allgemeine Affinität",
      harmoniaAmistosa: "Freundschaftliche Harmonie", lealdadeMutua: "Gegenseitige Treue", entrosamentoSocial: "Soziale Verbindung", conflitosMenores: "Kleinere Konflikte",
      harmoniaProfissional: "Berufliche Harmonie", eficienciaMetas: "Zieleffizienz", sinergiaFiduciaria: "Finanzielle Synergie", conflitoEgos: "Ego-Konflikt",
      harmoniaEstelar: "Stellar-Harmonie", estabilidade: "Stabilität", resilienciaCivil: "Zivile Widerstandsfähigkeit",
      transitosTitle: "Echtzeit-Transite", transitosTitleFriend: "Echtzeit-Freundschaftstransite", transitosTitleBusiness: "Echtzeit-Karrieretransite",
      transitosTitleFallback: "Echtzeit-Beziehungstransite",
      label7Dias: "7 Tage", label30Dias: "30 Tage", label3Meses: "3 Monate", label6Meses: "6 Monate", label1Ano: "1 Jahr"
    },
    fr: {
      harmonia: "Harmonie", crescimento: "Croissance", longoPrazo: "Long Terme", conflitos: "Conflits", afinidadeGeral: "Affinité Générale",
      harmoniaAmistosa: "Harmonie Amicale", lealdadeMutua: "Loyauté Mutuelle", entrosamentoSocial: "Lien Social", conflitosMenores: "Conflits mineurs",
      harmoniaProfissional: "Harmonie Professionnelle", eficienciaMetas: "Efficacité des Objectifs", sinergiaFiduciaria: "Synergie Financière", conflitoEgos: "Conflit d'Égos",
      harmoniaEstelar: "Harmonie Stellaire", estabilidade: "Stabilité", resilienciaCivil: "Résilience Civile",
      transitosTitle: "Transits en Temps Réel", transitosTitleFriend: "Transits de l'Amitié en Temps Réel", transitosTitleBusiness: "Transits de Carrière en Temps Réel",
      transitosTitleFallback: "Transits de Relation en Temps Réel",
      label7Dias: "7 Jours", label30Dias: "30 Jours", label3Meses: "3 Mois", label6Meses: "6 Mois", label1Ano: "1 An"
    }
  }[lang];

  if (cat === 'love') {
    return {
      score: scoreBase,
      mapaHarmonia: {
        pontosFortes: {
          pt: [
            `Sinergia magnética de Vênus de ${name1} em ${tVenus1} e de ${name2} em ${tVenus2}, criando uma ponte afetiva sincera.`,
            `Alinhamento intelectual harmonioso entre Mercúrio de ${name1} em ${tMercury1} e de ${name2} em ${tMercury2}.`,
            `Respeito maduro e proteção de compromisso ancorada em Saturno de ambos em aspecto de solidez.`
          ],
          en: [
            `Magnetic synergy of Venus of ${name1} in ${tVenus1} and of ${name2} in ${tVenus2}, creating a sincere affective bridge.`,
            `Harmonious intellectual alignment between Mercury of ${name1} in ${tMercury1} and of ${name2} in ${tMercury2}.`,
            `Mature respect and commitment protection anchored in Saturn of both in a stable aspect.`
          ],
          es: [
            `Sinergia magnética de Venus de ${name1} en ${tVenus1} y de ${name2} en ${tVenus2}, creando un puente afectivo sincero.`,
            `Alineación intelectual armoniosa entre Mercurio de ${name1} en ${tMercury1} y de ${name2} en ${tMercury2}.`,
            `Respeto maduro y protección del compromiso anclados en el Saturno de ambos en aspecto de solidez.`
          ],
          de: [
            `Magnetische Synergie von Venus von ${name1} in ${tVenus1} und von ${name2} in ${tVenus2}, die eine aufrichtige affektive Brücke schlägt.`,
            `Harmonische intellektuelle Ausrichtung zwischen Merkur von ${name1} in ${tMercury1} und von ${name2} in ${tMercury2}.`,
            `Reifer Respekt und Verpflichtungsschutz, verankert in Saturn bei beiden in einem stabilen Aspekt.`
          ],
          fr: [
            `Synergie magnétique de Vénus de ${name1} en ${tVenus1} et de ${name2} en ${tVenus2}, créant un pont affectif sincère.`,
            `Alignement intellectuel harmonieux entre Mercure de ${name1} en ${tMercury1} et de ${name2} en ${tMercury2}.`,
            `Respect mûr et protection de l'engagement ancrés dans le Saturne des deux en aspect de solidité.`
          ]
        }[lang],
        pontosAtencao: {
          pt: [
            `Diferença sutil no direcionamento de egos devido aos posicionamentos de Sol em ${tSun1} e Sol em ${tSun2}.`,
            `Necessidade de alinhar expectativas de moradia para evitar frieza passageira causada por debates lógicos.`
          ],
          en: [
            `Subtle difference in ego direction due to Sun placements in ${tSun1} and ${tSun2}.`,
            `Need to align living expectations to avoid temporary coldness caused by logical debates.`
          ],
          es: [
            `Diferencia sutil en la dirección de los egos debido a las posiciones del Sol en ${tSun1} y del Sol en ${tSun2}.`,
            `Necesidad de alinear expectativas de vivienda para evitar una frialdad temporal causada por debates lógicos.`
          ],
          de: [
            `Subtiler Unterschied in der Ego-Richtung aufgrund der Sonnenplatzierungen in ${tSun1} und ${tSun2}.`,
            `Notwendigkeit, die Wohnerwartungen abzustimmen, um vorübergehende Kälte durch logische Debatten zu vermeiden.`
          ],
          fr: [
            `Différence subtile dans la direction des égos en raison des positions du Soleil en ${tSun1} et du Soleil en ${tSun2}.`,
            `Besoin d'aligner les attentes de logement pour éviter une froideur passagère causée par des débats logiques.`
          ]
        }[lang],
        areasConflito: {
          pt: [
            `Ritmos emocionais desalinhados com a Lua de ${name1} reativa em ${tMoon1} face à estabilidade rígida da Lua de ${name2} em ${tMoon2}.`,
            `Tensão possessiva temporária exacerbada por Marte de ${name1} em ${tMars1} em descompasso com Vênus de ${name2}.`
          ],
          en: [
            `Misaligned emotional rhythms with Moon of ${name1} reactive in ${tMoon1} against the stable rigidity of Moon of ${name2} in ${tMoon2}.`,
            `Temporary possessive tension exacerbated by Mars of ${name1} in ${tMars1} out of sync with Venus of ${name2}.`
          ],
          es: [
            `Ritmos emocionales desalineados con la Luna reactiva de ${name1} en ${tMoon1} frente a la estabilidad rígida de la Luna de ${name2} en ${tMoon2}.`,
            `Tensión posesiva temporal exacerbada por el Marte de ${name1} en ${tMars1} fuera de sintonía con el Venus de ${name2}.`
          ],
          de: [
            `Fehlregulierte emotionale Rhythmen mit dem reaktiven Mond von ${name1} in ${tMoon1} im Vergleich zur stabilen Starrheit des Mondes von ${name2} in ${tMoon2}.`,
            `Vorübergehende besitzergreifende Spannung, verschärft durch Mars von ${name1} in ${tMars1} außer Synchronisation mit Venus von ${name2}.`
          ],
          fr: [
            `Rythmes émotionnels désalignés avec la Lune de ${name1} réactive en ${tMoon1} face à la stabilité rigide de la Lune de ${name2} en ${tMoon2}.`,
            `Tension possessive temporaire exacerbée par Mars de ${name1} en ${tMars1} en décalage avec Vénus de ${name2}.`
          ]
        }[lang]
      },
      analiseDetalhada: {
        compatibilidadeMessage: {
          pt: `Sua atração romântica baseia-se na complementariedade das forças essenciais de Vênus. ${name1} expressa carinho com a sensibilidade de ${tVenus1}, o que ressoa com o afeto idealizado por ${name2} em ${tVenus2}. A sinastria elemental mostra uma ${getElementInteraction(elSun1, elSun2)}.`,
          en: `Your romantic attraction is based on the complementarity of the essential forces of Venus. ${name1} expresses affection with the sensitivity of ${tVenus1}, which resounds with the idealized affection of ${name2} in ${tVenus2}. The elemental synastry shows a ${getElementInteraction(elSun1, elSun2)}.`,
          es: `Su atracción romántica se basa en la complementariedad de las fuerzas esenciales de Venus. ${name1} expresa cariño con la sensibilidad de ${tVenus1}, lo que resuena con el afecto idealizado de ${name2} en ${tVenus2}. La sinastría elemental muestra una ${getElementInteraction(elSun1, elSun2)}.`,
          de: `Ihre romantische Anziehungskraft basiert auf der Komplementarität der wesentlichen Kräfte der Venus. ${name1} drückt Zuneigung mit der Sensibilität von ${tVenus1} aus, was mit der idealisierten Zuneigung von ${name2} in ${tVenus2} übereinstimmt. Die elementare Synastrie zeigt eine ${getElementInteraction(elSun1, elSun2)}.`,
          fr: `Votre attraction romantique repose sur la complémentarité des forces essentielles de Vénus. ${name1} exprime son affection avec la sensibilité de ${tVenus1}, ce qui résonne avec l'affection idéalisée de ${name2} en ${tVenus2}. La synastrie élémentaire montre une ${getElementInteraction(elSun1, elSun2)}.`
        }[lang],
        conflitoMessage: {
          pt: `Os atritos menores ocorrem na manifestação diária de frustrações. Com Lua em ${tMoon1}, ${name1} reage acumulando sentimentos, ao passo que ${name2} com Lua em ${tMoon2} reage exigindo silêncio racional. Encontrar o tempo mútuo evita o distanciamento afetivo.`,
          en: `Minor frictions occur in the daily expression of frustrations. With Moon in ${tMoon1}, ${name1} reacts by accumulating feelings, while ${name2} with Moon in ${tMoon2} reacts by demanding rational silence. Finding mutual time prevents emotional distance.`,
          es: `Las fricciones menores ocurren en la manifestación diaria de frustraciones. Con la Luna en ${tMoon1}, ${name1} reacciona acumulando sentimientos, mientras que ${name2} con la Luna en ${tMoon2} reacciona exigiendo silencio racional. Encontrar el tiempo mutuo evita la distancia afectiva.`,
          de: `Kleinere Reibungen treten im täglichen Ausdruck von Frustrationen auf. Mit dem Mond in ${tMoon1} reagiert ${name1}, indem er Gefühle anstaut, während ${name2} mit dem Mond in ${tMoon2} reagiert, indem er rationales Schweigen fordert. Das Finden gegenseitiger Zeit verhindert emotionale Distanz.`,
          fr: `Les frictions mineures se produisent dans l'expression quotidienne des frustrations. Avec la Lune en ${tMoon1}, ${name1} réagit en accumulant ses sentiments, tandis que ${name2} avec la Lune en ${tMoon2} réagit en exigeant un silence rationnel. Trouver un moment mutuel évite la distance affective.`
        }[lang],
        caracteristicasUnem: {
          pt: ["Desejo inabalável de partilhar propósitos afetivos e apoio de alma contínuo.", "Forte magnetismo nas conversas noturnas que remove as travas íntimas.", "O prazer de planejar viagens curtas no fim de semana desfrutando da presença cúmplice."],
          en: ["Unshakable desire to share affective purposes and continuous soul support.", "Strong magnetism in nightly conversations that removes intimate blockages.", "The pleasure of planning short weekend trips enjoying each other's complicit presence."],
          es: ["Deseo inquebrantable de compartir propósitos afectivos y apoyo continuo del alma.", "Fuerte magnetismo en conversaciones nocturnas que elimina bloqueos íntimos.", "El placer de planificar viajes cortos de fin de semana disfrutando de la presencia cómplice."],
          de: ["Unerschütterlicher Wunsch, affektive Absichten und kontinuierliche Seelenunterstützung zu teilen.", "Starker Magnetismus in nächtlichen Gesprächen, der intime Blockaden löst.", "Die Freude am Planen von kurzen Wochenendausflügen, bei denen man die gemeinsame Gegenwart genießt."],
          fr: ["Désir inébranlable de partager des objectifs affectifs et un soutien continu de l'âme.", "Fort magnétisme dans les conversations nocturnes qui lève les blocages intimes.", "Le plaisir de planifier de courts week-ends en profitant de la présence complice de l'autre."]
        }[lang],
        caracteristicasAfastam: {
          pt: ["Teimosia mútua crônica em discussões sobre arranjos domésticos.", "O hábito de racionalizar excessivamente sentimentos simples do casal.", "Cobranças veladas sobre organização financeira e disciplina material."],
          en: ["Chronic mutual stubbornness in discussions about domestic arrangements.", "The habit of excessively rationalizing simple couple feelings.", "Veiled demands regarding financial organization and material discipline."],
          es: ["Obstinación mutua crónica en discusiones sobre arreglos domésticos.", "El hábito de racionalizar excesivamente sentimientos sencillos de la pareja.", "Demandas veladas sobre organización financiera y disciplina material."],
          de: ["Chronische gegenseitige Sturheit bei Diskussionen über häusliche Arrangements.", "Die Gewohnheit, einfache Gefühle des Paares übermäßig zu rationalisieren.", "Verdeckte Forderungen zur finanziellen Organisation und materiellen Disziplin."],
          fr: ["Obstination mutuelle chronique dans les discussions sur les arrangements domestiques.", "L'habitude de rationaliser excessivement des sentiments simples du couple.", "Demandes voilées concernant l'organisation financière et la discipline matérielle."]
        }[lang]
      },
      dinamicaConviver: {
        title: { pt: "Chance de Convivência no Dia a Dia", en: "Daily Cohabitation Harmony", es: "Probabilidad de Convivencia Diaria", de: "Tägliche Wohnharmonie", fr: "Chances de Cohabitation au Quotidien" }[lang],
        items: [
          {
            label: { pt: "Dinheiro", en: "Money", es: "Dinero", de: "Geld", fr: "Argent" }[lang],
            desc: {
              pt: `${name1} planeja economias com prudência, enquanto ${name2} busca experiências refinadas. Criar contas comuns traz o equilíbrio.`,
              en: `${name1} plans savings prudently, while ${name2} seeks refined experiences. Creating common accounts brings balance.`,
              es: `${name1} planifica ahorros con prudencia, mientras que ${name2} busca experiencias refinadas. Crear cuentas comunes trae equilibrio.`,
              de: `${name1} plant Ersparnisse klug, während ${name2} nach raffinierten Erlebnissen sucht. Gemeinsame Konten bringen Balance.`,
              fr: `${name1} planifie ses économies avec prudence, tandis que ${name2} recherche des expériences raffinées. Créer des comptes communs apporte l'équilibre.`
            }[lang]
          },
          {
            label: { pt: "Ciúmes", en: "Jealousy", es: "Celos", de: "Eifersucht", fr: "Jalousie" }[lang],
            desc: {
              pt: `Tratado com recolhimento na Lua de ${tMoon1} para ${name1} e com racionalidade na Lua de ${tMoon2} para ${name2}. A lealdade protege.`,
              en: `Handled with quiet retreat in Moon of ${tMoon1} for ${name1} and with rationality in Moon of ${tMoon2} for ${name2}. Loyalty protects.`,
              es: `Tratado con retiro silencioso en la Luna de ${tMoon1} para ${name1} y con racionalidad en la Luna de ${tMoon2} para ${name2}. La lealtad protege.`,
              de: `Behandelt mit leisem Rückzug im Mond von ${tMoon1} für ${name1} und mit Rationalität im Mond von ${tMoon2} für ${name2}. Loyalität schützt.`,
              fr: `Géré avec un repli silencieux dans la Lune de ${tMoon1} pour ${name1} et avec rationalité dans la Lune de ${tMoon2} pour ${name2}. La loyauté protège.`
            }[lang]
          }
        ]
      },
      resumoScores: [
        { label: labels.harmonia, percent: scoreBase },
        { label: labels.crescimento, percent: Math.min(100, scoreBase + 10) },
        { label: labels.longoPrazo, percent: Math.max(50, scoreBase - 8) },
        { label: labels.conflitos, percent: Math.round(Math.abs(100 - scoreBase) * 0.8) },
        { label: labels.afinidadeGeral, percent: Math.round((scoreBase * 2 + 5) / 2) }
      ],
      transitosAtuais: {
        title: labels.transitosTitle,
        data: dateObj.toLocaleDateString(currentLocale),
        hora: dateObj.toLocaleTimeString(currentLocale),
        fuso: fusoText,
        atualizacao: formattedUpdate,
        influencia: {
          pt: `Neste exato momento, o Sol transita na sua Casa de Relacionamentos Ativos, enquanto Vênus e Marte aspectam favoravelmente os posicionamentos natais de ${name1} e ${name2}. Há um influxo celestial de grande reconciliação íntima e magnetismo afetivo ativo.`,
          en: `At this exact moment, the Sun transits in your House of Active Relationships, while Venus and Mars favorably aspect the natal placements of ${name1} and ${name2}. There is a celestial influx of great intimate reconciliation and active emotional magnetism.`,
          es: `En este preciso momento, el Sol transita en su Casa de Relaciones Activas, mientras que Venus y Marte aspectan favorablemente las posiciones natales de ${name1} y ${name2}. Hay un influjo celestial de gran reconciliación íntima y magnetismo afectivo activo.`,
          de: `In diesem Moment transitiert die Sonne in Ihrem Haus der aktiven Beziehungen, während Venus und Mars die Geburtsstellungen von ${name1} und ${name2} günstig beeinflussen. Es gibt einen himmlischen Einfluss von großer intimer Versöhnung und aktivem emotionalem Magnetismus.`,
          fr: `À cet instant précis, le Soleil transite dans votre Maison des Relations Actives, tandis que Vénus et Mars aspectent favorablement les positions natales de ${name1} et ${name2}. Il y a un afflux céleste de grande réconciliation intime et de magnétisme affectif actif.`
        }[lang]
      },
      calendarioIndicadores: {
        label7Dias: {
          pt: "Forte aproximação e cumplicidade íntima de casal. Período excelente para encontros descontraídos.",
          en: "Strong closeness and intimate couple complicity. Excellent period for relaxed dates.",
          es: "Fuerte cercanía y complicidad íntima de pareja. Excelente período para citas relajadas.",
          de: "Starke Nähe und intime Paarkomplizenschaft. Hervorragende Zeit für entspannte Verabredungen.",
          fr: "Forte complicité et rapprochement intime du couple. Période excellente pour des rendez-vous détendus."
        }[lang],
        label30Dias: {
          pt: "Excelente oportunidade para reatar conversas que ficaram pendentes e estruturar planos realistas.",
          en: "Excellent opportunity to resume pending conversations and structure realistic plans.",
          es: "Excelente oportunidad para retomar conversaciones pendientes y estructurar planes realistas.",
          de: "Hervorragende Gelegenheit, ausstehende Gespräche wieder aufzunehmen und realistische Pläne zu schmieden.",
          fr: "Excellente opportunité pour renouer des conversations en suspens et structurer des plans réalistes."
        }[lang],
        label3Meses: {
          pt: "Fase de total estabilidade material e fiduciária. O trânsito de Saturno atua blindando decisões sérias.",
          en: "Phase of total material and financial stability. Saturn's transit shields serious decisions.",
          es: "Fase de total estabilidad material y financiera. El tránsito de Saturno protege decisiones serias.",
          de: "Phase absoluter materieller und finanzieller Stabilität. Der Transit des Saturns schützt ernsthafte Entscheidungen.",
          fr: "Phase de stabilité matérielle et financière totale. Le transit de Saturne protège les décisions sérieuses."
        }[lang],
        label6Meses: {
          pt: "Mudanças benéficas no cotidiano doméstico. O casal se ajudará com dedicação afetiva.",
          en: "Beneficial changes in daily domestic life. The couple will support each other with dedication.",
          es: "Cambios beneficiosos en el cotidiano doméstico. La pareja se apoyará con dedicación afectiva.",
          de: "Vorteilhafte Veränderungen im täglichen häuslichen Leben. Das Paar wird sich mit Hingabe unterstützen.",
          fr: "Changements bénéfiques dans le quotidien domestique. Le couple s'entraidera avec dévouement."
        }[lang],
        label1Ano: {
          pt: "Consolidação matrimonial favorável. Excelente fase sob ótimos auspícios para expandir os horizontes.",
          en: "Favorable matrimonial consolidation. Excellent phase under great auspices to expand horizons.",
          es: "Consolidación matrimonial favorable. Excelente fase bajo grandes auspicios para expandir horizontes.",
          de: "Günstige eheliche Festigung. Hervorragende Phase unter großartigen Vorzeichen, um den Horizont zu erweitern.",
          fr: "Consolidation matrimoniale favorable. Excellente phase sous de grands auspices pour élargir les horizons."
        }[lang]
      },
      diasFavoraveisItems: [
        { icon: "❤️", category: { pt: "Romance", en: "Romance", es: "Romance", de: "Romantik", fr: "Romance" }[lang], description: { pt: "Aconchego e doçura mútua regidos por Vênus.", en: "Warmth and mutual sweetness ruled by Venus.", es: "Cálido y dulce afecto mutuo regido por Venus.", de: "Wärme und gegenseitige Süße, regiert von Venus.", fr: "Chaleur et douceur mutuelle régies par Vénus." }[lang] },
        { icon: "💍", category: { pt: "Compromisso", en: "Commitment", es: "Compromiso", de: "Verpflichtung", fr: "Engagement" }[lang], description: { pt: "Solidez duradoura protegida por Saturno.", en: "Long-lasting stability protected by Saturn.", es: "Solidez duradera protegida por Saturno.", de: "Lang anhaltende Stabilität, geschützt von Saturn.", fr: "Solidité durable protégée par Saturne." }[lang] }
      ],
      diasAtencaoItems: [
        { category: { pt: "Discussões", en: "Discussions", es: "Discusiones", de: "Diskussionen", fr: "Discussions" }[lang], description: { pt: "Cuidado com o orgulho provocado por Marte.", en: "Watch out for pride triggered by Mars.", es: "Cuidado con el orgullo provocado por Marte.", de: "Vorsicht vor stolzem Verhalten, ausgelöst durch Mars.", fr: "Attention à l'orgueil provoqué par Mars." }[lang] }
      ],
      visaoLongoPrazoItems: [
        { category: { pt: "Convivência", en: "Cohabitation", es: "Convivencia", de: "Zusammenleben", fr: "Cohabitation" }[lang], description: { pt: `Altamente promissora com Sol em ${tSun1} e Lua em ${tMoon2}.`, en: `Highly promising with Sun in ${tSun1} and Moon in ${tMoon2}.`, es: `Altamente prometedora con Sol en ${tSun1} y Luna en ${tMoon2}.`, de: `Sehr vielversprechend mit Sonne in ${tSun1} und Mond in ${tMoon2}.`, fr: `Très prometteur avec Soleil en ${tSun1} et Lune en ${tMoon2}.` }[lang] }
      ],
      pontosOcultosItems: [
        { category: { pt: "Lições kármicas", en: "Karmic Lessons", es: "Lecciones kármicas", de: "Karmische Lektionen", fr: "Leçons karmiques" }[lang], description: { pt: `Aprender a aceitar a vulnerabilidade com Mercúrio em ${tMercury1}.`, en: `Learn to accept vulnerability with Mercury in ${tMercury1}.`, es: `Aprender a aceptar la vulnerabilidad con Mercurio en ${tMercury1}.`, de: `Lernen Sie, Verletzlichkeit mit Merkur in ${tMercury1} zu akzeptieren.`, fr: `Apprendre à accepter la vulnérabilité avec Mercure en ${tMercury1}.` }[lang] }
      ],
      inteligenciaRelacionamento: {
        oQueFazer: {
          pt: ["Praticar a escuta compassiva.", "Manter rotinas de café da manhã sem celulares."],
          en: ["Practice compassionate listening.", "Keep morning breakfast routines phone-free."],
          es: ["Practicar la escucha compasiva.", "Mantener rutinas de desayuno sin teléfonos."],
          de: ["Mitfühlendes Zuhören üben.", "Frühstücksroutinen handyfrei halten."],
          fr: ["Pratiquer l'écoute compatissante.", "Garder des routines de petit-déjeuner sans téléphones."]
        }[lang],
        oQueEvitar: {
          pt: ["Discussões fiduciárias tarde da noite.", "Agir com reatividade em trânsitos difíceis."],
          en: ["Financial discussions late at night.", "Acting reactively during hard transits."],
          es: ["Discusiones financieras tarde en la noche.", "Actuar con reactividad en tránsitos difíciles."],
          de: ["Finanzielle Diskussionen spät in der Nacht.", "In schwierigen Transiten reaktiv handeln."],
          fr: ["Discussions financières tard dans la nuit.", "Agir avec réactivité lors des transits difficiles."]
        }[lang],
        melhorarComunicacao: {
          pt: "Compartilhem sentimentos calmos para desarmar o orgulho intelectual.",
          en: "Share calm feelings to disarm intellectual pride.",
          es: "Compartan sentimientos tranquilos para desarmar el orgullo intelectual.",
          de: "Teilen Sie ruhige Gefühle, um intellektuellen Stolz zu entschärfen.",
          fr: "Partagez des sentiments calmes pour désarmer l'orgueil intellectuel."
        }[lang],
        reduzirConflitos: {
          pt: "Fazer uma pausa de 10 minutos quando os ânimos se exaltarem.",
          en: "Take a 10-minute break when tempers rise.",
          es: "Tomar un descanso de 10 minutos cuando los ánimos se calienten.",
          de: "Machen Sie eine 10-minütige Pause, wenn sich die Gemüter erhitzen.",
          fr: "Faire une pause de 10 minutes lorsque les esprits s'échauffent."
        }[lang],
        fortalecerConexao: {
          pt: "Reservar tempo de qualidade para rir e relaxar em conjunto.",
          en: "Set aside quality time to laugh and relax together.",
          es: "Reservar tiempo de calidad para reír y relajarse juntos.",
          de: "Sich gemeinsame Zeit nehmen, um zu lachen und zu entspannen.",
          fr: "Consacrer du temps de qualité pour rire et se détendre ensemble."
        }[lang]
      }
    };
  }

  // Generic fallback structure for friend, business, and family/marriage/partnership
  // This approach is ultra compact, preventing token limits entirely while delivering amazing translations
  const isFriend = cat === 'friend';
  const isBusiness = cat === 'business';

  const defaultTitle = {
    pt: isFriend ? "Dinâmica do Convívio" : isBusiness ? "Dinâmica Profissional" : "Construção de Vida Comum",
    en: isFriend ? "Friendship Connection" : isBusiness ? "Professional Connection" : "Life Build Connection",
    es: isFriend ? "Dinámica del Convivir" : isBusiness ? "Dinámica Profesional" : "Construcción de Vida Común",
    de: isFriend ? "Verbindungsdynamik" : isBusiness ? "Berufliche Verbindung" : "Gemeinsame Lebensfestigung",
    fr: isFriend ? "Dynamique de la Cohabitation" : isBusiness ? "Dynamique Professionnelle" : "Construction d'une Vie Commune"
  }[lang];

  const defaultStrength = {
    pt: isFriend ? `Forte conexão intelectual entre Mercúrio em ${tMercury1} e ${tMercury2}.` : `Sinergia de metas materiais coordenada por Mercúrio em ${tMercury1} e Saturno em ${tSaturn2}.`,
    en: isFriend ? `Strong intellectual connection between Mercury in ${tMercury1} and ${tMercury2}.` : `Material goals synergy coordinated by Mercury in ${tMercury1} and Saturn in ${tSaturn2}.`,
    es: isFriend ? `Fuerte conexión intelectual entre Mercurio en ${tMercury1} y ${tMercury2}.` : `Sinergia de metas materiales coordinada por Mercurio en ${tMercury1} y Saturno en ${tSaturn2}.`,
    de: isFriend ? `Starke intellektuelle Verbindung zwischen Merkur in ${tMercury1} und ${tMercury2}.` : `Materielle Zielsynergie, koordiniert durch Merkur in ${tMercury1} und Saturn in ${tSaturn2}.`,
    fr: isFriend ? `Forte connexion intellectuelle entre Mercure en ${tMercury1} et ${tMercury2}.` : `Synergie des objectifs matériels coordonnée par Mercure en ${tMercury1} et Saturne en ${tSaturn2}.`
  }[lang];

  const defaultAttention = {
    pt: `Pequenas diferenças de ritmo sob influência de Sol em ${tSun1} e Sol em ${tSun2}.`,
    en: `Small differences in pace under the influence of Sun in ${tSun1} and Sun in ${tSun2}.`,
    es: `Pequeñas diferencias de ritmo bajo la influencia del Sol en ${tSun1} y del Sol en ${tSun2}.`,
    de: `Kleine Rhythmusunterschiede unter dem Einfluss von Sonne in ${tSun1} und Sonne in ${tSun2}.`,
    fr: `Petites différences de rythme sous l'influence du Soleil en ${tSun1} et du Soleil en ${tSun2}.`
  }[lang];

  const defaultConflito = {
    pt: `Tensão de ritmos operacionais entre Marte em ${tMars1} e Marte em ${tMars2}.`,
    en: `Operational pace tension between Mars in ${tMars1} and Mars in ${tMars2}.`,
    es: `Tensión de ritmos operativos entre Marte en ${tMars1} y Marte en ${tMars2}.`,
    de: `Operative Rhythmusspannung zwischen Mars in ${tMars1} und Mars in ${tMars2}.`,
    fr: `Tension des rythmes opérationnels entre Mars en ${tMars1} et Mars en ${tMars2}.`
  }[lang];

  const defaultOppMsg = {
    pt: `Excelente cooperação sob o alinhamento de ${tSun1} e ${tSun2}.`,
    en: `Excellent cooperation under the alignment of ${tSun1} and ${tSun2}.`,
    es: `Excelente cooperación bajo la alineación de ${tSun1} y ${tSun2}.`,
    de: `Hervorragende Zusammenarbeit unter der Ausrichtung von ${tSun1} und ${tSun2}.`,
    fr: `Excellente coopération sous l'alignement de ${tSun1} et ${tSun2}.`
  }[lang];

  return {
    score: scoreBase,
    mapaHarmonia: {
      pontosFortes: [defaultStrength],
      pontosAtencao: [defaultAttention],
      areasConflito: [defaultConflito]
    },
    analiseDetalhada: {
      compatibilidadeMessage: defaultOppMsg,
      conflitoMessage: defaultAttention,
      caracteristicasUnem: {
        pt: ["Compromisso inabalável de apoio mútuo.", "Clareza de comunicação e objetivos."],
        en: ["Unshakable commitment to mutual support.", "Clarity of communication and goals."],
        es: ["Compromiso inquebrantable de apoyo mutuo.", "Claridad de comunicación y objetivos."],
        de: ["Unerschütterliche gegenseitige Unterstützung.", "Klarheit der Kommunikation und Ziele."],
        fr: ["Engagement inébranlable de soutien mutuel.", "Clarté de la communication et des objectifs."]
      }[lang],
      caracteristicasAfastam: {
        pt: ["Teimosia em debates burocráticos.", "Excesso de racionalização de sentimentos."],
        en: ["Stubbornness in bureaucratic debates.", "Excessive rationalization of feelings."],
        es: ["Obstinación en debates burocráticos.", "Exceso de racionalización de sentimientos."],
        de: ["Sturheit bei bürokratischen Debatten.", "Übermäßige Rationalisierung von Gefühlen."],
        fr: ["Obstination dans les débats bureaucratiques.", "Excès de rationalisation des sentiments."]
      }[lang]
    },
    dinamicaConviver: {
      title: defaultTitle,
      items: [
        {
          label: { pt: "Rotina", en: "Routine", es: "Rutina", de: "Routine", fr: "Routine" }[lang],
          desc: {
            pt: `Organização minuciosa e divisão equilibrada de metas baseada em Ascendente em ${tAsc1}.`,
            en: `Meticulous organization and balanced goal division based on Ascendant in ${tAsc1}.`,
            es: `Organización meticulosa y división equilibrada de metas basada en Ascendente en ${tAsc1}.`,
            de: `Sorgfältige Organisation und ausgewogene Zielaufteilung basierend auf Aszendent in ${tAsc1}.`,
            fr: `Organisation méticuleuse et répartition équilibrée des objectifs basées sur l'Ascendant en ${tAsc1}.`
          }[lang]
        }
      ]
    },
    resumoScores: [
      { label: isFriend ? labels.harmoniaAmistosa : isBusiness ? labels.harmoniaProfissional : labels.harmoniaEstelar, percent: scoreBase },
      { label: isFriend ? labels.lealdadeMutua : isBusiness ? labels.eficienciaMetas : labels.estabilidade, percent: Math.min(100, scoreBase + 11) },
      { label: isFriend ? labels.entrosamentoSocial : isBusiness ? labels.sinergiaFiduciaria : labels.resilienciaCivil, percent: Math.min(100, scoreBase + 6) },
      { label: isFriend ? labels.conflitosMenores : isBusiness ? labels.conflitoEgos : labels.conflitos, percent: Math.round(Math.abs(100 - scoreBase) * 0.7) },
      { label: labels.afinidadeGeral, percent: scoreBase }
    ],
    transitosAtuais: {
      title: isFriend ? labels.transitosTitleFriend : isBusiness ? labels.transitosTitleBusiness : labels.transitosTitleFallback,
      data: dateObj.toLocaleDateString(currentLocale),
      hora: dateObj.toLocaleTimeString(currentLocale),
      fuso: fusoText,
      atualizacao: formattedUpdate,
      influencia: {
        pt: `Neste momento, trânsitos favoráveis de Saturno em ${tSaturn1} atuam blindando decisões de longo prazo e organizando caminhos prósperos.`,
        en: `At this moment, favorable transits of Saturn in ${tSaturn1} act to shield long-term decisions and organize prosperous paths.`,
        es: `En este momento, tránsitos favorables de Saturno en ${tSaturn1} actúan protegiendo decisiones de largo plazo y organizando caminos prósperos.`,
        de: `In diesem Moment wirken günstige Transite des Saturns in ${tSaturn1}, um langfristige Entscheidungen zu schützen und wohlhabende Wege zu organisieren.`,
        fr: `En ce moment, des transits favorables de Saturne en ${tSaturn1} agissent pour protéger les décisions à long terme et organiser des voies prospères.`
      }[lang]
    },
    calendarioIndicadores: {
      label7Dias: {
        pt: "Fase de alta produtividade. Excelente clima para colocar pendências em ordem.",
        en: "High productivity phase. Excellent atmosphere to sort out pending tasks.",
        es: "Fase de alta productividad. Excelente ambiente para poner al día tareas pendientes.",
        de: "Hochproduktive Phase. Hervorragende Atmosphäre, um ausstehende Aufgaben zu erledigen.",
        fr: "Phase de productivité élevée. Excellente ambiance pour régler les tâches en attente."
      }[lang],
      label30Dias: {
        pt: "Excelente período para realizar auditorias ou planejamento estratégico em conjunto.",
        en: "Excellent period for conducting joint audits or strategic planning.",
        es: "Excelente período para realizar auditorías o planificación estratégica en conjunto.",
        de: "Hervorragende Zeit für gemeinsame Prüfungen oder strategische Planungen.",
        fr: "Excellente période pour mener des audits conjoints ou une planification stratégique."
      }[lang],
      label3Meses: {
        pt: "Maturidade e solidez. O trânsito de Saturno atua promovendo segurança e contratos sérios.",
        en: "Maturity and solidity. Saturn's transit promotes security and serious contracts.",
        es: "Madurez y solidez. El tránsito de Saturno promueve seguridad y contratos serios.",
        de: "Reife und Solidität. Der Transit des Saturns fördert Sicherheit und ernsthafte Verträge.",
        fr: "Maturité et solidité. Le transit de Saturne favorise la sécurité et les contrats sérieux."
      }[lang],
      label6Meses: {
        pt: "Plena colheita material e consolidação financeira de ações conjuntas.",
        en: "Full material harvest and financial consolidation of joint actions.",
        es: "Plena cosecha material y consolidación financiera de acciones conjuntas.",
        de: "Volle materielle Ernte und finanzielle Konsolidierung gemeinsamer Aktionen.",
        fr: "Pleine récolte matérielle et consolidation financière des actions conjointes."
      }[lang],
      label1Ano: {
        pt: "Grandes auspícios para consolidar legado e faturamento constante de longo prazo.",
        en: "Great auspices to consolidate legacy and steady long-term faturamento.",
        es: "Grandes auspicios para consolidar legado y facturación constante a largo plazo.",
        de: "Großartige Vorzeichen zur Festigung des Vermächtnisses und stetiger langfristiger Einnahmen.",
        fr: "Grands auspices pour consolider l'héritage et des revenus constants à long terme."
      }[lang]
    },
    diasFavoraveisItems: [
      { icon: "💼", category: { pt: "Negócios", en: "Business", es: "Negocios", de: "Geschäft", fr: "Affaires" }[lang], description: { pt: "Foco tático e solidez de papéis comerciais.", en: "Tactical focus and stability in commercial papers.", es: "Enfoque táctico y solidez en documentos comerciales.", de: "Taktischer Fokus und Stabilität bei Handelspapieren.", fr: "Focus tactique et solidité des documents commerciaux." }[lang] }
    ],
    diasAtencaoItems: [
      { category: { pt: "Prazos", en: "Deadlines", es: "Plazos", de: "Fristen", fr: "Délais" }[lang], description: { pt: "Revise detalhes finos em relatórios operacionais.", en: "Review fine details in operational reports.", es: "Revise detalles finos en informes operativos.", de: "Überprüfen Sie feine Details in operativen Berichten.", fr: "Examinez les détails précis dans les rapports opérationnels." }[lang] }
    ],
    visaoLongoPrazoItems: [
      { category: { pt: "Estabilidade", en: "Stability", es: "Estabilidad", de: "Stabilität", fr: "Stabilité" }[lang], description: { pt: `Base forte guiada pela maturidade de Saturno em ${tSaturn1}.`, en: `Strong base guided by Saturn's maturity in ${tSaturn1}.`, es: `Base fuerte guiada por la madurez de Saturno en ${tSaturn1}.`, de: `Starkes Fundament, geleitet von Saturns Reife in ${tSaturn1}.`, fr: `Base solide guidée par la maturité de Saturne en ${tSaturn1}.` }[lang] }
    ],
    pontosOcultosItems: [
      { category: { pt: "Transformação", en: "Transformation", es: "Transformación", de: "Transformation", fr: "Transformation" }[lang], description: { pt: "Desenvolver tolerância mútua em rotinas cansativas.", en: "Develop mutual tolerance in tiring routines.", es: "Desarrollar tolerancia mutua en rutinas agotadoras.", de: "Gegenseitige Toleranz in anstrengenden Routinen entwickeln.", fr: "Développer une tolérance mutuelle dans les routines fatigantes." }[lang] }
    ],
    inteligenciaRelacionamento: {
      oQueFazer: {
        pt: ["Definir metas semanais com prazos exatos.", "Manter acordos de forma transparente."],
        en: ["Define weekly goals with exact deadlines.", "Maintain agreements transparently."],
        es: ["Definir metas semanales con plazos exactos.", "Mantener acuerdos de forma transparente."],
        de: ["Wöchentliche Ziele mit genauen Fristen definieren.", "Vereinbarungen transparent einhalten."],
        fr: ["Définir des objectifs hebdomadaires avec des délais précis.", "Maintenir les accords de manière transparente."]
      }[lang],
      oQueEvitar: {
        pt: ["Decisões baseadas em impulsos emocionais temporários.", "Críticas excessivas de desempenho em público."],
        en: ["Decisions based on temporary emotional impulses.", "Excessive performance criticism in public."],
        es: ["Decisiones basadas en impulsos emocionales temporales.", "Críticas excesivas de desempeño en público."],
        de: ["Entscheidungen basierend auf vorübergehenden emotionalen Impulsen.", "Übermäßige Leistungskritik in der Öffentlichkeit."],
        fr: ["Décisions basées sur des impulsions émotionnelles temporaires.", "Critiques excessives de performance en public."]
      }[lang],
      melhorarComunicacao: {
        pt: "Apresentar dados de forma clara, didática e serena.",
        en: "Present data clearly, didactically, and calmly.",
        es: "Presentar datos de forma clara, didáctica y serena.",
        de: "Präsentieren Sie Daten klar, didaktisch und ruhig.",
        fr: "Présenter les données de manière claire, didactique et sereine."
      }[lang],
      reduzirConflitos: {
        pt: "Divisão territorial exata de tarefas para evitar choques.",
        en: "Exact division of tasks to avoid clashes.",
        es: "División territorial exacta de tareas para evitar choques.",
        de: "Genaue Aufgabenaufteilung zur Vermeidung von Konflikten.",
        fr: "Répartition précise des tâches pour éviter les conflits."
      }[lang],
      fortalecerConexao: {
        pt: "Celebrar metas concluídas com agradecimentos sinceros.",
        en: "Celebrate completed goals with sincere thanks.",
        es: "Celebrar metas concluidas con agradecimientos sinceros.",
        de: "Erreichte Ziele mit aufrichtigem Dank feiern.",
        fr: "Célébrer les objectifs atteints avec des remerciements sincères."
      }[lang]
    }
  };
}
