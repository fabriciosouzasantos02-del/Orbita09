import { Language } from './types';
import { tarotTranslations as legacyTarotTranslations } from './tarot';

/**
 * Canonical Tarot dictionary.
 *
 * The legacy tarot.ts remains the source of existing translations while this
 * module exposes only semantic IDs to the application. This lets the UI stop
 * depending on Portuguese sentences as translation keys without losing the
 * existing translated copy during migration.
 */
const semanticToLegacy: Record<string, string> = {
  shuffleSacredCards: 'Embaralhando as lâminas sagradas...',
  focusQuestion: 'Mentalize sua pergunta antes de virar as cartas',
  readingInterpretedByAI: 'Sua consulta de tarot foi interpretada por IA!',
  consultTarotOracle: 'Consultar Oráculo de Tarot',
  revealThreeCards: 'Vire as três cartas para revelar a leitura',
  card: 'Carta',
  cards: 'Cartas',
  arcana: 'Arcano',
  meaning: 'Significado',
  position: 'Posição',
  cosmicAdvice: 'Conselho Cósmico',
  hiddenTempleAncestralWisdom: 'Templo Oculto de Orbia • Sabedoria Ancestral',
  realTarotReaderExperience: 'Tarot Taróloga de Verdade',
  livingCounselDescription: 'Conselhos vivos e canalizações profundas sobre sua vida amorosa, trabalho, relacionamentos e blindagem contra mal olhado e invejas. Uma experiência sensitiva realista inspirada em consultas presenciais.',
  celestialTuner: 'SINTONIZADOR CELESTE',
  activeRealTarot: 'Ativo • Orbia Tarot Real',
  mainHighlight: 'DESTAQUE PRINCIPAL',
  deepWeeklyTarot: '✨ Tarot Semanal Profundo',
  deepWeeklyDescription: 'Tiragem de 10 Cartas com leitura espiritual completa de trânsitos, invejas e trabalho. Uma consulta por semana.',
  intelligentTarot: 'Tarot Inteligente',
  intelligentTarotDescription: 'Conselhos e tiragens mágicas unindo tecnologia espiritual planetária.',
  loveTarot: 'Tarot do Amor',
  loveTarotDescription: 'Conselhos dos caminhos afetivos para os assuntos e angústias amorosas.',
  traditionalTarot: 'Tarot Tradicional',
  traditionalTarotDescription: 'Tiragens clássicas para aconselhamentos rápidos dos Arcanos Maiores.',
  deepWeeklySpread: 'Tiragem Profunda Semanal (10 Cartas)',
  intelligentTarotReading: 'Sua Consulta de Tarot Inteligente',
  loveTarotReading: 'Sua Consulta de Tarot do Amor',
  traditionalTarotReading: 'Sua Consulta de Tarot Tradicional',
  weeklyLimit: 'Limite: 1x por semana',
  dailyLimit: 'Limite: 1x por dia',
  weeklyPortalClosed: 'Portal Semanal Fechado',
  consecratedEnergiesPreserved: 'Energias Consagradas Conservadas',
  deepWeeklySundayRule: 'O Tarot Semanal Profundo só pode ser jogado aos domingos para captar a vibração cósmica inicial da semana. Caso você não tenha jogado no último domingo, sintonize-se no próximo ciclo solar de domingo.',
  dailyReadingAlreadyDone: 'Você já realizou sua tiragem nesta sessão hoje! O tarot é uma ferramenta de reflexão espiritual profunda. Sorteios frequentes tumultuam o fluxo de sintonização sutil dos arcanos.',
  nextAttunementAvailable: 'Sua próxima sintonização estará disponível no:',
  nextReadingAvailable: 'Sua próxima leitura nesta sessão estará liberada em estimadamente:',
  nextSunday: 'Próximo Domingo',
  at: 'às',
  atMidnight: 'À meia-noite',
  tomorrow: 'amanhã',
  rereadingAvailable: 'RE-LEITURA DO CONSELHO ATUAL JÁ DISPONÍVEL ABAIXO',
  centralSelfKnowledgeQuestion: 'Qual sua questão central de autoconhecimento hoje?',
  professionalPathExample: 'Ex: Qual caminho profissional devo trilhar nesta transição complicada de Saturno?',
  orbiaEphemerisResponse: 'Orbia unirá a efeméride às cartas para formular uma resposta de taróloga real sobre tramas cotidianas, energias e focos.',
  chooseDeepRomanticQuestion: 'Escolha uma questão romântica profunda:',
  loveFutureQuestion: 'Como será meu futuro amoroso nos próximos meses?',
  feelingsQuestion: 'O que ele/ela realmente sente por mim neste ciclo?',
  healHeartQuestion: 'Qual o melhor conselho de Orbia para curar meu coração agora?',
  relationshipProtectionQuestion: 'Como posso me proteger de invejas ou fofocas na relação?',
  customLoveQuestion: 'Quero escrever uma pergunta personalizada de amor...',
  loveQuestionLabel: 'Sua pergunta afetiva:',
  loveProtectionExample: 'Ex: Como posso abrir meu coração novamente e me blindar de energias pesadas?',
  chooseClassicSpread: 'Escolha o formato de tiragem clássica:',
  singleCardAdvice: 'Carta Única (Aconselhamento Exato)',
  fullJourney: 'Caminho Completo (Passado, Presente e Futuro)',
  fullTimelinePrediction: 'A PREVISÃO COMPLETA DE SUA LINHA DO TEMPO',
  deepReadingDescription: 'Essa leitura profunda sacará 10 cartas do oráculo. Orbia analisará cada influenciador crucial para seu destino nos próximos 7 dias: sua atitude, finanças, trabalho, o romance sutil, medos, conselho de oração de alma e barreiras de mal olhado ou inveja no ambiente laboral e familiar. Sintonize suas intenções antes de sortear.',
  consecratingDeck: 'Consagrando Deck de Cartas...',
  openHiddenTempleDeck: 'Abra o Deck do Templo Oculto',
  attuning: 'Sintonizando:',
  of: 'de',
  cardsDrawn: 'cartas sorteadas',
  changeQuestions: 'Mudar Perguntas',
  faceDownChoice: 'Toque nas cartas de costas para realizar sua escolha intuitiva:',
  specialCard: 'Carta Especial',
  fullChosenCardsList: '📋 Listagem Completa de Cartas Escolhidas por Inteligência Espiritual:',
  currentMoment: '1. Seu Momento Atual',
  mainChallenge: '2. O Grande Desafio',
  consciousStrength: '3. Força Consciente',
  hiddenSubconscious: '4. Subconsciente Oculto',
  recentPast: '5. Passado Recente',
  nearFuture: '6. Futuro Próximo',
  innerAttitude: '7. Atitude Interior',
  externalFactorsEnvironment: '8. Fatores Externos/Ambiente',
  hopesFearsEnvy: '9. Esperanças, Medos e Invejas',
  alchemicalOutcome: '10. Resultado Alquímico',
  influence: 'Influência',
  practicalMeaning: 'Significado Prático:',
  yourAdvice: 'Seu conselho:',
  channelingAI: 'Canalizando Interpretação Real de Orbia por IA...',
  revealHumanReading: 'Revelar Leitura Humana da Taróloga Real',
  realOrbiaChanneling: 'Canalização Real da Taróloga Orbia',
  activeSession: 'Sessão Ativa',
  sacredProtectionDecree: 'Decreto Sagrado de Proteção & Alinhamento Semanal:',
  dynamicMirrorReminder: 'Lembre-se que o Tarot é um espelho dinâmico. Essa consulta foi consagrada para reestruturar seu dia/semana. Suas decisões livres e orações de blindagem formam a linha do tempo do seu amanhã com soberania.',
  viewNewReading: 'Visualizar Nova Tiragem',
  howTarotWorks: 'Como o Tarot funciona?',
  hello: 'Olá',
  responsibleSelfKnowledge: 'Lembre-se de que o Tarot é uma ferramenta de autoconhecimento que deve ser usada com responsabilidade, quando você precisar se conectar mais profundamente com as forças que regem o universo.',
  consultationGuidance: 'Fazer uma consulta trará revelações que poderão influenciar a linha do tempo de sua vida, portanto, reflita sobre o que lhe foi transmitido de forma intuitiva mas ao mesmo tempo consciente. A carta escolhida é a que possui mais afinidade com o seu momento ou pergunta e traz a orientação mais apropriada. Mesmo que você não receba a resposta que gostaria, não é recomendado repetir a consulta no mesmo instante. Releia o conteúdo da carta e reflita sobre a mensagem que lhe foi transmitida, pois é a que traz o melhor conselho para você agora.',
  tarotSoulMirror: 'Saiba que o Tarot é um espelho da nossa alma e reflete todo o espectro da experiência humana através de arquétipos. É uma das conexões mais antigas entre os seres humanos e as divindades, tendo o papel de nos aproximar de algo superior. Seu estudo representa uma viagem de descoberta interior, onde passamos a conhecer melhor a nós mesmos e o atual momento o qual estamos inseridos. É um oráculo que caminha lado a lado com a astrologia e a alquimia, onde em suas cartas há uma correspondência alquímica, um signo astrológico e um número para cada arquétipo. As cartas podem ser consideradas uma jornada que nos ajuda a obter uma melhor compreensão do passado, presente e futuro.',
  sacredAstrologicalWisdom: 'Sabedoria Astrológica Sagrada',
  dailyAlchemicalAdvice: 'Conselho Alquímico do Dia',
  lunarAdvice: 'Não apresse os eventos sagrados do amanhã. A energia da Lua lembra que as ilusões e a inveja de terceiros se dissipam na névoa quando nos fechamos em orações e tomamos banho de sálvia ou arruda.',
  sageSilver: 'Sálvia & Prata',
  activeSmudging: 'Defumação Activa',
  cups: 'Copas',
  wands: 'Paus',
  swords: 'Espadas',
  pentacles: 'Ouros',
  classicAdviceSpread: 'Tiragem Clássica de Conselho',
  pastPresentFutureSpread: 'Tiragem Passado, Presente e Futuro',
  grandWeeklyConsecration: 'Grande Consagração Semanal dos 10 Arcanos Ancestrais',
  dear: 'Querido(a)',
  emotionalWeightAdvice: 'as cartas indicam que você passa por um momento de grande peso emocional. Atente-se contra fofocas ou sentimentos invejosos no ambiente laboral e convívio cotidiano. Faça uma oração sincera de blindagem e limpe velhos apegos.',
  cosmicLoveAdvice: 'Sinto que o amor cósmico cura suas dores. Consagre seu dia e confie no mistério.'
};

const corrections: Partial<Record<Language, Record<string, string>>> = {
  en: {
    tarotDescription: 'Tarot is a mirror of our soul and reflects the entire spectrum of human experience through archetypes. Use it to gain a better understanding of the past, present, and future.',
    tarotStudy: 'Tarot walks hand in hand with astrology and alchemy, where each card has an alchemical correspondence, an astrological sign, and a number for each archetype.'
  },
  es: {
    deepWeeklyDescription: 'Tirada de 10 Cartas con una lectura espiritual completa de los tránsitos, la envidia y el trabajo. Una consulta por semana.'
  },
  de: {
    realTarotReaderExperience: 'Erlebnis einer echten Tarot-Lesung',
    activeRealTarot: 'Aktiv • Echtes Orbia-Tarot',
    cardsDrawn: 'gezogene Karten',
    channelingAI: 'Orbías echte KI-Interpretation wird kanalisiert...',
    viewNewReading: 'Neue Legung anzeigen',
    tarotSoulMirror: 'Wisse, dass das Tarot ein Spiegel unserer Seele ist und das gesamte Spektrum der menschlichen Erfahrung durch Archetypen widerspiegelt. Es ist eine der ältesten Verbindungen zwischen Menschen und Gottheiten, die uns einem höheren Wesen näher bringen soll. Seine Untersuchung stellt eine Reise der inneren Entdeckung dar, bei der wir uns selbst und den gegenwärtigen Moment, in dem wir uns befinden, besser kennenlernen. Es ist ein Orakel, das Hand in Hand mit Astrologie und Alchemie geht, wobei auf seinen Karten für jeden Archetypen eine alchemistische Entsprechung, ein astrologisches Zeichen und eine Zahl angegeben sind. Die Karten können als eine Reise betrachtet werden, die uns hilft, die Vergangenheit, Gegenwart und Zukunft besser zu verstehen.'
  },
  fr: {
    tarotDescription: "Le Tarot est un miroir de notre âme et reflète tout le spectre de l'expérience humaine à travers des archétypes. Utilisez-le pour mieux comprendre le passé, le présent et le futur.",
    livingCounselDescription: "Conseils vivants et canalisations profondes sur votre vie amoureuse, votre travail et vos relations, ainsi qu'une protection contre le mauvais œil et la jalousie. Une expérience intuitive réaliste inspirée de consultations en personne.",
    dynamicMirrorReminder: 'Rappelez-vous que le Tarot est un miroir dynamique. Cette consultation a été consacrée à restructurer votre journée/semaine. Vos décisions libres et vos prières de protection façonnent la ligne temporelle de votre lendemain avec souveraineté.',
    consultationGuidance: "Une consultation apportera des révélations susceptibles d'influencer la ligne temporelle de votre vie. Réfléchissez donc à ce qui vous a été transmis de manière intuitive et consciente. La carte choisie est celle qui a le plus d'affinité avec votre moment ou votre question et apporte l'orientation la plus appropriée. Même si vous ne recevez pas la réponse souhaitée, il n'est pas recommandé de répéter le tirage immédiatement. Relisez le contenu de la carte et réfléchissez au message transmis, car il apporte le meilleur conseil pour vous en ce moment.",
    lunarAdvice: "Ne précipitez pas les événements sacrés de demain. L’énergie de la Lune rappelle que les illusions et la jalousie de tiers se dissipent dans le brouillard lorsque nous nous réfugions dans la prière et prenons un bain de sauge ou de rue.",
    tarotSoulMirror: "Sachez que le Tarot est un miroir de notre âme et reflète tout le spectre de l'expérience humaine à travers des archétypes. C'est l'une des connexions les plus anciennes entre les êtres humains et les divinités, ayant pour rôle de nous rapprocher de quelque chose de supérieur. Son étude représente un voyage de découverte intérieure, où nous apprenons à mieux nous connaître nous-mêmes et le moment actuel dans lequel nous sommes insérés. C'est un oracle qui marche main dans la main avec l'astrologie et l'alchimie, où dans ses cartes il y a une correspondance alchimique, un signe astrologique et un nombre pour chaque archétype. Les cartes peuvent être considérées comme un voyage qui nous aide à obtenir une meilleure compréhension du passé, du présent et du futur."
  }
};

export const tarotSemanticTranslations: Record<Language, Record<string, string>> = {
  pt: {}, en: {}, es: {}, de: {}, fr: {}
};

const languages: Language[] = ['pt', 'en', 'es', 'de', 'fr'];

for (const lang of languages) {
  for (const [semanticId, legacyKey] of Object.entries(semanticToLegacy)) {
    const value = legacyTarotTranslations[lang]?.[legacyKey];
    if (typeof value === 'string' && value.trim()) {
      tarotSemanticTranslations[lang][semanticId] = value;
    }
  }

  for (const key of ['tarotWelcome', 'tarotDescription', 'drawCards', 'tarotStudy', 'readingPast', 'readingPresent', 'readingFuture']) {
    const value = legacyTarotTranslations[lang]?.[key];
    if (typeof value === 'string' && value.trim()) tarotSemanticTranslations[lang][key] = value;
  }

  Object.assign(tarotSemanticTranslations[lang], corrections[lang] || {});
}

export const tarotSemanticKeyMap = semanticToLegacy;
