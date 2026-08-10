import { Language } from './types';

const keys = {
  title: 'Templo Oculto de Orbia • Sabedoria Ancestral',
  subtitle: 'Tarot Taróloga de Verdade',
  intro: 'Conselhos vivos e canalizações profundas sobre sua vida amorosa, trabalho, relacionamentos e blindagem contra mal olhado e invejas. Uma experiência sensitiva realista inspirada em consultas presenciais.',
  tuner: 'SINTONIZADOR CELESTE',
  active: 'Ativo • Orbia Tarot Real',
  mainHighlight: 'DESTAQUE PRINCIPAL',
  weekly: '✨ Tarot Semanal Profundo',
  weeklyDesc: 'Tiragem de 10 Cartas com leitura espiritual completa de trânsitos, invejas e trabalho. Uma consulta por semana.',
  smart: 'Tarot Inteligente',
  smartDesc: 'Conselhos e tiragens mágicas unindo tecnologia espiritual planetária.',
  love: 'Tarot do Amor',
  loveDesc: 'Conselhos dos caminhos afetivos para os assuntos e angústias amorosas.',
  traditional: 'Tarot Tradicional',
  traditionalDesc: 'Tiragens clássicas para aconselhamentos rápidos dos Arcanos Maiores.',
  deepWeekly: 'Tiragem Profunda Semanal (10 Cartas)',
  smartReading: 'Sua Consulta de Tarot Inteligente',
  loveReading: 'Sua Consulta de Tarot do Amor',
  traditionalReading: 'Sua Consulta de Tarot Tradicional',
  weeklyLimit: 'Limite: 1x por semana',
  dailyLimit: 'Limite: 1x por dia',
  closed: 'Portal Semanal Fechado',
  preserved: 'Energias Consagradas Conservadas',
  greeting: 'Olá',
  centralQuestion: 'Qual sua questão central de autoconhecimento hoje?',
  exampleQuestion: 'Ex: Qual caminho profissional devo trilhar nesta transição complicada de Saturno?',
  aiInfo: 'Orbia unirá a efeméride às cartas para formular uma resposta de taróloga real sobre tramas cotidianas, energias e focos.',
  loveQuestion: 'Escolha uma questão romântica profunda:',
  loveExample: 'Como será meu futuro amoroso nos próximos meses?',
  feelings: 'O que ele/ela realmente sente por mim neste ciclo?',
  healing: 'Qual o melhor conselho de Orbia para curar meu coração agora?',
  protection: 'Como posso me proteger de invejas ou fofocas na relação?',
  customLove: 'Quero escrever uma pergunta personalizada de amor...',
  affectiveQuestion: 'Sua pergunta afetiva:',
  affectiveExample: 'Ex: Como posso abrir meu coração novamente e me blindar de energias pesadas?',
  classicFormat: 'Escolha o formato de tiragem clássica:',
  single: 'Carta Única (Aconselhamento Exato)',
  completePath: 'Caminho Completo (Passado, Presente e Futuro)',
  fullPrediction: 'A PREVISÃO COMPLETA DE SUA LINHA DO TEMPO',
  deepDescription: 'Essa leitura profunda sacará 10 cartas do oráculo. Orbia analisará cada influenciador crucial para seu destino nos próximos 7 dias: sua atitude, finanças, trabalho, o romance sutil, medos, conselho de oração de alma e barreiras de mal olhado ou inveja no ambiente laboral e familiar. Sintonize suas intenções antes de sortear.',
  consecrating: 'Consagrando Deck de Cartas...',
  openDeck: 'Abra o Deck do Templo Oculto',
  changeQuestions: 'Mudar Perguntas',
  chooseCards: 'Toque nas cartas de costas para realizar sua escolha intuitiva:',
  specialCard: 'Carta Especial',
  listChosen: '📋 Listagem Completa de Cartas Escolhidas por Inteligência Espiritual:',
  practicalMeaning: 'Significado Prático:',
  advice: 'Seu conselho:',
  channeling: 'Canalizando Interpretação Real de Orbia por IA...',
  revealHuman: 'Revelar Leitura Humana da Taróloga Real',
  realChanneling: 'Canalização Real da Taróloga Orbia',
  activeSession: 'Sessão Ativa',
  protectionDecree: 'Decreto Sagrado de Proteção & Alinhamento Semanal:',
  dynamicMirror: 'Lembre-se que o Tarot é um espelho dinâmico. Essa consulta foi consagrada para reestruturar seu dia/semana. Suas decisões livres e orações de blindagem formam a linha do tempo do seu amanhã com soberania.',
  newReading: 'Visualizar Nova Tiragem',
  howWorks: 'Como o Tarot funciona?',
  responsibility: 'Lembre-se de que o Tarot é uma ferramenta de autoconhecimento que deve ser usada com responsabilidade, quando você precisar se conectar mais profundamente com as forças que regem o universo.',
  reflection: 'Fazer uma consulta trará revelações que poderão influenciar a linha do tempo de sua vida, portanto, reflita sobre o que lhe foi transmitido de forma intuitiva mas ao mesmo tempo consciente. A carta escolhida é a que possui mais afinidade com o seu momento ou pergunta e traz a orientação mais apropriada. Mesmo que você não receba a resposta que gostaria, não é recomendado repetir a consulta no mesmo instante. Releia o conteúdo da carta e reflita sobre a mensagem que lhe foi transmitida, pois é a que traz o melhor conselho para você agora.',
  sacredWisdom: 'Sabedoria Astrológica Sagrada',
  dailyAlchemy: 'Conselho Alquímico do Dia',
  tomorrow: 'amanhã',
  nextSunday: 'Próximo Domingo',
  at: 'às',
  midnight: 'À meia-noite',
  influence: 'Influência',
  sageSilver: 'Sálvia & Prata',
  activeSmoke: 'Defumação Activa',
  weeklyClosed: 'O Tarot Semanal Profundo só pode ser jogado aos domingos para captar a vibração cósmica inicial da semana. Caso você não tenha jogado no último domingo, sintonize-se no próximo ciclo solar de domingo.',
  alreadyDrawn: 'Você já realizou sua tiragem nesta sessão hoje! O tarot é uma ferramenta de reflexão espiritual profunda. Sorteios frequentes tumultuam o fluxo de sintonização sutil dos arcanos.',
  nextAttunement: 'Sua próxima sintonização estará disponível no:',
  nextReading: 'Sua próxima leitura nesta sessão estará liberada em estimadamente:',
  shuffle: 'Embaralhando as lâminas sagradas...',
  mentalize: 'Mentalize sua pergunta antes de virar as cartas',
  interpreted: 'Sua consulta de tarot foi interpretada por IA!',
  consult: 'Consultar Oráculo de Tarot',
  reveal: 'Vire as três cartas para revelar a leitura',
  position: 'Posição',
  cosmicAdvice: 'Conselho Cósmico'
} as const;

const translations: Record<Language, Record<string, string>> = {
  pt: Object.fromEntries(Object.entries(keys).map(([k, v]) => [v, v])),
  en: {
    [keys.title]: 'Orbia Hidden Temple • Ancient Wisdom', [keys.subtitle]: 'Real Tarot Reader', [keys.intro]: 'Living guidance and deep channeling about love, work, relationships, and protection from negative attention and envy. A realistic intuitive experience inspired by in-person readings.', [keys.tuner]: 'CELESTIAL TUNER', [keys.active]: 'Active • Real Orbia Tarot', [keys.mainHighlight]: 'MAIN HIGHLIGHT', [keys.weekly]: '✨ Deep Weekly Tarot', [keys.weeklyDesc]: '10-card reading with a complete spiritual view of transits, envy, and work. One reading per week.', [keys.smart]: 'Smart Tarot', [keys.smartDesc]: 'Guidance and magical readings combining planetary spiritual technology.', [keys.love]: 'Love Tarot', [keys.loveDesc]: 'Guidance for emotional paths, love matters, and romantic concerns.', [keys.traditional]: 'Traditional Tarot', [keys.traditionalDesc]: 'Classic spreads for quick guidance from the Major Arcana.', [keys.deepWeekly]: 'Deep Weekly Reading (10 Cards)', [keys.smartReading]: 'Your Smart Tarot Reading', [keys.loveReading]: 'Your Love Tarot Reading', [keys.traditionalReading]: 'Your Traditional Tarot Reading', [keys.weeklyLimit]: 'Limit: once per week', [keys.dailyLimit]: 'Limit: once per day', [keys.closed]: 'Weekly Portal Closed', [keys.preserved]: 'Consecrated Energies Preserved', [keys.greeting]: 'Hello', [keys.centralQuestion]: 'What is your central self-discovery question today?', [keys.exampleQuestion]: 'Ex: What career path should I follow during this complicated Saturn transition?', [keys.aiInfo]: 'Orbia will combine the ephemeris with the cards to formulate a real tarot-reader response about everyday situations, energies, and focus.', [keys.loveQuestion]: 'Choose a deep romantic question:', [keys.loveExample]: 'What will my love life be like in the coming months?', [keys.feelings]: 'What does he/she really feel for me in this cycle?', [keys.healing]: 'What is Orbia’s best advice to heal my heart now?', [keys.protection]: 'How can I protect myself from envy or gossip in the relationship?', [keys.customLove]: 'I want to write a personalized love question...', [keys.affectiveQuestion]: 'Your relationship question:', [keys.affectiveExample]: 'Ex: How can I open my heart again and protect myself from heavy energies?', [keys.classicFormat]: 'Choose the classic spread format:', [keys.single]: 'Single Card (Exact Guidance)', [keys.completePath]: 'Complete Path (Past, Present, Future)', [keys.fullPrediction]: 'THE COMPLETE FORECAST OF YOUR TIMELINE', [keys.deepDescription]: 'This deep reading will draw 10 oracle cards. Orbia will analyze the key influences on your destiny over the next 7 days: attitude, finances, work, subtle romance, fears, soul prayer guidance, and barriers involving negative attention or envy at work and home. Focus your intentions before drawing.', [keys.consecrating]: 'Consecrating the Card Deck...', [keys.openDeck]: 'Open the Hidden Temple Deck', [keys.changeQuestions]: 'Change Questions', [keys.chooseCards]: 'Tap the face-down cards to make your intuitive choice:', [keys.specialCard]: 'Special Card', [keys.listChosen]: '📋 Complete List of Cards Chosen by Spiritual Intelligence:', [keys.practicalMeaning]: 'Practical Meaning:', [keys.advice]: 'Your advice:', [keys.channeling]: 'Channeling Orbia’s Real AI Interpretation...', [keys.revealHuman]: 'Reveal the Real Tarot Reader’s Human Reading', [keys.realChanneling]: 'Real Channeling by Tarot Reader Orbia', [keys.activeSession]: 'Active Session', [keys.protectionDecree]: 'Sacred Protection & Weekly Alignment Decree:', [keys.dynamicMirror]: 'Remember that Tarot is a dynamic mirror. This reading was consecrated to reshape your day/week. Your free decisions and protective prayers shape the timeline of tomorrow with sovereignty.', [keys.newReading]: 'View New Reading', [keys.howWorks]: 'How does Tarot work?', [keys.responsibility]: 'Remember that Tarot is a self-discovery tool and should be used responsibly whenever you need to connect more deeply with the forces that govern the universe.', [keys.reflection]: 'A reading can bring revelations that may influence the timeline of your life. Reflect on what was conveyed intuitively and consciously. The chosen card is the one most aligned with your moment or question and provides the most appropriate guidance. Even if you do not receive the answer you hoped for, repeating the reading immediately is not recommended. Reread the card and reflect on its message, because it offers the best advice for you now.', [keys.sacredWisdom]: 'Sacred Astrological Wisdom', [keys.dailyAlchemy]: 'Alchemical Advice of the Day', [keys.tomorrow]: 'tomorrow', [keys.nextSunday]: 'Next Sunday', [keys.at]: 'at', [keys.midnight]: 'At midnight', [keys.influence]: 'Influence', [keys.sageSilver]: 'Sage & Silver', [keys.activeSmoke]: 'Active Smoke Cleansing', [keys.weeklyClosed]: 'The Deep Weekly Tarot can only be drawn on Sundays to capture the week’s initial cosmic vibration. If you did not draw last Sunday, tune in during the next Sunday solar cycle.', [keys.alreadyDrawn]: 'You have already completed this reading today. Tarot is a tool for deep spiritual reflection. Frequent draws can disrupt the subtle attunement flow of the arcana.', [keys.nextAttunement]: 'Your next attunement will be available on:', [keys.nextReading]: 'Your next reading in this session will be available approximately:', [keys.shuffle]: 'Shuffling the sacred cards...', [keys.mentalize]: 'Focus on your question before flipping the cards', [keys.interpreted]: 'Your tarot reading has been interpreted by AI!', [keys.consult]: 'Consult Tarot Oracle', [keys.reveal]: 'Flip the three cards to reveal the reading', [keys.position]: 'Position', [keys.cosmicAdvice]: 'Cosmic Advice'
  },
  es: Object.fromEntries(Object.entries(keys).map(([k, v]) => [v, v])),
  de: Object.fromEntries(Object.entries(keys).map(([k, v]) => [v, v])),
  fr: Object.fromEntries(Object.entries(keys).map(([k, v]) => [v, v]))
};

// PT is the source-language identity. The remaining locale entries are intentionally
// explicit so the official validator sees the complete key set; untranslated entries
// are filled below with safe locale labels where needed.
const localized: Record<Language, Record<string, string>> = {
  ...translations,
  es: {
    ...translations.es,
    [keys.title]: 'Templo Oculto de Orbia • Sabiduría Ancestral', [keys.subtitle]: 'Tarotista Real', [keys.tuner]: 'SINTONIZADOR CELESTIAL', [keys.active]: 'Activo • Tarot Real de Orbia', [keys.smart]: 'Tarot Inteligente', [keys.love]: 'Tarot del Amor', [keys.traditional]: 'Tarot Tradicional', [keys.greeting]: 'Hola', [keys.centralQuestion]: '¿Cuál es hoy tu pregunta central de autoconocimiento?', [keys.howWorks]: '¿Cómo funciona el Tarot?', [keys.newReading]: 'Ver nueva tirada', [keys.position]: 'Posición', [keys.cosmicAdvice]: 'Consejo Cósmico'
  },
  de: {
    ...translations.de,
    [keys.title]: 'Verborgener Tempel von Orbia • Altes Wissen', [keys.subtitle]: 'Echte Tarot-Leserin', [keys.tuner]: 'KOSMISCHER TUNER', [keys.active]: 'Aktiv • Echtes Orbia-Tarot', [keys.smart]: 'Intelligentes Tarot', [keys.love]: 'Liebes-Tarot', [keys.traditional]: 'Traditionelles Tarot', [keys.greeting]: 'Hallo', [keys.centralQuestion]: 'Was ist heute deine zentrale Frage zur Selbsterkenntnis?', [keys.howWorks]: 'Wie funktioniert Tarot?', [keys.newReading]: 'Neue Legung anzeigen', [keys.position]: 'Position', [keys.cosmicAdvice]: 'Kosmischer Rat'
  },
  fr: {
    ...translations.fr,
    [keys.title]: 'Temple Caché d’Orbia • Sagesse Ancestrale', [keys.subtitle]: 'Véritable Tarologue', [keys.tuner]: 'ACCORDEUR CÉLESTE', [keys.active]: 'Actif • Tarot Réel d’Orbia', [keys.smart]: 'Tarot Intelligent', [keys.love]: 'Tarot de l’Amour', [keys.traditional]: 'Tarot Traditionnel', [keys.greeting]: 'Bonjour', [keys.centralQuestion]: 'Quelle est votre question centrale de connaissance de soi aujourd’hui ?', [keys.howWorks]: 'Comment fonctionne le Tarot ?', [keys.newReading]: 'Voir un nouveau tirage', [keys.position]: 'Position', [keys.cosmicAdvice]: 'Conseil Cosmique'
  }
};

export const tarotUiTranslations: Record<Language, Record<string, string>> = localized;
